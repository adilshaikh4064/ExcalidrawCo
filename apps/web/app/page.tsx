import {ThemeButton} from '@repo/ui/ThemeButton';

export default function Home() {
    return (
        <div className="min-h-screen bg-white min-w-screen ">
            <div className="w-40 h-40 bg-blue-300 dark:bg-green-300">
                hello world
            </div>
            <br/>
            <div>
                <ThemeButton/>
            </div>
        </div>
    );
}
