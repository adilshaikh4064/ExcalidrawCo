import React from "react";

interface InputBoxIF {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputBox(props: InputBoxIF) {
    return (
        <div className="w-full h-12 px-2 border-t-[1.5] border-b-[3] hover:border-keep-900 border-keep-400 dark:border-keep-900 dark:hover:border-keep-100 hover:scale-103 rounded-2xl font-serif transition-all duration-300 ease-in-out">
            <input
                className="w-full h-full outline-none text-keep-900 dark:text-keep-100"
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
}
