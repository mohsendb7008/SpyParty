const timerState = {
    startTime: null,
    duration: 0,
    intervalId: null
};

function startTimer() {
    stopTimer();
    appState.phase = 'timer';
    timerState.startTime = Date.now();
    timerState.duration = lobbyState.settings.roundSeconds * 1000;
    updateTimerDisplay();
    timerState.intervalId = setInterval(() => {
        updateTimerDisplay();
        const elapsed = Date.now() - timerState.startTime;
        if (elapsed >= timerState.duration) {
            finishGame();
        }
    }, 100);
}

function stopTimer() {
    if (timerState.intervalId) {
        clearInterval(timerState.intervalId);
        timerState.intervalId = null;
    }
}

function finishGame() {
    stopTimer();
    $('timerDisplay').textContent = "SPY = " + gameState.spies.map(player => player.name).join(', ');
    $('finishBtn').classList.add('hidden');
}

function updateTimerDisplay() {
    const elapsed = Date.now() - timerState.startTime;
    const remaining = Math.max(0, timerState.duration - elapsed);
    $('timerDisplay').textContent = msToClock(remaining);
    const timerContainer = $('timerContainer');
    if (remaining > 0 && remaining <= 30000) {
        timerContainer.classList.add('timer-warning');
    } else {
        timerContainer.classList.remove('timer-warning');
    }
}

$('finishBtn').onclick = () => {
    send({ type: 'finish', code: lobbyState.gameCode });
};