/**
 * Admin Tutorial/Help Page
 * Complete guide for the admin on how to use the system
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
    Calendar,
    MessageCircle,
    AlertTriangle,
    CheckCircle2,
    Info,
    ArrowRight
} from 'lucide-react';

export default function TutorialPage() {
    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div className="border-b border-border pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Guía de Uso - Panel de Administración</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Todo lo que necesitás saber para gestionar los anuncios de Miramar Experience.
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
                        <a href="#gestionar" className="p-3 bg-card rounded-lg hover:bg-muted transition-colors text-center">
                            <Edit className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <span className="text-sm font-medium">Gestionar</span>
                        </a>
                        <a href="#tiers" className="p-3 bg-card rounded-lg hover:bg-muted transition-colors text-center">
                            <Layers className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <span className="text-sm font-medium">Niveles</span>
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

            {/* Section 2: Creating Ads */}
            <section id="crear" className="scroll-mt-20">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImagePlus className="h-6 w-6 text-primary" />
                            Crear Nuevo Anuncio (/admin/ads/new)
                        </CardTitle>
                        <CardDescription>
                            Paso a paso para agregar un nuevo comercio o negocio a la plataforma.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Step 1 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                                1
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold">Subir Imagen</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Seleccioná una imagen atractiva del negocio. La imagen es lo primero que verán los usuarios.
                                </p>
                                <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        <strong>📸 Requisitos:</strong> JPG, PNG o WebP. Máximo 3MB. Se recomienda 1200x800px para mejor calidad.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                                2
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold">Información del Negocio</h4>
                                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                    <li>• <strong>Nombre:</strong> Nombre comercial (ej: "Hotel Miramar")</li>
                                    <li>• <strong>Descripción:</strong> Breve texto atractivo, máximo 140 caracteres</li>
                                    <li>• <strong>URL:</strong> Link de WhatsApp o sitio web (opcional)</li>
                                </ul>
                                <div className="mt-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
                                    <p className="text-sm text-green-800 dark:text-green-200">
                                        <strong>💡 Tip WhatsApp:</strong> Podés poner solo el número (ej: 2261234567) y el sistema lo convierte automáticamente a link de WhatsApp.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                                3
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold">Elegir Nivel (Tier)</h4>
                                <p className="text-sm text-muted-foreground mt-1 mb-3">
                                    El nivel determina dónde y cómo se muestra el anuncio en la web.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 p-2 border border-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                                        <Badge className="bg-amber-500">Hero</Badge>
                                        <span className="text-sm">Carrusel principal - Máxima visibilidad (máx. 5 activos)</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 border border-primary/30 bg-primary/5 rounded-lg">
                                        <Badge className="bg-primary text-primary-foreground">Destacado</Badge>
                                        <span className="text-sm">Grilla - Tarjeta grande (2 columnas)</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 border border-slate-300 bg-slate-50 dark:bg-slate-950/30 rounded-lg">
                                        <Badge variant="secondary">Estándar</Badge>
                                        <span className="text-sm">Grilla - Tarjeta normal (1 columna)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                                4
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold">Categoría y Vencimiento</h4>
                                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                    <li>• <strong>Categoría:</strong> Gastronomía, Hotelería, Shopping, Aventura, Vida Nocturna</li>
                                    <li>• <strong>Fecha de Vencimiento:</strong> Hasta cuándo estará visible el anuncio</li>
                                    <li>• <strong>Prioridad:</strong> Orden dentro de su nivel (0-100, mayor = primero)</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Section 3: Managing Ads */}
            <section id="gestionar" className="scroll-mt-20">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Edit className="h-6 w-6 text-primary" />
                            Gestionar Anuncios (/admin/ads)
                        </CardTitle>
                        <CardDescription>
                            Ver, editar, activar/desactivar y eliminar anuncios existentes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Table Info */}
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-semibold mb-3">📋 Tabla de Anuncios</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                Acá verás todos los anuncios ordenados del más nuevo al más viejo. Cada fila muestra:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                <div className="p-2 bg-card rounded">📷 Miniatura</div>
                                <div className="p-2 bg-card rounded">🏪 Nombre</div>
                                <div className="p-2 bg-card rounded">⭐ Nivel</div>
                                <div className="p-2 bg-card rounded">📂 Categoría</div>
                                <div className="p-2 bg-card rounded">📅 Vencimiento</div>
                                <div className="p-2 bg-card rounded">✅ Estado</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <h4 className="font-semibold">🔧 Acciones Disponibles</h4>

                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <ToggleLeft className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <h5 className="font-medium">Activar/Desactivar</h5>
                                    <p className="text-sm text-muted-foreground">
                                        Usá el switch para pausar un anuncio sin eliminarlo.
                                        Al desactivarlo, deja de verse en la web inmediatamente.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <Edit className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h5 className="font-medium">Editar</h5>
                                    <p className="text-sm text-muted-foreground">
                                        Modificá cualquier dato: imagen, nombre, descripción, nivel, fecha de vencimiento, etc.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
                                <div>
                                    <h5 className="font-medium">Eliminar</h5>
                                    <p className="text-sm text-muted-foreground">
                                        Borra el anuncio permanentemente. Se pedirá confirmación antes de eliminar.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Badges */}
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-semibold mb-3">🏷️ Estados que podés ver</h4>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-500">Activo</Badge>
                                    <span className="text-sm">Visible en la web</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">Inactivo</Badge>
                                    <span className="text-sm">Pausado manualmente</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="destructive">Vencido</Badge>
                                    <span className="text-sm">Pasó la fecha de vencimiento</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Section 4: Tier System */}
            <section id="tiers" className="scroll-mt-20">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Layers className="h-6 w-6 text-primary" />
                            Sistema de Niveles (Tiers)
                        </CardTitle>
                        <CardDescription>
                            Entendé cómo funciona cada nivel de publicidad.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Hero */}
                        <div className="p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 rounded-r-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="h-5 w-5 text-amber-500" />
                                <h4 className="font-bold text-lg">Hero - Máxima Visibilidad</h4>
                            </div>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Aparece en el carrusel principal (100% del ancho de pantalla)
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Rotación automática cada 5 segundos
                                </li>
                                <li className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    Máximo 5 anuncios Hero activos al mismo tiempo
                                </li>
                                <li className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-blue-500" />
                                    Ideal para: Hoteles premium, restaurantes principales, eventos destacados
                                </li>
                            </ul>
                        </div>

                        {/* Featured */}
                        <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Grid3X3 className="h-5 w-5 text-primary" />
                                <h4 className="font-bold text-lg">Destacado - Gran Visibilidad</h4>
                            </div>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Tarjeta grande en la grilla (ocupa 2 columnas)
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Muestra descripción completa y botón de acción
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Sin límite de cantidad
                                </li>
                                <li className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-blue-500" />
                                    Ideal para: Comercios importantes, servicios de aventura, locales nocturnos
                                </li>
                            </ul>
                        </div>

                        {/* Standard */}
                        <div className="p-4 border-l-4 border-slate-400 bg-slate-50 dark:bg-slate-950/20 rounded-r-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Grid3X3 className="h-5 w-5 text-slate-500" />
                                <h4 className="font-bold text-lg">Estándar - Visibilidad Normal</h4>
                            </div>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Tarjeta cuadrada en la grilla (1 columna)
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Muestra nombre y categoría
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Sin límite de cantidad
                                </li>
                                <li className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-blue-500" />
                                    Ideal para: Comercios pequeños, nuevos negocios, promos temporales
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Section 5: Tips & Best Practices */}
            <section id="tips" className="scroll-mt-20">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-6 w-6 text-primary" />
                            Tips y Mejores Prácticas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Hacé esto</h4>
                                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                                    <li>• Usá imágenes de alta calidad y bien iluminadas</li>
                                    <li>• Escribí descripciones cortas y atractivas</li>
                                    <li>• Revisá los vencimientos cada semana</li>
                                    <li>• Rotá los anuncios Hero para dar oportunidad a todos</li>
                                    <li>• Poné siempre un WhatsApp o link de contacto</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Evitá esto</h4>
                                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                                    <li>• Imágenes borrosas o pixeladas</li>
                                    <li>• Descripciones con muchos emojis</li>
                                    <li>• Poner todos los anuncios como "Hero"</li>
                                    <li>• Dejar anuncios vencidos sin renovar</li>
                                    <li>• URLs que no funcionan</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-20">
                <Card>
                    <CardHeader>
                        <CardTitle>❓ Preguntas Frecuentes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-1">¿Qué pasa cuando vence un anuncio?</h4>
                            <p className="text-sm text-muted-foreground">
                                Deja de verse en la web automáticamente, pero sigue en el sistema.
                                Podés renovarlo cambiando la fecha de vencimiento.
                            </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-1">¿Puedo tener más de 5 anuncios Hero?</h4>
                            <p className="text-sm text-muted-foreground">
                                No. El límite es 5 activos para mantener un carousel ágil.
                                Si necesitás agregar uno nuevo, desactivá uno existente.
                            </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-1">¿Cómo pongo un link de WhatsApp?</h4>
                            <p className="text-sm text-muted-foreground">
                                Simplemente poné el número de teléfono (ej: 2261234567) y el sistema lo convierte
                                automáticamente al formato correcto de WhatsApp.
                            </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-1">¿Los cambios se ven inmediatamente?</h4>
                            <p className="text-sm text-muted-foreground">
                                Sí. Cualquier cambio (crear, editar, activar, desactivar) se refleja
                                en la web en menos de 1 segundo.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground py-6 border-t">
                <p>¿Tenés dudas? Contactá al soporte técnico.</p>
                <p className="mt-1">Miramar Experience © 2024</p>
            </div>
        </div>
    );
}
