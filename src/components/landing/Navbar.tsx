/**
 * Navbar Component
 * Fixed navigation with glassmorphism effect
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'Guía', href: '/guia' },
    { label: 'Playas', href: '/#playas' },
    { label: 'Gastronomía', href: '/#gastronomia' },
    { label: 'Hotelería', href: '/#hoteleria' },
    { label: 'Eventos', href: '/#eventos' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/20 transition-all duration-300">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
                    <div className="layout-content-container flex flex-col max-w-[1280px] flex-1">
                        <header className="flex items-center justify-between whitespace-nowrap py-4">

                            {/* Logo */}
                            <Link
                                href="/"
                                className="flex items-center gap-3 text-foreground cursor-pointer group"
                            >
                                <div className="relative size-10 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors duration-300">
                                    <Image
                                        src="/images/dbf5bcf1-ba8f-4801-9e6f-533bacca3a23.jpg"
                                        alt="Logo soydeMiramar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                                    soydeMiramar
                                </h2>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex flex-1 justify-end gap-8">
                                <div className="flex items-center gap-8">
                                    {navLinks.map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            className="text-foreground/80 text-sm font-medium hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                                <Link
                                    href="/admin"
                                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300 text-primary-foreground text-sm font-bold leading-normal tracking-[0.015em]"
                                >
                                    <span className="truncate">Publicita Aquí</span>
                                </Link>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden text-foreground p-2"
                                aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>

                        </header>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass-panel border-t border-white/20 animate-slide-in-left">
                    <div className="px-4 py-6 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-foreground text-lg font-medium hover:text-primary transition-colors py-2"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold mt-4"
                        >
                            Publicita Aquí
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
