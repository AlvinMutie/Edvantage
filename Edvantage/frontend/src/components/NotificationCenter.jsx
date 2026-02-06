import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    Bell,
    AlertTriangle,
    MessageSquare,
    CheckCircle2,
    Clock,
    X,
    Info,
    Megaphone
} from 'lucide-react';

const NotificationCenter = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            const fetchNotifications = async () => {
                try {
                    const res = await api.get('/notifications/');
                    setNotifications(res.data);
                } catch (err) {
                    console.error("Failed to fetch notifications", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchNotifications();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return AlertTriangle;
            case 'success': return CheckCircle2;
            case 'error': return AlertTriangle;
            default: return Info; // or Megaphone for general
        }
    }

    const getColor = (type) => {
        switch (type) {
            case 'warning': return 'text-amber-500 bg-amber-500/10';
            case 'success': return 'text-emerald-500 bg-emerald-500/10';
            case 'error': return 'text-red-500 bg-red-500/10';
            default: return 'text-blue-500 bg-blue-500/10';
        }
    }

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="absolute top-16 right-0 w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Notifications</h3>
                <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white rounded-lg transition-colors">
                    <X size={18} />
                </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
                {loading && <div className="p-4 text-center text-slate-500">Loading...</div>}

                {!loading && notifications.length > 0 ? (
                    notifications.map((notif) => {
                        const Icon = getIcon(notif.type);
                        const colorClass = getColor(notif.type);

                        return (
                            <div key={notif.id} className="p-4 border-b border-slate-800/50 flex gap-4 hover:bg-slate-800/30 transition-colors cursor-pointer group">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center border border-white/5 transition-transform group-hover:scale-110 ${colorClass}`}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-bold text-white truncate">{notif.title}</h4>
                                        <span className="text-[10px] text-slate-500 whitespace-nowrap">{formatTime(notif.created_at)}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    !loading && (
                        <div className="p-8 text-center">
                            <p className="text-slate-500 text-sm">No new notifications</p>
                        </div>
                    )
                )}
            </div>
            <div className="p-4 bg-slate-900/50 text-center border-t border-slate-800">
                <button className="text-xs font-bold text-primary-500 hover:text-primary-400 transition-colors">View All Notifications</button>
            </div>
        </div>
    );
};

export default NotificationCenter;
