import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    Settings, 
    Upload, 
    Save, 
    CheckCircle2, 
    AlertTriangle, 
    Building2, 
    Mail, 
    MapPin,
    Shield,
    Image as ImageIcon,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// UI Components
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';

const SchoolSettings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        school_name: '',
        address: '',
        contact_email: '',
        logo_url: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    // Fetch existing settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings/');
                setSettings(res.data);
                if (res.data.logo_url) {
                    setPreviewUrl(`http://127.0.0.1:5000${res.data.logo_url}`);
                }
            } catch (err) {
                console.error("Failed to load settings", err);
            }
        };
        fetchSettings();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append('school_name', settings.school_name);
        formData.append('address', settings.address || ''); 
        formData.append('contact_email', settings.contact_email || '');
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        try {
            await api.put('/settings/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus({ type: 'success', text: 'Institutional parameters synchronized successfully.' });
        } catch (err) {
            setStatus({ type: 'error', text: 'Protocol error: Failed to update institutional data.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-12">
            <SectionHeader 
                title="Institutional Identity" 
                description="Configure the core identity, branding, and global parameters for your educational platform."
            >
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-2 text-slate-400">
                        <RefreshCw size={16} />
                        Sync Status
                    </Button>
                </div>
            </SectionHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Branding Side */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-8 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-500"></div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Platform Branding</h3>
                        
                        <div className="relative w-48 h-48 mx-auto mb-8 bg-slate-950 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-white/10 group-hover:border-primary-500/50 transition-all duration-500 overflow-hidden shadow-2xl">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <ImageIcon className="text-slate-700" size={48} />
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No Logo</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <Upload className="text-primary-400 mb-2" size={32} />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Upload New</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 cursor-pointer opacity-0"
                            />
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                Recommended: 512x512px<br />PNG or SVG for transparency
                            </p>
                            <Badge variant="neutral" className="bg-white/5 border-white/5">v4.0.2 Stable</Badge>
                        </div>
                    </Card>

                    <Card className="p-6 bg-primary-600/10 border-primary-500/20">
                        <div className="flex gap-4">
                            <div className="p-3 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20 h-fit">
                                <Shield className="text-white" size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">Global Security</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">Branding changes will propagate across all student and teacher dashboards instantly.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Configuration Form */}
                <div className="lg:col-span-8">
                    <Card className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Institutional Nomenclature</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={settings.school_name}
                                            onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-500/50 transition-all font-bold tracking-tight"
                                            placeholder="e.g. EdVantage Intelligence Academy"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Administrative Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                                            <input
                                                type="email"
                                                value={settings.contact_email}
                                                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                                                placeholder="admin@edvantage.ai"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Geographic Location</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={settings.address}
                                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                                                placeholder="San Francisco, CA"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {status && (
                                <div className={`p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 duration-300 border ${
                                    status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                    <div className={`p-2 rounded-lg ${status.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                        {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                                    </div>
                                    <span className="text-sm font-bold uppercase tracking-tight">{status.text}</span>
                                </div>
                            )}

                            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <p className="text-xs text-slate-500 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto px-10 py-4 shadow-xl shadow-primary-500/20 gap-2"
                                >
                                    {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                                    Commit Settings
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SchoolSettings;

