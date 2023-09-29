// validation.js

const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const authForm = document.getElementById('authForm');

authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const emailValue = emailInput.value.trim();
    if (!emailValue.includes('@noroff')('@stud.noroff')) {
        emailError.style.display = 'block';
        return; // Exit early if email is invalid
    } else {
        emailError.style.display = 'none';

        const username = document.getElementById('name').value;
        const password = document.getElementById('password').value;

        try {
            // Create an object with the user input values
            const userData = {
                name: username,
                email: emailValue,
                password: password,
            };

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

                // Redirect to the protected content page
                window.location.href = 'dashboard.html';
            } else {
                // Registration failed, handle the error
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
});