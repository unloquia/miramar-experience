'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Configuración
const API_BASE = 'https://api.unloquia.com';
const POLLING_INTERVAL = 5000;
const TYPING_TIMEOUT = 30000;

interface Message {
    id: string;
    role: 'user' | 'bot' | 'agent';
    message: string;
    created_at: string;
}

interface ChatConfig {
    token: string;
    primaryColor?: string;
    botName?: string;
}

export function ChatWidget({ token, primaryColor = '#4F46E5', botName = 'Asistente' }: ChatConfig) {
    const [isOpen, setIsOpen] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Refs para mantener estado en callbacks asincronos
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabaseRef = useRef<any>(null);
    const sessionDataRef = useRef<any>(null);
    const messagesRef = useRef<Message[]>([]); // Mirror para polling
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Scroll al fondo cuando llegan mensajes
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    // Inicialización
    useEffect(() => {
        if (!token) return;

        const initChat = async () => {
            try {
                // 1. Validar Token
                const resp = await fetch(`${API_BASE}/api/landing-tokens/validate/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                if (!resp.ok) throw new Error('Error validando token');
                const config = await resp.json();

                if (!config.valid) throw new Error(config.error || 'Token inválido');

                sessionDataRef.current = config;

                // 2. Inicializar Supabase
                const { supabase_url, supabase_anon_key, session_id } = config.realtime;

                const supabase = createClient(supabase_url, supabase_anon_key, {
                    auth: { persistSession: false },
                    realtime: {
                        headers: { 'apikey': supabase_anon_key }
                    }
                });
                supabaseRef.current = supabase;

                // 3. Cargar mensajes iniciales
                await loadMessages(session_id, supabase);

                // 4. Iniciar Polling
                startPolling(session_id, supabase);

                setIsReady(true);
            } catch (error) {
                console.error('Chat init error:', error);
                toast.error('No se pudo iniciar el chat');
            } finally {
                setIsLoading(false);
            }
        };

        initChat();

        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        };
    }, [token]);

    const loadMessages = async (sessionId: string, supabase: any) => {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('id, role, message, created_at')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (!error && data) {
            // Filtrar duplicados y actualizar
            const uniqueMsgs = filterUniqueMessages(data);
            setMessages(uniqueMsgs);
            messagesRef.current = uniqueMsgs;
        }
    };

    const startPolling = (sessionId: string, supabase: any) => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

        pollingIntervalRef.current = setInterval(async () => {
            // Optimización: Solo poll si la ventana está visible (opcional, aqui lo dejo siempre activo para robustez)
            if (!supabase) return;

            // Buscar mensajes más nuevos que el último que tenemos
            const lastMsg = messagesRef.current[messagesRef.current.length - 1];
            let query = supabase
                .from('chat_messages')
                .select('id, role, message, created_at')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true });

            if (lastMsg) {
                // Safety margin de 10s para relojes desincronizados
                const safetyTime = new Date(new Date(lastMsg.created_at).getTime() - 10000).toISOString();
                query = query.gt('created_at', safetyTime);
            }

            const { data } = await query;

            if (data && data.length > 0) {
                let hasNew = false;
                const currentIds = new Set(messagesRef.current.map(m => m.id));

                const newMessages = data.filter((msg: Message) => !currentIds.has(msg.id));

                if (newMessages.length > 0) {
                    // Tenemos nuevos mensajes REALES
                    // Si viene del bot, apagar typing
                    if (newMessages.some((m: Message) => m.role !== 'user')) {
                        setIsTyping(false);
                    }

                    setMessages(prev => {
                        const updated = [...prev, ...newMessages];
                        // Re-ordenar por si acaso
                        updated.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                        messagesRef.current = updated;
                        return updated;
                    });
                }
            }

        }, POLLING_INTERVAL);
    };

    // Helper para filtrar (usado en load inicial)
    const filterUniqueMessages = (rawMessages: Message[]) => {
        const seen = new Set();
        return rawMessages.filter(m => {
            const duplicate = seen.has(m.id);
            seen.add(m.id);
            return !duplicate;
        });
    };

    const handleSend = async () => {
        if (!inputValue.trim() || !sessionDataRef.current) return;

        const text = inputValue.trim();
        setInputValue('');
        setIsTyping(true); // Feedback inmediato

        // Mensaje optimista
        const tempId = 'temp-' + Date.now();
        const userMsg: Message = {
            id: tempId,
            role: 'user',
            message: text,
            created_at: new Date().toISOString()
        };

        setMessages(prev => {
            const updated = [...prev, userMsg];
            messagesRef.current = updated;
            return updated;
        });

        // Timeout para quitar el "typing" si el bot tarda mucho
        setTimeout(() => setIsTyping(false), TYPING_TIMEOUT);

        try {
            const config = sessionDataRef.current;

            // Preparar headers
            const headers = {
                'Content-Type': 'application/json',
                ...config.ingest.headers
            };

            await fetch(config.ingest.url, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    channel: 'landing',
                    client_id: config.client_id,
                    session_id: config.realtime.session_id,
                    conversation_id: config.realtime.session_id,
                    message: {
                        message_id: tempId,
                        direction: 'inbound',
                        type: 'text',
                        timestamp: userMsg.created_at,
                        contact: {
                            wa_id: 'web-' + config.realtime.session_id,
                            profile_name: 'Web User'
                        },
                        content: { text: text }
                    }
                })
            });

        } catch (error) {
            console.error('Send error:', error);
            toast.error('Error enviando mensaje');
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    if (!token) return null;

    return (
        <>
            {/* Botón Flotante */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-5 right-5 h-14 w-14 rounded-full shadow-lg hover:scale-105 transition-transform z-50 text-white p-0"
                    style={{ backgroundColor: primaryColor }}
                >
                    <MessageCircle className="h-7 w-7" />
                </Button>
            )}

            {/* Ventana de Chat */}
            {isOpen && (
                <div className="fixed bottom-5 right-5 w-[90vw] md:w-[380px] h-[500px] max-h-[80vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col z-50 border overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

                    {/* Header */}
                    <div
                        className="p-4 flex items-center justify-between text-white shrink-0"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base leading-tight">{botName}</h3>
                                <p className="text-xs opacity-90">En línea</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1">
                            <Minus className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-zinc-950/50">
                        {isLoading && (
                            <div className="flex justify-center py-4">
                                <span className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                            </div>
                        )}

                        {messages.map((msg) => {
                            const isBot = msg.role !== 'user';
                            return (
                                <div key={msg.id} className={cn("flex w-full", isBot ? "justify-start" : "justify-end")}>
                                    <div
                                        className={cn(
                                            "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                                            isBot
                                                ? "bg-white dark:bg-zinc-800 text-slate-800 dark:text-slate-100 rounded-bl-sm border"
                                                : "text-white rounded-br-sm"
                                        )}
                                        style={!isBot ? { backgroundColor: primaryColor } : {}}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            );
                        })}

                        {isTyping && (
                            <div className="flex w-full justify-start">
                                <div className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-sm border shadow-sm flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-white dark:bg-zinc-900 flex gap-2 shrink-0">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe tu mensaje..."
                            className="flex-1 rounded-full border-slate-200 focus-visible:ring-indigo-500"
                            disabled={!isReady}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || !isReady}
                            size="icon"
                            className="rounded-full h-10 w-10 shrink-0"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Send className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
