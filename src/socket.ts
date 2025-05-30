import { io, Socket } from "socket.io-client";
const SOCKET_SERVER_URL = import.meta.env.VITE_API_SOCKET_SERVER_URL;
let socket: Socket | null = null;

export async function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export function connectSocketPromise(retryCount = 100, retryDelay = 3000): Promise<Socket> {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        function tryConnect() {
            if (socket) {
                socket.disconnect();
            }
            console.log("Connecting to socket server:", SOCKET_SERVER_URL);
            socket = io(SOCKET_SERVER_URL, {
                auth: async (cb) => {
                    const token = localStorage.getItem("token");
                    cb({ token });
                },
                transports: ["websocket"],
            });

            socket.on("connect", () => {
                console.log("Socket connected777:", socket?.id);
                resolve(socket!);
            });
            socket.on("connect_error", (err) => {
                attempts++;
                if (attempts < retryCount) {
                    console.warn(`Socket connect error, retrying in ${retryDelay}ms... (attempt ${attempts})`);
                    setTimeout(tryConnect, retryDelay);
                } else {
                    reject(err);
                }
            });
            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });
            socket.on("notification", (data) => {
                console.log("Received your_event:", data);
            });
        }
        tryConnect();
    });
}
