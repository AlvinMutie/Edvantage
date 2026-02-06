import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';
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
    Menu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
            ? 'bg-primary-600/10 text-primary-500 border border-primary-500/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

const Navbar = ({ schoolSettings, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    return (
        <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2">
                    {schoolSettings?.logo ? (
                        <img src={schoolSettings.logo} alt="Logo" className="w-8 h-8 object-contain" />
                    ) : (
                        <ShieldAlert className="text-primary-500 h-6 w-6" />
                    )}
                    <span className="font-bold text-xl tracking-tight text-white">{schoolSettings?.name || 'EdVantage'}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 relative">
                <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 text-slate-400 hover:text-white transition-colors relative"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-primary-500 rounded-full"></span>
                </button>
                <NotificationCenter
                    isOpen={isNotificationsOpen}
                    onClose={() => setIsNotificationsOpen(false)}
                />
                <div className="h-8 w-px bg-slate-800 mx-2"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-white leading-none capitalize">{user?.username}</p>
                        <p className="text-xs text-slate-500 mt-1 capitalize">{user?.role}</p>
                    </div>
                    <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                        <UserIcon size={20} className="text-slate-400" />
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

const DashboardLayout = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();

    const [schoolSettings, setSchoolSettings] = useState({ name: 'EdVantage', logo: null });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to open on desktop

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Since api needs auth (and this is inside layout which checks auth), it should be fine.
                // But actually settings endpoint is public GET, so we don't strictly need auth for GET.
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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard', roles: ['admin', 'supervisor'] },
        { icon: LayoutDashboard, label: 'My Dashboard', path: '/dashboard', roles: ['student'] },
        { icon: Shield, label: 'Admin Panel', path: '/dashboard', roles: ['superadmin'] },
        { icon: Users, label: 'User Management', path: '/dashboard/users', roles: ['superadmin'] },
        { icon: Users, label: 'Students', path: '/dashboard/students', roles: ['admin', 'supervisor'] },
        { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages', roles: ['admin', 'supervisor', 'student'] },
        { icon: FileText, label: 'Risk Rules', path: '/dashboard/risk', roles: ['admin'] },
        { icon: SettingsIcon, label: 'Settings', path: '/dashboard/settings', roles: ['admin', 'superadmin'] },
    ].filter(item => item.roles.includes(user?.role));

    return (
        <div className="flex bg-slate-950 min-h-screen">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 bg-slate-900 border-r border-slate-800 w-64 z-40 flex flex-col">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3 flex-shrink-0">
                        {schoolSettings.logo ? (
                            <img src={schoolSettings.logo} alt="Logo" className="w-8 h-8 object-contain" />
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                                <span className="text-white font-bold">E</span>
                            </div>
                        )}
                        <span className="font-bold text-white truncate text-lg">{schoolSettings.name}</span>
                    </div>

                    {/* Navigation */}
                    <aside className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                {...item}
                                active={location.pathname === item.path}
                            />
                        ))}
                    </aside>

                    {/* User Profile */}
                    <div className="p-4 border-t border-slate-800 flex-shrink-0">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                                <UserIcon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                                <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
                            </div>
                            <Link to="/login" className="p-2 text-slate-500 hover:text-white transition-colors">
                                <LogOut size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-64">
                {/* Top Navbar */}
                <Navbar schoolSettings={schoolSettings} toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
