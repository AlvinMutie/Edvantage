import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    TrendingUp,
    Calendar,
    BookOpen,
    AlertTriangle,
    CheckCircle2,
    Target,
    Award,
    Clock
} from 'lucide-react';

const StudentDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [riskData, setRiskData] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading

    ] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Overview (Critical - creates profile if missing)
            try {
                const overviewRes = await api.get('/student-dashboard/overview');
                setOverview(overviewRes.data);
            } catch (err) {
                console.error('Critical Error: Failed to load overview', err);
                // If overview fails, we can't show much, so stop here
                setLoading(false);
                return;
            }

            // 2. Fetch Risk Data (Non-critical)
            try {
                const riskRes = await api.get('/student-dashboard/risk');
                setRiskData(riskRes.data);
            } catch (err) {
                console.warn('Failed to load risk data', err);
                // Set default/empty risk data if failed
                setRiskData({ risk_score: 0, risk_level: 'Unknown', factors: { gpa: 0, attendance: 0, missed_deadlines: 0 } });
            }

            // 3. Fetch Suggestions (Non-critical)
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

    const getRiskColor = (level) => {
        switch (level) {
            case 'High': return 'bg-red-500/10 border-red-500/20 text-red-400';
            case 'Medium': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
            case 'Low': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
            default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
            case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-white text-xl">Loading your dashboard...</div>
            </div>
        );
    }

    if (!overview) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-400 text-xl">Failed to load dashboard</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
                <p className="text-slate-400 mt-2">Welcome back, {overview.student.full_name}</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Award}
                    label="GPA"
                    value={overview.stats.gpa.toFixed(2)}
                    color="bg-indigo-600"
                    trend={overview.stats.gpa >= 3.0 ? '+' : ''}
                />
                <StatCard
                    icon={Calendar}
                    label="Attendance"
                    value={`${overview.stats.attendance.toFixed(1)}%`}
                    color="bg-blue-600"
                />
                <StatCard
                    icon={BookOpen}
                    label="Assignments"
                    value={`${overview.stats.graded_assignments}/${overview.stats.total_assignments}`}
                    color="bg-emerald-600"
                    subtitle="Graded"
                />
                <StatCard
                    icon={Target}
                    label="Avg Score"
                    value={`${overview.stats.avg_assignment_score.toFixed(1)}%`}
                    color="bg-amber-600"
                />
            </div>

            {/* AI Risk Assessment */}
            {riskData && (
                <div className={`rounded-2xl border p-6 ${getRiskColor(riskData.risk_level)}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">AI Risk Assessment</h2>
                            <p className="opacity-80 mb-4">
                                Based on your current GPA, attendance, and deadlines
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-bold">{riskData.risk_score}%</div>
                            <div className="text-sm opacity-80 mt-1">{riskData.risk_level} Risk</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-current/20">
                        <div>
                            <div className="text-sm opacity-70">GPA</div>
                            <div className="text-xl font-bold">{riskData.factors.gpa}</div>
                        </div>
                        <div>
                            <div className="text-sm opacity-70">Attendance</div>
                            <div className="text-xl font-bold">{riskData.factors.attendance}%</div>
                        </div>
                        <div>
                            <div className="text-sm opacity-70">Missed Deadlines</div>
                            <div className="text-xl font-bold">{riskData.factors.missed_deadlines}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle size={24} className="text-amber-400" />
                        Personalized Suggestions
                    </h3>
                    <div className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-xl border ${getPriorityColor(suggestion.priority)}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wide opacity-70">
                                                {suggestion.category}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${suggestion.priority === 'high' ? 'bg-red-500/20' :
                                                suggestion.priority === 'medium' ? 'bg-amber-500/20' :
                                                    'bg-blue-500/20'
                                                }`}>
                                                {suggestion.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm mb-2">{suggestion.message}</p>
                                        <button className="text-xs font-bold opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1">
                                            <CheckCircle2 size={14} />
                                            {suggestion.action}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard
                    icon={BookOpen}
                    title="View Assignments"
                    description="Check your pending and graded assignments"
                    color="bg-indigo-600"
                />
                <ActionCard
                    icon={Calendar}
                    title="Attendance History"
                    description="Review your attendance record"
                    color="bg-blue-600"
                />
                <ActionCard
                    icon={TrendingUp}
                    title="Performance Trends"
                    description="See how you're progressing over time"
                    color="bg-emerald-600"
                />
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, trend, subtitle }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="text-white" size={24} />
            </div>
            {trend && (
                <span className="text-emerald-400 text-sm font-bold">{trend}</span>
            )}
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-slate-400">{label}</div>
        {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </div>
);

const ActionCard = ({ icon: Icon, title, description, color }) => (
    <button className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all text-left group">
        <div className={`p-3 rounded-xl ${color} inline-flex mb-4`}>
            <Icon className="text-white" size={24} />
        </div>
        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
    </button>
);

export default StudentDashboard;
