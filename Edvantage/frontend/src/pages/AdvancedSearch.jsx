import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    Search, 
    Filter, 
    Save, 
    X, 
    ChevronDown, 
    GraduationCap, 
    ArrowUpRight, 
    Database,
    Zap,
    TrendingUp,
    Users,
    Activity,
    Target
} from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import RiskBadge from '../components/ui/RiskBadge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import StatGroup from '../components/ui/StatGroup';

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
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            const res = await api.post('/search/students', filters);
            setResults(res.data.students);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
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
        } catch (error) {
            alert('Failed to save filter');
        }
    };

    const loadFilter = (criteria) => {
        setFilters(criteria);
        // Automatically trigger search when loading a saved filter
        setTimeout(handleSearch, 100);
    };

    const handleBulkAction = async (action) => {
        if (selectedStudents.length === 0) return;

        try {
            await api.post('/search/bulk-action', {
                student_ids: selectedStudents,
                action: action,
                new_status: action === 'update_risk' ? 'Safe' : undefined
            });
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

    const clearFilters = () => {
        setFilters({
            name: '',
            gpa_min: '',
            gpa_max: '',
            attendance_min: '',
            attendance_max: '',
            department: '',
            semester: '',
            risk_status: ''
        });
        setResults([]);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-12">
            <SectionHeader 
                title="Intelligence Search" 
                description="Engineered for high-precision student data extraction and bulk processing."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2">
                        <X size={16} />
                        Reset
                    </Button>
                    <Button size="sm" className="gap-2" onClick={() => setShowSaveModal(true)}>
                        <Save size={16} />
                        Save Parameters
                    </Button>
                </div>
            </SectionHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Search Configuration */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-6">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Search Parameters</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Student Identity</label>
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={14} />
                                    <input
                                        type="text"
                                        value={filters.name}
                                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all"
                                        placeholder="Name or ID..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Min GPA</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={filters.gpa_min}
                                        onChange={(e) => setFilters({ ...filters, gpa_min: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all"
                                        placeholder="0.0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Max GPA</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={filters.gpa_max}
                                        onChange={(e) => setFilters({ ...filters, gpa_max: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all"
                                        placeholder="4.0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Department</label>
                                <select
                                    value={filters.department}
                                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all"
                                >
                                    <option value="" className="bg-slate-900">All Departments</option>
                                    <option value="Computer Science" className="bg-slate-900">Computer Science</option>
                                    <option value="Engineering" className="bg-slate-900">Engineering</option>
                                    <option value="Business" className="bg-slate-900">Business</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Risk Status</label>
                                <select
                                    value={filters.risk_status}
                                    onChange={(e) => setFilters({ ...filters, risk_status: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all"
                                >
                                    <option value="" className="bg-slate-900">Any Risk Level</option>
                                    <option value="Safe" className="bg-slate-900">Safe</option>
                                    <option value="Medium" className="bg-slate-900">Medium</option>
                                    <option value="At Risk" className="bg-slate-900">At Risk</option>
                                </select>
                            </div>

                            <Button 
                                onClick={handleSearch} 
                                className="w-full py-4 mt-4 shadow-lg shadow-primary-500/20"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Execute Search'}
                            </Button>
                        </div>
                    </Card>

                    {savedFilters.length > 0 && (
                        <Card className="p-6 bg-white/5">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Saved Profiles</h3>
                            <div className="space-y-2">
                                {savedFilters.map(filter => (
                                    <button
                                        key={filter.id}
                                        onClick={() => loadFilter(filter.criteria)}
                                        className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                                    >
                                        {filter.name}
                                        <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Results Section */}
                <div className="lg:col-span-8 space-y-6">
                    {results.length > 0 ? (
                        <>
                            <StatGroup className="mb-0">
                                <KPICard label="Matches" value={results.length} icon={Database} />
                                <KPICard label="Selected" value={selectedStudents.length} icon={Users} />
                                <KPICard 
                                    label="Avg. GPA" 
                                    value={(results.reduce((acc, s) => acc + (s.gpa || 0), 0) / results.length).toFixed(2)} 
                                    icon={Target}
                                />
                            </StatGroup>

                            <Card className="p-8">
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Extraction Results</h3>
                                    {selectedStudents.length > 0 && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleBulkAction('update_risk')}
                                                variant="outline"
                                                size="sm"
                                                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                            >
                                                Batch: Set Safe
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                            >
                                                Batch: Alert
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {results.map(student => (
                                        <div 
                                            key={student.id} 
                                            className={`flex items-center gap-6 p-4 rounded-2xl border transition-all group ${
                                                selectedStudents.includes(student.id) 
                                                ? 'bg-primary-500/10 border-primary-500/30' 
                                                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student.id)}
                                                onChange={() => toggleSelect(student.id)}
                                                className="w-5 h-5 rounded-lg bg-slate-800 border-white/10 text-primary-500 focus:ring-primary-500 cursor-pointer"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-black text-white truncate">{student.full_name}</h4>
                                                    <Badge variant="neutral" className="text-[8px] py-0">{student.department}</Badge>
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                    <span>ID: {student.student_id}</span>
                                                    <span className="flex items-center gap-1"><TrendingUp size={10} /> GPA {student.gpa}</span>
                                                    <span className="flex items-center gap-1"><Activity size={10} /> {student.attendance}% Att.</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <RiskBadge level={student.risk_status} className="hidden sm:flex" />
                                                <Link to={`/dashboard/students/${student.id}`}>
                                                    <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                        <ArrowUpRight size={18} />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center py-20">
                            <Card className="max-w-md p-12 text-center border-dashed border-2">
                                <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Database size={40} className="text-slate-700" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Engine Idle</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">Configure the filters on the left and execute the search to extract student intelligence.</p>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Filter Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in">
                    <Card className="w-full max-w-sm p-8 shadow-2xl border-white/10 animate-in zoom-in-95">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500">
                                <Save size={24} />
                            </div>
                            <h3 className="text-xl font-black text-white tracking-tight uppercase">Save Search</h3>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Profile Name</label>
                            <input
                                type="text"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none transition-all"
                                placeholder="e.g. High Risk Year 2"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                className="flex-1"
                                onClick={() => setShowSaveModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveFilter}
                                className="flex-1 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500"
                                disabled={!filterName}
                            >
                                Save Data
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdvancedSearch;

