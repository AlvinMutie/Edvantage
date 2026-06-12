import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Settings, Upload, Save, CheckCircle2, AlertTriangle, Building2, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
        formData.append('address', settings.address || ''); // Handle nulls
        formData.append('contact_email', settings.contact_email || '');
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        try {
            const res = await api.put('/settings/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSettings(res.data);
            setStatus({ type: 'success', text: 'School settings updated successfully!' });

            // Optional: Force reload to update Logo in Sidebar immediately if we don't use Context
            // window.location.reload(); 
        } catch (err) {
            setStatus({ type: 'error', text: 'Failed to update settings.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl">
                        <Settings className="text-indigo-400 h-8 w-8" />
                    </div>
                    School Configuration
                </h1>
                <p className="text-slate-400 mt-2 ml-14">Customize your institution's identity and branding.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo Upload Section */}
                <div className="md:col-span-1">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                        <h3 className="text-lg font-bold text-white mb-4">School Logo</h3>
                        <div className="relative w-40 h-40 mx-auto mb-6 bg-slate-950 rounded-full flex items-center justify-center border-2 border-dashed border-slate-700 overflow-hidden group">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                            ) : (
                                <Building2 className="text-slate-600 h-16 w-16" />
                            )}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="text-white h-8 w-8" />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 cursor-pointer opacity-0"
                            />
                        </div>
                        <p className="text-xs text-slate-500">
                            Click to upload (PNG, JPG)<br />Max size: 2MB
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                                <Building2 size={16} /> Institution Name
                            </label>
                            <input
                                type="text"
                                value={settings.school_name}
                                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="e.g. Saint Mary's High School"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                                    <Mail size={16} /> Contact Email
                                </label>
                                <input
                                    type="email"
                                    value={settings.contact_email}
                                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="admin@school.edu"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                                    <MapPin size={16} /> Address
                                </label>
                                <input
                                    type="text"
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>

                        {status && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                                <span className="text-sm font-medium">{status.text}</span>
                            </div>
                        )}

                        <div className="pt-4 border-t border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <Save size={18} /> Save Configuration
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SchoolSettings;
