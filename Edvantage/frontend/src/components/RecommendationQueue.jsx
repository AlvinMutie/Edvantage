import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Lightbulb, Check, X, AlertCircle, TrendingDown, Info, ChevronRight, BarChart2 } from 'lucide-react';

const RecommendationQueue = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchRecommendations();
        fetchStats();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const res = await api.get('/interventions/recommendations');
            setRecommendations(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch recommendations', err);
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/interventions/analytics/effectiveness');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch analytics', err);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.post(`/interventions/recommendations/${id}/approve`, {});
            setRecommendations(recommendations.filter(r => r.id !== id));
        } catch (err) {
            alert('Approval failed');
        }
    };

    const handleReject = async (id) => {
        const notes = prompt('Enter rejection reason:');
        if (notes === null) return;
        try {
            await api.post(`/interventions/recommendations/${id}/reject`, { notes });
            setRecommendations(recommendations.filter(r => r.id !== id));
        } catch (err) {
            alert('Rejection failed');
        }
    };

    if (loading) return <div className="text-slate-500 p-4 animate-pulse">Loading prescriptions...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Lightbulb className="text-amber-400" size={20} />
                        Recommended Actions
                    </h3>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                        {recommendations.length} Pending
                    </span>
                </div>

                {recommendations.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
                        No pending intervention recommendations.
                    </div>
                ) : (
                    recommendations.map(rec => (
                        <div key={rec.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all group">
                            <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg ${rec.urgency_score > 0.8 ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
                                        <AlertCircle className={rec.urgency_score > 0.8 ? 'text-red-500' : 'text-blue-500'} size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{rec.template_name}</h4>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{rec.intervention_type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleReject(rec.id)}
                                        className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-lg transition-colors"
                                        title="Reject Recommendation"
                                    >
                                        <X size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleApprove(rec.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                                    >
                                        <Check size={14} />
                                        Approve
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-4 flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1 font-medium text-white">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            {rec.student_name}
                                        </span>
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            rec.risk_level === 'Critical' ? 'bg-red-500/20 text-red-500' :
                                            rec.risk_level === 'High' ? 'bg-amber-500/20 text-amber-500' :
                                            'bg-blue-500/20 text-blue-500'
                                        }`}>
                                            {rec.risk_level} Risk
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Triggering Evidence</p>
                                        <div className="flex flex-wrap gap-2">
                                            {rec.evidence.map((ev, i) => (
                                                <div key={i} className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
                                                    <span className="text-[10px] text-slate-400 capitalize">{ev.metric}:</span>
                                                    <span className="text-[10px] font-bold text-white">{ev.value}{ev.metric === 'attendance' ? '%' : ''}</span>
                                                    {ev.trend === 'declining' && <TrendingDown size={10} className="text-red-500" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-32 flex flex-col justify-center md:border-l border-slate-800 md:pl-4 space-y-3 border-t md:border-t-0 pt-3 md:pt-0">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-slate-500">
                                            <span>Urgency</span>
                                            <span>{Math.round(rec.urgency_score * 100)}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${rec.urgency_score > 0.8 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                                style={{ width: `${rec.urgency_score * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-slate-500">
                                            <span>Confid.</span>
                                            <span>{Math.round(rec.confidence_score * 100)}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500 rounded-full" 
                                                style={{ width: `${rec.confidence_score * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <BarChart2 className="text-indigo-400" size={18} />
                        Intervention Impact
                    </h3>
                    
                    {stats ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Success Rate</p>
                                    <p className="text-xl font-bold text-white">{Math.round(stats.completion_rate * 100)}%</p>
                                </div>
                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Avg. Effectiveness</p>
                                    <p className="text-xl font-bold text-white">{Math.round(stats.avg_effectiveness_score * 100)}%</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Best Performing Types</p>
                                {stats.by_type && stats.by_type.sort((a, b) => b.effectiveness - a.effectiveness).slice(0, 3).map((type, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <span className="text-xs text-slate-300 group-hover:text-white transition-colors capitalize">{type.type}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-indigo-500 rounded-full" 
                                                    style={{ width: `${type.effectiveness * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500">{Math.round(type.effectiveness * 100)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 text-center py-4">No outcome data yet.</p>
                    )}
                </div>

                <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h4 className="font-bold mb-1">Prescription Ready</h4>
                        <p className="text-xs opacity-90 mb-4">Run a system-wide risk check to generate fresh recommendations for your students.</p>
                        <button 
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    await api.post('/interventions/check-risks');
                                    fetchRecommendations();
                                } catch (err) {
                                    alert('Risk check failed');
                                    setLoading(false);
                                }
                            }}
                            className="w-full bg-white text-indigo-600 font-bold py-2 rounded-xl text-xs hover:bg-indigo-50 transition-colors shadow-lg active:scale-95"
                        >
                            Trigger Risk Check
                        </button>
                    </div>
                    <Lightbulb className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24 group-hover:scale-110 transition-transform" />
                </div>
            </div>
        </div>
    );
};

export default RecommendationQueue;
