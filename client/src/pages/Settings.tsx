import Header from "../components/Header.tsx";
import { useEffect } from "react";

function Settings() {
    useEffect(() => {
        document.title = 'Settings | AALC Interactive';
    }, []);

    return (
        <div>
            <Header />
            <h1>Settings</h1>
        </div>
    );
}

export default Settings;