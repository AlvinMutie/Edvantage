import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, GraduationCap, TriangleAlert, CircleCheckBig, 
  TrendingUp, Activity, BrainCircuit, Target, CheckCircle2,
  AlertCircle, ArrowUpRight, MessageSquare, Sparkles, Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StudentDashboard from './StudentDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import RiskBadge from '../components/ui/RiskBadge';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';
import Button from '../components/ui/Button';
import RecommendationQueue from '../components/RecommendationQueue';
import Skeleton from '../components/ui/Skeleton';

const gpaTrendData = [
    { month: 'Sep', gpa: 3.2, attendance: 92 },
    { month: 'Oct', gpa: 3.1, attendance: 88 },
    { month: 'Nov', gpa: 3.3, attendance: 94 },
    { month: 'Dec', gpa: 3.2, attendance: 91 },
    { month: 'Jan', gpa: 3.4, attendance: 95 },
    { month: 'Feb', gpa: 3.5, attendance: 96 },
];

const riskDistribution = [
    { name: 'Low Risk', value: 45, color: '#10b981' },
    { name: 'Medium Risk', value: 25, color: '#f59e0b' },
    { name: 'High Risk', value: 15, color: '#f97316' },
    { name: 'Critical', value: 10, color: '#ef4444' },
];

const Overview = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'supervisor') {
            fetchDashboardData();
        }
    }, [user?.role]);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/students/');
            setStudents(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load dashboard data', err);
            setLoading(false);
        }
    };

    if (user?.role === 'student') return <StudentDashboard />;
    if (user?.role === 'superadmin') return <SuperAdminDashboard />;

    const atRiskCount = students.filter(s => s.risk_status !== 'Low Risk' && s.risk_status !== 'Safe').length;
    
    if (loading) return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="lg:col-span-2 h-[450px]" />
                <Skeleton className="h-[450px]" />
            </div>
        </div>
    );

    // Admin View Content
    const renderAdminView = () => (
        <div className="space-y-10">
            <SectionHeader 
                title="Institutional Overview" 
                description="Comprehensive analytics and performance monitoring across all departments."
            >
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2 bg-white/5">
                        <Filter size={14} />
                        Filter View
                    </Button>
                    <div className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Health</span>
                            <span className="text-xl font-black text-white leading-none mt-1">92.4</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-success-500/20 flex items-center justify-center relative shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <TrendingUp size={16} className="text-success-400" />
                        </div>
                    </div>
                </div>
            </SectionHeader>

            <StatGroup>
                <KPICard icon={Users} label="Total Students" value={students.length || "57"} trend="up" trendValue="4%" />
                <KPICard icon={Target} label="Retention Rate" value="94.2%" trend="up" trendValue="1.2%" />
                <KPICard icon={Activity} label="Attendance" value="88.5%" trend="down" trendValue="2.3%" />
                <KPICard icon={GraduationCap} label="Avg. GPA" value="3.42" trend="up" trendValue="0.15" />
            </StatGroup>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-8 bg-slate-950/20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                        <div>
                            <h3 className="text-xl font-black text-white flex items-center gap-3">
                                <Activity className="text-primary-400" size={20} />
                                Performance Matrix
                            </h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Correlation: Engagement vs Achievement</p>
                        </div>
                        <div className="flex gap-6 p-2 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                <div className="w-3 h-1 bg-primary-500 rounded-full" /> GPA Index
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                <div className="w-3 h-1 bg-emerald-500 rounded-full" /> Attendance
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={gpaTrendData}>
                                <defs>
                                    <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="attGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="month" stroke="#475569" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickMargin={10} />
                                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="gpa" stroke="#6366f1" strokeWidth={4} fill="url(#gpaGradient)" animationDuration={2000} />
                                <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} fill="url(#attGradient)" strokeDasharray="6 6" animationDuration={2500} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-8 relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col">
                        <h3 className="text-xl font-black text-white mb-2">Risk Vector</h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Population Distribution</p>
                        
                        <div className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={riskDistribution}
                                        cx="50%" cy="50%"
                                        innerRadius={85}
                                        outerRadius={115}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {riskDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-8">
                            {riskDistribution.map((item) => (
                                <div key={item.name} className="flex flex-col p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                                    </div>
                                    <span className="text-lg font-black text-white">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Card className="lg:col-span-8 p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                        <div>
                            <h3 className="text-xl font-black text-white">Intervention ROI</h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Success rates across primary vectors</p>
                        </div>
                        <Badge variant="success" className="px-4 py-1.5">84% Efficiency Index</Badge>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { type: 'Academic', success: 85, total: 100 },
                                { type: 'Behavioral', success: 65, total: 100 },
                                { type: 'Financial', success: 92, total: 100 },
                                { type: 'Attendance', success: 78, total: 100 },
                            ]}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="type" stroke="#475569" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} tickMargin={12} />
                                <YAxis stroke="#475569" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }} />
                                <Bar dataKey="success" fill="url(#barGradient)" radius={[8, 8, 2, 2]} barSize={50} animationDuration={1500} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="lg:col-span-4 p-8 bg-primary-600/10 border-primary-500/20 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <BrainCircuit size={160} className="text-primary-400" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20">
                                <Sparkles className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white leading-none">AI Intelligence</h3>
                                <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mt-1">Real-time Predictions</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4 flex-1">
                            {[
                                { title: 'Retention Forecast', text: 'Predicted 15% increase in retention for Year 2 ICT students.', variant: 'info' },
                                { title: 'Anomaly Warning', text: 'Sudden drop in attendance detected in Engineering department.', variant: 'error' },
                                { title: 'Vector Optimization', text: 'Financial aid interventions show 92% success rate.', variant: 'success' }
                            ].map((insight, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all cursor-default">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter opacity-40">{insight.title}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full ${insight.variant === 'error' ? 'bg-risk-critical' : insight.variant === 'success' ? 'bg-success-500' : 'bg-primary-500'}`} />
                                    </div>
                                    <p className="text-xs text-slate-200 font-bold leading-relaxed">{insight.text}</p>
                                </div>
                            ))}
                        </div>
                        
                        <Button className="mt-8 w-full gap-2 group/btn" size="sm" variant="white">
                            Explore Neural Insights
                            <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );

    // Supervisor View Content
    const renderSupervisorView = () => (
        <div className="space-y-10">
            <SectionHeader 
                title="Management Core" 
                description={`You are currently supervising ${students.length} active students.`}
            >
                <Button className="gap-2 shadow-lg shadow-primary-500/20">
                    <MessageSquare size={18} />
                    System Broadcast
                </Button>
            </SectionHeader>

            <StatGroup>
                <KPICard icon={Users} label="Managed Students" value={students.length} />
                <KPICard icon={AlertCircle} label="Risk Perimeter" value={atRiskCount} trend={atRiskCount > 5 ? 'up' : 'down'} trendValue={atRiskCount > 5 ? "Critical" : "Stable"} />
                <KPICard icon={Activity} label="Open Interventions" value="8" />
                <KPICard icon={CheckCircle2} label="Resolution Rate" value="89%" trend="up" trendValue="5%" />
            </StatGroup>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <RecommendationQueue />
                    
                    <Card className="p-8">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-white">Neural Event Feed</h3>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time student lifecycle events</p>
                            </div>
                            <Button variant="ghost" size="sm" className="bg-white/5">Analyze All</Button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { name: 'John Doe', action: 'completed Assignment 3', time: '10m ago', type: 'academic' },
                                { name: 'Sarah Wilson', action: 'missed 2 consecutive classes', time: '2h ago', type: 'risk' },
                                { name: 'Michael Chen', action: 'responded to intervention', time: '5h ago', type: 'success' },
                                { name: 'Emma Davis', action: 'GPA dropped below 2.5', time: '1d ago', type: 'risk' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 items-start p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor] ${
                                        item.type === 'risk' ? 'text-risk-critical bg-risk-critical' : 
                                        item.type === 'success' ? 'text-success-500 bg-success-500' : 'text-primary-500 bg-primary-500'
                                    }`} />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                            <span className="font-black text-white">{item.name}</span> {item.action}
                                        </p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{item.time}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="p-2.5 h-auto bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                                        <ArrowUpRight size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-8 relative overflow-hidden">
                        <h3 className="text-lg font-black text-white mb-8">Risk Vector</h3>
                        <div className="h-[250px] mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={riskDistribution}
                                        cx="50%" cy="50%"
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={6}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {riskDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {riskDistribution.map(item => (
                                <div key={item.name} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center text-center">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.name}</p>
                                    <p className="text-xl font-black text-white">{item.value}%</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-white/10 group">
                        <div className="flex items-center gap-3 mb-6">
                            <BrainCircuit className="text-indigo-400 group-hover:scale-110 transition-transform" size={32} />
                            <h3 className="text-lg font-black text-white">Neural Tips</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Focus on John Doe's attendance this week.",
                                "Sarah Wilson responds best to direct messages.",
                                "Risk detected for ICT-304 module cohort."
                            ].map((tip, i) => (
                                <li key={i} className="text-xs text-slate-300 font-bold flex gap-3 leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0 shadow-[0_0_8px_#6366f1]" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-1000 pb-12">
            {user?.role === 'admin' ? renderAdminView() : renderSupervisorView()}
        </div>
    );
};

export default Overview;

