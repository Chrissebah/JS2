// login.js

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    try {
        // Check for credentials in localStorage
        const storedUserData = localStorage.getItem(username);
        
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            
            if (userData.password === password) {
                // Password matches, user is authenticated
                alert('Login successful!');
                // Redirect to the protected content page
                window.location.href = 'dashboard.html';
            } else {
                // Password does not match
                alert('Login failed. Please check your credentials.');
            }
        } else {
            // User not found in localStorage
            alert('Login failed. User not found.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
});