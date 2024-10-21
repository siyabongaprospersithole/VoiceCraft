export function queryEl(selector) {
    return document.querySelector(selector);
}

export function queryAllEl(selector) {
    return document.querySelectorAll(selector);
}

export function showEl(el) {
    if (typeof el === 'string') {
        el = queryEl(el);
    }
    if (el && el.style) {
        el.style.display = 'block';
    }
}

export function hideEl(el) {
    if (typeof el === 'string') {
        el = queryEl(el);
    }
    if (el && el.style) {
        el.style.display = 'none';
    }
}
