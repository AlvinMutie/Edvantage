import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ClipboardCheck, FileText, Bell } from 'lucide-react';

const ParentDashboard = () => {
    const { user } = useAuth();

    const children = [
        { name: 'John Doe', grade: 'Grade 10', gpa: '3.8', attendance: '95%', risk: 'Low' },
    ];

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-white">Parent Dashboard</h1>
                <p className="text-slate-400">Welcome, {user?.full_name}. Monitor your children's progress below.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {children.map((child, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden relative">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                                        <LayoutDashboard size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{child.name}</h2>
                                        <p className="text-slate-400 text-sm">{child.grade}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    child.risk === 'Low' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                    Risk: {child.risk}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-primary-500 mb-1">
                                        <FileText size={16} />
                                        <span className="text-xs font-bold uppercase">Current GPA</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{child.gpa}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-green-500 mb-1">
                                        <ClipboardCheck size={16} />
                                        <span className="text-xs font-bold uppercase">Attendance</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{child.attendance}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-orange-500 mb-1">
                                        <Bell size={16} />
                                        <span className="text-xs font-bold uppercase">Last Activity</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white text-sm">Yesterday</p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button className="text-primary-500 hover:text-primary-400 font-medium text-sm">
                                    View Detailed Report →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
                    <h2 className="text-lg font-bold text-white mb-4">Recent Alerts</h2>
                    <div className="space-y-4">
                        {[
                            { title: 'New Grade Posted', desc: 'CS101 Assignment 2 graded', time: '2h ago' },
                            { title: 'Attendance Alert', desc: 'Missed morning session on June 12', time: '1d ago' }
                        ].map((alert, idx) => (
                            <div key={idx} className="flex gap-4 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                <div className="bg-primary-500/10 text-primary-500 p-2 h-fit rounded-lg">
                                    <Bell size={16} />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">{alert.title}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{alert.desc}</p>
                                    <p className="text-slate-500 text-[10px] mt-1">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
