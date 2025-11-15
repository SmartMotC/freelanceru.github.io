// Элементы DOM
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const registerModal = document.getElementById('registerModal');
const loginModal = document.getElementById('loginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const switchToLogin = document.getElementById('switchToLogin');
const switchToRegister = document.getElementById('switchToRegister');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');
const loginErrorAlert = document.getElementById('loginErrorAlert');
const passwordInput = document.getElementById('password');
const passwordStrengthBar = document.getElementById('passwordStrengthBar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

// Автоматическое открытие окна регистрации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Небольшая задержка для лучшего UX
    setTimeout(() => {
        registerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }, 500);
});

// Открытие модальных окон
registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

// Закрытие модальных окон
closeRegisterModal.addEventListener('click', () => {
    registerModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetAlerts();
});

closeLoginModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetAlerts();
});

// Переключение между окнами регистрации и входа
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'none';
    loginModal.style.display = 'flex';
    resetAlerts();
});

switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'flex';
    resetAlerts();
});

// Мобильное меню
mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// Закрытие модальных окон при клике вне их
window.addEventListener('click', (e) => {
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetAlerts();
    }
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetAlerts();
    }
});

// Индикатор сложности пароля
passwordInput.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    passwordStrengthBar.style.width = strength + '%';
    
    if (strength < 50) {
        passwordStrengthBar.style.background = '#e74c3c';
    } else if (strength < 75) {
        passwordStrengthBar.style.background = '#f39c12';
    } else {
        passwordStrengthBar.style.background = '#27ae60';
    }
});

// Обработка формы регистрации
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    const agree = document.querySelector('input[name="agree"]').checked;
    
    // Валидация формы
    if (!validateEmail(email) || password.length < 6 || !userType || !agree) {
        showAlert(errorAlert);
        return;
    }
    
    // Сохранение данных пользователя (в реальном проекте здесь будет отправка на сервер)
    const userData = {
        email: email,
        password: password,
        userType: userType,
        registrationDate: new Date().toISOString(),
        referral: true // Отмечаем, что регистрация по реферальной ссылке
    };
    
    // Сохраняем в localStorage (в реальном проекте отправляем на сервер)
    saveUserData(userData);
    
    // Показываем сообщение об успехе
    showAlert(successAlert);
    
    // Очищаем форму
    registerForm.reset();
    passwordStrengthBar.style.width = '0';
    
    // Закрываем модальное окно через 2 секунды
    setTimeout(() => {
        registerModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetAlerts();
        
        // Обновляем интерфейс для авторизованного пользователя
        updateUIForLoggedInUser(email);
    }, 2000);
});

// Обработка формы входа
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Проверяем существование пользователя
    if (checkUserCredentials(email, password)) {
        // В реальном проекте здесь будет установка сессии/токена
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        loginForm.reset();
        resetAlerts();
        
        // Обновляем интерфейс для авторизованного пользователя
        updateUIForLoggedInUser(email);
    } else {
        showAlert(loginErrorAlert);
    }
});

// Вспомогательные функции
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showAlert(alertElement) {
    // Скрываем все алерты
    resetAlerts();
    // Показываем нужный алерт
    alertElement.style.display = 'block';
}

function resetAlerts() {
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    loginErrorAlert.style.display = 'none';
}

function saveUserData(userData) {
    // В реальном проекте здесь будет отправка на сервер
    // Для демонстрации сохраняем в localStorage
    let users = JSON.parse(localStorage.getItem('freelanceUsers') || '[]');
    users.push(userData);
    localStorage.setItem('freelanceUsers', JSON.stringify(users));
    console.log('Данные пользователя сохранены:', userData);
    
    // В реальном проекте здесь будет отправка данных о реферале на сервер
    if (userData.referral) {
        console.log('Реферальная регистрация! Отправка вознаграждения приглашающему...');
    }
}

function checkUserCredentials(email, password) {
    // В реальном проекте здесь будет проверка на сервере
    // Для демонстрации проверяем в localStorage
    const users = JSON.parse(localStorage.getItem('freelanceUsers') || '[]');
    return users.some(user => user.email === email && user.password === password);
}

function updateUIForLoggedInUser(email) {
    // Обновляем интерфейс для авторизованного пользователя
    const authButtons = document.querySelector('.auth-buttons');
    const userInitial = email.charAt(0).toUpperCase();
    
    authButtons.innerHTML = `
        <div class="user-info">
            <div class="user-avatar">${userInitial}</div>
            <span>${email}</span>
        </div>
        <button class="btn btn-login" id="logoutBtn">
            <i class="fas fa-sign-out-alt"></i> Выйти
        </button>
    `;
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        // В реальном проекте здесь будет выход из системы
        localStorage.removeItem('currentUser');
        location.reload(); // Просто перезагружаем страницу для демонстрации
    });
}

// Проверяем, авторизован ли пользователь при загрузке страницы
// В реальном проекте здесь будет проверка токена/сессии
document.addEventListener('DOMContentLoaded', function() {
    // Пример: если пользователь уже авторизован
    // updateUIForLoggedInUser('example@mail.ru');
});