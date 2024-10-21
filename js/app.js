import { initializeViews } from './views/viewManager.js';
import { initializeSpeechController } from './controllers/speechController.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeViews();
    initializeSpeechController();
});
