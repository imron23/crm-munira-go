'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="brand">
                <img src="/logo.png" alt="Munira" />
            </div>
            <ul className="nav-menu">
                <li>
                    <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                        <i className="fas fa-layer-group" style={{ color: '#6366F1' }}></i> Overview
                    </Link>
                </li>
                <li>
                    <Link href="/leads" className={`nav-link ${pathname === '/leads' ? 'active' : ''}`}>
                        <i className="fas fa-users-viewfinder" style={{ color: '#22D3EE' }}></i> Audience / Leads
                    </Link>
                </li>
                <li>
                    <Link href="/pages" className={`nav-link ${pathname === '/pages' ? 'active' : ''}`}>
                        <i className="fas fa-desktop" style={{ color: '#A78BFA' }}></i> Landing Pages
                    </Link>
                </li>
                <li>
                    <Link href="/forms" className={`nav-link ${pathname === '/forms' ? 'active' : ''}`}>
                        <i className="fas fa-wpforms" style={{ color: '#F472B6' }}></i> Form Builder
                    </Link>
                </li>
                <li>
                    <Link href="/distribution" className={`nav-link ${pathname === '/distribution' ? 'active' : ''}`}>
                        <i className="fas fa-route" style={{ color: '#FB923C' }}></i> Leads Distribution
                    </Link>
                </li>
                <li>
                    <Link href="/programs" className={`nav-link ${pathname === '/programs' ? 'active' : ''}`}>
                        <i className="fas fa-box-open" style={{ color: '#FBBF24' }}></i> Program Builder
                    </Link>
                </li>
                <li>
                    <Link href="/settings" className={`nav-link ${pathname === '/settings' ? 'active' : ''}`}>
                        <i className="fas fa-cogs" style={{ color: '#34D399' }}></i> Pengaturan Sistem
                    </Link>
                </li>
            </ul>
            <div style={{ flex: 1 }}></div>
            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="user-info">
                        <span className="user-name">Admin</span>
                        <span className="user-role">Workspace Mgr</span>
                    </div>
                    <button className="logout-btn" onClick={() => {
                        localStorage.removeItem('munira_token');
                        window.location.reload();
                    }}>
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </aside>
    );
}
