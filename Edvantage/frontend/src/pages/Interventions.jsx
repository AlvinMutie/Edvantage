import React, { useState } from 'react';
import {
    ClipboardCheck,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    ExternalLink
} from 'lucide-react';

const interventions = [
    { id: 1, student: 'Bob Smith', sid: 'ST1002', type: 'Academic Counseling', status: 'In Progress', date: '2024-02-01', supervisor: 'Dr. Sarah' },
    { id: 2, student: 'Edward Norton', sid: 'ST1005', type: 'Parental Meeting', status: 'Completed', date: '2024-01-25', supervisor: 'Prof. Miller' },
    { id: 3, student: 'Alice Johnson', sid: 'ST1001', type: 'Peer Tutoring', status: 'Pending', date: '2024-02-05', supervisor: 'Dr. Sarah' },
];

const StatusBadge = ({ status }) => {
    const styles = {
        Completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        'In Progress': 'bg-primary-500/10 text-primary-500 border-primary-500/20',
        Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    };

    const icons = {
        Completed: <CheckCircle2 size={14} />,
        'In Progress': <Clock size={14} />,
        Pending: <AlertCircle size={14} />,
    };

    return (
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
            {icons[status]}
            {status}
        </span>
    );
};

const Interventions = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Interventions</h1>
                <p className="text-slate-400 mt-2">Track the progress and history of student support activities.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search interventions..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all text-sm font-medium">
                    <Filter size={18} />
                    Filter Status
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {interventions.map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all hover:bg-slate-800/40 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-500 hover:text-white rounded-lg"><MoreVertical size={20} /></button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:border-primary-500/50 transition-colors">
                                    <ClipboardCheck className="text-primary-500" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{item.type}</h4>
                                    <p className="text-sm text-slate-400 flex items-center gap-2 mt-0.5">
                                        {item.student} <span className="h-1 w-1 bg-slate-700 rounded-full"></span> {item.sid}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Supervisor</p>
                                    <p className="text-sm font-medium text-slate-300">{item.supervisor}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date Initiated</p>
                                    <p className="text-sm font-medium text-slate-300">{item.date}</p>
                                </div>
                                <div className="pt-1">
                                    <StatusBadge status={item.status} />
                                </div>
                                <button className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 hover:bg-primary-600 hover:border-primary-500 transition-all group/btn">
                                    <ExternalLink className="text-slate-400 group-hover/btn:text-white" size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Interventions;
