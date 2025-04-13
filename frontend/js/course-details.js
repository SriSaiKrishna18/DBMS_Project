// Course details functionality
document.addEventListener('DOMContentLoaded', function() {
    // Setup course details modal
    setupCourseDetailsModal();
    
    // Setup tab navigation in course details modal
    setupTabNavigation();
    
    // Add event delegation for course cards
    document.addEventListener('click', function(e) {
        // Check if clicked element is a course card or a child of a course card
        const courseCard = e.target.closest('.course-card');
        if (courseCard) {
            const courseId = courseCard.getAttribute('data-course-id');
            console.log('Course card clicked:', courseId);
            openCourseDetailsModal(courseId);
        }
        
        // Check if clicked element is a view details button
        if (e.target.classList.contains('view-details-btn')) {
            e.stopPropagation(); // Prevent event bubbling
            const courseCard = e.target.closest('.course-card');
            if (courseCard) {
                const courseId = courseCard.getAttribute('data-course-id');
                console.log('View details button clicked:', courseId);
                openCourseDetailsModal(courseId);
            }
        }
    });
});

function setupCourseDetailsModal() {
    // Get all close buttons in modals
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
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
    
    // Load course data
    loadCourseData(courseId);
    
    // Show the modal
    modal.style.display = 'block';
}

function loadCourseData(courseId) {
    console.log('Loading course data for:', courseId);
    
    // Sample course data - in a real app, fetch from API
    const courseData = {
        'CS101': {
            code: 'CS101',
            title: 'Introduction to Computer Science',
            credits: 3,
            department: 'Computer Science',
            instructor: 'Dr. John Smith',
            semester: 'Fall 2023',
            description: 'An introductory course to computer science concepts and programming fundamentals. Topics include basic programming constructs, data types, algorithms, and problem-solving techniques.'
        },
        'CS201': {
            code: 'CS201',
            title: 'Data Structures',
            credits: 4,
            department: 'Computer Science',
            instructor: 'Dr. Emily Johnson',
            semester: 'Fall 2023',
            description: 'A comprehensive study of data structures and algorithms. Topics include arrays, linked lists, stacks, queues, trees, graphs, sorting, and searching algorithms.'
        },
        'CS301': {
            code: 'CS301',
            title: 'Database Systems',
            credits: 3,
            department: 'Computer Science',
            instructor: 'Dr. Michael Brown',
            semester: 'Fall 2023',
            description: 'Introduction to database design, implementation, and management. Topics include data models, normalization, SQL, transaction processing, and database security.'
        },
        'MATH101': {
            code: 'MATH101',
            title: 'Calculus I',
            credits: 4,
            department: 'Mathematics',
            instructor: 'Dr. Robert Chen',
            semester: 'Fall 2023',
            description: 'Introduction to differential and integral calculus. Topics include limits, derivatives, applications of derivatives, integrals, and the fundamental theorem of calculus.'
        }
    };
    
    // Get course data
    const course = courseData[courseId];
    if (!course) {
        console.error('Course data not found for:', courseId);
        return;
    }
    
    // Update modal title and code
    document.getElementById('course-modal-title').textContent = course.title;
    document.getElementById('course-modal-code').textContent = course.code;
    
    // Update overview tab
    document.getElementById('course-credits').textContent = course.credits;
    document.getElementById('course-department').textContent = course.department;
    document.getElementById('course-instructor').textContent = course.instructor;
    document.getElementById('course-semester').textContent = course.semester;
    document.getElementById('course-description-text').textContent = course.description;
    
    // Load syllabus
    loadCourseSyllabus(courseId);
    
    // Load materials
    loadCourseMaterials(courseId);
    
    // Load assignments
    loadCourseAssignments(courseId);
}

function loadCourseSyllabus(courseId) {
    // Sample syllabus data - in a real app, fetch from API
    const syllabusData = {
        'CS101': `
            <h3>Course Objectives</h3>
            <p>This course aims to introduce students to the fundamental concepts of computer science and programming.</p>
            
            <h3>Learning Outcomes</h3>
            <ul>
                <li>Understand basic programming concepts</li>
                <li>Write simple programs using a high-level programming language</li>
                <li>Apply problem-solving techniques to computational problems</li>
                <li>Understand basic algorithms and data structures</li>
            </ul>
            
            <h3>Weekly Schedule</h3>
            <table class="syllabus-table">
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Topic</th>
                        <th>Readings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Introduction to Computer Science</td>
                        <td>Chapter 1</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Basic Syntax and Data Types</td>
                        <td>Chapter 2</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Variables and Operators</td>
                        <td>Chapter 3</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Control Structures</td>
                        <td>Chapter 4</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Functions</td>
                        <td>Chapter 5</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>Arrays and Strings</td>
                        <td>Chapter 6</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>Midterm Exam</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>Introduction to Object-Oriented Programming</td>
                        <td>Chapter 7</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>Classes and Objects</td>
                        <td>Chapter 8</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>Inheritance and Polymorphism</td>
                        <td>Chapter 9</td>
                    </tr>
                    <tr>
                        <td>11</td>
                        <td>Exception Handling</td>
                        <td>Chapter 10</td>
                    </tr>
                    <tr>
                        <td>12</td>
                        <td>File I/O</td>
                        <td>Chapter 11</td>
                    </tr>
                    <tr>
                        <td>13</td>
                        <td>Introduction to Algorithms</td>
                        <td>Chapter 12</td>
                    </tr>
                    <tr>
                        <td>14</td>
                        <td>Review</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>15</td>
                        <td>Final Exam</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Assessment</h3>
            <ul>
                <li>Assignments: 30%</li>
                <li>Midterm Exam: 30%</li>
                <li>Final Exam: 40%</li>
            </ul>
        `,
        'CS201': `
            <h3>Course Objectives</h3>
            <p>This course aims to provide a comprehensive understanding of data structures and algorithms.</p>
            
            <h3>Learning Outcomes</h3>
            <ul>
                <li>Understand and implement various data structures</li>
                <li>Analyze algorithm efficiency using Big O notation</li>
                <li>Apply appropriate data structures to solve computational problems</li>
                <li>Implement and analyze sorting and searching algorithms</li>
            </ul>
            
            <h3>Weekly Schedule</h3>
            <table class="syllabus-table">
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Topic</th>
                        <th>Readings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Introduction to Data Structures</td>
                        <td>Chapter 1</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Algorithm Analysis</td>
                        <td>Chapter 2</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Arrays and Linked Lists</td>
                        <td>Chapter 3</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Stacks</td>
                        <td>Chapter 4</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Queues</td>
                        <td>Chapter 5</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>Trees</td>
                        <td>Chapter 6</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>Midterm Exam</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>Binary Search Trees</td>
                        <td>Chapter 7</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>AVL Trees and Red-Black Trees</td>
                        <td>Chapter 8</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>Heaps and Priority Queues</td>
                        <td>Chapter 9</td>
                    </tr>
                    <tr>
                        <td>11</td>
                        <td>Graphs</td>
                        <td>Chapter 10</td>
                    </tr>
                    <tr>
                        <td>12</td>
                        <td>Sorting Algorithms</td>
                        <td>Chapter 11</td>
                    </tr>
                    <tr>
                        <td>13</td>
                        <td>Searching Algorithms</td>
                        <td>Chapter 12</td>
                    </tr>
                    <tr>
                        <td>14</td>
                        <td>Review</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>15</td>
                        <td>Final Exam</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Assessment</h3>
            <ul>
                <li>Assignments: 30%</li>
                <li>Midterm Exam: 30%</li>
                <li>Final Exam: 40%</li>
            </ul>
        `,
        'CS301': `
            <h3>Course Objectives</h3>
            <p>This course aims to provide a comprehensive understanding of database systems.</p>
            
            <h3>Learning Outcomes</h3>
            <ul>
                <li>Design and implement relational database schemas</li>
                <li>Write complex SQL queries</li>
                <li>Understand database normalization principles</li>
                <li>Apply transaction processing concepts</li>
            </ul>
            
            <h3>Weekly Schedule</h3>
            <table class="syllabus-table">
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Topic</th>
                        <th>Readings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Introduction to Database Systems</td>
                        <td>Chapter 1</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Relational Model</td>
                        <td>Chapter 2</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>SQL Basics</td>
                        <td>Chapter 3</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Advanced SQL</td>
                        <td>Chapter 4</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Database Design</td>
                        <td>Chapter 5</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>Entity-Relationship Model</td>
                        <td>Chapter 6</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>Midterm Exam</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>Normalization</td>
                        <td>Chapter 7</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>Transaction Processing</td>
                        <td>Chapter 8</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>Concurrency Control</td>
                        <td>Chapter 9</td>
                    </tr>
                    <tr>
                        <td>11</td>
                        <td>Database Security</td>
                        <td>Chapter 10</td>
                    </tr>
                    <tr>
                        <td>12</td>
                        <td>NoSQL Databases</td>
                        <td>Chapter 11</td>
                    </tr>
                    <tr>
                        <td>13</td>
                        <td>Big Data and Data Warehousing</td>
                        <td>Chapter 12</td>
                    </tr>
                    <tr>
                        <td>14</td>
                        <td>Review</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>15</td>
                        <td>Final Exam</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Assessment</h3>
            <ul>
                <li>Assignments: 30%</li>
                <li>Midterm Exam: 30%</li>
                <li>Final Exam: 40%</li>
            </ul>
        `,
        'MATH101': `
            <h3>Course Objectives</h3>
            <p>This course aims to introduce students to the fundamental concepts of calculus.</p>
            
            <h3>Learning Outcomes</h3>
            <ul>
                <li>Understand the concept of limits and continuity</li>
                <li>Calculate derivatives of various functions</li>
                <li>Apply derivatives to solve real-world problems</li>
                <li>Understand the concept of integration</li>
            </ul>
            
            <h3>Weekly Schedule</h3>
            <table class="syllabus-table">
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Topic</th>
                        <th>Readings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Functions and Models</td>
                        <td>Chapter 1</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Limits and Continuity</td>
                        <td>Chapter 2</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Derivatives</td>
                        <td>Chapter 3</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Differentiation Rules</td>
                        <td>Chapter 4</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Applications of Derivatives</td>
                        <td>Chapter 5</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>Curve Sketching</td>
                        <td>Chapter 6</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>Midterm Exam</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>Integrals</td>
                        <td>Chapter 7</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>Techniques of Integration</td>
                        <td>Chapter 8</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>Applications of Integration</td>
                        <td>Chapter 9</td>
                    </tr>
                    <tr>
                        <td>11</td>
                        <td>Improper Integrals</td>
                        <td>Chapter 10</td>
                    </tr>
                    <tr>
                        <td>12</td>
                        <td>Infinite Series</td>
                        <td>Chapter 11</td>
                    </tr>
                    <tr>
                        <td>13</td>
                        <td>Power Series</td>
                        <td>Chapter 12</td>
                    </tr>
                    <tr>
                        <td>14</td>
                        <td>Review</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>15</td>
                        <td>Final Exam</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Assessment</h3>
            <ul>
                <li>Assignments: 30%</li>
                <li>Midterm Exam: 30%</li>
                <li>Final Exam: 40%</li>
            </ul>
        `
    };
    
    // Get syllabus content element
    const syllabusContent = document.getElementById('syllabus-content');
    if (syllabusContent) {
        syllabusContent.innerHTML = syllabusData[courseId] || '<p>Syllabus not available.</p>';
    }
}

function loadCourseMaterials(courseId) {
    // Sample materials data - in a real app, fetch from API
    const materialsData = {
        'CS101': [
            { id: 1, title: 'Introduction to Programming', type: 'pdf', description: 'Lecture notes for week 1', url: '#' },
            { id: 2, title: 'Basic Syntax', type: 'pdf', description: 'Lecture notes for week 2', url: '#' },
            { id: 3, title: 'Programming Basics', type: 'ppt', description: 'Presentation slides for week 3', url: '#' },
            { id: 4, title: 'Control Structures Tutorial', type: 'video', description: 'Video tutorial on if-else and loops', url: '#' },
            { id: 5, title: 'Functions and Arrays', type: 'pdf', description: 'Lecture notes for weeks 5-6', url: '#' }
        ],
        'CS201': [
            { id: 1, title: 'Data Structures Overview', type: 'pdf', description: 'Lecture notes for week 1', url: '#' },
            { id: 2, title: 'Arrays and Linked Lists', type: 'pdf', description: 'Lecture notes for week 2', url: '#' },
            { id: 3, title: 'Stacks and Queues', type: 'video', description: 'Video tutorial on implementation', url: '#' },
            { id: 4, title: 'Trees Implementation', type: 'code', description: 'Sample code for tree implementations', url: '#' },
            { id: 5, title: 'Graph Algorithms', type: 'pdf', description: 'Lecture notes on graph traversal', url: '#' }
        ],
        'CS301': [
            { id: 1, title: 'Database Concepts', type: 'pdf', description: 'Introduction to database systems', url: '#' },
            { id: 2, title: 'SQL Basics', type: 'pdf', description: 'SQL commands and syntax', url: '#' },
            { id: 3, title: 'ER Diagrams', type: 'ppt', description: 'Entity-Relationship modeling', url: '#' },
            { id: 4, title: 'Normalization Examples', type: 'pdf', description: 'Examples of database normalization', url: '#' },
            { id: 5, title: 'SQL Practice Problems', type: 'doc', description: 'Practice problems for SQL queries', url: '#' }
        ],
        'MATH101': [
            { id: 1, title: 'Functions and Models', type: 'pdf', description: 'Lecture notes for week 1', url: '#' },
            { id: 2, title: 'Limits and Derivatives', type: 'pdf', description: 'Lecture notes for week 2', url: '#' },
            { id: 3, title: 'Differentiation Rules', type: 'ppt', description: 'Presentation on differentiation techniques', url: '#' },
            { id: 4, title: 'Practice Problems', type: 'doc', description: 'Practice problems for weeks 1-2', url: '#' },
            { id: 5, title: 'Integration Techniques', type: 'pdf', description: 'Lecture notes on integration', url: '#' }
        ]
    };
    
    // Get materials list element
    const materialsList = document.getElementById('materials-list');
    if (materialsList) {
        materialsList.innerHTML = '';
        
        const materials = materialsData[courseId] || [];
        
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
    // Sample assignments data - in a real app, fetch from API
    const assignmentsData = {
        'CS101': [
            { 
                id: 1,
                title: 'Programming Basics Assignment',
                description: 'Implement a simple calculator program using the concepts learned in class.',
                due_date: '2023-05-10',
                marks: 20,
                status: 'Not Started'
            },
            { 
                id: 2,
                title: 'Control Structures Assignment',
                description: 'Implement various control structures to solve given problems.',
                due_date: '2023-05-20',
                marks: 25,
                status: 'Not Started'
            },
            { 
                id: 3,
                title: 'Functions and Arrays Assignment',
                description: 'Create functions to manipulate arrays and solve problems.',
                due_date: '2023-05-30',
                marks: 30,
                status: 'Not Started'
            }
        ],
        'CS201': [
            { 
                id: 4,
                title: 'Linked List Implementation',
                description: 'Implement a doubly linked list with insertion, deletion, and traversal operations.',
                due_date: '2023-05-12',
                marks: 30,
                status: 'Not Started'
            },
            { 
                id: 5,
                title: 'Stack and Queue Implementation',
                description: 'Implement stack and queue data structures and their operations.',
                due_date: '2023-05-22',
                marks: 30,
                status: 'Not Started'
            },
            { 
                id: 6,
                title: 'Tree Traversal Algorithms',
                description: 'Implement and compare different tree traversal algorithms.',
                due_date: '2023-06-01',
                marks: 40,
                status: 'Not Started'
            }
        ],
        'CS301': [
            { 
                id: 7,
                title: 'Database Design',
                description: 'Design a database schema for a given scenario.',
                due_date: '2023-05-15',
                marks: 30,
                status: 'Not Started'
            },
            { 
                id: 8,
                title: 'SQL Queries',
                description: 'Write SQL queries to retrieve and manipulate data.',
                due_date: '2023-05-25',
                marks: 35,
                status: 'Not Started'
            },
            { 
                id: 9,
                title: 'Normalization Exercise',
                description: 'Normalize a given database schema to 3NF.',
                due_date: '2023-06-05',
                marks: 35,
                status: 'Not Started'
            }
        ],
        'MATH101': [
            { 
                id: 10,
                title: 'Limits and Derivatives',
                description: 'Solve problems related to limits and derivatives.',
                due_date: '2023-05-15',
                marks: 25,
                status: 'Not Started'
            },
            { 
                id: 11,
                title: 'Applications of Derivatives',
                description: 'Solve real-world problems using derivatives.',
                due_date: '2023-05-25',
                marks: 30,
                status: 'Not Started'
            },
            { 
                id: 12,
                title: 'Integration Techniques',
                description: 'Apply various integration techniques to solve problems.',
                due_date: '2023-06-05',
                marks: 30,
                status: 'Not Started'
            }
        ]
    };
    
    // Get assignments list element
    const assignmentsList = document.getElementById('course-assignments-list');
    if (assignmentsList) {
        assignmentsList.innerHTML = '';
        
        const assignments = assignmentsData[courseId] || [];
        
        if (assignments.length === 0) {
            assignmentsList.innerHTML = '<p>No assignments available.</p>';
            return;
        }
        
        assignments.forEach(assignment => {
            const assignmentItem = document.createElement('div');
            assignmentItem.className = 'assignment-item';
            
            assignmentItem.innerHTML = `
                <div class="assignment-header">
                    <h4>${assignment.title}</h4>
                    <span class="status-badge status-${assignment.status.toLowerCase().replace(' ', '-')}">${assignment.status}</span>
                </div>
                <div class="assignment-details">
                    <p>${assignment.description}</p>
                    <p><strong>Due Date:</strong> ${assignment.due_date}</p>
                    <p><strong>Marks:</strong> ${assignment.marks}</p>
                </div>
                <button class="btn-primary submit-assignment-btn" data-assignment-id="${assignment.id}">Submit Assignment</button>
            `;
            
            assignmentsList.appendChild(assignmentItem);
        });
        
        // Add event listeners to submit buttons
        const submitButtons = assignmentsList.querySelectorAll('.submit-assignment-btn');
        submitButtons.forEach(button => {
            button.addEventListener('click', function() {
                const assignmentId = this.getAttribute('data-assignment-id');
                openAssignmentModal(courseId, assignmentId);
            });
        });
    }
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
        case 'image':
        case 'jpg':
        case 'png':
            return 'fas fa-file-image';
        case 'video':
        case 'mp4':
            return 'fas fa-file-video';
        case 'audio':
        case 'mp3':
            return 'fas fa-file-audio';
        case 'code':
            return 'fas fa-file-code';
        case 'link':
            return 'fas fa-link';
        default:
            return 'fas fa-file';
    }
}

function openAssignmentModal(courseId, assignmentId) {
    console.log('Opening assignment modal for course:', courseId, 'assignment:', assignmentId);
    
    // Get the modal
    const modal = document.getElementById('assignment-submission-modal');
    if (!modal) {
        console.error('Assignment submission modal not found');
        return;
    }
    
    // Set the course and assignment IDs as data attributes
    modal.setAttribute('data-course-id', courseId);
    modal.setAttribute('data-assignment-id', assignmentId);
    
    // Get assignment data
    const assignmentData = getAssignmentData(courseId, assignmentId);
    if (!assignmentData) {
        console.error('Assignment data not found');
        return;
    }
    
    // Update modal title
    document.getElementById('assignment-modal-title').textContent = assignmentData.title;
    
    // Update assignment details
    document.getElementById('assignment-description').textContent = assignmentData.description;
    document.getElementById('assignment-due-date').textContent = assignmentData.due_date;
    document.getElementById('assignment-marks').textContent = assignmentData.marks;
    
    // Show the modal
    modal.style.display = 'block';
}

function getAssignmentData(courseId, assignmentId) {
    // Sample assignments data - in a real app, fetch from API
    const assignmentsData = {
        'CS101': [
            { 
                id: 1,
                title: 'Programming Basics Assignment',
                description: 'Implement a simple calculator program using the concepts learned in class.',
                due_date: '2023-05-10',
                marks: 20,
                status: 'Not Started'
            },
            { 
                id: 2,
                title: 'Control Structures Assignment',
                description: 'Implement various control structures to solve given problems.',
                due_date: '2023-05-20',
                marks: 25,
                status: 'Not Started'
            },
            { 
                id: 3,
                title: 'Functions and Arrays Assignment',
                description: 'Create functions to manipulate arrays and solve problems.',
                due_date: '2023-05-30',
                marks: 30,
                status: 'Not Started'
            }
        ],
        'CS201': [
            { 
                id: 4,
                title: 'Linked List Implementation',
                description: 'Implement a doubly linked list with insertion, deletion, and traversal operations.',
                due_date: '2023-05-12',
                marks: 30,
                status: 'Not Started'
            },
            { 
                id: 5,
                title: 'Stack and Queue Implementation',
                description: 'Implement stack and queue data structures and their operations.',
                due_date: '2023-05-22',
                marks: 30,
                status: 'Not Started'
            },
            { 
                id: 6,
                title: 'Tree Traversal Algorithms',
                description: 'Implement and compare different tree traversal algorithms.',
                due_date: '2023-06-01',
                marks: 40,
                status: 'Not Started'
            }
        ],
        'CS301': [
            { 
                id: 7,
                title: 'Database Design',
                description: 'Design a database schema for a given scenario.',
                due_date: '2023-05-15',
                marks: 30,
                status: 'Not Started'
            },
            { 
                id: 8,
                title: 'SQL Queries',
                description: 'Write SQL queries to retrieve and manipulate data.',
                due_date: '2023-05-25',
                marks: 35,
                status: 'Not Started'
            },
            { 
                id: 9,
                title: 'Normalization Exercise',
                description: 'Normalize a given database schema to 3NF.',
                due_date: '2023-06-05',
                marks: 35,
                status: 'Not Started'
            }
        ],
        'MATH101': [
            { 
                id: 10,
                title: 'Limits and Derivatives',
                description: 'Solve problems related to limits and derivatives.',
                due_date: '2023-05-15',
                marks: 25,
                status: 'Not Started'
            },
            { 
                id: 11,
                title: 'Applications of Derivatives',
                description: 'Solve real-world problems using derivatives.',
                due_date: '2023-05-25',
                marks: 30,
                status: 'Not Started'
            },
            { 
                id: 12,
                title: 'Integration Techniques',
                description: 'Apply various integration techniques to solve problems.',
                due_date: '2023-06-05',
                marks: 30,
                status: 'Not Started'
            }
        ]
    };
    
    // Find the assignment in the course
    const assignments = assignmentsData[courseId] || [];
    return assignments.find(a => a.id == assignmentId);
}

// Add event listener for assignment submission
document.addEventListener('DOMContentLoaded', function() {
    // Setup assignment submission form
    setupAssignmentSubmission();
});

// Add this to your existing setupAssignmentSubmission function
function setupAssignmentSubmission() {
    const submitForm = document.getElementById('assignment-submission-form');
    if (submitForm) {
        submitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the course and assignment IDs
            const modal = document.getElementById('assignment-submission-modal');
            const courseId = modal.getAttribute('data-course-id');
            const assignmentId = modal.getAttribute('data-assignment-id');
            
            // Get form data
            const formData = new FormData(this);
            
            // In a real app, send the form data to the server
            console.log('Submitting assignment:', courseId, assignmentId);
            console.log('Form data:', Object.fromEntries(formData));
            
            // Show success message
            alert('Assignment submitted successfully!');
            
            // Close the modal
            modal.style.display = 'none';
            
            // Reset the form
            this.reset();
            document.getElementById('file-name-display').textContent = 'No file chosen';
        });
    }
    
    // Setup file input display
    const fileInput = document.getElementById('assignment-file');
    const fileNameDisplay = document.getElementById('file-name-display');
    
    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
            } else {
                fileNameDisplay.textContent = 'No file chosen';
            }
        });
    }
    
    // Close modal when clicking the close button
    const closeButton = document.querySelector('#assignment-submission-modal .close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            const modal = document.getElementById('assignment-submission-modal');
            modal.style.display = 'none';
        });
    }
}