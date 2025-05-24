function showLoginMessage() {
    // Hide all content except the navbar
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.style.display = 'none';
    
    const footer = document.querySelector('.footer');
    if (footer) footer.style.display = 'none';

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

// Check auth immediately when script loads
document.addEventListener('DOMContentLoaded', () => {
    checkAuth().then(isAuthenticated => {
        if (!isAuthenticated) {
            // Prevent any further page initialization
            return;
        }
    });
}); 