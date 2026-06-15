import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    ClipboardCheck, 
    FileText, 
    Bell, 
    Shield, 
    ArrowRight, 
    History, 
    MessageSquare, 
    TrendingUp, 
    AlertTriangle,
    BrainCircuit,
    Lightbulb,
    CheckCircle2,
    Calendar,
    User
} from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import RiskBadge from '../components/ui/RiskBadge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium animate-pulse">Syncing family profiles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
            <SectionHeader 
                title="Parental Command Center"
                description={`Welcome, ${user?.full_name}. Here's a unified view of your children's academic performance.`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content: Student Profiles */}
                <div className="lg:col-span-8 space-y-12">
                    {students.length === 0 ? (
                        <Card className="p-12 text-center">
                            <User size={48} className="text-slate-600 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2">No Students Linked</h2>
                            <p className="text-slate-500 mb-6">We couldn't find any student profiles associated with your account.</p>
                            <Button variant="outline">Request Linkage</Button>
                        </Card>
                    ) : (
                        students.map((student, idx) => (
                            <div key={idx} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-white tracking-tight">{student.full_name}</h2>
                                            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">ID: {student.admission_number}</p>
                                        </div>
                                    </div>
                                    <RiskBadge level={student.risk_status || 'Low'} className="px-4 py-1.5 text-sm" />
                                </div>

                                <StatGroup className="mb-0">
                                    <KPICard 
                                        label="Academic GPA" 
                                        value={student.gpa || 'N/A'} 
                                        icon={FileText}
                                        trend={student.gpa >= 3.0 ? 'up' : 'down'}
                                        trendValue={student.gpa >= 3.0 ? '+0.1' : '-0.2'}
                                    />
                                    <KPICard 
                                        label="Attendance" 
                                        value={student.attendance ? `${student.attendance}%` : 'N/A'} 
                                        icon={ClipboardCheck}
                                    />
                                    <KPICard 
                                        label="Behavior" 
                                        value="Exemplary" 
                                        icon={Shield}
                                    />
                                    <Card className="p-6 flex flex-col justify-center items-center text-center bg-primary-600/5 border-primary-500/10">
                                        <Button variant="ghost" size="sm" className="group">
                                            Full Report <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Card>
                                </StatGroup>

                                {/* Mini Timeline for each student */}
                                <Card className="p-6 bg-slate-900/30">
                                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <History size={16} />
                                        Recent Milestones
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { title: 'Improved Attendance', date: '2 days ago', type: 'success' },
                                            { title: 'New Intervention', date: '1 week ago', type: 'warning' },
                                            { title: 'GPA Recalculated', date: 'Yesterday', type: 'info' }
                                        ].map((milestone, mIdx) => (
                                            <div key={mIdx} className="flex gap-4 items-start">
                                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                                    milestone.type === 'success' ? 'bg-success-500' :
                                                    milestone.type === 'warning' ? 'bg-risk-medium' : 'bg-primary-500'
                                                }`}></div>
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-tight mb-1">{milestone.title}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">{milestone.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        ))
                    )}
                </div>

                {/* Sidebar: AI Insights & Recommendations */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-6 bg-primary-600/10 border-primary-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BrainCircuit size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-primary-500 rounded-lg shadow-lg shadow-primary-500/20">
                                    <BrainCircuit size={20} className="text-white" />
                                </div>
                                <h3 className="font-black text-white text-xl uppercase tracking-tighter">AI Advisory</h3>
                            </div>

                            <div className="space-y-6">
                                <section>
                                    <h4 className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mb-4">Recommended Actions</h4>
                                    <div className="space-y-3">
                                        {interventions.filter(i => i.status === 'open').length > 0 ? (
                                            interventions.filter(i => i.status === 'open').map((i, idx) => (
                                                <div key={idx} className="p-4 bg-slate-900/80 border border-white/5 rounded-2xl group hover:border-primary-500/30 transition-all">
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                                                            <Lightbulb size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white leading-tight">Support {i.student_name}</p>
                                                            <p className="text-xs text-slate-400 mt-1">Review the "{i.type}" academic plan.</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="solid" className="w-full py-2 text-xs rounded-xl">
                                                        Acknowledge & Sync
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-white/5">
                                                <CheckCircle2 size={32} className="text-success-500 mx-auto mb-3 opacity-50" />
                                                <p className="text-slate-500 text-sm italic">All students are performing within optimal parameters.</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Active Interventions</h4>
                                    <div className="space-y-3">
                                        {interventions.length > 0 && interventions.map((i, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                        <Shield size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-white">{i.student_name}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase">{i.type}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={i.status === 'open' ? 'warning' : 'success'} className="text-[8px] py-0.5 px-2">
                                                    {i.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                            <Bell size={18} className="text-primary-400" />
                            Recent Intelligence
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Grade Released', desc: 'Advanced Mathematics Quiz', time: '2h ago', icon: FileText },
                                { title: 'System Alert', desc: 'New login detected from Brussels', time: '5h ago', icon: Shield },
                                { title: 'Meeting Scheduled', desc: 'Parent-Teacher conference', time: 'Yesterday', icon: Calendar }
                            ].map((alert, idx) => (
                                <div key={idx} className="flex gap-4 p-3 bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl border border-white/5 transition-all cursor-pointer">
                                    <div className="bg-primary-500/10 text-primary-500 p-2.5 h-fit rounded-xl">
                                        <alert.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-tight">{alert.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">{alert.desc}</p>
                                        <p className="text-[10px] text-slate-600 mt-2 font-black uppercase tracking-tighter">{alert.time}</p>
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

export default ParentDashboard;
