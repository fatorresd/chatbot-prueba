import axios, { type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ChatResponse {
    success: boolean;
    response: string;
    intent?: 'create' | 'view' | 'update' | 'delete' | 'search' | 'help' | 'unknown';
    action?: string;
    data?: Record<string, string>;
    error?: string;
    }

    class ChatAPI {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
        baseURL: `${API_BASE_URL}/chat`,
        headers: {
            'Content-Type': 'application/json',
        },
        });

        this.client.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error('Chat API Error:', error.response?.data || error.message);
            throw error;
        }
        );
    }

    /**
     * Enviar mensaje al chatbot con OpenAI
     */
    async sendMessage(message: string): Promise<ChatResponse> {
        try {
        const response = await this.client.post('/', { message });
        return response.data;
        } catch (error) {
        console.error('Error sending message:', error);
        throw error;
        }
    }
    }

export const chatAPI = new ChatAPI();