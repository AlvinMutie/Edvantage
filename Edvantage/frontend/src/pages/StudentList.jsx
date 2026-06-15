import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    UserPlus,
    GraduationCap,
    ArrowUpRight,
    CheckSquare,
    Square,
    Users,
    TrendingUp,
    Activity,
    Target,
    AlertCircle,
    MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

// UI Components
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import RiskBadge from '../components/ui/RiskBadge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';

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
                api.get('/users/')
            ]);

            setStudents(studentsRes.data);
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
            await Promise.all(selectedStudents.map(studentId =>
                api.put(`/students/${studentId}/assign-supervisor`, {
                    supervisor_id: selectedSupervisor
                })
            ));

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

    const atRiskCount = students.filter(s => s.risk_status === 'At Risk' || s.risk_status === 'High').length;
    const avgGPA = students.length ? students.reduce((acc, s) => acc + (s.gpa || 0), 0) / students.length : 0;
    const avgAttendance = students.length ? students.reduce((acc, s) => acc + (s.attendance || 0), 0) / students.length : 0;

    const filteredStudents = students.filter(s => 
        s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-12">
            <SectionHeader 
                title="Student Directory" 
                description="Comprehensive database of all enrolled students and their performance metrics."
            >
                <div className="flex gap-2">
                    {selectedStudents.length > 0 && (
                        <Button
                            onClick={() => setShowAssignModal(true)}
                            variant="solid"
                            size="sm"
                            className="gap-2 bg-indigo-600 hover:bg-indigo-500 animate-in slide-in-from-right-5"
                        >
                            <Users size={16} />
                            Assign ({selectedStudents.length})
                        </Button>
                    )}
                    <Button size="sm" className="gap-2">
                        <UserPlus size={16} />
                        Add New Student
                    </Button>
                </div>
            </SectionHeader>

            <StatGroup>
                <KPICard icon={Users} label="Total Students" value={students.length} />
                <KPICard icon={AlertCircle} label="At-Risk Students" value={atRiskCount} trend={atRiskCount > 0 ? 'up' : 'down'} trendValue={atRiskCount > 5 ? 'High' : 'Normal'} />
                <KPICard icon={Target} label="Average GPA" value={avgGPA.toFixed(2)} trend="up" trendValue="0.12" />
                <KPICard icon={Activity} label="Avg Attendance" value={`${avgAttendance.toFixed(1)}%`} />
            </StatGroup>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, ID or department..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all placeholder:text-slate-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter size={18} />
                    Advanced Filters
                </Button>
            </div>

            <Card className="overflow-hidden border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-5 w-10">
                                    <div className="flex items-center justify-center">
                                        <span className="sr-only">Select</span>
                                    </div>
                                </th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Student Profile</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Academic Context</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Mentorship</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Performance</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Risk Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="7" className="px-6 py-20 text-center text-slate-500 italic">Synchronizing student records...</td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users size={40} className="text-slate-700" />
                                        <p className="text-slate-500 font-medium">No students found matching your criteria.</p>
                                    </div>
                                </td></tr>
                            ) : (
                                filteredStudents.map((student) => {
                                    const isSelected = selectedStudents.includes(student.id);
                                    return (
                                        <tr key={student.id} className={`hover:bg-white/[0.03] transition-colors group ${isSelected ? 'bg-primary-500/5' : ''}`}>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleSelectStudent(student.id)}
                                                    className={`transition-all duration-200 ${isSelected ? 'text-primary-500 scale-110' : 'text-slate-700 hover:text-slate-500'}`}
                                                >
                                                    {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                                                        <GraduationCap className="text-slate-500" size={24} />
                                                    </div>
                                                    <div>
                                                        <Link to={`/dashboard/students/${student.id}`} className="text-sm font-black text-white hover:text-primary-400 transition-colors block">
                                                            {student.full_name}
                                                        </Link>
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">{student.student_id || student.admission_number}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-slate-300">{student.department || 'General'}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase">Year {Math.ceil(student.current_semester / 2)}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.supervisor ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-[10px] font-bold text-primary-400 border border-primary-500/30">
                                                            {student.supervisor.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-400">{student.supervisor.username}</span>
                                                    </div>
                                                ) : (
                                                    <Badge variant="neutral" className="text-[9px] opacity-40">Unassigned</Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-black text-white">{student.gpa?.toFixed(2) || '0.00'}</span>
                                                        <span className="text-[10px] text-slate-500">GPA</span>
                                                    </div>
                                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${student.gpa >= 3.0 ? 'bg-success-500' : student.gpa >= 2.0 ? 'bg-primary-500' : 'bg-risk-critical'}`} 
                                                            style={{ width: `${(student.gpa / 4.0) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <RiskBadge level={student.risk_status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link to={`/dashboard/students/${student.id}`}>
                                                        <Button variant="ghost" size="sm" className="p-2 h-auto text-slate-500 hover:text-white">
                                                            <ArrowUpRight size={18} />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="sm" className="p-2 h-auto text-slate-500 hover:text-white">
                                                        <MoreHorizontal size={18} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Assignment Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-[60] animate-in fade-in duration-300">
                    <Card className="w-full max-w-md p-8 shadow-2xl border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                <Users className="text-indigo-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight">Assign Supervisor</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">{selectedStudents.length} Students Selected</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Select Mentor</label>
                            <select
                                value={selectedSupervisor}
                                onChange={(e) => setSelectedSupervisor(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                            >
                                <option value="" className="bg-slate-900">Choose a supervisor...</option>
                                {supervisors.map(s => (
                                    <option key={s.id} value={s.id} className="bg-slate-900">
                                        {s.username} ({s.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => setShowAssignModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAssignSupervisor}
                                disabled={!selectedSupervisor}
                                className="px-8 shadow-lg shadow-primary-500/20"
                            >
                                Confirm Assignment
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default StudentList;

