import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Shield, UserCheck, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BroadcastCenter from '../components/BroadcastCenter';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${bg}`}>
                <Icon className={`${color} h-6 w-6`} />
            </div>
            <div>
                <p className="text-slate-400 font-medium">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, admin: 0, supervisor: 0, student: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users/');
                const users = res.data;
                const newStats = {
                    total: users.length,
                    admin: users.filter(u => u.role === 'admin').length,
                    supervisor: users.filter(u => u.role === 'supervisor').length,
                    student: users.filter(u => u.role === 'student').length,
                    superadmin: users.filter(u => u.role === 'superadmin').length
                };
                setStats(newStats);
            } catch (err) {
                console.error("Failed to fetch user stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="text-white">Loading system stats...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white">System Administration</h1>
                <p className="text-slate-400 mt-2">Manage user accounts and system access.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Accounts" value={stats.total} color="text-blue-400" bg="bg-blue-500/10" />
                <StatCard icon={Shield} label="Admins" value={stats.admin} color="text-amber-400" bg="bg-amber-500/10" />
                <StatCard icon={UserCheck} label="Supervisors" value={stats.supervisor} color="text-emerald-400" bg="bg-emerald-500/10" />
                <StatCard icon={GraduationCap} label="Students" value={stats.student} color="text-purple-400" bg="bg-purple-500/10" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">User Management</h3>
                        <p className="text-slate-400 mb-6">Create, edit, or remove system users (Admins, Supervisors, Students).</p>
                        <Link
                            to="/dashboard/users"
                            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                        >
                            Manage Users <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

                <div className="mt-8">
                    <BroadcastCenter />
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
