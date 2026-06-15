import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    Trash2, 
    Search, 
    Pencil, 
    Key, 
    X, 
    Check, 
    Eye, 
    EyeOff, 
    TriangleAlert,
    Users,
    ShieldCheck,
    UserPlus,
    RefreshCw,
    UserCog,
    Mail,
    Calendar,
    Lock
} from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit User State
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({ username: '', email: '', role: '' });

    // Reset Password State
    const [resettingUser, setResettingUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users/');
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert("Failed to delete user: " + (err.response?.data?.msg || err.message));
        }
    };

    const startEdit = (user) => {
        setEditingUser(user);
        setEditFormData({ username: user.username, email: user.email, role: user.role });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/users/${editingUser.id}`, editFormData);
            setUsers(users.map(u => u.id === editingUser.id ? res.data : u));
            setEditingUser(null);
        } catch (err) {
            alert("Failed to update user: " + (err.response?.data?.msg || err.message));
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/users/${resettingUser.id}/reset-password`, { password: newPassword });
            setResettingUser(null);
            setNewPassword('');
            alert("Password updated successfully.");
        } catch (err) {
            alert("Failed to reset password: " + (err.response?.data?.msg || err.message));
        }
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role) => {
        switch (role) {
            case 'superadmin': return <Badge variant="danger" className="text-[9px]">Superadmin</Badge>;
            case 'admin': return <Badge variant="warning" className="text-[9px]">Admin</Badge>;
            case 'supervisor': return <Badge variant="info" className="text-[9px]">Supervisor</Badge>;
            case 'student': return <Badge variant="success" className="text-[9px]">Student</Badge>;
            default: return <Badge variant="neutral" className="text-[9px]">{role}</Badge>;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Syncing User Directory...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-12">
            <SectionHeader 
                title="Identity Management" 
                description="Administer institutional access, roles, and security credentials."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-2 text-slate-400">
                        <RefreshCw size={16} />
                        Reload
                    </Button>
                    <Button size="sm" className="gap-2 shadow-lg shadow-primary-500/20">
                        <UserPlus size={16} />
                        Provision User
                    </Button>
                </div>
            </SectionHeader>

            <StatGroup>
                <KPICard label="Total Entities" value={users.length} icon={Users} />
                <KPICard label="Privileged" value={users.filter(u => u.role !== 'student').length} icon={ShieldCheck} />
                <KPICard label="Active Roles" value={new Set(users.map(u => u.role)).size} icon={UserCog} />
            </StatGroup>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by identity or email..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all placeholder:text-slate-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Security Role</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Provisioned Date</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Access Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 border border-white/10 group-hover:scale-110 transition-transform">
                                                <Users size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{user.username}</p>
                                                <p className="text-[10px] font-bold text-slate-500 truncate max-w-[200px]">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Calendar size={12} />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(user)}
                                                className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                                title="Modify Account"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => setResettingUser(user)}
                                                className="p-2 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-all"
                                                title="Cycle Credentials"
                                            >
                                                <Key size={16} />
                                            </button>
                                            {user.role !== 'superadmin' && (
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                    title="Revoke Access"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <Card className="w-full max-w-md p-8 shadow-2xl border-white/10 animate-in zoom-in-95">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20">
                                    <UserCog className="text-white" size={24} />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase">Modify Identity</h3>
                            </div>
                            <button onClick={() => setEditingUser(null)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Username</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        value={editFormData.username}
                                        onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="email"
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Platform Role</label>
                                <select
                                    value={editFormData.role}
                                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                >
                                    <option value="student" className="bg-slate-900">Student</option>
                                    <option value="supervisor" className="bg-slate-900">Supervisor</option>
                                    <option value="admin" className="bg-slate-900">Admin</option>
                                    <option value="superadmin" className="bg-slate-900">Superadmin</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="ghost" className="flex-1" onClick={() => setEditingUser(null)}>Cancel</Button>
                                <Button type="submit" className="flex-1 shadow-lg shadow-primary-500/20">
                                    Commit Changes
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Reset Password Modal */}
            {resettingUser && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <Card className="w-full max-w-md p-8 shadow-2xl border-white/10 animate-in zoom-in-95">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
                                    <Lock className="text-white" size={24} />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase">Rotate Credentials</h3>
                            </div>
                            <button onClick={() => setResettingUser(null)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-8">
                            <p className="text-xs text-amber-200/60 leading-relaxed font-medium">
                                You are about to override security credentials for <span className="text-white font-black">{resettingUser.username}</span>. This action is recorded in the institutional audit log.
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="relative">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">New Security Token</label>
                                <div className="relative group">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={16} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                        placeholder="Enter new password..."
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="ghost" className="flex-1" onClick={() => setResettingUser(null)}>Cancel</Button>
                                <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-500/20">
                                    Update Token
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

