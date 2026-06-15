import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Users,
  School,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Brain,
  MessageSquare,
  Clock,
  Target,
  ChevronRight,
  LayoutDashboard,
  AlertCircle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import logo from '../assets/logo.png';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import RiskBadge from '../components/ui/RiskBadge';

const data = [
  { name: 'Mon', risk: 45 },
  { name: 'Tue', risk: 52 },
  { name: 'Wed', risk: 48 },
  { name: 'Thu', risk: 61 },
  { name: 'Fri', risk: 55 },
  { name: 'Sat', risk: 67 },
  { name: 'Sun', risk: 62 },
];

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 overflow-hidden selection:bg-primary-500/30">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="EdVantage" className="h-10 w-10" />
            <span className="text-2xl font-black tracking-tighter">EdVantage<span className="text-primary-500">.</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#ai-intelligence" className="hover:text-white transition-colors">AI Intelligence</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Log In</Button>
            </Link>
            <Link to="/login">
              <Button variant="solid" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 lg:pt-64 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-slide-up">
            <Badge variant="info" className="mb-4">v2.0 Now Live</Badge>
            <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-[0.9]">
              Predict Student Risk <br />
              <span className="text-gradient">Before It Becomes Failure.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
              EdVantage uses Artificial Intelligence, Predictive Analytics, and Early Intervention Workflows to help institutions improve student success, retention, and academic performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="solid" size="lg" className="gap-2">
                Request Demo <ArrowRight size={20} />
              </Button>
              <Button variant="outline" size="lg">
                Watch Overview
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-in delay-300">
            <Card className="p-4 bg-slate-900/40 border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <Badge variant="info">Intelligence Hub</Badge>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Risk Index</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-white">84.2</span>
                      <TrendingUp size={16} className="text-risk-critical" />
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Active Interventions</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-white">12</span>
                      <Users size={16} className="text-primary-400" />
                    </div>
                  </div>
                </div>

                <div className="h-48 w-full bg-white/5 rounded-2xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="risk" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
            
            {/* Floating elements for "Enterprise" look */}
            <div className="absolute -top-6 -right-6 p-4 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl animate-bounce duration-[3000ms]">
              <div className="flex items-center gap-3">
                <Brain size={20} className="text-primary-400" />
                <span className="text-sm font-bold">AI Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 border-y border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Students Monitored', value: '50,000+', icon: Users },
              { label: 'Institutions', value: '120+', icon: School },
              { label: 'Intervention Success', value: '94%', icon: Target },
              { label: 'Retention Boost', value: '22%', icon: TrendingUp },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <stat.icon size={24} className="text-primary-400" />
                  </div>
                </div>
                <h3 className="text-4xl font-black text-white">{stat.value}</h3>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <Badge variant="info" className="mb-6">Methodology</Badge>
          <h2 className="text-5xl font-black tracking-tight mb-6">How It Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Our streamlined process turns raw student data into measurable success stories.</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8 relative">
          {[
            { title: 'Data Collection', desc: 'LMS, SIS, and Engagement data.', icon: BarChart3 },
            { title: 'AI Analysis', desc: 'Risk scoring via neural networks.', icon: Brain },
            { title: 'Intervention', desc: 'Automated workflow triggers.', icon: Zap },
            { title: 'Improved Outcomes', desc: 'Measured success & graduation.', icon: Target },
          ].map((item, i) => (
            <div key={i} className="relative group text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-primary-600/10 rounded-[2rem] border border-primary-500/20 flex items-center justify-center relative z-10 group-hover:bg-primary-600/20 transition-all">
                <item.icon size={32} className="text-primary-400" />
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 left-[120%] w-full h-[2px] bg-gradient-to-r from-primary-500/20 to-transparent -translate-y-1/2"></div>
                )}
              </div>
              <h4 className="text-xl font-bold text-white">{item.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-slate-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <Badge variant="info" className="mb-6">Capabilities</Badge>
              <h2 className="text-5xl font-black tracking-tight text-white mb-6">Intelligence Built for Impact.</h2>
              <p className="text-slate-400 text-lg">Comprehensive tools to manage every aspect of the student lifecycle with data-driven precision.</p>
            </div>
            <Button variant="outline" className="mb-2">View All Features</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'AI Risk Prediction', desc: 'Predict failure with 91.7% accuracy before it happens.', icon: Brain },
              { title: 'Explainable AI', desc: 'Understand the "Why" behind every risk score.', icon: AlertCircle },
              { title: 'Intervention Engine', desc: 'Smart workflows for counselors and teachers.', icon: Zap },
              { title: 'Parent Engagement', desc: 'Keep families informed with automated updates.', icon: Users },
              { title: 'Counselor Workflow', desc: 'Prioritized case management for support staff.', icon: LayoutDashboard },
              { title: 'Institutional Analytics', desc: 'Bird-eye view of your entire school health.', icon: BarChart3 },
              { title: 'Predictive Insights', desc: 'Forecast future enrollment and performance.', icon: TrendingUp },
              { title: 'Real-Time Monitoring', desc: 'Live alerts when engagement drops below baseline.', icon: Clock },
            ].map((feature, i) => (
              <Card key={i} className="p-8 hover:-translate-y-2 transition-transform">
                <div className="p-3 bg-white/5 rounded-2xl w-fit mb-6">
                  <feature.icon size={24} className="text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Intelligence Showcase */}
      <section id="ai-intelligence" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-12 lg:p-20 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border-white/10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <Badge variant="info">Explainable AI</Badge>
                <h2 className="text-5xl font-black tracking-tight leading-tight">
                  Transparent <br /> Intelligence.
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  We believe AI shouldn't be a black box. EdVantage provides clear reasoning for every risk prediction, enabling counselors to take more effective, personalized actions.
                </p>
                <div className="space-y-4">
                  {[
                    'Dynamic Factor Weighting',
                    'Historical Correlation Analysis',
                    'Predictive Confidence Scores',
                    'Bias-Mitigated Algorithms'
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 font-bold">
                      <CheckCircle2 size={20} className="text-success-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="p-8 bg-slate-950/50 border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="font-black text-xl mb-1">Student Risk Score</h4>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Student ID: #88291</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-risk-critical">84.2%</div>
                      <RiskBadge level="High" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contributing Factors</p>
                    {[
                      { label: 'Attendance Decline', weight: 85, color: 'bg-red-500' },
                      { label: 'GPA Trend Downward', weight: 72, color: 'bg-amber-500' },
                      { label: 'Missed Assignments', weight: 64, color: 'bg-amber-500' },
                      { label: 'Low Engagement', weight: 42, color: 'bg-primary-500' },
                    ].map((factor, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                          <span>{factor.label}</span>
                          <span className="text-slate-400">{factor.weight}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${factor.color} rounded-full transition-all duration-1000`} 
                            style={{ width: `${factor.weight}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Why Choose EdVantage */}
      <section className="py-32 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div>
            <Badge variant="info" className="mb-6">Strategic Value</Badge>
            <h2 className="text-5xl font-black tracking-tight mb-8">Why Choose <br /> EdVantage?</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { title: 'Early Detection', desc: 'Identify risk factors 4-6 weeks earlier than traditional methods.', icon: Clock },
                { title: 'Data-Driven', desc: 'Move beyond intuition to verifiable data evidence.', icon: BarChart3 },
                { title: 'Improved Retention', desc: 'Reduce student dropout rates by up to 22% annually.', icon: TrendingUp },
                { title: 'Student-Centered', desc: 'Support designed around the individual student needs.', icon: Users },
              ].map((reason, i) => (
                <div key={i} className="space-y-4">
                  <div className="p-3 bg-primary-600/10 rounded-2xl w-fit">
                    <reason.icon size={24} className="text-primary-400" />
                  </div>
                  <h4 className="text-xl font-bold">{reason.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{reason.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary-600/20 to-transparent rounded-[4rem] border border-white/5 flex items-center justify-center overflow-hidden">
               <div className="relative w-full h-full p-12">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full"></div>
                  <div className="grid grid-cols-2 gap-4 h-full relative z-10">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                       <LayoutDashboard className="text-primary-400" size={32} />
                       <div className="text-2xl font-black">Modern UI</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mt-12 flex flex-col justify-between">
                       <Shield className="text-success-400" size={32} />
                       <div className="text-2xl font-black">Secure</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 -mt-12 flex flex-col justify-between">
                       <Zap className="text-amber-400" size={32} />
                       <div className="text-2xl font-black">Real-time</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                       <Brain className="text-purple-400" size={32} />
                       <div className="text-2xl font-black">AI Powered</div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <Badge variant="info" className="mb-6">Global Trust</Badge>
          <h2 className="text-5xl font-black tracking-tight mb-6">Success Stories</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">See how leading institutions are transforming student outcomes.</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { 
              name: 'Dr. Sarah Jenkins', 
              role: 'Director of Student Success', 
              inst: 'Westview University',
              text: 'EdVantage has completely changed how our advisors work. We no longer wait for mid-terms to see who is struggling; we know by week two.'
            },
            { 
              name: 'Mark Thompson', 
              role: 'Dean of Academics', 
              inst: 'Riverdale Institute',
              text: 'The predictive accuracy is uncanny. It identified at-risk patterns we simply couldnt see with our old reporting tools.'
            },
            { 
              name: 'Elena Rodriguez', 
              role: 'Head of Counseling', 
              inst: 'St. Mary’s College',
              text: 'The explainable AI feature is the game-changer. It gives my team the exact talking points they need for student interventions.'
            },
          ].map((testimonial, i) => (
            <Card key={i} className="p-10 flex flex-col justify-between italic text-slate-300">
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Zap key={i} size={16} className="text-amber-500 fill-amber-500" />)}
                </div>
                <p className="text-lg leading-relaxed">"{testimonial.text}"</p>
              </div>
              <div className="mt-10 pt-10 border-t border-white/5 not-italic">
                <p className="font-black text-white">{testimonial.name}</p>
                <p className="text-sm text-slate-500 font-bold">{testimonial.role}, {testimonial.inst}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-12 lg:p-24 bg-primary-600 relative overflow-hidden text-center space-y-12">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-900/40 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto space-y-8">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight">
                Ready to Revolutionize Your <br /> Institutional Intelligence?
              </h2>
              <p className="text-primary-100 text-xl font-medium max-w-2xl mx-auto">
                Join 120+ forward-thinking institutions using EdVantage to empower every student to reach their full potential.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <Button variant="white" size="xl" className="w-full sm:w-auto">Request a Private Demo</Button>
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/20 hover:bg-white/10">Contact Sales Team</Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <img src={logo} alt="EdVantage" className="h-8 w-8" />
              <span className="text-xl font-black tracking-tighter">EdVantage<span className="text-primary-500">.</span></span>
            </div>
            <div className="flex gap-10 text-sm font-bold text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">© 2026 EdVantage AI Intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
