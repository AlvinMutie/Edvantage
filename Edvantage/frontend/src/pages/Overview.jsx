import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Users, GraduationCap, AlertTriangle, CheckCircle2 } from 'lucide-react';

const StatsCard = ({ icon: Icon, label, value, color, delay }) => (
    <div className={`p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl transition-all hover:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`}>
        <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="text-white" size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-400">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

const data = [
    { name: 'Jan', atRisk: 12, safe: 45 },
    { name: 'Feb', atRisk: 8, safe: 49 },
    { name: 'Mar', atRisk: 15, safe: 42 },
    { name: 'Apr', atRisk: 7, safe: 50 },
];

const riskData = [
    { name: 'High Risk', value: 5, color: '#ef4444' },
    { name: 'Medium Risk', value: 12, color: '#f59e0b' },
    { name: 'Low Risk', value: 40, color: '#10b981' },
];

import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import AIPredictionDemo from '../components/AIPredictionDemo';
import SupervisorDashboard from './SupervisorDashboard';

const Overview = () => {
    const { user } = useAuth();
    console.log("Overview Rendered. User Role:", user?.role);

    // If student, show their personal dashboard instead of admin overview
    if (user?.role === 'student') {
        console.log("Redirecting to StudentDashboard");
        return <StudentDashboard />;
    }

    if (user?.role === 'supervisor') {
        return <SupervisorDashboard />;
    }

    if (user?.role === 'superadmin') {
        return <SuperAdminDashboard />;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-slate-400 mt-2">Real-time student progress monitoring and alerts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard icon={Users} label="Total Students" value="57" color="bg-blue-600" />
                <StatsCard icon={AlertTriangle} label="At Risk" value="17" color="bg-amber-500" />
                <StatsCard icon={CheckCircle2} label="Interventions" value="12" color="bg-emerald-500" />
                <StatsCard icon={GraduationCap} label="Graduation Progress" value="84%" color="bg-indigo-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-lg font-semibold text-white mb-6">Monthly Risk Trends</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Bar dataKey="safe" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="atRisk" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-lg font-semibold text-white mb-6">Risk Distribution</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AI Prediction Demo */}
            <AIPredictionDemo />
        </div>
    );
};

export default Overview;
