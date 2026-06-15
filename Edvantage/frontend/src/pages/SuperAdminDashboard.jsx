import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Users, Shield, UserCheck, GraduationCap, ArrowRight, 
  TriangleAlert, Activity, Server, ShieldCheck, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import BroadcastCenter from '../components/BroadcastCenter';
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';
import Button from '../components/ui/Button';

const growthData = [
  { name: 'Jan', users: 400, activity: 2400 },
  { name: 'Feb', users: 520, activity: 3600 },
  { name: 'Mar', users: 680, activity: 4100 },
  { name: 'Apr', users: 850, activity: 5900 },
  { name: 'May', users: 1100, activity: 7200 },
  { name: 'Jun', users: 1450, activity: 8800 },
];

const activityData = [
  { time: '00:00', load: 30 },
  { time: '04:00', load: 25 },
  { time: '08:00', load: 55 },
  { time: '12:00', load: 85 },
  { time: '16:00', load: 70 },
  { time: '20:00', load: 45 },
  { time: '23:59', load: 35 },
];

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, admin: 0, supervisor: 0, student: 0, superadmin: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users/');
                const users = Array.isArray(res.data) ? res.data : [];
                setStats({
                    total: users.length,
                    admin: users.filter(u => u.role === 'admin').length,
                    supervisor: users.filter(u => u.role === 'supervisor').length,
                    student: users.filter(u => u.role === 'student').length,
                    superadmin: users.filter(u => u.role === 'superadmin').length
                });
            } catch (err) {
                console.error("Failed to fetch user stats", err);
                setError("Could not load system statistics.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Initializing System Core...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 pb-12 animate-in fade-in duration-700">
            <SectionHeader 
                title="System Console" 
                description="Global platform oversight and infrastructure monitoring."
            >
                <div className="flex gap-3">
                  <Badge variant="success" className="flex items-center gap-1.5 px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                    System Online
                  </Badge>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Activity size={16} />
                    Live Logs
                  </Button>
                </div>
            </SectionHeader>

            {error && (
                <div className="bg-risk-critical/10 border border-risk-critical/20 text-risk-critical p-4 rounded-2xl flex items-center gap-3">
                    <TriangleAlert size={20} />
                    {error}
                </div>
            )}

            <StatGroup>
                <KPICard 
                    icon={Server} 
                    label="Total Institutions" 
                    value="12" 
                    trend="up" 
                    trendValue="14%" 
                />
                <KPICard 
                    icon={Users} 
                    label="Active Users" 
                    value={stats.total} 
                    trend="up" 
                    trendValue="8.2%" 
                />
                <KPICard 
                    icon={ShieldCheck} 
                    label="System Health" 
                    value="99.9%" 
                    trend="up" 
                    trendValue="0.1%" 
                />
                <KPICard 
                    icon={Zap} 
                    label="Security Events" 
                    value="0" 
                    trend="down" 
                    trendValue="100%" 
                />
            </StatGroup>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">User Growth</h3>
                            <p className="text-slate-400 text-sm">New account registrations over time</p>
                        </div>
                        <Badge variant="info">Yearly</Badge>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#64748b" 
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#64748b" 
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        borderRadius: '1rem',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="users" 
                                    stroke="url(#lineGradient)" 
                                    strokeWidth={4}
                                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Infrastructure Load</h3>
                            <p className="text-slate-400 text-sm">Real-time CPU and Memory utilization</p>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                            CPU
                          </div>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis 
                                    dataKey="time" 
                                    stroke="#64748b" 
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#64748b" 
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        borderRadius: '1rem',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="load" 
                                    stroke="#6366f1" 
                                    strokeWidth={3}
                                    fill="url(#areaGradient)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Management Core</h3>
                            <Link to="/dashboard/users">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    View Directory <ArrowRight size={16} />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                <Shield className="text-amber-400 mb-3" size={24} />
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Admins</p>
                                <p className="text-2xl font-black text-white">{stats.admin}</p>
                            </div>
                            <div className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                <UserCheck className="text-emerald-400 mb-3" size={24} />
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Supervisors</p>
                                <p className="text-2xl font-black text-white">{stats.supervisor}</p>
                            </div>
                            <div className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                <GraduationCap className="text-purple-400 mb-3" size={24} />
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Students</p>
                                <p className="text-2xl font-black text-white">{stats.student}</p>
                            </div>
                        </div>
                    </Card>
                    
                    <BroadcastCenter />
                </div>

                <div className="space-y-8">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Security Alerts</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 rounded-2xl bg-success-500/5 border border-success-500/10">
                                <div className="p-2 bg-success-500/10 rounded-lg h-fit">
                                    <ShieldCheck size={16} className="text-success-500" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-bold">Threat Defense Active</p>
                                    <p className="text-slate-400 text-xs mt-1">All systems firewall rules updated.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="p-2 bg-primary-500/10 rounded-lg h-fit">
                                    <Activity size={16} className="text-primary-500" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-bold">New Admin Login</p>
                                    <p className="text-slate-400 text-xs mt-1">SuperAdmin logged in from 192.168.1.1</p>
                                    <p className="text-slate-500 text-[10px] mt-2">2 minutes ago</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-primary-600 to-indigo-700 border-none overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white mb-2">System Backup</h3>
                            <p className="text-white/70 text-sm mb-6">Last backup completed successfully at 04:00 AM.</p>
                            <Button variant="white" size="sm" className="w-full">
                                Run Manual Backup
                            </Button>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <Server size={120} />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;

