const gameState = {
    word: null,
    isSpy() {
        return this.word == null;
    }
}

function handleGameMessage(msg) {
    switch (msg.type) {
        case 'start':
        {
            appState.phase = 'game';
            if (!msg.spies.some(spy => spy.id === lobbyState.playerId)) {
                gameState.word = msg.word;
            }
            return true;
        }
    }
    return false;
}