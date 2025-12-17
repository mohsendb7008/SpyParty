let defaultGameSettings = { numSpies: 1, roundSeconds: 60, words: ['cafe', 'beach', 'library', 'train', 'museum'] };

const lobbyState = {
    playerId: null,
    playerName: '',
    gameCode: null,
    settings: { ...defaultGameSettings },
    players: [],
    leaderId: null,
    isLeader() {
        return this.leaderId === this.playerId;
    }
}

function resetLobby() {
    lobbyState.playerId = null;
    lobbyState.playerName = '';
    lobbyState.gameCode = null;
    lobbyState.settings = { ...defaultGameSettings };
    lobbyState.players = [];
    lobbyState.leaderId = null;
}

function updateSettingsUI() {
    $('numSpiesInput').value = lobbyState.settings.numSpies;
    $('roundSecondsInput').value = lobbyState.settings.roundSeconds;
    $('wordsInput').value = lobbyState.settings.words.join('\n');
}

function readSettingsFromUI() {
    const wordsText = $('wordsInput').value.trim();
    const words = wordsText ? wordsText.split('\n').map(w => w.trim()).filter(w => w.length > 0) : [];
    lobbyState.settings = {
        numSpies: Math.max(1, parseInt($('numSpiesInput').value) || 1),
        roundSeconds: Math.max(30, Math.min(600, parseInt($('roundSecondsInput').value) || 60)),
        words: words.length > 0 ? words : ['cafe', 'beach', 'library', 'train', 'museum']
    };
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
        case 'kick':
            {
                if (msg.id === lobbyState.playerId)
                    location.reload();
                lobbyState.players = lobbyState.players.filter(p => p.id !== msg.id);
                return true;
            }
    }
    return false;
}

$('createBtn').onclick = () => {
    const id = uid();
    const name = $('nameInput').value.trim(); if (!name) return alert('Enter your display name');
    const code = ($('gameCodeInput').value.trim() || defaultCode()).toUpperCase();
    resetApp();
    lobbyState.playerId = id;
    lobbyState.playerName = name;
    lobbyState.gameCode = code;
    send({ type: 'create', code, id, name, settings: lobbyState.settings });
    render();
};

$('joinBtn').onclick = () => {
    const id = uid();
    const name = $('nameInput').value.trim(); if (!name) return alert('Enter your display name');
    const code = $('gameCodeInput').value.trim().toUpperCase(); if (!code) return alert('Enter game code');
    resetApp();
    lobbyState.playerId = id;
    lobbyState.playerName = name;
    lobbyState.gameCode = code;
    send({ type: 'join', code, id, name });
    render();
};

const copyCodeBtn = $('copyCodeBtn');
copyCodeBtn.onclick = () => {
    const c = lobbyState.gameCode;
    if (!c) return;
    copy(c);
    copyCodeBtn.textContent = 'COPIED!';
    setTimeout(() => copyCodeBtn.textContent = 'COPY CODE', 1000);
};

$('startBtn').onclick = () => {
    if (!lobbyState.isLeader()) return;
    readSettingsFromUI();
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
    send({ type: 'start', code: lobbyState.gameCode, settings: lobbyState.settings, word, spies });
};

async function loadSettings() {
    try {
        const response = await fetch('game_settings.json');
        if (response.ok) {
            const data = await response.json();
            if (data.roundSeconds) defaultGameSettings.roundSeconds = data.roundSeconds;
            if (data.words) defaultGameSettings.words = data.words;
            lobbyState.settings.roundSeconds = defaultGameSettings.roundSeconds;
            lobbyState.settings.words = defaultGameSettings.words;
            render();
        }
    } catch (e) {
        console.error("Failed to load game settings", e);
    }
}

loadSettings();