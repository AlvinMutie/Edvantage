import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, AlertTriangle } from 'lucide-react';

const Analytics = () => {
    const [cohorts, setCohorts] = useState([]);
    const [predictions, setPredictions] = useState({ current: {}, predictions: [] });
    const [heatmap, setHeatmap] = useState({ heatmap: {}, departments: [], semesters: [] });
    const [overviewStats, setOverviewStats] = useState(null);
    const [groupBy, setGroupBy] = useState('department');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalyticsData();
    }, [groupBy]);

    const fetchAnalyticsData = async () => {
        try {
            const [cohortRes, predictionRes, heatmapRes, statsRes] = await Promise.all([
                api.get(`/analytics/cohort-analysis?group_by=${groupBy}`),
                api.get('/analytics/trend-prediction'),
                api.get('/analytics/risk-heatmap'),
                api.get('/analytics/overview-stats')
            ]);

            setCohorts(cohortRes.data.cohorts);
            setPredictions(predictionRes.data);
            setHeatmap(heatmapRes.data);
            setOverviewStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-white text-center py-12">Loading analytics...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Advanced Analytics</h1>
                <p className="text-slate-400 mt-2">Deep insights into student performance patterns</p>
            </div>

            {/* Overview Stats */}
            {overviewStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        icon={Users}
                        label="Total Students"
                        value={overviewStats.total_students}
                        color="bg-indigo-600"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="At Risk"
                        value={`${overviewStats.at_risk_students} (${overviewStats.at_risk_percentage}%)`}
                        color="bg-red-600"
                    />
                    <StatCard
                        icon={Target}
                        label="Average GPA"
                        value={overviewStats.avg_gpa.toFixed(2)}
                        color="bg-emerald-600"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Avg Attendance"
                        value={`${overviewStats.avg_attendance.toFixed(1)}%`}
                        color="bg-blue-600"
                    />
                </div>
            )}

            {/* Cohort Analysis */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Cohort Analysis</h2>
                    <select
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                        className="bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700"
                    >
                        <option value="department">By Department</option>
                        <option value="semester">By Semester</option>
                    </select>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cohorts}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Bar dataKey="avg_gpa" fill="#10b981" name="Avg GPA" />
                        <Bar dataKey="avg_attendance" fill="#3b82f6" name="Avg Attendance" />
                        <Bar dataKey="at_risk_percentage" fill="#ef4444" name="At Risk %" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Trend Predictions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Trend Predictions (6 Months)</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={predictions.predictions}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="period" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="predicted_gpa" stroke="#10b981" strokeWidth={2} name="Predicted GPA" />
                        <Line type="monotone" dataKey="predicted_attendance" stroke="#3b82f6" strokeWidth={2} name="Predicted Attendance" />
                    </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 p-4 bg-slate-800 rounded-xl">
                    <p className="text-sm text-slate-400">
                        <strong className="text-white">Current Baseline:</strong> GPA {predictions.current.avg_gpa}, Attendance {predictions.current.avg_attendance}%
                        ({predictions.current.total_students} students)
                    </p>
                </div>
            </div>

            {/* Risk Heatmap */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Risk Distribution Heatmap</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className="text-left text-slate-400 p-2">Department</th>
                                {heatmap.semesters.map(sem => (
                                    <th key={sem} className="text-center text-slate-400 p-2">Sem {sem}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {heatmap.departments.map(dept => (
                                <tr key={dept}>
                                    <td className="font-bold text-white p-2">{dept}</td>
                                    {heatmap.semesters.map(sem => {
                                        const cell = heatmap.heatmap[dept]?.[sem];
                                        const intensity = cell?.intensity || 0;
                                        const bgColor =
                                            intensity > 75 ? 'bg-red-900' :
                                                intensity > 50 ? 'bg-amber-900' :
                                                    intensity > 25 ? 'bg-yellow-900' :
                                                        'bg-emerald-900';

                                        return (
                                            <td key={sem} className="p-2">
                                                {cell ? (
                                                    <div className={`${bgColor} rounded-lg p-2 text-center`}>
                                                        <div className="text-white font-bold">{cell.risk_percentage}%</div>
                                                        <div className="text-xs opacity-70">{cell.at_risk}/{cell.total}</div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-slate-800 rounded-lg p-2 text-center text-slate-600">-</div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className={`p-3 rounded-xl ${color} inline-flex mb-4`}>
            <Icon className="text-white" size={24} />
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-slate-400">{label}</div>
    </div>
);

export default Analytics;
