import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import { hospitalApi } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  Star, 
  Heart, 
  FileText, 
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { state } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsData, appointmentsData] = await Promise.all([
          hospitalApi.getDoctors(),
          hospitalApi.getAppointments(state.user?.id)
        ]);
        setDoctors(doctorsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state.user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookAppointment = async (doctorId: string) => {
    try {
      await hospitalApi.bookAppointment({
        patientId: state.user?.id,
        doctorId,
        patientName: state.user?.name,
        doctorName: doctors.find(d => d.id === doctorId)?.name,
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        reason: 'Regular checkup'
      });
      
      // Refresh appointments
      const appointmentsData = await hospitalApi.getAppointments(state.user?.id);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Heart className="h-8 w-8 text-primary animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-medical rounded-lg p-6 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">Welcome back, {state.user?.name}!</h2>
          <p className="opacity-90">Manage your appointments and health records easily.</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                    <p className="text-3xl font-bold">{appointments.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
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
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold">
                      {appointments.filter(apt => apt.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
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
                    <p className="text-sm font-medium text-muted-foreground">Records</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <FileText className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Doctors */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Available Doctors
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctors.slice(0, 3).map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={doctor.avatar} />
                          <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{doctor.name}</h3>
                          <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">{doctor.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={doctor.available ? "default" : "secondary"}
                          className={doctor.available ? "bg-green-100 text-green-800" : ""}
                        >
                          {doctor.available ? 'Available' : 'Busy'}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="medical"
                          disabled={!doctor.available}
                          onClick={() => handleBookAppointment(doctor.id)}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Appointments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No appointments yet</p>
                      <p className="text-sm">Book your first appointment with a doctor</p>
                    </div>
                  ) : (
                    appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(appointment.status)}
                          <div>
                            <h3 className="font-medium">{appointment.doctorName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.date} at {appointment.time}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {appointment.reason}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;