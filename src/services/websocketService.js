class WebSocketService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectTimeout = 1000; // Start with 1 second
        this.isConnected = false;
        this.messageCallbacks = new Map(); // Changed to Map to store callbacks per route
        this.currentRoute = null;
    }

    // connectToRoute(route, token) {
    connectToRoute(route) {
        if (this.currentRoute === null){
            // this.currentRoute = `${this.baseUrl}${route}?token=${token}`;
            this.currentRoute = `${this.baseUrl}${route}`;
        }

        
        console.log('Attempting to connect to:', this.currentRoute);

        
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('Closing existing connection');
            this.ws.close();
        }
        
        try {
            this.ws = new WebSocket(this.currentRoute);
            console.log('New WebSocket instance created');
            this.ws.onopen = () => {
                console.log(`WebSocket Connected to ${route}`);
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

            this.ws.onmessage = (event) => {
                console.log('Received message');
                const data = JSON.parse(event.data);
                const callbacks = this.messageCallbacks.get(this.currentRoute) || new Set();
                callbacks.forEach(cb => cb(data));
            };

        } catch (error) {
            console.error('WebSocket Connection Error:', error);
            this.attemptReconnect();
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.currentRoute) {
            setTimeout(() => {
                console.log(`Attempting to reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
                this.reconnectAttempts++;
                this.reconnectTimeout *= 2; // Exponential backoff
                this.connectToRoute(this.currentRoute);
            }, this.reconnectTimeout);
        }
    }

    sendMessage(message) {
        console.log('Sending message fnc', this.ws, this.ws.readyState);
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
        if (!this.currentRoute) return;
        
        if (!this.messageCallbacks.has(this.currentRoute)) {
            this.messageCallbacks.set(this.currentRoute, new Set());
        }
        this.messageCallbacks.get(this.currentRoute).add(callback);
    }

    removeMessageListener(callback) {
        if (!this.currentRoute) return;
        
        const callbacks = this.messageCallbacks.get(this.currentRoute);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }
}

// Export a base instance with just the base URL
export default new WebSocketService('wss://localhost:443/api/v1/note'); 