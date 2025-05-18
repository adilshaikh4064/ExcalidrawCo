"use client";
import { useEffect, useRef } from "react";

const messages = [
    { id: 1, text: "Hey!" },
    { id: 2, text: "What's up?" },
    { id: 3, text: "All good, you?" },
    {
        id: 4,
        text: "Doing great! ajksdhfjksadh jhfkjs afhkjs dskjfhaskdjhf aksjdhfkja sdhfkjashdkjfhsadkjfh sfhkjas fhkjasdhfkjadsfshdfkasdhfksdjahfkjsdhfkjsdhfkj fdskjfhsdakjhfaksjdhf",
    },
    // Add more messages here
];

export default function ChatBox() {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        const token = userString ? JSON.parse(userString).token : null;
        if (!token) {
            return;
        }
        const socket = new WebSocket(`ws://localhost:8081?token=${token}`);
        socket.onopen = () => {
            console.log("WebSocket connection opened");
        };

        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
        }
    }, []);

    return (
        <div className="flex flex-col w-full h-full overflow-hidden rounded-b-lg">
            {/* Chat Messages */}
            <div
                className="flex-1 p-4 space-y-2.5 overflow-y-auto bg-transparent"
                ref={chatContainerRef}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="bg-red-600/50 px-4 py-1 rounded-lg shadow-lg shadow-red-400/60 w-fit max-w-[70%] text-sm font-semibold"
                    >
                        {msg.text}
                    </div>
                ))}

                <div className="bg-keep-100 dark:bg-keep-900 dark:shadow-keep-800 px-4 py-1 rounded-lg shadow-lg shadow-keep-400 w-fit max-w-[70%] text-sm font-semibold ml-auto">
                    hi there ! ahsdfjksdhf jahskdfhskdj hfkajsdhfksdj f
                    haskjdfhkajsdhf
                </div>
            </div>

            {/* Input Box */}
            <div className="flex gap-2 p-3 bg-transparent border-t-1 border-red-400/50">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-1 border border-red-400 rounded-lg outline-none hover:border-keep-900 hover:shadow-lg hover:shadow-red-400 dark:border-red-400/40 dark:hover:border-keep-800 dark:hover:shadow-keep-800 "
                />
                <button className="px-4 py-2 font-semibold bg-red-400 rounded-lg text-keep-900 hover:shadow-lg hover:border hover:shadow-red-400">
                    Send
                </button>
            </div>
        </div>
    );
}
