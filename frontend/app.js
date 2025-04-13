// DOM Elements
const dashboardItems = document.querySelectorAll('.dashboard-item');
const contentPages = document.querySelectorAll('.content');
const profileDropdown = document.querySelector('.profile-dropdown');
const dropdownContent = document.querySelector('.dropdown-content');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set home page as default active page
    document.getElementById('home').classList.add('active');
    
    // Add event listeners to dashboard items
    dashboardItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Add hover animations to cards and stat items
    addHoverEffects();
    
    // Initialize page animations
    initAnimations();
});

// Page Navigation Function
function navigateToPage(pageId) {
    // Hide all content pages
    contentPages.forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    
    // Remove active class from all dashboard items
    dashboardItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
        
        // Add active class to the selected dashboard item
        const activeItem = document.querySelector(`.dashboard-item[data-page="${pageId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    } else {
        // Default to home page if the target page doesn't exist
        document.getElementById('home').classList.remove('hidden');
        document.getElementById('home').classList.add('active');
    }
    
    // Trigger animation for charts and progress elements
    animateChartElements();
}

// Add hover effects and animations
function addHoverEffects() {
    // Scale effect for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Hover effect for dashboard items
    dashboardItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                this.style.borderLeft = '4px solid white';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.backgroundColor = 'transparent';
                this.style.borderLeft = '4px solid transparent';
            }
        });
    });
}

// Initialize animations
function initAnimations() {
    // Animate progress bars with a delay
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
                bar.style.transition = 'width 1s ease-in-out';
            }, 100);
        });
    }, 500);
    
    // Animate chart bars
    animateChartElements();
}

// Animate chart elements
function animateChartElements() {
    // Animate chart bars with a sequential delay
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
        const height = bar.style.height;
        bar.style.height = '0';
        setTimeout(() => {
            bar.style.height = height;
            bar.style.transition = 'height 1s ease-in-out';
        }, 100 * index);
    });
    
    // Animate progress circle
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        progressCircle.style.background = 'conic-gradient(var(--primary-color) 0%, #e6e6e6 0%)';
        setTimeout(() => {
            progressCircle.style.background = 'conic-gradient(var(--primary-color) 87%, #e6e6e6 0%)';
            progressCircle.style.transition = 'background 1.5s ease-in-out';
        }, 300);
    }
}

// Handle dropdown menu
profileDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown when clicking outside
document.addEventListener('click', function() {
    dropdownContent.style.display = 'none';
});

// Prevent dropdown from closing when clicking inside it
dropdownContent.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Add event listener for the View Dashboard button
document.querySelector('.btn-primary').addEventListener('click', function() {
    navigateToPage('attendance');
});

// Handle search functionality (placeholder)
const searchBar = document.querySelector('.search-bar input');
searchBar.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        alert('Search functionality will be implemented in the future.');
    }
});

// Add event listeners to course detail buttons
const courseButtons = document.querySelectorAll('.course-footer .btn-secondary');
courseButtons.forEach(button => {
    button.addEventListener('click', function() {
        const courseName = this.closest('.course-card').querySelector('h3').textContent;
        alert(`${courseName} details will be displayed here.`);
    });
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add responsive behavior for sidebar
const container = document.querySelector('.container');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

// Check window width on load and resize
function checkWindowSize() {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
}

// Initialize on page load
window.addEventListener('load', checkWindowSize);
window.addEventListener('resize', checkWindowSize);






// Existing app.js code should go here, then add or modify:

// Handle dashboard navigation
document.querySelectorAll('.dashboard-item').forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all items
        document.querySelectorAll('.dashboard-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Hide all content sections
        document.querySelectorAll('.content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // Show selected content
        const pageId = this.getAttribute('data-page');
        document.getElementById(pageId).classList.remove('hidden');
    });
});

// Handle profile link
document.querySelector('.profile-dropdown a:first-child').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Hide all content sections
    document.querySelectorAll('.content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Show profile content
    document.getElementById('profile').classList.remove('hidden');
    
    // Update dashboard active item (optional)
    document.querySelectorAll('.dashboard-item').forEach(i => {
        i.classList.remove('active');
    });
});

// Handle logout
document.querySelector('.profile-dropdown a:last-child').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'login.html';
});

// Set Home as default active page on load
window.addEventListener('DOMContentLoaded', () => {
    // Show home content, hide others
    document.querySelectorAll('.content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById('home').classList.remove('hidden');
    
    // Set home as active in dashboard
    document.querySelector('.dashboard-item[data-page="home"]').classList.add('active');
});





// frontend/app.js
document.addEventListener("DOMContentLoaded", () => {
    fetchAttendance();
  });
  
  function fetchAttendance() {
    fetch('http://localhost:3000/api/attendance')
      .then(res => res.json())
      .then(data => {
        const tableBody = document.querySelector('#attendance-table tbody');
        tableBody.innerHTML = '';
        data.forEach(row => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${row.StudentID || row.Student_ID}</td>
            <td>${row.CourseID || row.Course_ID}</td>
            <td>${row.Percentage || row.Attendance_Percentage}</td>
          `;
          tableBody.appendChild(tr);
        });
      })
      .catch(err => console.error("Failed to load attendance:", err));
  }
  



  // Fetch and display attendance data in a table
function fetchAttendance() {
    fetch('http://localhost:3000/api/attendance')
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.querySelector("#attendance-table tbody");
            tableBody.innerHTML = ""; // Clear existing rows

            data.forEach((record) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${record.student_id}</td>
                    <td>${record.course_id}</td>
                    <td>${record.semester}</td>
                    <td>${record.total_classes}</td>
                    <td>${record.attended_classes}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch((error) => console.error("Error fetching attendance:", error));
}

// Call fetchAttendance when the page loads
document.addEventListener("DOMContentLoaded", () => fetchAttendance());
