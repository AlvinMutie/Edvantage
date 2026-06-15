import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
    Cell, PieChart, Pie
} from 'recharts';
import { 
    TrendingUp, Users, Target, AlertTriangle, 
    Activity, BrainCircuit, Globe, ArrowUpRight,
    Filter, Calendar, Download
} from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import RiskBadge from '../components/ui/RiskBadge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';

const Analytics = () => {
    const [cohorts, setCohorts] = useState([]);
    const [predictions, setPredictions] = useState({ current: {}, predictions: [] });
    const [heatmap, setHeatmap] = useState({ heatmap: {}, departments: [], semesters: [] });
    const [overviewStats, setOverviewStats] = useState(null);
    const [groupBy, setGroupBy] = useState('department');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalyticsData();
    }, [groupBy]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const [cohortRes, predictionRes, heatmapRes, statsRes] = await Promise.all([
                api.get(`/analytics/cohort-analysis?group_by=${groupBy}`),
                api.get('/analytics/trend-prediction'),
                api.get('/analytics/risk-heatmap'),
                api.get('/analytics/overview-stats')
            ]);

            setCohorts(cohortRes.data.cohorts);
            setPredictions(predictionRes.data);
            setHeatmap(heatmapRes.data);
            setOverviewStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium animate-pulse">Processing Institutional Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-12">
            <SectionHeader 
                title="Institutional Analytics" 
                description="High-fidelity performance monitoring and predictive student outcomes."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Calendar size={16} />
                        Filter Period
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Download size={16} />
                        Export Intelligence
                    </Button>
                </div>
            </SectionHeader>

            {/* Overview Stats */}
            {overviewStats && (
                <StatGroup>
                    <KPICard
                        icon={Users}
                        label="Total Population"
                        value={overviewStats.total_students}
                        trend="up"
                        trendValue="12.5%"
                    />
                    <KPICard
                        icon={AlertTriangle}
                        label="Risk Concentration"
                        value={`${overviewStats.at_risk_percentage}%`}
                        trend="down"
                        trendValue="2.1%"
                    />
                    <KPICard
                        icon={Target}
                        label="Aggregate GPA"
                        value={overviewStats.avg_gpa.toFixed(2)}
                        trend="up"
                        trendValue="0.05"
                    />
                    <KPICard
                        icon={Activity}
                        label="Average Attendance"
                        value={`${overviewStats.avg_attendance.toFixed(1)}%`}
                    />
                </StatGroup>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Cohort Analysis */}
                <Card className="lg:col-span-8 p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Cohort Distribution</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Comparing performance metrics by group</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-4 mr-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                    <div className="w-2 h-2 rounded-full bg-primary-500" /> GPA
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> Attendance
                                </div>
                            </div>
                            <select
                                value={groupBy}
                                onChange={(e) => setGroupBy(e.target.value)}
                                className="bg-white/5 border border-white/10 text-white text-xs font-bold px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="department" className="bg-slate-900">By Department</option>
                                <option value="semester" className="bg-slate-900">By Semester</option>
                            </select>
                        </div>
                    </div>

                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cohorts}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(8px)' }}
                                    labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
                                />
                                <Bar dataKey="avg_gpa" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} name="GPA" />
                                <Bar dataKey="avg_attendance" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} name="Attendance %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Risk Radar / AI Insights */}
                <Card className="lg:col-span-4 p-8 bg-primary-600/10 border-primary-500/20 relative overflow-hidden">
                    <BrainCircuit className="absolute -right-8 -bottom-8 text-primary-500/10" size={200} />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/30">
                                <BrainCircuit className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">AI Advisory</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                <Badge variant="warning" className="text-[10px] mb-3">Anomaly Detected</Badge>
                                <p className="text-sm text-white font-medium leading-relaxed">Attendance levels in Semester 3 Computer Science have dropped 14% below the institutional average.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                <Badge variant="success" className="text-[10px] mb-3">Optimization</Badge>
                                <p className="text-sm text-white font-medium leading-relaxed">New peer-tutoring initiative has correlated with a 0.3 GPA increase across identified high-risk cohorts.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                <Badge variant="info" className="text-[10px] mb-3">Strategic Insight</Badge>
                                <p className="text-sm text-white font-medium leading-relaxed">Predicted 92% retention rate if intervention coverage reaches 85% of at-risk students by next month.</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Trend Predictions */}
                <Card className="lg:col-span-5 p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Predictive Trends</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">6-Month outcome projection</p>
                        </div>
                        <Badge variant="info">ML v2.4</Badge>
                    </div>

                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={predictions.predictions}>
                                <defs>
                                    <linearGradient id="gpaPred" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="period" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                />
                                <Area type="monotone" dataKey="predicted_gpa" stroke="#6366f1" strokeWidth={3} fill="url(#gpaPred)" name="GPA Forecast" />
                                <Area type="monotone" dataKey="predicted_attendance" stroke="#10b981" strokeWidth={3} fill="transparent" strokeDasharray="5 5" name="Attendance Forecast" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Baseline</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-black text-white">{predictions.current.avg_gpa} GPA</span>
                                <TrendingUp size={16} className="text-emerald-500" />
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Model Confidence</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-black text-white">94.2%</span>
                                <BrainCircuit size={16} className="text-primary-500" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Risk Heatmap */}
                <Card className="lg:col-span-7 p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Risk Matrix</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Cross-sectional risk concentration</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-sm bg-emerald-900/40" />
                            <div className="w-3 h-3 rounded-sm bg-emerald-600/60" />
                            <div className="w-3 h-3 rounded-sm bg-amber-600/60" />
                            <div className="w-3 h-3 rounded-sm bg-red-600/80" />
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full border-separate border-spacing-2">
                            <thead>
                                <tr>
                                    <th className="p-2"></th>
                                    {heatmap.semesters.map(sem => (
                                        <th key={sem} className="text-[10px] font-black text-slate-500 uppercase tracking-widest p-2">Sem {sem}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {heatmap.departments.map(dept => (
                                    <tr key={dept}>
                                        <td className="text-xs font-black text-white p-2 whitespace-nowrap">{dept}</td>
                                        {heatmap.semesters.map(sem => {
                                            const cell = heatmap.heatmap[dept]?.[sem];
                                            const intensity = cell?.intensity || 0;
                                            const colorClass =
                                                intensity > 75 ? 'bg-red-500/80 border-red-500/20' :
                                                intensity > 50 ? 'bg-amber-500/60 border-amber-500/20' :
                                                intensity > 25 ? 'bg-emerald-500/40 border-emerald-500/20' :
                                                'bg-white/5 border-white/5';

                                            return (
                                                <td key={sem} className="min-w-[80px]">
                                                    {cell ? (
                                                        <div className={`aspect-video rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer ${colorClass}`}>
                                                            <div className="text-sm font-black text-white">{cell.risk_percentage}%</div>
                                                            <div className="text-[8px] font-bold text-white/50 uppercase tracking-tighter">{cell.at_risk}/{cell.total}</div>
                                                        </div>
                                                    ) : (
                                                        <div className="aspect-video rounded-xl border border-dashed border-white/5 flex items-center justify-center text-slate-700">
                                                            -
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;

