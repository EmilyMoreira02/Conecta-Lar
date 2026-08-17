document.addEventListener("DOMContentLoaded", () => {
    const toggleA11yFeature = (btnId, bodyClass) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isPressed = btn.getAttribute('aria-pressed') === 'true';
            btn.setAttribute('aria-pressed', !isPressed);

            if (btnId === 'btnSwitchMode') {
                const span = btn.querySelector('span');
                const icon = btn.querySelector('i');
                if (!isPressed) {
                    span.textContent = "Claro";
                    icon.className = "ri-sun-line";
                } else {
                    span.textContent = "Escuro";
                    icon.className = "ri-moon-line";
                }
            }

            document.body.classList.toggle(bodyClass);
        });
    };

    toggleA11yFeature('btnSwitchMode', 'dark-mode');
    toggleA11yFeature('btnSwitchContrast', 'high-contrast');
    toggleA11yFeature('btnSwitchDyslexia', 'dyslexia-font');
    toggleA11yFeature('btnSwitchCursor', 'large-cursor');
    toggleA11yFeature('btnSwitchSpacing', 'text-spacing');

    const btnReader = document.getElementById('btnSwitchReader');
    if (btnReader) {
        btnReader.addEventListener('click', () => {
            const isPressed = btnReader.getAttribute('aria-pressed') === 'true';

            if (!isPressed) {
                btnReader.setAttribute('aria-pressed', 'true');

                const conteudoParaLer = document.getElementById('area-leitura').innerText;

                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(conteudoParaLer);
                utterance.lang = 'pt-BR';
                utterance.rate = 1.0;

                utterance.onend = () => {
                    btnReader.setAttribute('aria-pressed', 'false');
                };

                window.speechSynthesis.speak(utterance);
            } else {
                btnReader.setAttribute('aria-pressed', 'false');
                window.speechSynthesis.cancel();
            }
        });
    }

    let currentFontSize = 16;
    const fontDisplay = document.getElementById('sizeFont');
    const btnIncrease = document.getElementById('largeFont');
    const btnDecrease = document.getElementById('smallestFont');
    const root = document.documentElement;

    const updateFontSize = (newSize) => {
        if (newSize >= 12 && newSize <= 24) {
            currentFontSize = newSize;
            fontDisplay.textContent = `${currentFontSize}px`;
            root.style.setProperty('--font-base', `${currentFontSize}px`);
            root.style.fontSize = `${currentFontSize}px`;
        }
    };

    if (btnIncrease && btnDecrease) {
        btnIncrease.addEventListener('click', () => updateFontSize(currentFontSize + 2));
        btnDecrease.addEventListener('click', () => updateFontSize(currentFontSize - 2));
    }

    if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        const btnLibras = document.getElementById('btnSwitchLibras');
        if (btnLibras) {
            btnLibras.addEventListener('click', () => {
                const isPressed = btnLibras.getAttribute('aria-pressed') === 'true';
                btnLibras.setAttribute('aria-pressed', !isPressed);
                const originalVlibrasBtn = document.querySelector('[vw-access-button]');
                if (originalVlibrasBtn) {
                    originalVlibrasBtn.click();
                }
            });
        }
    }
});