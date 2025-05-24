interface ButtonIF {
    name: string;
    onclick: () => void;
    isActive: boolean;
}

export default function Button(props: ButtonIF) {
    return (
        <button
            className={`${props.isActive ? "text-red-500 border-red-500/60" : "border-cyan-600"}  border px-2 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out`}
            onClick={props.onclick}
        >
            {props.name}
        </button>
    );
}
