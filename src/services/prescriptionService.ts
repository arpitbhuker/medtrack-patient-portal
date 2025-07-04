
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/prescriptions';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const prescriptionService = {
  addPrescription: async (prescriptionData: {
    userId: number;
    medicineName: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
  }) => {
    return await api.post('/', prescriptionData);
  },

  getPrescriptionsByUserId: async (userId: number) => {
    return await api.get(`/${userId}`);
  },
};
