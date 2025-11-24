import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, Shield, Users, Calendar, ArrowRight, Activity, Stethoscope, Smartphone, Sparkles, Star, SunMedium, Moon, User, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Workflows', href: '#care-modules' },
  { label: 'Security', href: '#features' },
  { label: 'Pricing', href: '#cta' }
];

const Landing = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const isLoggedIn = mounted && state.user !== null;

  const handleThemeToggle = () => {
    if (!mounted) return;
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const features = [
    {
      icon: Heart,
      title: 'Patient Care',
      description: 'Comprehensive patient management with medical records and appointment scheduling'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'HIPAA-compliant platform ensuring your medical data is always protected'
    },
    {
      icon: Users,
      title: 'Multi-Role Access',
      description: 'Tailored dashboards for doctors, nurses, patients, and hospital staff'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent appointment booking system with real-time availability'
    }
  ];

  const stats = [
    { value: '120+', label: 'Hospitals Onboarded', trend: '+18 this quarter' },
    { value: '2.4M', label: 'Patient Records', trend: 'Encrypted end-to-end' },
    { value: '99.98%', label: 'Uptime SLA', trend: 'Multi-region cloud' }
  ];

  const careModules = [
    {
      title: 'Clinical Intelligence',
      description: 'Unified patient summaries, AI-assisted triage and proactive risk alerts built for busy ward rounds.',
      badge: 'AI Copilot',
      image: 'https://media.istockphoto.com/id/1300745916/photo/medical-technology-concept-remote-medicine-electronic-medical-record.jpg?s=1024x1024&w=is&k=20&c=uUSIxkRXQ8qvq_t8XgiMuu7gsS3fEO6RGz4zIWAIseM='
    },
    {
      title: 'Connected Workforce',
      description: 'Role-based dashboards, secure chat, handoff templates and staffing visibility in one view.',
      badge: 'Staff 360º',
      image: 'https://media.istockphoto.com/id/1300746060/photo/medical-technology-concept-remote-medicine-electronic-medical-record.jpg?s=2048x2048&w=is&k=20&c=9LbSzzxUkoLx7gm5FiwJgF4Mvgo-HZj3UfiHj6PSCUE='
    },
    {
      title: 'Smart Patient Access',
      description: 'Mobile-first portal, self check-in kiosks, telehealth visits and automated reminders for every patient.',
      badge: 'Patient+',
      image: 'https://media.istockphoto.com/id/2199133857/photo/close-up-of-doctor-pointing-at-human-anatomy-hologram-while-standing-remedial.jpg?s=1024x1024&w=is&k=20&c=MjkdnzCrIX-qGJk7muKowWTgy9EPcc70uXub2vgnc0E='
    }
  ];

  const testimonials = [
    {
      quote: 'MediCore has become the digital heart of our hospital. Care teams finally share the same real-time picture of every patient.',
      name: 'Dr. Anika Bose',
      role: 'Chief Medical Officer, PulseCare Network',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
    },
    {
      quote: 'Implementation took weeks, not months. The mobile workflows alone save nurses an hour per shift.',
      name: 'Elena Rodriguez',
      role: 'Director of Nursing, Nova Clinics',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const journey = [
    { title: 'Discover & Configure', description: 'Blueprint workshops map your exact clinical pathways, integrations and compliance needs.', time: 'Week 1' },
    { title: 'Launch & Train', description: 'Hypercare teams run live simulations, floor walk-throughs and role-based academies.', time: 'Weeks 2-4' },
    { title: 'Optimize & Scale', description: 'Insight dashboards surface adoption, bottlenecks and ROI while automations grow with you.', time: 'Ongoing' }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-90 dark:opacity-70"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-primary/10 dark:from-background/90 dark:via-background/85 dark:to-primary/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(210,90%,60%,0.25),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,hsla(190,95%,65%,0.2),transparent_55%)]" />
      </div>
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 px-4 py-4 lg:px-12"
      >
        <div className="glass flex items-center justify-between rounded-full border border-white/20 bg-white/70 px-6 py-3 shadow-soft backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/70">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Heart className="h-8 w-8 text-primary animate-pulse" />
            <span className="text-2xl font-bold text-foreground">MediCore</span>
          </motion.div>
          <div className="hidden gap-6 text-sm font-semibold uppercase tracking-widest text-muted-foreground lg:flex">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative cursor-pointer"
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 h-[2px] w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            {mounted && (
              <button
                onClick={handleThemeToggle}
                className="rounded-full border border-border bg-card p-2 text-foreground shadow-sm transition hover:scale-105"
                aria-label="Toggle color theme"
              >
                {isDark ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            {isLoggedIn ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="font-semibold">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-primary/10 text-foreground">
                      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                        <AvatarImage src={state.user?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {state.user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block font-medium">{state.user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="hover:bg-primary/10 cursor-pointer" asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-primary/10 cursor-pointer" asChild>
                      <Link to="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="hover:bg-destructive/10 text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="font-semibold">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="hero">Get Started</Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section id="hero" className="px-6 lg:px-12 py-20">
        <div className="max-w-6xl mx-auto grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Experience the new standard of hospital command centers
            </div>
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-foreground">
                Human-centered care,
                <span className="bg-gradient-hero bg-clip-text text-transparent"> powered by intelligent workflows</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Real-time patient visibility, AI-assisted decision support, mobile-ready care teams and enterprise-grade security in one unified operating system for hospitals and clinics.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="vibrant" size="lg" className="w-full sm:w-auto">
                Watch Platform Tour
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-primary/10 bg-white/75 p-4 shadow-soft backdrop-blur dark:border-primary/25 dark:bg-slate-900/70">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -left-8 top-8 hidden h-24 w-24 rounded-full bg-secondary/20 blur-3xl sm:block" />
            <div className="rounded-[28px] border border-white/60 bg-white shadow-[0_45px_85px_-35px_rgba(15,23,42,0.4)] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1600&q=80"
                alt="Doctors collaborating"
                className="h-[420px] w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <Card className="absolute -right-10 -bottom-10 w-64 glass shadow-glass">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Real-time Bed Status</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-foreground">87%</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Occupancy across network</p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-xs text-foreground">
                  12 critical patients flagged • 4 teams dispatched
                </div>
              </CardContent>
            </Card>
            <div className="absolute left-8 -bottom-8 hidden w-48 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-xl sm:flex flex-col gap-2">
              <p className="text-sm font-semibold text-foreground">Care Team Check-ins</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Stethoscope className="h-4 w-4 text-primary" />
                312 rounds completed today
              </div>
              <div className="flex items-start gap-3 text-xs">
                <Smartphone className="h-4 w-4 text-secondary" />
                <span>Mobile updates syncing instantly across doctor, nurse & patient dashboards.</span>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="max-w-6xl mx-auto mt-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground text-center mb-6">Trusted by care teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-muted-foreground text-sm font-semibold">
            <span className="opacity-80">PulseCare Network</span>
            <span className="opacity-80">Nova Clinics</span>
            <span className="opacity-80">Medisphere</span>
            <span className="opacity-80">Aster Hospitals</span>
            <span className="opacity-80">Radiant Health</span>
          </div>
        </div>
      </section>

      {/* Glass Card Hero */}
      <section id="platform" className="px-6 lg:px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 lg:items-center"
        >
          <Card className="glass border-0 shadow-glass p-10">
            <CardContent className="p-0 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Shield className="h-4 w-4" />
                HIPAA & GDPR Ready
              </div>
              <h2 className="text-3xl font-bold">
                All-in-one healthcare platform that evolves with every department
              </h2>
              <p className="text-muted-foreground">
                Orchestrate admissions, perioperative care, labs, pharmacy, billing and outreach from a single secure source of truth. Automations and analytics natively adapt to your care pathways.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {['Real-time patient monitoring', 'Integrated billing & claims', 'Secure interoperability', 'Mobile-first design'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white/70 p-3 text-sm font-semibold text-foreground dark:border-primary/25 dark:bg-slate-900/70">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[28px] border border-white/50 shadow-[0_35px_65px_-25px_rgba(15,23,42,0.35)]">
              <img
                src="https://images.pexels.com/photos/7088486/pexels-photo-7088486.jpeg?auto=compress&cs=tinysrgb&w=1400"
                alt="Hospital control center"
                className="h-[320px] w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/85 p-4 text-sm backdrop-blur-lg dark:bg-slate-900/80">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">Command Center Snapshot</p>
                  <span className="text-xs text-muted-foreground">12 live alerts</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p className="text-2xl font-bold text-foreground">28</p>
                    Active surgeries
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">7m</p>
                    Avg. discharge prep
                  </div>
                </div>
              </div>
            </div>
            <Card className="shadow-soft dark:bg-slate-900/80">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Live Telehealth Hub</p>
                  <p className="text-xs text-muted-foreground">40+ slots added after AI demand forecast</p>
                </div>
                <Button variant="medical" size="sm">
                  Open Virtual Clinic
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Care Modules */}
      <section id="care-modules" className="px-6 lg:px-12 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col gap-4 text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Care Journeys</p>
            <h2 className="text-4xl font-bold text-foreground">Modular experiences for every hospital service line</h2>
            <p className="text-lg text-muted-foreground">
              Launch pre-built journeys and tailor them with drag-and-drop automations, native analytics and secure messaging.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {careModules.map((module) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative overflow-hidden rounded-[28px] border border-white/60 shadow-soft dark:border-white/10 dark:bg-slate-900/70"
              >
                <img
                  src={module.image}
                  alt={module.title}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-4 bg-white px-6 pb-6 pt-5 dark:bg-slate-900/70">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{module.badge}</span>
                  <h3 className="text-xl font-semibold text-foreground">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  <Button variant="ghost" className="justify-start px-0 text-sm font-semibold text-primary hover:text-primary-dark">
                    Explore workflow playbook
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 lg:px-12 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose MediCore?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for healthcare professionals who demand efficiency, security, and reliability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Journey & Stories */}
      <section className="px-6 lg:px-12 py-20 bg-white/80 dark:bg-slate-900/70">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Go-live journey</p>
              <h2 className="mt-3 text-3xl font-bold text-foreground">From kickoff to measurable impact in 30 days</h2>
              <p className="mt-3 text-muted-foreground">
                Dedicated transformation squads pair change management with automation templates so every department feels confident on day one.
              </p>
            </div>
            <div className="space-y-6">
              {journey.map((stage) => (
                <div key={stage.title} className="rounded-3xl border border-primary/10 bg-primary/5 p-5 shadow-soft">
                  <div className="flex items-center justify-between text-sm text-primary font-semibold">
                    <span>{stage.time}</span>
                    <Shield className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-foreground">{stage.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{stage.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="rounded-[32px] border border-primary/10 bg-gradient-to-br from-white via-primary/5 to-white p-8 shadow-glass dark:from-slate-900 dark:via-primary/10 dark:to-slate-900">
              <div className="flex items-center gap-3 text-primary">
                <Star className="h-6 w-6" />
                <p className="text-sm font-semibold uppercase tracking-[0.25em]">voices from the wards</p>
              </div>
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="mt-8 rounded-3xl bg-white/80 p-6 backdrop-blur dark:bg-slate-900/70">
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-base font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                </div>
              ))}
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="medical">Talk to our rollout team</Button>
                <Button variant="ghost" className="text-primary hover:text-primary-dark">Download playbook</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="px-6 lg:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-primary via-accent to-secondary p-[1px] shadow-glow">
            <div className="glass relative rounded-[35px] bg-white/70 px-8 py-12 text-center text-foreground dark:bg-slate-950/60">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute left-10 bottom-0 h-24 w-24 rounded-full bg-secondary/20 blur-3xl" />
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold uppercase tracking-[0.4em] text-primary mb-4"
              >
                Mission Control
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-4"
              >
                Ready to Transform Your Hospital?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto"
              >
                Join thousands of healthcare professionals who trust MediCore for their daily operations. Get a guided tour of AI-powered workflows, clinical command centers and enterprise-grade security.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="glass" size="lg" className="w-full sm:w-auto border border-primary/20 text-primary backdrop-blur-md hover:bg-primary/10">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto rounded-3xl border border-primary/15 bg-white/70 p-6 shadow-soft backdrop-blur dark:bg-slate-900/60">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <p className="text-lg font-semibold text-foreground">MediCore</p>
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Care Operating System</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#hero" className="hover:text-primary transition">Overview</a>
              <a href="#care-modules" className="hover:text-primary transition">Solutions</a>
              <a href="#features" className="hover:text-primary transition">Security</a>
              <a href="#cta" className="hover:text-primary transition">Contact</a>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              © {new Date().getFullYear()} MediCore. HIPAA compliant healthcare management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;