document.addEventListener("DOMContentLoaded", () => {
    const formPrestador = document.getElementById('form-prestador');
    const cardExibicao = document.getElementById('card-prestador-exibicao');
    const btnEditarForm = document.querySelector('.btn-editar');
    const STORAGE_KEY = 'dadosPrestador';

    if (btnEditarForm) {
        btnEditarForm.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Você já está no modo de edição. Altere os dados e clique em 'Salvar Informações'.");
        });
    }

    const renderizarCard = (dados) => {
        cardExibicao.innerHTML = `
            <h2>Perfil Profissional</h2>
            <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
                <p><strong>Nome Completo:</strong> ${dados.nome || '-'}</p>
                <p><strong>Localização:</strong> ${dados.localizacao || '-'}</p>
                <p><strong>Profissão:</strong> ${dados.profissao || '-'}</p>
                <p><strong>Especialização:</strong> ${dados.especializacao || '-'}</p>
                <p><strong>Certificados e Cursos:</strong> ${dados.certificados || '-'}</p>
                <p><strong>Valor do Serviço:</strong> ${dados.valor || '-'}</p>
                <p><strong>Carga Horária:</strong> ${dados.cargaHoraria || '-'}</p>
            </div>
            <div class="form-actions" style="margin-top: 20px;">
                <button id="btn-editar-card" class="btn-editar" type="button">
                    <i class="ri-edit-line" aria-hidden="true"></i> Editar Informações
                </button>
            </div>
        `;

        document.getElementById('btn-editar-card').addEventListener('click', () => {
            cardExibicao.classList.add('hidden');
            formPrestador.classList.remove('hidden');
            if (btnEditarForm) btnEditarForm.style.display = 'none';
        });
    };

    const carregarDadosSalvos = () => {
        const dadosSalvos = localStorage.getItem(STORAGE_KEY);
        
        if (dadosSalvos && formPrestador && cardExibicao) {
            try {
                const dados = JSON.parse(dadosSalvos);
                
                Object.keys(dados).forEach(key => {
                    const campo = formPrestador.querySelector(`[name="${key}"], #${key}`);
                    if (campo) campo.value = dados[key];
                });

                renderizarCard(dados);
                cardExibicao.classList.remove('hidden');
                formPrestador.classList.add('hidden');
            } catch (err) {
                console.error("Erro ao ler dados do localStorage:", err);
                formPrestador.classList.remove('hidden');
            }
        } else if (formPrestador) {
            formPrestador.classList.remove('hidden');
            cardExibicao.classList.add('hidden');
            if (btnEditarForm) btnEditarForm.style.display = 'none'; 
        }
    };

    carregarDadosSalvos();

    if (formPrestador) {
        formPrestador.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(formPrestador);
            const dados = Object.fromEntries(formData.entries());

            localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
            "Informações cadastradas com sucesso!";

            renderizarCard(dados);
            formPrestador.classList.add('hidden');
            cardExibicao.classList.remove('hidden');
        });
    }

    const htmlEl = document.documentElement;

    const toggleA11yFeature = (btnId, bodyClass) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isPressed = btn.getAttribute('aria-pressed') === 'true';
            btn.setAttribute('aria-pressed', !isPressed);

            if (btnId === 'btnSwitchMode') {
                const span = btn.querySelector('span');
                const icon = btn.querySelector('i');
                if (span) span.textContent = !isPressed ? "Claro" : "Escuro";
                if (icon) icon.className = !isPressed ? "ri-sun-line" : "ri-moon-line";
            }

            document.body.classList.toggle(bodyClass);
            htmlEl.classList.toggle(bodyClass);
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
            
            const areaLeitura = cardExibicao && !cardExibicao.classList.contains('hidden') 
                ? cardExibicao 
                : (document.getElementById('area-leitura') || document.querySelector('main'));

            if (!areaLeitura) return;

            if (!isPressed) {
                btnReader.setAttribute('aria-pressed', 'true');
                const conteudoParaLer = areaLeitura.innerText;

                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(conteudoParaLer);
                    utterance.lang = 'pt-BR';
                    utterance.rate = 1.0;
                    utterance.onend = () => btnReader.setAttribute('aria-pressed', 'false');
                    window.speechSynthesis.speak(utterance);
                }
            } else {
                btnReader.setAttribute('aria-pressed', 'false');
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            }
        });
    }

    let currentFontSize = 16;
    const fontDisplay = document.getElementById('sizeFont');
    const btnIncrease = document.getElementById('largeFont');
    const btnDecrease = document.getElementById('smallestFont');

    const updateFontSize = (newSize) => {
        if (newSize >= 12 && newSize <= 24) {
            currentFontSize = newSize;
            if (fontDisplay) fontDisplay.textContent = `${currentFontSize}px`;

            htmlEl.style.setProperty('--font-base', `${currentFontSize}px`);
            htmlEl.style.fontSize = `${currentFontSize}px`;

            const mainEl = document.querySelector('main.conteudo, #area-leitura');
            if (mainEl) {
                mainEl.style.setProperty('--font-base', `${currentFontSize}px`);
                mainEl.style.fontSize = `${currentFontSize}px`;
            }
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
                if (originalVlibrasBtn) originalVlibrasBtn.click();
            });
        }
    }
});