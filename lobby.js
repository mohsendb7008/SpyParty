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
            if (
                msg.code === lobbyState.gameCode &&
                msg.id === lobbyState.playerId
            )
            {
                lobbyState.players.push({ id: msg.id, name: msg.name });
                lobbyState.leaderId = msg.id;
            }
            return true;
        }
        case 'join':
        {
            if (msg.code === lobbyState.gameCode)
            {
                if (
                    msg.id === lobbyState.playerId ||
                    lobbyState.isLeader()
                )
                {
                    lobbyState.players.push({ id: msg.id, name: msg.name });
                }
            }
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
    send({ type: 'create', code, id, name });
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