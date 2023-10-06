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
            <p>Tags: ${item.tags.join(', ')}</p>
            <p>Media: <img src="${item.media}" alt="Media"></p>
            <p>Created: ${item.created}</p>
            <p>Updated: ${item.updated}</p>
            <p>Author: ${item.author.name}</p>
            <p>Author Email: ${item.author.email}</p>
            <p>Author Avatar: <img src="${item.author.avatar}" alt="Author Avatar"></p>
            <p>Author Banner: <img src="${item.author.banner}" alt="Author Banner"></p>
            <p>Comments: ${item._count.comments}</p>
            <p>Reactions: ${item._count.reactions}</p>
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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Set your API base URL
        const API_BASE_URL = 'https://api.noroff.dev/api/v1';

        // Retrieve the JWT token from localStorage
        const jwtToken = localStorage.getItem('jwtToken');

        // Check if the token exists
        if (!jwtToken) {
            console.error('JWT token not found in localStorage.');
            return;
        }

        // Configure headers with Authorization using the retrieved token
        const options = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        };

        // Fetch content using the JWT token
        const response = await fetch(`${API_BASE_URL}/social/posts`, options);
        const data = await response.json();

        if (response.ok) {
            renderContent(data);
            handlePagination(data);
        } else {
            console.error('Failed to fetch content:', response.status);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
});