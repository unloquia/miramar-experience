/**
 * Admin Sidebar Component
 * Navigation for admin panel
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Megaphone, Settings, Home, BookOpen, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        label: 'Anuncios',
        href: '/admin/ads',
        icon: Megaphone,
    },
    {
        label: 'Guía de Uso',
        href: '/admin/tutorial',
        icon: BookOpen,
    },
    {
        label: 'Integraciones IA',
        href: '/admin/settings/integrations',
        icon: Bot,
    },
    {
        label: 'Configuración',
        href: '/admin/settings',
        icon: Settings,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 bg-card border-r border-border pt-16">
            <div className="flex flex-col gap-2 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/admin' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* Back to site link */}
            <div className="mt-auto p-4 border-t border-border">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    <Home className="h-5 w-5" />
                    Volver al sitio
                </Link>
            </div>
        </aside>
    );
}
