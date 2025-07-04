
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/appointments';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const appointmentService = {
  bookAppointment: async (appointmentData: {
    userId: number;
    doctorName: string;
    appointmentDate: string;
    reason: string;
  }) => {
    return await api.post('/', appointmentData);
  },

  getAllAppointments: async () => {
    return await api.get('/');
  },

  cancelAppointment: async (appointmentId: number) => {
    return await api.delete(`/${appointmentId}`);
  },
};
