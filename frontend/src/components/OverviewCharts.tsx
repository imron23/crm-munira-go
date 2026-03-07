'use client';

import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export function OverviewCharts() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    const lineChartData = {
        labels: ['1 Mar', '2 Mar', '3 Mar', '4 Mar', '5 Mar', '6 Mar', '7 Mar'],
        datasets: [{
            label: 'Total Inquiries',
            data: [12, 19, 8, 25, 32, 18, 29],
            borderColor: '#6366F1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
        }],
    };

    const donutChartData = {
        labels: ['Umrah Plus', 'Umrah Reguler', 'Haji Furoda'],
        datasets: [{
            data: [45, 30, 25],
            backgroundColor: ['#22D3EE', '#8B5CF6', '#FBBF24'],
            borderWidth: 0,
        }],
    };

    return (
        <div className="overview-charts-row-main" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div className="data-panel" style={{ padding: '20px' }}>
                <h3>Leads Trend</h3>
                <div style={{ height: '240px' }}><Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
            </div>
            <div className="data-panel" style={{ padding: '20px' }}>
                <h3>Package Breakdown</h3>
                <div style={{ height: '240px' }}><Doughnut data={donutChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
            </div>
        </div>
    );
}
