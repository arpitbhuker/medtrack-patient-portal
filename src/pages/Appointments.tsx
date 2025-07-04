
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    appointmentDate: '',
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getAllAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await appointmentService.bookAppointment({
        ...formData,
        userId: user?.id
      });
      setSuccess('Appointment booked successfully!');
      setFormData({ doctorName: '', appointmentDate: '', reason: '' });
      setShowForm(false);
      fetchAppointments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  const handleCancel = async (appointmentId: number) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancelAppointment(appointmentId);
        setSuccess('Appointment cancelled successfully!');
        fetchAppointments();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to cancel appointment');
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">My Appointments</h1>
          <p className="card-subtitle">Manage your medical appointments</p>
        </div>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Book New Appointment'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Book New Appointment</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="doctorName" className="form-label">
                Doctor Name
              </label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="appointmentDate" className="form-label">
                Appointment Date & Time
              </label>
              <input
                type="datetime-local"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="reason" className="form-label">
                Reason for Visit
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="form-input form-textarea"
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Your Appointments</h2>
        </div>
        
        {appointments.length > 0 ? (
          <div className="item-list">
            {appointments.map((appointment: any) => (
              <div key={appointment.id} className="item-card">
                <div className="item-header">
                  <div>
                    <div className="item-title">Dr. {appointment.doctorName}</div>
                    <div className="item-subtitle">
                      {new Date(appointment.appointmentDate).toLocaleString()}
                    </div>
                    <div className="item-subtitle">
                      Reason: {appointment.reason}
                    </div>
                  </div>
                  <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </div>
                
                {appointment.status === 'SCHEDULED' && (
                  <div className="item-actions">
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No appointments found. Book your first appointment!</p>
        )}
      </div>
    </div>
  );
};

export default Appointments;
