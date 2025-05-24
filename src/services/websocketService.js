class WebSocketService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.ws = null;
        this.isConnected = false;
        this.callbacks = new Set();
        this.currentRoute = null;
        this.currentToken = null;
    }

    connectToRoute(route, token) {
        // Store for later use
        this.currentRoute = route;
        this.currentToken = token;
        const fullUrl = `${this.baseUrl}${route}`;

        // Close existing connection if any
        this.disconnect();

        // Create new connection
        console.log('Connecting to:', fullUrl);
        this.ws = new WebSocket(fullUrl);

        // Set up event handlers
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.isConnected = true;
            console.log('Sending auth message:', this.currentToken);
            this.sendAuthMessage(this.currentToken);
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.isConnected = false;
            this.ws = null;
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error details:', {
                error,
                url: fullUrl,
                readyState: this.ws ? this.ws.readyState : 'no websocket'
            });
        };

        this.ws.onmessage = (event) => {
            console.log('on message', event.data);
            console.log('on message type', typeof event.data);
            let data;
            if (typeof event.data !== 'string') {
                data = JSON.stringify(event.data);
                console.log('on message stringified', data);
            } else {
                data = event.data;
            }
            console.log('Message received:', data);
            this.callbacks.forEach(callback => callback(data));
        };
    }

    disconnect() {
        if (this.ws) {
            console.log('Closing WebSocket connection');
            this.ws.close();
            this.ws = null;
            this.isConnected = false;
        }
    }

    sendMessage(message) {
        console.log('Sending message:', message);

        if (!this.isConnected) {
            console.warn('Cannot send message: WebSocket not connected');
            return;
        }

        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }

        this.ws.send(message);
        console.log('Message sent:', message);
    }

    sendAuthMessage(token) {
        console.log('Sending auth message:', token);
        this.sendMessage({
            type: 'authenticate',
            token: token
        });
    }

    addMessageListener(callback) {
        this.callbacks.add(callback);
    }

    removeMessageListener(callback) {
        this.callbacks.delete(callback);
    }
}

// Export a base instance with just the base URL
export default new WebSocketService('wss://localhost:443/api/v1/note');
