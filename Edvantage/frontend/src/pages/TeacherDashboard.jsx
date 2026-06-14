import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ClipboardCheck, Users, FileText, Calendar } from 'lucide-react';

const TeacherDashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Assigned Classes', value: '4', icon: Users, color: 'text-blue-500' },
        { label: 'Total Students', value: '124', icon: Users, color: 'text-purple-500' },
        { label: 'Pending Grades', value: '12', icon: FileText, color: 'text-orange-500' },
        { label: 'Today\'s Attendance', value: '92%', icon: ClipboardCheck, color: 'text-green-500' },
    ];

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
                <p className="text-slate-400">Welcome back, {user?.full_name}. Here is your class overview.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Upcoming Classes</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary-500/10 text-primary-500 p-2 rounded-lg">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Computer Science 101</p>
                                        <p className="text-slate-400 text-xs">Room 402 • 10:00 AM</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium rounded-lg transition-colors">
                                    Mark Attendance
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Recent Submissions</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div>
                                    <p className="text-white font-medium">John Doe</p>
                                    <p className="text-slate-400 text-xs">Assignment: Database Design</p>
                                </div>
                                <button className="text-primary-500 hover:text-primary-400 text-sm font-medium">
                                    Grade Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
