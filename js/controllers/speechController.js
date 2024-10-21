import { queryEl, hideEl, showEl } from '../utils/domHelpers.js';
import { switchViewTo } from '../views/viewManager.js';
import SpeechModel from '../models/speechModel.js';

const speechModel = new SpeechModel();

export function initializeSpeechController() {
    const startBtn = queryEl('#startBtn');
    const settingsBtn = queryEl('#settBtn');
    const closeBtn = queryEl('#closeBtn');
    const runBtn = queryEl('#runBtn');
    const darkModeToggle = queryEl('#darkModeToggle');
    const previewVoiceBtn = queryEl('#previewVoiceBtn');

    startBtn.addEventListener('click', () => switchViewTo('main'));
    settingsBtn.addEventListener('click', () => {
        switchViewTo('settings');
        hideEl(settingsBtn);
    });
    closeBtn.addEventListener('click', () => {
        switchViewTo('main');
        showEl(settingsBtn);
    });

    runBtn.addEventListener('click', () => {
        const textBlock = queryEl('#textBlock');
        textBlock.blur();
        if (textBlock.value.trim()) {
            if (!speechModel.speak(textBlock.value.trim())) {
                switchViewTo('error');
            }
        }
    });

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    previewVoiceBtn.addEventListener('click', () => {
        if (!speechModel.speak('This is a preview of the selected voice.')) {
            switchViewTo('error');
        }
    });

    // Initialize speech synthesis
    if (!speechModel.initializeVoices()) {
        console.error('Failed to initialize voices');
        switchViewTo('error');
    } else {
        // Only switch to 'main' view if voices are initialized successfully
        switchViewTo('main');
    }

    // Clear input
    queryEl('#textBlock').value = '';

    // Load dark mode setting
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}
