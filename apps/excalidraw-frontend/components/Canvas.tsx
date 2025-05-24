import initDraw from "@/app/draw";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { Game } from "@/app/draw/game";

export type Tool = "cir" | "pen" | "rect";

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
    const [game, setGame] = useState<Game>();
    const [active, setActive] = useState<Tool>("cir");
    // const hasInitialised = useRef<boolean>(false);

    useEffect(() => {
        game?.selectTool(active);
    }, [active, game]);

    useEffect(() => {
        // if (hasInitialised.current || !canvasRef.current) return;
        // alert("canvas is getting created.");
        // hasInitialised.current = true;
        // let canvas = canvasRef.current;
        // initDraw(canvas, roomId, socket);
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            };
        }
    }, [canvasRef]);

    return (
        <div className="w-screen h-screen">
            <canvas
                ref={canvasRef}
                height={window.innerHeight}
                width={window.innerWidth}
                className="bg-gray-950"
            ></canvas>
            <TopBar active={active} setActive={setActive} />
        </div>
    );
}

function TopBar({
    active,
    setActive,
}: {
    active: Tool;
    setActive: (t: Tool) => void;
}) {
    return (
        <div className="w-15 fixed left-[2%] top-[45%] py-5 border border-orange-500 rounded-full shadow-lg shadow-orange-500/50 flex flex-col items-center justify-center gap-2">
            <Button
                name="rect"
                onclick={() => {
                    setActive("rect");
                }}
                isActive={active === "rect"}
            />
            <Button
                name="pen"
                onclick={() => {
                    setActive("pen");
                }}
                isActive={active === "pen"}
            />
            <Button
                name="cir"
                onclick={() => {
                    setActive("cir");
                }}
                isActive={active === "cir"}
            />
        </div>
    );
}
