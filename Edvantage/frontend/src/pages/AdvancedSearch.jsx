import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Filter, Save, X, ChevronDown } from 'lucide-react';

const AdvancedSearch = () => {
    const [filters, setFilters] = useState({
        name: '',
        gpa_min: '',
        gpa_max: '',
        attendance_min: '',
        attendance_max: '',
        department: '',
        semester: '',
        risk_status: ''
    });
    const [results, setResults] = useState([]);
    const [savedFilters, setSavedFilters] = useState([]);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        loadSavedFilters();
    }, []);

    const loadSavedFilters = async () => {
        try {
            const res = await api.get('/search/filters/mine');
            setSavedFilters(res.data.filters);
        } catch (error) {
            console.error('Error loading saved filters:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const res = await api.post('/search/students', filters);
            setResults(res.data.students);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleSaveFilter = async () => {
        try {
            await api.post('/search/filters/save', {
                name: filterName,
                criteria: filters
            });
            setShowSaveModal(false);
            setFilterName('');
            loadSavedFilters();
            alert('Filter saved successfully!');
        } catch (error) {
            alert('Failed to save filter');
        }
    };

    const loadFilter = (criteria) => {
        setFilters(criteria);
    };

    const handleBulkAction = async (action) => {
        if (selectedStudents.length === 0) {
            alert('Please select students first');
            return;
        }

        try {
            await api.post('/search/bulk-action', {
                student_ids: selectedStudents,
                action: action,
                new_status: action === 'update_risk' ? 'Safe' : undefined
            });
            alert(`Bulk action completed on ${selectedStudents.length} students`);
            setSelectedStudents([]);
            handleSearch();
        } catch (error) {
            alert('Bulk action failed');
        }
    };

    const toggleSelect = (id) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Advanced Search</h1>
                <p className="text-slate-400 mt-2">Find students with custom filters</p>
            </div>

            {/* Saved Filters */}
            {savedFilters.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <h3 className="text-sm font-bold text-slate-400 mb-2">Saved Filters</h3>
                    <div className="flex gap-2 flex-wrap">
                        {savedFilters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => loadFilter(filter.criteria)}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
                            >
                                {filter.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Student Name</label>
                        <input
                            type="text"
                            value={filters.name}
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700"
                            placeholder="Search by name..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Department</label>
                        <select
                            value={filters.department}
                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700"
                        >
                            <option value="">All Departments</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Risk Status</label>
                        <select
                            value={filters.risk_status}
                            onChange={(e) => setFilters({ ...filters, risk_status: e.target.value })}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700"
                        >
                            <option value="">All Statuses</option>
                            <option value="Safe">Safe</option>
                            <option value="At Risk">At Risk</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Min GPA</label>
                        <input
                            type="number"
                            step="0.1"
                            value={filters.gpa_min}
                            onChange={(e) => setFilters({ ...filters, gpa_min: e.target.value })}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700"
                            placeholder="0.0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Max GPA</label>
                        <input
                            type="number"
                            step="0.1"
                            value={filters.gpa_max}
                            onChange={(e) => setFilters({ ...filters, gpa_max: e.target.value })}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700"
                            placeholder="4.0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Min Attendance %</label>
                        <input
                            type="number"
                            value={filters.attendance_min}
                            onChange={(e) => setFilters({ ...filters, attendance_min: e.target.value })}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleSearch}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                        <Search size={20} />
                        Search
                    </button>
                    <button
                        onClick={() => setShowSaveModal(true)}
                        className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center gap-2"
                    >
                        <Save size={20} />
                        Save Filter
                    </button>
                </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Results ({results.length})</h3>
                        {selectedStudents.length > 0 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBulkAction('update_risk')}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm"
                                >
                                    Mark as Safe ({selectedStudents.length})
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        {results.map(student => (
                            <div key={student.id} className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl">
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => toggleSelect(student.id)}
                                    className="w-5 h-5"
                                />
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{student.full_name}</h4>
                                    <p className="text-sm text-slate-400">
                                        {student.student_id} • {student.department} • GPA: {student.gpa} • Attendance: {student.attendance}%
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.risk_status === 'At Risk' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                    {student.risk_status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Save Filter Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-96">
                        <h3 className="text-xl font-bold text-white mb-4">Save Filter</h3>
                        <input
                            type="text"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700 mb-4"
                            placeholder="Filter name..."
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveFilter}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-xl"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedSearch;
