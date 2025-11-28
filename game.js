const gameState = {
    word: null,
    spies: [],
    confirmed: new Set(),
    isSpy() {
        return this.word == null;
    },
    allConfirmed() {
        return this.confirmed.size === lobbyState.players.length;
    }
}

function handleGameMessage(msg) {
    switch (msg.type) {
        case 'start':
            {
                appState.phase = 'game';
                lobbyState.settings = msg.settings;
                gameState.word = null;
                if (!msg.spies.some(spy => spy.id === lobbyState.playerId)) {
                    gameState.word = msg.word;
                }
                gameState.spies = msg.spies;
                gameState.confirmed.clear();
                return true;
            }
        case 'confirm':
            {
                gameState.confirmed.add(msg.id);
                if (gameState.allConfirmed()) {
                    startTimer();
                }
                return true;
            }
        case 'finish':
            {
                finishGame();
                return true;
            }
        case 'force_start':
            {
                startTimer();
                return true;
            }
    }
    return false;
}

$('confirmBtn').onclick = () => {
    if (gameState.confirmed.has(lobbyState.playerId)) return;
    send({ type: 'confirm', code: lobbyState.gameCode, id: lobbyState.playerId });
    render();
};

$('forceStartBtn').onclick = () => {
    send({ type: 'force_start', code: lobbyState.gameCode });
};