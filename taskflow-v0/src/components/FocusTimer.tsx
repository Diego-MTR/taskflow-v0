export function FocusTimer() {
    const [secondLeft, setSecondLeft] = useState(DURATION);
    const [running, setIsRunning] = useState(false);
    cont active = running && secondLeft > 0;
    useEffect(() => {
        if (!active) return;
        const id = setInterval(() => {
            setSecondLeft((s) => s - 1);
        }, 1000);
        return () => clearInterval(id);
    }, [active]);
    const minutes = String(Math.floor(secondLeft / 60)).padStart(2, "0");
    const seconds = String(secondLeft % 60).padStart(2, "0");
}


