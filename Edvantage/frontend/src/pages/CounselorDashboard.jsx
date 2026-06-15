import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, Users, Calendar, CheckCircle, Clock, 
  Search, Filter, MoreHorizontal, User, BarChart2, 
  MessageCircle, History, BrainCircuit
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

    const activeCases = interventions.filter(i => i.status === 'open');
    const resolvedCases = interventions.filter(i => i.status === 'closed');

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Loading Counseling Core...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 pb-12 animate-in fade-in duration-700">
            <SectionHeader 
                title="Counseling Workspace" 
                description={`Welcome back, ${user?.full_name}. You have ${activeCases.length} urgent cases.`}
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Calendar size={16} />
                        Schedule
                    </Button>
                    <Button size="sm" className="gap-2">
                        <ShieldAlert size={16} />
                        Emergency
                    </Button>
                </div>
            </SectionHeader>

            <StatGroup>
                <KPICard 
                    icon={ShieldAlert} 
                    label="Active Cases" 
                    value={activeCases.length} 
                    trend="down" 
                    trendValue="12%" 
                />
                <KPICard 
                    icon={Users} 
                    label="Referrals" 
                    value={interventions.length} 
                    trend="up" 
                    trendValue="4" 
                />
                <KPICard 
                    icon={Calendar} 
                    label="Sessions Today" 
                    value="3" 
                />
                <KPICard 
                    icon={CheckCircle} 
                    label="Success Rate" 
                    value="91%" 
                    trend="up" 
                    trendValue="2.4%" 
                />
            </StatGroup>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Referral Queue */}
                <Card className="lg:col-span-4 p-6 flex flex-col h-[700px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Case Queue</h3>
                        <Badge variant="info">{activeCases.length}</Badge>
                    </div>
                    
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search students..." 
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {activeCases.map((caseItem) => (
                            <div 
                                key={caseItem.id}
                                onClick={() => setSelectedCase(caseItem)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                    selectedCase?.id === caseItem.id 
                                    ? 'bg-primary-600/10 border-primary-500/30' 
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-white font-bold text-sm">{caseItem.student_name}</p>
                                    <RiskBadge level={caseItem.risk_status || 'Medium'} />
                                </div>
                                <p className="text-slate-400 text-xs mb-3 line-clamp-1">{caseItem.reason || 'Academic performance decline detected.'}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500 font-medium">Due: {caseItem.due_date ? new Date(caseItem.due_date).toLocaleDateString() : 'N/A'}</span>
                                    <Badge variant="neutral" className="text-[9px] uppercase">{caseItem.type}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Case Management Panel */}
                <div className="lg:col-span-8 space-y-8">
                    {selectedCase ? (
                        <>
                            <Card className="p-8">
                                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-white/5">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                                            {selectedCase.student_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-1">{selectedCase.student_name}</h3>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="info">Year 3 Student</Badge>
                                                <div className="flex items-center gap-1 text-slate-500 text-sm">
                                                    <Clock size={14} />
                                                    Joined 2 days ago
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 h-fit">
                                        <Button variant="ghost" size="sm" className="p-2 h-auto"><MessageCircle size={18} /></Button>
                                        <Button variant="ghost" size="sm" className="p-2 h-auto"><MoreHorizontal size={18} /></Button>
                                        <Button size="sm">Open Case File</Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Risk Factors</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-risk-critical/5 border border-risk-critical/10">
                                                    <span className="text-xs text-white">Attendance</span>
                                                    <span className="text-xs font-bold text-risk-critical">Critical</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-risk-medium/5 border border-risk-medium/10">
                                                    <span className="text-xs text-white">Engagement</span>
                                                    <span className="text-xs font-bold text-risk-medium">Low</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Intervention Progress</h4>
                                            <div className="space-y-4">
                                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '65%' }} />
                                                </div>
                                                <p className="text-xs text-slate-400 text-center">65% Towards Resolution</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">AI Sentiment Analysis</h4>
                                        <Card className="bg-white/[0.02] border-none p-4 mb-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <BrainCircuit className="text-primary-400" size={20} />
                                                <p className="text-sm font-bold text-white">Counselor Insight</p>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed italic">
                                                "Based on recent message patterns and attendance drops, the student shows signs of high stress related to Module ICT-304. Recommend prioritizing a 1-on-1 session."
                                            </p>
                                        </Card>
                                        
                                        <div className="flex gap-4">
                                            <Button variant="outline" size="sm" className="flex-1 gap-2">
                                                <History size={16} />
                                                View History
                                            </Button>
                                            <Button variant="solid" size="sm" className="flex-1 gap-2">
                                                <BarChart2 size={16} />
                                                Risk Report
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-white">Session Activity</h3>
                                        <Badge variant="neutral">This Week</Badge>
                                    </div>
                                    <div className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={sessionHistoryData}>
                                                <defs>
                                                    <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                <Area type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={2} fill="url(#sessionGradient)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-white">Upcoming Sessions</h3>
                                        <Clock size={18} className="text-slate-500" />
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { time: '14:00', student: 'Alice Johnson', type: 'Mentorship' },
                                            { time: '16:30', student: 'Bob Smith', type: 'Crisis Counsel' }
                                        ].map((session, i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                                                        {session.time}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{session.student}</p>
                                                        <p className="text-[10px] text-slate-500">{session.type}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="p-2 h-auto">
                                                    <ArrowUpRight size={14} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <Card className="p-12 text-center border-dashed border-2">
                                <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6">
                                    <User className="text-slate-500" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Case Selected</h3>
                                <p className="text-slate-400 max-w-xs mx-auto">Select a student from the queue on the left to manage their counseling case.</p>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CounselorDashboard;

