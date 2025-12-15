/**
 * Admin Ads List Page
 * Table displaying all ads with actions
 */

import Link from 'next/link';
import { getAllAdsForAdmin } from '@/lib/data/ads';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AdStatusToggle } from '@/components/admin/AdStatusToggle';
import { DeleteAdButton } from '@/components/admin/DeleteAdButton';
import { tierInfo, categoryInfo } from '@/lib/schemas';

export default async function AdminAdsPage() {
    const ads = await getAllAdsForAdmin();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Anuncios</h1>
                    <p className="text-muted-foreground">
                        Gestiona todos los anuncios de la plataforma
                    </p>
                </div>
                <Link href="/admin/ads/new">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nuevo Anuncio
                    </Button>
                </Link>
            </div>

            {/* Table */}
            {ads.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <p className="text-muted-foreground mb-4">No hay anuncios todavía</p>
                    <Link href="/admin/ads/new">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Crear primer anuncio
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Imagen</TableHead>
                                <TableHead>Negocio</TableHead>
                                <TableHead>Tier</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Vencimiento</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ads.map((ad) => {
                                const isExpired = new Date(ad.expiration_date) < new Date();
                                const tier = tierInfo[ad.tier];
                                const category = categoryInfo[ad.category];

                                return (
                                    <TableRow key={ad.id}>
                                        <TableCell>
                                            <div
                                                className="w-16 h-12 rounded-md bg-cover bg-center bg-muted"
                                                style={{ backgroundImage: `url('${ad.image_url}')` }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{ad.business_name}</span>
                                                {ad.redirect_url && (
                                                    <a
                                                        href={ad.redirect_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                        Ver enlace
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`${tier.textColor} border-current`}
                                            >
                                                {tier.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{category.label}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={isExpired ? 'text-destructive font-medium' : ''}>
                                                {format(new Date(ad.expiration_date), 'dd MMM yyyy', { locale: es })}
                                            </span>
                                            {isExpired && (
                                                <Badge variant="destructive" className="ml-2 text-xs">
                                                    Vencido
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <AdStatusToggle id={ad.id} isActive={ad.is_active} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/ads/${ad.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <DeleteAdButton id={ad.id} name={ad.business_name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
