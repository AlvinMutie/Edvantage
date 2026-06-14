import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ClipboardCheck, FileText, Bell, Shield, ArrowRight } from 'lucide-react';

const ParentDashboard = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentsRes, interventionsRes] = await Promise.all([
                api.get('/parents/students'),
                api.get('/parents/interventions')
            ]);
            setStudents(studentsRes.data);
            setInterventions(interventionsRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load parent data', err);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-white">Parent Dashboard</h1>
                <p className="text-slate-400">Welcome, {user?.full_name}. Monitor your children's progress and active interventions.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 animate-pulse">
                            Loading student profiles...
                        </div>
                    ) : students.length === 0 ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                            No students linked to your account.
                        </div>
                    ) : (
                        students.map((student, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden relative shadow-xl hover:border-slate-700 transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-blue-500 border border-slate-700 shadow-inner">
                                            <LayoutDashboard size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{student.full_name}</h2>
                                            <p className="text-slate-400 text-sm">Admission: {student.admission_number}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        student.risk_status === 'Low' || student.risk_status === 'Safe' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    }`}>
                                        Risk: {student.risk_status || 'Safe'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                        <div className="flex items-center gap-2 text-blue-500 mb-1">
                                            <FileText size={16} />
                                            <span className="text-[10px] font-bold uppercase">Current GPA</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{student.gpa || 'N/A'}</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                        <div className="flex items-center gap-2 text-emerald-500 mb-1">
                                            <ClipboardCheck size={16} />
                                            <span className="text-[10px] font-bold uppercase">Attendance</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{student.attendance ? `${student.attendance}%` : 'N/A'}</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                        <div className="flex items-center gap-2 text-orange-500 mb-1">
                                            <Bell size={16} />
                                            <span className="text-[10px] font-bold uppercase">Behavioral Status</span>
                                        </div>
                                        <p className="text-lg font-bold text-white">Good</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button className="text-blue-500 hover:text-blue-400 font-bold text-xs flex items-center gap-1 transition-all">
                                        View Full Progress Report <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="text-indigo-400" size={20} />
                            Active Interventions & Support
                        </h2>
                        <div className="space-y-4">
                            {interventions.length === 0 ? (
                                <p className="text-slate-500 text-sm py-4 text-center">No active support programs currently running.</p>
                            ) : (
                                interventions.map((intervention, idx) => (
                                    <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center group hover:border-slate-700 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                <Shield size={20} />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{intervention.student_name}: <span className="capitalize">{intervention.type}</span></p>
                                                <p className="text-slate-500 text-[10px] mt-0.5">Assigned on {new Date(intervention.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            intervention.status === 'open' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                                        }`}>
                                            {intervention.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Bell className="text-blue-400" size={18} />
                            Recommended Actions
                        </h2>
                        <div className="space-y-4">
                            {interventions.filter(i => i.status === 'open').length > 0 ? (
                                interventions.filter(i => i.status === 'open').map((i, idx) => (
                                    <div key={idx} className="p-4 bg-blue-600/5 border border-blue-600/20 rounded-xl">
                                        <p className="text-white text-xs font-bold mb-1">Support requested for {i.student_name}</p>
                                        <p className="text-slate-400 text-[10px] leading-relaxed mb-3">Please discuss the "{i.type}" plan with your child to ensure their active participation.</p>
                                        <button className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-all">
                                            Acknowledge Support
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-xs text-center py-4">No actions required at this time.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
                        <h2 className="text-lg font-bold text-white mb-4">Recent Notifications</h2>
                        <div className="space-y-4">
                            {[
                                { title: 'New Grade Posted', desc: 'Mathematics Quiz 3', time: '2h ago' },
                                { title: 'LMS Engagement', desc: 'Student logged in from new IP', time: '5h ago' }
                            ].map((alert, idx) => (
                                <div key={idx} className="flex gap-4 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                    <div className="bg-blue-500/10 text-blue-500 p-2 h-fit rounded-lg">
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
        </div>
    );
};

export default ParentDashboard;
