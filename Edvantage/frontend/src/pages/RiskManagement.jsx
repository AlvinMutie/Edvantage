import React, { useState } from 'react';
import {
    ShieldAlert,
    Search,
    ArrowRight,
    MessageSquare,
    Calendar,
    ChevronRight,
    User,
    Activity
} from 'lucide-react';

const alerts = [
    { id: 1, student: 'Bob Smith', sid: 'ST1002', reason: 'Attendance below 70%', level: 'High', date: '2024-02-05' },
    { id: 2, student: 'Edward Norton', sid: 'ST1005', reason: 'GPA dropped by 0.5', level: 'High', date: '2024-02-04' },
    { id: 3, student: 'Charlie Brown', sid: 'ST1003', reason: 'Missing mid-term results', level: 'Medium', date: '2024-02-03' },
];

const RiskManagement = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white">Risk Management</h1>
                    <p className="text-slate-400 mt-2">Evaluate student risks and manage intervention strategies.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-center min-w-[120px]">
                        <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Critical</p>
                        <p className="text-2xl font-bold text-white mt-1">5</p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-center min-w-[120px]">
                        <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Warning</p>
                        <p className="text-2xl font-bold text-white mt-1">12</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <ShieldAlert className="text-red-500" size={20} />
                            Recent Risk Alerts
                        </h3>
                        <button className="text-primary-500 text-sm font-medium hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                                            <User className="text-slate-400" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{alert.student}</h4>
                                            <p className="text-xs text-slate-500">{alert.sid}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${alert.level === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        }`}>
                                        {alert.level}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-6 text-sm text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Activity size={14} />
                                            {alert.reason}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            {alert.date}
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 text-primary-500 font-semibold text-sm hover:gap-3 transition-all">
                                        Initiate Intervention
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <MessageSquare className="text-primary-500" size={20} />
                        Active Evaluations
                    </h3>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Monthly Reviews</span>
                                <span className="text-white font-medium">12/15</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 w-[80%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-medium text-white underline">Rules Overview</p>
                            <ul className="space-y-3">
                                <li className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">Attendance Threshold</span>
                                    <span className="text-red-400">&lt; 75%</span>
                                </li>
                                <li className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">GPA Threshold</span>
                                    <span className="text-red-400">&lt; 2.5</span>
                                </li>
                                <li className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">Behavioral Score</span>
                                    <span className="text-amber-400">&lt; 60</span>
                                </li>
                            </ul>
                            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all">
                                Modify Rule Set
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskManagement;
