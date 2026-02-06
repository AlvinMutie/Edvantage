import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trash2, Search, Edit2, Key, X, Check, Eye, EyeOff } from 'lucide-react';

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
            alert("Password reset successfully!");
            setResettingUser(null);
            setNewPassword('');
        } catch (err) {
            alert("Failed to reset password: " + (err.response?.data?.msg || err.message));
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (role) => {
        switch (role) {
            case 'superadmin': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'admin': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'supervisor': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'student': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-700 text-slate-300';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <p className="text-slate-400 mt-1">Total Users: {users.length}</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/50 border-b border-slate-800">
                            <tr>
                                <th className="p-4 text-slate-400 font-medium">Username</th>
                                <th className="p-4 text-slate-400 font-medium">Email</th>
                                <th className="p-4 text-slate-400 font-medium">Role</th>
                                <th className="p-4 text-slate-400 font-medium">Created At</th>
                                <th className="p-4 text-slate-400 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-medium text-white">{user.username}</td>
                                    <td className="p-4 text-slate-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user.role)} capitalize`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => startEdit(user)}
                                            className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                                            title="Edit User"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setResettingUser(user)}
                                            className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
                                            title="Reset Password"
                                        >
                                            <Key size={18} />
                                        </button>
                                        {user.role !== 'superadmin' && (
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Edit User</h3>
                            <button onClick={() => setEditingUser(null)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-slate-400 text-sm mb-1">Username</label>
                                <input
                                    type="text"
                                    value={editFormData.username}
                                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm mb-1">Role</label>
                                <select
                                    value={editFormData.role}
                                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                                >
                                    <option value="student">Student</option>
                                    <option value="supervisor">Supervisor</option>
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Superadmin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl flex items-center gap-2">
                                    <Check size={18} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {resettingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Reset Password</h3>
                            <button onClick={() => setResettingUser(null)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-400 mb-4">
                                Resetting password for <span className="font-bold text-white">{resettingUser.username}</span>.
                            </p>
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="relative">
                                    <label className="block text-slate-400 text-sm mb-1">New Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                                        placeholder="Enter new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-8 text-slate-500 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setResettingUser(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                    <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl flex items-center gap-2">
                                        <Key size={18} /> Reset Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
