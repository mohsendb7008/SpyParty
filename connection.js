const connectionState = {
    connection: null,
    ch: '',
    serverUrl: '',
    reconnecting: false,
};

function setConn(status, text) {
    const dot = $('connDot');
    dot.classList.remove('dot-ok', 'dot-warn', 'dot-bad');
    if (status === 'ok') dot.classList.add('dot-ok');
    else if (status === 'warn') dot.classList.add('dot-warn');
    else dot.classList.add('dot-bad');
    $('connText').textContent = text;
}

function connect(url, messageHandler) {
    if (connectionState.connection) try { connectionState.connection?.closeDataChannelAndPeerConnection(); } catch { }
    window.signaling_websocket_url = url;
    connectionState.serverUrl = url;
    connectionState.ch = generateUniqueString();
    setConn('warn', 'Connecting…');
    let onError = (error) => {
        console.error(error);
        setConn('bad', 'Disconnected');
    }
    let onData = (data) => {
        let msg;
        try {
            msg = JSON.parse(data);
        } catch (_) {
            return
        }
        messageHandler(msg);
    }
    RtcLib.startWebRtcClient(connectionState.ch, 8081, onError, onData)
        .then((rtc) => {
            connectionState.connection = rtc;
            setConn('ok', 'Connected');
        }).catch(onError);
}

function send(data) {
    let msg = JSON.stringify(data);
    connectionState.connection.sendData(msg);
}

$('connectBtn').onclick = () => {
    const url = $('serverUrl').value.trim();
    if (!url) return alert('Enter Server URL');
    connect(url, handleServerMessage);
};

$('disconnectBtn').onclick = () => { try { connectionState.connection?.closeDataChannelAndPeerConnection(); } catch { } };

$('reconnectBtn').onclick = () => { if (!connectionState.serverUrl) return; connect(connectionState.serverUrl); };