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
import { Heart, User, Mail, Lock, Phone, Calendar, Eye, EyeOff, ArrowRight, Sparkles, Stethoscope } from 'lucide-react';
import { UserRole } from '@/types/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole,
    specialization: '',
    department: '',
    phone: '',
    dateOfBirth: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) {
      toast({
        title: 'Please select a role',
        description: 'Role selection is required to complete registration.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast({
        title: 'Registration successful!',
        description: 'Your account has been created successfully.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const roles = [
    { value: 'admin', label: 'Hospital Administrator', icon: '👨‍💼' },
    { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
    { value: 'nurse', label: 'Nurse', icon: '👩‍⚕️' },
    { value: 'receptionist', label: 'Receptionist', icon: '📋' },
    { value: 'patient', label: 'Patient', icon: '🧑‍🤝‍🧑' },
    { value: 'lab_technician', label: 'Lab Technician', icon: '🔬' },
  ];

  const specializations = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology',
    'Gynecology', 'Psychiatry', 'Emergency Medicine', 'Internal Medicine', 'Surgery'
  ];

  const departments = [
    'Emergency', 'ICU', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
    'Surgery', 'Radiology', 'Laboratory', 'Pharmacy', 'Administration'
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/8460123/pexels-photo-8460123.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Hospital team"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-secondary/40 dark:from-background/90 dark:via-background/85 dark:to-secondary/30" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="px-4 py-4 sm:px-8">
          <div className="glass flex items-center justify-between rounded-full border border-white/30 bg-white/70 px-4 py-2 shadow-soft backdrop-blur dark:bg-slate-900/60">
            <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
              <Heart className="h-6 w-6 text-primary" />
              MediCore
            </Link>
            <div className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:flex">
              <a href="/#care-modules" className="hover:text-primary transition">Solutions</a>
              <a href="/#features" className="hover:text-primary transition">Security</a>
            </div>
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-10 px-4 pb-14 pt-6 lg:flex-row lg:items-center lg:justify-center lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass w-full max-w-xl rounded-3xl border border-white/30 bg-white/75 p-8 shadow-glass backdrop-blur dark:border-white/10 dark:bg-slate-900/70"
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1 text-xs font-semibold text-secondary">
              <Sparkles className="h-4 w-4" />
              Care team onboarding
            </p>
            <h1 className="mt-4 text-4xl font-bold text-foreground">Create accounts for every hospital role in minutes</h1>
            <p className="mt-4 text-muted-foreground">
              Provision secure access for doctors, nurses, operations leaders and patients with guided onboarding and compliance-ready workflows.
            </p>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/10 p-4">
                <Stethoscope className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Role-aware experiences</p>
                  <p className="text-muted-foreground">Dashboards adapt automatically for clinical, admin or patient journeys.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-secondary/15 bg-secondary/10 p-4">
                <Sparkles className="mt-1 h-5 w-5 text-secondary" />
                <div>
                  <p className="font-semibold text-foreground">Automated compliance</p>
                  <p className="text-muted-foreground">Built-in audit trails, role approvals and identity verification.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-2xl"
          >
            <Card className="glass border border-white/40 shadow-glass dark:border-white/10">
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <Link to="/login" className="text-sm text-primary hover:underline">Have an account? Sign in</Link>
                </div>
                <p className="text-sm text-muted-foreground">Complete the details below to unlock your personalized workspace.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Dr. Maya Gupta"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@hospital.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
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
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex items-center space-x-2">
                              <span>{role.icon}</span>
                              <span>{role.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {formData.role === 'doctor' && (
                    <div className="space-y-2">
                      <Label>Specialization</Label>
                      <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          {specializations.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(formData.role === 'doctor' || formData.role === 'nurse' || formData.role === 'receptionist' || formData.role === 'lab_technician') && (
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="medical"
                    className="w-full md:col-span-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Register;