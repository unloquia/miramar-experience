/**
 * Footer Component
 * With newsletter signup and navigation links
 */

import Link from 'next/link';

export function Footer() {
    return (
        <>
            {/* Newsletter Section */}
            <div className="w-full bg-foreground py-16 px-4">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
                    <span className="material-symbols-outlined text-primary text-5xl">mail</span>
                    <h2 className="text-background text-3xl md:text-4xl font-bold">No te pierdas nada</h2>
                    <p className="text-background/60 text-lg max-w-lg">
                        Suscríbete para recibir ofertas exclusivas, guías de viaje y novedades sobre eventos en Miramar.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4">
                        <input
                            type="email"
                            placeholder="Tu correo electrónico"
                            className="flex-1 rounded-xl border-none px-4 py-3 bg-background/10 text-background placeholder-background/50 focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary hover:bg-[#0fd6d6] text-primary-foreground font-bold rounded-xl transition-colors"
                        >
                            Suscribirse
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Footer */}
            <footer className="bg-sand-accent dark:bg-card text-foreground py-12 border-t border-border">
                <div className="layout-container flex justify-center px-4 md:px-10 lg:px-40">
                    <div className="layout-content-container max-w-[1280px] w-full flex flex-col gap-10">

                        <div className="flex flex-col md:flex-row justify-between gap-10">
                            {/* Brand */}
                            <div className="flex flex-col gap-4 max-w-xs">
                                <div className="flex items-center gap-2 text-foreground">
                                    <span className="material-symbols-outlined text-primary">water_drop</span>
                                    <span className="text-xl font-bold">Miramar Experience</span>
                                </div>
                                <p className="text-sm opacity-70 leading-relaxed">
                                    La guía definitiva para disfrutar de la ciudad de los niños. Naturaleza, paz y experiencias inolvidables.
                                </p>
                            </div>

                            {/* Links */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
                                <div className="flex flex-col gap-4">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-primary">Explorar</h4>
                                    <a href="#" className="text-sm hover:text-primary transition-colors">Playas</a>
                                    <a href="#" className="text-sm hover:text-primary transition-colors">Bosque</a>
                                    <a href="#" className="text-sm hover:text-primary transition-colors">Centro</a>
                                    <a href="#" className="text-sm hover:text-primary transition-colors">Vivero</a>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-primary">Comercios</h4>
                                    <Link href="/admin" className="text-sm hover:text-primary transition-colors">Publicidad</Link>
                                    <a href="#" className="text-sm hover:text-primary transition-colors">Planes</a>
                                    <a href="#" className="text-sm hover:text-primary transition-colors">Guía Comercial</a>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-primary">Legal</h4>
                                    <a href="#" className="text-sm hover:text-primary transition-colors">Privacidad</a>
                                    <a href="#" className="text-sm hover:text-primary transition-colors">Términos</a>
                                    <a href="#" className="text-sm hover:text-primary transition-colors">Contacto</a>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-border" />

                        {/* Bottom */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-sm opacity-60">
                                © {new Date().getFullYear()} Miramar Experience. Todos los derechos reservados.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="size-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm text-foreground"
                                    aria-label="Instagram"
                                >
                                    <span className="text-lg font-bold">Ig</span>
                                </a>
                                <a
                                    href="#"
                                    className="size-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm text-foreground"
                                    aria-label="Facebook"
                                >
                                    <span className="text-lg font-bold">Fb</span>
                                </a>
                                <a
                                    href="#"
                                    className="size-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm text-foreground"
                                    aria-label="X/Twitter"
                                >
                                    <span className="text-lg font-bold">X</span>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </footer>
        </>
    );
}
