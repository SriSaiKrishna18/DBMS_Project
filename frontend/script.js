// Global variables
// At the beginning of your script.js file
let currentStudent = {};
let currentStudentId = '';

// Add this function to initialize the app
function initApp() {
    // Check if user is logged in
    currentStudentId = sessionStorage.getItem('studentId');
    
    if (!currentStudentId) {
        // Redirect to login if no student ID is found
        window.location.href = '/';
        return;
    }
    
    // Load student data
    loadStudentData(currentStudentId);
    
    // Initialize other components
    initDashboard();
    initLogout();
    // ... other init functions
}

// Update the logout function
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear session storage
            sessionStorage.removeItem('studentId');
            
            // Show notification and redirect
            showNotification('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        });
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    setupThemeToggle();
    
    // ... rest of your existing initialization code
});

// Call initApp when the document is ready
document.addEventListener('DOMContentLoaded', initApp); // Default student to load

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard navigation
    initDashboard();
    
    // Load default student data
    loadStudentData(DEFAULT_STUDENT_ID);
});

// Initialize dashboard navigation
function initDashboard() {
    const dashboardItems = document.querySelectorAll('.dashboard-item');
    const contentSections = document.querySelectorAll('.content');
    
    dashboardItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // Remove active class from all items
            dashboardItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show the target content section
            const targetSection = document.getElementById(targetPage);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                
                // Load specific data for the section if needed
                if (targetPage === 'attendance' && currentStudent) {
                    loadAttendanceData(currentStudent.student_id);
                } else if (targetPage === 'courses' && currentStudent) {
                    loadCoursesData(currentStudent.student_id);
                } else if (targetPage === 'results' && currentStudent) {
                    loadResultsData(currentStudent.student_id);
                } else if (targetPage === 'analysis' && currentStudent) {
                    loadAnalysisData(currentStudent.student_id);
                }
            }
        });
    });
    
    // Set home as active by default
    const homeItem = document.querySelector('[data-page="home"]');
    if (homeItem) {
        homeItem.classList.add('active');
    }
    
    // Show home content
    const homeContent = document.getElementById('home');
    if (homeContent) {
        homeContent.classList.remove('hidden');
    }
}

// Load student data
async function loadStudentData(studentId) {
    try {
        const response = await fetch(`/api/student/${studentId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch student data');
        }
        
        const data = await response.json();
        currentStudent = data;
        
        // Update UI with student data
        updateStudentProfile(data);
        
        // Load initial data for sections
        loadAttendanceData(studentId);
        loadCoursesData(studentId);
        loadResultsData(studentId);
        loadAnalysisData(studentId);
        
    } catch (error) {
        console.error('Error loading student data:', error);
        // Display error message to user
    }
}

// Update student profile in UI
function updateStudentProfile(student) {
    // Update profile dropdown
    const profileName = document.querySelector('.profile-name');
    const profileYear = document.querySelector('.profile-year');
    
    if (profileName) {
        profileName.textContent = student.name;
    }
    
    if (profileYear) {
        profileYear.textContent = `${student.branch} - Year ${Math.ceil(student.current_semester / 2)}`;
    }
    
    // Update welcome message
    const welcomeMessage = document.querySelector('.welcome-text h1');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${student.name}!`;
    }
    
    // Update CGPA display
    const cgpaElement = document.querySelector('.cgpa-value');
    if (cgpaElement) {
        cgpaElement.textContent = student.cgpa;
    }
}

// Load attendance data
async function loadAttendanceData(studentId) {
    try {
        const response = await fetch(`/api/student/${studentId}/attendance`);
        if (!response.ok) {
            throw new Error('Failed to fetch attendance data');
        }
        
        const data = await response.json();
        
        // Calculate overall attendance
        let totalClasses = 0;
        let totalAttended = 0;
        
        data.forEach(course => {
            totalClasses += parseInt(course.total_classes);
            totalAttended += parseInt(course.attended_classes);
        });
        
        const overallPercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
        
        // Update UI with attendance data
        updateAttendanceUI(data, overallPercentage);
        
    } catch (error) {
        console.error('Error loading attendance data:', error);
        // Display error message to user
    }
}

// Update attendance UI
function updateAttendanceUI(attendanceData, overallPercentage) {
    // Update overall attendance percentage
    const progressValue = document.querySelector('.progress-value');
    if (progressValue) {
        progressValue.textContent = `${overallPercentage}%`;
    }
    
    // Update progress circle
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        progressCircle.style.background = `conic-gradient(var(--primary-color) ${overallPercentage}%, #e6e6e6 0)`;
    }
    
    // Update attendance table
    const attendanceTable = document.querySelector('.attendance-table table');
    if (attendanceTable) {
        let tableHTML = `
            <thead>
                <tr>
                    <th>Course</th>
                    <th>Total Classes</th>
                    <th>Attended</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        attendanceData.forEach(course => {
            const percentage = Math.round((parseInt(course.attended_classes) / parseInt(course.total_classes)) * 100);
            
            tableHTML += `
                <tr>
                    <td>${course.course_name}</td>
                    <td>${course.total_classes}</td>
                    <td>${course.attended_classes}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        });
        
        tableHTML += '</tbody>';
        attendanceTable.innerHTML = tableHTML;
    }
}

// Load courses data
async function loadCoursesData(studentId) {
    try {
        const response = await fetch(`/api/student/${studentId}/courses`);
        if (!response.ok) {
            throw new Error('Failed to fetch courses data');
        }
        
        const data = await response.json();
        
        // Update UI with courses data
        updateCoursesUI(data);
        
    } catch (error) {
        console.error('Error loading courses data:', error);
        // Display error message to user
    }
}

// Update courses UI
function updateCoursesUI(coursesData) {
    const coursesGrid = document.querySelector('.courses-grid');
    if (coursesGrid) {
        let gridHTML = '';
        
        // Define some colors for variety
        const headerColors = ['blue', 'green', 'purple', 'orange', 'teal'];
        
        coursesData.forEach((course, index) => {
            const colorClass = headerColors[index % headerColors.length];
            
            gridHTML += `
                <div class="course-card">
                    <div class="course-header ${colorClass}">
                        <h3>${course.course_name}</h3>
                        <p>Course ID: ${course.course_id}</p>
                    </div>
                    <div class="course-body">
                        <p><strong>Department:</strong> ${course.department}</p>
                        <p><strong>Credits:</strong> ${course.credits}</p>
                        <p><strong>Semester:</strong> ${course.semester}</p>
                    </div>
                    <div class="course-footer">
                        <button class="btn-secondary" data-course-id="${course.course_id}">View Details</button>
                    </div>
                </div>
            `;
        });
        
        coursesGrid.innerHTML = gridHTML;
    }
}

// Load results data
async function loadResultsData(studentId) {
    try {
        const response = await fetch(`/api/student/${studentId}/results`);
        if (!response.ok) {
            throw new Error('Failed to fetch results data');
        }
        
        const data = await response.json();
        
        // Update UI with results data
        updateResultsUI(data);
        
    } catch (error) {
        console.error('Error loading results data:', error);
        // Display error message to user
    }
}

// Update results UI
function updateResultsUI(resultsData) {
    const resultsContainer = document.getElementById('results');
    if (resultsContainer) {
        let resultsHTML = '<h1>Academic Results</h1>';
        
        // Group results by semester
        const resultsBySemester = {};
        
        resultsData.forEach(result => {
            if (!resultsBySemester[result.semester]) {
                resultsBySemester[result.semester] = [];
            }
            resultsBySemester[result.semester].push(result);
        });
        
        // Create tables for each semester
        for (const semester in resultsBySemester) {
            resultsHTML += `
                <div class="results-section">
                    <h2>Semester ${semester}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Course ID</th>
                                <th>Credits</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            resultsBySemester[semester].forEach(result => {
                resultsHTML += `
                    <tr>
                        <td>${result.course_name}</td>
                        <td>${result.course_id}</td>
                        <td>${result.credits}</td>
                        <td>${result.grade}</td>
                    </tr>
                `;
            });
            
            resultsHTML += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        resultsContainer.innerHTML = resultsHTML;
    }
}

// Load analysis data
async function loadAnalysisData(studentId) {
    try {
        const semesterResponse = await fetch(`/api/student/${studentId}/semester-records`);
        if (!semesterResponse.ok) {
            throw new Error('Failed to fetch semester records');
        }
        
        const semesterData = await semesterResponse.json();
        
        // Update UI with analysis data
        updateAnalysisUI(semesterData);
        
    } catch (error) {
        console.error('Error loading analysis data:', error);
        // Display error message to user
    }
}

// Update analysis UI
function updateAnalysisUI(semesterData) {
    const analysisContainer = document.getElementById('analysis');
    if (analysisContainer) {
        let analysisHTML = `
            <h1>Academic Performance Analysis</h1>
            <div class="analysis-container">
                <div class="chart-container">
                    <h2>SGPA Trend</h2>
                    <canvas id="sgpaChart"></canvas>
                </div>
                <div class="semester-records">
                    <h2>Semester Records</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Semester</th>
                                <th>SGPA</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Sort semester data by semester number
        semesterData.sort((a, b) => parseInt(a.semester_number) - parseInt(b.semester_number));
        
        semesterData.forEach(record => {
            analysisHTML += `
                <tr>
                    <td>${record.semester_number}</td>
                    <td>${record.sgpa}</td>
                </tr>
            `;
        });
        
        analysisHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        analysisContainer.innerHTML = analysisHTML;
        
        // Create SGPA chart
        createSGPAChart(semesterData);
    }
}

// Create SGPA chart
function createSGPAChart(semesterData) {
    const ctx = document.getElementById('sgpaChart');
    if (ctx) {
        // Extract data for chart
        const labels = semesterData.map(record => `Semester ${record.semester_number}`);
        const sgpaValues = semesterData.map(record => parseFloat(record.sgpa));
        
        // Create chart using a simple canvas drawing (since we don't have Chart.js)
        const canvas = ctx.getContext('2d');
        const width = ctx.width;
        const height = ctx.height;
        
        // Draw a simple representation
        canvas.clearRect(0, 0, width, height);
        canvas.fillStyle = '#3f72af';
        canvas.font = '12px Arial';
        
        // Draw text indicating we need Chart.js
        canvas.fillText('To display the chart properly, include Chart.js library', 10, 50);
        canvas.fillText('Sample data: ' + sgpaValues.join(', '), 10, 70);
    }
}


// Update the updateStudentProfile function to include profile page data
function updateStudentProfile(student) {
    // Update profile dropdown
    const profileName = document.querySelector('.profile-name');
    const profileYear = document.querySelector('.profile-year');
    
    if (profileName) {
        profileName.textContent = student.name;
    }
    
    if (profileYear) {
        profileYear.textContent = `${student.branch} - Year ${Math.ceil(student.current_semester / 2)}`;
    }
    
    // Update welcome message
    const welcomeMessage = document.querySelector('.welcome-text h1');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${student.name}!`;
    }
    
    // Update CGPA display
    const cgpaElement = document.querySelector('.cgpa-value');
    if (cgpaElement) {
        cgpaElement.textContent = student.cgpa;
    }
    
    // Update profile page details
    const studentName = document.querySelector('.student-name');
    const studentRoll = document.querySelector('.student-roll');
    const studentDepartment = document.querySelector('.student-department');
    const studentSemester = document.querySelector('.student-semester');
    const studentCgpa = document.querySelector('.student-cgpa');
    const studentEmail = document.querySelector('.student-email');
    const studentPhone = document.querySelector('.student-phone');
    
    if (studentName) studentName.textContent = student.name;
    if (studentRoll) studentRoll.textContent = student.roll_number;
    if (studentDepartment) studentDepartment.textContent = student.branch;
    if (studentSemester) studentSemester.textContent = student.current_semester;
    if (studentCgpa) studentCgpa.textContent = student.cgpa;
    if (studentEmail) studentEmail.textContent = student.email;
    if (studentPhone) studentPhone.textContent = student.phone_number;
}


// Update the updateResultsUI function to include grade colors
function updateResultsUI(resultsData) {
    const resultsContainer = document.getElementById('results');
    if (resultsContainer) {
        let resultsHTML = '<h1>Academic Results</h1>';
        
        // Group results by semester
        const resultsBySemester = {};
        
        resultsData.forEach(result => {
            if (!resultsBySemester[result.semester]) {
                resultsBySemester[result.semester] = [];
            }
            resultsBySemester[result.semester].push(result);
        });
        
        // Create tables for each semester
        for (const semester in resultsBySemester) {
            resultsHTML += `
                <div class="results-section">
                    <h2>Semester ${semester}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Course ID</th>
                                <th>Credits</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            resultsBySemester[semester].forEach(result => {
                resultsHTML += `
                    <tr>
                        <td>${result.course_name}</td>
                        <td>${result.course_id}</td>
                        <td>${result.credits}</td>
                        <td class="grade-${result.grade}">${result.grade}</td>
                    </tr>
                `;
            });
            
            resultsHTML += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        resultsContainer.innerHTML = resultsHTML;
    }
}



// Update the createSGPAChart function to use Chart.js
function createSGPAChart(semesterData) {
    const ctx = document.getElementById('sgpaChart');
    if (ctx) {
        // Extract data for chart
        const labels = semesterData.map(record => `Semester ${record.semester_number}`);
        const sgpaValues = semesterData.map(record => parseFloat(record.sgpa));
        
        // Check if Chart.js is available
        if (typeof Chart !== 'undefined') {
            // Destroy existing chart if any
            if (window.sgpaChartInstance) {
                window.sgpaChartInstance.destroy();
            }
            
            // Create new chart
            window.sgpaChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'SGPA',
                        data: sgpaValues,
                        backgroundColor: 'rgba(63, 114, 175, 0.2)',
                        borderColor: 'rgba(63, 114, 175, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(63, 114, 175, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: Math.max(0, Math.min(...sgpaValues) - 1),
                            max: Math.min(10, Math.max(...sgpaValues) + 1)
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `SGPA: ${context.parsed.y}`;
                                }
                            }
                        }
                    }
                }
            });
        } else {
            // Fallback if Chart.js is not available
            ctx.innerHTML = '<div class="error-message">Chart.js library is required to display the SGPA chart.</div>';
        }
    }
}



// Add showLoading and hideLoading functions
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.id = `${containerId}-loading`;
        container.appendChild(loadingDiv);
    }
}

function hideLoading(containerId) {
    const loadingDiv = document.getElementById(`${containerId}-loading`);
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Add showError function
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        container.appendChild(errorDiv);
    }
}

// Update loadAttendanceData to include loading and error handling
async function loadAttendanceData(studentId) {
    try {
        showLoading('attendance');
        
        const response = await fetch(`/api/student/${studentId}/attendance`);
        if (!response.ok) {
            throw new Error('Failed to fetch attendance data');
        }
        
        const data = await response.json();
        
        // Calculate overall attendance
        let totalClasses = 0;
        let totalAttended = 0;
        
        data.forEach(course => {
            totalClasses += parseInt(course.total_classes);
            totalAttended += parseInt(course.attended_classes);
        });
        
        const overallPercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
        
        // Update UI with attendance data
        updateAttendanceUI(data, overallPercentage);
        
    } catch (error) {
        console.error('Error loading attendance data:', error);
        showError('attendance', 'Failed to load attendance data. Please try again later.');
    } finally {
        hideLoading('attendance');
    }
}




// ... existing code ...

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard navigation
    initDashboard();
    
    // Load default student data
    loadStudentData(DEFAULT_STUDENT_ID);
    
    // Initialize logout button
    initLogout();
    
    // Initialize profile editing
    initProfileEditing();
    
    // Initialize chart type selector
    initChartTypeSelector();
});

// Add this after the initChartTypeSelector function

// Initialize feedback functionality
function initFeedback() {
    const feedbackForm = document.getElementById('feedback-form');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const subject = document.getElementById('feedback-subject').value;
            const type = document.getElementById('feedback-type').value;
            const message = document.getElementById('feedback-message').value;
            
            // Get current date and time
            const now = new Date();
            const dateTime = now.toISOString().replace('T', ' ').substring(0, 19);
            
            // Create feedback object
            const feedback = {
                student_id: currentStudent ? currentStudent.student_id : 'unknown',
                student_name: currentStudent ? currentStudent.name : 'Unknown Student',
                subject: subject,
                type: type,
                message: message,
                timestamp: dateTime
            };
            
            try {
                // Send feedback to server
                const response = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(feedback)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to submit feedback');
                }
                
                // Show success message
                showNotification('Thank you! Your feedback has been submitted successfully.', 'success');
                
                // Reset form
                feedbackForm.reset();
                
            } catch (error) {
                console.error('Error submitting feedback:', error);
                showNotification('Failed to submit feedback. Please try again later.', 'error');
            }
        });
    }
}

// Update the DOMContentLoaded event listener to include initFeedback
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard navigation
    initDashboard();
    
    // Load default student data
    loadStudentData(DEFAULT_STUDENT_ID);
    
    // Initialize logout button
    initLogout();
    
    // Initialize profile editing
    initProfileEditing();
    
    // Initialize chart type selector
    initChartTypeSelector();
    
    // Initialize feedback functionality
    initFeedback();
});


// Initialize logout functionality
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // In a real application, you would clear session/local storage
            // and redirect to login page
            showNotification('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = '/'; // Redirect to home/login page
            }, 1500);
        });
    }
}

// Initialize profile editing
function initProfileEditing() {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const modal = document.getElementById('edit-profile-modal');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('edit-profile-form');
    
    // Open modal
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Pre-fill form with current data
            document.getElementById('edit-email').value = currentStudent.email || '';
            document.getElementById('edit-phone').value = currentStudent.phone_number || '';
            
            modal.style.display = 'block';
        });
    }
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('edit-email').value;
            const phone = document.getElementById('edit-phone').value;
            const password = document.getElementById('edit-password').value;
            const confirmPassword = document.getElementById('edit-confirm-password').value;
            
            // Validate form
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            // In a real application, you would send this data to the server
            // For now, we'll just update the UI
            if (currentStudent) {
                currentStudent.email = email;
                currentStudent.phone_number = phone;
                
                // Update profile display
                const studentEmail = document.querySelector('.student-email');
                const studentPhone = document.querySelector('.student-phone');
                
                if (studentEmail) studentEmail.textContent = email;
                if (studentPhone) studentPhone.textContent = phone;
                
                showNotification('Profile updated successfully', 'success');
                modal.style.display = 'none';
            }
        });
    }
}

// Initialize chart type selector
function initChartTypeSelector() {
    const chartTypeSelector = document.getElementById('chart-type');
    const refreshChartBtn = document.getElementById('refresh-chart');
    
    if (refreshChartBtn && chartTypeSelector) {
        refreshChartBtn.addEventListener('click', function() {
            if (currentStudent) {
                const chartType = chartTypeSelector.value;
                loadAnalysisData(currentStudent.student_id, chartType);
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            container.removeChild(notification);
        }, 500);
    }, 3000);
}

// Update loadAnalysisData to include chart type
async function loadAnalysisData(studentId, chartType = 'line') {
    try {
        showLoading('analysis');
        
        // Fetch semester records
        const semesterResponse = await fetch(`/api/student/${studentId}/semester-records`);
        if (!semesterResponse.ok) {
            throw new Error('Failed to fetch semester records');
        }
        const semesterData = await semesterResponse.json();
        
        // Fetch results for subject performance
        const resultsResponse = await fetch(`/api/student/${studentId}/results`);
        if (!resultsResponse.ok) {
            throw new Error('Failed to fetch results data');
        }
        const resultsData = await resultsResponse.json();
        
        // Update UI with analysis data
        updateAnalysisUI(semesterData, resultsData, chartType);
        
    } catch (error) {
        console.error('Error loading analysis data:', error);
        showError('analysis', 'Failed to load analysis data. Please try again later.');
    } finally {
        hideLoading('analysis');
    }
}

// Update analysis UI
function updateAnalysisUI(semesterData, resultsData, chartType) {
    // Sort semester data by semester number
    semesterData.sort((a, b) => parseInt(a.semester_number) - parseInt(b.semester_number));
    
    // Calculate performance metrics
    const sgpaValues = semesterData.map(record => parseFloat(record.sgpa));
    const avgSgpa = sgpaValues.reduce((sum, sgpa) => sum + sgpa, 0) / sgpaValues.length;
    const highestSgpa = Math.max(...sgpaValues);
    const lowestSgpa = Math.min(...sgpaValues);
    
    // Determine SGPA trend
    let trend = 'Stable';
    if (sgpaValues.length >= 2) {
        const firstHalf = sgpaValues.slice(0, Math.floor(sgpaValues.length / 2));
        const secondHalf = sgpaValues.slice(Math.floor(sgpaValues.length / 2));
        
        const firstHalfAvg = firstHalf.reduce((sum, sgpa) => sum + sgpa, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, sgpa) => sum + sgpa, 0) / secondHalf.length;
        
        if (secondHalfAvg > firstHalfAvg + 0.2) {
            trend = 'Improving';
        } else if (secondHalfAvg < firstHalfAvg - 0.2) {
            trend = 'Declining';
        }
    }
    
    // Update metrics display
    document.getElementById('avg-sgpa').textContent = avgSgpa.toFixed(2);
    document.getElementById('highest-sgpa').textContent = highestSgpa.toFixed(2);
    document.getElementById('lowest-sgpa').textContent = lowestSgpa.toFixed(2);
    document.getElementById('sgpa-trend').textContent = trend;
    
    // Update semester records table
    const semesterRecordsTable = document.getElementById('semester-records-table');
    if (semesterRecordsTable) {
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Semester</th>
                        <th>SGPA</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        semesterData.forEach(record => {
            const sgpa = parseFloat(record.sgpa);
            let status = 'Average';
            let statusClass = '';
            
            if (sgpa >= 9.0) {
                status = 'Excellent';
                statusClass = 'grade-A';
            } else if (sgpa >= 8.0) {
                status = 'Very Good';
                statusClass = 'grade-B';
            } else if (sgpa >= 7.0) {
                status = 'Good';
                statusClass = 'grade-C';
            } else if (sgpa < 6.0) {
                status = 'Needs Improvement';
                statusClass = 'grade-E';
            }
            
            tableHTML += `
                <tr>
                    <td>${record.semester_number}</td>
                    <td>${record.sgpa}</td>
                    <td class="${statusClass}">${status}</td>
                </tr>
            `;
        });
        
        tableHTML += '</tbody></table>';
        semesterRecordsTable.innerHTML = tableHTML;
    }
    
    // Create SGPA chart
    createSGPAChart(semesterData, chartType);
    
    // Create subject performance chart
    createSubjectPerformanceChart(resultsData);
}

// Create SGPA chart with different chart types
function createSGPAChart(semesterData, chartType = 'line') {
    const ctx = document.getElementById('sgpaChart');
    if (ctx && typeof Chart !== 'undefined') {
        // Extract data for chart
        const labels = semesterData.map(record => `Semester ${record.semester_number}`);
        const sgpaValues = semesterData.map(record => parseFloat(record.sgpa));
        
        // Destroy existing chart if any
        if (window.sgpaChartInstance) {
            window.sgpaChartInstance.destroy();
        }
        
        // Create new chart
        window.sgpaChartInstance = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: 'SGPA',
                    data: sgpaValues,
                    backgroundColor: chartType === 'line' ? 'rgba(63, 114, 175, 0.2)' : 'rgba(63, 114, 175, 0.7)',
                    borderColor: 'rgba(63, 114, 175, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(63, 114, 175, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: Math.max(0, Math.min(...sgpaValues) - 1),
                        max: Math.min(10, Math.max(...sgpaValues) + 1)
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `SGPA: ${context.parsed.y}`;
                            }
                        }
                    }
                }
            }
        });
    } else {
        // Fallback if Chart.js is not available
        if (ctx) {
            ctx.innerHTML = '<div class="error-message">Chart.js library is required to display the SGPA chart.</div>';
        }
    }
}

// Create subject performance chart
function createSubjectPerformanceChart(resultsData) {
    const ctx = document.getElementById('subjectChart');
    if (ctx && typeof Chart !== 'undefined') {
        // Group results by semester
        const resultsBySemester = {};
        
        resultsData.forEach(result => {
            if (!resultsBySemester[result.semester]) {
                resultsBySemester[result.semester] = [];
            }
            resultsBySemester[result.semester].push(result);
        });
        
        // Get the latest semester
        const latestSemester = Math.max(...Object.keys(resultsBySemester).map(Number));
        const latestResults = resultsBySemester[latestSemester] || [];
        
        // Convert grades to numeric values for chart
        const gradeValues = {
            'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
        };
        
        // Prepare data for chart
        const labels = latestResults.map(result => result.course_name);
        const data = latestResults.map(result => gradeValues[result.grade] || 0);
        
        // Destroy existing chart if any
        if (window.subjectChartInstance) {
            window.subjectChartInstance.destroy();
        }
        
        // Create new chart
        window.subjectChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Grade Points',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Grade Points'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Courses'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const index = context.dataIndex;
                                const grade = latestResults[index].grade;
                                return `Grade: ${grade} (${context.parsed.y} points)`;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: `Semester ${latestSemester} Performance`
                    }
                }
            }
        });
    } else {
        // Fallback if Chart.js is not available
        if (ctx) {
            ctx.innerHTML = '<div class="error-message">Chart.js library is required to display the subject performance chart.</div>';
        }
    }
}

// At the beginning of your script.js file

// Add this function to your script.js file
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear any stored student data
            sessionStorage.removeItem('studentId');
            
            // Show notification
            showNotification('Logged out successfully', 'success');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        });
    }
}

// Make sure to call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code
    
    // Initialize logout functionality
    initLogout();
});


// Add this function to calculate overall attendance
function calculateOverallAttendance(attendanceData) {
    if (!attendanceData || attendanceData.length === 0) {
        return 0;
    }
    
    let totalClasses = 0;
    let attendedClasses = 0;
    
    attendanceData.forEach(record => {
        totalClasses += parseInt(record.total_classes);
        attendedClasses += parseInt(record.attended_classes);
    });
    
    return totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
}

// Update the loadAttendanceData function
async function loadAttendanceData(studentId) {
    try {
        showLoading('attendance');
        
        const response = await fetch(`/api/student/${studentId}/attendance`);
        if (!response.ok) {
            throw new Error('Failed to fetch attendance data');
        }
        
        const attendanceData = await response.json();
        
        // Calculate overall attendance
        const overallAttendance = calculateOverallAttendance(attendanceData);
        
        // Update attendance on home page
        const homeAttendanceValue = document.querySelector('.stats .stat-card:nth-child(2) .stat-value');
        if (homeAttendanceValue) {
            homeAttendanceValue.textContent = `${overallAttendance}%`;
        }
        
        // Update attendance on attendance page
        const attendanceProgressValue = document.querySelector('.progress-circle .progress-value');
        if (attendanceProgressValue) {
            attendanceProgressValue.textContent = `${overallAttendance}%`;
        }
        
        // Update attendance table
        updateAttendanceTable(attendanceData);
        
    } catch (error) {
        console.error('Error loading attendance data:', error);
        showError('attendance', 'Failed to load attendance data. Please try again later.');
    } finally {
        hideLoading('attendance');
    }
}

// Update the loadStudentData function to also update attendance
// Update the loadAttendanceData function
async function loadAttendanceData(studentId) {
    try {
        showLoading('attendance');
        
        const response = await fetch(`/api/student/${studentId}/attendance`);
        if (!response.ok) {
            throw new Error('Failed to fetch attendance data');
        }
        
        const attendanceData = await response.json();
        
        // Calculate overall attendance
        const overallAttendance = calculateOverallAttendance(attendanceData);
        
        // Update attendance on home page
        const homeAttendanceValue = document.querySelector('.stats .stat-card:nth-child(2) .stat-value');
        if (homeAttendanceValue) {
            homeAttendanceValue.textContent = `${overallAttendance}%`;
        }
        
        // Update attendance on attendance page
        const attendanceProgressValue = document.querySelector('.progress-circle .progress-value');
        if (attendanceProgressValue) {
            attendanceProgressValue.textContent = `${overallAttendance}%`;
        }
        
        // Update attendance table - use the correct function name
        updateAttendanceUI(attendanceData, overallAttendance);
        
    } catch (error) {
        console.error('Error loading attendance data:', error);
        showError('attendance', 'Failed to load attendance data. Please try again later.');
    } finally {
        hideLoading('attendance');
    }
}


// ... existing code ...

// Update the login function to handle non-existent users
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        showLoading('login');
        
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No user found with the given username');
            } else if (response.status === 401) {
                throw new Error('Invalid password');
            } else {
                throw new Error('Login failed');
            }
        }
        
        const data = await response.json();
        
        // Store student ID in session storage
        sessionStorage.setItem('studentId', data.student_id);
        
        // Show success notification
        showNotification('Login successful', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message, 'error');
    } finally {
        hideLoading('login');
    }
}

// Add this function to show notifications for login errors
function showLoginError(message) {
    const errorContainer = document.getElementById('login-error');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        // Fallback to notification if error container doesn't exist
        showNotification(message, 'error');
    }
}

// ... existing code ...

// ... existing code ...



// ... existing code ...

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard navigation
    initDashboard();
    
    // Load default student data
    loadStudentData(DEFAULT_STUDENT_ID);
    
    // Initialize logout button
    initLogout();
    
    // Initialize profile editing
    initProfileEditing();
    
    // Initialize chart type selector
    initChartTypeSelector();
    
    // Initialize login form handler
    initLoginForm();
});

// Add this function to initialize the login form
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}




// ... existing code ...

// Initialize dashboard navigation
function initDashboard() {
    const menuItems = document.querySelectorAll('.sidebar li');
    const contentSections = document.querySelectorAll('.content');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            // Update active menu item
            menuItems.forEach(menuItem => menuItem.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected content section
            contentSections.forEach(section => {
                if (section.id === page) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
            
            // Load specific data for the selected page if needed
            if (page === 'feedback' && !document.querySelector('#feedback .feedback-container')) {
                initFeedbackUI();
            }
        });
    });
}

// Initialize feedback UI
function initFeedbackUI() {
    const feedbackSection = document.getElementById('feedback');
    if (feedbackSection) {
        // Create feedback UI if it doesn't exist
        if (!document.querySelector('#feedback .feedback-container')) {
            feedbackSection.innerHTML = `
                <h1>Provide Feedback</h1>
                <div class="feedback-container">
                    <form id="feedback-form">
                        <div class="form-group">
                            <label for="feedback-subject">Subject</label>
                            <input type="text" id="feedback-subject" name="subject" required placeholder="Enter feedback subject">
                        </div>
                        <div class="form-group">
                            <label for="feedback-type">Feedback Type</label>
                            <select id="feedback-type" name="type" required>
                                <option value="">Select feedback type</option>
                                <option value="suggestion">Suggestion</option>
                                <option value="complaint">Complaint</option>
                                <option value="appreciation">Appreciation</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="feedback-message">Your Feedback</label>
                            <textarea id="feedback-message" name="message" rows="6" required placeholder="Please provide your detailed feedback here..."></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Submit Feedback</button>
                    </form>
                    <div class="feedback-info">
                        <h3>Why Your Feedback Matters</h3>
                        <p>Your feedback helps us improve our services and address any issues you might be facing. We appreciate your time and input.</p>
                        <div class="feedback-guidelines">
                            <h4>Guidelines for Effective Feedback:</h4>
                            <ul>
                                <li>Be specific and clear about your concerns or suggestions</li>
                                <li>Provide relevant details and examples</li>
                                <li>Suggest possible solutions if applicable</li>
                                <li>Be respectful and constructive</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            
            // Initialize the feedback form event listener
            initFeedback();
        }
    }
}

// Initialize feedback functionality
function initFeedback() {
    const feedbackForm = document.getElementById('feedback-form');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const subject = document.getElementById('feedback-subject').value;
            const type = document.getElementById('feedback-type').value;
            const message = document.getElementById('feedback-message').value;
            
            // Get current date and time
            const now = new Date();
            const dateTime = now.toISOString().replace('T', ' ').substring(0, 19);
            
            // Create feedback object
            const feedback = {
                student_id: currentStudent ? currentStudent.student_id : 'unknown',
                student_name: currentStudent ? currentStudent.name : 'Unknown Student',
                subject: subject,
                type: type,
                message: message,
                timestamp: dateTime
            };
            
            try {
                // Send feedback to server
                const response = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(feedback)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to submit feedback');
                }
                
                // Show success message
                showNotification('Thank you! Your feedback has been submitted successfully.', 'success');
                
                // Reset form
                feedbackForm.reset();
                
            } catch (error) {
                console.error('Error submitting feedback:', error);
                showNotification('Failed to submit feedback. Please try again later.', 'error');
            }
        });
    }
}
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return; // Exit if element doesn't exist
    
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleUI(savedTheme);
    
    // Add click event to theme toggle button
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update HTML attribute
        htmlElement.setAttribute('data-theme', newTheme);
        
        // Save preference to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Update UI
        updateThemeToggleUI(newTheme);
    });
}

// Update theme toggle button UI based on current theme
function updateThemeToggleUI(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return; // Exit if element doesn't exist
    
    const icon = themeToggle.querySelector('i');
    if (!icon) return; // Exit if icon doesn't exist
    
    if (theme === 'dark') {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard navigation
    initDashboard();
    
    // Load default student data if on dashboard page
    const studentId = sessionStorage.getItem('studentId') || DEFAULT_STUDENT_ID;
    if (document.querySelector('.dashboard-container')) {
        loadStudentData(studentId);
    }
    
    // Initialize logout button
    initLogout();
    
    // Initialize profile editing
    initProfileEditing();
    
    // Initialize chart type selector
    initChartTypeSelector();
    
    // Initialize login form handler
    initLoginForm();

    initFeedback();
});

// ... existing code ...
// ... existing code ...



// Add this function to update the attendance circle color based on percentage
function updateAttendanceCircle(percentage) {
    const progressCircle = document.querySelector('.progress-circle');
    const progressValue = progressCircle.querySelector('.progress-value');
    
    progressValue.textContent = percentage + '%';
    
    // Set color based on percentage
    if (percentage < 75) {
        progressCircle.style.borderColor = '#e74c3c'; // Red for below 75%
        progressValue.style.color = '#e74c3c';
    } else if (percentage >= 75 && percentage < 80) {
        progressCircle.style.borderColor = '#f39c12'; // Dark yellow for 75-80%
        progressValue.style.color = '#f39c12';
    } else {
        progressCircle.style.borderColor = '#2ecc71'; // Green for 80% and above
        progressValue.style.color = '#2ecc71';
    }
}

// Add this at the beginning of your script.js file


// Theme toggle setup


// ... rest of your existing JavaScript code


// // Modify the loadAttendance function to use the new color coding
// async function loadAttendance() {
//     try {
//         const studentId = localStorage.getItem('studentId');
//         const response = await fetch(`/api/student/${studentId}/attendance`);
//         const attendanceData = await response.json();
        
//         if (attendanceData.length === 0) {
//             document.querySelector('.attendance-content').innerHTML = '<p>No attendance records found.</p>';
//             return;
//         }
        
//         // Calculate overall attendance percentage
//         let totalClasses = 0;
//         let totalAttended = 0;
        
//         attendanceData.forEach(record => {
//             totalClasses += parseInt(record.total_classes);
//             totalAttended += parseInt(record.attended_classes);
//         });
        
//         const overallPercentage = Math.round((totalAttended / totalClasses) * 100);
        
//         // Update the attendance circle with color coding
//         updateAttendanceCircle(overallPercentage);
        
//         // Populate the attendance table
//         const tableBody = document.querySelector('.attendance-table tbody');
//         tableBody.innerHTML = '';
        
//         attendanceData.forEach(record => {
//             const percentage = record.attendance_percentage;
//             let rowClass = '';
            
//             // Add class for row color based on percentage
//             if (percentage < 75) {
//                 rowClass = 'low-attendance';
//             } else if (percentage >= 75 && percentage < 80) {
//                 rowClass = 'medium-attendance';
//             } else {
//                 rowClass = 'good-attendance';
//             }
            
//             tableBody.innerHTML += `
//                 <tr class="${rowClass}">
//                     <td>${record.course_name}</td>
//                     <td>${record.total_classes}</td>
//                     <td>${record.attended_classes}</td>
//                     <td>${percentage}%</td>
//                 </tr>
//             `;
//         });
        
//     } catch (error) {
//         console.error('Error loading attendance data:', error);
//         document.querySelector('.attendance-content').innerHTML = '<p>Error loading attendance data.</p>';
//     }
// }