import React, { useState, useEffect } from 'react';
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
    Plus,
    Mail,
    Phone,
    MapPin,
    ShieldAlert,
    CheckCircle2,
    Activity
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
import api from '../api/axios';

// UI Components
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import RiskBadge from '../components/ui/RiskBadge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [interventions, setInterventions] = useState([]);

    useEffect(() => {
        fetchStudentData();
    }, [id]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const [studentRes, interventionsRes] = await Promise.all([
                api.get(`/students/${id}`),
                api.get(`/interventions/recommendations`) // We filter this for the student or use a specific endpoint if exists
            ]);
            
            setStudent(studentRes.data);
            
            // Filter recommendations for this student
            const studentRecs = interventionsRes.data.filter(r => r.student_id === id);
            setInterventions(studentRecs);
            
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch student data', err);
            setError('Could not load student profile. Please verify the ID.');
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Retrieving Profile...</p>
            </div>
        </div>
    );

    if (error || !student) return (
        <div className="max-w-md mx-auto py-20 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-slate-400 mb-8">{error || 'Student not found'}</p>
            <Button onClick={() => navigate('/dashboard/students')}>
                Return to Student List
            </Button>
        </div>
    );

    // Mock trend data for visualization (can be expanded with real historical data)
    const performanceData = [
        { month: 'Sep', gpa: student.gpa - 0.3, attendance: 95 },
        { month: 'Oct', gpa: student.gpa - 0.2, attendance: 92 },
        { month: 'Nov', gpa: student.gpa - 0.4, attendance: 85 },
        { month: 'Dec', gpa: student.gpa - 0.1, attendance: student.attendance - 5 },
        { month: 'Jan', gpa: student.gpa, attendance: student.attendance },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-4 py-2 bg-white/5 rounded-xl border border-white/5"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Directory
                </button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Plus size={16} />
                        Update Performance
                    </Button>
                    <Button size="sm" className="gap-2">
                        <MessageSquare size={16} />
                        Send Message
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Sidebar */}
                <div className="w-full lg:w-80 space-y-6">
                    <Card className="p-8 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-500"></div>
                        <div className="h-28 w-28 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                            <User size={56} className="text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white mt-6 tracking-tight">{student.full_name}</h2>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">{student.department}</p>
                        <div className="mt-6 flex flex-col gap-3">
                            <RiskBadge level={student.risk_status} className="w-full py-2 text-sm" />
                            <Badge variant={student.status === 'active' ? 'success' : 'neutral'} className="w-full py-2">
                                Status: {student.status}
                            </Badge>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-6">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="p-2 bg-white/5 rounded-lg text-slate-500 group-hover:text-primary-400 transition-colors">
                                    <Mail size={16} />
                                </div>
                                <div className="text-sm min-w-0">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold leading-none mb-1">Email</p>
                                    <p className="text-white font-medium truncate">{student.user?.email || 'No email'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="p-2 bg-white/5 rounded-lg text-slate-500 group-hover:text-primary-400 transition-colors">
                                    <Calendar size={16} />
                                </div>
                                <div className="text-sm">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold leading-none mb-1">Admission Number</p>
                                    <p className="text-white font-medium">{student.admission_number}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="p-2 bg-white/5 rounded-lg text-slate-500 group-hover:text-primary-400 transition-colors">
                                    <BookOpen size={16} />
                                </div>
                                <div className="text-sm">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold leading-none mb-1">Current Semester</p>
                                    <p className="text-white font-medium">Semester {student.current_semester}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-primary-600/10 border border-primary-500/20 rounded-3xl p-6 relative overflow-hidden">
                        <Activity className="absolute -right-4 -bottom-4 text-primary-500/10" size={100} />
                        <h4 className="text-sm font-black text-white uppercase tracking-wider mb-2">AI Summary</h4>
                        <p className="text-xs text-slate-400 leading-relaxed relative z-10">
                            {student.risk_status === 'At Risk' || student.risk_status === 'High' 
                                ? 'Urgent attention required. Performance shows significant decline in core metrics.' 
                                : 'Student is currently meeting all academic benchmarks with high stability.'}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Stats Cards */}
                    <StatGroup className="mb-0">
                        <KPICard 
                            label="Academic GPA" 
                            value={student.gpa?.toFixed(2) || '0.00'} 
                            icon={TrendingUp}
                            trend={student.gpa >= 3.0 ? 'up' : 'down'}
                            trendValue={student.gpa >= 3.0 ? '+0.2' : '-0.1'}
                        />
                        <KPICard 
                            label="Attendance Rate" 
                            value={`${student.attendance?.toFixed(1) || '0'}%`} 
                            icon={CheckCircle2}
                            trend={student.attendance >= 90 ? 'up' : 'down'}
                            trendValue={student.attendance >= 90 ? 'Optimal' : 'Sub-optimal'}
                        />
                        <KPICard 
                            label="Risk Score" 
                            value={`${student.risk_status === 'High' ? '72' : student.risk_status === 'Medium' ? '45' : '12'}%`} 
                            icon={ShieldAlert}
                        />
                    </StatGroup>

                    {/* Performance Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">GPA Progression</h3>
                                <Badge variant="info">Real-time</Badge>
                            </div>
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
                                        <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} fontSize={10} />
                                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={10} domain={[0, 4]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(8px)' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Attendance Trend</h3>
                                <Badge variant="success">92% Avg</Badge>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} fontSize={10} />
                                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={10} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(8px)' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#020617' }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Timeline / Activity */}
                    <Card className="p-8">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-500 rounded-lg shadow-lg shadow-primary-500/20">
                                    <History className="text-white" size={20} />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Academic Lifecycle</h3>
                            </div>
                            <Button variant="ghost" size="sm" className="text-primary-400">View Full Audit</Button>
                        </div>

                        <div className="space-y-10 relative">
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5"></div>
                            
                            {interventions.length > 0 ? (
                                interventions.map((item, idx) => (
                                    <div key={idx} className="relative flex gap-8 group">
                                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center border border-white/5 bg-slate-900 z-10 transition-transform group-hover:scale-110 shadow-xl">
                                            {item.risk_level === 'High' ? <AlertTriangle className="text-red-500" size={20} /> : <MessageSquare className="text-primary-400" size={20} />}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                                                <h4 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">{item.template_name}</h4>
                                                <span className="text-[10px] font-black text-slate-500 bg-white/5 border border-white/5 px-3 py-1 rounded-full uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{item.intervention_type} recommended based on urgency score of {Math.round(item.urgency_score * 100)}%.</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="relative flex gap-8 group">
                                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center border border-white/5 bg-slate-900 z-10 transition-transform group-hover:scale-110 shadow-xl">
                                        <CheckCircle2 className="text-emerald-500" size={20} />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h4 className="text-lg font-bold text-white">Initial Enrollment</h4>
                                        <p className="text-slate-400 text-sm mt-1">Student profile initialized and monitoring active.</p>
                                        <span className="inline-block mt-3 text-[10px] font-black text-slate-500 bg-white/5 border border-white/5 px-3 py-1 rounded-full uppercase tracking-widest">System Event</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;

