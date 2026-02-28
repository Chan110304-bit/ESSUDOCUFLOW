/* ===== STAFF NOTIFICATIONS - JAVASCRIPT ===== */
(function() {
    'use strict';

    // DOM Elements
    const markAllBtn = document.getElementById('markAllBtn');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const notificationsSection = document.getElementById('notificationsSection');
    const emptyState = document.getElementById('emptyState');
    const detailsModal = document.getElementById('detailsModal');
    const modalClose = document.getElementById('modalClose');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pageInfo = document.getElementById('pageInfo');

    // Stat elements
    const totalNotif = document.getElementById('totalNotif');
    const unreadNotif = document.getElementById('unreadNotif');
    const urgentNotif = document.getElementById('urgentNotif');
    const actionNotif = document.getElementById('actionNotif');

    // Sample Notifications Data
    const notificationsData = [
        {
            id: 1,
            type: 'request',
            title: 'New Request Submitted',
            message: 'Juan Dela Cruz (2022-00123) submitted a request for Transcript of Records.',
            date: 'Feb 14, 2026 - 2:30 PM',
            read: false,
            actionItems: ['Review payment proof', 'Verify student eligibility']
        },
        {
            id: 2,
            type: 'urgent',
            title: 'Rush Request Alert',
            message: 'Maria Santos (2022-00456) submitted a RUSH request for Diploma. Deadline: Feb 17, 2026.',
            date: 'Feb 14, 2026 - 1:15 PM',
            read: false,
            actionItems: ['Prioritize processing', 'Expedite document generation']
        },
        {
            id: 3,
            type: 'system',
            title: 'System Maintenance Notice',
            message: 'The system will undergo maintenance on Feb 16, 2026 from 10:00 PM to 12:00 AM.',
            date: 'Feb 14, 2026 - 10:00 AM',
            read: false,
            actionItems: []
        },
        {
            id: 4,
            type: 'task',
            title: 'Payment Verification Required',
            message: 'Angela Davis (2022-00321) request requires payment verification.',
            date: 'Feb 13, 2026 - 3:45 PM',
            read: true,
            actionItems: ['Verify payment screenshot', 'Approve if valid']
        },
        {
            id: 5,
            type: 'request',
            title: 'Request Ready for Approval',
            message: 'Robert Johnson (2022-00654) request is ready for final approval.',
            date: 'Feb 13, 2026 - 2:20 PM',
            read: true,
            actionItems: ['Review document', 'Approve and release']
        },
        {
            id: 6,
            type: 'urgent',
            title: 'Overdue Request Alert',
            message: 'REQ-2026-007 (Michael Brown) has exceeded processing time.',
            date: 'Feb 12, 2026 - 4:00 PM',
            read: true,
            actionItems: ['Expedite processing', 'Contact student']
        },
        {
            id: 7,
            type: 'task',
            title: 'Clearance Verification Needed',
            message: 'Carlos Reyes needs Department Clearance verification before processing.',
            date: 'Feb 12, 2026 - 1:30 PM',
            read: true,
            actionItems: ['Contact department', 'Get signature']
        },
        {
            id: 8,
            type: 'system',
            title: 'Backup Completed Successfully',
            message: 'Daily backup completed successfully. All data secured.',
            date: 'Feb 12, 2026 - 2:05 AM',
            read: true,
            actionItems: []
        },
        {
            id: 9,
            type: 'request',
            title: 'Document Correction Received',
            message: 'Jennifer Lee has submitted corrected documents for REQ-2026-005.',
            date: 'Feb 11, 2026 - 11:30 AM',
            read: true,
            actionItems: ['Review corrected documents', 'Verify completeness']
        }
    ];

    let currentFilter = 'all';
    let currentPage = 1;
    const itemsPerPage = 9;
    let currentNotif = null;

    // Initialize
    function init() {
        attachEventListeners();
        displayNotifications();
        updateStats();
    }

    function attachEventListeners() {
        markAllBtn.addEventListener('click', handleMarkAll);
        searchInput.addEventListener('input', filterAndDisplay);
        filterBtns.forEach(btn => {
            btn.addEventListener('click', handleFilter);
        });
        modalClose.addEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
        detailsModal.addEventListener('click', function(e) {
            if (e.target === detailsModal) closeModal();
        });
        pageNumbers.forEach(btn => {
            btn.addEventListener('click', handlePageClick);
        });
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayNotifications();
            }
        });
        nextBtn.addEventListener('click', () => {
            const maxPages = Math.ceil(getFilteredNotifications().length / itemsPerPage);
            if (currentPage < maxPages) {
                currentPage++;
                displayNotifications();
            }
        });
    }

    // Get filtered notifications
    function getFilteredNotifications() {
        const searchTerm = searchInput.value.toLowerCase();
        
        return notificationsData.filter(notif => {
            const matchesSearch = searchTerm === '' ||
                                 notif.title.toLowerCase().includes(searchTerm) ||
                                 notif.message.toLowerCase().includes(searchTerm);
            
            const matchesFilter = currentFilter === 'all' || notif.type === currentFilter;
            
            return matchesSearch && matchesFilter;
        });
    }

    // Display notifications
    function displayNotifications() {
        const filtered = getFilteredNotifications();
        
        if (filtered.length === 0) {
            notificationsSection.style.display = 'none';
            emptyState.style.display = 'block';
            updatePagination(0);
            return;
        }

        notificationsSection.style.display = 'flex';
        emptyState.style.display = 'none';

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedNotifs = filtered.slice(start, end);

        notificationsSection.innerHTML = '';
        paginatedNotifs.forEach(notif => {
            const card = createNotificationCard(notif);
            notificationsSection.appendChild(card);
        });

        updatePagination(filtered.length);
    }

    // Create notification card
    function createNotificationCard(notif) {
        const card = document.createElement('div');
        card.className = `notification-card ${notif.read ? '' : 'unread'}`;
        card.dataset.notifId = notif.id;

        const iconMap = {
            request: 'fa-envelope',
            urgent: 'fa-exclamation-circle',
            task: 'fa-tasks',
            system: 'fa-bell'
        };

        card.innerHTML = `
            <div class="notification-indicator"></div>
            <div class="notification-icon ${notif.type}">
                <i class="fas ${iconMap[notif.type]}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-header">
                    <h3 class="notification-title">${notif.title}</h3>
                    <span class="notification-badge ${notif.type}">
                        <i class="fas ${iconMap[notif.type]}"></i> ${capitalizeFirst(notif.type)}
                    </span>
                </div>
                <p class="notification-message">${notif.message}</p>
                <div class="notification-footer">
                    <span class="notification-time">
                        <i class="fas fa-calendar-alt"></i> ${notif.date}
                    </span>
                    <button class="btn-view-details" data-id="${notif.id}">View Details</button>
                </div>
            </div>
        `;

        card.querySelector('.btn-view-details').addEventListener('click', function(e) {
            e.stopPropagation();
            openModal(notif);
            if (!notif.read) {
                notif.read = true;
                card.classList.remove('unread');
                updateStats();
            }
        });

        return card;
    }

    // Open modal
    function openModal(notif) {
        currentNotif = notif;
        document.getElementById('modalTitle').textContent = notif.title;
        
        const badgeHtml = `<span class="notification-badge ${notif.type}">
            <i class="fas fa-${notif.type === 'request' ? 'envelope' : notif.type === 'urgent' ? 'exclamation-circle' : notif.type === 'task' ? 'tasks' : 'bell'}"></i>
            ${capitalizeFirst(notif.type)}
        </span>`;
        
        document.getElementById('modalBadge').innerHTML = badgeHtml;
        document.getElementById('modalMessage').textContent = notif.message;
        document.getElementById('modalDate').textContent = notif.date;

        if (notif.actionItems && notif.actionItems.length > 0) {
            const actionItemsDiv = document.getElementById('modalActionItems');
            actionItemsDiv.style.display = 'block';
            const actionList = document.getElementById('actionItemsList');
            actionList.innerHTML = '';
            notif.actionItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                actionList.appendChild(li);
            });
        } else {
            document.getElementById('modalActionItems').style.display = 'none';
        }

        detailsModal.classList.add('active');
    }

    // Close modal
    function closeModal() {
        detailsModal.classList.remove('active');
        currentNotif = null;
    }

    // Handle mark all
    function handleMarkAll() {
        notificationsData.forEach(notif => notif.read = true);
        displayNotifications();
        updateStats();
        alert('✅ All notifications marked as read');
    }

    // Handle filter
    function handleFilter(e) {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.closest('.filter-btn').classList.add('active');
        currentFilter = e.target.closest('.filter-btn').dataset.filter;
        currentPage = 1;
        filterAndDisplay();
    }

    // Filter and display
    function filterAndDisplay() {
        currentPage = 1;
        displayNotifications();
    }

    // Handle page click
    function handlePageClick(e) {
        const pageNum = parseInt(e.target.textContent);
        currentPage = pageNum;
        displayNotifications();
        pageNumbers.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }

    // Update pagination
    function updatePagination(totalItems) {
        const maxPages = Math.ceil(totalItems / itemsPerPage);
        
        pageNumbers.forEach((btn, index) => {
            if (index + 1 <= maxPages) {
                btn.style.display = 'inline-flex';
                btn.classList.toggle('active', index + 1 === currentPage);
            } else {
                btn.style.display = 'none';
            }
        });

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage >= maxPages;

        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        pageInfo.textContent = `Showing ${start}-${end} of ${totalItems} notifications`;
    }

    // Update stats
    function updateStats() {
        const total = notificationsData.length;
        const unread = notificationsData.filter(n => !n.read).length;
        const urgent = notificationsData.filter(n => n.type === 'urgent').length;
        const action = notificationsData.filter(n => n.type === 'task').length;

        totalNotif.textContent = total;
        unreadNotif.textContent = unread;
        urgentNotif.textContent = urgent;
        actionNotif.textContent = action;
    }

    // Utility
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();