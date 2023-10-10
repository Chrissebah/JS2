document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Retrieve the post ID from the URL query parameter
        const postId = getPostIdFromURL();

        // Fetch the specific post using the post ID
        const post = await fetchPostById(postId);

        
        updatePostDetails(post);
    } catch (error) {
        console.error('An error occurred:', error);
    }
});

function getPostIdFromURL() {
    // Extract the postId query parameter from the URL
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('postId');
}

async function fetchPostById(postId) {
    try {
        // Retrieve the JWT token from localStorage
        const jwtToken = localStorage.getItem('jwtToken');

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
function updatePostDetails(post) {
    if (post) {
        // Update the post details in the HTML
        document.getElementById('postId').textContent = post.id || 'Unknown';
        document.getElementById('postTitle').textContent = post.title || 'Unknown';
        document.getElementById('postBody').textContent = post.body || 'No content';
        document.getElementById('postTags').textContent = post.tags ? post.tags.join(', ') : 'No tags';
        document.getElementById('postMedia').src = post.media || '/images/imageNotFound.jpg';
        document.getElementById('postCreated').textContent = post.created || 'Unknown';
        document.getElementById('postUpdated').textContent = post.updated || 'Unknown';
        document.getElementById('postComments').textContent = post._count ? post._count.comments : 'No comments';
        document.getElementById('postReactions').textContent = post._count ? post._count.reactions : 'No reactions';

        // Check if '_author' is defined before accessing its properties
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