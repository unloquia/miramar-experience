/**
 * Admin Layout
 * Protected layout with sidebar navigation
 */

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Double-check authentication (middleware should have already checked)
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminHeader user={user} />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-6 md:p-8 lg:p-10 ml-0 md:ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
}
