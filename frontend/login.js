document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    window.location.href = "/dashboard";
});


document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Get the username and password
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    // In a real application, you would validate these credentials with the server
    // For now, we'll just redirect to the dashboard
    window.location.href = "/dashboard";
});



document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    window.location.href = "index.html";
});




    document.getElementById("loginForm").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        // Simple validation - in a real app, this would be a server request
        if (username && password) {
            // Store the username in sessionStorage for later use
            sessionStorage.setItem('studentId', username);
            window.location.href = "/dashboard";
        } else {
            alert("Please enter both username and password");
        }
    });