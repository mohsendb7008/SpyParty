const appState = {
  phase: 'lobby', // lobby | game | timer
  buffer: []
}

function resetApp() {
  resetLobby();
  resetGame();
  appState.phase = 'lobby';
}

function render() {
  $('codeValue').textContent = lobbyState.gameCode || '—';
  $('phaseText').textContent = appState.phase;

  const hasJoined = !!lobbyState.playerId;
  $('connCard').classList.toggle('hidden', hasJoined);
  $('lobbyCard').classList.toggle('hidden', !hasJoined);

  const isLeader = lobbyState.isLeader();
  $('leaderPanel').classList.toggle('hidden', !isLeader);

  if (isLeader && appState.phase === 'lobby') {
    updateSettingsUI();
  }

  $('rolePanel').classList.toggle('hidden', appState.phase !== 'game');
  $('timerPanel').classList.toggle('hidden', appState.phase !== 'timer');

  if (appState.phase === 'timer') {
    $('finishBtn').classList.toggle('hidden', !isLeader);
  }

  if (appState.phase === 'game') {
    const isSpy = gameState.isSpy();
    $('roleText').textContent = isSpy ? 'YOU ARE SPY' : gameState.word || '—';
    $('roleInstruction').textContent = isSpy
      ? 'BLEND IN AND GUESS THE SECRET WORD!'
      : 'GIVE CLUES WITHOUT SAYING THE WORD!';

    $('confirmBtn').disabled = gameState.confirmed.has(lobbyState.playerId);
    $('confirmCount').textContent = gameState.confirmed.size;
    $('totalPlayers').textContent = lobbyState.players.length;

    $('forceStartBtn').classList.toggle('hidden', !isLeader);
  }

  const list = $('playersList');
  list.innerHTML = '';
  lobbyState.players.forEach(p => {
    const el = document.createElement('div');
    el.className = 'player';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = p.name;
    if (p.id === lobbyState.playerId) {
      const you = document.createElement('span');
      you.className = 'you';
      you.textContent = '(you)';
      name.appendChild(you);
    }
    const conf = document.createElement('div');

    if (appState.phase === 'game') {
      const isPlayerConfirmed = gameState.confirmed.has(p.id);
      conf.innerHTML = `<span class="status-dot ${isPlayerConfirmed ? 'dot-ok' : 'dot-warn'}"></span>`;
    } else {
      conf.innerHTML = `<span class="status-dot ${lobbyState.isLeader() ? 'dot-ok' : 'dot-warn'}"></span>`;
    }

    const role = document.createElement('div');
    role.className = 'role-sub';

    if (appState.phase === 'game') {
      role.textContent = gameState.confirmed.has(p.id) ? 'READY' : 'NOT READY';
    } else {
      role.textContent = p.id === lobbyState.leaderId ? 'LEADER' : '';
    }

    el.appendChild(name);
    el.appendChild(role);
    el.appendChild(conf);

    if (lobbyState.isLeader() && p.id !== lobbyState.playerId) {
      const kickBtn = document.createElement('button');
      kickBtn.className = 'cyber-btn small danger btn-kick';
      kickBtn.textContent = 'KICK';
      kickBtn.onclick = () => {
        if (confirm(`Kick ${p.name}?`)) {
          send({ type: 'kick', id: p.id, code: lobbyState.gameCode });
        }
      };
      el.appendChild(kickBtn);
    }

    list.appendChild(el);
  });
}

function flushBuffer() {
  appState.buffer.forEach(msg => handleServerMessage(msg, false));
  appState.buffer = [];
}

function handleServerMessage(msg, buffer = true) {
  if (msg.code && msg.code !== lobbyState.gameCode) {
    if (buffer) appState.buffer.push(msg);
    return;
  }
  if (handleLobbyMessage(msg) || handleGameMessage(msg)) {
    render();
    return;
  }
  switch (msg.type) {
    case 'error': {
      alert(msg.message || 'Unknown error');
      break;
    }
  }
}

window.addEventListener('load', () => {
  connect('wss://webrtc-signaling.mdsinalpha.click', handleServerMessage);
});