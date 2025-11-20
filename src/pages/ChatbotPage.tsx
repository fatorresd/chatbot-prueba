import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { AppointmentDialog } from '../components/AppointmentDialog';
import { useAppointments } from '../context/AppointmentsContext';
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
      text: '¡Hola! Soy tu asistente médico. Puedo ayudarte a:\n• Agendar una cita médica\n• Ver tus citas actuales\n• Modificar una cita existente\n• Cancelar una cita\n\n¿Qué te gustaría hacer?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { appointments, fetchAppointments } = useAppointments();
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

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
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

    // Procesar el mensaje y generar respuesta
    setTimeout(() => {
      let botResponse = '';
      let action: Message['action'] = undefined;
      const userText = messageToProcess.toLowerCase();

      if (
        userText.includes('agendar') ||
        userText.includes('nueva cita') ||
        userText.includes('cita nueva')
      ) {
        botResponse =
          'Perfecto, voy a ayudarte a agendar una nueva cita médica. Haz clic en el botón "Agendar Cita" para completar el formulario.';
        action = { type: 'create_appointment' };
      } else if (
        userText.includes('ver') ||
        userText.includes('citas') ||
        userText.includes('mis citas')
      ) {
        const appointmentList =
          appointments.length > 0
            ? `Tienes ${appointments.length} cita(s) agendada(s):\n\n${appointments
                .map((apt) => `📅 ${apt.fecha} a las ${apt.hora}\n👨‍⚕️ ${apt.doctor}\n🏥 ${apt.especialidad}`)
                .join('\n\n')}`
            : 'No tienes citas agendadas en este momento.';
        botResponse = appointmentList;
        action = { type: 'view_appointments' };
      } else if (userText.includes('ayuda') || userText.includes('qué puedes')) {
        botResponse = `Soy tu asistente médico. Puedo ayudarte a:\n\n• Agendar: Puedo ayudarte a reservar una nueva cita\n• Ver mis citas: Consulta todas tus citas programadas\n• Modificar: Cambiar la fecha u hora de una cita\n• Cancelar: Eliminar una cita si es necesario\n\n¿Qué necesitas? 😊`;
      } else if (userText.includes('modificar') || userText.includes('cambiar')) {
        botResponse =
          'Para modificar una cita, necesito que me digas: ¿Cuál es la fecha de la cita que deseas cambiar? O puedes decirme el nombre del doctor.';
      } else if (userText.includes('cancelar') || userText.includes('eliminar')) {
        botResponse =
          'Para cancelar una cita, necesito más información. ¿Cuál es la fecha de la cita que deseas cancelar?';
      } else {
        botResponse =
          'He entendido tu mensaje. Para mejor asistencia, puedo ayudarte con: agendar citas, ver tus citas actuales, modificarlas o cancelarlas. ¿Cuál de estas opciones te interesa? 😊';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        action,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
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
                handleSendMessage(e);
              }
            }}
            placeholder="Escribe tu mensaje aquí..."
            className="message-input"
            disabled={isLoading}
            rows={1}
          />
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
    </div>
  );
};