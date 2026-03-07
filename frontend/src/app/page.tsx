import Layout from './layout-dashboard';
import { OverviewCharts } from '@/components/OverviewCharts';

export default function OverviewPage() {
    return (
        <Layout>
            <div id="view-overview" className="view-panel active">
                <div className="overview-filter-bar" style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Periode:</span>
                    <button className="btn btn-outline btn-mini">Today</button>
                    <button className="btn btn-outline btn-mini">7D</button>
                    <button className="btn btn-outline btn-mini">1M</button>
                </div>

                <div className="overview-grid overview-grid-3">
                    <div className="kpi-card">
                        <div>
                            <span className="kpi-title">Total Leads</span>
                            <span className="kpi-value">124</span>
                            <small>dalam periode</small>
                        </div>
                        <div className="kpi-icon"><i className="fas fa-users"></i></div>
                    </div>
                    <div className="kpi-card">
                        <div>
                            <span className="kpi-title">Today's Inquiries</span>
                            <span className="kpi-value">12</span>
                            <small>hari ini</small>
                        </div>
                        <div className="kpi-icon" style={{ color: '#2563eb', background: '#DBEAFE' }}><i className="fas fa-bolt"></i></div>
                    </div>
                    <div className="kpi-card" style={{ borderLeft: '4px solid #9333EA' }}>
                        <div>
                            <span className="kpi-title">CVR %</span>
                            <span className="kpi-value">15%</span>
                            <small>closing rate</small>
                        </div>
                        <div className="kpi-icon" style={{ color: '#9333EA', background: 'rgba(147,51,234,0.15)' }}><i className="fas fa-percentage"></i></div>
                    </div>
                </div>

                <OverviewCharts />
            </div>
        </Layout>
    );
}
