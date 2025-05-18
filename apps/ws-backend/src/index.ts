import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "@repo/backend-common/config";
import prismaClient from "@repo/db/client";

const jwtSecret = config.JWT_SECRET;

const wss = new WebSocketServer(
    {
        port: 8081,
        host: "localhost",
        clientTracking: true,
    },
    function () {
        console.log("server is listening on: ws://localhost:8081/");
    }
);

interface User {
    ws: WebSocket;
    rooms: string[];
    userId: string;
}
const users: User[] = [];

wss.on("connection", (ws, request) => {
    // const cookieHeader = request.headers.cookie;
    // if (!cookieHeader) {
    //     ws.send("Unauthorised, no cookies found.");
    //     ws.close();
    //     return;
    // }
    // const cookies = Object.fromEntries(
    //     cookieHeader.split(";").map((c) => c.trim().split("="))
    // );
    // const token = cookies.token;
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const token = url.searchParams.get("token");
    if (!token) {
        ws.send("Unaothorised, token missing.");
        ws.close();
        return;
    }
    let user: JwtPayload | null = null;
    try {
        const payload = jwt.verify(token, jwtSecret) as JwtPayload;
        if (!payload || typeof payload !== "object" || !("id" in payload)) {
            ws.send("Unauthorised, missing required fields.");
            ws.close();
            return;
        }
        ws.send(
            JSON.stringify({
                message: "User authorised and connected to server.",
                user: payload,
            })
        );
        user = payload;
    } catch (err) {
        ws.send(
            JSON.stringify({
                message: "Unauthorised, invalid token.",
                error: err instanceof Error ? err.message : "Unknown error",
            })
        );
    }

    if (user) {
        users.push({
            userId: user.id,
            rooms: [],
            ws,
        });
    }

    ws.on("message", async function (data) {
        let parsedData;
        if (typeof data !== "string") {
            parsedData = JSON.parse(data.toString());
        } else {
            parsedData = JSON.parse(data);
        }

        if (parsedData.type === "join-room") {
            const user = users.find((user) => user.ws === ws);
            user?.rooms.push(parsedData.roomId);
            ws.send(`joined room: ${parsedData.roomId}`);
        }
        if (parsedData.type === "leave-room") {
            const user = users.find((user) => user.ws === ws);
            if (!user) {
                return;
            }
            user.rooms = user.rooms.filter((id) => id === parsedData.roomId);
            ws.send(`left room: ${parsedData.roomId}`);
        }
        if (parsedData.type === "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            const newChat = await prismaClient.chat.create({
                data: {
                    roomId: Number(roomId),
                    userId: user!.id,
                    message,
                },
            });

            users.forEach((user) => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(
                        JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId,
                        })
                    );
                }
            });
        }
    });

    ws.on("close", () => {
        console.log("client disconnected");
    });
});
