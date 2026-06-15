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
    Lightbulb
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
            <div className="flex items-center justify-center h-screen bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium animate-pulse">Orchestrating your success...</p>
                </div>
            </div>
        );
    }

    if (!overview) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-950">
                <Card className="p-8 text-center max-w-md">
                    <TriangleAlert size={48} className="text-risk-critical mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Sync Error</h2>
                    <p className="text-slate-400 mb-6">We couldn't retrieve your academic profile. Please try refreshing or contact support.</p>
                    <Button onClick={() => window.location.reload()}>Retry Sync</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
            {/* Hero Section */}
            <SectionHeader 
                title={`Welcome back, ${overview.student.full_name.split(' ')[0]}!`}
                description="Your academic journey is on track. Here's what's happening today."
            >
                <div className="hidden md:flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-white">System Active</span>
                </div>
            </SectionHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
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
                            label="Risk Status" 
                            value={
                                <RiskBadge level={riskData?.risk_level || 'Low'} className="text-lg px-4 py-1.5" />
                            } 
                            icon={TriangleAlert}
                        />
                    </StatGroup>

                    {/* Performance Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <TrendingUp size={18} className="text-primary-400" />
                                    GPA Progression
                                </h3>
                                <Badge variant="info">Semester 1</Badge>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={gpaTrend}>
                                        <defs>
                                            <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} domain={[0, 4]} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', backdropBlur: '12px' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Calendar size={18} className="text-success-400" />
                                    Attendance Trend
                                </h3>
                                <Badge variant="success">Active</Badge>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={attendanceTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', backdropBlur: '12px' }}
                                            cursor={{ fill: '#ffffff05' }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {attendanceTrend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.value > 90 ? '#10b981' : '#3b82f6'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Gamification & Goals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <Star size={18} className="text-yellow-500" />
                                Achievements & Badges
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {achievements.map((achievement) => (
                                    <div key={achievement.id} className="flex flex-col items-center text-center group cursor-pointer">
                                        <div className={`w-16 h-16 rounded-2xl ${achievement.bg} border border-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                            <achievement.icon size={28} className={achievement.color} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">
                                            {achievement.title}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex flex-col items-center text-center opacity-40 grayscale group cursor-not-allowed">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-3">
                                        <Target size={28} className="text-slate-400" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">
                                        Goal Smasher
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <Target size={18} className="text-indigo-400" />
                                Learning Goals
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { title: 'Maintain 3.5 GPA', progress: 85, color: 'bg-primary-500' },
                                    { title: 'Complete JS Project', progress: 60, color: 'bg-indigo-500' },
                                    { title: 'Attendance > 95%', progress: 92, color: 'bg-success-500' }
                                ].map((goal, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-white">{goal.title}</span>
                                            <span className="text-slate-400">{goal.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${goal.color} rounded-full transition-all duration-1000`} 
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
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-6 bg-primary-600/10 border-primary-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BrainCircuit size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-primary-500 rounded-lg">
                                    <BrainCircuit size={20} className="text-white" />
                                </div>
                                <h3 className="font-black text-white text-xl uppercase tracking-tighter">AI Insights</h3>
                            </div>
                            
                            {riskData && (
                                <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-bold text-slate-400">Risk Score</span>
                                        <RiskBadge level={riskData.risk_level} />
                                    </div>
                                    <div className="text-4xl font-black text-white mb-2">{riskData.risk_score}%</div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${riskData.risk_score > 70 ? 'bg-risk-critical' : riskData.risk_score > 40 ? 'bg-risk-medium' : 'bg-risk-low'} rounded-full`}
                                            style={{ width: `${riskData.risk_score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-primary-400 uppercase tracking-widest flex items-center gap-2">
                                    <Lightbulb size={14} />
                                    Strategic Actions
                                </h4>
                                {suggestions.length > 0 ? (
                                    suggestions.map((suggestion, index) => (
                                        <div key={index} className="group p-4 bg-slate-900/50 border border-white/5 hover:border-primary-500/30 rounded-2xl transition-all">
                                            <div className="flex items-start justify-between mb-2">
                                                <Badge 
                                                    variant={suggestion.priority === 'high' ? 'error' : suggestion.priority === 'medium' ? 'warning' : 'info'}
                                                    className="text-[10px] py-0.5"
                                                >
                                                    {suggestion.priority}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{suggestion.category}</span>
                                            </div>
                                            <p className="text-sm text-slate-300 font-medium mb-3 leading-relaxed">
                                                {suggestion.message}
                                            </p>
                                            <button className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all">
                                                <CircleCheckBig size={14} className="text-primary-400" />
                                                {suggestion.action}
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500 text-sm italic">No urgent insights at this time.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-slate-900/50">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-slate-400" />
                            Recent Activity
                        </h3>
                        <div className="space-y-6 relative">
                            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-white/5"></div>
                            {[
                                { title: 'GPA Updated', time: '2 hours ago', icon: TrendingUp, color: 'text-primary-400' },
                                { title: 'New Achievement', time: 'Yesterday', icon: Flame, color: 'text-orange-500' },
                                { title: 'Assignment Graded', time: '2 days ago', icon: BookOpen, color: 'text-success-400' }
                            ].map((activity, idx) => (
                                <div key={idx} className="relative flex gap-4 pl-8 group">
                                    <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-950 z-10 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 group-hover:scale-125 transition-transform"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-none mb-1">{activity.title}</p>
                                        <p className="text-xs text-slate-500">{activity.time}</p>
                                    </div>
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
