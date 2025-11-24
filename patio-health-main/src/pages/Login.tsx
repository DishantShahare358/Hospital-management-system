import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles, Smartphone } from 'lucide-react';
import { UserRole } from '@/types/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      toast({
        title: 'Role required',
        description: 'Please select your role to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in to your account.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roles: Array<{ value: UserRole; label: string; icon: string }> = [
    { value: 'admin', label: 'Hospital Administrator', icon: '👨‍💼' },
    { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
    { value: 'nurse', label: 'Nurse', icon: '👩‍⚕️' },
    { value: 'receptionist', label: 'Receptionist', icon: '📋' },
    { value: 'patient', label: 'Patient', icon: '🧑‍🤝‍🧑' },
    { value: 'lab_technician', label: 'Lab Technician', icon: '🔬' },
  ];

  const demoCredentials = [
    { role: 'admin' as UserRole, roleLabel: 'Admin', email: 'admin@hospital.com', password: 'admin123' },
    { role: 'doctor' as UserRole, roleLabel: 'Doctor', email: 'dr.smith@hospital.com', password: 'doctor123' },
    { role: 'nurse' as UserRole, roleLabel: 'Nurse', email: 'nurse.johnson@hospital.com', password: 'nurse123' },
    { role: 'receptionist' as UserRole, roleLabel: 'Receptionist', email: 'receptionist@hospital.com', password: 'receptionist123' },
    { role: 'patient' as UserRole, roleLabel: 'Patient', email: 'patient@example.com', password: 'patient123' },
    { role: 'lab_technician' as UserRole, roleLabel: 'Lab Tech', email: 'labtech@hospital.com', password: 'labtech123' },
  ];

  const handleDemoLogin = (demoEmail: string, demoPassword: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setRole(demoRole);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/8460120/pexels-photo-8460120.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Hospital hallway"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-primary/40 dark:from-background/90 dark:via-background/85 dark:to-primary/30" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="px-4 py-4 sm:px-8">
          <div className="glass flex items-center justify-between rounded-full border border-white/30 bg-white/70 px-4 py-2 shadow-soft backdrop-blur dark:bg-slate-900/60">
            <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
              <Heart className="h-6 w-6 text-primary" />
              MediCore
            </Link>
            <div className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:flex">
              <Link to="/" className="hover:text-primary transition">Platform</Link>
              <Link to="/register" className="hover:text-primary transition">Get Started</Link>
            </div>
            <Link to="/register">
              <Button variant="hero" size="sm" className="hidden sm:inline-flex">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-10 px-4 pb-10 pt-6 lg:flex-row lg:items-center lg:justify-center lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass w-full max-w-xl rounded-3xl border border-white/30 bg-white/70 p-8 shadow-glass backdrop-blur dark:border-white/10 dark:bg-slate-900/70"
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Unified Care Access
            </p>
            <h1 className="mt-4 text-4xl font-bold text-foreground">Welcome back to your hospital command center</h1>
            <p className="mt-4 text-muted-foreground">
              Securely sign in and orchestrate patient journeys, staff workflows, and real-time insights from a single dashboard.
            </p>
            <div className="mt-8 grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                <Shield className="mb-3 h-6 w-6 text-primary" />
                <p className="font-semibold text-foreground">HIPAA-grade security</p>
                <p className="text-muted-foreground">Multi-factor authentication & layered encryption</p>
              </div>
              <div className="rounded-2xl border border-secondary/20 bg-secondary/10 p-4">
                <Smartphone className="mb-3 h-6 w-6 text-secondary" />
                <p className="font-semibold text-foreground">Mobile-ready rounds</p>
                <p className="text-muted-foreground">Update orders and notes from any device</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-lg"
          >
            <Card className="glass border border-white/40 shadow-glass dark:border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Sign In</CardTitle>
                  <Link to="/register" className="text-sm text-primary hover:underline">Need an account?</Link>
                </div>
                <p className="text-sm text-muted-foreground">Choose your role to load the right workflow</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            <div className="flex items-center space-x-2">
                              <span>{r.icon}</span>
                              <span>{r.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="dr.smith@hospital.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot Password?
                    </Link>
                    <span className="text-xs text-muted-foreground">SSO coming soon</span>
                  </div>

                  <Button
                    type="submit"
                    variant="medical"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3 text-center">Demo Accounts</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {demoCredentials.map((demo, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDemoLogin(demo.email, demo.password, demo.role)}
                        className="text-xs h-8 border border-border hover:bg-primary/10"
                      >
                        {demo.roleLabel}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Login;