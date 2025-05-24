// Hide all content by default
function hideAllContent() {
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.style.display = 'none';
    
    const footer = document.querySelector('.footer');
    if (footer) footer.style.display = 'none';
}

// Show loading state
function showLoadingState() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'auth-loading';
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.backgroundColor = '#ffffff';
    loadingDiv.style.padding = '20px';
    loadingDiv.style.borderRadius = '5px';
    loadingDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    loadingDiv.style.zIndex = '1000';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Verifying authentication...</p>
    `;
    document.body.appendChild(loadingDiv);
}

function showLoginMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '50%';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translate(-50%, -50%)';
    messageDiv.style.backgroundColor = '#f44336';
    messageDiv.style.color = 'white';
    messageDiv.style.padding = '20px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.zIndex = '1000';
    messageDiv.style.textAlign = 'center';
    messageDiv.innerHTML = `
        <h3>Authentication Required</h3>
        <p>Please log in to access this page.</p>
        <p>Redirecting to login page...</p>
    `;
    document.body.appendChild(messageDiv);
}

function showContent() {
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.style.display = 'block';
    
    const footer = document.querySelector('.footer');
    if (footer) footer.style.display = 'block';

    const loadingDiv = document.getElementById('auth-loading');
    if (loadingDiv) loadingDiv.remove();
}

async function checkAuth() {
    try {
        const response = await fetch('https://resumexpert-dev.onrender.com/api/check-session', {
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!data.loggedIn) {
            showLoginMessage();
            setTimeout(() => {
                window.location.href = '../login system/login.html';
            }, 2000);
            return false;
        }
        showContent();
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        showLoginMessage();
        setTimeout(() => {
            window.location.href = '../login system/login.html';
        }, 2000);
        return false;
    }
}

// Initialize auth check when script loads
document.addEventListener('DOMContentLoaded', () => {
    hideAllContent();
    showLoadingState();
    checkAuth();
}); 