interface ChatNavIF {
    roomId: string;
    roomSlug: string;
    onClick: () => void;
}

export default function ChatNav(props: ChatNavIF) {
    const firstLetter = props.roomSlug.toUpperCase();
    return (
        <div className="relative h-[7%] w-full bg-keep-900 rounded-t-4xl px-7 flex gap-2 items-center text-keep-100 dark:bg-black border-b-1 border-red-400/80 dark:border-red-400/40">
            <div className="flex items-center justify-center w-10 h-10 font-serif text-3xl font-bold rounded-full bg-keep-500 text-keep-900">
                {firstLetter.charAt(0)}
            </div>
            <div className="flex flex-col items-start justify-center -space-y-2">
                <span className="text-lg font-semibold">{props.roomId}</span>
                <span className="text-sm text-keep-500">status</span>
            </div>
            <div className="h-8 w-8 bg-transparent absolute left-145 rounded-full border-1 border-red-800 hover:scale-105 hover:shadow-md hover:shadow-red-400 transition-all duration-300 ease-in-out z-10">
                <button
                    className="h-full w-full flex justify-center items-center"
                    onClick={props.onClick}
                >
                    {`X`}
                </button>
            </div>
        </div>
    );
}
