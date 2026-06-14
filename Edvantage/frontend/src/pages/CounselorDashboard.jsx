import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Calendar, CheckCircle } from 'lucide-react';

const CounselorDashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Active Referrals', value: '8', icon: ShieldAlert, color: 'text-red-500' },
        { label: 'Sessions Today', value: '3', icon: Calendar, color: 'text-blue-500' },
        { label: 'Total Students', value: '45', icon: Users, color: 'text-purple-500' },
        { label: 'Resolved Cases', value: '28', icon: CheckCircle, color: 'text-green-500' },
    ];

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-white">Counselor Dashboard</h1>
                <p className="text-slate-400">Welcome, {user?.full_name}. Here is your counseling overview.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
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
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Urgent Referrals</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Student ID: ADM-102{i}</p>
                                        <p className="text-slate-400 text-xs">Reason: Significant attendance drop</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium rounded-lg transition-colors">
                                        Accept
                                    </button>
                                    <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors">
                                        View File
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Today's Schedule</h2>
                    <div className="space-y-4">
                        {[
                            { time: '09:00 AM', name: 'Alice Johnson' },
                            { time: '11:30 AM', name: 'Bob Smith' },
                            { time: '02:00 PM', name: 'Charlie Brown' }
                        ].map((session, idx) => (
                            <div key={idx} className="p-4 bg-slate-800/50 rounded-xl border border-l-4 border-l-primary-500 border-slate-700/50">
                                <p className="text-primary-500 text-xs font-bold uppercase">{session.time}</p>
                                <p className="text-white font-medium mt-1">{session.name}</p>
                                <p className="text-slate-400 text-xs">Initial Mentorship</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CounselorDashboard;
