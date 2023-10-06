// content.js

let currentPage = 1;
const itemsPerPage = 5;

function renderContent(data) {
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = ''; 

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    for (let i = startIndex; i < endIndex && i < data.length; i++) {
        const item = data[i];
        const contentItem = document.createElement('div');
        contentItem.classList.add('content-item');
        contentItem.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.body}</p>
        `;
        contentContainer.appendChild(contentItem);
    }
}

function handlePagination(data) {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    prevButton.disabled = currentPage === 1;


    nextButton.disabled = currentPage >= Math.ceil(data.length / itemsPerPage);


    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderContent(data);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(data.length / itemsPerPage)) {
            currentPage++;
            renderContent(data);
        }
    });
}

// Fetch and display content
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch content using the access token
        const accessToken = localStorage.getItem('jwtToken');
        const response = await fetch('https://api.noroff.dev/api/v1/social', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            renderContent(data);
            handlePagination(data);
        } else {
            console.error('Failed to fetch content:', response.status);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
});