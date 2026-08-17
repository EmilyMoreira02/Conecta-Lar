let emailArmazenado = "";

function switchTab(type) {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const formOtp = document.getElementById('form-otp');
  
  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');
  const tabsHeader = document.getElementById('tabs-header');

  if (!formLogin || !formRegister || !formOtp) return;

  formLogin.classList.remove('active');
  formRegister.classList.remove('active');
  formOtp.classList.remove('active');

  if (type === 'login') {
    if (tabsHeader) tabsHeader.style.display = 'flex';
    formLogin.classList.add('active');
    if (btnLogin) { btnLogin.classList.add('active'); btnLogin.setAttribute('aria-selected', 'true'); }
    if (btnRegister) { btnRegister.classList.remove('active'); btnRegister.setAttribute('aria-selected', 'false'); }
  } else if (type === 'register') {
    if (tabsHeader) tabsHeader.style.display = 'flex';
    formRegister.classList.add('active');
    if (btnRegister) { btnRegister.classList.add('active'); btnRegister.setAttribute('aria-selected', 'true'); }
    if (btnLogin) { btnLogin.classList.remove('active'); btnLogin.setAttribute('aria-selected', 'false'); }
  } else if (type === 'otp') {
    if (tabsHeader) tabsHeader.style.display = 'none';
    formOtp.classList.add('active');
    const codigoOtp = document.getElementById('codigo-otp');
    if (codigoOtp) codigoOtp.focus();
  }
}

function togglePerfil(tipo) {
  const camposCliente = document.getElementById('campos-cliente');
  if (!camposCliente) return;
  const inputsCliente = camposCliente.querySelectorAll('input, select');

  if (tipo === 'profissional') {
    camposCliente.style.display = 'none';
    inputsCliente.forEach(input => input.removeAttribute('required'));
  } else {
    camposCliente.style.display = 'block';
    const tel = document.getElementById('reg-telefone');
    const end = document.getElementById('reg-endereco');
    if (tel) tel.setAttribute('required', 'true');
    if (end) end.setAttribute('required', 'true');
  }
}

function enviarOTP(event, origem) {
  event.preventDefault();
  
  const loginEmail = document.getElementById('login-email');
  const regEmail = document.getElementById('reg-email');

  emailArmazenado = origem === 'login' && loginEmail
    ? loginEmail.value.trim().toLowerCase() 
    : regEmail ? regEmail.value.trim().toLowerCase() : '';
  
  const otpMsg = document.getElementById('otp-mensagem');
  if (otpMsg) {
    otpMsg.innerText = `Enviamos um código de 6 dígitos para: ${emailArmazenado}`;
  }
  switchTab('otp');
}

function validarOTP() {
  const codigoEl = document.getElementById('codigo-otp');
  const codigo = codigoEl ? codigoEl.value : '';
  
  if(codigo.length === 6) {
    if (emailArmazenado === 'cliente@teste.com') {
      alert("Código validado! Redirecionando para a área do CLIENTE...");
      window.location.href = "Cliente/vagas/vagas.html"; 
    } else if (emailArmazenado === 'pro@teste.com' || emailArmazenado === 'profissional@teste.com') {
      alert("Código validado! Redirecionando para a área do PROFISSIONAL...");
      window.location.href = "Prestador/vagas/vagas.html"; 
    } else {
      alert("Acesso liberado com sucesso! Redirecionando...");
      window.location.href = "index.html"; 
    }
  } else {
    alert("Por favor, insira os 6 dígitos corretamente.");
  }
}

function loginSocial(provedor) {
  alert(`Redirecionando para o login seguro via ${provedor}...`);
}

async function loginBiometria() {
  if (window.PublicKeyCredential) {
    alert("Acionando o leitor de digital/facial do seu dispositivo...");
  } else {
    alert("Seu dispositivo ou navegador não suporta biometria.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
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
                if (!isPressed) {
                    if (span) span.textContent = "Claro";
                    if (icon) icon.className = "ri-sun-line";
                } else {
                    if (span) span.textContent = "Escuro";
                    if (icon) icon.className = "ri-moon-line";
                }
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

            if (!isPressed) {
                btnReader.setAttribute('aria-pressed', 'true');
                const leituraEl = document.getElementById('area-leitura') || document.querySelector('main') || document.body;
                const conteudoParaLer = leituraEl.innerText;

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

    function updateFontSize(newSize) {
        if (newSize >= 12 && newSize <= 24) {
            currentFontSize = newSize;
            if (fontDisplay) fontDisplay.textContent = `${currentFontSize}px`;
            root.style.setProperty('--font-base', `${currentFontSize}px`);
            root.style.fontSize = `${currentFontSize}px`;

            const mainEl = document.querySelector('main, .auth-container');
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
                if (originalVlibrasBtn) {
                    originalVlibrasBtn.click();
                }
            });
        }
    }
});