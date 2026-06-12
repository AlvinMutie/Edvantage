import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    UserPlus,
    GraduationCap,
    Mail,
    Phone,
    ArrowUpRight,
    CheckSquare,
    Square,
    Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const RiskBadge = ({ risk }) => {
    const styles = {
        'At Risk': 'bg-red-500/10 text-red-500 border-red-500/20',
        'Medium': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        'Safe': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        'Low': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[risk] || styles['Safe']}`}>
            {risk || 'Safe'}
        </span>
    );
};

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentsRes, usersRes] = await Promise.all([
                api.get('/students/'),
                api.get('/users/') // Assuming this returns all users, we filter for supervisors
            ]);

            setStudents(studentsRes.data);

            // Filter users for supervisors
            const supervisorList = usersRes.data.filter(u => u.role === 'supervisor');
            setSupervisors(supervisorList);

            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch data', err);
            setLoading(false);
        }
    };

    const toggleSelectStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(sid => sid !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    const handleAssignSupervisor = async () => {
        if (!selectedSupervisor || selectedStudents.length === 0) return;

        try {
            // Process assignments in parallel
            await Promise.all(selectedStudents.map(studentId =>
                api.put(`/students/${studentId}/assign-supervisor`, {
                    supervisor_id: selectedSupervisor
                })
            ));

            // Refresh data
            await fetchData();
            setShowAssignModal(false);
            setSelectedStudents([]);
            setSelectedSupervisor('');
            alert('Supervisor assigned successfully!');
        } catch (err) {
            console.error('Failed to assign supervisor', err);
            alert('Failed to assign supervisor. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Students</h1>
                    <p className="text-slate-400 mt-1">Manage and monitor student records.</p>
                </div>
                <div className="flex gap-2">
                    {selectedStudents.length > 0 && (
                        <button
                            onClick={() => setShowAssignModal(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all font-medium text-sm animate-in fade-in"
                        >
                            <Users size={18} />
                            Assign Supervisor ({selectedStudents.length})
                        </button>
                    )}
                    <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition-all font-medium text-sm">
                        <UserPlus size={18} />
                        Add Student
                    </button>
                </div>
            </div>

            {/* Assignment Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Assign Supervisor</h3>
                        <p className="text-slate-400 mb-4 text-sm">Select a supervisor for the {selectedStudents.length} selected students.</p>

                        <select
                            value={selectedSupervisor}
                            onChange={(e) => setSelectedSupervisor(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white mb-6 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        >
                            <option value="">Select Supervisor...</option>
                            {supervisors.map(s => (
                                <option key={s.id} value={s.id}>{s.username} ({s.email})</option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignSupervisor}
                                disabled={!selectedSupervisor}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or student ID..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-800 transition-all text-sm">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 w-10">
                                <div className="flex items-center justify-center">
                                    <span className="sr-only">Select</span>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Supervisor</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">GPA</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Level</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">Loading student records...</td></tr>
                        ) : students.length === 0 ? (
                            <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">No students found.</td></tr>
                        ) : (
                            students.filter(s => s.full_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => {
                                const isSelected = selectedStudents.includes(student.id);
                                return (
                                    <tr key={student.id} className={`hover:bg-slate-800/30 transition-colors group ${isSelected ? 'bg-slate-800/40' : ''}`}>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleSelectStudent(student.id)}
                                                className={`text-slate-500 hover:text-primary-500 transition-colors ${isSelected ? 'text-primary-500' : ''}`}
                                            >
                                                {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                                                    <GraduationCap className="text-slate-400" size={20} />
                                                </div>
                                                <div>
                                                    <Link to={`/dashboard/students/${student.id}`} className="text-sm font-semibold text-white hover:text-primary-500 transition-colors">
                                                        {student.full_name}
                                                    </Link>
                                                    <p className="text-xs text-slate-500">{student.student_id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-xs text-slate-400">{student.department || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.supervisor ? (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                    <span className="text-sm text-slate-300">{student.supervisor.username}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-600 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-white">{student.gpa ? student.gpa.toFixed(2) : '0.00'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <RiskBadge risk={student.risk_status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/dashboard/students/${student.id}`} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                                                    <ArrowUpRight size={18} />
                                                </Link>
                                                <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentList;
