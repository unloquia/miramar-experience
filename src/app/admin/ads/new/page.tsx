/**
 * New Ad Page
 * Creation wizard for new advertisements
 */

import { AdForm } from '@/components/admin/AdForm';

export default function NewAdPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Nuevo Anuncio</h1>
                <p className="text-muted-foreground">
                    Completa el formulario para crear un nuevo anuncio
                </p>
            </div>

            <AdForm />
        </div>
    );
}
