import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Heart, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  User,
  Home,
  Users,
  Calendar,
  FileText,
  Activity,
  Bell
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { state, logout } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', href: '/dashboard' },
    ];

    switch (state.user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: Users, label: 'Users', href: '/admin/users' },
          { icon: Calendar, label: 'Appointments', href: '/admin/appointments' },
          { icon: Activity, label: 'Analytics', href: '/admin/analytics' },
        ];
      case 'doctor':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', href: '/doctor/patients' },
          { icon: Calendar, label: 'Appointments', href: '/doctor/appointments' },
          { icon: FileText, label: 'Records', href: '/doctor/records' },
        ];
      case 'nurse':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', href: '/nurse/patients' },
          { icon: Activity, label: 'Vitals', href: '/nurse/vitals' },
          { icon: FileText, label: 'Notes', href: '/nurse/notes' },
        ];
      case 'patient':
        return [
          ...baseItems,
          { icon: Calendar, label: 'Appointments', href: '/patient/appointments' },
          { icon: Users, label: 'Doctors', href: '/patient/doctors' },
          { icon: FileText, label: 'Records', href: '/patient/records' },
        ];
      case 'employee':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', href: '/employee/patients' },
          { icon: Calendar, label: 'Appointments', href: '/employee/appointments' },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="fixed left-0 top-0 h-full bg-card border-r border-border z-30"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <motion.div
              initial={false}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className="flex items-center space-x-2"
            >
              <Heart className="h-8 w-8 text-primary" />
              {sidebarOpen && <span className="text-xl font-bold">MediCore</span>}
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link to={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={`w-full justify-start ${!sidebarOpen && 'px-2'}`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {sidebarOpen && <span>{item.label}</span>}
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`w-full justify-start ${!sidebarOpen && 'px-2'}`}>
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={state.user?.avatar} />
                    <AvatarFallback>
                      {state.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {sidebarOpen && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{state.user?.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {state.user?.role}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 256 : 80 }}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-primary/10"
            >
              {sidebarOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
            </Button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-foreground">
                {state.user?.role === 'admin' && 'Admin Dashboard'}
                {state.user?.role === 'doctor' && 'Doctor Dashboard'}
                {state.user?.role === 'nurse' && 'Nurse Dashboard'}
                {state.user?.role === 'patient' && 'Patient Portal'}
                {state.user?.role === 'employee' && 'Staff Dashboard'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {state.user?.name}!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Bell className="h-5 w-5 text-foreground" />
            </Button>
            
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
                <DropdownMenuItem className="hover:bg-primary/10">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/10">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-destructive/10 text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;