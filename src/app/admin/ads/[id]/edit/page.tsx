/**
 * Edit Ad Page
 * Edit existing advertisement
 */

import { notFound } from 'next/navigation';
import { getAdById } from '@/lib/data/ads';
import { AdForm } from '@/components/admin/AdForm';

interface EditAdPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditAdPage({ params }: EditAdPageProps) {
    const { id } = await params;
    const ad = await getAdById(id);

    if (!ad) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Editar Anuncio</h1>
                <p className="text-muted-foreground">
                    Modifica los datos del anuncio
                </p>
            </div>

            <AdForm initialData={ad} isEditing={true} />
        </div>
    );
}
