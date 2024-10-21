import { queryEl, hideEl, showEl } from '../utils/domHelpers.js';
import { switchViewTo } from '../views/viewManager.js';

export default class SpeechModel {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.selectMenu = queryEl('#selectVoice');
        this.pitchRange = queryEl('#pitch');
        this.rateRange = queryEl('#rate');
        this.loader = queryEl('#loader');
        this.historyList = queryEl('#historyList');
        this.history = JSON.parse(localStorage.getItem('ttsHistory')) || [];
        this.loadSettings();
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('ttsSettings')) || {};
        this.selectMenu.value = settings.voice || '';
        this.pitchRange.value = settings.pitch || 1;
        this.rateRange.value = settings.rate || 1;
    }

    saveSettings() {
        const settings = {
            voice: this.selectMenu.value,
            pitch: this.pitchRange.value,
            rate: this.rateRange.value
        };
        localStorage.setItem('ttsSettings', JSON.stringify(settings));
    }

    initializeVoices() {
        if (!this.synth) {
            console.error('Speech synthesis not supported');
            return false;
        }

        const populateVoiceList = () => {
            this.voices = this.synth.getVoices();
            this.populateVoiceList();
            this.updateHistory();
        };

        populateVoiceList();

        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoiceList;
        }

        return true;
    }

    populateVoiceList() {
        this.selectMenu.innerHTML = '';
        for (let i = 0; i < this.voices.length; i++) {
            const option = document.createElement('option');
            option.textContent = `${this.voices[i].name} (${this.voices[i].lang})${this.voices[i].default ? ' -- DEFAULT' : ''}`;
            option.setAttribute('data-lang', this.voices[i].lang);
            option.setAttribute('data-name', this.voices[i].name);
            this.selectMenu.appendChild(option);
        }
        this.loadSettings();
    }

    speak(text) {
        if (!this.synth) {
            console.error('Speech synthesis not supported');
            return false;
        }

        showEl(this.loader);
        const utterThis = new SpeechSynthesisUtterance(text);
        
        // Check if there are any voices available
        if (this.voices.length > 0) {
            const selectedOption = this.selectMenu.selectedOptions[0];
            if (selectedOption) {
                const selectedVoiceName = selectedOption.getAttribute('data-name');
                for (let i = 0; i < this.voices.length; i++) {
                    if (this.voices[i].name === selectedVoiceName) {
                        utterThis.voice = this.voices[i];
                        break;
                    }
                }
            } else {
                console.warn('No voice selected, using default voice');
            }
        } else {
            console.warn('No voices available, using default voice');
        }

        utterThis.pitch = this.pitchRange.value;
        utterThis.rate = this.rateRange.value;
        
        utterThis.onend = () => {
            hideEl(this.loader);
            this.addToHistory(text);
        };

        utterThis.onerror = (event) => {
            hideEl(this.loader);
            console.error('SpeechSynthesisUtterance error', event);
            switchViewTo('error');
        };

        this.synth.speak(utterThis);
        this.saveSettings();
        return true;
    }

    addToHistory(text) {
        this.history.unshift({ text, timestamp: new Date().toISOString() });
        if (this.history.length > 5) this.history.pop();
        localStorage.setItem('ttsHistory', JSON.stringify(this.history));
        this.updateHistory();
    }

    updateHistory() {
        this.historyList.innerHTML = '';
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = `${new Date(item.timestamp).toLocaleString()}: ${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}`;
            historyItem.addEventListener('click', () => {
                queryEl('#textBlock').value = item.text;
            });
            this.historyList.appendChild(historyItem);
        });
    }
}
