// validation.js

const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const authForm = document.getElementById('authForm');

authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const emailValue = emailInput.value.trim();
    if (!emailValue.includes('@noroff') && !emailValue.includes('@stud.noroff')) {
        emailError.style.display = 'block';
        return; // Stop if invalid email
    } else {
        emailError.style.display = 'none';

        const username = document.getElementById('name').value;
        const password = document.getElementById('password').value;

        try {
            // Object for user inputted values
            const userData = {
                name: username,
                email: emailValue,
                password: password,
            };

            // Console logs to help diagnose issues
            console.log('Sending POST request to:', 'https://api.noroff.dev/api/v1/social/auth/register');
            console.log('Request method:', 'POST');

            // Make a POST request to the registration endpoint
            const response = await fetch('https://api.noroff.dev/api/v1/social/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                // Registration successful
                const data = await response.json();
                const jwtToken = data.token;

                // Save the JWT token to localStorage
                localStorage.setItem('jwtToken', jwtToken);

                // Redirect to the login page
                window.location.href = 'login.html';
            } else {
                // Registration failed, handle the error
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
});