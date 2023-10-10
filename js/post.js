//post.js

let jwtToken;


document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded event fired.');
    try {
        const postId = getPostIdFromURL();

        const post = await fetchPostById(postId);

        // Check if the post author is the current user
        const isCurrentUserAuthor = checkIfCurrentUserIsAuthor(post);

        // Update the "Edit" button to be enabled or disabled based on user authorship
        editButton = document.getElementById('editPostButton'); // Remove the "let" keyword here
        editButton.disabled = !isCurrentUserAuthor;

        // Update post details
        updatePostDetails(post);

        // Add event listener to the Delete button
        const deletePostButton = document.getElementById('deletePostButton');
        deletePostButton.addEventListener('click', async () => {
            try {
                // Confirm the user's intent to delete the post
                const confirmDelete = confirm('Are you sure you want to delete this post?');

                if (confirmDelete) {
                    const deleteResult = await deletePost(postId);

                    if (deleteResult) {
                        window.location.href = 'dashboard.html';
                    } else {
                        console.error('Failed to delete the post.');
                    }
                }
            } catch (error) {
                console.error('An error occurred while deleting the post:', error);
            }
        });

        editButton.addEventListener('click', () => {
            openEditPostModal(post);
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }
});

function getPostIdFromURL() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('postId');
}

// Function to fetch a post by its ID
async function fetchPostById(postId) {
    try {
        // Retrieve the JWT token from localStorage
        jwtToken = localStorage.getItem('jwtToken');

        if (!jwtToken) {
            console.error('JWT token not found in localStorage.');
            return null;
        }

        // Fetch the post details using the post ID and include the JWT token in the headers
        const response = await fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });

        if (response.ok) {
            const post = await response.json();
            console.log('Fetched post data:', post);
            return post;
        } else {
            console.error('Failed to fetch post:', response.status);
            return null;
        }
    } catch (error) {
        console.error('An error occurred while fetching the post:', error);
        return null;
    }
}

// Function to delete a post by its ID
async function deletePost(postId) {
    try {
        if (!jwtToken) {
            console.error('JWT token not found in localStorage.');
            return false;
        }

        // Send a DELETE request to delete the post using its ID and include the JWT token in the headers
        const response = await fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });

        if (response.ok) {
            console.log('Post deleted successfully.');
            return true;
        } else {
            console.error('Failed to delete post:', response.status);
            return false;
        }
    } catch (error) {
        console.error('An error occurred while deleting the post:', error);
        return false;
    }
}

// Function to update post details in the HTML
function updatePostDetails(post) {
    if (post) {
        document.getElementById('postId').textContent = post.id || 'Unknown';
        document.getElementById('postTitle').textContent = post.title || 'Unknown';
        document.getElementById('postBody').textContent = post.body || 'No content';
        document.getElementById('postTags').textContent = post.tags ? post.tags.join(', ') : 'No tags';
        document.getElementById('postMedia').src = post.media || '/images/imageNotFound.jpg';
        document.getElementById('postCreated').textContent = post.created || 'Unknown';
        document.getElementById('postUpdated').textContent = post.updated || 'Unknown';
        document.getElementById('postComments').textContent = post._count ? post._count.comments : 'No comments';
        document.getElementById('postReactions').textContent = post._count ? post._count.reactions : 'No reactions';

        if (post._author) {
            document.getElementById('postAuthorName').textContent = post._author.name || 'Unknown';
            document.getElementById('postAuthorEmail').textContent = post._author.email || 'Unknown';
        } else {
            document.getElementById('postAuthorName').textContent = 'Unknown';
            document.getElementById('postAuthorEmail').textContent = 'Unknown';
        }
    } else {
        console.error('Post not found or an error occurred while fetching.');
    }
}

// Function to check if the current user is the author of the post
function checkIfCurrentUserIsAuthor(post) {
    try {
        if (!jwtToken) {
            console.error('JWT token not found in localStorage.');
            return false; // User is not authenticated
        }

        // Decode the JWT token to get the user's ID (assuming it contains user information)
        const tokenParts = jwtToken.split('.');
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        const currentUserId = tokenPayload.id;

        // Check if the post has an author ID and if it matches the current user's ID
        return post._author && post._author.id === currentUserId;
    } catch (error) {
        console.error('An error occurred while checking if the current user is the author:', error);
        return false; // Error occurred
    }
}

function openEditPostModal(post) {

    console.log('Opening edit modal...');

    // Get the editing modal
    const modal = document.getElementById('editPostModal');

    // Ensure the modal element exists
    if (!modal) {
        console.error('Edit Post Modal not found');
        return;
    }

    console.log('Modal:', modal);

    // Set the modal to display as a block
    modal.style.display = 'block';

    // Populate the editing form with the post data
    document.getElementById('editPostTitle').value = post.title || '';
    document.getElementById('editPostBody').value = post.body || '';
    document.getElementById('editPostTags').value = post.tags ? post.tags.join(', ') : '';
    document.getElementById('editPostMedia').value = post.media || '';

    // Get the close button and add a click event listener
    const closeBtn = modal.querySelector('.close');
    console.log('Close Button:', closeBtn);
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Get the "Change" button and add a click event listener to send the POST request
    const changeBtn = document.getElementById('editPostChangeButton'); 
    console.log('Change Button:', changeBtn);
    changeBtn.addEventListener('click', () => {
        // Get the edited post data from the modal inputs
        const editedPostData = {
            title: document.getElementById('editPostTitle').value,
            body: document.getElementById('editPostBody').value,
            tags: document.getElementById('editPostTags').value.split(','),
            media: document.getElementById('editPostMedia').value,
        };

        // Send a POST request to update the post content
        fetch(`https://api.noroff.dev/api/v1/social/posts/${post.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(editedPostData),
        })
            .then((response) => {
                if (response.ok) {
                    modal.style.display = 'none';
                    console.log('Post updated successfully');
                    
                } else {
                    console.error('Failed to update post:', response.status);
                }
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
    });
}