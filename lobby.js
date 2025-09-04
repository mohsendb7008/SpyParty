const lobbyState = {
    playerId: null,
    playerName: '',
    gameCode: null,
    settings: { numSpies: 1, roundSeconds: 300, words: ['cafe', 'beach', 'library', 'train', 'museum'] },
    players: [],
    leaderId: null,
    isLeader() {
        return this.leaderId === this.playerId;
    }
}

function handleLobbyMessage(msg) {
    switch (msg.type) {
        case 'create':
        {
            lobbyState.players.push({ id: msg.id, name: msg.name });
            lobbyState.leaderId = msg.id;
            lobbyState.settings = msg.settings;
            return true;
        }
        case 'join':
        {
            lobbyState.players.push({ id: msg.id, name: msg.name });
            if (msg.id === lobbyState.playerId)
                flushBuffer();
            return true;
        }
    }
    return false;
}

$('createBtn').onclick = () => {
    const id = uid();
    const name = $('nameInput').value.trim(); if(!name) return alert('Enter your display name');
    const code = ($('createCode').value.trim() || defaultCode()).toUpperCase();
    lobbyState.playerId = id;
    lobbyState.playerName = name;
    lobbyState.gameCode = code;
    send({ type: 'create', code, id, name, settings: lobbyState.settings });
    render();
};

$('joinBtn').onclick = () => {
    const id = uid();
    const name = $('nameInput').value.trim(); if(!name) return alert('Enter your display name');
    const code = $('joinCode').value.trim().toUpperCase(); if(!code) return alert('Enter game code');
    lobbyState.playerId = id;
    lobbyState.playerName = name;
    lobbyState.gameCode = code;
    send({ type: 'join', code, id, name });
    render();
};

const copyCodeBtn = $('copyCodeBtn');
copyCodeBtn.onclick = () => {
    const c = lobbyState.gameCode;
    if(!c) return;
    copy(c);
    copyCodeBtn.textContent = 'Copied!';
    setTimeout(()=> copyCodeBtn.textContent='Copy', 1000);
};

$('startBtn').onclick = () => {
    if (!lobbyState.isLeader()) return;
    if (lobbyState.players.length < 3) {
        alert('Need at least 3 players to start the game');
        return;
    }
    if (lobbyState.players.length / 2 < lobbyState.settings.numSpies) {
        alert('Cannot have more than half of the players to be spy');
        return;
    }
    const word = randomSample(lobbyState.settings.words)[0];
    const spies = randomSample(lobbyState.players, lobbyState.settings.numSpies);
    send({ type: 'start', code: lobbyState.gameCode, word, spies });
};