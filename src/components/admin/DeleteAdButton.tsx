/**
 * Delete Ad Button Component
 * With confirmation dialog
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { deleteAd } from '@/lib/actions/ads';
import { toast } from 'sonner';

interface DeleteAdButtonProps {
    id: string;
    name: string;
}

export function DeleteAdButton({ id, name }: DeleteAdButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);

        const result = await deleteAd(id);

        if (result.success) {
            toast.success('Anuncio eliminado');
            setIsOpen(false);
        } else {
            toast.error('Error al eliminar', {
                description: result.error,
            });
        }

        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Eliminar anuncio?</DialogTitle>
                    <DialogDescription>
                        Estás a punto de eliminar el anuncio <strong>&quot;{name}&quot;</strong>.
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
