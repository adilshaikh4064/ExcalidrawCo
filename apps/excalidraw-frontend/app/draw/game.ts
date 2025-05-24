import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
    | { type: "rect"; x: number; y: number; width: number; height: number }
    | { type: "cir"; centerX: number; centerY: number; radius: number };

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private clicked: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private selectedTool: Tool = "cir";

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.init();
        this.roomId = roomId;
        this.renderCanvas();
        this.socket = socket;
        this.initHandler();
        this.initMouseEventHandler();
    }

    selectTool(tool: Tool) {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.ctx.strokeStyle = "#fff";
        this.renderCanvas();
    }

    renderCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.existingShapes.forEach((shape: Shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeRect(
                    shape.x,
                    shape.y,
                    shape.width,
                    shape.height
                );
            } else if (shape.type === "cir") {
                this.ctx.beginPath();
                this.ctx.arc(
                    shape.centerX,
                    shape.centerY,
                    Math.abs(shape.radius),
                    0,
                    Math.PI * 2
                );
                this.ctx.stroke();
                this.ctx.closePath();
            }
        });
    }

    initHandler() {
        this.socket.onmessage = (e: MessageEvent) => {
            const parsedData = JSON.parse(e.data);

            if (parsedData.type === "chat") {
                const parsedShape = parsedData.message;
                this.existingShapes.push(parsedShape);
                this.renderCanvas();
            }
        };
    }

    handleMouseDown = (e: MouseEvent) => {
        this.clicked = true;
        const pos = this.getMousePos(e);
        this.startX = pos.x;
        this.startY = pos.y;
    };

    handleMouseMove = (e: MouseEvent) => {
        if (!this.clicked) return;
        const pos = this.getMousePos(e);
        let w = pos.x - this.startX;
        let h = pos.y - this.startY;
        this.renderCanvas();
        const selectedTool = this.selectedTool;
        if (selectedTool === "rect") {
            this.ctx.strokeRect(this.startX, this.startY, w, h);
        } else if (selectedTool === "cir") {
            const radius = Math.sqrt(w * w + h * h) / 2;
            const centerX = this.startX + w / 2;
            const centerY = this.startY + h / 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    };

    handleMouseUp = (e: MouseEvent) => {
        this.clicked = false;
        const pos = this.getMousePos(e);
        let w = pos.x - this.startX;
        let h = pos.y - this.startY;
        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width: w,
                height: h,
            };
        } else if (selectedTool === "cir") {
            const radius = Math.sqrt(w * w + h * h) / 2;
            shape = {
                type: "cir",
                centerX: this.startX + w / 2,
                centerY: this.startY + h / 2,
                radius: radius,
            };
        }
        if (!shape) return;
        this.existingShapes.push(shape);

        this.socket.send(
            JSON.stringify({
                type: "chat",
                message: shape,
                roomId: 8,
            })
        );
    };

    private boundMouseDown = this.handleMouseDown.bind(this);
    private boundMouseMove = this.handleMouseMove.bind(this);
    private boundMouseUp = this.handleMouseUp.bind(this);

    getMousePos = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };
    initMouseEventHandler() {
        this.canvas.addEventListener("mousedown", this.boundMouseDown);
        this.canvas.addEventListener("mousemove", this.boundMouseMove);
        this.canvas.addEventListener("mouseup", this.boundMouseUp);
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.boundMouseDown);
        this.canvas.removeEventListener("mousemove", this.boundMouseMove);
        this.canvas.removeEventListener("mouseup", this.boundMouseUp);
    }
}

// export class Name {
//     private canvas: HTMLCanvasElement;
//     private ctx: CanvasRenderingContext2D;
//     private roomId: string;
//     socket: WebSocket;

//     private existingShapes: Shape[];
//     private startX: number = 0;
//     private startY: number = 0;
//     private clicked: boolean = false;

//     private selectedTool: Tool = "cir";

//     constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
//         this.canvas = canvas;
//         this.ctx = this.canvas.getContext("2d")!;
//         this.roomId = roomId;
//         this.socket = socket;
//         this.init();

//         this.existingShapes = [];
//         this.socket = socket;
//         this.initHandler();

//         this.initMouseEventsHandler();
//     }

//     async init() {
//         this.existingShapes = await getExistingShapes(this.roomId);
//         this.ctx.strokeStyle = "#fff";
//         this.renderCanvas();
//     }

//     renderCanvas() {
//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.existingShapes.forEach((shape) => {
//             if (shape.type === "cir") {
//                 this.ctx.beginPath();
//                 this.ctx.arc(
//                     shape.centerX,
//                     shape.centerY,
//                     shape.radius,
//                     0,
//                     Math.PI * 2
//                 );
//                 this.ctx.closePath();
//                 this.ctx.stroke();
//             } else if (shape.type === "rect") {
//                 this.ctx.strokeRect(
//                     shape.x,
//                     shape.y,
//                     shape.width,
//                     shape.height
//                 );
//             }
//         });
//     }

//     initHandler() {
//         this.socket.onmessage = (e: MessageEvent) => {
//             const parsedMessage = JSON.parse(e.data);
//             if (parsedMessage.type === "chat") {
//                 const parsedShape = parsedMessage.message;
//                 this.existingShapes.push(parsedShape);
//                 this.renderCanvas();
//             }
//         };
//     }

//     getMousePos = (e: MouseEvent) => {
//         const rect = this.canvas.getBoundingClientRect();
//         return {
//             x: e.clientX - rect.left,
//             y: e.clientY - rect.top,
//         };
//     };

//     selectTool(tool: Tool) {
//         this.selectedTool = tool;
//     }

//     destructor() {
//         this.canvas.removeEventListener(
//             "mousedown",
//             this.handleMouseDown.bind(this)
//         );
//         this.canvas.removeEventListener(
//             "mousemove",
//             this.handleMouseDown.bind(this)
//         );
//         this.canvas.removeEventListener(
//             "mouseup",
//             this.handleMouseUp.bind(this)
//         );
//     }

//     handleMouseDown = (e: MouseEvent) => {
//         this.clicked = true;
//         const pos = this.getMousePos(e);
//         this.startX = pos.x;
//         this.startY = pos.y;
//     };
//     handleMouseMove = (e: MouseEvent) => {
//         if (!this.clicked) return;
//         const pos = this.getMousePos(e);
//         const width = pos.x - this.startX;
//         const height = pos.y - this.startY;
//         this.renderCanvas();

//         const selectedTool = this.selectedTool;
//         if (selectedTool === "cir") {
//             const radius = Math.sqrt(width * width + height * height) / 2;
//             const centerX = this.startX + width / 2;
//             const centerY = this.startY + height / 2;
//             this.ctx.beginPath();
//             this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
//             this.ctx.stroke();
//             this.ctx.closePath();
//         } else if (selectedTool === "rect") {
//             this.ctx.strokeRect(this.startX, this.startY, width, height);
//         }
//     };
//     handleMouseUp = (e: MouseEvent) => {
//         this.clicked = false;
//         const pos = this.getMousePos(e);
//         const width = pos.x - this.startX;
//         const height = pos.y - this.startY;

//         const selectedTool = this.selectedTool;
//         let shape: Shape | null = null;
//         if (selectedTool === "cir") {
//             shape = {
//                 type: "cir",
//                 centerX: this.startX + width / 2,
//                 centerY: this.startY + height / 2,
//                 radius: Math.sqrt(width * width + height * height) / 2,
//             };
//         } else if (selectedTool === "rect") {
//             shape = {
//                 type: "rect",
//                 x: this.startX,
//                 y: this.startY,
//                 width: width,
//                 height: height,
//             };
//         }
//         if (!shape) return;
//         this.existingShapes.push(shape);

//         this.socket.send(
//             JSON.stringify({
//                 type: "chat",
//                 message: shape,
//                 roomId: 8,
//             })
//         );
//     };

//     initMouseEventsHandler() {
//         this.canvas.addEventListener(
//             "mousedown",
//             this.handleMouseDown.bind(this)
//         );
//         this.canvas.addEventListener(
//             "mousemove",
//             this.handleMouseMove.bind(this)
//         );
//         this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
//     }
// }
