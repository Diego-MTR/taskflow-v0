import { useEffect, useState } from "react";

export function Clock() {
    console.log("1. rendu");
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        console.log("2. effet : démarrage du minuteur");
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => {
            console.log("3. nettoyage : arrêt du minuteur");
            clearInterval(id);
        };
    }, []);

    return <p>{now.toLocaleTimeString()}</p>;
}
