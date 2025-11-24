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

function randomSample(list, count = 1) {
    if (count < 1)
        return undefined;
    if (count === 1)
        return list.length > 0 ? [list[Math.floor(Math.random() * list.length)]] : [];
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    if (count > list.length)
        return shuffled;
    return shuffled.slice(0, count);
}

function copy(text) { navigator.clipboard?.writeText(text).then(() => { }); }

function msToClock(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const m = String(Math.floor(total / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
}

const $ = (id) => document.getElementById(id);