import React, { useState } from 'react';
import {
    ShieldAlert,
    Settings2,
    Plus,
    Trash2,
    Save,
    AlertCircle,
    HelpCircle
} from 'lucide-react';

const initialRules = [
    { id: 1, name: 'Low Attendance', type: 'Attendance', threshold: 75, risk: 'High', enabled: true },
    { id: 2, name: 'Low GPA Performance', type: 'GPA', threshold: 2.5, risk: 'Medium', enabled: true },
    { id: 3, name: 'Frequent Absence', type: 'Attendance', threshold: 3, risk: 'Medium', enabled: false },
];

const RuleEditor = () => {
    const [rules, setRules] = useState(initialRules);

    const toggleRule = (id) => {
        setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Rule Engine Manager</h1>
                    <p className="text-slate-400 mt-2">Configure policies that trigger student risk alerts.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl transition-all font-bold shadow-lg shadow-primary-500/20">
                    <Plus size={20} />
                    Create New Rule
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {rules.map((rule) => (
                    <div key={rule.id} className={`bg-slate-900 border ${rule.enabled ? 'border-slate-800' : 'border-slate-800/50 opacity-60'} rounded-3xl p-8 transition-all hover:border-primary-500/30 group`}>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-start gap-6">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${rule.enabled ? 'bg-primary-500/10 border-primary-500/20 text-primary-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                    <ShieldAlert size={28} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-white">{rule.name}</h3>
                                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${rule.risk === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {rule.risk} Priority
                                        </span>
                                    </div>
                                    <p className="text-slate-400 mt-1 flex items-center gap-2">
                                        {rule.type} Monitoring <span className="h-1 w-1 bg-slate-700 rounded-full"></span>
                                        Trigger when {rule.type.toLowerCase()} is below <span className="text-white font-bold">{rule.threshold}{rule.type === 'Attendance' ? '%' : ''}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex flex-col gap-2 min-w-[200px]">
                                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Threshold</span>
                                        <span className="text-primary-500">{rule.threshold}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={rule.threshold}
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                        onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, threshold: e.target.value } : r))}
                                    />
                                </div>

                                <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
                                    <button
                                        onClick={() => toggleRule(rule.id)}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${rule.enabled ? 'bg-primary-600' : 'bg-slate-700'}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${rule.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                    <span className="text-sm font-bold text-slate-400">{rule.enabled ? 'Active' : 'Disabled'}</span>
                                </div>

                                <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
                                    <button className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                                        <Settings2 size={20} />
                                    </button>
                                    <button className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 flex items-start gap-4">
                <AlertCircle className="text-indigo-400 shrink-0" size={24} />
                <div>
                    <h4 className="text-indigo-100 font-bold">Policy Propagation</h4>
                    <p className="text-indigo-200/60 text-sm mt-1">Changes to thresholds will be applied to the evaluation engine immediately. Students already flagged will be re-evaluated on the next data sync.</p>
                </div>
            </div>
        </div>
    );
};

export default RuleEditor;
