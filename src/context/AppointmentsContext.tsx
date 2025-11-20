import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { appointmentAPI } from '../services/appointmentAPI';
import type {
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from '../services/appointmentAPI';


interface AppointmentsContextType {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  createAppointment: (data: CreateAppointmentDTO) => Promise<Appointment>;
  updateAppointment: (id: string, updates: UpdateAppointmentDTO) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  getAppointmentById: (id: string) => Promise<Appointment>;
  searchAppointments: (filters: {
    doctor?: string;
    especialidad?: string;
    fecha?: string;
    paciente?: string;
  }) => Promise<void>;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export const AppointmentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentAPI.getAll();
      setAppointments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar las citas';
      setError(message);
      console.error('Error fetching appointments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAppointment = useCallback(async (data: CreateAppointmentDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAppointment = await appointmentAPI.create(data);
      setAppointments((prev) => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear la cita';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAppointment = useCallback(async (id: string, updates: UpdateAppointmentDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedAppointment = await appointmentAPI.update(id, updates);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? updatedAppointment : apt))
      );
      return updatedAppointment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar la cita';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAppointment = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await appointmentAPI.delete(id);
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar la cita';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAppointmentById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const appointment = await appointmentAPI.getById(id);
      return appointment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener la cita';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchAppointments = useCallback(
    async (filters: {
      doctor?: string;
      especialidad?: string;
      fecha?: string;
      paciente?: string;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await appointmentAPI.getAll(filters);
        setAppointments(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al buscar citas';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const value: AppointmentsContextType = {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentById,
    searchAppointments,
  };

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppointments = (): AppointmentsContextType => {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error('useAppointments debe ser usado dentro de AppointmentsProvider');
  }
  return context;
};