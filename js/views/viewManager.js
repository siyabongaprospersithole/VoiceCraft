import { queryEl, hideEl, showEl } from '../utils/domHelpers.js';

const views = ['intro', 'main', 'settings', 'error'];

export function initializeViews() {
    switchViewTo('intro');
}

export function switchViewTo(viewName) {
    views.forEach(view => {
        const viewEl = queryEl(`#${view}View`);
        if (viewEl) {
            if (view === viewName) {
                showEl(viewEl);
            } else {
                hideEl(viewEl);
            }
        }
    });
}
