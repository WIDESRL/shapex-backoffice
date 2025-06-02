import { io, Socket } from "socket.io-client";
const SOCKET_SERVER_URL = import.meta.env.VITE_API_SOCKET_SERVER_URL;
let socket: Socket | null = null;

export function getSocket(): Socket | null {
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export function forceReconnect() {
    if (socket) {
        socket.disconnect();
        socket.connect();
    }
}

export function initSocket(): Promise<Socket> {
    return new Promise((resolve, reject) => {
        if (socket) {
            if (socket.connected) {
                return resolve(socket);
            }
            socket.once('connect', () => resolve(socket!));
            socket.once('connect_error', reject);
            return;
        }
        socket = io(SOCKET_SERVER_URL, {
            auth: (cb) => {
                const token = localStorage.getItem("token");
                cb({ token });
            },
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 1000,
            reconnectionDelay: 3000,
        });
        socket.on("connect", () => {
            console.log("Socket connected:", socket?.id);
            resolve(socket!);
        });
        socket.on("connect_error", (err) => {
            reject(err);
        });
        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
    });
}
