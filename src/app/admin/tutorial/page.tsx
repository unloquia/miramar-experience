/**
 * Admin Tutorial/Help Page - Updated for Phase 2
 * Complete guide for the admin on how to use the enriched system
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BookOpen,
    LayoutDashboard,
    ImagePlus,
    Edit,
    Trash2,
    ToggleLeft,
    Star,
    Grid3X3,
    Layers,
    MessageCircle,
    AlertTriangle,
    CheckCircle2,
    Info,
    Smartphone,
    MapPin,
    Wifi
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TutorialPage() {
    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div className="border-b border-border pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Guía de Uso 2.0 - Panel de Administración</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Todo lo que necesitás saber para gestionar los anuncios de Miramar Experience con las nuevas funciones.
                </p>
            </div>

            {/* Quick Navigation */}
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Navegación Rápida
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <a href="#dashboard" className="p-3 bg-card rounded-lg hover:bg-muted transition-colors text-center">
                            <LayoutDashboard className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <span className="text-sm font-medium">Dashboard</span>
                        </a>
                        <a href="#crear" className="p-3 bg-card rounded-lg hover:bg-muted transition-colors text-center">
                            <ImagePlus className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <span className="text-sm font-medium">Crear Anuncio</span>
                        </a>
                        <a href="#tiers" className="p-3 bg-card rounded-lg hover:bg-muted transition-colors text-center">
                            <Layers className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <span className="text-sm font-medium">Niveles & Prioridad</span>
                        </a>
                        <a href="#features" className="p-3 bg-card rounded-lg hover:bg-muted transition-colors text-center">
                            <Wifi className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <span className="text-sm font-medium">Detalles & Pagos</span>
                        </a>
                    </div>
                </CardContent>
            </Card>

            {/* Section 1: Dashboard */}
            <section id="dashboard" className="scroll-mt-20">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LayoutDashboard className="h-6 w-6 text-primary" />
                            Panel Principal (/admin)
                        </CardTitle>
                        <CardDescription>
                            Tu centro de control para ver el estado general de los anuncios.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h4 className="font-semibold mb-2">📊 Estadísticas</h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• <strong>Total Anuncios:</strong> Cantidad total en el sistema</li>
                                    <li>• <strong>Activos:</strong> Anuncios visibles en la web</li>
                                    <li>• <strong>Inactivos:</strong> Anuncios pausados o vencidos</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h4 className="font-semibold mb-2">⚡ Acciones Rápidas</h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Ver todos los anuncios</li>
                                    <li>• Crear nuevo anuncio</li>
                                    <li>• Acceder a esta guía</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Section 2: Creating Ads (Updated for Tabs) */}
            <section id="crear" className="scroll-mt-20">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImagePlus className="h-6 w-6 text-primary" />
                            Crear Nuevo Anuncio (Nuevo Flujo de Pestañas)
                        </CardTitle>
                        <CardDescription>
                            El formulario ahora está dividido en 4 pestañas para facilitar la carga.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Tab 1: Info */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-muted text-foreground border rounded-full flex items-center justify-center font-bold">
                                📋
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold">Pestaña 1: Información Básica</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Acá definís <strong>quién es</strong> y <strong>qué plan tiene</strong>.
                                </p>
                                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                    <li>• <strong>Nombre y Categoría:</strong> Datos esenciales.</li>
                                    <li>• <strong>Plan (Tier):</strong> Hero, Destacado o Estándar.</li>
                                    <li>• <strong>Prioridad Inteligente:</strong> Al cambiar el plan, el sistema te sugerirá un número (90, 50, 10). Podés editarlo si querés "desempatar" manualmente.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Tab 2: Media */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-muted text-foreground border rounded-full flex items-center justify-center font-bold">
                                📸
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold">Pestaña 2: Multimedia (Galería)</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Ahora podés subir muchas fotos a la vez.
                                </p>
                                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                    <li>• <strong>Portada:</strong> La imagen principal que sale en los listados. (Obligatoria)</li>
                                    <li>• <strong>Galería:</strong> Hacé click en "Agregar" y seleccioná múltiples fotos.</li>
                                    <li>• <strong>Vista Previa:</strong> Podés ver cómo quedan y eliminar las que no te gusten antes de guardar.</li>
                                </ul>
                                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                    Tip: Las fotos de galería se suben realmente cuando hacés click en "Guardar Cambios" al final.
                                </div>
                            </div>
                        </div>

                        {/* Tab 3: Details */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-muted text-foreground border rounded-full flex items-center justify-center font-bold">
                                ✨
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold">Pestaña 3: Detalles y Contacto</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Enriquece el anuncio para que la gente (y la IA) sepan todo.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                                    <div>
                                        <strong>📞 Contacto:</strong>
                                        <ul className="list-disc list-inside pl-1">
                                            <li>Teléfono/WhatsApp</li>
                                            <li>Instagram (usuario sin @)</li>
                                            <li>Sitio Web</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <strong>🏷️ Metadata:</strong>
                                        <ul className="list-disc list-inside pl-1">
                                            <li>Rango de Precios ($ - $$$$)</li>
                                            <li>Comodidades (WiFi, Aire, etc)</li>
                                            <li><strong>Medios de Pago</strong> (MercadoPago, Efectivo)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab 4: Location */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-muted text-foreground border rounded-full flex items-center justify-center font-bold">
                                📍
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold">Pestaña 4: Ubicación</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Seleccioná el punto exacto en el mapa.
                                </p>
                                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                    <li>• El usuario podrá usar el botón <strong>"Cómo Llegar"</strong> que abre el GPS directo a este punto.</li>
                                    <li>• Activá "Mostrar en Mapa" para que aparezca en el mapa general de la home.</li>
                                </ul>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </section>

            {/* Section 3: Priority & Tiers */}
            <section id="tiers" className="scroll-mt-20">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Layers className="h-6 w-6 text-primary" />
                            Niveles y Prioridad (0-100)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="p-4 bg-muted/50 rounded-lg border">
                            <h4 className="font-bold mb-2 flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-500" />
                                ¿Cómo funciona la prioridad?
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                                Es un número del 0 al 100 que decide el orden. <strong>Mayor número = Sale primero.</strong>
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-center text-sm mt-3">
                                <div className="p-2 border rounded bg-amber-100 dark:bg-amber-900/30">
                                    <div className="font-bold text-amber-700 dark:text-amber-400">HERO</div>
                                    <div className="text-xs">Prioridad ~90</div>
                                </div>
                                <div className="p-2 border rounded bg-blue-100 dark:bg-blue-900/30">
                                    <div className="font-bold text-blue-700 dark:text-blue-400">DESTACADO</div>
                                    <div className="text-xs">Prioridad ~50</div>
                                </div>
                                <div className="p-2 border rounded bg-slate-100 dark:bg-slate-800">
                                    <div className="font-bold text-slate-700 dark:text-slate-400">ESTÁNDAR</div>
                                    <div className="text-xs">Prioridad ~10</div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3 italic">
                                * El sistema setea estos números automáticamente cuando elegís el plan, pero podés cambiarlo manualmente (ej: ponerle 95 a un cliente VIP para que salga antes que los de 90).
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Section 4: Features & Payment */}
            <section id="features" className="scroll-mt-20">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smartphone className="h-6 w-6 text-primary" />
                            Nuevos Features 2.0
                        </CardTitle>
                        <CardDescription>
                            Información que buscan los turistas hoy en día.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">💳 Medios de Pago</h4>
                                <p className="text-sm text-muted-foreground">
                                    Ahora podés indicar explícitamente si aceptan <strong>Mercado Pago</strong>, Tarjetas o solo Efectivo. Esto aparece destacado en la ficha.
                                </p>
                            </div>
                            <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                                <h4 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">📸 Galería & Instagram</h4>
                                <p className="text-sm text-muted-foreground">
                                    La nueva ficha pública muestra las últimas fotos y un botón directo al Instagram del local. ¡Cargá el usuario sin el @!
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground py-6 border-t">
                <p>Miramar Experience - Guía Admin Updated</p>
                <p className="mt-1 opacity-50">Versión Sistema: Fase 2 (Enriched)</p>
            </div>
        </div>
    );
}
