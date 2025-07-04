
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { prescriptionService } from '../services/prescriptionService';

interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  activePrescriptions: number;
  completedAppointments: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    upcomingAppointments: 0,
    activePrescriptions: 0,
    completedAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (user) {
        const [appointmentsResponse, prescriptionsResponse] = await Promise.all([
          appointmentService.getAllAppointments(),
          prescriptionService.getPrescriptionsByUserId(user.id)
        ]);

        const appointments = appointmentsResponse.data;
        const prescriptions = prescriptionsResponse.data;

        // Calculate stats
        const totalAppointments = appointments.length;
        const upcomingAppointments = appointments.filter(
          (apt: any) => apt.status === 'SCHEDULED' && new Date(apt.appointmentDate) > new Date()
        ).length;
        const completedAppointments = appointments.filter(
          (apt: any) => apt.status === 'COMPLETED'
        ).length;
        const activePrescriptions = prescriptions.filter(
          (pres: any) => new Date(pres.endDate) > new Date()
        ).length;

        setStats({
          totalAppointments,
          upcomingAppointments,
          activePrescriptions,
          completedAppointments
        });

        // Set recent data (last 3 items)
        setRecentAppointments(appointments.slice(0, 3));
        setRecentPrescriptions(prescriptions.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Welcome back, {user?.firstName}!</h1>
          <p className="card-subtitle">Here's your health overview</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalAppointments}</div>
          <div className="stat-label">Total Appointments</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.upcomingAppointments}</div>
          <div className="stat-label">Upcoming Appointments</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.activePrescriptions}</div>
          <div className="stat-label">Active Prescriptions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completedAppointments}</div>
          <div className="stat-label">Completed Appointments</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Appointments</h2>
          </div>
          {recentAppointments.length > 0 ? (
            <div className="item-list">
              {recentAppointments.map((appointment: any) => (
                <div key={appointment.id} className="item-card">
                  <div className="item-title">{appointment.doctorName}</div>
                  <div className="item-subtitle">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.reason}
                  </div>
                  <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent appointments</p>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Prescriptions</h2>
          </div>
          {recentPrescriptions.length > 0 ? (
            <div className="item-list">
              {recentPrescriptions.map((prescription: any) => (
                <div key={prescription.id} className="item-card">
                  <div className="item-title">{prescription.medicineName}</div>
                  <div className="item-subtitle">
                    {prescription.dosage} - {prescription.frequency}
                  </div>
                  <div className="item-subtitle">
                    Until {new Date(prescription.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent prescriptions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
