// Main app functionality
document.addEventListener('DOMContentLoaded', function() {
    // Setup navigation
    setupNavigation();
    
    // Load initial page (home)
    loadPage('home');
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Setup course cards click event
    setupCourseCards();
});

function setupCourseCards() {
    // This function will be called when the courses page is loaded
    console.log('Setting up course cards');
    
    // Use event delegation for course cards
    document.addEventListener('click', function(e) {
        const courseCard = e.target.closest('.course-card');
        if (courseCard) {
            const courseId = courseCard.getAttribute('data-course-id');
            console.log('Course card clicked:', courseId);
            openCourseDetailsModal(courseId);
        }
        
        // Also handle view details button clicks
        if (e.target.classList.contains('view-details-btn')) {
            const courseCard = e.target.closest('.course-card');
            if (courseCard) {
                const courseId = courseCard.getAttribute('data-course-id');
                console.log('View details button clicked:', courseId);
                openCourseDetailsModal(courseId);
                e.stopPropagation(); // Prevent double triggering
            }
        }
    });
}

function openCourseDetailsModal(courseId) {
    console.log('Opening course details modal for:', courseId);
    
    // Get the modal
    const modal = document.getElementById('course-details-modal');
    if (!modal) {
        console.error('Course details modal not found');
        return;
    }
    
    // Set the course ID in the modal
    modal.setAttribute('data-course-id', courseId);
    
    // Update modal title
    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = `Course Details: ${courseId}`;
    }
    
    // Load course data
    loadCourseData(courseId);
    
    // Show the modal
    modal.style.display = 'block';
}

function loadCourseData(courseId) {
    // In a real app, you would fetch this from an API
    // For this demo, we'll use sample data
    
    // Sample course data
    const courseData = {
        'CS101': {
            course_id: 'CS101',
            course_name: 'Introduction to Computer Science',
            instructor: 'Dr. John Smith',
            credits: 3,
            schedule: 'Mon, Wed, Fri 10:00 - 11:00',
            room: 'CS Building 101',
            description: 'An introductory course to computer science concepts and programming.'
        },
        'CS201': {
            course_id: 'CS201',
            course_name: 'Data Structures',
            instructor: 'Dr. Emily Johnson',
            credits: 4,
            schedule: 'Tue, Thu 13:00 - 15:00',
            room: 'CS Building 203',
            description: 'A comprehensive study of data structures and algorithms.'
        },
        'CS301': {
            course_id: 'CS301',
            course_name: 'Database Systems',
            instructor: 'Dr. Michael Brown',
            credits: 3,
            schedule: 'Mon, Wed 14:00 - 15:30',
            room: 'CS Building 305',
            description: 'Introduction to database design, implementation, and management.'
        },
        'MATH101': {
            course_id: 'MATH101',
            course_name: 'Calculus I',
            instructor: 'Dr. Robert Chen',
            credits: 4,
            schedule: 'Mon, Wed, Fri 09:00 - 10:00',
            room: 'Math Building 102',
            description: 'Introduction to differential and integral calculus.'
        }
    };
    
    // Get course data
    const course = courseData[courseId];
    if (!course) {
        console.error('Course data not found for:', courseId);
        return;
    }
    
    // Update course info
    const courseInfo = document.getElementById('course-info');
    if (courseInfo) {
        courseInfo.innerHTML = `
            <div class="course-info-grid">
                <div class="info-item">
                    <h4>Course Code</h4>
                    <p>${course.course_id}</p>
                </div>
                <div class="info-item">
                    <h4>Course Name</h4>
                    <p>${course.course_name}</p>
                </div>
                <div class="info-item">
                    <h4>Instructor</h4>
                    <p>${course.instructor}</p>
                </div>
                <div class="info-item">
                    <h4>Credits</h4>
                    <p>${course.credits}</p>
                </div>
                <div class="info-item">
                    <h4>Schedule</h4>
                    <p>${course.schedule}</p>
                </div>
                <div class="info-item">
                    <h4>Room</h4>
                    <p>${course.room}</p>
                </div>
            </div>
            <div class="course-description">
                <h4>Description</h4>
                <p>${course.description}</p>
            </div>
        `;
    }
    
    // Load materials, assignments, and grades
    loadCourseMaterials(courseId);
    loadCourseAssignments(courseId);
    loadCourseGrades(courseId);
}

// Add this function to load course data
function loadCourses() {
    const coursesGrid = document.querySelector('.courses-grid');
    if (!coursesGrid) return;
    
    // Sample course data - in a real app, fetch from API
    const coursesData = [
        {
            id: '116',
            title: 'Transportation Engineering',
            department: 'Civil Engineering',
            credits: 3,
            semester: 4
        },
        {
            id: '126',
            title: 'Fluid Mechanics',
            department: 'Mechanical Engineering',
            credits: 3,
            semester: 4
        },
        {
            id: '139',
            title: 'Thermodynamics',
            department: 'Mechanical Engineering',
            credits: 3,
            semester: 4
        },
        {
            id: 'CS101',
            title: 'Introduction to Computer Science',
            department: 'Computer Science',
            credits: 3,
            semester: 1
        },
        {
            id: 'CS201',
            title: 'Data Structures',
            department: 'Computer Science',
            credits: 4,
            semester: 2
        },
        {
            id: 'CS301',
            title: 'Database Systems',
            department: 'Computer Science',
            credits: 3,
            semester: 3
        },
        {
            id: 'MATH101',
            title: 'Calculus I',
            department: 'Mathematics',
            credits: 4,
            semester: 1
        }
    ];
    
    // Clear existing courses
    coursesGrid.innerHTML = '';
    
    // Add course cards
    coursesData.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.setAttribute('data-course-id', course.id);
        
        // Determine background color based on department
        let bgColor;
        switch (course.department) {
            case 'Computer Science':
                bgColor = '#4a6cf7';
                break;
            case 'Mathematics':
                bgColor = '#6c5ce7';
                break;
            case 'Civil Engineering':
                bgColor = '#3742fa';
                break;
            case 'Mechanical Engineering':
                bgColor = '#2ed573';
                break;
            default:
                bgColor = '#ff6b6b';
        }
        
        courseCard.innerHTML = `
            <div class="course-header" style="background-color: ${bgColor}">
                <h3>${course.title}</h3>
                <p>Course ID: ${course.id}</p>
            </div>
            <div class="course-info">
                <p><strong>Department:</strong> ${course.department}</p>
                <p><strong>Credits:</strong> ${course.credits}</p>
                <p><strong>Semester:</strong> ${course.semester}</p>
            </div>
            <div class="course-actions">
                <button class="view-details-btn">View Details</button>
                <button class="quick-access-btn"><i class="fas fa-ellipsis-v"></i></button>
            </div>
        `;
        
        coursesGrid.appendChild(courseCard);
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load courses data
    loadCourses();
    
    // Other initialization code...
});

function loadCourseMaterials(courseId) {
    // In a real app, you would fetch this from an API
    // For this demo, we'll use sample data
    
    // Sample materials data
    const materialsData = {
        'CS101': [
            { id: 1, title: 'Introduction to Programming', type: 'pdf', description: 'Lecture notes for week 1', url: '#' },
            { id: 2, title: 'Basic Syntax', type: 'pdf', description: 'Lecture notes for week 2', url: '#' },
            { id: 3, title: 'Programming Basics', type: 'ppt', description: 'Presentation slides for week 3', url: '#' }
        ],
        'CS201': [
            { id: 1, title: 'Data Structures Overview', type: 'pdf', description: 'Lecture notes for week 1', url: '#' },
            { id: 2, title: 'Arrays and Linked Lists', type: 'pdf', description: 'Lecture notes for week 2', url: '#' },
            { id: 3, title: 'Stacks and Queues', type: 'video', description: 'Video tutorial on implementation', url: '#' }
        ],
        'CS301': [
            { id: 1, title: 'Database Concepts', type: 'pdf', description: 'Introduction to database systems', url: '#' },
            { id: 2, title: 'SQL Basics', type: 'pdf', description: 'SQL commands and syntax', url: '#' },
            { id: 3, title: 'ER Diagrams', type: 'ppt', description: 'Entity-Relationship modeling', url: '#' }
        ],
        'MATH101': [
            { id: 1, title: 'Functions and Models', type: 'pdf', description: 'Lecture notes for week 1', url: '#' },
            { id: 2, title: 'Limits and Derivatives', type: 'pdf', description: 'Lecture notes for week 2', url: '#' },
            { id: 3, title: 'Differentiation Rules', type: 'ppt', description: 'Presentation on differentiation techniques', url: '#' }
        ]
    };
    
    // Get materials for the course
    const materials = materialsData[courseId] || [];
    
    // Update materials list
    const materialsList = document.getElementById('materials-list');
    if (materialsList) {
        materialsList.innerHTML = '';
        
        if (materials.length === 0) {
            materialsList.innerHTML = '<p>No materials available.</p>';
            return;
        }
        
        materials.forEach(material => {
            const materialItem = document.createElement('div');
            materialItem.className = 'material-item';
            
            const iconClass = getMaterialIcon(material.type);
            
            materialItem.innerHTML = `
                <div class="material-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="material-content">
                    <h4>${material.title}</h4>
                    <p>${material.description}</p>
                    <a href="${material.url}" class="download-link">Download</a>
                </div>
            `;
            
            materialsList.appendChild(materialItem);
        });
    }
}

function loadCourseAssignments(courseId) {
    // Sample assignments data
    const assignmentsData = {
        'CS101': [
            { id: 1, title: 'Programming Basics Assignment', description: 'Implement a simple calculator program', due_date: '2023-05-10', status: 'Not Started' },
            { id: 2, title: 'Control Structures Assignment', description: 'Implement various control structures', due_date: '2023-05-20', status: 'Not Started' }
        ],
        'CS201': [
            { id: 3, title: 'Linked List Implementation', description: 'Implement a doubly linked list', due_date: '2023-05-12', status: 'Not Started' },
            { id: 4, title: 'Stack and Queue Implementation', description: 'Implement stack and queue data structures', due_date: '2023-05-22', status: 'Not Started' }
        ],
        'CS301': [
            { id: 5, title: 'Database Design', description: 'Design a database schema for a given scenario', due_date: '2023-05-15', status: 'Not Started' },
            { id: 6, title: 'SQL Queries', description: 'Write SQL queries to retrieve and manipulate data', due_date: '2023-05-25', status: 'Not Started' }
        ],
        'MATH101': [
            { id: 7, title: 'Limits and Derivatives', description: 'Solve problems related to limits and derivatives', due_date: '2023-05-15', status: 'Not Started' },
            { id: 8, title: 'Applications of Derivatives', description: 'Solve real-world problems using derivatives', due_date: '2023-05-25', status: 'Not Started' }
        ]
    };
    
    // Get assignments for the course
    const assignments = assignmentsData[courseId] || [];
    
    // Update assignments list
    const assignmentsList = document.getElementById('assignments-list');
    if (assignmentsList) {
        assignmentsList.innerHTML = '';
        
        if (assignments.length === 0) {
            assignmentsList.innerHTML = '<p>No assignments available.</p>';
            return;
        }
        
        assignments.forEach(assignment => {
            const assignmentItem = document.createElement('div');
            assignmentItem.className = 'assignment-item';
            assignmentItem.setAttribute('data-assignment-id', assignment.id);
            
            assignmentItem.innerHTML = `
                <div class="assignment-header">
                    <h4>${assignment.title}</h4>
                    <span class="status-badge status-${assignment.status.toLowerCase().replace(' ', '-')}">${assignment.status}</span>
                </div>
                <div class="assignment-details">
                    <p>${assignment.description}</p>
                    <p><strong>Due Date:</strong> ${assignment.due_date}</p>
                </div>
                <button class="btn-primary submit-assignment-btn">Submit Assignment</button>
            `;
            
            assignmentsList.appendChild(assignmentItem);
        });
        
        // Add event listeners to submit buttons
        const submitButtons = assignmentsList.querySelectorAll('.submit-assignment-btn');
        submitButtons.forEach(button => {
            button.addEventListener('click', function() {
                const assignmentId = this.closest('.assignment-item').getAttribute('data-assignment-id');
                openSubmitAssignmentModal(courseId, assignmentId);
            });
        });
    }
}

function loadCourseGrades(courseId) {
    // Sample grades data
    const gradesData = {
        'CS101': [
            { id: 1, title: 'Assignment 1', score: 85, max_score: 100, weight: 10 },
            { id: 2, title: 'Midterm Exam', score: 78, max_score: 100, weight: 30 },
            { id: 3, title: 'Assignment 2', score: 90, max_score: 100, weight: 10 },
            { id: 4, title: 'Final Exam', score: 82, max_score: 100, weight: 50 }
        ],
        'CS201': [
            { id: 1, title: 'Assignment 1', score: 88, max_score: 100, weight: 15 },
            { id: 2, title: 'Midterm Exam', score: 75, max_score: 100, weight: 25 },
            { id: 3, title: 'Assignment 2', score: 92, max_score: 100, weight: 15 },
            { id: 4, title: 'Final Exam', score: 80, max_score: 100, weight: 45 }
        ],
        'CS301': [
            { id: 1, title: 'Assignment 1', score: 90, max_score: 100, weight: 10 },
            { id: 2, title: 'Midterm Exam', score: 85, max_score: 100, weight: 30 },
            { id: 3, title: 'Assignment 2', score: 95, max_score: 100, weight: 10 },
            { id: 4, title: 'Final Exam', score: 88, max_score: 100, weight: 50 }
        ],
        'MATH101': [
            { id: 1, title: 'Assignment 1', score: 80, max_score: 100, weight: 10 },
            { id: 2, title: 'Midterm Exam', score: 72, max_score: 100, weight: 30 },
            { id: 3, title: 'Assignment 2', score: 85, max_score: 100, weight: 10 },
            { id: 4, title: 'Final Exam', score: 78, max_score: 100, weight: 50 }
        ]
    };
    
    // Get grades for the course
    const grades = gradesData[courseId] || [];
    
    // Update grades list
    const gradesList = document.getElementById('grades-list');
    if (gradesList) {
        gradesList.innerHTML = '';
        
        if (grades.length === 0) {
            gradesList.innerHTML = '<p>No grades available.</p>';
            return;
        }
        
        // Calculate total grade
        let totalWeightedScore = 0;
        let totalWeight = 0;
        
        grades.forEach(grade => {
            const percentage = (grade.score / grade.max_score) * 100;
            const weightedScore = percentage * (grade.weight / 100);
            
            totalWeightedScore += weightedScore;
            totalWeight += grade.weight;
        });
        
        const finalGrade = totalWeight > 0 ? totalWeightedScore : 0;
        const letterGrade = getLetterGrade(finalGrade);
        
        // Add final grade summary
        const gradeSummary = document.createElement('div');
        gradeSummary.className = 'grade-summary';
        gradeSummary.innerHTML = `
            <h4>Final Grade: <span class="grade-${letterGrade}">${letterGrade} (${finalGrade.toFixed(2)}%)</span></h4>
        `;
        gradesList.appendChild(gradeSummary);
        
        // Add grade items
        const gradeTable = document.createElement('table');
        gradeTable.className = 'grade-table';
        gradeTable.innerHTML = `
            <thead>
                <tr>
                    <th>Assessment</th>
                    <th>Score</th>
                    <th>Weight</th>
                    <th>Weighted Score</th>
                </tr>
            </thead>
            <tbody>
                ${grades.map(grade => {
                    const percentage = (grade.score / grade.max_score) * 100;
                    const weightedScore = percentage * (grade.weight / 100);
                    return `
                        <tr>
                            <td>${grade.title}</td>
                            <td>${grade.score}/${grade.max_score} (${percentage.toFixed(2)}%)</td>
                            <td>${grade.weight}%</td>
                            <td>${weightedScore.toFixed(2)}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;
        
        gradesList.appendChild(gradeTable);
    }
}

function getLetterGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

function getMaterialIcon(type) {
    switch (type.toLowerCase()) {
        case 'pdf':
            return 'fas fa-file-pdf';
        case 'doc':
        case 'docx':
            return 'fas fa-file-word';
        case 'ppt':
        case 'pptx':
            return 'fas fa-file-powerpoint';
        case 'xls':
        case 'xlsx':
            return 'fas fa-file-excel';
        case 'zip':
        case 'rar':
            return 'fas fa-file-archive';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return 'fas fa-file-image';
        case 'mp4':
        case 'avi':
        case 'mov':
            return 'fas fa-file-video';
        case 'mp3':
        case 'wav':
            return 'fas fa-file-audio';
        case 'video':
            return 'fas fa-video';
        default:
            return 'fas fa-file';
    }
}

function openSubmitAssignmentModal(courseId, assignmentId) {
    // Get the modal
    const modal = document.getElementById('submit-assignment-modal');
    if (!modal) {
        console.error('Submit assignment modal not found');
        return;
    }
    
    // Set the course ID and assignment ID in the modal
    modal.setAttribute('data-course-id', courseId);
    modal.setAttribute('data-assignment-id', assignmentId);
    
    // Show the modal
    modal.style.display = 'block';
}