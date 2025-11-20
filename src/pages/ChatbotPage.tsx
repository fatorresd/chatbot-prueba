import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { AppointmentDialog } from '../components/AppointmentDialog';
import { AppointmentEditDialog } from '../components/AppointmentEditDialog';
import { useAppointments, type Appointment } from '../context/AppointmentsContext';
import { chatAPI } from '../services/chatAPI';
import '../styles/ChatbotPage.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  action?: {
    type: 'create_appointment' | 'view_appointments' | 'confirm_action';
    data?: Record<string, string>;
  };
}

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente médico. Puedo ayudarte a:\n• Agendar una cita médica\n• Ver tus citas actuales\n• Editar o cancelar citas\n\n¿Qué te gustaría hacer?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { appointments, fetchAppointments, deleteAppointment } = useAppointments();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

    const handleRefresh = async () => {
      setIsLoading(true);
      try {
        await fetchAppointments();
        const refreshMessage: Message = {
          id: Date.now().toString(),
          text: '✅ Lista de citas actualizada correctamente.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, refreshMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: '❌ Error al actualizar las citas. Intenta nuevamente.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };

  const handleDialogSuccess = () => {
    const successMessage: Message = {
      id: Date.now().toString(),
      text: '✅ ¡Cita agendada exitosamente! Tu nueva cita ha sido registrada en el sistema.',
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, successMessage]);
    fetchAppointments();
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    const messageToProcess = input;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToProcess,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    try {
      // Llamar a OpenAI a través del backend
      const result = await chatAPI.sendMessage(messageToProcess);

      let action: Message['action'] = undefined;

      // Determinar la acción según la intención
      if (result.intent === 'create') {
        action = { type: 'create_appointment', data: result.data };
      } else if (result.intent === 'view') {
        action = { type: 'view_appointments' };
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        sender: 'bot',
        timestamp: new Date(),
        action,
      };
      

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ Perdón, hubo un error procesando tu mensaje. Intenta nuevamente.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
    
  };

  return (
    <div className="chatbot-container">
      <Navbar />

      <div className="chatbot-main">
        <div className="chatbot-header">
          <h1>🏥 Asistente Médico</h1>
          <p>Agenda y gestiona tus citas médicas</p>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.sender === 'bot' && (
                  <div className="message-avatar bot-avatar">🤖</div>
                )}
                <div>
                  <div className="message-content">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString('es-CL', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="message-avatar user-avatar">👤</div>
                )}
              </div>

              {message.action?.type === 'create_appointment' && !showDialog && (
                <div className="message-actions">
                  <button className="action-button" onClick={handleOpenDialog}>
                    📅 Agendar Cita
                  </button>
                </div>
              )}

              {message.action?.type === 'view_appointments' && appointments.length > 0 && (
                <div className="appointments-list">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="appointment-card">
                      <div className="appointment-header">
                        <span className="appointment-date">{apt.fecha}</span>
                        <span className="appointment-time">{apt.hora}</span>
                      </div>
                      <div className="appointment-body">
                        <p>
                          <strong>👨‍⚕️</strong> {apt.doctor}
                        </p>
                        <p>
                          <strong>🏥</strong> {apt.especialidad}
                        </p>
                        <p>
                          <strong>👤</strong> {apt.paciente}
                        </p>
                        {apt.notas && (
                          <p>
                            <strong>📝</strong> {apt.notas}
                          </p>
                        )}
                      </div>
                      <div className="appointment-footer">
                        <span className={`status ${apt.estado}`}>{apt.estado}</span>
                        <div className="appointment-actions">
                          <button
                            className="btn-edit"
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setShowEditDialog(true);
                            }}
                            title="Editar cita"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn-delete"
                            onClick={async () => {
                              if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
                                try {
                                  await deleteAppointment(apt.id);
                                  const deleteMessage: Message = {
                                    id: Date.now().toString(),
                                    text: `✅ Cita del ${apt.fecha} a las ${apt.hora} con ${apt.doctor} ha sido cancelada.`,
                                    sender: 'bot',
                                    timestamp: new Date(),
                                  };
                                  setMessages((prev) => [...prev, deleteMessage]);
                                } catch (err) {
                                  const errorMessage: Message = {
                                    id: Date.now().toString(),
                                    text: '❌ Error al cancelar la cita. Intenta nuevamente.',
                                    sender: 'bot',
                                    timestamp: new Date(),
                                  };
                                  setMessages((prev) => [...prev, errorMessage]);
                                }
                              }
                            }}
                            title="Cancelar cita"
                          >
                            🗑️ Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="message bot-message">
              <div className="message-avatar bot-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="message-input-form">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as any);
              }
            }}
            placeholder="Escribe tu mensaje aquí... (Ej: Quiero agendar una cita de cardiología para el 2024-12-25 a las 14:30)"
            className="message-input"
            disabled={isLoading}
            rows={1}
          />
          <button 
            type="button"
            className="refresh-button" 
            onClick={handleRefresh}
            disabled={isLoading}
            title="Actualizar citas"
          >
            {isLoading ? '⏳' : '🔄'}
          </button>
          <button
            type="submit"
            className="send-button"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </form>
      </div>

      <AppointmentDialog
        isOpen={showDialog}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
      />

      <AppointmentEditDialog
        isOpen={showEditDialog}
        appointment={selectedAppointment}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedAppointment(null);
        }}
        onSuccess={() => {
          const editMessage: Message = {
            id: Date.now().toString(),
            text: '✅ Cita actualizada exitosamente.',
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, editMessage]);
          fetchAppointments();
        }}
      />
    </div>
  );
};