import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';
import logo from '../assets/logo.png';
import {
    LayoutDashboard,
    Users,
    ClipboardCheck,
    Bell,
    LogOut,
    User as UserIcon,
    ShieldAlert,
    MessageSquare,
    FileText,
    Shield,
    Settings as SettingsIcon,
    X,
    Menu,
    Search,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Button } from './ui/Button';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
    <Link
        to={path}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${active
            ? 'bg-primary-500/10 text-primary-400 font-semibold'
            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
    >
        <div className={`flex items-center justify-center transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        </div>
        {!collapsed && <span className="text-sm tracking-tight">{label}</span>}
        {active && (
            <div className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full" />
        )}
    </Link>
);

const DashboardLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [schoolSettings, setSchoolSettings] = useState({ name: 'EdVantage', logo: null });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings/');
                setSchoolSettings({
                    name: res.data.school_name || 'EdVantage',
                    logo: res.data.logo_url ? `http://127.0.0.1:5000${res.data.logo_url}` : null
                });
            } catch (err) {
                console.error("Failed to fetch school settings", err);
            }
        };
        fetchSettings();
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard', roles: ['admin', 'supervisor'] },
        { icon: LayoutDashboard, label: 'My Dashboard', path: '/dashboard', roles: ['student', 'teacher', 'counselor', 'parent'] },
        { icon: Shield, label: 'Admin Panel', path: '/dashboard', roles: ['superadmin'] },
        { icon: Users, label: 'User Management', path: '/dashboard/users', roles: ['superadmin'] },
        { icon: Users, label: 'Students', path: '/dashboard/students', roles: ['admin', 'supervisor', 'teacher', 'counselor'] },
        { icon: ClipboardCheck, label: 'Attendance', path: '/dashboard/attendance', roles: ['teacher', 'admin'] },
        { icon: FileText, label: 'Grades', path: '/dashboard/grades', roles: ['teacher', 'admin', 'student', 'parent'] },
        { icon: ShieldAlert, label: 'Referrals', path: '/dashboard/referrals', roles: ['teacher', 'supervisor', 'counselor'] },
        { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages', roles: ['admin', 'supervisor', 'student', 'teacher', 'counselor', 'parent'] },
        { icon: FileText, label: 'Risk Rules', path: '/dashboard/risk', roles: ['admin'] },
        { icon: SettingsIcon, label: 'Settings', path: '/dashboard/settings', roles: ['admin', 'superadmin'] },
    ].filter(item => item.roles.includes(user?.role));

    return (
        <div className="flex bg-[#020617] min-h-screen font-sans text-slate-200">
            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r border-white/5 bg-slate-950/50 backdrop-blur-xl ${
                    isSidebarCollapsed ? 'w-20' : 'w-64'
                }`}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 gap-3 mb-6">
                    <div className="relative group flex-shrink-0">
                        <div className="absolute inset-0 bg-primary-500/20 blur-lg rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                        <img 
                            src={schoolSettings.logo || logo} 
                            alt="Logo" 
                            className="w-8 h-8 object-contain relative z-10" 
                        />
                    </div>
                    {!isSidebarCollapsed && (
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-white truncate text-lg tracking-tight leading-tight">
                                {schoolSettings.name}
                            </span>
                            <span className="text-[10px] font-bold text-primary-400/60 uppercase tracking-widest">
                                Platform
                            </span>
                        </div>
                    )}
                </div>

                {/* Search Bar (Optional, Premium feel) */}
                {!isSidebarCollapsed && (
                    <div className="px-4 mb-6">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-primary-500/50 transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                            collapsed={isSidebarCollapsed}
                        />
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 mt-auto border-t border-white/5">
                    <div className={`flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary-500/20">
                            <UserIcon size={14} />
                        </div>
                        {!isSidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate capitalize">{user?.username}</p>
                                <p className="text-[10px] text-slate-500 truncate capitalize font-medium">{user?.role}</p>
                            </div>
                        )}
                        {!isSidebarCollapsed && (
                            <button 
                                onClick={logout}
                                className="text-slate-500 hover:text-red-400 transition-colors"
                            >
                                <LogOut size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Collapse Toggle */}
                <button 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl"
                >
                    <ChevronRight size={12} className={`transition-transform duration-300 ${isSidebarCollapsed ? '' : 'rotate-180'}`} />
                </button>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-bold text-slate-400 flex items-center gap-2 capitalize">
                            {location.pathname.split('/').filter(Boolean).slice(1).join(' / ') || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-success-500/10 border border-success-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-success-500 uppercase tracking-tighter">System Live</span>
                        </div>

                        <button 
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="p-2 text-slate-400 hover:text-white transition-all relative group"
                        >
                            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary-500 rounded-full border-2 border-slate-950"></span>
                        </button>
                        
                        <NotificationCenter
                            isOpen={isNotificationsOpen}
                            onClose={() => setIsNotificationsOpen(false)}
                        />

                        <div className="h-6 w-px bg-white/5 mx-2"></div>
                        
                        <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/dashboard/search')}>
                            <Sparkles size={14} className="text-primary-400" />
                            <span className="text-xs">AI Insights</span>
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

