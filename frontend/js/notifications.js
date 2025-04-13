// Notifications functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get notification elements
    const notificationToggle = document.getElementById('notification-toggle');
    const notificationContainer = document.getElementById('notification-container');
    const notificationBadge = document.getElementById('notification-badge');
    const notificationList = document.getElementById('notification-list');
    const closeNotificationsBtn = document.querySelector('.close-notifications');
    
    // Sample notifications data
    const notifications = [
        {
            id: 1,
            title: 'Assignment Due',
            message: 'Your CS101 assignment is due tomorrow',
            date: '2023-04-25',
            read: false,
            type: 'assignment'
        },
        {
            id: 2,
            title: 'Exam Schedule',
            message: 'Final exam schedule has been published',
            date: '2023-04-23',
            read: false,
            type: 'exam'
        },
        {
            id: 3,
            title: 'Course Registration',
            message: 'Course registration for next semester starts next week',
            date: '2023-04-20',
            read: true,
            type: 'info'
        }
    ];
    
    // Update notification badge
    function updateNotificationBadge() {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationBadge.textContent = unreadCount;
        
        if (unreadCount === 0) {
            notificationBadge.style.display = 'none';
        } else {
            notificationBadge.style.display = 'block';
        }
    }
    
    // Render notifications
    function renderNotifications() {
        notificationList.innerHTML = '';
        
        if (notifications.length === 0) {
            notificationList.innerHTML = '<div class="no-notifications">No notifications</div>';
            return;
        }
        
        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
            notificationItem.setAttribute('data-id', notification.id);
            
            const iconClass = getIconClass(notification.type);
            
            notificationItem.innerHTML = `
                <div class="notification-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-date">${notification.date}</div>
                </div>
                ${!notification.read ? '<button class="mark-read-btn" data-id="' + notification.id + '">Mark as read</button>' : ''}
            `;
            
            notificationList.appendChild(notificationItem);
        });
        
        // Add event listeners to mark as read buttons
        const markReadBtns = document.querySelectorAll('.mark-read-btn');
        markReadBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const notificationId = parseInt(this.getAttribute('data-id'));
                markAsRead(notificationId);
            });
        });
    }
    
    // Get icon class based on notification type
    function getIconClass(type) {
        switch (type) {
            case 'assignment':
                return 'fas fa-book';
            case 'exam':
                return 'fas fa-file-alt';
            case 'grade':
                return 'fas fa-chart-bar';
            case 'info':
                return 'fas fa-info-circle';
            default:
                return 'fas fa-bell';
        }
    }
    
    // Mark notification as read
    function markAsRead(notificationId) {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            updateNotificationBadge();
            renderNotifications();
        }
    }
    
    // Toggle notification panel
    function toggleNotificationPanel() {
        console.log('Toggle notification panel');
        if (notificationContainer.classList.contains('visible')) {
            notificationContainer.classList.remove('visible');
        } else {
            notificationContainer.classList.add('visible');
            renderNotifications();
        }
    }
    
    // Add event listeners
    if (notificationToggle) {
        notificationToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Notification toggle clicked');
            toggleNotificationPanel();
        });
    }
    
    if (closeNotificationsBtn) {
        closeNotificationsBtn.addEventListener('click', function() {
            notificationContainer.classList.remove('visible');
        });
    }
    
    // Close notification panel when clicking outside
    document.addEventListener('click', function(e) {
        if (notificationContainer && notificationContainer.classList.contains('visible') && 
            !notificationContainer.contains(e.target) && 
            e.target !== notificationToggle) {
            notificationContainer.classList.remove('visible');
        }
    });
    
    // Initialize
    updateNotificationBadge();
});