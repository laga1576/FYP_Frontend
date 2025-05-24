// Function to load navbar
async function loadNavbar() {
    try {
        const response = await fetch('/navbar.html');
        const html = await response.text();
        document.getElementById('navbar-placeholder').innerHTML = html;
        
        // Set active link based on current page
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });

        // Check session status
        const sessionResponse = await fetch('https://resumexpert-dev.onrender.com/api/check-session', {
            credentials: 'include'
        });
        const sessionData = await sessionResponse.json();
        
        const navRight = document.querySelector('.nav-right');
        if (sessionData.loggedIn) {
            // User is logged in
            navRight.innerHTML = `
                <span>Welcome, ${sessionData.username}</span>
                <a href="/login system/logout.html">Logout</a>
            `;
        } else {
            // User is not logged in
            navRight.innerHTML = `
                <a href="/login system/login.html">Log In</a>
                <a href="/login system/register.html">Sign Up</a>
            `;
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

// Function to handle logout
async function handleLogout() {
    window.location.href = '/login system/logout.html';
}

// Load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', loadNavbar); 