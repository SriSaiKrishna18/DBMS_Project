// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Setup course cards click event
    setupCourseCardListeners();
    
    // Setup quick access cards
    setupQuickAccessCards();
    
    // Setup tab navigation in course details modal
    setupTabNavigation();
    
    // Setup modal close buttons
    setupModalCloseButtons();
    
    // Setup assignment submission form
    setupAssignmentSubmission();
});

function setupCourseCardListeners() {
    // Add event listeners to course cards
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course-id');
            openCourseDetailsModal(courseId);
        });
    });
}

// Update the setupQuickAccessCards function
function setupQuickAccessCards() {
    console.log('Setting up quick access cards');
    const quickAccessCards = document.querySelectorAll('.quick-access-card');
    console.log('Found quick access cards:', quickAccessCards.length);
    
    if (quickAccessCards.length === 0) {
        // If no cards found, try to find them by class name
        const cards = document.querySelectorAll('.card');
        console.log('Found cards by alternative selector:', cards.length);
        
        cards.forEach(card => {
            card.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                if (!target) {
                    // Try to determine target from card title
                    const title = this.querySelector('h3')?.textContent.toLowerCase() || '';
                    if (title.includes('timetable')) {
                        openQuickAccessModal('timetable');
                    } else if (title.includes('exam')) {
                        openQuickAccessModal('exams');
                    } else if (title.includes('event')) {
                        openQuickAccessModal('events');
                    } else if (title.includes('message')) {
                        openQuickAccessModal('messages');
                    }
                } else {
                    openQuickAccessModal(target);
                }
            });
        });
    } else {
        quickAccessCards.forEach(card => {
            card.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                console.log('Quick access card clicked:', target);
                openQuickAccessModal(target);
            });
        });
    }
}

// Update the openQuickAccessModal function
function openQuickAccessModal(target) {
    console.log('Opening quick access modal for:', target);
    const modalId = `${target}-modal`;
    const modal = document.getElementById(modalId);
    
    if (!modal) {
        console.error(`Modal with ID ${modalId} not found`);
        return;
    }
    
    // Load data based on target
    switch(target) {
        case 'timetable':
            loadTimetable();
            break;
        case 'exams':
            loadExams();
            break;
        case 'events':
            loadEvents();
            break;
        case 'messages':
            loadMessages();
            break;
    }
    
    // Show the modal
    modal.style.display = 'block';
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

function setupModalCloseButtons() {
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

function setupAssignmentSubmission() {
    const form = document.getElementById('assignment-submission-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const assignmentId = document.getElementById('assignment-id').value;
            const fileInput = document.getElementById('assignment-file');
            const comments = document.getElementById('assignment-comments').value;
            
            if (!fileInput.files[0]) {
                alert('Please select a file to upload');
                return;
            }
            
            // In a real app, you would use FormData to upload the file
            // For this demo, we'll just simulate a successful submission
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                form.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Close modal
                document.getElementById('assignment-modal').style.display = 'none';
                
                // Show success message
                alert('Assignment submitted successfully!');
                
                // Update assignment status in the UI
                updateAssignmentStatus(assignmentId, 'Submitted');
            }, 1500);
        });
    }
}

function openCourseDetailsModal(courseId) {
    // In a real app, you would fetch course details from an API
    // For this demo, we'll use sample data
    
    // Sample course data
    const courses = {
        'CS101': {
            course_id: 'CS101',
            course_name: 'Introduction to Computer Science',
            credits: 3,
            department: 'Computer Science',
            instructor_name: 'Dr. John Smith',
            semester: 'Fall 2023',
            description: 'An introductory course covering the basics of computer science, including programming concepts, algorithms, and problem-solving techniques.'
        },
        'CS201': {
            course_id: 'CS201',
            course_name: 'Data Structures',
            credits: 4,
            department: 'Computer Science',
            instructor_name: 'Dr. Emily Johnson',
            semester: 'Fall 2023',
            description: 'A comprehensive study of data structures including arrays, linked lists, stacks, queues, trees, and graphs, with an emphasis on implementation and applications.'
        },
        'MATH101': {
            course_id: 'MATH101',
            course_name: 'Calculus I',
            credits: 4,
            department: 'Mathematics',
            instructor_name: 'Dr. Robert Chen',
            semester: 'Fall 2023',
            description: 'An introduction to differential and integral calculus, covering limits, derivatives, applications of derivatives, and basic integration techniques.'
        }
    };
    
    const course = courses[courseId];
    
    if (!course) {
        alert('Course details not found');
        return;
    }
    
    // Populate modal with course details
    document.getElementById('course-modal-title').textContent = course.course_name;
    document.getElementById('course-modal-code').textContent = course.course_id;
    document.getElementById('course-credits').textContent = course.credits;
    document.getElementById('course-department').textContent = course.department;
    document.getElementById('course-instructor').textContent = course.instructor_name;
    document.getElementById('course-semester').textContent = course.semester;
    document.getElementById('course-description-text').textContent = course.description;
    
    // Load syllabus, materials, and assignments
    loadSyllabus(courseId);
    loadMaterials(courseId);
    loadAssignments(courseId);
    
    // Show the modal
    document.getElementById('course-details-modal').style.display = 'block';
}

function loadSyllabus(courseId) {
    // Sample syllabus data
    const syllabusData = {
        'CS101': [
            { week: 1, topic: 'Introduction to Computing', description: 'History of computing, basic computer organization' },
            { week: 2, topic: 'Problem Solving', description: 'Algorithms, flowcharts, pseudocode' },
            { week: 3, topic: 'Programming Basics', description: 'Variables, data types, operators' },
            { week: 4, topic: 'Control Structures', description: 'Conditionals, loops, decision making' }
        ],
        'CS201': [
            { week: 1, topic: 'Introduction to Data Structures', description: 'Overview of data structures and their importance' },
            { week: 2, topic: 'Arrays and Linked Lists', description: 'Implementation and operations' },
            { week: 3, topic: 'Stacks and Queues', description: 'Implementation and applications' },
            { week: 4, topic: 'Trees', description: 'Binary trees, traversal algorithms' }
        ],
        'MATH101': [
            { week: 1, topic: 'Functions and Models', description: 'Functions, transformations, models' },
            { week: 2, topic: 'Limits and Derivatives', description: 'Definition, properties, rules' },
            { week: 3, topic: 'Differentiation Rules', description: 'Product, quotient, chain rules' },
            { week: 4, topic: 'Applications of Differentiation', description: 'Max/min problems, related rates' }
        ]
    };
    
    const syllabus = syllabusData[courseId] || [];
    const syllabusContent = document.getElementById('syllabus-content');
    syllabusContent.innerHTML = '';
    
    if (syllabus.length === 0) {
        syllabusContent.innerHTML = '<p>No syllabus available for this course.</p>';
        return;
    }
    
    const syllabusTable = document.createElement('table');
    syllabusTable.className = 'syllabus-table';
    
    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Week', 'Topic', 'Description'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    syllabusTable.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    syllabus.forEach(item => {
        const row = document.createElement('tr');
        
        const weekCell = document.createElement('td');
        weekCell.textContent = item.week;
        row.appendChild(weekCell);
        
        const topicCell = document.createElement('td');
        topicCell.textContent = item.topic;
        row.appendChild(topicCell);
        
        const descCell = document.createElement('td');
        descCell.textContent = item.description;
        row.appendChild(descCell);
        
        tbody.appendChild(row);
    });
    syllabusTable.appendChild(tbody);
    
    syllabusContent.appendChild(syllabusTable);
}

function loadMaterials(courseId) {
    // Sample materials data
    const materialsData = {
        'CS101': [
            { id: 1, title: 'Introduction to Programming', type: 'pdf', description: 'Lecture notes for week 1', url: '#' },
            { id: 2, title: 'Problem Solving Techniques', type: 'pdf', description: 'Lecture notes for week 2', url: '#' },
            { id: 3, title: 'Programming Basics', type: 'ppt', description: 'Presentation slides for week 3', url: '#' }
        ],
        'CS201': [
            { id: 1, title: 'Data Structures Overview', type: 'pdf', description: 'Lecture notes for week 1', url: '#' },
            { id: 2, title: 'Arrays and Linked Lists', type: 'pdf', description: 'Lecture notes for week 2', url: '#' },
            { id: 3, title: 'Stacks and Queues', type: 'video', description: 'Video tutorial on implementation', url: '#' }
        ],
        'MATH101': [
            { id: 1, title: 'Functions and Models', type: 'pdf', description: 'Lecture notes for week 1', url: '#' },
            { id: 2, title: 'Limits and Derivatives', type: 'pdf', description: 'Lecture notes for week 2', url: '#' },
            { id: 3, title: 'Practice Problems', type: 'doc', description: 'Practice problems for weeks 1-2', url: '#' }
        ]
    };
    
    const materials = materialsData[courseId] || [];
    const materialsList = document.getElementById('materials-list');
    materialsList.innerHTML = '';
    
    if (materials.length === 0) {
        materialsList.innerHTML = '<p>No materials available for this course.</p>';
        return;
    }
    
    materials.forEach(material => {
        const materialItem = document.createElement('div');
        materialItem.className = 'material-item';
        
        const materialIcon = document.createElement('i');
        materialIcon.className = getMaterialIcon(material.type);
        materialItem.appendChild(materialIcon);
        
        const materialInfo = document.createElement('div');
        materialInfo.className = 'material-info';
        
        const materialTitle = document.createElement('h4');
        materialTitle.textContent = material.title;
        materialInfo.appendChild(materialTitle);
        
        const materialDesc = document.createElement('p');
        materialDesc.textContent = material.description;
        materialInfo.appendChild(materialDesc);
        
        materialItem.appendChild(materialInfo);
        
        const downloadBtn = document.createElement('a');
        downloadBtn.href = material.url;
        downloadBtn.className = 'btn-secondary';
        downloadBtn.textContent = 'Download';
        downloadBtn.target = '_blank';
        materialItem.appendChild(downloadBtn);
        
        materialsList.appendChild(materialItem);
    });
}

function loadAssignments(courseId) {
    // Sample assignments data
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
            }
        ],
        'CS201': [
            { 
                id: 3,
                title: 'Linked List Implementation',
                description: 'Implement a doubly linked list with insertion, deletion, and traversal operations.',
                due_date: '2023-05-12',
                marks: 30,
                status: 'In Progress'
            },
            { 
                id: 4,
                title: 'Stack and Queue Implementation',
                description: 'Implement stack and queue data structures and their operations.',
                due_date: '2023-05-22',
                marks: 30,
                status: 'Not Started'
            }
        ],
        'MATH101': [
            { 
                id: 5,
                title: 'Limits and Derivatives',
                description: 'Solve problems related to limits and derivatives.',
                due_date: '2023-05-15',
                marks: 25,
                status: 'Not Started'
            },
            { 
                id: 6,
                title: 'Applications of Derivatives',
                description: 'Solve real-world problems using derivatives.',
                due_date: '2023-05-25',
                marks: 30,
                status: 'Not Started'
            }
        ]
    };
    
    const assignments = assignmentsData[courseId] || [];
    const assignmentsList = document.getElementById('course-assignments-list');
    assignmentsList.innerHTML = '';
    
    if (assignments.length === 0) {
        assignmentsList.innerHTML = '<p>No assignments available for this course.</p>';
        return;
    }
    
    assignments.forEach(assignment => {
        const assignmentItem = document.createElement('div');
        assignmentItem.className = 'assignment-item';
        assignmentItem.setAttribute('data-assignment-id', assignment.id);
        
        const assignmentHeader = document.createElement('div');
        assignmentHeader.className = 'assignment-header';
        
        const assignmentTitle = document.createElement('h4');
        assignmentTitle.textContent = assignment.title;
        assignmentHeader.appendChild(assignmentTitle);
        
        const assignmentStatus = document.createElement('span');
        assignmentStatus.className = `status-badge ${getStatusClass(assignment.status)}`;
        assignmentStatus.textContent = assignment.status;
        assignmentHeader.appendChild(assignmentStatus);
        
        assignmentItem.appendChild(assignmentHeader);
        
        const assignmentDetails = document.createElement('div');
        assignmentDetails.className = 'assignment-details';
        
        const dueDate = document.createElement('p');
        dueDate.innerHTML = `<strong>Due Date:</strong> ${formatDate(assignment.due_date)}`;
        assignmentDetails.appendChild(dueDate);
        
        const marks = document.createElement('p');
        marks.innerHTML = `<strong>Marks:</strong> ${assignment.marks}`;
        assignmentDetails.appendChild(marks);
        
        assignmentItem.appendChild(assignmentDetails);
        
        const viewDetailsBtn = document.createElement('button');
        viewDetailsBtn.className = 'btn-primary';
        viewDetailsBtn.textContent = 'View Details';
        viewDetailsBtn.addEventListener('click', function() {
            openAssignmentModal(assignment);
        });
        assignmentItem.appendChild(viewDetailsBtn);
        
        assignmentsList.appendChild(assignmentItem);
    });
}

function openAssignmentModal(assignment) {
    document.getElementById('assignment-modal-title').textContent = assignment.title;
    
    const detailsContainer = document.getElementById('assignment-details');
    detailsContainer.innerHTML = `
        <div class="assignment-info">
            <p><strong>Due Date:</strong> ${formatDate(assignment.due_date)}</p>
            <p><strong>Status:</strong> <span class="status-badge ${getStatusClass(assignment.status)}">${assignment.status}</span></p>
            <p><strong>Marks:</strong> ${assignment.marks}</p>
        </div>
        <div class="assignment-description">
            <h3>Description</h3>
            <p>${assignment.description}</p>
        </div>
    `;
    
    // Set the assignment ID for the submission form
    document.getElementById('assignment-id').value = assignment.id;
    
    // Show or hide submission form based on assignment status
    const submissionForm = document.getElementById('assignment-submission-form');
    if (assignment.status === 'Submitted' || assignment.status === 'Graded') {
        submissionForm.style.display = 'none';
        
        // Show submission details if available
        if (assignment.submission) {
            const submissionDetails = document.createElement('div');
            submissionDetails.className = 'submission-details';
            submissionDetails.innerHTML = `
                <h3>Your Submission</h3>
                <p><strong>Submitted on:</strong> ${formatDate(assignment.submission.submitted_date)}</p>
                <p><strong>File:</strong> <a href="${assignment.submission.file_url}" target="_blank">${assignment.submission.file_name}</a></p>
                <p><strong>Comments:</strong> ${assignment.submission.comments || 'None'}</p>
            `;
            
            if (assignment.status === 'Graded') {
                submissionDetails.innerHTML += `
                    <div class="grade-info">
                        <h3>Grade</h3>
                        <p><strong>Score:</strong> ${assignment.submission.score} / ${assignment.marks}</p>
                        <p><strong>Feedback:</strong> ${assignment.submission.feedback || 'No feedback provided'}</p>
                    </div>
                `;
            }
            
            detailsContainer.appendChild(submissionDetails);
        }
    } else {
        submissionForm.style.display = 'block';
    }
    
    // Show the modal
    document.getElementById('assignment-modal').style.display = 'block';
}

function loadTimetable() {
    // Sample timetable data
    const timetableData = [
        { day: 'Monday', time_slot: '09:00 - 10:30', course_code: 'CS101', course_name: 'Introduction to Computer Science', room: 'Room A101' },
        { day: 'Monday', time_slot: '11:00 - 12:30', course_code: 'CS201', course_name: 'Data Structures', room: 'Room B202' },
        { day: 'Tuesday', time_slot: '09:00 - 10:30', course_code: 'MATH101', course_name: 'Calculus I', room: 'Room C303' },
        { day: 'Wednesday', time_slot: '14:00 - 15:30', course_code: 'CS301', course_name: 'Database Systems', room: 'Lab 101' },
        { day: 'Thursday', time_slot: '11:00 - 12:30', course_code: 'CS401', course_name: 'Artificial Intelligence', room: 'Room D404' },
        { day: 'Friday', time_slot: '09:00 - 10:30', course_code: 'CS101', course_name: 'Introduction to Computer Science', room: 'Lab 202' }
    ];
    
    const timetableBody = document.getElementById('timetable-body');
    timetableBody.innerHTML = '';
    
    // Group by time slot
    const timeSlots = [...new Set(timetableData.map(item => item.time_slot))].sort();
    
    timeSlots.forEach(timeSlot => {
        const row = document.createElement('tr');
        
        const timeCell = document.createElement('td');
        timeCell.textContent = timeSlot;
        row.appendChild(timeCell);
        
        // Days of the week
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        days.forEach(day => {
            const cell = document.createElement('td');
            const classForDay = timetableData.find(item => 
                item.time_slot === timeSlot && 
                item.day === day
            );
            
            if (classForDay) {
                cell.innerHTML = `
                    <div class="timetable-class">
                        <strong>${classForDay.course_code}</strong>
                        <div>${classForDay.course_name}</div>
                        <small>${classForDay.room}</small>
                    </div>
                `;
            }
            
            row.appendChild(cell);
        });
        
        timetableBody.appendChild(row);
    });
}

function loadExams() {
    // Sample exams data
    const examsData = [
        { 
            course_id: 'CS101', 
            course_name: 'Introduction to Computer Science', 
            date: '2023-05-15', 
            time: '09:00 - 11:00', 
            duration: 120, 
            venue: 'Exam Hall A', 
            type: 'Final Exam' 
        },
        { 
            course_id: 'CS201', 
            course_name: 'Data Structures', 
            date: '2023-05-18', 
            time: '14:00 - 16:00', 
            duration: 120, 
            venue: 'Exam Hall B', 
            type: 'Final Exam' 
        },
        { 
            course_id: 'MATH101', 
            course_name: 'Calculus I', 
            date: '2023-05-20', 
            time: '09:00 - 11:00', 
            duration: 120, 
            venue: 'Exam Hall C', 
            type: 'Final Exam' 
        }
    ];
    
    const examsList = document.getElementById('exams-list');
    examsList.innerHTML = '';
    
    if (examsData.length === 0) {
        examsList.innerHTML = '<p>No upcoming exams.</p>';
        return;
    }
    
    examsData.forEach(exam => {
        const examItem = document.createElement('div');
        examItem.className = 'exam-item';
        
        const examHeader = document.createElement('div');
        examHeader.className = 'exam-header';
        
        const examTitle = document.createElement('h3');
        examTitle.textContent = `${exam.course_id}: ${exam.course_name}`;
        examHeader.appendChild(examTitle);
        
        const examDate = document.createElement('div');
        examDate.className = 'exam-date';
        examDate.textContent = `${formatDate(exam.date)}`;
        examHeader.appendChild(examDate);
        
        examItem.appendChild(examHeader);
        
        const examDetails = document.createElement('div');
        examDetails.className = 'exam-details';
        examDetails.innerHTML = `
            <p><strong>Time:</strong> ${exam.time}</p>
            <p><strong>Duration:</strong> ${exam.duration} minutes</p>
            <p><strong>Venue:</strong> ${exam.venue}</p>
            <p><strong>Type:</strong> ${exam.type}</p>
        `;
        
        examItem.appendChild(examDetails);
        examsList.appendChild(examItem);
    });
}

function loadEvents() {
    // Sample events data
    const eventsData = [
        { 
            title: 'Tech Symposium', 
            date: '2023-04-25', 
            time: '10:00 - 16:00', 
            venue: 'University Auditorium', 
            organizer: 'Computer Science Department',
            description: 'Annual technology symposium featuring guest speakers from leading tech companies.'
        },
        { 
            title: 'Career Fair', 
            date: '2023-05-05', 
            time: '09:00 - 17:00', 
            venue: 'University Sports Complex', 
            organizer: 'Career Services',
            description: 'Connect with potential employers and explore career opportunities.'
        }
    ];
    
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '';
    
    if (eventsData.length === 0) {
        eventsList.innerHTML = '<p>No upcoming events.</p>';
        return;
    }
    
    eventsData.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        
        const eventHeader = document.createElement('div');
        eventHeader.className = 'event-header';
        
        const eventTitle = document.createElement('h3');
        eventTitle.textContent = event.title;
        eventHeader.appendChild(eventTitle);
        
        const eventDate = document.createElement('div');
        eventDate.className = 'event-date';
        eventDate.textContent = `${formatDate(event.date)}`;
        eventHeader.appendChild(eventDate);
        
        eventItem.appendChild(eventHeader);
        
        const eventDetails = document.createElement('div');
        eventDetails.className = 'event-details';
        eventDetails.innerHTML = `
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Organizer:</strong> ${event.organizer}</p>
            <p><strong>Description:</strong> ${event.description}</p>
        `;
        
        eventItem.appendChild(eventDetails);
        eventsList.appendChild(eventItem);
    });
}

function loadMessages() {
    // Sample messages data
    const messagesData = [
        { 
            id: 1,
            subject: 'Assignment Deadline Extended', 
            sender: 'Dr. John Smith', 
            date: '2023-04-20', 
            content: 'The deadline for the CS101 final project has been extended to May 5th.',
            read: true
        },
        { 
            id: 2,
            subject: 'Lab Session Rescheduled', 
            sender: 'Dr. Emily Johnson', 
            date: '2023-04-22', 
            content: 'The CS201 lab session scheduled for April 25th has been moved to April 27th due to maintenance work in the lab.',
            read: false
        },
        { 
            id: 3,
            subject: 'Study Group Formation', 
            sender: 'Student Council', 
            date: '2023-04-23', 
            content: 'We are forming study groups for final exam preparation. If you are interested, please reply to this message.',
            read: false
        }
    ];
    
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '';
    
    if (messagesData.length === 0) {
        messagesList.innerHTML = '<p>No messages.</p>';
        return;
    }
    
    messagesData.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = `message-item ${message.read ? '' : 'unread'}`;
        messageItem.setAttribute('data-message-id', message.id);
        
        const messageHeader = document.createElement('div');
        messageHeader.className = 'message-header';
        
        const messageSubject = document.createElement('div');
        messageSubject.className = 'message-subject';
        messageSubject.textContent = message.subject;
        messageHeader.appendChild(messageSubject);
        
        const messageDate = document.createElement('div');
        messageDate.className = 'message-date';
        messageDate.textContent = formatDate(message.date);
        messageHeader.appendChild(messageDate);
        
        messageItem.appendChild(messageHeader);
        
        const messageSender = document.createElement('div');
        messageSender.className = 'message-sender';
        messageSender.textContent = `From: ${message.sender}`;
        messageItem.appendChild(messageSender);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message.content;
        messageItem.appendChild(messageContent);
        
        const messageActions = document.createElement('div');
        messageActions.className = 'message-actions';
        
        const markReadBtn = document.createElement('button');
        markReadBtn.className = 'message-btn';
        markReadBtn.textContent = message.read ? 'Mark as Unread' : 'Mark as Read';
        markReadBtn.addEventListener('click', function() {
            toggleMessageReadStatus(message.id);
        });
        messageActions.appendChild(markReadBtn);
        
        const replyBtn = document.createElement('button');
        replyBtn.className = 'message-btn';
        replyBtn.textContent = 'Reply';
        replyBtn.addEventListener('click', function() {
            replyToMessage(message);
        });
        messageActions.appendChild(replyBtn);
        
        messageItem.appendChild(messageActions);
        messagesList.appendChild(messageItem);
    });
}

function toggleMessageReadStatus(messageId) {
    // In a real app, you would update the database
    // For this demo, we'll just toggle the UI
    
    const messageItem = document.querySelector(`.message-item[data-message-id="${messageId}"]`);
    if (!messageItem) return;
    
    const isUnread = messageItem.classList.contains('unread');
    
    if (isUnread) {
        messageItem.classList.remove('unread');
        messageItem.querySelector('.message-btn').textContent = 'Mark as Unread';
    } else {
        messageItem.classList.add('unread');
        messageItem.querySelector('.message-btn').textContent = 'Mark as Read';
    }
}

function replyToMessage(message) {
    // In a real app, you would open a compose message form
    // For this demo, we'll just show an alert
    alert(`Reply to: ${message.subject}\nRecipient: ${message.sender}`);
}

function updateAssignmentStatus(assignmentId, newStatus) {
    // In a real app, you would update the database
    // For this demo, we'll just update the UI
    
    const assignmentItem = document.querySelector(`.assignment-item[data-assignment-id="${assignmentId}"]`);
    if (!assignmentItem) return;
    
    const statusBadge = assignmentItem.querySelector('.status-badge');
    if (statusBadge) {
        statusBadge.textContent = newStatus;
        statusBadge.className = `status-badge ${getStatusClass(newStatus)}`;
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'Not Started':
            return 'status-not-started';
        case 'In Progress':
            return 'status-in-progress';
        case 'Submitted':
            return 'status-submitted';
        case 'Graded':
            return 'status-graded';
        default:
            return '';
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

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}