let currentPage = 1;
const itemsPerPage = 5;
const contentContainer = document.getElementById('content-container');
let jwtToken; 

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
            <button class="view-post-button" data-post-id="${item.id}">View Post</button> <!-- Add this button -->
        `;

        contentItemContainer.appendChild(contentItem);
        contentContainer.appendChild(contentItemContainer);

        const viewPostButton = contentItemContainer.querySelector('.view-post-button');
        viewPostButton.addEventListener('click', () => {
            // Redirect to post.html with the post ID as a query parameter
            const postId = viewPostButton.getAttribute('data-post-id');
            window.location.href = `post.html?postId=${postId}`;
        });
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

function updateButtonState(data) {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    prevButton.disabled = currentPage === 1;

    nextButton.disabled = currentPage >= Math.ceil(data.length / itemsPerPage);
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Retrieve the JWT token from localStorage
        jwtToken = localStorage.getItem('jwtToken');

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
        let data = await response.json();

        if (response.ok) {
            // Extract unique tags from the data
            const allTags = data.reduce((tags, item) => {
                item.tags.forEach((tag) => {
                    if (!tags.includes(tag)) {
                        tags.push(tag);
                    }
                });
                return tags;
            }, []);

            // Generate tag buttons dynamically
            const tagContainer = document.querySelector('.tags');
            allTags.forEach((tag) => {
                const tagButton = document.createElement('button');
                tagButton.classList.add('tag-button');
                tagButton.textContent = tag;
                tagButton.addEventListener('click', () => {
                    toggleTag(tag);
                });
                tagContainer.appendChild(tagButton);
            });

            renderContent(data);
            handlePagination(data);
        } else {
            console.error('Failed to fetch content:', response.status);
        }

        // Add event listener for pressing Enter in the search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch(data);
            }
        });

        // Add event listener for the search button
        const searchButton = document.getElementById('searchButton');
        searchButton.addEventListener('click', () => {
            performSearch(data);
        });

        // Function to perform search
        function performSearch(data) {
            const searchTerm = searchInput.value.trim().toLowerCase();

            // Filter data based on the search term
            const filteredData = data.filter((item) => {
                const title = (item.title || '').toLowerCase();
                const body = (item.body || '').toLowerCase();
                return title.includes(searchTerm) || body.includes(searchTerm);
            });

            currentPage = 1; // Reset to the first page when filtering
            renderContent(filteredData);
            handlePagination(filteredData);
        }

        // Function to toggle selected tags
        const selectedTags = new Set();

        function toggleTag(tag) {
            if (selectedTags.has(tag)) {
                selectedTags.delete(tag);
            } else {
                selectedTags.add(tag);
            }

            const tagButtons = document.querySelectorAll('.tag-button');
            tagButtons.forEach((tagButton) => {
                if (selectedTags.has(tagButton.textContent)) {
                    tagButton.classList.add('selected-tag');
                } else {
                    tagButton.classList.remove('selected-tag');
                }
            });

            const filteredData = data.filter((item) => {
                return selectedTags.size === 0 || item.tags.some((tag) => selectedTags.has(tag));
            });

            currentPage = 1;
            renderContent(filteredData);
            handlePagination(filteredData);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }

    // Attach event listeners to "Delete" buttons
function attachDeletePostListeners() {
    const deletePostButtons = document.querySelectorAll('.delete-post-button');
    deletePostButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', () => {
            const postId = deleteButton.getAttribute('data-post-id');
            // Call the function to handle the deletion of the post
            handleDeletePost(postId);
        });
    });
}

// Function to handle the deletion of a post
async function handleDeletePost(postId) {
    try {
        const response = await fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });

        if (response.ok) {
            // Post deleted successfully, you may want to remove it from the UI
            console.log('Post deleted successfully');
            // After deleting a post, reload the page to reflect the changes
            window.location.reload();
        } else {
            console.error('Failed to delete post:', response.status);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

   // Function to open the create post modal
function openCreatePostModal() {
    const modal = document.getElementById('createPostModal');

    // Ensure the modal element exists
    if (!modal) {
        console.error('Create Post Modal not found');
        return;
    }

    // Show the modal
    modal.style.display = 'block';

    // Get the close button and add a click event listener
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Get the cancel button and add a click event listener
    const cancelBtn = modal.querySelector('.cancel');
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Get the create button and add a click event listener
    const createBtn = modal.querySelector('.create');
    createBtn.addEventListener('click', () => {
        // Get the new post data from the modal inputs
        const newPostData = {
            title: document.getElementById('postTitle').value,
            body: document.getElementById('postBody').value,
            tags: document.getElementById('postTags').value.split(','),
            media: document.getElementById('postMedia').value,
        };

        // Send a POST request to create a new post
        fetch('https://api.noroff.dev/api/v1/social/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(newPostData),
        })
        .then((response) => {
            if (response.ok) {
                
                modal.style.display = 'none';
                clearCreatePostForm();
                console.log('Post created successfully');

                window.location.reload();
            } else {
                console.error('Failed to create post:', response.status);
            }
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
    });
}

// Function to clear the create post form
function clearCreatePostForm() {
    document.getElementById('createPostForm').reset();
}

// Call the openCreatePostModal function when the "Create Post" button is clicked
document.getElementById('createPostButton').addEventListener('click', () => {
    openCreatePostModal();
});

// Clear the create post form
function clearCreatePostForm() {
    document.getElementById('postTitle').value = '';
    document.getElementById('postBody').value = '';
    document.getElementById('postTags').value = '';
    document.getElementById('postMedia').value = '';
}

    // Call the functions to handle create, update, and delete actions
    createPost();
   
});