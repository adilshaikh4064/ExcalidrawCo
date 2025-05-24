import axios from "axios";

type Shape =
    | { type: "rect"; x: number; y: number; width: number; height: number }
    | { type: "cir"; centerX: number; centerY: number; radius: number };

export default async function initDraw(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#fff";
    let existingShape: Shape[] = await getExistingShapes(roomId);
    renderCanvas(ctx, existingShape, canvas);

    socket.onmessage = (e: MessageEvent) => {
        const parsedData = JSON.parse(e.data);

        if (parsedData.type === "chat") {
            const parsedShape = parsedData.message;
            existingShape.push(parsedShape);
            renderCanvas(ctx, existingShape, canvas);
        }
    };

    let startX = 0;
    let startY = 0;
    let clicked = false;
    const rect = canvas.getBoundingClientRect();
    const getMousePos = (e: MouseEvent) => ({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    });

    const handleMouseDown = (e: MouseEvent) => {
        clicked = true;
        const pos = getMousePos(e);
        startX = pos.x;
        startY = pos.y;
    };
    const handleMouseMove = (e: MouseEvent) => {
        if (!clicked) return;
        const pos = getMousePos(e);
        let w = pos.x - startX;
        let h = pos.y - startY;
        renderCanvas(ctx, existingShape, canvas);
        ctx.strokeRect(startX, startY, w, h);
    };
    const handleMouseUp = (e: MouseEvent) => {
        clicked = false;
        const pos = getMousePos(e);
        let w = pos.x - startX;
        let h = pos.y - startY;
        if (Math.abs(h) <= 5 && Math.abs(w) <= 5) return;
        const shape: Shape = {
            type: "rect",
            x: startX,
            y: startY,
            width: w,
            height: h,
        };
        existingShape.push(shape);

        socket.send(
            JSON.stringify({
                type: "chat",
                message: shape,
                roomId: 8,
            })
        );
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
    };
}

function renderCanvas(
    ctx: CanvasRenderingContext2D,
    existingShape: Shape[],
    canvas: HTMLCanvasElement
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    existingShape.forEach((shape: Shape) => {
        if (shape.type === "rect")
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    });
}

async function getExistingShapes(roomId: string) {
    // try {
    //     const response = await axios.get("http://localhost:3001/chat/8", {
    //         headers: {
    //             Authorization: `Bearer ${"hardcoded token value for testing"}`, //FIXME: include token afterward
    //         },
    //     });
    //     if (response.status === 200) {
    //         const chats = response.data.messages;
    //         const shapes = chats.map((x: any) => {
    //             const shape = JSON.parse(x.message);
    //             return shape;
    //         });
    //         return shapes;
    //     } else {
    //         return "An error occured while getting shapes.";
    //     }
    // } catch (err) {
    //     if (axios.isAxiosError(err)) {
    //         return err.response?.data?.message;
    //     }
    //     return null;
    // } finally {
    //     return "this is the final block , meaning request not handled.";
    // }
    const response = await axios.get("http://localhost:3001/chat/8", {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkaWxAZ21haWwuY29tIiwiaWQiOiI4YmVhYTcyYy0xOGVhLTQ3M2YtOTUxNy0zZDM0YzMyZmZjMjQiLCJpYXQiOjE3NDgwMTI1MjAsImV4cCI6MTc0ODA1NTcyMH0.tVh6jU4wmrZlvurfpz-GuEu4YuqxyRkXcJS6RwGhPi4`,
        },
    });

    const chats = response.data.messages;
    const shapes = chats.map((chat: any) => {
        const shape = JSON.parse(chat.message);
        return shape;
    });
    return shapes;
}
