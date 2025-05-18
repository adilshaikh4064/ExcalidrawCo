"use client";

import ChatBox from "./ChatBox";
import ChatNav from "./ChatNav";

export interface Room {
    id: string;
    slug: string;
    adminId: string;
    createdAt: string;
}

interface ChatIF {
    room: Room;
    onClick: () => void;
}

export default function Chat(props: ChatIF) {
    return (
        <div className="w-full h-full rounded-t-4xl rounded-b-2xl">
            <ChatNav
                roomId={props.room.id}
                roomSlug={props.room.slug}
                onClick={props.onClick}
            />
            <div className="h-[93%] w-full rounded-b-lg">
                <ChatBox />
            </div>
        </div>
    );
}
