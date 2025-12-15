/**
 * Ad Form Component
 * Complete form for creating/editing ads with image upload
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Upload, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createAd, updateAd, uploadAdImage } from '@/lib/actions/ads';
import { tierInfo, categoryInfo, type CreateAdFormData } from '@/lib/schemas';
import { LocationPicker } from './LocationPicker';
import { Switch } from '@/components/ui/switch';
import type { Ad, AdTier, AdCategory } from '@/types/database';

interface AdFormProps {
    initialData?: Ad;
    isEditing?: boolean;
}

export function AdForm({ initialData, isEditing = false }: AdFormProps) {
    const router = useRouter();

    // Form state
    const [businessName, setBusinessName] = useState(initialData?.business_name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [redirectUrl, setRedirectUrl] = useState(initialData?.redirect_url || '');
    const [tier, setTier] = useState<AdTier>(initialData?.tier || 'standard');
    const [category, setCategory] = useState<AdCategory | ''>(initialData?.category || '');
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(
        initialData?.expiration_date ? new Date(initialData.expiration_date) : undefined
    );
    const [priority, setPriority] = useState(initialData?.priority || 0);
    const [longDescription, setLongDescription] = useState(initialData?.long_description || '');

    // Geolocation state
    const [lat, setLat] = useState<number | null>(initialData?.lat || null);
    const [lng, setLng] = useState<number | null>(initialData?.lng || null);
    const [address, setAddress] = useState(initialData?.address || '');
    const [showOnMap, setShowOnMap] = useState(initialData?.show_on_map ?? true);
    const [isPermanent, setIsPermanent] = useState(initialData?.is_permanent || false);

    // Image state
    const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(initialData?.image_url || '');
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Submit state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size (3MB max)
        if (file.size > 3 * 1024 * 1024) {
            toast.error('La imagen no puede exceder 3MB');
            return;
        }

        // Validate type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Formato no válido. Usa JPG, PNG o WebP');
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // Remove selected image
    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        setImageUrl('');
    };

    // Upload image to storage
    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return imageUrl || null;

        setIsUploadingImage(true);

        const formData = new FormData();
        formData.append('file', imageFile);

        const result = await uploadAdImage(formData);

        setIsUploadingImage(false);

        if (result.success) {
            return result.data;
        } else {
            toast.error('Error al subir imagen', {
                description: result.error,
            });
            return null;
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!businessName.trim()) {
            toast.error('El nombre del negocio es obligatorio');
            return;
        }

        if (!category) {
            toast.error('Debes seleccionar una categoría');
            return;
        }

        if (!expirationDate) {
            toast.error('La fecha de vencimiento es obligatoria');
            return;
        }

        if (!imageFile && !imageUrl) {
            toast.error('Debes subir una imagen');
            return;
        }

        setIsSubmitting(true);

        // Upload image if new file selected
        const finalImageUrl = await uploadImage();

        if (!finalImageUrl) {
            setIsSubmitting(false);
            return;
        }

        // Prepare form data
        const formData = {
            business_name: businessName.trim(),
            description: description.trim() || null,
            long_description: longDescription.trim() || null,
            image_url: finalImageUrl,
            redirect_url: redirectUrl.trim() || null,
            tier,
            category: category as AdCategory,
            priority,
            lat,
            lng,
            address: address.trim() || null,
            show_on_map: showOnMap,
            expiration_date: expirationDate.toISOString(),
            is_active: initialData?.is_active ?? true,
            is_permanent: isPermanent,
        };

        // Create or Update ad
        let result;
        if (isEditing && initialData) {
            result = await updateAd({
                id: initialData.id,
                ...formData,
            });
        } else {
            result = await createAd(formData as CreateAdFormData);
        }

        if (result.success) {
            toast.success(isEditing ? 'Anuncio actualizado' : 'Anuncio creado exitosamente');
            router.push('/admin/ads');
        } else {
            toast.error(isEditing ? 'Error al actualizar' : 'Error al crear anuncio', {
                description: result.error,
            });
        }

        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <Card>
                <CardHeader>
                    <CardTitle>Imagen del Anuncio</CardTitle>
                    <CardDescription>
                        Sube una imagen atractiva. Máximo 3MB. Formatos: JPG, PNG, WebP
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {imagePreview ? (
                        <div className="relative">
                            <div
                                className="w-full h-64 rounded-lg bg-cover bg-center"
                                style={{ backgroundImage: `url('${imagePreview}')` }}
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:opacity-90"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click para subir</span> o arrastra y suelta
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG o WebP (máx. 3MB)
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageSelect}
                            />
                        </label>
                    )}
                </CardContent>
            </Card>

            {/* Business Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Información del Negocio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="businessName">Nombre del Negocio *</Label>
                        <Input
                            id="businessName"
                            placeholder="Ej: Hotel Miramar"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            maxLength={100}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Descripción Corta <span className="text-muted-foreground">(máx. 140 caracteres, para tarjetas)</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Breve descripción del negocio..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={140}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {description.length}/140
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="longDescription">
                            Descripción Larga <span className="text-muted-foreground">(para página de detalle)</span>
                        </Label>
                        <Textarea
                            id="longDescription"
                            placeholder="Descripción completa del negocio para la página de detalle..."
                            value={longDescription}
                            onChange={(e) => setLongDescription(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="redirectUrl">URL de Redirección (WhatsApp o Web)</Label>
                        <Input
                            id="redirectUrl"
                            placeholder="2261234567 o https://..."
                            value={redirectUrl}
                            onChange={(e) => setRedirectUrl(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            💡 Podés poner solo el número de teléfono y se convierte automáticamente a WhatsApp
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Location */}
            <Card>
                <CardHeader>
                    <CardTitle>Ubicación</CardTitle>
                    <CardDescription>
                        Agregá la ubicación para que aparezca en el mapa interactivo
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <LocationPicker
                        initialLat={lat}
                        initialLng={lng}
                        initialAddress={address}
                        onLocationChange={({ lat: newLat, lng: newLng, address: newAddress }) => {
                            setLat(newLat);
                            setLng(newLng);
                            if (newAddress !== null) setAddress(newAddress);
                        }}
                    />

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                            <Label htmlFor="showOnMap">Mostrar en el mapa</Label>
                            <p className="text-xs text-muted-foreground">
                                Si está activo, aparece en el mapa de la landing
                            </p>
                        </div>
                        <Switch
                            id="showOnMap"
                            checked={showOnMap}
                            onCheckedChange={setShowOnMap}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                            <Label htmlFor="isPermanent">Lugar permanente</Label>
                            <p className="text-xs text-muted-foreground">
                                Si está activo, nunca vence (ideal para guía de comercios)
                            </p>
                        </div>
                        <Switch
                            id="isPermanent"
                            checked={isPermanent}
                            onCheckedChange={setIsPermanent}
                        />
                    </div>
                </CardContent>
            </Card>


            {/* Tier Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Nivel de Publicidad (Tier)</CardTitle>
                    <CardDescription>
                        Selecciona el nivel de visibilidad del anuncio
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={tier}
                        onValueChange={(value) => setTier(value as AdTier)}
                        className="grid gap-4"
                    >
                        {(Object.entries(tierInfo) as [AdTier, typeof tierInfo[AdTier]][]).map(([key, info]) => (
                            <div key={key} className="flex items-start space-x-3">
                                <RadioGroupItem value={key} id={`tier-${key}`} className="mt-1" />
                                <label htmlFor={`tier-${key}`} className="flex-1 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${info.color}`} />
                                        <span className="font-medium">{info.label}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {info.description}
                                    </p>
                                </label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Category & Expiration */}
            <Card>
                <CardHeader>
                    <CardTitle>Categoría y Vigencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Categoría *</Label>
                            <Select
                                value={category}
                                onValueChange={(value) => setCategory(value as AdCategory)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(Object.entries(categoryInfo) as [AdCategory, typeof categoryInfo[AdCategory]][]).map(([key, info]) => (
                                        <SelectItem key={key} value={key}>
                                            <span className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">{info.icon}</span>
                                                {info.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha de Vencimiento *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !expirationDate && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {expirationDate ? (
                                            format(expirationDate, 'PPP', { locale: es })
                                        ) : (
                                            'Selecciona una fecha'
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={expirationDate}
                                        onSelect={setExpirationDate}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">
                            Prioridad <span className="text-muted-foreground">(0-100, mayor = primero)</span>
                        </Label>
                        <Input
                            id="priority"
                            type="number"
                            min={0}
                            max={100}
                            value={priority}
                            onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
                    disabled={isSubmitting || isUploadingImage}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isUploadingImage ? 'Subiendo imagen...' : 'Guardando...'}
                        </>
                    ) : (
                        isEditing ? 'Guardar Cambios' : 'Crear Anuncio'
                    )}
                </Button>
            </div>
        </form>
    );
}
