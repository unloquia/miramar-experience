/**
 * Ad Status Toggle Component
 * Switch to enable/disable ads
 */

'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toggleAdStatus } from '@/lib/actions/ads';
import { toast } from 'sonner';

interface AdStatusToggleProps {
    id: string;
    isActive: boolean;
}

export function AdStatusToggle({ id, isActive }: AdStatusToggleProps) {
    const [checked, setChecked] = useState(isActive);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async (newValue: boolean) => {
        setIsLoading(true);
        setChecked(newValue);

        const result = await toggleAdStatus(id, newValue);

        if (result.success) {
            toast.success(newValue ? 'Anuncio activado' : 'Anuncio desactivado');
        } else {
            setChecked(!newValue); // Revert on error
            toast.error('Error al cambiar estado', {
                description: result.error,
            });
        }

        setIsLoading(false);
    };

    return (
        <Switch
            checked={checked}
            onCheckedChange={handleToggle}
            disabled={isLoading}
            className="data-[state=checked]:bg-primary"
        />
    );
}
