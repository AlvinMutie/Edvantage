import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    Users, 
    TriangleAlert, 
    CircleCheckBig, 
    MessageSquare, 
    Search, 
    Filter, 
    ArrowUpRight, 
    Activity, 
    CheckCircle2, 
    AlertCircle,
    RefreshCw,
    GraduationCap,
    MoreHorizontal
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import RecommendationQueue from '../components/RecommendationQueue';

// UI Components
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import RiskBadge from '../components/ui/RiskBadge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';

const SupervisorDashboard = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignedStudents();
    }, []);

    const fetchAssignedStudents = async () => {
        try {
            setLoading(true);
            // Reusing the students endpoint - ideally filtered by supervisor in backend
            const res = await api.get('/students/');
            setStudents(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load students', err);
            setLoading(false);
        }
    };

    const handleMessage = (studentUserId) => {
        navigate('/dashboard/messages');
    };

    const atRiskCount = students.filter(s => s.risk_status === 'At Risk' || s.risk_status === 'High').length;
    const filteredStudents = students.filter(s => 
        s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Syncing assigned cohort...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-12">
            <SectionHeader 
                title="Supervisor Command Center" 
                description="Real-time monitoring and tactical oversight of your assigned student cohort."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchAssignedStudents} className="gap-2 text-slate-400">
                        <RefreshCw size={16} />
                        Sync Data
                    </Button>
                    <Button size="sm" className="gap-2 shadow-lg shadow-primary-500/20">
                        <MessageSquare size={16} />
                        Broadcast Group
                    </Button>
                </div>
            </SectionHeader>

            <StatGroup>
                <KPICard icon={Users} label="Total Cohort" value={students.length} />
                <KPICard icon={AlertCircle} label="Active Risk" value={atRiskCount} trend={atRiskCount > 0 ? 'up' : 'down'} trendValue={atRiskCount > 5 ? 'High' : 'Stable'} />
                <KPICard icon={Activity} label="Pending Actions" value="12" />
                <KPICard icon={CheckCircle2} label="Resolution Rate" value="92%" trend="up" trendValue="+4.2%" />
            </StatGroup>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <RecommendationQueue />

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search by identity or ID..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-slate-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Filter size={18} />
                            Cohort Filters
                        </Button>
                    </div>

                    <Card className="overflow-hidden border-white/5 shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.02] border-b border-white/5">
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Student Identity</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Academic Context</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Performance</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Risk Status</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredStudents.length === 0 ? (
                                        <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500 italic">No students found in your cohort.</td></tr>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-white/[0.03] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                                                            <GraduationCap className="text-slate-500" size={24} />
                                                        </div>
                                                        <div>
                                                            <Link to={`/dashboard/students/${student.id}`} className="text-sm font-black text-white hover:text-primary-400 transition-colors block">
                                                                {student.full_name}
                                                            </Link>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">{student.student_id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-bold text-slate-300">{student.department}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase">Semester {student.current_semester}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-black text-white">{student.gpa?.toFixed(2) || '0.00'}</span>
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase">GPA</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <RiskBadge level={student.risk_status} />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="p-2 h-auto text-slate-500 hover:text-primary-400"
                                                            onClick={() => handleMessage(student.user_id)}
                                                        >
                                                            <MessageSquare size={18} />
                                                        </Button>
                                                        <Link to={`/dashboard/students/${student.id}`}>
                                                            <Button variant="ghost" size="sm" className="p-2 h-auto text-slate-500 hover:text-white">
                                                                <ArrowUpRight size={18} />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="p-8 bg-primary-600/10 border-primary-500/20 relative overflow-hidden">
                        <Activity className="absolute -right-4 -bottom-4 text-primary-500/10" size={120} />
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">AI Tactical Advisory</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <Badge variant="warning" className="text-[9px] mb-2">Attention Required</Badge>
                                <p className="text-xs text-white leading-relaxed font-medium">3 students in your cohort show attendance drop-off patterns in the last 72 hours.</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <Badge variant="success" className="text-[9px] mb-2">Optimization</Badge>
                                <p className="text-xs text-white leading-relaxed font-medium">Cohort GPA has improved by 0.12 since last week's group counseling session.</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8">
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6">Cohort Distribution</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'In Good Standing', count: students.length - atRiskCount, color: 'bg-emerald-500' },
                                { label: 'Under Review', count: atRiskCount, color: 'bg-risk-critical' }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <span>{item.label}</span>
                                        <span className="text-white">{item.count}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${item.color} rounded-full`}
                                            style={{ width: `${(item.count / (students.length || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;

