// validation.js

const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const authForm = document.getElementById('authForm');

authForm.addEventListener('submit', (event) => {
    const emailValue = emailInput.value.trim();
    if (!emailValue.includes('@noroff')) {
        emailError.style.display = 'block';
        event.preventDefault(); // Prevent form submission
    } else {
        emailError.style.display = 'none'; 

        // Save user details to localStorage
        const username = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const userData = {
            username,
            password
        };
        localStorage.setItem(username, JSON.stringify(userData));
    }
});