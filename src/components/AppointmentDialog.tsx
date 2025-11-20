import React, { useState } from 'react';
import { useAppointments } from '../context/AppointmentsContext';
import '../styles/AppointmentDialog.css';

interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createAppointment, isLoading } = useAppointments();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    paciente: '',
    especialidad: '',
    fecha: '',
    hora: '',
    doctor: '',
    notas: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createAppointment({
        paciente: formData.paciente,
        especialidad: formData.especialidad,
        fecha: formData.fecha,
        hora: formData.hora,
        doctor: formData.doctor,
        notas: formData.notas,
      });

      setFormData({
        paciente: '',
        especialidad: '',
        fecha: '',
        hora: '',
        doctor: '',
        notas: '',
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cita');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Agendar Nueva Cita</h2>
          <button className="dialog-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label htmlFor="paciente">Nombre del Paciente</label>
            <input
              id="paciente"
              name="paciente"
              type="text"
              value={formData.paciente}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="especialidad">Especialidad</label>
            <select
              id="especialidad"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="">Seleccionar especialidad</option>
              <option value="Cardiología">Cardiología</option>
              <option value="Dermatología">Dermatología</option>
              <option value="Oftalmología">Oftalmología</option>
              <option value="Neurología">Neurología</option>
              <option value="General">General</option>
              <option value="Pediatría">Pediatría</option>
              <option value="Cirugía">Cirugía</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hora">Hora</label>
              <input
                id="hora"
                name="hora"
                type="time"
                value={formData.hora}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="doctor">Médico</label>
            <input
              id="doctor"
              name="doctor"
              type="text"
              value={formData.doctor}
              onChange={handleChange}
              placeholder="Dr. García"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notas">Notas (opcional)</label>
            <textarea
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              placeholder="Motivo de la consulta..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="dialog-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Agendando...' : 'Agendar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};