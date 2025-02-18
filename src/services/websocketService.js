class WebSocketService {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectTimeout = 1000; // Start with 1 second
        this.isConnected = false;
        this.messageCallbacks = new Set();
    }

    connect() {
        try {
            this.ws = new WebSocket(this.url);
            
            this.ws.onopen = () => {
                console.log('WebSocket Connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.reconnectTimeout = 1000;
            };

            this.ws.onclose = () => {
                console.log('WebSocket Disconnected');
                this.isConnected = false;
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

        } catch (error) {
            console.error('WebSocket Connection Error:', error);
            this.attemptReconnect();
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
                console.log(`Attempting to reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
                this.reconnectAttempts++;
                this.reconnectTimeout *= 2; // Exponential backoff
                this.connect();
            }, this.reconnectTimeout);
        }
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    onMessage(callback) {
        if (this.ws) {
            this.ws.onmessage = (event) => {
                callback(JSON.parse(event.data));
            };
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }

    addMessageListener(callback) {
        this.messageCallbacks.add(callback);
        if (this.ws) {
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.messageCallbacks.forEach(cb => cb(data));
            };
        }
    }

    removeMessageListener(callback) {
        this.messageCallbacks.delete(callback);
    }
}

export default new WebSocketService(import.meta.env.VITE_WS_URL || 'ws://localhost:3000/notes'); 