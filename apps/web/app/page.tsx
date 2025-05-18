"use client";
import LargeButton from "../components/LargeButton";
import { ThemeButton } from "../components/ThemeButton";
import { useState } from "react";
import InputBox from "../components/InputBox";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
    const [expandSignup, setExpandSignup] = useState(false);
    const [expandSigin, setExpandSignin] = useState(false);
    const router = useRouter();

    const [loader, setLoader] = useState(false);
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSignup = async () => {
        setLoader(true);
        setError("");
        try {
            const response = await axios.post("http://localhost:3001/signup", {
                name: name,
                email: email,
                password: password,
            });

            if (response.status === 200 || response.status === 201) {
                localStorage.setItem("user", JSON.stringify(response.data));
                router.push(`/home`);
            } else {
                setError("Signup failed. Please try again.");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                        "An error occured during sign up"
                );
            } else {
                setError("An error occured during sign up");
            }
        } finally {
            setLoader(false);
        }
    };
    const handleSignin = async () => {
        setLoader(true);
        setError("");
        try {
            const response = await axios.post("http://localhost:3001/signin", {
                email: email, //example123@gmail.com
                password: password, //"example@123"
            });

            if (response.status === 200 || response.status === 201) {
                localStorage.setItem("user", JSON.stringify(response.data));
                router.push(`/home`);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                        "An error occured during sign in."
                );
            } else {
                setError("An error occured during sign in.");
            }
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="min-h-screen min-w-screen bg-keep-100 text-keep-900 dark:bg-gray-950 dark:text-keep-100">
            <div className="sticky top-0 left-0 right-0 w-full h-20 px-8 border-b-[0.5] shadow-md dark:shadow-red-800/40 dark:border-red-800/40 border-red-400/40 shadow-red-400/40 z-50">
                <nav className="max-w-[1216] mx-auto h-full flex items-center px-2 flex-row-reverse">
                    <ThemeButton />
                </nav>
            </div>
            <div className="relative flex items-center justify-center w-full gap-20 overflow-auto h-213">
                <div className="absolute border-2 bg-red-400/40 dark:bg-red-800/40 opacity-80 dark:opacity-60 rounded-4xl h-100 w-100 top-15 left-50 blur-xl"></div>
                <div className="bg-transparent border-[0.5] border-red-400/40 dark:border-red-800/40 shadow-xl w-120 h-150 rounded-2xl shadow-red-400/40 dark:shadow-red-800/40 z-10">
                    <div className="flex flex-col items-center justify-center w-full h-full gap-5 p-12">
                        <LargeButton
                            buttonName="Sign up"
                            onClick={() => {
                                setExpandSignin(false);
                                setExpandSignup((prev) => !prev);
                            }}
                        />
                        <LargeButton
                            buttonName="Sign in"
                            onClick={() => {
                                setExpandSignup(false);
                                setExpandSignin((prev) => !prev);
                            }}
                        />
                    </div>
                </div>
                <div
                    className={`absolute flex flex-col items-center justify-center gap-2 shadow-lg shadow-red-400 bg-red-400/80 dark:bg-red-900/40 dark:shadow-red-900 rounded-3xl top-48 left-232 w-100 h-120 ${expandSignup || expandSigin ? "blur-sm opacity-70 shadow-2xl shadow-red-400/80" : ""} transition-all duration-300 ease-in-out`}
                >
                    <p className="font-serif text-6xl font-bold">{`Let's`}</p>
                    <p className="text-xl font-semibold">
                        chat, connect & socialise !
                    </p>
                    <p className="font-serif text-xl font-semibold">{`...`}</p>
                </div>
                <div
                    className={`${expandSignup || expandSigin ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"} flex items-center justify-center bg-transparent border-1 w-120 h-150 transition-all duration-500 ease-in-out rounded-2xl shadow-xl border-keep-500 shadow-keep-500 dark:border-keep-700 dark:shadow-keep-700`}
                    aria-expanded={expandSignup || expandSigin}
                >
                    <div className="flex flex-col items-center justify-around w-full h-full p-12">
                        <div
                            className={`${error.length > 0 ? "absolute opacity-100 top-0 translate-y-10 border-red-700 border-1 rounded-2xl bg-keep-800/60 h-10" : "pointer-events-none opacity-0"} flex justify-center items-center w-[80%] transition-all duration-700 ease-in-out`}
                        >
                            <p className="text-lg italic font-semibold text-center">
                                {error}
                            </p>
                        </div>
                        <p className="mt-10 text-4xl font-bold text-center mb-18">
                            {expandSignup ? "Sign up" : "Sign in"}
                        </p>
                        <div className="flex flex-col w-full gap-3 pb-10 border-b-1 border-keep-700 dark:border-keep-400">
                            <InputBox
                                type="email"
                                placeholder="Email: example123@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <InputBox
                                type="password"
                                placeholder="Password: password@123"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {expandSignup && (
                                <InputBox
                                    type="string"
                                    placeholder="Name: example ex"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            )}
                        </div>
                        <div className="relative w-full h-full mt-15">
                            <div className={`${loader ? "opacity-50" : ""}`}>
                                <LargeButton
                                    buttonName={
                                        expandSignup ? "Sign up" : "Sign in"
                                    }
                                    onClick={() => {
                                        if (expandSignup) handleSignup();
                                        if (expandSigin) handleSignin();
                                    }}
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
            </div>
        </div>
    );
}
