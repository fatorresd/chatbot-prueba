import React, { useState, useEffect } from 'react';
import { useAppointments, type Appointment } from '../context/AppointmentsContext';
import '../styles/AppointmentEditDialog.css';

interface AppointmentEditDialogProps {
    isOpen: boolean;
    appointment: Appointment | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export const AppointmentEditDialog: React.FC<AppointmentEditDialogProps> = ({
    isOpen,
    appointment,
    onClose,
    onSuccess,
}) => {
    const { updateAppointment, isLoading } = useAppointments();
    const [error, setError] = useState('');
    
    // Usar el tipo Appointment directamente, omitiendo id, createdAt y updatedAt
    const [formData, setFormData] = useState<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>({
        paciente: '',
        especialidad: '',
        fecha: '',
        hora: '',
        doctor: '',
        notas: '',
        estado: 'pendiente',
    });

    useEffect(() => {
        if (appointment) {
            setFormData({
                paciente: appointment.paciente,
                especialidad: appointment.especialidad,
                fecha: appointment.fecha,
                hora: appointment.hora,
                doctor: appointment.doctor,
                notas: appointment.notas || '',
                estado: appointment.estado,
            });
            setError('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointment?.id, isOpen]);

const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!appointment) return;

    try {
        await updateAppointment(appointment.id, {
        paciente: formData.paciente,
        especialidad: formData.especialidad,
        fecha: formData.fecha,
        hora: formData.hora,
        doctor: formData.doctor,
        notas: formData.notas,
        estado: formData.estado,
    });

        onSuccess?.();
        onClose();
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al actualizar la cita');
    }
};

if (!isOpen || !appointment) return null;

return (
    <div className="dialog-overlay" onClick={onClose}>
        <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
            <h2>Editar Cita Médica</h2>
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
                required
                disabled={isLoading}
            />
        </div>

        <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                disabled={isLoading}
            >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
                <option value="completada">Completada</option>
            </select>
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
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
            </form>
        </div>
    </div>
    );
};