import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    TrendingUp,
    Calendar,
    BookOpen,
    TriangleAlert,
    CircleCheckBig,
    Target,
    Award,
    Clock,
    Zap,
    Flame,
    Star,
    ChevronRight,
    BrainCircuit,
    Lightbulb,
    ArrowUpRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

// UI Components
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import RiskBadge from '../components/ui/RiskBadge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';
import Skeleton from '../components/ui/Skeleton';

const StudentDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [riskData, setRiskData] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock trend data for visualization
    const gpaTrend = [
        { name: 'Sep', value: 3.2 },
        { name: 'Oct', value: 3.1 },
        { name: 'Nov', value: 3.4 },
        { name: 'Dec', value: 3.3 },
        { name: 'Jan', value: 3.5 },
        { name: 'Feb', value: overview?.stats?.gpa || 3.6 },
    ];

    const attendanceTrend = [
        { name: 'Sep', value: 95 },
        { name: 'Oct', value: 88 },
        { name: 'Nov', value: 92 },
        { name: 'Dec', value: 85 },
        { name: 'Jan', value: 90 },
        { name: 'Feb', value: overview?.stats?.attendance || 94 },
    ];

    const achievements = [
        { id: 1, title: 'Perfect Attendance', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { id: 2, title: 'Top Performer', icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { id: 3, title: 'Early Submitter', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    ];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            try {
                const overviewRes = await api.get('/student-dashboard/overview');
                setOverview(overviewRes.data);
            } catch (err) {
                console.error('Critical Error: Failed to load overview', err);
                setLoading(false);
                return;
            }

            try {
                const riskRes = await api.get('/student-dashboard/risk');
                setRiskData(riskRes.data);
            } catch (err) {
                console.warn('Failed to load risk data', err);
                setRiskData({ risk_score: 0, risk_level: 'Low', factors: { gpa: 0, attendance: 0, missed_deadlines: 0 } });
            }

            try {
                const suggestionsRes = await api.get('/student-dashboard/suggestions');
                setSuggestions(suggestionsRes.data.suggestions);
            } catch (err) {
                console.warn('Failed to load suggestions', err);
                setSuggestions([]);
            }

        } catch (error) {
            console.error('Unexpected error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-10">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Skeleton className="h-64" />
                            <Skeleton className="h-64" />
                        </div>
                        <Skeleton className="h-80" />
                    </div>
                    <div className="lg:col-span-4">
                        <Skeleton className="h-[600px]" />
                    </div>
                </div>
            </div>
        );
    }

    if (!overview) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="p-12 text-center max-w-md border-dashed">
                    <TriangleAlert size={48} className="text-risk-critical mx-auto mb-6 opacity-50" />
                    <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Sync Disrupted</h2>
                    <p className="text-slate-500 font-bold mb-8">We couldn't retrieve your academic profile from the neural core.</p>
                    <Button onClick={() => window.location.reload()} className="w-full">Re-establish Sync</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-12">
            {/* Hero Section */}
            <SectionHeader 
                title={`Welcome back, ${overview.student.full_name.split(' ')[0]}!`}
                description="Your academic trajectory is being monitored in real-time."
            >
                <div className="hidden md:flex items-center gap-3 bg-white/[0.03] backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl shadow-xl shadow-black/20">
                    <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Matrix Connect</span>
                </div>
            </SectionHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Key Stats */}
                    <StatGroup>
                        <KPICard 
                            label="Current GPA" 
                            value={overview.stats.gpa.toFixed(2)} 
                            trend="up" 
                            trendValue="+0.2"
                            icon={Award}
                        />
                        <KPICard 
                            label="Attendance" 
                            value={`${overview.stats.attendance.toFixed(1)}%`} 
                            icon={Calendar}
                        />
                        <KPICard 
                            label="Assignments" 
                            value={`${overview.stats.graded_assignments}/${overview.stats.total_assignments}`} 
                            icon={BookOpen}
                        />
                        <KPICard 
                            label="Risk Perimeter" 
                            value={
                                <RiskBadge level={riskData?.risk_level || 'Low'} className="text-sm px-4 py-1.5" />
                            } 
                            icon={TriangleAlert}
                        />
                    </StatGroup>

                    {/* Performance Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8 bg-slate-950/20">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                        <TrendingUp size={20} className="text-primary-400" />
                                        GPA Trajectory
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Semester Performance</p>
                                </div>
                                <Badge variant="info">Current</Badge>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={gpaTrend}>
                                        <defs>
                                            <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontWeight="black" tickMargin={10} />
                                        <YAxis stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontWeight="black" domain={[0, 4]} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorGpa)" animationDuration={2000} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-8 bg-slate-950/20">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                        <Calendar size={20} className="text-success-400" />
                                        Presence Log
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Historical Engagement</p>
                                </div>
                                <Badge variant="success">Steady</Badge>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={attendanceTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontWeight="black" tickMargin={10} />
                                        <YAxis stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontWeight="black" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }}
                                            cursor={{ fill: '#ffffff03' }}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32} animationDuration={1500}>
                                            {attendanceTrend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.value > 90 ? '#10b981' : '#6366f1'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Gamification & Goals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                    <Star size={20} className="text-yellow-500" />
                                    Unlocked Artifacts
                                </h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">3 / 12 badges</p>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                {achievements.map((achievement) => (
                                    <div key={achievement.id} className="flex flex-col items-center text-center group cursor-pointer">
                                        <div className={`w-20 h-20 rounded-[2rem] ${achievement.bg} border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-black/40`}>
                                            <achievement.icon size={32} className={achievement.color} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight group-hover:text-white transition-colors">
                                            {achievement.title}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex flex-col items-center text-center opacity-20 grayscale filter blur-[1px]">
                                    <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center mb-4">
                                        <Target size={32} className="text-slate-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                                        Goal Smasher
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                    <Target size={20} className="text-indigo-400" />
                                    Active Objectives
                                </h3>
                                <Button variant="ghost" size="sm" className="bg-white/5">Edit</Button>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { title: 'Maintain 3.5 GPA', progress: 85, color: 'bg-primary-500' },
                                    { title: 'Complete JS Project', progress: 60, color: 'bg-indigo-500' },
                                    { title: 'Attendance > 95%', progress: 92, color: 'bg-success-500' }
                                ].map((goal, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-white">{goal.title}</span>
                                            <span className="text-slate-500">{goal.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden p-0.5 border border-white/5">
                                            <div 
                                                className={`h-full ${goal.color} rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
                                                style={{ width: `${goal.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* AI Insights Panel */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-8 bg-primary-600/10 border-primary-500/20 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 p-12 opacity-[0.05] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                            <BrainCircuit size={200} />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-primary-500 rounded-2xl shadow-xl shadow-primary-500/20">
                                    <BrainCircuit size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-2xl uppercase tracking-tighter">Neural Core</h3>
                                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mt-1">Intelligence Layer</p>
                                </div>
                            </div>
                            
                            {riskData && (
                                <div className="mb-8 p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] shadow-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stability Index</span>
                                        <RiskBadge level={riskData.risk_level} />
                                    </div>
                                    <div className="text-5xl font-black text-white mb-3 tracking-tighter">{100 - riskData.risk_score}%</div>
                                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <div 
                                            className={`h-full ${riskData.risk_score > 70 ? 'bg-risk-critical shadow-[0_0_10px_#ef4444]' : riskData.risk_score > 40 ? 'bg-risk-medium shadow-[0_0_10px_#f59e0b]' : 'bg-success-500 shadow-[0_0_10px_#10b981]'} rounded-full transition-all duration-1000`}
                                            style={{ width: `${100 - riskData.risk_score}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 mt-4 text-center uppercase tracking-widest">Prediction Confidence: 98.4%</p>
                                </div>
                            )}

                            <div className="space-y-4 flex-1">
                                <h4 className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                    <Lightbulb size={14} />
                                    Strategic Directives
                                </h4>
                                {suggestions.length > 0 ? (
                                    suggestions.map((suggestion, index) => (
                                        <div key={index} className="group p-5 bg-slate-950/40 border border-white/5 hover:border-primary-500/30 rounded-2xl transition-all duration-300">
                                            <div className="flex items-start justify-between mb-3">
                                                <Badge 
                                                    variant={suggestion.priority === 'high' ? 'error' : suggestion.priority === 'medium' ? 'warning' : 'info'}
                                                    className="text-[9px] py-0.5 uppercase tracking-widest"
                                                >
                                                    {suggestion.priority}
                                                </Badge>
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{suggestion.category}</span>
                                            </div>
                                            <p className="text-sm text-slate-300 font-bold mb-5 leading-relaxed">
                                                {suggestion.message}
                                            </p>
                                            <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-primary-500 hover:text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300">
                                                <CircleCheckBig size={14} className="group-hover:text-white transition-colors" />
                                                {suggestion.action}
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No active directives.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 bg-slate-950/20">
                        <h3 className="font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                            <Clock size={20} className="text-slate-400" />
                            Timeline Events
                        </h3>
                        <div className="space-y-8 relative">
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/5"></div>
                            {[
                                { title: 'GPA Recalibrated', time: '2 hours ago', icon: TrendingUp, color: 'text-primary-400' },
                                { title: 'Achievement Unlocked', time: 'Yesterday', icon: Flame, color: 'text-orange-500' },
                                { title: 'Evaluation Recorded', time: '2 days ago', icon: BookOpen, color: 'text-success-400' }
                            ].map((activity, idx) => (
                                <div key={idx} className="relative flex gap-6 pl-10 group">
                                    <div className="absolute left-0 top-1 w-[24px] h-[24px] rounded-full bg-slate-900 border-2 border-white/10 z-10 flex items-center justify-center transition-all group-hover:border-primary-500/50">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 group-hover:scale-125 transition-transform shadow-[0_0_8px_#6366f1]"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white leading-none mb-1 group-hover:text-primary-400 transition-colors uppercase tracking-tight">{activity.title}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activity.time}</p>
                                    </div>
                                    <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-all text-slate-600" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
