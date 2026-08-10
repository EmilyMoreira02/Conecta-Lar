function switchTab(type) {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const formForgot = document.getElementById('form-forgot');
  
  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');
  const tabsHeader = document.getElementById('tabs-header');

  // Oculta todos os formulários primeiro
  formLogin.classList.remove('active');
  formRegister.classList.remove('active');
  formForgot.classList.remove('active');

  if (type === 'login') {
    tabsHeader.style.display = 'flex';
    formLogin.classList.add('active');
    btnLogin.classList.add('active');
    btnRegister.classList.remove('active');
  } else if (type === 'register') {
    tabsHeader.style.display = 'flex';
    formRegister.classList.add('active');
    btnRegister.classList.add('active');
    btnLogin.classList.remove('active');
  } else if (type === 'forgot') {
    tabsHeader.style.display = 'none'; // Oculta as abas superiores
    formForgot.classList.add('active');
  }
}