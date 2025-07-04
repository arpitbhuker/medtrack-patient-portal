
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { prescriptionService } from '../services/prescriptionService';

const Prescriptions: React.FC = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      if (user) {
        const response = await prescriptionService.getPrescriptionsByUserId(user.id);
        setPrescriptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setError('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await prescriptionService.addPrescription({
        ...formData,
        userId: user?.id
      });
      setSuccess('Prescription added successfully!');
      setFormData({
        medicineName: '',
        dosage: '',
        frequency: '',
        startDate: '',
        endDate: ''
      });
      setShowForm(false);
      fetchPrescriptions();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add prescription');
    }
  };

  const isActive = (prescription: any) => {
    const now = new Date();
    const endDate = new Date(prescription.endDate);
    return endDate > now;
  };

  if (isLoading) {
    return <div className="loading">Loading prescriptions...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">My Prescriptions</h1>
          <p className="card-subtitle">Track your medications and dosages</p>
        </div>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Prescription'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Add New Prescription</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="medicineName" className="form-label">
                Medicine Name
              </label>
              <input
                type="text"
                id="medicineName"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dosage" className="form-label">
                  Dosage
                </label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 500mg"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="frequency" className="form-label">
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Prescription
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Your Prescriptions</h2>
        </div>
        
        {prescriptions.length > 0 ? (
          <div className="item-list">
            {prescriptions.map((prescription: any) => (
              <div key={prescription.id} className="item-card">
                <div className="item-header">
                  <div>
                    <div className="item-title">{prescription.medicineName}</div>
                    <div className="item-subtitle">
                      Dosage: {prescription.dosage} | Frequency: {prescription.frequency}
                    </div>
                    <div className="item-subtitle">
                      Duration: {new Date(prescription.startDate).toLocaleDateString()} - {new Date(prescription.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`status-badge ${isActive(prescription) ? 'status-scheduled' : 'status-completed'}`}>
                    {isActive(prescription) ? 'Active' : 'Completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No prescriptions found. Add your first prescription!</p>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
