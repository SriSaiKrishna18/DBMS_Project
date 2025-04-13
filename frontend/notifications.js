// // Notifications component
// class NotificationsManager {
//     constructor() {
//         this.notifications = [];
//         this.unreadCount = 0;
//         this.studentId = localStorage.getItem('studentId');
//         this.notificationContainer = document.getElementById('notification-container');
//         this.notificationBadge = document.getElementById('notification-badge');
//         this.notificationList = document.getElementById('notification-list');
        
//         // Initialize if elements exist
//         if (this.notificationContainer && this.studentId) {
//             this.init();
//         }
//     }
    
//     async init() {
//         // Add event listener for notification toggle
//         const notificationToggle = document.getElementById('notification-toggle');
//         if (notificationToggle) {
//             notificationToggle.addEventListener('click', () => this.toggleNotifications());
//         }
        
//         // Fetch notifications
//         await this.fetchNotifications();
        
//         // Update badge
//         this.updateBadge();
        
//         // Set up auto-refresh (every 5 minutes)
//         setInterval(() => this.fetchNotifications(), 5 * 60 * 1000);
//     }
    
//     async fetchNotifications() {
//         try {
//             const response = await fetch(`/api/student/${this.studentId}/notifications`);
//             if (!response.ok) throw new Error('Failed to fetch notifications');
            
//             this.notifications = await response.json();
//             this.unreadCount = this.notifications.filter(n => !n.is_read).length;
            
//             // Update UI
//             this.updateBadge();
//             this.renderNotifications();
//         } catch (error) {
//             console.error('Error fetching notifications:', error);
//         }
//     }
    
//     updateBadge() {
//         if (this.notificationBadge) {
//             if (this.unreadCount > 0) {
//                 this.notificationBadge.textContent = this.unreadCount;
//                 this.notificationBadge.style.display = 'flex';
//             } else {
//                 this.notificationBadge.style.display = 'none';
//             }
//         }
//     }
    
//     renderNotifications() {
//         if (!this.notificationList) return;
        
//         // Clear existing notifications
//         this.notificationList.innerHTML = '';
        
//         if (this.notifications.length === 0) {
//             this.notificationList.innerHTML = '<div class="empty-state">No notifications</div>';
//             return;
//         }
        
//         // Add notifications
//         this.notifications.forEach(notification => {
//             const notificationItem = document.createElement('div');
//             notificationItem.classList.add('notification-item');
//             if (!notification.is_read) {
//                 notificationItem.classList.add('unread');
//             }
            
//             // Add notification type badge
//             const typeBadge = this.getTypeBadge(notification.notification_type);
            
//             notificationItem.innerHTML = `
//                 <div class="notification-header">
//                     <h4>${notification.title}</h4>
//                     ${typeBadge}
//                 </div>
//                 <p>${notification.message}</p>
//                 <div class="notification-footer">
//                     <span class="notification-time">${notification.created_at}</span>
//                     ${!notification.is_read ? '<button class="mark-read-btn" data-id="' + notification.notification_id + '">Mark as read</button>' : ''}
//                 </div>
//             `;
            
//             this.notificationList.appendChild(notificationItem);
            
//             // Add event listener for mark as read button
//             const markReadBtn = notificationItem.querySelector('.mark-read-btn');
//             if (markReadBtn) {
//                 markReadBtn.addEventListener('click', (e) => {
//                     e.stopPropagation();
//                     this.markAsRead(notification.notification_id);
//                 });
//             }
//         });
//     }
    
//     getTypeBadge(type) {
//         let badgeClass = '';
//         let badgeText = type.charAt(0).toUpperCase() + type.slice(1);
        
//         switch (type) {
//             case 'academic':
//                 badgeClass = 'badge-primary';
//                 break;
//             case 'announcement':
//                 badgeClass = 'badge-info';
//                 break;
//             case 'library':
//                 badgeClass = 'badge-warning';
//                 break;
//             case 'attendance':
//                 badgeClass = 'badge-danger';
//                 break;
//             default:
//                 badgeClass = 'badge-secondary';
//         }
        
//         return `<span class="badge ${badgeClass}">${badgeText}</span>`;
//     }
    
//     async markAsRead(notificationId) {
//         try {
//             const response = await fetch(`/api/notifications/${notificationId}/read`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
            
//             if (!response.ok) throw new Error('Failed to mark notification as read');
            
//             // Update local state
//             const notification = this.notifications.find(n => n.notification_id === notificationId);
//             if (notification) {
//                 notification.is_read = true;
//                 this.unreadCount = Math.max(0, this.unreadCount - 1);
//             }
            
//             // Update UI
//             this.updateBadge();
//             this.renderNotifications();
//         } catch (error) {
//             console.error('Error marking notification as read:', error);
//         }
//     }
    
//     toggleNotifications() {
//         if (this.notificationContainer) {
//             this.notificationContainer.classList.toggle('open');
//         }
//     }
// }

// // Initialize notifications when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     const notificationsManager = new NotificationsManager();
// });





// Notifications component
document.addEventListener('DOMContentLoaded', function() {
    const notificationToggle = document.getElementById('notification-toggle');
    const notificationContainer = document.getElementById('notification-container');
    
    if (notificationToggle && notificationContainer) {
        // Add click event to toggle notifications
        notificationToggle.addEventListener('click', function() {
            notificationContainer.classList.toggle('open');
            console.log('Notification toggle clicked');
        });
        
        // Close notifications when clicking outside
        document.addEventListener('click', function(event) {
            if (!notificationContainer.contains(event.target) && 
                !notificationToggle.contains(event.target)) {
                notificationContainer.classList.remove('open');
            }
        });
    } else {
        console.error('Notification elements not found');
    }
    
    // Sample notifications for testing
    const sampleNotifications = [
        {
            title: 'Exam Schedule Updated',
            message: 'The final exam schedule has been updated. Please check the academic calendar.',
            time: '2 hours ago',
            read: false,
            type: 'academic'
        },
        {
            title: 'Assignment Due',
            message: 'Your Database Systems assignment is due tomorrow.',
            time: '1 day ago',
            read: true,
            type: 'assignment'
        },
        {
            title: 'Holiday Announcement',
            message: 'The university will be closed on October 2nd for Gandhi Jayanti.',
            time: '3 days ago',
            read: true,
            type: 'announcement'
        }
    ];
    
    // Display sample notifications
    const notificationList = document.getElementById('notification-list');
    if (notificationList) {
        if (sampleNotifications.length === 0) {
            notificationList.innerHTML = '<div class="empty-notification">No notifications</div>';
        } else {
            notificationList.innerHTML = '';
            sampleNotifications.forEach(notification => {
                const notificationItem = document.createElement('div');
                notificationItem.classList.add('notification-item');
                if (!notification.read) {
                    notificationItem.classList.add('unread');
                }
                
                notificationItem.innerHTML = `
                    <div class="notification-header">
                        <h4>${notification.title}</h4>
                        <span class="badge badge-${notification.type}">${notification.type}</span>
                    </div>
                    <p>${notification.message}</p>
                    <div class="notification-footer">
                        <span class="notification-time">${notification.time}</span>
                    </div>
                `;
                
                notificationList.appendChild(notificationItem);
            });
        }
        
        // Update notification badge
        const notificationBadge = document.getElementById('notification-badge');
        if (notificationBadge) {
            const unreadCount = sampleNotifications.filter(n => !n.read).length;
            notificationBadge.textContent = unreadCount;
            notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }
});