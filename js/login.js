document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Object for user inputted values
            const userData = {
                email: email,
                password: password,
            };

            // Console log to help diagnose the issue
            console.log('Sending POST request to:', 'https://api.noroff.dev/api/v1/social/auth/login');
            console.log('Request method:', 'POST');

            // Make a POST request to the login endpoint
            const response = await fetch('https://api.noroff.dev/api/v1/social/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                // Login successful
                const data = await response.json();
                const username = data.name;
                const userEmail = data.email;
                const userAccessToken = data.accessToken;

                // Store user data in localStorage
                const userObject = {
                    name: username,
                    email: userEmail,
                    accessToken: userAccessToken,
                };

                localStorage.setItem(username, JSON.stringify(userObject));

                // Redirect to the protected content page
                window.location.href = 'dashboard.html';
            } else {
                // Login failed, handle the error
                console.error('Login failed');
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});