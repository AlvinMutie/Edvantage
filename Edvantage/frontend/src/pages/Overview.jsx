import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, GraduationCap, TriangleAlert, CircleCheckBig, 
  TrendingUp, Activity, BrainCircuit, Target, CheckCircle2,
  AlertCircle, ArrowUpRight, MessageSquare
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
    
    // Admin View Content
    const renderAdminView = () => (
        <div className="space-y-10">
            <SectionHeader 
                title="Institutional Overview" 
                description="Comprehensive analytics and performance monitoring."
            >
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 glass-dark rounded-2xl border border-white/10 flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Health Score</span>
                            <span className="text-lg font-black text-white">92/100</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-success-500/20 flex items-center justify-center relative">
                            <div className="absolute inset-0 border-2 border-success-500 rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 92%)' }} />
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
                <Card className="lg:col-span-2 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Academic & Attendance Trends</h3>
                            <p className="text-slate-400 text-sm">Correlation between engagement and performance</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                <div className="w-3 h-1 bg-primary-500 rounded-full" /> GPA
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                <div className="w-3 h-1 bg-emerald-500 rounded-full" /> Attendance
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={gpaTrendData}>
                                <defs>
                                    <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}
                                />
                                <Area type="monotone" dataKey="gpa" stroke="#6366f1" strokeWidth={3} fill="url(#gpaGradient)" />
                                <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-8">
                    <h3 className="text-xl font-bold text-white mb-8">Risk Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    cx="50%" cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {riskDistribution.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-slate-400">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-white">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white">Intervention Success Rate</h3>
                        <Badge variant="success">84% Effective</Badge>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { type: 'Academic', success: 85, total: 100 },
                                { type: 'Behavioral', success: 65, total: 100 },
                                { type: 'Financial', success: 92, total: 100 },
                                { type: 'Attendance', success: 78, total: 100 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="type" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }} />
                                <Bar dataKey="success" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-8 bg-primary-600/10 border-primary-500/20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary-500/20 rounded-lg">
                            <BrainCircuit className="text-primary-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">AI Insights</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                            <Badge variant="warning" className="text-[10px]">Prediction</Badge>
                            <p className="text-sm text-white font-medium">Predicted 15% increase in retention for Year 2 ICT students following new mentorship program.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                            <Badge variant="error" className="text-[10px]">Anomaly Detected</Badge>
                            <p className="text-sm text-white font-medium">Sudden drop in attendance detected in Engineering department (Module EN-302).</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                            <Badge variant="success" className="text-[10px]">Optimization</Badge>
                            <p className="text-sm text-white font-medium">Financial aid interventions show 92% success rate in preventing withdrawal.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    // Supervisor View Content
    const renderSupervisorView = () => (
        <div className="space-y-10">
            <SectionHeader 
                title="Management Portal" 
                description={`Monitoring ${students.length} assigned students.`}
            >
                <Button className="gap-2">
                    <MessageSquare size={18} />
                    Broadcast to Group
                </Button>
            </SectionHeader>

            <StatGroup>
                <KPICard icon={Users} label="Students Assigned" value={students.length} />
                <KPICard icon={AlertCircle} label="At-Risk Students" value={atRiskCount} trend={atRiskCount > 5 ? 'up' : 'down'} trendValue={atRiskCount > 5 ? "High" : "Low"} />
                <KPICard icon={Activity} label="Active Interventions" value="8" />
                <KPICard icon={CheckCircle2} label="Success Rate" value="89%" trend="up" trendValue="5%" />
            </StatGroup>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <RecommendationQueue />
                    
                    <Card className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white">Student Activity Feed</h3>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { name: 'John Doe', action: 'completed Assignment 3', time: '10m ago', type: 'academic' },
                                { name: 'Sarah Wilson', action: 'missed 2 consecutive classes', time: '2h ago', type: 'risk' },
                                { name: 'Michael Chen', action: 'responded to intervention', time: '5h ago', type: 'success' },
                                { name: 'Emma Davis', action: 'GPA dropped below 2.5', time: '1d ago', type: 'risk' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                        item.type === 'risk' ? 'bg-risk-critical' : 
                                        item.type === 'success' ? 'bg-success-500' : 'bg-primary-500'
                                    }`} />
                                    <div className="flex-1">
                                        <p className="text-sm text-white">
                                            <span className="font-bold">{item.name}</span> {item.action}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="p-2 h-auto">
                                        <ArrowUpRight size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="p-8">
                        <h3 className="text-lg font-bold text-white mb-6">Risk Monitoring</h3>
                        <div className="h-[250px] mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={riskDistribution}
                                        cx="50%" cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {riskDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {riskDistribution.map(item => (
                                <div key={item.name} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</p>
                                    <p className="text-lg font-black text-white">{item.value}%</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-white/10">
                        <BrainCircuit className="text-indigo-400 mb-4" size={32} />
                        <h3 className="text-lg font-bold text-white mb-2">Personalized AI Tips</h3>
                        <ul className="space-y-3">
                            <li className="text-sm text-slate-300 flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                Focus on John Doe's attendance this week.
                            </li>
                            <li className="text-sm text-slate-300 flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                Sarah Wilson responds best to direct messages.
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-700 pb-12">
            {user?.role === 'admin' ? renderAdminView() : renderSupervisorView()}
        </div>
    );
};

export default Overview;

