/**
 * Admin Dashboard - Main Page
 * Overview and quick actions
 */

import Link from 'next/link';
import { getAllAdsForAdmin } from '@/lib/data/ads';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutGrid, TrendingUp, AlertCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
    const ads = await getAllAdsForAdmin();

    // Calculate stats
    const totalAds = ads.length;
    const activeAds = ads.filter(ad => ad.is_active).length;
    const expiredAds = ads.filter(ad => new Date(ad.expiration_date) < new Date()).length;
    const heroAds = ads.filter(ad => ad.tier === 'hero').length;
    const featuredAds = ads.filter(ad => ad.tier === 'featured').length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Administra los anuncios de Miramar Experience
                    </p>
                </div>
                <Link href="/admin/ads/new">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nuevo Anuncio
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Anuncios</CardTitle>
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAds}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeAds} activos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hero Tier</CardTitle>
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{heroAds}</div>
                        <p className="text-xs text-muted-foreground">
                            Carrusel principal
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Featured Tier</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{featuredAds}</div>
                        <p className="text-xs text-muted-foreground">
                            Posiciones destacadas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{expiredAds}</div>
                        <p className="text-xs text-muted-foreground">
                            Requieren atención
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Gestionar Anuncios</CardTitle>
                        <CardDescription>
                            Ver, editar y eliminar anuncios existentes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/admin/ads">
                            <Button variant="outline" className="w-full">
                                Ver todos los anuncios
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Publicar Nuevo</CardTitle>
                        <CardDescription>
                            Crear un nuevo anuncio con el wizard paso a paso
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/admin/ads/new">
                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                Crear anuncio
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
