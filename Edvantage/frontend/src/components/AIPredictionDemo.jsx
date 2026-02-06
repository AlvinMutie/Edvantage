import React, { useState } from 'react';
import api from '../api/axios';
import { Brain, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const AIPredictionDemo = () => {
    const [formData, setFormData] = useState({
        gpa: '3.0',
        attendance: '85',
        missed_deadlines: '2'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/ai/predict', {
                gpa: parseFloat(formData.gpa),
                attendance: parseFloat(formData.attendance),
                missed_deadlines: parseInt(formData.missed_deadlines)
            });
            setResult(res.data);
        } catch (err) {
            alert('AI Prediction failed: ' + (err.response?.data?.msg || err.message));
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getRiskIcon = (level) => {
        switch (level) {
            case 'High': return <AlertCircle className="text-red-400" size={32} />;
            case 'Medium': return <TrendingUp className="text-amber-400" size={32} />;
            case 'Low': return <CheckCircle2 className="text-emerald-400" size={32} />;
            default: return <Brain className="text-slate-400" size={32} />;
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                    <Brain className="text-indigo-400 h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">AI Risk Predictor</h3>
                    <p className="text-xs text-slate-500">Powered by Random Forest ML</p>
                </div>
            </div>

            <form onSubmit={handlePredict} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">GPA (0.0 - 4.0)</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="4"
                            value={formData.gpa}
                            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Attendance %</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.attendance}
                            onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Missed Deadlines</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.missed_deadlines}
                            onChange={(e) => setFormData({ ...formData, missed_deadlines: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? 'Analyzing...' : (
                        <>
                            <Brain size={20} /> Predict Risk Level
                        </>
                    )}
                </button>
            </form>

            {result && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                    <div className={`p-6 rounded-xl border ${getRiskColor(result.risk_level)} flex items-center gap-6`}>
                        <div className="flex-shrink-0">
                            {getRiskIcon(result.risk_level)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-bold">{result.risk_level} Risk</h4>
                                <span className="text-3xl font-bold">{result.risk_score}%</span>
                            </div>
                            <p className="text-sm opacity-80">
                                Based on GPA: {result.factors.gpa},
                                Attendance: {result.factors.attendance}%,
                                Missed Deadlines: {result.factors.missed_deadlines}
                            </p>
                            <p className="text-xs mt-2 opacity-60">{result.model_type}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIPredictionDemo;
