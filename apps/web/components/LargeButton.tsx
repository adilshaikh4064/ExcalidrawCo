"use client";

interface LargeButton {
    buttonName: string;
    onClick: () => void;
}

export default function LargeButton(props: LargeButton) {
    return (
        <div className="w-full h-12 px-2 rounded-full cursor-pointer text-keep-900 dark:text-keep-100 border-t-[1.5]  border-b-[3] border-keep-400 dark:border-keep-900 dark:hover:border-keep-400 hover:border-keep-900 hover:scale-105 transition-all duration-200 ease-in-out">
            <button
                className="w-full h-full text-xl font-semibold text-center cursor-pointer"
                onClick={props.onClick}
            >
                {props.buttonName}
            </button>
        </div>
    );
}
