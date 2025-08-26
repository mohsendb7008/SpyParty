const appState = {
  phase: 'lobby', // lobby | dealing | discussion | ended
  buffer: []
}

function render(){
  $('codeValue').textContent = lobbyState.gameCode || '—';
  $('phaseText').textContent = appState.phase;

  const isLeader = lobbyState.isLeader();
  $('leaderPanel').classList.toggle('hidden', !isLeader);

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
    conf.innerHTML = `<span class="status-dot ${lobbyState.isLeader() ? 'dot-ok' : 'dot-warn'}"></span>`;
    const role = document.createElement('div');
    role.className = 'muted';
    role.textContent = p.id === lobbyState.leaderId ? 'leader' : '';
    el.appendChild(name);
    el.appendChild(role);
    el.appendChild(conf);
    list.appendChild(el);
  });
}

function flushBuffer() {
  appState.buffer.forEach(msg => handleServerMessage(msg, false));
  appState.buffer = [];
}

function handleServerMessage(msg, buffer = true){
  if (msg.code && msg.code !== lobbyState.gameCode) {
    if (buffer) appState.buffer.push(msg);
    return;
  }
  if (handleLobbyMessage(msg)) {
    render();
    return;
  }
  switch(msg.type){
    case 'error': {
      alert(msg.message || 'Unknown error');
      break;
    }
  }
}