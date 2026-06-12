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
    CheckCircle2
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <div className={`p-8 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-[32px] hover:bg-slate-800/60 transition-all duration-500 hover:-translate-y-2 group animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards`} style={{ animationDelay: `${delay}ms` }}>
        <div className="h-14 w-14 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-500/20 transition-colors border border-primary-500/20">
            <Icon size={28} className="text-primary-400 group-hover:text-primary-300 transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-slate-100 mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm font-medium">{description}</p>
    </div>
);

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans selection:bg-primary-500/30">
            
            {/* Background Orbs */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-purple-600/5 rounded-full blur-[80px]"></div>
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-500/20 blur-lg rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                            <img src={logo} alt="EdVantage Logo" className="h-10 w-10 object-contain relative z-10" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-white">EdVantage<span className="text-primary-500">.</span></span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#ai" className="hover:text-white transition-colors">AI Engine</a>
                        <a href="#institutions" className="hover:text-white transition-colors">Institutions</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-300 hover:text-white transition-colors px-4 py-2">Log In</Link>
                        <Link to="/login" className="px-6 py-2.5 bg-primary-600 text-white rounded-full font-bold text-sm hover:bg-primary-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-600/20 border border-primary-400/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-10 max-w-4xl mx-auto">
                        <h1 className="text-6xl lg:text-[100px] font-black tracking-tight leading-[0.9] text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Empower Success <br /> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400">Through Data Intelligence</span>
                        </h1>

                        <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 font-medium">
                            Predict student risk with <span className="text-white font-bold">91% accuracy</span> using our proprietary AI engine. Transform institutional data into meaningful interventions.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <Link to="/login" className="group relative px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10 flex items-center gap-3">
                                Start Monitoring Free
                                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#ai" className="px-10 py-5 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl text-white font-bold text-lg hover:bg-slate-800 transition-all">
                                See AI in Action
                            </a>
                        </div>
                    </div>

                    {/* Mock Dashboard Preview */}
                    <div className="mt-24 relative group animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                        <div className="absolute inset-0 bg-primary-600/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>
                        <div className="relative bg-slate-900 border border-slate-800 rounded-[40px] p-4 shadow-2xl overflow-hidden aspect-[16/9] lg:aspect-[21/9]">
                            <div className="bg-[#020617] rounded-[28px] border border-slate-800 w-full h-full overflow-hidden flex">
                                {/* Sidebar Mock */}
                                <div className="hidden lg:flex flex-col w-64 border-r border-slate-800 p-6 space-y-8">
                                    <div className="h-6 w-32 bg-slate-900 rounded-full animate-pulse"></div>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map(i => <div key={i} className={`h-10 w-full rounded-xl ${i === 1 ? 'bg-primary-900/20 border border-primary-500/20' : 'bg-slate-900/50'}`}></div>)}
                                    </div>
                                </div>
                                {/* Main Content Mock */}
                                <div className="flex-1 p-8 space-y-8 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <div className="h-8 w-48 bg-slate-900 rounded-full"></div>
                                        <div className="h-10 w-10 bg-slate-900 rounded-xl"></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-32 bg-slate-900/50 rounded-3xl border border-slate-800 p-4 space-y-3">
                                                <div className="h-3 w-1/2 bg-slate-800 rounded-full"></div>
                                                <div className="h-8 w-3/4 bg-slate-800 rounded-lg"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex-1 bg-slate-900/30 rounded-[32px] border border-slate-800 relative overflow-hidden p-6 h-64">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Zap size={16} className="text-amber-400" />
                                            <div className="h-4 w-40 bg-slate-800 rounded-full"></div>
                                        </div>
                                        <svg className="absolute bottom-0 left-0 w-full text-primary-500/10 h-3/4" preserveAspectRatio="none" viewBox="0 0 100 100">
                                            <path d="M0 80 Q 25 70, 50 40 T 100 20 L 100 100 L 0 100 Z" fill="currentColor" />
                                            <path d="M0 80 Q 25 70, 50 40 T 100 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary-500" />
                                        </svg>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                                            <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-500/50">
                                                <Target size={24} />
                                            </div>
                                            <div className="h-4 w-32 bg-primary-500/20 rounded-full border border-primary-500/50"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section id="institutions" className="py-20 border-y border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mb-12">Pioneering Education at Leading Institutions</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        {['TECH UNIVERSITY', 'GLOBAL ACADEMY', 'INSTITUTE OF AI', 'FUTURE EDU', 'STEM COLLEGE'].map((name) => (
                            <span key={name} className="text-2xl font-black tracking-tighter text-slate-400">{name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl space-y-4">
                            <h2 className="text-4xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                                Built for the <br /> 
                                <span className="text-primary-500 underline decoration-indigo-500/30 underline-offset-8">Modern Educator.</span>
                            </h2>
                            <p className="text-slate-400 text-lg font-medium">A unified platform to track, analyze, and intervene — all in real-time.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white font-bold flex items-center gap-2">
                                <Users size={20} className="text-primary-400" />
                                12.4k Active Students
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={TrendingUp}
                            title="Predictive Intelligence"
                            description="Leverage Random Forest algorithms to identify at-risk students with over 90% confidence based on academic and engagement trends."
                            delay={100}
                        />
                        <FeatureCard
                            icon={MessageSquare}
                            title="Seamless Communication"
                            description="Integrated messaging hub for instant student-supervisor collaboration. Built-in WebSockets for real-time status updates."
                            delay={200}
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Institutional Security"
                            description="Bank-grade encryption and role-based access control. Audit logs ensure every action is tracked and accountable."
                            delay={300}
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Live Dashboards"
                            description="Dynamic Recharts-powered visualizations providing immediate institutional health scores and performance distributions."
                            delay={400}
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Parental Portal"
                            description="Secure gateway for guardians to monitor progress and stay informed, creating a holistic support network for student success."
                            delay={500}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Gamified Success"
                            description="Reward student progress with digital badges and achievements. Positive reinforcement loops that drive academic excellence."
                            delay={600}
                        />
                    </div>
                </div>
            </section>

            {/* AI Engine Section */}
            <section id="ai" className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[48px] p-12 lg:p-24 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="100" cy="0" r="80" fill="white" fillOpacity="0.2" />
                            <circle cx="100" cy="0" r="60" fill="white" fillOpacity="0.2" />
                            <circle cx="100" cy="0" r="40" fill="white" fillOpacity="0.2" />
                        </svg>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 relative z-10">
                            <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
                                <Sparkles size={24} />
                            </div>
                            <h2 className="text-4xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                                The Engine Behind <br /> the Results.
                            </h2>
                            <p className="text-white/80 text-xl font-medium leading-relaxed">
                                Our AI isn't a black box. It combines classical statistical rigor with modern machine learning to provide actionable insights supervisors can trust.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    '91.7% Prediction Accuracy',
                                    'Multivariate Risk Factor Analysis',
                                    'Automated Intervention Triggers',
                                    'Real-time Model Retraining'
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-white font-bold">
                                        <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center border border-white/40">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="relative">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-[40px] p-8 space-y-8 shadow-2xl">
                                <div className="flex justify-between items-center text-white font-bold text-sm uppercase tracking-widest opacity-60">
                                    <span>AI Prediction Confidence</span>
                                    <span>94.2%</span>
                                </div>
                                <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/10 p-0.5">
                                    <div className="h-full bg-white rounded-full w-[94%]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-white/10 rounded-[32px] border border-white/10">
                                        <div className="text-3xl font-black text-white">88%</div>
                                        <div className="text-xs font-bold text-white/50 uppercase mt-1 tracking-wider">Precision</div>
                                    </div>
                                    <div className="p-6 bg-white/10 rounded-[32px] border border-white/10">
                                        <div className="text-3xl font-black text-white">93%</div>
                                        <div className="text-xs font-bold text-white/50 uppercase mt-1 tracking-wider">Recall</div>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-950/40 rounded-[32px] border border-white/5 flex items-center gap-4">
                                    <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                                        <Target size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-bold text-sm">Target Reached</div>
                                        <div className="text-white/50 text-xs mt-1">Intervention successful for ST1001</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Footer Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-12 bg-slate-900/20 border border-slate-800 rounded-[64px] py-24 px-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary-600/5 group-hover:bg-primary-600/10 transition-colors duration-700 pointer-events-none" />
                        <h2 className="text-4xl lg:text-7xl font-black tracking-tight text-white relative z-10">
                            Ready to Elevate Your <br /> <span className="text-primary-500">Academic Standard?</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                            <Link to="/login" className="px-12 py-6 bg-primary-600 text-white rounded-3xl font-black text-xl hover:bg-primary-500 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary-600/30">
                                Launch Free Dashboard
                            </Link>
                            <Link to="/register" className="px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
                                Join EdVantage
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-900 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
                        <div className="space-y-6 max-w-sm">
                            <div className="flex items-center gap-3">
                                <img src={logo} alt="EdVantage Logo" className="h-8 w-8 object-contain" />
                                <span className="font-black text-xl tracking-tighter text-white">EdVantage.</span>
                            </div>
                            <p className="text-slate-500 font-medium leading-relaxed italic">
                                "The premier AI-driven platform for student performance monitoring and early intervention."
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
                            <div className="space-y-6">
                                <h4 className="text-white font-black text-sm uppercase tracking-widest">Platform</h4>
                                <ul className="space-y-4 text-slate-500 text-sm font-bold">
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Analytics</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Risk Engine</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Messaging</a></li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-white font-black text-sm uppercase tracking-widest">Company</h4>
                                <ul className="space-y-4 text-slate-500 text-sm font-bold">
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">About Us</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Case Studies</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Security</a></li>
                                </ul>
                            </div>
                            <div className="space-y-6 col-span-2 sm:col-span-1">
                                <h4 className="text-white font-black text-sm uppercase tracking-widest">Support</h4>
                                <ul className="space-y-4 text-slate-500 text-sm font-bold">
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Help Center</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">API Docs</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">© 2026 EdVantage AI. All Rights Reserved.</p>
                        <div className="flex gap-8 text-slate-600 text-xs font-bold uppercase tracking-widest">
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-white transition-colors">GitHub</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
