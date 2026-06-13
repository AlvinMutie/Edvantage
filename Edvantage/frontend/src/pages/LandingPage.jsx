import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
    TrendingUp,
    MessageSquare,
    ArrowRight,
    Lock,
    LayoutDashboard,
    Users,
    Zap,
    Target,
    Shield,
    BarChart3,
    Sparkles,
    CheckCircle2,
    Globe,
    MousePointer2,
    Calendar,
    ChevronRight
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <div 
        className="p-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2.5rem] hover:bg-white/[0.05] transition-all duration-700 hover:-translate-y-3 group animate-in fade-in slide-in-from-bottom-12 fill-mode-backwards" 
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="h-16 w-16 bg-gradient-to-br from-primary-500/20 to-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-primary-500/20">
            <Icon size={32} className="text-primary-400 group-hover:text-primary-300 transition-colors" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-base font-medium">{description}</p>
    </div>
);

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('prediction');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const institutions = [
        { name: 'Stanford EDU', logo: 'S' },
        { name: 'MIT Tech', logo: 'M' },
        { name: 'Oxford Academy', logo: 'O' },
        { name: 'Harvard Inst', logo: 'H' },
        { name: 'Berkeley Lab', logo: 'B' }
    ];

    return (
        <div className="min-h-screen bg-[#050811] text-slate-50 overflow-hidden font-sans selection:bg-primary-500/30">
            
            {/* Ambient Background Elements */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-600/10 rounded-full blur-[160px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse delay-1000"></div>
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* Premium Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/60 backdrop-blur-2xl border-b border-white/5 py-3' : 'bg-transparent py-8'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-500/40 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                            <img src={logo} alt="EdVantage Logo" className="h-10 w-10 object-contain relative z-10" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-2xl tracking-tighter text-white leading-none">EdVantage<span className="text-primary-500">.</span></span>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-primary-400/60 uppercase">AI Intelligence</span>
                        </div>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-400 tracking-wide">
                        <a href="#features" className="hover:text-white transition-all relative group">
                            Features
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                        </a>
                        <a href="#how-it-works" className="hover:text-white transition-all relative group">
                            Process
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                        </a>
                        <a href="#ai" className="hover:text-white transition-all relative group">
                            AI Engine
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                        </a>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-300 hover:text-white transition-colors">Log In</Link>
                        <Link to="/login" className="relative group px-8 py-3 bg-white text-slate-950 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section: The "Modern & Professional" Statement */}
            <section className="relative pt-48 pb-20 lg:pt-64 lg:pb-40 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-12 max-w-5xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-300">New: Version 2.0 Risk Analytics</span>
                        </div>

                        <h1 className="text-7xl lg:text-[110px] font-black tracking-tight leading-[0.85] text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                            Elevate Student <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-300 to-purple-400">Success with AI.</span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 font-medium">
                            The intelligent command center for modern institutions. <br className="hidden md:block" />
                            Detect academic risk before it happens with <span className="text-white font-bold border-b-2 border-primary-500/30">91.7% predictive accuracy.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                            <Link to="/login" className="group relative px-12 py-6 bg-primary-600 text-white rounded-2xl font-black text-xl overflow-hidden transition-all hover:scale-105 hover:bg-primary-500 active:scale-95 shadow-[0_20px_40px_rgba(37,99,235,0.25)] flex items-center gap-4">
                                Launch Dashboard
                                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                            </Link>
                            <a href="#ai" className="px-12 py-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white font-bold text-xl hover:bg-white/10 transition-all">
                                How it Works
                            </a>
                        </div>
                    </div>

                    {/* High-Fidelity Mockup Container */}
                    <div className="mt-32 relative group animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-700">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="relative bg-slate-950 border border-white/10 rounded-[3rem] p-4 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="bg-[#020617] rounded-[2.2rem] border border-white/5 w-full aspect-[16/10] lg:aspect-[21/9] overflow-hidden flex shadow-inner">
                                {/* Sidebar Mock */}
                                <div className="hidden lg:flex flex-col w-72 border-r border-white/5 p-8 space-y-10 bg-black/20">
                                    <div className="h-4 w-32 bg-white/5 rounded-full"></div>
                                    <div className="space-y-6">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className={`flex items-center gap-4 h-12 w-full rounded-2xl ${i === 1 ? 'bg-primary-600/10 border border-primary-500/20' : 'bg-white/5'}`}>
                                                <div className="h-5 w-5 ml-4 bg-white/10 rounded-md"></div>
                                                <div className={`h-2 w-20 rounded-full ${i === 1 ? 'bg-primary-400' : 'bg-white/10'}`}></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto pt-10">
                                        <div className="p-6 bg-gradient-to-br from-primary-600/20 to-indigo-600/20 rounded-3xl border border-white/10">
                                            <div className="h-2 w-full bg-white/10 rounded-full mb-3"></div>
                                            <div className="h-2 w-2/3 bg-white/10 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Content Area Mock */}
                                <div className="flex-1 p-10 space-y-10 bg-gradient-to-br from-transparent to-primary-900/5">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-2">
                                            <div className="h-8 w-64 bg-white/10 rounded-xl"></div>
                                            <div className="h-3 w-40 bg-white/5 rounded-full"></div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 bg-white/5 rounded-2xl border border-white/10"></div>
                                            <div className="h-12 w-32 bg-white/5 rounded-2xl border border-white/10"></div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {[
                                            { label: 'Risk Students', val: '12', color: 'bg-rose-500' },
                                            { label: 'Total Enrollment', val: '1,420', color: 'bg-primary-500' },
                                            { label: 'Avg Attendance', val: '94.2%', color: 'bg-emerald-500' }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-8 bg-white/[0.03] rounded-[2rem] border border-white/5 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div className={`h-2 w-2 rounded-full ${stat.color} shadow-[0_0_10px_currentColor]`}></div>
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.label}</span>
                                                </div>
                                                <div className="text-4xl font-black text-white">{stat.val}</div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className={`h-full ${stat.color} w-3/4 opacity-50`}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex-1 bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden h-72">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Sparkles size={20} className="text-amber-400" />
                                            <div className="h-3 w-48 bg-white/10 rounded-full"></div>
                                        </div>
                                        <div className="flex items-end gap-4 h-32">
                                            {[40, 70, 45, 90, 65, 80, 55, 95, 75].map((h, i) => (
                                                <div key={i} className="flex-1 bg-gradient-to-t from-primary-600/40 to-primary-400/10 rounded-t-lg border-x border-t border-primary-500/20" style={{ height: `${h}%` }}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By: Institutional Social Proof */}
            <section className="py-24 border-y border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-slate-500 text-xs font-black uppercase tracking-[0.3em] mb-16 opacity-80">Empowering Intelligence at Global Institutions</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000 cursor-default">
                        {institutions.map((inst) => (
                            <div key={inst.name} className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-white group-hover:bg-primary-600/20 group-hover:border-primary-500/40 transition-all">{inst.logo}</div>
                                <span className="text-2xl font-bold tracking-tight text-white group-hover:text-primary-400 transition-colors">{inst.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section id="features" className="py-40 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
                        <div className="max-w-2xl space-y-6">
                            <div className="h-1 w-20 bg-primary-500 rounded-full"></div>
                            <h2 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
                                Engineered for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400 italic">Academic Excellence.</span>
                            </h2>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed">Everything you need to manage student retention and performance in one unified, high-performance interface.</p>
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-white/[0.03] rounded-3xl border border-white/10">
                            <div className="h-12 w-12 rounded-2xl bg-primary-600/20 flex items-center justify-center">
                                <Users className="text-primary-400" size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-white">12,400+</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monitored Students</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={TrendingUp}
                            title="Predictive Risk Modeling"
                            description="Identify at-risk students weeks before academic failure occurs using multivariate regression and Random Forest intelligence."
                            delay={100}
                        />
                        <FeatureCard
                            icon={MessageSquare}
                            title="Real-time Collaboration"
                            description="Instant secure messaging between students and supervisors with integrated status tracking and notification systems."
                            delay={200}
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Enterprise Security"
                            description="Role-based access control (RBAC), bank-grade encryption, and comprehensive audit trails for institutional compliance."
                            delay={300}
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Dynamic Analytics"
                            description="Real-time data visualization of institutional health, performance distributions, and intervention success rates."
                            delay={400}
                        />
                        <FeatureCard
                            icon={Target}
                            title="Automated Interventions"
                            description="Configure smart triggers that notify supervisors or parents immediately when critical performance thresholds are breached."
                            delay={500}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Engagement Engine"
                            description="Drive student motivation through gamified achievement systems, digital badges, and positive reinforcement loops."
                            delay={600}
                        />
                    </div>
                </div>
            </section>

            {/* The AI Engine Focus */}
            <section id="ai" className="py-40 px-6 relative">
                <div className="max-w-7xl mx-auto bg-gradient-to-br from-primary-700 to-indigo-900 rounded-[4rem] p-12 lg:p-24 overflow-hidden relative border border-white/10">
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 relative z-10">
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black text-xs uppercase tracking-widest">
                                <Sparkles size={16} className="text-amber-400" />
                                Proprietary AI Engine
                            </div>
                            <h2 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
                                Precision <br /> Beyond Data.
                            </h2>
                            <p className="text-white/80 text-xl font-medium leading-relaxed">
                                Our engine doesn't just calculate averages; it understands patterns. By analyzing 50+ unique variables, we provide a holistic view of every student's journey.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    '91.7% Accuracy',
                                    'Real-time Updates',
                                    'Factor Weighting',
                                    'Bias Mitigation'
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-4 text-white font-bold bg-white/10 p-4 rounded-2xl border border-white/10">
                                        <CheckCircle2 size={20} className="text-primary-300" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="bg-black/40 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-10 space-y-10 shadow-2xl relative z-10">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Live Inference Confidence</div>
                                        <div className="text-6xl font-black text-white tracking-tighter">94.8%</div>
                                    </div>
                                    <div className="h-16 w-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/40">
                                        <Zap size={32} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                                        <span>Training Progress</span>
                                        <span>Optimal State</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                        <div className="h-full bg-gradient-to-r from-primary-500 to-indigo-400 rounded-full w-[94.8%]" />
                                    </div>
                                </div>
                                <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 flex items-center gap-6">
                                    <div className="h-14 w-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                        <Target size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-bold text-lg leading-tight">Intervention Recommended</div>
                                        <div className="text-white/40 text-sm mt-1">Student #4928 showing drop in engagement</div>
                                    </div>
                                    <ChevronRight className="text-white/20" />
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px]"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="how-it-works" className="py-40 px-6 bg-black/10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-6 mb-24">
                        <h2 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight">
                            Streamlined for <br /> <span className="text-primary-500 italic underline underline-offset-8 decoration-primary-500/30">Action.</span>
                        </h2>
                        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Three simple steps to institutional transformation.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent hidden lg:block -z-10"></div>
                        
                        {[
                            { step: '01', title: 'Data Integration', desc: 'Securely sync your student records and academic data with our encrypted API.', icon: Globe },
                            { step: '02', title: 'AI Analysis', desc: 'Our engine processes factors from attendance to grade velocity to identify risk.', icon: Sparkles },
                            { step: '03', title: 'Intervention', desc: 'Supervisors receive actionable tasks to support students before crises occur.', icon: Target }
                        ].map((item, i) => (
                            <div key={i} className="relative group text-center lg:text-left space-y-8">
                                <div className="flex items-center justify-center lg:justify-start gap-6">
                                    <div className="text-6xl font-black text-white/5 group-hover:text-primary-500/20 transition-colors duration-700 italic">{item.step}</div>
                                    <div className="h-20 w-20 bg-white/[0.03] border border-white/10 rounded-[2rem] flex items-center justify-center text-primary-400 group-hover:bg-primary-600/10 group-hover:scale-110 transition-all duration-500">
                                        <item.icon size={36} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold text-white tracking-tight">{item.title}</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Conversion Section */}
            <section className="py-40 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="relative group p-1 lg:p-2 bg-gradient-to-br from-primary-500/30 via-indigo-500/30 to-purple-500/30 rounded-[5rem] overflow-hidden">
                        <div className="relative bg-slate-950 rounded-[4.5rem] py-32 px-12 text-center space-y-12 overflow-hidden">
                            <div className="absolute inset-0 bg-primary-600/[0.03] pointer-events-none" />
                            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] group-hover:bg-primary-600/20 transition-colors duration-1000" />
                            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] group-hover:bg-indigo-600/20 transition-colors duration-1000" />
                            
                            <h2 className="text-6xl lg:text-8xl font-black tracking-tight text-white relative z-10 leading-[0.9]">
                                Secure the Future <br /> of Your <span className="text-primary-500">Students.</span>
                            </h2>
                            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto relative z-10">
                                Join 50+ institutions already using EdVantage to drive academic success and institutional growth.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10">
                                <Link to="/login" className="px-14 py-7 bg-primary-600 text-white rounded-[2rem] font-black text-2xl hover:bg-primary-500 transition-all hover:scale-105 active:scale-95 shadow-[0_30px_60px_rgba(37,99,235,0.3)]">
                                    Get Started for Free
                                </Link>
                                <Link to="/register" className="px-14 py-7 bg-white text-slate-950 rounded-[2rem] font-black text-2xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
                                    Request Demo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-32 border-t border-white/5 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
                        <div className="lg:col-span-5 space-y-10">
                            <div className="flex items-center gap-4">
                                <img src={logo} alt="EdVantage Logo" className="h-10 w-10 object-contain" />
                                <span className="font-black text-2xl tracking-tighter text-white">EdVantage<span className="text-primary-500">.</span></span>
                            </div>
                            <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-md italic">
                                "Pioneering the next generation of academic monitoring through artificial intelligence and proactive intervention."
                            </p>
                            <div className="flex gap-6">
                                {[Globe, MessageSquare, Zap].map((Icon, i) => (
                                    <div key={i} className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                                        <Icon size={20} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-16">
                            <div className="space-y-8">
                                <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Platform</h4>
                                <ul className="space-y-6 text-slate-500 text-sm font-bold">
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Risk Analytics</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Interventions</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Messaging</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Gamification</a></li>
                                </ul>
                            </div>
                            <div className="space-y-8">
                                <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Institutional</h4>
                                <ul className="space-y-6 text-slate-500 text-sm font-bold">
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Enterprise</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Security</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Case Studies</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Compliance</a></li>
                                </ul>
                            </div>
                            <div className="space-y-8 col-span-2 sm:col-span-1">
                                <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Resources</h4>
                                <ul className="space-y-6 text-slate-500 text-sm font-bold">
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Documentation</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">API Reference</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Community</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Status</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 EdVantage AI. Intelligence for Education.</p>
                        <div className="flex gap-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
