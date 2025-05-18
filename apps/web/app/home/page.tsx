"use client";

import { useState } from "react";
import Animation from "../../components/Animation";
import InputBox from "../../components/InputBox";
import LargeButton from "../../components/LargeButton";
import Profile from "../../components/Profile";
import { ThemeButton } from "../../components/ThemeButton";
import Chat from "../../components/Chat";
import axios from "axios";
import { Room } from "../../components/Chat";

export default function Dashboard() {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString).user : null;
    const token = userString ? JSON.parse(userString).token : null;
    const [isChatBox, setIsChatBox] = useState(false);
    const [loader, setLoader] = useState(false);
    const [roomname, setRoomname] = useState("");
    const [room, setRoom] = useState<Room | null>(null);

    const [error, setError] = useState("");

    const handleCreateRoom = async () => {
        setLoader(true);
        setError("");
        try {
            const response = await axios.post(
                "http://localhost:3001/room",
                {
                    roomName: roomname,
                    token,
                },
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200 || response.status === 201) {
                localStorage.setItem(
                    "room",
                    JSON.stringify(response.data.room)
                );
                setIsChatBox(true);
            } else {
                setError("Room creation failed. please try again.");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                        "An error occured while creating room."
                );
            } else {
                setError("An error occured while creating room.");
            }
        } finally {
            setLoader(false);
            setRoomname("");
        }
    };
    const handleJoinRoom = async () => {
        setLoader(true);
        setError("");
        try {
            const response = await axios.post(
                `http://localhost:3001/room/${roomname}`,
                {
                    roomId: roomname,
                    token,
                }
            );

            if (response.status === 200 || response.status === 201) {
                localStorage.setItem(
                    "room",
                    JSON.stringify(response.data.room)
                );
                setIsChatBox(true);
                setRoom(response.data.room);
            } else {
                setError("Room joining failed. please try again.");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                        "An error occured while joining room."
                );
            } else {
                setError("An error occured while joining room.");
            }
        } finally {
            setLoader(false);
            setRoomname("");
        }
    };

    return (
        <div className="flex justify-around min-h-screen px-20 py-10 min-w-screen bg-keep-100 text-keep-900 dark:bg-gray-950 dark:text-keep-100">
            <div className="flex flex-col items-center justify-between">
                <div className="w-full">
                    <ThemeButton />
                </div>
                <div className="relative pb-10 my-auto bg-transparent h-100 w-100 ">
                    <div className="absolute w-full h-full rounded-full bg-red-400/40 blur-3xl"></div>
                    <Animation />
                    <p className="font-serif text-xl font-semibold text-center text-shadow-lg text-shadow-red-400/40">{`let's chat...!`}</p>
                </div>
            </div>
            <div className="flex gap-20 ustify-around">
                <div className="relative mt-10 rounded-b-lg shadow-2xl w-160 h-200 rounded-t-4xl shadow-red-400/40 bg-red-400/20 dark:bg-gray-900/10">
                    {!isChatBox && (
                        <div className="flex items-center justify-center w-full h-full bg-transparent rounded-4xl">
                            <div className="w-[80%] h-[80%] px-10 py-10 flex flex-col gap-10 justify-center">
                                <InputBox
                                    type="text"
                                    placeholder="enter the room name..."
                                    value={roomname}
                                    onChange={(e) =>
                                        setRoomname(e.target.value)
                                    }
                                />
                                <div className="relative flex justify-around gap-10">
                                    <div>
                                        <LargeButton
                                            buttonName="Creat room"
                                            onClick={handleCreateRoom}
                                        />
                                    </div>
                                    <div>
                                        <LargeButton
                                            buttonName="Join room"
                                            onClick={handleJoinRoom}
                                        />
                                    </div>
                                    <div
                                        className={`${loader ? "absolute backdrop-blur-xs" : "hidden"} absolute top-0 flex items-center justify-center w-full h-12 border-t-[1.5] border-b-[3] rounded-full`}
                                    >
                                        <div className="flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-red-400 rounded-full border-t-transparent animate-spin"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div
                        className={`${error.length > 0 ? "absolute opacity-100 top-0 translate-y-10 border-red-700 border-1 rounded-2xl bg-keep-800/60 h-10" : "pointer-events-none opacity-0"} flex justify-center items-center w-[80%] ml-16 transition-all duration-700 ease-in-out`}
                    >
                        <p className="text-lg italic font-semibold text-center">
                            {error}
                        </p>
                    </div>
                    {isChatBox && room && (
                        <Chat
                            room={room}
                            onClick={() => setIsChatBox((prev) => !prev)}
                        />
                    )}
                </div>
                <div className="flex flex-col justify-center w-40 h-40 transition-all duration-300 ease-in-out bg-transparent rounded-full shadow-2xl shadow-red-400/40 hover:scale-105 hover:border-keep-600 hover:border-1">
                    <div className="w-full h-[75%] rounded-full border-b-2 border-keep-500">
                        <Profile />
                    </div>
                    <p className="font-serif font-semibold text-center text-md text-shadow-lg text-shadow-red-400/40">
                        {user.name}
                    </p>
                </div>
            </div>
        </div>
    );
}
