import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    ShieldAlert,
    Settings2,
    Plus,
    Trash2,
    Save,
    AlertCircle,
    HelpCircle,
    Zap,
    RefreshCw,
    CheckCircle2
} from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';

const RuleEditor = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewModal, setShowNewModal] = useState(false);
    const [newRule, setNewRule] = useState({
        name: '',
        condition_type: 'gpa_low',
        threshold: 2.0,
        risk_level: 'Medium'
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const res = await api.get('/evaluation/rules');
            setRules(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch rules', error);
            setLoading(false);
        }
    };

    const handleCreateRule = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/evaluation/rules', newRule);
            setRules([...rules, res.data]);
            setShowNewModal(false);
            setNewRule({
                name: '',
                condition_type: 'gpa_low',
                threshold: 2.0,
                risk_level: 'Medium'
            });
        } catch (error) {
            alert('Failed to create rule');
        }
    };

    const activeRules = rules.length;
    const highRiskRules = rules.filter(r => r.risk_level === 'High' || r.risk_level === 'Critical').length;

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Synchronizing Policy Engine...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-12">
            <SectionHeader 
                title="Policy Engine Manager" 
                description="Configure autonomous heuristic rules that trigger institutional risk alerts."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchRules} className="gap-2 text-slate-400">
                        <RefreshCw size={16} />
                        Reload
                    </Button>
                    <Button size="sm" className="gap-2 shadow-lg shadow-primary-500/20" onClick={() => setShowNewModal(true)}>
                        <Plus size={16} />
                        New Policy
                    </Button>
                </div>
            </SectionHeader>

            <StatGroup>
                <KPICard label="Active Policies" value={activeRules} icon={ShieldAlert} />
                <KPICard label="High Priority" value={highRiskRules} icon={Zap} trend="up" trendValue="Live" />
                <KPICard label="Last Evaluation" value="2m ago" icon={CheckCircle2} />
            </StatGroup>

            <div className="grid grid-cols-1 gap-6">
                {rules.length === 0 ? (
                    <Card className="p-20 text-center border-dashed border-2">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert size={40} className="text-slate-700" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">No Active Policies</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto">Initialize your first risk detection policy to start monitoring student performance autonomously.</p>
                    </Card>
                ) : (
                    rules.map((rule) => (
                        <Card key={rule.id} className="p-8 group hover:border-primary-500/30 transition-all duration-500">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="flex items-start gap-6">
                                    <div className="h-16 w-16 rounded-[1.25rem] flex items-center justify-center bg-primary-500/10 border border-primary-500/20 text-primary-500 shadow-inner group-hover:scale-110 transition-transform">
                                        <Zap size={32} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-black text-white tracking-tight">{rule.name}</h3>
                                            <Badge variant={rule.risk_level === 'High' || rule.risk_level === 'Critical' ? 'danger' : 'warning'} className="text-[9px]">
                                                {rule.risk_level} Priority
                                            </Badge>
                                        </div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                            {rule.condition_type.replace('_', ' ')}
                                            <span className="w-1 h-1 bg-slate-800 rounded-full" />
                                            Trigger: <span className="text-white">{'<'} {rule.threshold}{rule.condition_type.includes('attendance') ? '%' : ''}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="flex flex-col gap-3 min-w-[200px]">
                                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <span>Threshold</span>
                                            <span className="text-primary-400">{rule.threshold}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(rule.threshold / (rule.condition_type.includes('attendance') ? 100 : 4)) * 100}%` }} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 border-l border-white/5 pl-8">
                                        <button className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                                            <Settings2 size={20} />
                                        </button>
                                        <button className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Card className="p-6 bg-indigo-600/10 border-indigo-500/20 flex items-start gap-4">
                <AlertCircle className="text-indigo-400 shrink-0" size={24} />
                <div>
                    <h4 className="text-indigo-100 font-bold uppercase tracking-tight text-sm">Policy Propagation Protocol</h4>
                    <p className="text-indigo-200/60 text-xs mt-1 leading-relaxed font-medium">Changes to heuristic thresholds are committed to the evaluation engine in real-time. Students already flagged by the system will be re-synchronized during the next automated data audit.</p>
                </div>
            </Card>

            {/* New Rule Modal */}
            {showNewModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in">
                    <Card className="w-full max-w-md p-8 shadow-2xl border-white/10 animate-in zoom-in-95">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20">
                                <Plus className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-black text-white tracking-tight uppercase">New Risk Policy</h3>
                        </div>

                        <form onSubmit={handleCreateRule} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Policy Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newRule.name}
                                    onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none transition-all"
                                    placeholder="e.g. Critical GPA Alert"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Metric Type</label>
                                    <select
                                        value={newRule.condition_type}
                                        onChange={(e) => setNewRule({...newRule, condition_type: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none transition-all"
                                    >
                                        <option value="gpa_low" className="bg-slate-900">GPA (Lower than)</option>
                                        <option value="attendance_low" className="bg-slate-900">Attendance % (Lower than)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Priority</label>
                                    <select
                                        value={newRule.risk_level}
                                        onChange={(e) => setNewRule({...newRule, risk_level: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none transition-all"
                                    >
                                        <option value="Low" className="bg-slate-900">Low</option>
                                        <option value="Medium" className="bg-slate-900">Medium</option>
                                        <option value="High" className="bg-slate-900">High</option>
                                        <option value="Critical" className="bg-slate-900">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Trigger Threshold ({newRule.threshold})</label>
                                <input
                                    type="range"
                                    min="0"
                                    max={newRule.condition_type === 'attendance_low' ? 100 : 4}
                                    step={newRule.condition_type === 'attendance_low' ? 1 : 0.1}
                                    value={newRule.threshold}
                                    onChange={(e) => setNewRule({...newRule, threshold: parseFloat(e.target.value)})}
                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => setShowNewModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 shadow-lg shadow-primary-500/20"
                                >
                                    Deploy Policy
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default RuleEditor;

