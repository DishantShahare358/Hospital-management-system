import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Shield, Users, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <Heart className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">MediCore</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          <Link to="/login">
            <Button variant="outline" className="font-semibold">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="hero">Get Started</Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Modern Hospital
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Management</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your healthcare operations with our comprehensive platform designed for modern hospitals and clinics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="vibrant" size="lg" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Glass Card Hero */}
      <section className="px-6 lg:px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="glass border-0 shadow-glass p-8">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    All-in-One Healthcare Platform
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    From patient registration to appointment scheduling, medical records management to staff coordination - everything you need in one seamless platform.
                  </p>
                  <div className="space-y-3">
                    {['Real-time patient monitoring', 'Integrated billing system', 'Secure data encryption', 'Mobile-first design'].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-medical rounded-lg opacity-20 animate-float" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="h-24 w-24 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-6 lg:px-12 py-20">
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

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-20 bg-gradient-hero">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Hospital?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of healthcare professionals who trust MediCore for their daily operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                Start Your Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">MediCore</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 MediCore. All rights reserved. HIPAA Compliant Healthcare Management.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;