import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, Users, Calendar, CheckCircle, Clock, 
  Search, Filter, MoreHorizontal, User, BarChart2, 
  MessageCircle, History, BrainCircuit, ArrowUpRight,
  TrendingUp, Activity, Target
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import RiskBadge from '../components/ui/RiskBadge';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

const sessionHistoryData = [
    { date: 'Mon', sessions: 2 },
    { date: 'Tue', sessions: 5 },
    { date: 'Wed', sessions: 3 },
    { date: 'Thu', sessions: 4 },
    { date: 'Fri', sessions: 6 },
];

const CounselorDashboard = () => {
    const { user } = useAuth();
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCase, setSelectedCase] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInterventions();
    }, []);

    const fetchInterventions = async () => {
        try {
            const res = await api.get('/interventions/assigned');
            const data = res.data;
            setInterventions(data);
            if (data.length > 0) setSelectedCase(data[0]);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load assigned interventions', err);
            setLoading(false);
        }
    };

    const activeCases = interventions.filter(i => i.status === 'open' && (i.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.reason?.toLowerCase().includes(searchTerm.toLowerCase())));
    const resolvedCasesCount = interventions.filter(i => i.status === 'closed').length;

    if (loading) return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <Skeleton className="h-12 w-64" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Skeleton className="lg:col-span-4 h-[600px]" />
                <Skeleton className="lg:col-span-8 h-[600px]" />
            </div>
        </div>
    );

    return (
        <div className="space-y-10 pb-12 animate-in fade-in duration-1000">
            <SectionHeader 
                title="Counseling Hub" 
                description={`Welcome back, Counselor ${user?.username || user?.full_name}. Monitoring ${activeCases.length} prioritized cases.`}
            >
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="gap-2 bg-white/5 border-white/10">
                        <Calendar size={16} />
                        Session Planner
                    </Button>
                    <Button size="sm" variant="solid" className="gap-2 bg-risk-critical hover:bg-red-600 shadow-risk-critical/20">
                        <ShieldAlert size={16} />
                        Emergency Mode
                    </Button>
                </div>
            </SectionHeader>

            <StatGroup>
                <KPICard 
                    icon={ShieldAlert} 
                    label="Active Perimeter" 
                    value={activeCases.length} 
                    trend="down" 
                    trendValue="12%" 
                />
                <KPICard 
                    icon={Users} 
                    label="New Referrals" 
                    value={interventions.length} 
                    trend="up" 
                    trendValue="4" 
                />
                <KPICard 
                    icon={Clock} 
                    label="Avg. Response" 
                    value="2.4h" 
                />
                <KPICard 
                    icon={CheckCircle} 
                    label="Resolution Rate" 
                    value="91%" 
                    trend="up" 
                    trendValue="2.4%" 
                />
            </StatGroup>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Referral Queue */}
                <Card className="lg:col-span-4 p-8 flex flex-col h-[750px] bg-slate-950/20">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Case Queue</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Priority Sorted</p>
                        </div>
                        <Badge variant="info" className="px-3 py-1">{activeCases.length}</Badge>
                    </div>
                    
                    <div className="relative mb-8 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Neural Student ID or Name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all placeholder:text-slate-600 font-bold"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {activeCases.map((caseItem) => (
                            <div 
                                key={caseItem.id}
                                onClick={() => setSelectedCase(caseItem)}
                                className={`p-5 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${
                                    selectedCase?.id === caseItem.id 
                                    ? 'bg-primary-600/10 border-primary-500/40 shadow-xl' 
                                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                                }`}
                            >
                                {selectedCase?.id === caseItem.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500" />
                                )}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col">
                                        <p className="text-white font-black text-sm uppercase tracking-tight">{caseItem.student_name}</p>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Year 3 • CS-202</span>
                                    </div>
                                    <RiskBadge level={caseItem.risk_status || 'Medium'} />
                                </div>
                                <p className="text-slate-400 text-xs font-bold mb-4 line-clamp-2 leading-relaxed italic opacity-80">"{caseItem.reason || 'Anomalous academic performance patterns detected by neural core.'}"</p>
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} className="text-slate-500" />
                                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Due: {caseItem.due_date ? new Date(caseItem.due_date).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <Badge variant="neutral" className="text-[9px] font-black uppercase tracking-widest border-none bg-white/5">{caseItem.type}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Case Management Panel */}
                <div className="lg:col-span-8 space-y-8 h-full">
                    {selectedCase ? (
                        <>
                            <Card className="p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                                    <BrainCircuit size={200} />
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row justify-between gap-8 mb-10 pb-10 border-b border-white/5">
                                        <div className="flex gap-8 items-center">
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full scale-0 group-hover:scale-125 transition-transform duration-700"></div>
                                                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl relative z-10 border border-white/10">
                                                    {selectedCase.student_name.charAt(0)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedCase.student_name}</h3>
                                                    <Badge variant="success">Active File</Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                                        <User size={14} className="text-primary-400" />
                                                        Senior Cohort
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                                        <Clock size={14} className="text-slate-500" />
                                                        Logged 2d ago
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3 h-fit items-center">
                                            <Button variant="ghost" size="sm" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl"><MessageCircle size={20} /></Button>
                                            <Button variant="ghost" size="sm" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl"><MoreHorizontal size={20} /></Button>
                                            <Button size="sm" className="bg-white text-slate-950 hover:bg-slate-200">Execute Protocol</Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                        <div className="space-y-8">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-5">Primary Risk Vectors</h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-risk-critical/5 border border-risk-critical/20">
                                                        <div className="flex items-center gap-3">
                                                            <Activity size={16} className="text-risk-critical" />
                                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Attendance</span>
                                                        </div>
                                                        <span className="text-[10px] font-black text-risk-critical uppercase">94% Loss</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-risk-medium/5 border border-risk-medium/20">
                                                        <div className="flex items-center gap-3">
                                                            <Target size={16} className="text-risk-medium" />
                                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Engagement</span>
                                                        </div>
                                                        <span className="text-[10px] font-black text-risk-medium uppercase">Deficit</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-5">
                                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Protocol Progress</h4>
                                                    <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">65%</span>
                                                </div>
                                                <div className="h-3 w-full bg-white/[0.03] rounded-full overflow-hidden p-1 border border-white/5">
                                                    <div className="h-full bg-primary-500 rounded-full shadow-[0_0_10px_#6366f1]" style={{ width: '65%' }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <div className="flex items-center justify-between mb-5">
                                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Sentiment Analysis</h4>
                                                <Badge variant="info" className="text-[9px]">v4.2 Engine</Badge>
                                            </div>
                                            <Card className="bg-white/[0.02] border-white/5 p-6 mb-8 hover:border-primary-500/20 transition-all group">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="p-2 bg-primary-500 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/20">
                                                        <BrainCircuit size={18} className="text-white" />
                                                    </div>
                                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Predictive Counselor Insight</p>
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed font-bold italic opacity-90 border-l-2 border-primary-500/50 pl-4 py-1">
                                                    "Based on recent message patterns and attendance drops, the student shows signs of high stress related to Module ICT-304. Neural signals suggest a 72% probability of course withdrawal without immediate intervention. Recommend prioritizing a 1-on-1 session."
                                                </p>
                                            </Card>
                                            
                                            <div className="flex gap-4">
                                                <Button variant="outline" size="sm" className="flex-1 gap-3 bg-white/5 border-white/5 hover:border-white/20 rounded-2xl py-4 uppercase text-[10px] tracking-widest font-black">
                                                    <History size={16} className="text-slate-400" />
                                                    Archival History
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1 gap-3 bg-white/5 border-white/5 hover:border-primary-500/20 rounded-2xl py-4 uppercase text-[10px] tracking-widest font-black">
                                                    <BarChart2 size={16} className="text-primary-400" />
                                                    Neural Vector Report
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                                <Card className="p-8 bg-slate-950/20">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Activity Density</h3>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Counseling Sessions per day</p>
                                        </div>
                                        <Badge variant="neutral" className="bg-white/5 border-none">7D Cycle</Badge>
                                    </div>
                                    <div className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={sessionHistoryData}>
                                                <defs>
                                                    <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                                <XAxis dataKey="date" stroke="#475569" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} tickMargin={10} />
                                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }} />
                                                <Area type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={4} fill="url(#sessionGradient)" animationDuration={2000} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Card className="p-8 bg-slate-950/20">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Timeline Directive</h3>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Upcoming Interactions</p>
                                        </div>
                                        <Clock size={18} className="text-slate-600" />
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { time: '14:00', student: 'Alice Johnson', type: 'Mentorship Sync', urgency: 'Low' },
                                            { time: '16:30', student: 'Bob Smith', type: 'Crisis Protocol', urgency: 'High' }
                                        ].map((session, i) => (
                                            <div key={i} className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-white text-xs shadow-lg group-hover:scale-105 transition-transform">
                                                        {session.time}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white uppercase tracking-tight">{session.student}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{session.type}</p>
                                                            <div className={`w-1 h-1 rounded-full ${session.urgency === 'High' ? 'bg-risk-critical animate-pulse shadow-[0_0_5px_#ef4444]' : 'bg-slate-700'}`} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="p-3 bg-white/5 opacity-0 group-hover:opacity-100 transition-all rounded-xl">
                                                    <ArrowUpRight size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="h-[750px] flex items-center justify-center">
                            <Card className="p-16 text-center border-dashed border-2 border-white/5 bg-transparent max-w-lg">
                                <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-8 shadow-2xl relative group">
                                    <div className="absolute inset-0 bg-primary-500/5 blur-3xl rounded-full scale-150 group-hover:scale-110 transition-transform duration-1000"></div>
                                    <User className="text-slate-700 group-hover:text-primary-500 transition-colors" size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Awaiting Selection</h3>
                                <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">Please select a student record from the localized case queue to initialize the counseling management interface.</p>
                                <Button variant="outline" className="mt-10 border-white/10 hover:bg-white/5 rounded-2xl uppercase text-[10px] font-black tracking-widest px-10">Initialize Queue</Button>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CounselorDashboard;
