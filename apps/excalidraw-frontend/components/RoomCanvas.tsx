"use client";

import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(
            "ws://localhost:8081/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkaWxAZ21haWwuY29tIiwiaWQiOiI4YmVhYTcyYy0xOGVhLTQ3M2YtOTUxNy0zZDM0YzMyZmZjMjQiLCJpYXQiOjE3NDc5Mzk3MDYsImV4cCI6MTc0Nzk0MzMwNn0.Hp5IzEQr4ilQTEVG1Za5m2SL2GaRANAGDWN0et2CYQA"
        ); //FIXME: don't hardcode token

        ws.onopen = (e: Event) => {
            setSocket(ws);
            ws.send(
                JSON.stringify({
                    type: "join-room",
                    roomId: 8,
                })
            );
        };
    }, []);

    if (!socket) {
        return <div>connecting to web socket server.</div>;
    }

    return <Canvas roomId={roomId} socket={socket} />;
}
