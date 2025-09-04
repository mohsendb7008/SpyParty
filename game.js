const gameState = {
    word: null,
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
            gameState.word = null;
            if (!msg.spies.some(spy => spy.id === lobbyState.playerId)) {
                gameState.word = msg.word;
            }
            gameState.confirmed.clear();
            return true;
        }
        case 'confirm':
        {
            gameState.confirmed.add(msg.id);
            if (gameState.allConfirmed()) {
                appState.phase = 'timer';
            }
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