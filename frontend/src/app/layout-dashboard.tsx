'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('munira_token');
        if (!token) {
            router.push('/login');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) return null;

    return (
        <div id="dashboard-blade" className="blade active">
            <Sidebar />
            <main className="main-wrapper">
                <Header />
                {children}
            </main>
        </div>
    );
}
