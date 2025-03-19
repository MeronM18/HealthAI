function startFasting() {
    const startTime = new Date(document.getElementById("start-time").value);
    const fastingDuration = 16 * 60 * 60 * 1000; // Example: 16 hours in milliseconds

    function updateTimer() {
        const now = new Date();
        const elapsed = now - startTime;
        const remaining = fastingDuration - elapsed;

        if (remaining <= 0) {
            document.getElementById("time-left").textContent = "00:00:00";
            document.getElementById("elapsed-time").textContent = formatTime(fastingDuration);
            return;
        }

        document.getElementById("elapsed-time").textContent = formatTime(elapsed);
        document.getElementById("time-left").textContent = formatTime(remaining);

        requestAnimationFrame(updateTimer);
    }

    updateTimer();
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
