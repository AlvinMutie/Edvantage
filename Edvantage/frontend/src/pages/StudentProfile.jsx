import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Calendar,
    BookOpen,
    TrendingUp,
    History,
    AlertTriangle,
    MessageSquare,
    Plus
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const performanceData = [
    { month: 'Sep', gpa: 3.2, attendance: 90 },
    { month: 'Oct', gpa: 3.1, attendance: 85 },
    { month: 'Nov', gpa: 2.8, attendance: 70 },
    { month: 'Dec', gpa: 2.5, attendance: 65 },
    { month: 'Jan', gpa: 2.7, attendance: 75 },
];

const timelineEvents = [
    { id: 1, type: 'alert', title: 'Critical Risk Detected', desc: 'Attendance dropped below 75%', date: 'Dec 12, 2023', icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
    { id: 2, type: 'intervention', title: 'Academic Counseling', desc: 'Meeting with Dr. Sarah regarding study habits.', date: 'Dec 20, 2023', icon: MessageSquare, color: 'text-primary-500 bg-primary-500/10' },
    { id: 3, type: 'update', title: 'Performance Increase', desc: 'GPA improved by 0.2 in January.', date: 'Jan 15, 2024', icon: TrendingUp, color: 'text-emerald-500 bg-emerald-500/10' },
];

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Students
            </button>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Sidebar */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-500"></div>
                        <div className="h-24 w-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto border-4 border-slate-900 ring-2 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all">
                            <User size={48} className="text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mt-4">Alice Johnson</h2>
                        <p className="text-slate-400 text-sm">Computer Science • Semester 1</p>
                        <div className="mt-6 flex justify-center gap-2">
                            <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">High Risk</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="text-slate-500" size={18} />
                                <div className="text-sm">
                                    <p className="text-slate-500 leading-none mb-1">Student ID</p>
                                    <p className="text-white font-medium">ST1001</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-slate-500" size={18} />
                                <div className="text-sm">
                                    <p className="text-slate-500 leading-none mb-1">Email</p>
                                    <p className="text-white font-medium">alice.j@uni.edu</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 group">
                        <MessageSquare size={18} />
                        Contact Student
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">GPA Trend</p>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={performanceData}>
                                        <defs>
                                            <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Attendance (%)</p>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Line type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <History className="text-primary-500" />
                                <h3 className="text-xl font-bold text-white">Intervention Timeline</h3>
                            </div>
                            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-all text-sm font-medium">
                                <Plus size={18} />
                                Log Action
                            </button>
                        </div>

                        <div className="space-y-8 relative">
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-800"></div>
                            {timelineEvents.map((event) => (
                                <div key={event.id} className="relative flex gap-6 group">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border border-white/5 z-10 transition-transform group-hover:scale-110 ${event.color}`}>
                                        <event.icon size={22} />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-lg font-bold text-white">{event.title}</h4>
                                                <p className="text-slate-400 mt-1">{event.desc}</p>
                                            </div>
                                            <span className="text-xs font-medium text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{event.date}</span>
                                        </div>
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

export default StudentProfile;
