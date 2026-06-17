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
    Sparkles,
    Command,
    ExternalLink
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from './ui/Button';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
    <Link
        to={path}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${active
            ? 'bg-primary-500/10 text-primary-400 font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
    >
        <div className={`flex items-center justify-center transition-all duration-500 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}`}>
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        </div>
        {!collapsed && <span className="text-sm tracking-tight">{label}</span>}
        
        {active && (
            <>
                <div className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                <div className="absolute right-2 opacity-20">
                    <ChevronRight size={14} />
                </div>
            </>
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
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
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
        return () => window.removeEventListener('scroll', handleScroll);
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
        <div className="flex bg-[#020617] min-h-screen font-sans text-slate-200 selection:bg-primary-500/30">
            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-primary-500/5 via-transparent to-indigo-500/5"></div>

            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-white/5 bg-slate-950/40 backdrop-blur-2xl ${
                    isSidebarCollapsed ? 'w-20' : 'w-72'
                }`}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center px-7 gap-4 mb-4">
                    <div className="relative group flex-shrink-0">
                        <div className="absolute inset-0 bg-primary-500/30 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10 w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 p-2 shadow-lg shadow-primary-500/20">
                            <img 
                                src={schoolSettings.logo || logo} 
                                alt="Logo" 
                                className="w-full h-full object-contain brightness-0 invert" 
                            />
                        </div>
                    </div>
                    {!isSidebarCollapsed && (
                        <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-4 duration-500">
                            <span className="font-black text-white truncate text-xl tracking-tighter leading-none mb-1">
                                {schoolSettings.name}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em]">
                                    Enterprise
                                </span>
                                <div className="h-1 w-1 rounded-full bg-slate-700"></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    v2.1
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Action / Command */}
                {!isSidebarCollapsed && (
                    <div className="px-5 mb-8">
                        <button className="w-full flex items-center justify-between bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-2xl p-3 group transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <Command size={14} className="text-slate-500 group-hover:text-primary-400" />
                                <span className="text-xs font-bold text-slate-400 group-hover:text-white">Quick Search</span>
                            </div>
                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-slate-500">
                                <span>⌘</span>
                                <span>K</span>
                            </div>
                        </button>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                            collapsed={isSidebarCollapsed}
                        />
                    ))}
                </nav>

                {/* Bottom Profile Section */}
                <div className="p-5 mt-auto border-t border-white/5 bg-slate-950/20">
                    <div className={`flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all cursor-pointer group ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white flex-shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                                <UserIcon size={16} className="text-slate-400 group-hover:text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 border-2 border-slate-950 rounded-full"></div>
                        </div>
                        {!isSidebarCollapsed && (
                            <div className="flex-1 min-w-0 animate-in fade-in duration-500">
                                <p className="text-xs font-black text-white truncate capitalize tracking-tight">{user?.username}</p>
                                <p className="text-[10px] text-slate-500 truncate capitalize font-bold tracking-widest uppercase opacity-70">{user?.role}</p>
                            </div>
                        )}
                        {!isSidebarCollapsed && (
                            <button 
                                onClick={logout}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                            >
                                <LogOut size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Collapse Toggle */}
                <button 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="absolute -right-3.5 top-24 w-7 h-7 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/50 transition-all shadow-2xl z-50 group"
                >
                    <ChevronRight size={14} className={`transition-transform duration-500 ${isSidebarCollapsed ? 'group-hover:translate-x-0.5' : 'rotate-180 group-hover:-translate-x-0.5'}`} />
                </button>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative z-10 ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
                {/* Header */}
                <header 
                    className={`h-20 flex items-center justify-between px-10 sticky top-0 z-40 transition-all duration-300 ${
                        scrolled ? 'bg-slate-950/60 border-b border-white/5 backdrop-blur-xl h-16' : 'bg-transparent'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            <span className="hover:text-primary-400 cursor-pointer transition-colors">Portal</span>
                            <ChevronRight size={10} className="opacity-30" />
                            <h1 className="text-slate-200">
                                {location.pathname.split('/').filter(Boolean).slice(1).join(' / ') || 'Overview'}
                            </h1>
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-success-500/5 border border-success-500/10 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-success-500 uppercase tracking-widest">System Operational</span>
                            </div>
                        </div>

                        <div className="h-6 w-px bg-white/10"></div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2.5 text-slate-400 hover:text-white transition-all relative group bg-white/[0.03] hover:bg-white/10 border border-white/5 rounded-2xl"
                            >
                                <Bell size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                            </button>
                            
                            <NotificationCenter
                                isOpen={isNotificationsOpen}
                                onClose={() => setIsNotificationsOpen(false)}
                            />

                            <Button variant="ghost" size="sm" className="gap-2 bg-white/[0.03] border border-white/5 rounded-2xl px-4" onClick={() => navigate('/dashboard/search')}>
                                <Sparkles size={14} className="text-primary-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest">AI Insights</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </main>

                {/* Footer Insight */}
                <footer className="px-10 py-8 border-t border-white/5 mt-auto flex flex-col md:flex-row justify-between items-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        &copy; 2026 EdVantage Enterprise Academic OS
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-400 flex items-center gap-1.5 transition-colors">
                            Documentation <ExternalLink size={10} />
                        </a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-400 flex items-center gap-1.5 transition-colors">
                            Support Hub <ExternalLink size={10} />
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;

