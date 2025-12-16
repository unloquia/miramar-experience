'use client';

import { Button } from "@/components/ui/button";
import { MessageCircle, ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/actions/analytics";
import { cn } from "@/lib/utils";

interface ContactButtonProps {
    adId: string;
    url: string;
    variant?: "default" | "secondary" | "outline" | "ghost" | "link";
    className?: string;
    fullWidth?: boolean;
    showIcon?: boolean;
    label?: string;
    size?: "default" | "sm" | "lg" | "icon";
}

export function ContactButton({
    adId,
    url,
    variant = "default",
    className,
    fullWidth = false,
    showIcon = true,
    label,
    size = "default"
}: ContactButtonProps) {
    const isWhatsApp = url.includes('wa.me');

    const handleClick = () => {
        // Track event asynchronously
        trackEvent(adId, isWhatsApp ? 'click_whatsapp' : 'click_website');

        // Open URL
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            className={cn(fullWidth ? "w-full" : "", "gap-2", className)}
        >
            {showIcon && (
                isWhatsApp ? <MessageCircle className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />
            )}
            {label || (isWhatsApp ? "Contactar por WhatsApp" : "Visitar Sitio Web")}
        </Button>
    );
}
