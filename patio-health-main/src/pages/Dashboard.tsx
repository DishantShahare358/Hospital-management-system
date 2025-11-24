import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import NurseDashboard from '@/pages/nurse/NurseDashboard';
import ReceptionistDashboard from '@/pages/receptionist/ReceptionistDashboard';
import PatientDashboard from '@/pages/patient/PatientDashboard';
import LabTechnicianDashboard from '@/pages/lab/LabTechnicianDashboard';
import DashboardLayout from '@/components/DashboardLayout';

const Dashboard = () => {
  const { state } = useAuth();

  if (!state.user) {
    return null;
  }

  const DashboardComponent = {
    admin: AdminDashboard,
    doctor: DoctorDashboard,
    nurse: NurseDashboard,
    receptionist: ReceptionistDashboard,
    patient: PatientDashboard,
    lab_technician: LabTechnicianDashboard,
  }[state.user.role];

  if (!DashboardComponent) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Dashboard not available for this role.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardComponent />
    </DashboardLayout>
  );
};

export default Dashboard;