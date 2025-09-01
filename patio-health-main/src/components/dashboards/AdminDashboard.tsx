import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import { hospitalApi } from '@/services/mockApi';
import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  CheckCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, appointmentsData] = await Promise.all([
          hospitalApi.getUsers(),
          hospitalApi.getAppointments()
        ]);
        setUsers(usersData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    totalUsers: users.length,
    totalDoctors: users.filter(u => u.role === 'doctor').length,
    totalPatients: users.filter(u => u.role === 'patient').length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    approvedAppointments: appointments.filter(a => a.status === 'approved').length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Activity className="h-8 w-8 text-primary animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-medical rounded-lg p-6 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">Hospital Overview</h2>
          <p className="opacity-90">Monitor and manage hospital operations from here.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% from last month
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Doctors</p>
                    <p className="text-3xl font-bold">{stats.totalDoctors}</p>
                    <p className="text-xs text-blue-600 flex items-center mt-1">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Active staff
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patients</p>
                    <p className="text-3xl font-bold">{stats.totalPatients}</p>
                    <p className="text-xs text-secondary flex items-center mt-1">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Registered
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                    <p className="text-3xl font-bold">{stats.totalAppointments}</p>
                    <p className="text-xs text-yellow-600 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {stats.pendingAppointments} pending
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(-5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          user.role === 'doctor' ? 'border-blue-500 text-blue-700' :
                          user.role === 'nurse' ? 'border-green-500 text-green-700' :
                          user.role === 'patient' ? 'border-purple-500 text-purple-700' :
                          'border-gray-500 text-gray-700'
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appointment Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h3 className="font-medium">Pending Approval</h3>
                        <p className="text-sm text-muted-foreground">
                          {stats.pendingAppointments} appointments waiting
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {stats.pendingAppointments}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="font-medium">Approved Today</h3>
                        <p className="text-sm text-muted-foreground">
                          {stats.approvedAppointments} appointments confirmed
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {stats.approvedAppointments}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-4 rounded-lg bg-primary/5">
                      <p className="text-2xl font-bold text-primary">{stats.totalDoctors}</p>
                      <p className="text-xs text-muted-foreground">Active Doctors</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-secondary/5">
                      <p className="text-2xl font-bold text-secondary">8</p>
                      <p className="text-xs text-muted-foreground">Departments</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;