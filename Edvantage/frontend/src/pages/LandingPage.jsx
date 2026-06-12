import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck,
    TrendingUp,
    MessageSquare,
    ArrowRight,
    CheckCircle2,
    Lock,
    Zap,
    LayoutDashboard,
    Users,
    Bell
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <div className={`p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-[28px] hover:bg-slate-800/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/10 group animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards`} style={{ animationDelay: `${delay}ms` }}>
        <div className="h-16 w-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-500/20 transition-colors">
            <Icon size={32} className="text-primary-400 group-hover:text-primary-300 transition-colors" />
        </div>
        <h3 className="text-2xl font-bold text-slate-100 mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-400 leading-relaxed font-medium">{description}</p>
    </div>
);

const LandingPage = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = [
        {
            id: 0,
            title: "Real-Time Overview",
            desc: "Monitor institutional health with live GPA and attendance analytics.",
            icon: LayoutDashboard,
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            id: 1,
            title: "Student Deep-Dive",
            desc: "Detailed profiles with history and risk prediction lines.",
            icon: Users,
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        },
        {
            id: 2,
            title: "Communication Hub",
            desc: "Direct, secure messaging to intervene immediately.",
            icon: MessageSquare,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans selection:bg-primary-500/30">

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <span className="font-bold text-2xl tracking-tighter text-white">EdVantage</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Sign In</Link>
                        <Link to="/login" className="px-6 py-2.5 bg-slate-100 text-slate-900 rounded-full font-bold text-sm hover:bg-white hover:scale-105 transition-all shadow-lg shadow-white/10">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-600/20 rounded-full blur-[120px] -z-10 opacity-50"></div>
                <div className="max-w-7xl mx-auto text-center space-y-8">

                    <h1 className="text-5xl lg:text-8xl font-black tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        EdVantage<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400">Your Institution's</span> <br />
                        <span className="text-4xl lg:text-6xl text-slate-300 font-bold">Competitive Advantage</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Maximize student success with the premier AI-driven intervention platform.
                        Secure, predictive, and designed for higher education leaders.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link to="/login" className="group relative px-8 py-4 bg-primary-600 rounded-full text-white font-bold text-lg overflow-hidden transition-all hover:scale-105 shadow-xl shadow-primary-600/30">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                            <span className="flex items-center gap-2">
                                Launch Dashboard <ArrowRight size={20} />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Carousel Section */}
            <div className="py-24 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Powerful Features, Simplified</h2>
                        <p className="text-slate-400">Everything you need to manage student risk in one place.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Carousel Controls */}
                        <div className="lg:col-span-4 space-y-4">
                            {slides.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    onClick={() => setActiveSlide(index)}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 bg-slate-900/50 backdrop-blur-sm ${activeSlide === index
                                        ? 'border-primary-500 ring-1 ring-primary-500/50 shadow-lg shadow-primary-500/10 scale-105'
                                        : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${slide.bg}`}>
                                            <slide.icon size={24} className={slide.color} />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg ${activeSlide === index ? 'text-white' : 'text-slate-400'}`}>{slide.title}</h3>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{slide.desc}</p>
                                        </div>
                                    </div>
                                    {activeSlide === index && (
                                        <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary-500 animate-[progress_5s_linear]"></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Slide Display (Mock UI) */}
                        <div className="lg:col-span-8">
                            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-2 shadow-2xl overflow-hidden relative aspect-[16/10] group">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-500/5 to-transparent pointer-events-none z-20"></div>

                                <div className="bg-slate-950 rounded-[24px] border border-slate-800 w-full h-full relative overflow-hidden transition-all duration-500">
                                    {/* Mock UI Header */}
                                    <div className="h-14 border-b border-slate-800 flex items-center px-6 justify-between bg-slate-900/50">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                            <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                                            <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                                        </div>
                                        <div className="h-2 w-32 bg-slate-800 rounded-full"></div>
                                    </div>

                                    {/* Content Changes based on Slide */}
                                    <div className="p-8 h-full">
                                        {activeSlide === 0 && (
                                            <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6">
                                                <div className="grid grid-cols-3 gap-4">
                                                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-900 rounded-2xl border border-slate-800"></div>)}
                                                </div>
                                                <div className="h-64 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden">
                                                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-500/20 to-transparent"></div>
                                                    <svg className="absolute bottom-0 w-full h-full text-primary-500/20" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                        <path d="M0 100 L0 80 L20 60 L40 70 L60 40 L80 50 L100 20 L100 100 Z" fill="currentColor" />
                                                        <path d="M0 80 L20 60 L40 70 L60 40 L80 50 L100 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary-500" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        {activeSlide === 1 && (
                                            <div className="animate-in fade-in zoom-in-95 duration-500 flex gap-6 h-full pb-12">
                                                <div className="w-1/3 bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
                                                    <div className="h-16 w-16 mx-auto rounded-full bg-slate-800 border border-slate-700"></div>
                                                    <div className="h-4 w-3/4 mx-auto bg-slate-800 rounded-full"></div>
                                                    <div className="h-2 w-1/2 mx-auto bg-slate-800 rounded-full"></div>
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <div className="h-32 bg-slate-900 rounded-2xl border border-slate-800"></div>
                                                    <div className="h-32 bg-slate-900 rounded-2xl border border-slate-800"></div>
                                                </div>
                                            </div>
                                        )}
                                        {activeSlide === 2 && (
                                            <div className="animate-in fade-in zoom-in-95 duration-500 flex gap-0 h-full pb-12 rounded-2xl border border-slate-800 overflow-hidden">
                                                <div className="w-1/3 bg-slate-900 border-r border-slate-800 p-4 space-y-2">
                                                    {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-slate-800 rounded-xl"></div>)}
                                                </div>
                                                <div className="flex-1 bg-slate-950 p-4 flex flex-col">
                                                    <div className="flex-1 space-y-3">
                                                        <div className="h-10 w-2/3 bg-slate-900 rounded-tr-xl rounded-br-xl rounded-bl-xl mr-auto"></div>
                                                        <div className="h-12 w-2/3 bg-primary-900/20 border border-primary-500/20 rounded-tl-xl rounded-bl-xl rounded-br-xl ml-auto"></div>
                                                    </div>
                                                    <div className="h-10 bg-slate-900 rounded-xl mt-4"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="bg-slate-950 py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={TrendingUp}
                            title="Predictive Analytics"
                            description="Our evaluation engine processes real-time GPA and attendance data to flag at-risk students before they fall behind."
                            delay={100}
                        />
                        <FeatureCard
                            icon={MessageSquare}
                            title="Direct Intervention"
                            description="Streamline communication between supervisors and students with our integrated secure messaging hub."
                            delay={200}
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Enterprise Security"
                            description="Role-based access control (RBAC) ensures sensitive student data is only accessible to authorized personnel."
                            delay={300}
                        />
                    </div>
                </div>
            </div>

            {/* Stats/Social Proof */}
            <div className="py-24 border-y border-slate-800/50 bg-slate-900/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: 'Students Tracked', value: '10,000+' },
                            { label: 'Interventions Logged', value: '850+' },
                            { label: 'Retention Rate', value: '94%' },
                            { label: 'Universities', value: '12' },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <h4 className="text-4xl lg:text-5xl font-black text-white">{stat.value}</h4>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm">© 2024 EdVantage. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">Terms of Service</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
