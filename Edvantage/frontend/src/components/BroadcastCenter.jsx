import React, { useState } from 'react';
import api from '../api/axios';
import { Megaphone, Send, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const BroadcastCenter = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleBroadcast = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await api.post('/notifications/broadcast', {
                title,
                message,
                type
            });
            setStatus({ type: 'success', text: 'Broadcast sent successfully!' });
            setTitle('');
            setMessage('');
        } catch (err) {
            setStatus({ type: 'error', text: 'Failed to send broadcast.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl">
                    <Megaphone className="text-indigo-400 h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Broadcast Center</h2>
                    <p className="text-slate-400 text-sm">Send system-wide notifications to all users.</p>
                </div>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4">
                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Alert Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="e.g. System Maintenance"
                        required
                    />
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none h-24 resize-none"
                        placeholder="Type your announcement here..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Alert Type</label>
                    <div className="flex gap-4">
                        {['info', 'warning', 'success', 'error'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-2 capitalize transition-all ${type === t
                                        ? 'bg-indigo-600 border-indigo-500 text-white'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                    }`}
                            >
                                {t === 'info' && <Info size={16} />}
                                {t === 'warning' && <AlertTriangle size={16} />}
                                {t === 'success' && <CheckCircle2 size={16} />}
                                {t === 'error' && <XCircle size={16} />}
                                <span className="text-sm">{t}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {status && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                        <span className="text-sm font-medium">{status.text}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Sending...' : (
                        <>
                            <Send size={18} />
                            Send Broadcast
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default BroadcastCenter;
