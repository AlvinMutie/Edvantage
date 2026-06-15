import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    ClipboardCheck,
    Search,
    Filter,
    Clock,
    CircleCheckBig,
    TriangleAlert,
    MoreVertical,
    ExternalLink,
    Plus,
    RefreshCw,
    Activity,
    Users,
    CheckCircle2,
    Calendar
} from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';

const Interventions = () => {
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInterventions();
    }, []);

    const fetchInterventions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/evaluation/interventions');
            setInterventions(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch interventions', error);
            setLoading(false);
        }
    };

    const activeInterventions = interventions.filter(i => i.status === 'open' || i.status === 'In Progress').length;
    const completedInterventions = interventions.filter(i => i.status === 'closed' || i.status === 'Completed').length;
    const pendingInterventions = interventions.filter(i => i.status === 'pending' || i.status === 'Pending').length;

    const filteredInterventions = interventions.filter(i => 
        i.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Retrieving Support Logs...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-12">
            <SectionHeader 
                title="Support Interventions" 
                description="Monitor the deployment and progress of institutional support activities."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchInterventions} className="gap-2 text-slate-400">
                        <RefreshCw size={16} />
                        Sync Data
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Plus size={16} />
                        Initiate Support
                    </Button>
                </div>
            </SectionHeader>

            <StatGroup>
                <KPICard label="Active Support" value={activeInterventions} icon={Activity} trend="up" trendValue="Live" />
                <KPICard label="Success Rate" value="84%" icon={CheckCircle2} trend="up" trendValue="+2.4%" />
                <KPICard label="Avg Duration" value="12 Days" icon={Clock} />
                <KPICard label="Coverage" value="92%" icon={Users} />
            </StatGroup>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search student, type or status..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all placeholder:text-slate-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter size={18} />
                    Filter Status
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredInterventions.length === 0 ? (
                    <Card className="p-20 text-center border-dashed border-2">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <ClipboardCheck size={40} className="text-slate-700" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">No Active Logs</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto">Student support interventions will appear here once they are initiated by supervisors or counselors.</p>
                    </Card>
                ) : (
                    filteredInterventions.map((item) => (
                        <Card key={item.id} className="p-6 transition-all hover:bg-white/[0.03] group relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                                        <ClipboardCheck className="text-primary-400" size={32} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white tracking-tight">{item.type}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.student_name || 'System Generated'}</p>
                                            <span className="w-1 h-1 bg-slate-800 rounded-full" />
                                            <p className="text-[10px] font-black text-primary-500 uppercase">{item.student_id || item.admission_number}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-10">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Supervisor</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-white/10">
                                                {item.supervisor_name?.charAt(0) || 'S'}
                                            </div>
                                            <p className="text-sm font-bold text-slate-300">{item.supervisor_name || 'Institutional'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment</p>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Calendar size={14} className="text-slate-500" />
                                            <p className="text-sm font-bold">{new Date(item.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="min-w-[120px]">
                                        <Badge 
                                            variant={item.status === 'open' || item.status === 'In Progress' ? 'info' : item.status === 'closed' || item.status === 'Completed' ? 'success' : 'warning'}
                                            className="px-4 py-1.5"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                                    item.status === 'open' || item.status === 'In Progress' ? 'bg-blue-400' : item.status === 'closed' || item.status === 'Completed' ? 'bg-emerald-400' : 'bg-amber-400'
                                                }`} />
                                                {item.status}
                                            </div>
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 border-l border-white/5 pl-8">
                                        <button className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                                            <ExternalLink size={20} />
                                        </button>
                                        <button className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Interventions;

