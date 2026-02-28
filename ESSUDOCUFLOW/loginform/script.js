// Toggle Function (remains the same)
function toggleView(view) {
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const slider = document.querySelector('.slider');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    if (view === 'login') {
        loginSection.classList.remove('hidden');
        signupSection.classList.add('hidden');
        slider.style.transform = 'translateX(0%)';
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
    } else {
        signupSection.classList.remove('hidden');
        loginSection.classList.add('hidden');
        slider.style.transform = 'translateX(100%)';
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
    }
}

// Validation and Signup Logic
function handleSignup(event) {
    event.preventDefault(); // Stop form from refreshing the page

    const emailInput = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.getElementById('user-role').value;
    const errorDiv = document.getElementById('error-message');

    // 1. Double check Email for uppercase (Security layer)
    if (/[A-Z]/.test(emailInput)) {
        alert("Email must not contain capital letters.");
        return;
    }

    // 2. Password Match Check
    if (password !== confirmPassword) {
        errorDiv.style.display = 'block';
        errorDiv.innerText = "⚠️ Passwords do not match!";
        document.getElementById('confirm-password').style.borderColor = "#d32f2f";
        return;
    } else {
        errorDiv.style.display = 'none';
        document.getElementById('confirm-password').style.borderColor = "#e2e8f0";
    }

    // 3. Success Logic
    alert(`Registration Successful! Role: ${role}`);
    
    const routes = {
        'admin': 'admin-dashboard.html',
        'staff': 'staff-dashboard.html',
        'student': 'student-dashboard.html'
    };

    window.location.href = routes[role] || 'student-dashboard.html';
}