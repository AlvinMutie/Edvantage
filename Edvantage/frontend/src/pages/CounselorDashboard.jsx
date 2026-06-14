import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Calendar, CheckCircle, Clock } from 'lucide-react';

const CounselorDashboard = () => {
    const { user } = useAuth();
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInterventions();
    }, []);

    const fetchInterventions = async () => {
        try {
            const res = await api.get('/interventions/assigned');
            setInterventions(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load assigned interventions', err);
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Active Referrals', value: interventions.filter(i => i.status === 'open').length.toString(), icon: ShieldAlert, color: 'text-red-500' },
        { label: 'Sessions Today', value: '3', icon: Calendar, color: 'text-blue-500' },
        { label: 'Total Managed', value: interventions.length.toString(), icon: Users, color: 'text-purple-500' },
        { label: 'Resolved Cases', value: interventions.filter(i => i.status === 'closed').length.toString(), icon: CheckCircle, color: 'text-green-500' },
    ];

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white">Counselor Dashboard</h1>
                    <p className="text-slate-400">Welcome, {user?.full_name}. Here is your counseling overview.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-slate-800 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-lg font-bold text-white mb-4">Urgent Referrals & Interventions</h2>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-slate-500 py-8 text-center animate-pulse">Loading assigned cases...</div>
                        ) : interventions.filter(i => i.status === 'open').length === 0 ? (
                            <div className="text-slate-500 py-8 text-center bg-slate-950/50 rounded-xl border border-slate-800/50">
                                No active referrals assigned to you.
                            </div>
                        ) : (
                            interventions.filter(i => i.status === 'open').map(intervention => (
                                <div key={intervention.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-500 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                            intervention.risk_status === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                            <ShieldAlert size={20} />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{intervention.student_name}</p>
                                            <p className="text-slate-400 text-xs">Type: <span className="capitalize">{intervention.type}</span> | Due: {intervention.due_date ? new Date(intervention.due_date).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4 md:mt-0">
                                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-600/20">
                                            Manage Case
                                        </button>
                                        <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-all">
                                            Student File
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Today's Schedule</h2>
                        <Clock size={18} className="text-slate-500" />
                    </div>
                    <div className="space-y-4">
                        {[
                            { time: '09:00 AM', name: 'Alice Johnson', type: 'Mentorship' },
                            { time: '11:30 AM', name: 'Bob Smith', type: 'Counseling' },
                            { time: '02:00 PM', name: 'Charlie Brown', type: 'Follow-up' }
                        ].map((session, idx) => (
                            <div key={idx} className="p-4 bg-slate-800/50 rounded-xl border border-l-4 border-l-blue-500 border-slate-700/50">
                                <p className="text-blue-500 text-[10px] font-bold uppercase">{session.time}</p>
                                <p className="text-white font-medium mt-1">{session.name}</p>
                                <p className="text-slate-400 text-xs">{session.type}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CounselorDashboard;
