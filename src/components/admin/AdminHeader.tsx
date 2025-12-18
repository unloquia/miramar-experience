/**
 * Admin Header Component
 * Top bar with user info and logout
 */

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';
import { toast } from 'sonner';

interface AdminHeaderProps {
    user: User;
}

export function AdminHeader({ user }: AdminHeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        toast.success('Sesión cerrada');
        router.push('/');
        router.refresh();
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center justify-between px-4 md:px-6">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-3">
                <div className="relative size-8 rounded-full overflow-hidden border border-primary/20">
                    <Image
                        src="/images/dbf5bcf1-ba8f-4801-9e6f-533bacca3a23.jpg"
                        alt="Logo Admin"
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="font-bold text-lg hidden sm:inline">soydeMiramar Admin</span>
            </Link>

            {/* Mobile menu button (placeholder) */}
            <button className="md:hidden p-2">
                <Menu className="h-5 w-5" />
            </button>

            {/* User menu */}
            <div className="hidden md:flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserIcon className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium hidden lg:inline">
                                {user.email}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-muted-foreground">
                            {user.email}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
