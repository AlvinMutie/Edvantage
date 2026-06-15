import React, { useState } from 'react';
import api from '../api/axios';
import { 
    Upload, 
    Download, 
    FileText, 
    AlertCircle, 
    CheckCircle2, 
    X,
    Database,
    FileSpreadsheet,
    ArrowRight,
    Loader2,
    ShieldCheck
} from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';

const BulkOperations = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [exporting, setExporting] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResult(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/bulk/import-students', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult({ ...res.data, type: 'success' });
            setFile(null);
        } catch (error) {
            setResult({
                msg: error.response?.data?.msg || 'Import operation failed due to structure mismatch.',
                success_count: 0,
                error_count: 1,
                errors: [error.message],
                type: 'error'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await api.get('/bulk/download-template', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'edvantage_import_template.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download template');
        }
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await api.get('/bulk/export-students', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = response.headers['content-disposition']?.split('filename=')[1] || `students_export_${new Date().getTime()}.xlsx`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-12">
            <SectionHeader 
                title="Data Control Center" 
                description="High-volume data ingestion and extraction protocols for student records."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2">
                        <FileText size={16} />
                        Get Schema Template
                    </Button>
                </div>
            </SectionHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ingestion Section */}
                <Card className="p-8 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
                            <Upload className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Mass Ingestion</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Import student datasets via CSV</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="relative group">
                            <div className={`border-2 border-dashed rounded-[2rem] p-12 transition-all duration-300 flex flex-col items-center justify-center text-center ${
                                file ? 'border-primary-500 bg-primary-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                            }`}>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className={`p-4 rounded-2xl mb-4 ${file ? 'bg-primary-500 text-white' : 'bg-white/5 text-slate-500'}`}>
                                    <FileSpreadsheet size={32} />
                                </div>
                                {file ? (
                                    <div>
                                        <p className="text-white font-bold">{file.name}</p>
                                        <p className="text-slate-500 text-xs mt-1">Ready for synchronization</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-white font-bold">Select Dataset</p>
                                        <p className="text-slate-500 text-xs mt-1">Drag and drop your CSV file here</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={handleUpload}
                            disabled={uploading || !file}
                            className="w-full py-4 shadow-xl shadow-primary-500/20 gap-2"
                        >
                            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                            Execute Import Protocol
                        </Button>

                        {result && (
                            <div className={`p-6 rounded-2xl border animate-in slide-in-from-top-4 duration-300 ${
                                result.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                            }`}>
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-xl ${result.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {result.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-black uppercase tracking-tight mb-2 ${result.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {result.msg}
                                        </h4>
                                        <div className="flex gap-4 mb-4">
                                            <div className="text-[10px] font-black uppercase text-slate-500">Success: <span className="text-white">{result.success_count}</span></div>
                                            <div className="text-[10px] font-black uppercase text-slate-500">Failed: <span className="text-white">{result.error_count}</span></div>
                                        </div>
                                        {result.errors && result.errors.length > 0 && (
                                            <div className="bg-black/20 rounded-xl p-3 max-h-32 overflow-y-auto custom-scrollbar">
                                                <ul className="space-y-1">
                                                    {result.errors.map((error, index) => (
                                                        <li key={index} className="text-[10px] font-bold text-red-400/80 uppercase tracking-tighter">Row {index + 1}: {error}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => setResult(null)} className="text-slate-500 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Extraction Section */}
                <Card className="p-8 flex flex-col justify-between">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                                <Download className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Database Extraction</h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Export full student records to Excel</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                                <div className="flex items-center gap-4 mb-4">
                                    <ShieldCheck className="text-emerald-500" size={24} />
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Snapshot Integrity</h4>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    Generates a high-fidelity XLSX export of all students, including GPA metrics, attendance logs, and AI risk status snapshots.
                                </p>
                            </div>

                            <ul className="space-y-3">
                                {['Student Identity Data', 'Academic Performance Logs', 'AI Risk Assessment History', 'Intervention Audit Trails'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <Button
                        onClick={handleExport}
                        disabled={exporting}
                        className="w-full py-4 mt-8 bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 gap-2"
                    >
                        {exporting ? <Loader2 className="animate-spin" size={20} /> : <FileSpreadsheet size={20} />}
                        Execute XLSX Extraction
                    </Button>
                </Card>
            </div>

            {/* AI Warning Panel */}
            <Card className="p-8 border-primary-500/20 bg-primary-600/5 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <Database className="absolute -left-12 -bottom-12 text-primary-500/5" size={240} />
                <div className="p-4 bg-primary-500 rounded-3xl shadow-2xl shadow-primary-500/40 relative z-10 flex-shrink-0">
                    <Database className="text-white" size={40} />
                </div>
                <div className="relative z-10 flex-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Automated Data Validation</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Our ingestion engine automatically validates student records against institutional schemas. Any anomalies in GPA, attendance, or student IDs will be flagged for review before permanent database commitment.
                    </p>
                </div>
                <Button variant="outline" className="relative z-10 border-primary-500/30 text-primary-400 group h-fit py-4 px-8">
                    Read Schema Specs
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Card>
        </div>
    );
};

export default BulkOperations;

