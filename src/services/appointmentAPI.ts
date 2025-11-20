import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Appointment {
  id: string;
  paciente: string;
  especialidad: string;
  fecha: string;
  hora: string;
  doctor: string;
  notas?: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentDTO {
  paciente: string;
  especialidad: string;
  fecha: string;
  hora: string;
  doctor: string;
  notas?: string;
}

export interface UpdateAppointmentDTO {
  paciente?: string;
  especialidad?: string;
  fecha?: string;
  hora?: string;
  doctor?: string;
  notas?: string;
  estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
}

class AppointmentAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/appointments`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  /**
   * Obtener todas las citas
   */
  async getAll(filters?: {
    doctor?: string;
    especialidad?: string;
    fecha?: string;
    paciente?: string;
  }): Promise<Appointment[]> {
    try {
      const response = await this.client.get('/', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  /**
   * Obtener una cita por ID
   */
  async getById(id: string): Promise<Appointment> {
    try {
      const response = await this.client.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear una nueva cita
   */
  async create(appointmentData: CreateAppointmentDTO): Promise<Appointment> {
    try {
      const response = await this.client.post('/', appointmentData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Actualizar una cita existente
   */
  async update(id: string, updates: UpdateAppointmentDTO): Promise<Appointment> {
    try {
      const response = await this.client.put(`/${id}`, updates);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating appointment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar una cita
   */
  async delete(id: string): Promise<void> {
    try {
      await this.client.delete(`/${id}`);
    } catch (error) {
      console.error(`Error deleting appointment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener citas por doctor
   */
  async getByDoctor(doctor: string): Promise<Appointment[]> {
    try {
      const response = await this.client.get('/', { params: { doctor } });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching appointments by doctor:', error);
      throw error;
    }
  }

  /**
   * Obtener citas por especialidad
   */
  async getBySpecialty(especialidad: string): Promise<Appointment[]> {
    try {
      const response = await this.client.get('/', { params: { especialidad } });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching appointments by specialty:', error);
      throw error;
    }
  }

  /**
   * Obtener citas por fecha
   */
  async getByDate(fecha: string): Promise<Appointment[]> {
    try {
      const response = await this.client.get('/', { params: { fecha } });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching appointments by date:', error);
      throw error;
    }
  }

  /**
   * Obtener citas por paciente
   */
  async getByPatient(paciente: string): Promise<Appointment[]> {
    try {
      const response = await this.client.get('/', { params: { paciente } });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching appointments by patient:', error);
      throw error;
    }
  }
}

export const appointmentAPI = new AppointmentAPI();