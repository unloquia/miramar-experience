/**
 * Ad Form Component
 * Complete form for creating/editing ads with image upload and gallery support
 */

'use client';

import { useState, useEffect } from 'react';
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
import { CalendarIcon, Upload, X, Loader2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createAd, updateAd, uploadAdImage } from '@/lib/actions/ads';
import { tierInfo, categoryInfo, type CreateAdFormData } from '@/lib/schemas';
import { LocationPicker } from './LocationPicker';
import { Switch } from '@/components/ui/switch';
import type { Ad, AdTier, AdCategory, PriceRange, OpeningHours } from '@/types/database';

// Helper for Features
const AVAILABLE_FEATURES = [
    { id: 'wifi', label: 'WiFi Gratis', icon: '📶' },
    { id: 'pet_friendly', label: 'Pet Friendly', icon: '🐾' },
    { id: 'cards', label: 'Acepta Tarjeta', icon: '💳' },
    { id: 'mercadopago', label: 'Mercado Pago', icon: '📱' },
    { id: 'cash', label: 'Solo Efectivo', icon: '💵' },
    { id: 'outdoor', label: 'Aire Libre', icon: '🌳' },
    { id: 'ac', label: 'Aire Acondicionado', icon: '❄️' },
    { id: 'delivery', label: 'Delivery', icon: '🛵' },
    { id: 'parking', label: 'Estacionamiento', icon: '🚗' },
];

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

    // Phase 2: enriched contact
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [instagram, setInstagram] = useState(initialData?.instagram_username || '');
    const [website, setWebsite] = useState(initialData?.website_url || '');

    const [tier, setTier] = useState<AdTier>(initialData?.tier || 'standard');
    const [category, setCategory] = useState<AdCategory | ''>(initialData?.category || '');
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(
        initialData?.expiration_date ? new Date(initialData.expiration_date) : undefined
    );
    const [priority, setPriority] = useState(initialData?.priority || 0);
    const [longDescription, setLongDescription] = useState(initialData?.long_description || '');

    // Phase 2: Metadata
    const [priceRange, setPriceRange] = useState<PriceRange | ''>(initialData?.price_range || '');
    const [features, setFeatures] = useState<string[]>(initialData?.features || []);

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

    // Gallery state
    const [galleryFiles, setGalleryFiles] = useState<{ file: File; preview: string }[]>([]);
    const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(initialData?.gallery_urls || []);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Submit state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            toast.error('La imagen no puede exceder 3MB');
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Formato no válido. Usa JPG, PNG o WebP');
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // UX State
    const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'details' | 'location'>('basic');
    const [touchedPriority, setTouchedPriority] = useState(false);

    // Smart Priority: Update priority based on Tier if not manually touched
    useEffect(() => {
        if (touchedPriority && isEditing) return; // Don't override if user manually set it OR editing existing

        // Only auto-set on new ads or if user hasn't touched it conceptually
        // But for safety, let's just do it when tier updates IF priority is at default 0
        // Or better: intelligent suggestion

        switch (tier) {
            case 'hero':
                if (priority < 90) setPriority(90);
                break;
            case 'featured':
                if (priority < 50 || priority >= 90) setPriority(50);
                break;
            case 'standard':
                if (priority >= 50) setPriority(10);
                break;
        }
    }, [tier]); // ESLint: ignore deps if needed, but logic is sound

    // Handle gallery selection
    const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles: { file: File; preview: string }[] = [];

        files.forEach(file => {
            if (file.size > 3 * 1024 * 1024) {
                toast.error(`Imagen ${file.name} ignorada (muy grande)`);
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                toast.error(`Imagen ${file.name} ignorada (formato invalido)`);
                return;
            }
            validFiles.push({
                file,
                preview: URL.createObjectURL(file)
            });
        });

        setGalleryFiles(prev => [...prev, ...validFiles]);
    };

    // Remove selected image
    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        setImageUrl('');
    };

    const removeGalleryFile = (index: number) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingGalleryUrl = (urlToRemove: string) => {
        setExistingGalleryUrls(prev => prev.filter(url => url !== urlToRemove));
    };

    // Upload image to storage
    const uploadImage = async (fileToUpload?: File): Promise<string | null> => {
        const file = fileToUpload || imageFile;
        // If no file to upload, return existing URL if handling main image
        if (!file) return imageUrl || null;

        const formData = new FormData();
        formData.append('file', file);

        const result = await uploadAdImage(formData);

        if (result.success) return result.data;

        toast.error(`Error al subir ${file.name}`, { description: result.error });
        return null;
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
            toast.error('Debes subir una imagen principal');
            return;
        }

        setIsSubmitting(true);
        setIsUploadingImage(true);

        try {
            // 1. Upload Main Image (if changed or new)
            // uploadImage() uses imageFile from state if no arg passed, returns existing imageUrl if no file
            const finalImageUrl = await uploadImage();

            if (!finalImageUrl) {
                throw new Error('Error al procesar imagen principal');
            }

            // 2. Upload New Gallery Images
            const newGalleryUrls: string[] = [];
            for (const item of galleryFiles) {
                const uploaded = await uploadImage(item.file);
                if (uploaded) newGalleryUrls.push(uploaded);
            }

            // Combine existing + new
            const finalGalleryUrls = [...existingGalleryUrls, ...newGalleryUrls];

            // Prepare form data
            const formData = {
                business_name: businessName.trim(),
                description: description.trim() || null,
                long_description: longDescription.trim() || null,
                image_url: finalImageUrl,
                gallery_urls: finalGalleryUrls, // Updated Gallery
                redirect_url: redirectUrl.trim() || null,

                // Phase 2 New Fields
                phone: phone.trim() || null,
                instagram_username: instagram.trim().replace('@', '') || null,
                website_url: website.trim() || null,

                tier,
                category: category as AdCategory,
                priority,

                // Phase 2 Metadata
                price_range: priceRange || null,
                features: features,
                opening_hours: null,

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
                } as any);
            } else {
                result = await createAd(formData as any);
            }

            if (result.success) {
                toast.success(isEditing ? 'Anuncio actualizado' : 'Anuncio creado exitosamente');
                router.push('/admin/ads');
            } else {
                toast.error(isEditing ? 'Error al actualizar' : 'Error al crear anuncio', {
                    description: result.error,
                });
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Error procesando formulario');
        } finally {
            setIsSubmitting(false);
            setIsUploadingImage(false);
        }
    };

    const TabButton = ({ id, label, icon }: { id: typeof activeTab, label: string, icon?: React.ReactNode }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
                "flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
                activeTab === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            )}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Tabs Navigation */}
            <div className="bg-card border rounded-lg overflow-hidden flex flex-wrap">
                <TabButton id="basic" label="Información" icon={<span className="text-lg">📋</span>} />
                <TabButton id="media" label="Multimedia" icon={<Upload className="w-4 h-4" />} />
                <TabButton id="details" label="Detalles & Contacto" icon={<span className="text-lg">✨</span>} />
                <TabButton id="location" label="Ubicación" icon={<span className="text-lg">📍</span>} />
            </div>

            {/* TAB: BASIC INFO */}
            <div className={cn("space-y-6", activeTab !== 'basic' && "hidden")}>
                <Card>
                    <CardHeader>
                        <CardTitle>Información Principal</CardTitle>
                        <CardDescription>Datos básicos del negocio y configuración de su plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="businessName">Nombre del Negocio *</Label>
                            <Input
                                id="businessName"
                                placeholder="Ej: Hotel Miramar"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                maxLength={100}
                                className="text-lg"
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Category */}
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

                            {/* Expiration */}
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

                        {/* Tier Selection */}
                        <div className="space-y-3 pt-2">
                            <Label>Nivel de Publicidad (Tier)</Label>
                            <RadioGroup
                                value={tier}
                                onValueChange={(value) => setTier(value as AdTier)}
                                className="grid gap-3 pt-1"
                            >
                                {(Object.entries(tierInfo) as [AdTier, typeof tierInfo[AdTier]][]).map(([key, info]) => (
                                    <div key={key} className={cn(
                                        "flex items-start space-x-3 border p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer",
                                        tier === key && "border-primary bg-primary/5"
                                    )}>
                                        <RadioGroupItem value={key} id={`tier-${key}`} className="mt-1" />
                                        <label htmlFor={`tier-${key}`} className="flex-1 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${info.color}`} />
                                                <span className="font-semibold text-sm">{info.label}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {info.description}
                                            </p>
                                        </label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2 max-w-[200px]">
                            <Label htmlFor="priority">
                                Prioridad (0-100)
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="priority"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={priority}
                                    onChange={(e) => {
                                        setPriority(parseInt(e.target.value) || 0);
                                        setTouchedPriority(true);
                                    }}
                                />
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    Mayor = aparecerá antes
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="button" onClick={() => setActiveTab('media')}>
                                Siguiente: Multimedia 👉
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TAB: MEDIA */}
            <div className={cn("space-y-6", activeTab !== 'media' && "hidden")}>
                <Card>
                    <CardHeader>
                        <CardTitle>Imágenes</CardTitle>
                        <CardDescription>
                            Foto de portada obligatoria y galería opcional. Recomendamos imágenes horizontales.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Main Image */}
                        <div>
                            <Label className="mb-2 block font-medium">Foto de Portada *</Label>
                            {imagePreview ? (
                                <div className="relative">
                                    <div
                                        className="w-full h-64 rounded-lg bg-cover bg-center border"
                                        style={{ backgroundImage: `url('${imagePreview}')` }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:opacity-90 shadow-sm"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Portada</div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            <span className="font-semibold">Subir Portada</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">JPG, PNG, WebP (máx. 3MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageSelect}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="border-t"></div>

                        {/* Gallery Grid */}
                        <div>
                            <Label className="mb-2 block font-medium">Galería de Fotos</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {/* Existing Photos */}
                                {existingGalleryUrls.map((url, idx) => (
                                    <div key={`old-${idx}`} className="aspect-square relative rounded-md overflow-hidden bg-muted group border">
                                        <img src={url} alt="Galería" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingGalleryUrl(url)}
                                            className="absolute top-1 right-1 p-1 bg-destructive/90 text-white rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* New Photos Pending Upload */}
                                {galleryFiles.map((item, idx) => (
                                    <div key={`new-${idx}`} className="aspect-square relative rounded-md overflow-hidden bg-muted border border-blue-500/50">
                                        <img src={item.preview} alt="Nueva" className="w-full h-full object-cover opacity-80" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryFile(idx)}
                                            className="absolute top-1 right-1 p-1 bg-destructive/90 text-white rounded-full"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-[10px] text-white text-center py-0.5">Pendiente</div>
                                    </div>
                                ))}

                                {/* Add Button */}
                                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                                    <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                                    <span className="text-xs text-muted-foreground">Agregar</span>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleGallerySelect}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Las fotos pendientes se subirán al <b>Guardar Cambios</b>.
                            </p>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="ghost" onClick={() => setActiveTab('basic')}>
                                👈 Anterior
                            </Button>
                            <Button type="button" onClick={() => setActiveTab('details')}>
                                Siguiente: Detalles 👉
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TAB: DETAILS */}
            <div className={cn("space-y-6", activeTab !== 'details' && "hidden")}>
                <Card>
                    <CardHeader>
                        <CardTitle>Detalles y Contacto</CardTitle>
                        <CardDescription>Enriquece el perfil para mejorar el SEO y la conversión</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Descripción Corta <span className="text-muted-foreground">(para listados)</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Breve descripción del negocio (máx 140)..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={140}
                                className="resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="longDescription">
                                Descripción Larga <span className="text-muted-foreground">(para página de detalle)</span>
                            </Label>
                            <Textarea
                                id="longDescription"
                                placeholder="Cuenta la historia completa del negocio, especialidades, etc..."
                                value={longDescription}
                                onChange={(e) => setLongDescription(e.target.value)}
                                rows={5}
                            />
                        </div>

                        <div className="border-t pt-2"></div>

                        {/* Contact Fields */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                                <Input
                                    id="phone"
                                    placeholder="+54 9 2291..."
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram (sin @)</Label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">@</span>
                                    <Input
                                        id="instagram"
                                        placeholder="usuario"
                                        className="rounded-l-none"
                                        value={instagram}
                                        onChange={e => setInstagram(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="website">Sitio Web</Label>
                                <Input
                                    id="website"
                                    placeholder="https://..."
                                    value={website}
                                    onChange={e => setWebsite(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="redirectUrl">URL Externa (Legacy)</Label>
                                <Input
                                    id="redirectUrl"
                                    placeholder="Solo si quieres redirigir fuera de la app..."
                                    value={redirectUrl}
                                    onChange={(e) => setRedirectUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-2"></div>

                        {/* Features & Price */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Rango de Precios</Label>
                                <Select value={priceRange} onValueChange={(v) => setPriceRange(v as PriceRange)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cheap">Barato ($)</SelectItem>
                                        <SelectItem value="moderate">Moderado ($$)</SelectItem>
                                        <SelectItem value="expensive">Caro ($$$)</SelectItem>
                                        <SelectItem value="luxury">Lujo ($$$$)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="mb-2 block">Comodidades y Servicios</Label>
                                <div className="grid grid-cols-1 gap-2 border rounded-lg p-3 max-h-60 overflow-y-auto bg-muted/10">
                                    {AVAILABLE_FEATURES.map(feat => {
                                        const isChecked = features.includes(feat.id);
                                        return (
                                            <div key={feat.id} className="flex items-center space-x-3 p-1.5 hover:bg-muted/50 rounded transition-colors">
                                                <Switch
                                                    id={`feat-${feat.id}`}
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setFeatures(prev => [...prev, feat.id]);
                                                        } else {
                                                            setFeatures(prev => prev.filter(f => f !== feat.id));
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`feat-${feat.id}`} className="cursor-pointer select-none text-sm font-medium flex items-center gap-2">
                                                    <span>{feat.icon}</span> {feat.label}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="ghost" onClick={() => setActiveTab('media')}>
                                👈 Anterior
                            </Button>
                            <Button type="button" onClick={() => setActiveTab('location')}>
                                Siguiente: Ubicación 👉
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* TAB: LOCATION */}
            <div className={cn("space-y-6", activeTab !== 'location' && "hidden")}>
                <Card>
                    <CardHeader>
                        <CardTitle>Ubicación Geográfica</CardTitle>
                        <CardDescription>
                            Define la posición en el mapa para guiar al usuario.
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

                        <div className="flex flex-col gap-4 pt-4">
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                                <div>
                                    <Label htmlFor="showOnMap" className="base">Mostrar en Mapa</Label>
                                    <p className="text-xs text-muted-foreground">Visible en el mapa interactivo general</p>
                                </div>
                                <Switch
                                    id="showOnMap"
                                    checked={showOnMap}
                                    onCheckedChange={setShowOnMap}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                                <div>
                                    <Label htmlFor="isPermanent">Lugar Permanente</Label>
                                    <p className="text-xs text-muted-foreground">Nunca expira (Edificios públicos, Plazas, etc)</p>
                                </div>
                                <Switch
                                    id="isPermanent"
                                    checked={isPermanent}
                                    onCheckedChange={setIsPermanent}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between pt-6 border-t mt-4">
                            <Button type="button" variant="ghost" onClick={() => setActiveTab('details')}>
                                👈 Anterior
                            </Button>

                            {/* FINAL SUBMIT BUTTON */}
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px]"
                                disabled={isSubmitting || isUploadingImage}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isUploadingImage ? 'Subiendo...' : 'Guardando...'}
                                    </>
                                ) : (
                                    isEditing ? 'Guardar Cambios' : 'Crear Anuncio'
                                )}
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>

        </form>
    );
}
