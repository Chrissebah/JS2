// content.js

let currentPage = 1;
const itemsPerPage = 5;
const contentContainer = document.getElementById('content-container');

function renderContent(data) {
    // Clear the content container before rendering new items
    contentContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    for (let i = startIndex; i < endIndex && i < data.length; i++) {
        const item = data[i];
        const contentItemContainer = document.createElement('div');
        contentItemContainer.classList.add('content-item-container');

        const contentItem = document.createElement('div');
        contentItem.classList.add('content-item');

        // Check if item.media URL exists or is empty
        const mediaURL = item.media ? item.media : '/images/imageNotFound.jpg';

        // Check if author's avatar and banner URLs exist or are empty
        const avatarURL = item.author?.avatar ? item.author.avatar : '/images/avatarNotFound.png';
        const bannerURL = item.author?.banner ? item.author.banner : '/images/bannerNotFound.jpeg';

        contentItem.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.body}</p>
            <p>Tags: ${item.tags.join(', ')}</p>
            <p>Media: <img src="${mediaURL}" alt="Media"></p>
            <p>Created: ${item.created}</p>
            <p>Updated: ${item.updated}</p>
            <p>Author: ${item.author?.name || 'Unknown'}</p>
            <p>Author Email: ${item.author?.email || 'Unknown'}</p>
            <p>Author Avatar: <img src="${avatarURL}" alt="Author Profile Avatar" class="author-avatar"></p>
            <p>Author Banner: <img src="${bannerURL}" alt="Author Profile Banner" class="author-banner"></p>
            <p>Comments: ${item._count.comments}</p>
            <p>Reactions: ${item._count.reactions}</p>
        `;

        contentItemContainer.appendChild(contentItem);
        contentContainer.appendChild(contentItemContainer);
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
            updateButtonState(data);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(data.length / itemsPerPage)) {
            currentPage++;
            renderContent(data);
            updateButtonState(data);
            
            // Scroll to the top of the page
            window.scrollTo(0, 0);
        }
    });
}

// Add this function to update button state
function updateButtonState(data) {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    prevButton.disabled = currentPage === 1;

    nextButton.disabled = currentPage >= Math.ceil(data.length / itemsPerPage);
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
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
        const response = await fetch('https://api.noroff.dev/api/v1/social/posts', options);
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