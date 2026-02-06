import React, { useState } from 'react';
import api from '../api/axios';
import { Upload, Download, FileText, AlertCircle, CheckCircle2, X } from 'lucide-react';

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
        if (!file) {
            alert('Please select a file first');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/bulk/import-students', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
            setFile(null);
        } catch (error) {
            setResult({
                msg: error.response?.data?.msg || 'Upload failed',
                success_count: 0,
                error_count: 0,
                errors: [error.message]
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
            link.setAttribute('download', 'student_import_template.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Failed to download template');
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
            const filename = response.headers['content-disposition']?.split('filename=')[1] || 'students_export.xlsx';
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Export failed: ' + (error.response?.data?.msg || error.message));
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Bulk Operations</h1>
                <p className="text-slate-400 mt-2">Import and export student data</p>
            </div>

            {/* Import Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Upload size={24} className="text-indigo-400" />
                    Import Students from CSV
                </h2>

                <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Select CSV File
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-400
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-xl file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-indigo-600 file:text-white
                                    hover:file:bg-indigo-700 cursor-pointer"
                            />
                            <button
                                onClick={handleDownloadTemplate}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center gap-2 whitespace-nowrap"
                            >
                                <FileText size={18} />
                                Download Template
                            </button>
                        </div>
                        {file && (
                            <div className="mt-2 text-sm text-slate-400">
                                Selected: {file.name}
                            </div>
                        )}
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>Uploading...</>
                        ) : (
                            <>
                                <Upload size={20} />
                                Import Students
                            </>
                        )}
                    </button>

                    {/* Result */}
                    {result && (
                        <div className={`p-4 rounded-xl border ${result.success_count > 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                            }`}>
                            <div className="flex items-start gap-3">
                                {result.success_count > 0 ? (
                                    <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={24} />
                                ) : (
                                    <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
                                )}
                                <div className="flex-1">
                                    <p className={result.success_count > 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                        {result.msg}
                                    </p>
                                    {result.errors && result.errors.length > 0 && (
                                        <div className="mt-2 text-sm opacity-80">
                                            <p className="font-bold mb-1">Errors:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                {result.errors.map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setResult(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Export Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Download size={24} className="text-emerald-400" />
                    Export Student Data
                </h2>

                <p className="text-slate-400 mb-4">
                    Export all student data to an Excel spreadsheet including GPA, attendance, and risk status.
                </p>

                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {exporting ? (
                        <>Exporting...</>
                    ) : (
                        <>
                            <Download size={20} />
                            Export to Excel
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default BulkOperations;
