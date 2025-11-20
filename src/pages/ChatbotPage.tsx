import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import '../styles/ChatbotPage.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente médico. Estoy aquí para ayudarte a agendar tu cita médica. ¿Cuál es el motivo de tu consulta?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSendMessage = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    // Simular respuesta del bot basada en el contexto médico
    setTimeout(() => {
      let botResponse = '';

      const userText = input.toLowerCase();

      if (userText.includes('dolor') || userText.includes('enfermedad')) {
        botResponse =
          'Entiendo que necesitas atención médica. ¿Cuántos días llevas con estos síntomas? Esto me ayudará a encontrar la especialidad adecuada.';
      } else if (userText.includes('cita') || userText.includes('hora')) {
        botResponse =
          'Perfecto, voy a ayudarte a agendar una cita. ¿Prefieres una cita presencial o virtual? También necesito saber tu disponibilidad preferida.';
      } else if (userText.includes('especialista') || userText.includes('doctor')) {
        botResponse =
          'Tenemos disponibles varios especialistas. ¿Podrías decirme qué tipo de especialidad necesitas? (Ejemplo: Cardiología, Dermatología, General, etc.)';
      } else if (userText.includes('horario') || userText.includes('disponibilidad')) {
        botResponse =
          'Excelente. Tenemos disponibilidad los días de semana de 09:00 a 18:00. ¿Qué día te vendría bien?';
      } else {
        botResponse =
          'Gracias por tu respuesta. Para continuar con tu cita médica, ¿hay algo más que debas mencionar de tu situación?';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="chatbot-container">
      <Navbar />

      <div className="chatbot-main">
        <div className="chatbot-header">
          <h1>Asistente Médico</h1>
          <p>Agenda tu cita médica de forma rápida y sencilla</p>
        </div>

        <div className="messages-container">
          {messages.length === 1 && !isLoading && (
            <div className="welcome-message">
              <div className="welcome-card">
                <div className="welcome-icon">👨‍⚕️</div>
                <h2>Bienvenido</h2>
                <p>
                  Te ayudaré a agendar tu cita médica. Responde mis preguntas y
                  encontraré la mejor opción para ti.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {message.sender === 'bot' && (
                <div className="message-avatar bot-avatar">🤖</div>
              )}
              <div>
                <div className="message-content">
                  <p>{message.text}</p>
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
    </div>
  );
};