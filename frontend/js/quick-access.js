// Quick Access functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get student ID from localStorage
    const studentId = localStorage.getItem('studentId');
    
    if (!studentId) {
        console.error('Student ID not found in localStorage');
        return;
    }
    
    // Initialize Quick Access cards
    initializeTimetableCard();
    initializeExamsCard();
    initializeEventsCard();
    initializeAssignmentsCard();
    
    // Add event listeners to Quick Access cards
    document.querySelectorAll('.quick-access .card').forEach(card => {
        card.addEventListener('click', function() {
            const cardType = this.getAttribute('data-type');
            openQuickAccessModal(cardType);
        });
    });
});

// Initialize Timetable card
function initializeTimetableCard() {
    const timetableCard = document.querySelector('.card[data-type="timetable"]');
    if (!timetableCard) return;
    
    const studentId = localStorage.getItem('studentId');
    
    // Fetch today's classes
    fetch(`/api/quick-access/timetable/${studentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Get today's day name
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const today = days[new Date().getDay()];
                
                // Get classes for today
                const todayClasses = data.timetable[today] || [];
                
                // Update card with class count
                const countElement = timetableCard.querySelector('p');
                if (countElement) {
                    if (todayClasses.length > 0) {
                        countElement.textContent = `${todayClasses.length} classes today`;
                    } else {
                        countElement.textContent = 'No classes today';
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching timetable:', error);
        });
}

// Initialize Exams card
function initializeExamsCard() {
    const examsCard = document.querySelector('.card[data-type="exams"]');
    if (!examsCard) return;
    
    const studentId = localStorage.getItem('studentId');
    
    // Fetch upcoming exams
    fetch(`/api/quick-access/exams/${studentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const exams = data.exams;
                
                // Update card with next exam date
                const countElement = examsCard.querySelector('p');
                if (countElement && exams.length > 0) {
                    const nextExam = exams[0];
                    const examDate = new Date(nextExam.exam_date);
                    const formattedDate = examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    countElement.textContent = `Next: ${formattedDate}`;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching exams:', error);
        });
}

// Initialize Events card
function initializeEventsCard() {
    const eventsCard = document.querySelector('.card[data-type="events"]');
    if (!eventsCard) return;
    
    const studentId = localStorage.getItem('studentId');
    
    // Fetch upcoming events
    fetch(`/api/quick-access/events/${studentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const events = data.events;
                
                // Update card with event count
                const countElement = eventsCard.querySelector('p');
                if (countElement) {
                    countElement.textContent = `${events.length} upcoming`;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
}

// Initialize Assignments card
function initializeAssignmentsCard() {
    const assignmentsCard = document.querySelector('.card[data-type="assignments"]');
    if (!assignmentsCard) return;
    
    const studentId = localStorage.getItem('studentId');
    
    // Fetch upcoming assignments
    fetch(`/api/quick-access/assignments/${studentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const assignments = data.assignments;
                
                // Update card with assignment count
                const countElement = assignmentsCard.querySelector('p');
                if (countElement) {
                    const pendingCount = assignments.filter(a => a.submission_status !== 'Submitted' && a.submission_status !== 'Graded').length;
                    countElement.textContent = `${pendingCount} pending`;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching assignments:', error);
        });
}

// Open Quick Access modal
function openQuickAccessModal(type) {
    const studentId = localStorage.getItem('studentId');
    
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Add close button
    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modalContainer);
    });
    
    modalContent.appendChild(closeButton);
    
    // Add title and content based on type
    const modalTitle = document.createElement('h2');
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    switch (type) {
        case 'timetable':
            modalTitle.textContent = 'Your Timetable';
            loadTimetableContent(modalBody, studentId);
            break;
        case 'exams':
            modalTitle.textContent = 'Upcoming Exams';
            loadExamsContent(modalBody, studentId);
            break;
        case 'events':
            modalTitle.textContent = 'Upcoming Events';
            loadEventsContent(modalBody, studentId);
            break;
        case 'assignments':
            modalTitle.textContent = 'Pending Assignments';
            loadAssignmentsContent(modalBody, studentId);
            break;
    }
    
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalBody);
    
    // Add modal to page
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

// Load timetable content
function loadTimetableContent(container, studentId) {
    container.innerHTML = '<div class="loading">Loading timetable...</div>';
    
    fetch(`/api/quick-access/timetable/${studentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const timetable = data.timetable;
                
                // Create timetable HTML
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                let timetableHTML = '';
                
                days.forEach(day => {
                    const dayClasses = timetable[day] || [];
                    
                    if (dayClasses.length > 0) {
                        timetableHTML += `<div class="timetable-day">
                            <h3>${day}</h3>
                            <div class="timetable-classes">`;
                        
                        dayClasses.forEach(cls => {
                            const startTime = new Date(`2000-01-01T${cls.start_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                            const endTime = new Date(`2000-01-01T${cls.end_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                            
                            timetableHTML += `<div class="timetable-class">
                                <div class="class-time">${startTime} - ${endTime}</div>
                                <div class="class-details">
                                    <div class="class-name">${cls.course_name}</div>
                                    <div class="class-info">Room: ${cls.room_number} | ${cls.department}</div>
                                </div>
                            </div>`;
                        });
                        
                        timetableHTML += `</div></div>`;
                    } else {
                        timetableHTML += `<div class="timetable-day">
                            <h3>${day}</h3>
                            <div class="no-classes">No classes scheduled</div>
                        </div>`;
                    }
                });
                
                container.innerHTML = timetableHTML;
            } else {
                container.innerHTML = '<div class="error">Failed to load timetable</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching timetable:', error);
            container.innerHTML = '<div class="error">Failed to load timetable</div>';
        });
}

// Load exams content
function loadExamsContent(container, studentId) {
    container.innerHTML = '<div class="loading">Loading exams...</div>';
    
    fetch(`/api/quick-access/exams/${studentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const exams = data.exams;
                
                if (exams.length > 0) {
                    let examsHTML = '<div class="exams-list">';
                    
                    exams.forEach(exam => {
                        const examDate = new Date(exam.exam_date);
                        const formattedDate = examDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                        const startTime = new Date(`2000-01-01T${exam.start_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                        const endTime = new Date(`2000-01-01T${exam.end_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                        
                        examsHTML += `<div class="exam-item">
                            <div class="exam-date">${formattedDate}</div>
                            <div class="exam-details">
                                <div class="exam-course">${exam.course_name}</div>
                                <div class="exam-type">${exam.exam_type}</div>
                                <div class="exam-time">${startTime} - ${endTime}</div>
                                <div class="exam-location">Room: ${exam.room_number}</div>
                                <div class="exam-marks">Max Marks: ${exam.max_marks}</div>
                            </div>
                        </div>`;
                    });
                    
                    examsHTML += '</div>';
                    container.innerHTML = examsHTML;
                } else {
                    container.innerHTML = '<div class="no-data">No upcoming exams</div>';
                }
            } else {
                container.innerHTML = '<div class="error">Failed to load exams</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching exams:', error);
            container.innerHTML = '<div class="error">Failed to load exams</div>';
        });
}

// Load events content (continued)
function loadEventsContent(container, studentId) {
    container.innerHTML = '<div class="loading">Loading events...</div>';
    
    fetch(`/api/quick-access/events/${studentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const events = data.events;
                
                if (events.length > 0) {
                    let eventsHTML = '<div class="events-list">';
                    
                    events.forEach(event => {
                        const eventDate = new Date(event.event_date);
                        const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                        const eventTime = new Date(`2000-01-01T${event.event_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                        
                        eventsHTML += `<div class="event-item">
                            <div class="event-date">${formattedDate}</div>
                            <div class="event-details">
                                <div class="event-name">${event.event_name}</div>
                                <div class="event-description">${event.event_description}</div>
                                <div class="event-time">${eventTime}</div>
                                <div class="event-venue">Venue: ${event.venue}</div>
                                <div class="event-organizer">Organized by: ${event.organizer}</div>
                            </div>
                        </div>`;
                    });
                    
                    eventsHTML += '</div>';
                    container.innerHTML = eventsHTML;
                } else {
                    container.innerHTML = '<div class="no-data">No upcoming events</div>';
                }
            } else {
                container.innerHTML = '<div class="error">Failed to load events</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            container.innerHTML = '<div class="error">Failed to load events</div>';
        });
}

// Load assignments content
function loadAssignmentsContent(container, studentId) {
    container.innerHTML = '<div class="loading">Loading assignments...</div>';
    
    fetch(`/api/quick-access/assignments/${studentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const assignments = data.assignments;
                
                if (assignments.length > 0) {
                    let assignmentsHTML = '<div class="assignments-list">';
                    
                    assignments.forEach(assignment => {
                        const dueDate = new Date(assignment.due_date);
                        const formattedDate = dueDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                        const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                        
                        let statusClass = '';
                        switch(assignment.submission_status) {
                            case 'Not Started':
                                statusClass = 'status-not-started';
                                break;
                            case 'In Progress':
                                statusClass = 'status-in-progress';
                                break;
                            case 'Submitted':
                                statusClass = 'status-submitted';
                                break;
                            case 'Graded':
                                statusClass = 'status-graded';
                                break;
                        }
                        
                        assignmentsHTML += `<div class="assignment-item">
                            <div class="assignment-date">${formattedDate}</div>
                            <div class="assignment-details">
                                <div class="assignment-course">${assignment.course_name}</div>
                                <div class="assignment-title">${assignment.title}</div>
                                <div class="assignment-description">${assignment.description}</div>
                                <div class="assignment-deadline">Due in ${daysLeft} days</div>
                                <div class="assignment-marks">Max Marks: ${assignment.max_marks}</div>
                                <div class="assignment-status ${statusClass}">${assignment.submission_status}</div>
                            </div>
                        </div>`;
                    });
                    
                    assignmentsHTML += '</div>';
                    container.innerHTML = assignmentsHTML;
                } else {
                    container.innerHTML = '<div class="no-data">No pending assignments</div>';
                }
            } else {
                container.innerHTML = '<div class="error">Failed to load assignments</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching assignments:', error);
            container.innerHTML = '<div class="error">Failed to load assignments</div>';
        });
}

// Quick access functionality
document.addEventListener('DOMContentLoaded', function() {
    // Setup quick access buttons for course cards
    setupQuickAccessButtons();
    
    // Setup quick access cards on home page
    setupHomeQuickAccess();
});

function setupQuickAccessButtons() {
    // Get all quick access buttons
    const quickAccessButtons = document.querySelectorAll('.quick-access-btn');
    
    quickAccessButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            // Get the course card and course ID
            const courseCard = this.closest('.course-card');
            if (courseCard) {
                const courseId = courseCard.getAttribute('data-course-id');
                console.log('Quick access button clicked for course:', courseId);
                
                // Show quick access menu
                showQuickAccessMenu(this, courseId);
            }
        });
    });
    
    // Close quick access menu when clicking outside
    document.addEventListener('click', function(e) {
        const quickAccessMenus = document.querySelectorAll('.quick-access-menu');
        quickAccessMenus.forEach(menu => {
            if (menu.style.display === 'block') {
                menu.style.display = 'none';
            }
        });
    });
}

function setupHomeQuickAccess() {
    // Get all quick access cards on home page
    const quickAccessCards = document.querySelectorAll('.quick-access-card');
    
    quickAccessCards.forEach(card => {
        card.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            console.log('Quick access card clicked:', target);
            
            // Open corresponding modal
            const modal = document.getElementById(`${target}-modal`);
            if (modal) {
                modal.style.display = 'block';
                
                // Load data for the modal
                switch(target) {
                    case 'timetable':
                        loadTimetableData();
                        break;
                    case 'exams':
                        loadExamsData();
                        break;
                    case 'events':
                        loadEventsData();
                        break;
                    case 'messages':
                        loadMessagesData();
                        break;
                }
            }
        });
    });
}

function showQuickAccessMenu(button, courseId) {
    // Create quick access menu if it doesn't exist
    let menu = document.querySelector(`.quick-access-menu[data-course-id="${courseId}"]`);
    
    if (!menu) {
        menu = document.createElement('div');
        menu.className = 'quick-access-menu';
        menu.setAttribute('data-course-id', courseId);
        
        // Add menu items
        menu.innerHTML = `
            <div class="quick-access-item" data-action="syllabus">
                <i class="fas fa-book"></i> View Syllabus
            </div>
            <div class="quick-access-item" data-action="materials">
                <i class="fas fa-file-alt"></i> Course Materials
            </div>
            <div class="quick-access-item" data-action="assignments">
                <i class="fas fa-tasks"></i> Assignments
            </div>
            <div class="quick-access-item" data-action="grades">
                <i class="fas fa-chart-bar"></i> Grades
            </div>
        `;
        
        // Add event listeners to menu items
        menu.querySelectorAll('.quick-access-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event bubbling
                
                const action = this.getAttribute('data-action');
                handleQuickAccessAction(courseId, action);
                
                // Hide the menu
                menu.style.display = 'none';
            });
        });
        
        // Append menu to the document body
        document.body.appendChild(menu);
    }
    
    // Position the menu relative to the button
    const buttonRect = button.getBoundingClientRect();
    menu.style.top = `${buttonRect.bottom + window.scrollY}px`;
    menu.style.left = `${buttonRect.left + window.scrollX}px`;
    
    // Show the menu
    menu.style.display = 'block';
}

function handleQuickAccessAction(courseId, action) {
    console.log('Quick access action:', action, 'for course:', courseId);
    
    // Open course details modal
    const modal = document.getElementById('course-details-modal');
    if (!modal) {
        console.error('Course details modal not found');
        return;
    }
    
    // Load course data
    loadCourseData(courseId);
    
    // Show the modal
    modal.style.display = 'block';
    
    // Activate the appropriate tab
    let tabId;
    switch (action) {
        case 'syllabus':
            tabId = 'syllabus-tab';
            break;
        case 'materials':
            tabId = 'materials-tab';
            break;
        case 'assignments':
            tabId = 'assignments-tab';
            break;
        case 'grades':
            tabId = 'grades-tab';
            break;
        default:
            tabId = 'overview-tab';
    }
    
    // Click the tab button to activate it
    const tabButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (tabButton) {
        tabButton.click();
    }
}

// Functions for loading data for quick access modals
function loadTimetableData() {
    const timetableBody = document.getElementById('timetable-body');
    if (!timetableBody) return;
    
    // Sample timetable data
    const timetableData = [
        { time: '9:00 - 10:00', monday: 'CS101', tuesday: 'MATH101', wednesday: 'CS101', thursday: 'MATH101', friday: '-' },
        { time: '10:00 - 11:00', monday: 'CS201', tuesday: '-', wednesday: 'CS201', thursday: '-', friday: 'CS301' },
        { time: '11:00 - 12:00', monday: '-', tuesday: 'CS301', wednesday: '-', thursday: 'CS301', friday: 'CS201' },
        { time: '12:00 - 1:00', monday: 'Lunch', tuesday: 'Lunch', wednesday: 'Lunch', thursday: 'Lunch', friday: 'Lunch' },
        { time: '1:00 - 2:00', monday: 'MATH101', tuesday: 'CS101', wednesday: 'MATH101', thursday: 'CS101', friday: '-' },
        { time: '2:00 - 3:00', monday: 'CS301', tuesday: 'CS201', wednesday: '-', thursday: 'CS201', friday: '-' }
    ];
    
    // Clear existing data
    timetableBody.innerHTML = '';
    
    // Add timetable rows
    timetableData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.time}</td>
            <td>${row.monday}</td>
            <td>${row.tuesday}</td>
            <td>${row.wednesday}</td>
            <td>${row.thursday}</td>
            <td>${row.friday}</td>
        `;
        timetableBody.appendChild(tr);
    });
}

function loadExamsData() {
    const examsList = document.getElementById('exams-list');
    if (!examsList) return;
    
    // Sample exams data
    const examsData = [
        { course: 'CS101', title: 'Introduction to Computer Science', date: '2023-05-15', time: '9:00 AM', venue: 'Hall A' },
        { course: 'CS201', title: 'Data Structures', date: '2023-05-18', time: '2:00 PM', venue: 'Hall B' },
        { course: 'CS301', title: 'Database Systems', date: '2023-05-22', time: '10:00 AM', venue: 'Hall C' },
        { course: 'MATH101', title: 'Calculus I', date: '2023-05-25', time: '1:00 PM', venue: 'Hall D' }
    ];
    
    // Clear existing data
    examsList.innerHTML = '';
    
    // Add exam items
    examsData.forEach(exam => {
        const examItem = document.createElement('div');
        examItem.className = 'exam-item';
        examItem.innerHTML = `
            <div class="exam-header">
                <h3>${exam.course}: ${exam.title}</h3>
                <span class="exam-date">${exam.date}</span>
            </div>
            <div class="exam-details">
                <p><strong>Time:</strong> ${exam.time}</p>
                <p><strong>Venue:</strong> ${exam.venue}</p>
            </div>
        `;
        examsList.appendChild(examItem);
    });
}

function loadEventsData() {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;
    
    // Sample events data
    const eventsData = [
        { title: 'Tech Symposium', date: '2023-04-20', time: '10:00 AM', venue: 'Main Auditorium', description: 'Annual technology symposium with guest speakers from leading tech companies.' },
        { title: 'Career Fair', date: '2023-04-25', time: '9:00 AM', venue: 'University Grounds', description: 'Connect with potential employers and explore career opportunities.' }
    ];
    
    // Clear existing data
    eventsList.innerHTML = '';
    
    // Add event items
    eventsData.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <div class="event-header">
                <h3>${event.title}</h3>
                <span class="event-date">${event.date}</span>
            </div>
            <div class="event-details">
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Venue:</strong> ${event.venue}</p>
                <p>${event.description}</p>
            </div>
        `;
        eventsList.appendChild(eventItem);
    });
}

function loadMessagesData() {
    const messagesList = document.getElementById('messages-list');
    if (!messagesList) return;
    
    // Sample messages data
    const messagesData = [
        { sender: 'Dr. John Smith', subject: 'CS101 Assignment Update', date: '2023-04-15', message: 'The deadline for the programming assignment has been extended to April 20.' },
        { sender: 'Dr. Emily Johnson', subject: 'CS201 Project Groups', date: '2023-04-14', message: 'Please form groups of 3-4 students for the upcoming project.' },
        { sender: 'Academic Office', subject: 'Registration for Next Semester', date: '2023-04-12', message: 'Registration for the Fall 2023 semester will begin on May 1.' },
        { sender: 'Student Council', subject: 'Annual Cultural Fest', date: '2023-04-10', message: 'The annual cultural fest will be held from April 28-30. Register to participate!' },
        { sender: 'Library', subject: 'Overdue Books', date: '2023-04-08', message: 'You have 2 overdue books. Please return them as soon as possible.' }
    ];
    
    // Clear existing data
    messagesList.innerHTML = '';
    
    // Add message items
    messagesData.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.innerHTML = `
            <div class="message-header">
                <h3>${message.subject}</h3>
                <span class="message-date">${message.date}</span>
            </div>
            <div class="message-details">
                <p><strong>From:</strong> ${message.sender}</p>
                <p>${message.message}</p>
            </div>
        `;
        messagesList.appendChild(messageItem);
    });
}