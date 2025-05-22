import initDraw from "@/app/draw";
import { useEffect, useRef } from "react";

export default function Canvas({
    roomId,
    socket,
}: {
    roomId: string;
    socket: WebSocket;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(
        null
    ) as React.RefObject<HTMLCanvasElement>;

    useEffect(() => {
        if (!canvasRef.current) return;
        initDraw(canvasRef, roomId, socket);
    }, [canvasRef]);

    return (
        <div className="min-w-screen min-h-screen flex justify-center items-center relative">
            <canvas
                ref={canvasRef}
                height={"850px"}
                width={"1500px"}
                className="bg-gray-950 border-1 border-red-400/40 drop-shadow-lg drop-shadow-red-400/40 rounded-2xl"
            ></canvas>
            <div className="w-15 absolute left-0 ml-5 py-5 border border-orange-500 rounded-full shadow-lg shadow-orange-500/50 flex flex-col items-center justify-center gap-2">
                <button className="border border-cyan-600 px-2 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out">
                    ok
                </button>
                <button className="border border-cyan-600 px-2 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out">
                    ok
                </button>
                <button className="border border-cyan-600 px-2 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out">
                    ok
                </button>
            </div>
        </div>
    );
}
