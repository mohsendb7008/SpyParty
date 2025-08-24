function randomString() { return Math.random().toString(36) }

function uid() { return 'p_' + randomString().slice(2, 10); }

function defaultCode() { return randomString().slice(2, 6).toUpperCase(); }

function generateUniqueString(length = 16) {
    const randomPart = [...Array(length)]
        .map(() => randomString()[2])
        .join('');
    const timestampPart = Date.now().toString(36);
    return randomPart + timestampPart;
}

function copy(text){ navigator.clipboard?.writeText(text).then(()=>{}); }

function msToClock(ms){
    const total = Math.max(0, Math.floor(ms/1000));
    const m = String(Math.floor(total/60)).padStart(2,'0');
    const s = String(total%60).padStart(2,'0');
    return `${m}:${s}`;
}