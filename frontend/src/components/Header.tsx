'use client';

export default function Header() {
    return (
        <header className="main-header">
            <div className="header-left">
                <h1 id="view-title">Dashboard</h1>
            </div>
            <div className="header-right">
                <div className="quick-actions">
                    <button className="action-btn" title="WhatsApp Sync">
                        <i className="fab fa-whatsapp"></i>
                    </button>
                    <button className="action-btn" title="Toggle Theme">
                        <i className="fas fa-moon"></i>
                    </button>
                    <button className="action-btn" title="Notifications">
                        <i className="fas fa-bell"></i>
                        <span className="badge">1</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
