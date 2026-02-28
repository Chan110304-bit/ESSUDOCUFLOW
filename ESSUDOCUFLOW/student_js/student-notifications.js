// ===== NOTIFICATIONS PAGE - JAVASCRIPT =====
(function() {
    'use strict';

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const notificationCards = document.querySelectorAll('.notification-card');
    const emptyState = document.getElementById('emptyState');
    const markAllBtn = document.getElementById('markAllBtn');
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    
    // Modal elements
    const modal = document.getElementById('detailsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBadge = document.getElementById('modalBadge');
    const modalMessage = document.getElementById('modalMessage');
    const modalDate = document.getElementById('modalDate');
    const modalClose = document.getElementById('modalClose');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const actionBtn = document.getElementById('actionBtn');

    // Summary elements
    const totalNotif = document.getElementById('totalNotif');
    const unreadNotif = document.getElementById('unreadNotif');
    const approvedNotif = document.getElementById('approvedNotif');
    const systemNotif = document.getElementById('systemNotif');

    // Pagination
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pageInfo = document.getElementById('pageInfo');

    let currentFilter = 'all';
    let currentPage = 1;
    const itemsPerPage = 9;

    // Initialize
    function init() {
        setCurrentDate();
        updateSummary();
        attachEventListeners();
    }

    function setCurrentDate() {
        // Date display handled by dashboard
    }

    function attachEventListeners() {
        // Search functionality
        searchInput.addEventListener('input', handleSearch);

        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', handleFilter);
        });

        // Mark all as read
        markAllBtn.addEventListener('click', handleMarkAllRead);

        // View details buttons
        viewDetailsButtons.forEach(btn => {
            btn.addEventListener('click', handleViewDetails);
        });

        // Modal controls
        modalClose.addEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        // Pagination
        prevBtn.addEventListener('click', previousPage);
        nextBtn.addEventListener('click', nextPage);
        pageNumbers.forEach((btn, index) => {
            btn.addEventListener('click', () => goToPage(index + 1));
        });

        // Notification cards - mark as read on click
        notificationCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.btn-view-details')) {
                    markAsRead(this);
                }
            });
        });
    }

    // Handle Search
    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterNotifications(searchTerm);
    }

    // Handle Filter
    function handleFilter(e) {
        const filter = e.currentTarget.getAttribute('data-filter');
        currentFilter = filter;
        currentPage = 1;

        // Update active button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        filterNotifications();
        updatePagination();
    }

    // Filter Notifications
    function filterNotifications(searchTerm = '') {
        let visibleCount = 0;
        const searchTermLower = searchTerm.toLowerCase();

        notificationCards.forEach(card => {
            const type = card.getAttribute('data-type');
            const title = card.querySelector('.notification-title').textContent.toLowerCase();
            const message = card.querySelector('.notification-message').textContent.toLowerCase();

            const matchesFilter = currentFilter === 'all' || type === currentFilter;
            const matchesSearch = !searchTerm || title.includes(searchTermLower) || message.includes(searchTermLower);

            if (matchesFilter && matchesSearch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show empty state if no results
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }

        updatePagination();
    }

    // Update Summary
    function updateSummary() {
        const total = notificationCards.length;
        const unread = document.querySelectorAll('.notification-card.unread').length;
        const approved = document.querySelectorAll('[data-type="approved"]').length;
        const system = document.querySelectorAll('[data-type="system"]').length;

        totalNotif.textContent = total;
        unreadNotif.textContent = unread;
        approvedNotif.textContent = approved;
        systemNotif.textContent = system;
    }

    // Mark as Read
    function markAsRead(card) {
        card.classList.remove('unread');
        updateSummary();
    }

    // Mark All as Read
    function handleMarkAllRead() {
        const unreadCards = document.querySelectorAll('.notification-card.unread');
        unreadCards.forEach(card => {
            card.classList.remove('unread');
        });
        updateSummary();
        alert('✅ All notifications marked as read');
    }

    // View Details
    function handleViewDetails(e) {
        e.preventDefault();
        e.stopPropagation();

        const notifCard = e.currentTarget.closest('.notification-card');
        const id = notifCard.getAttribute('data-id');
        const title = notifCard.querySelector('.notification-title').textContent;
        const message = notifCard.querySelector('.notification-message').textContent;
        const badgeHTML = notifCard.querySelector('.notification-badge').innerHTML;
        const time = notifCard.querySelector('.notification-time').textContent;

        // Update modal
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalBadge.innerHTML = '<span class="notification-badge">' + badgeHTML + '</span>';
        modalDate.textContent = time;

        // Show action button for rejected/pending
        const type = notifCard.getAttribute('data-type');
        if (type === 'rejected' || type === 'pending') {
            actionBtn.style.display = 'inline-block';
            actionBtn.textContent = type === 'rejected' ? 'Resubmit Document' : 'Take Action';
        } else {
            actionBtn.style.display = 'none';
        }

        openModal();
        markAsRead(notifCard);
    }

    // Open Modal
    function openModal() {
        modal.classList.add('active');
    }

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
    }

    // Pagination Functions
    function updatePagination() {
        const visibleCards = Array.from(notificationCards).filter(card => card.style.display !== 'none');
        const totalPages = Math.ceil(visibleCards.length / itemsPerPage);

        // Update page numbers visibility
        pageNumbers.forEach((btn, index) => {
            btn.style.display = index < totalPages ? '' : 'none';
            btn.classList.toggle('active', index + 1 === currentPage);
        });

        // Update pagination info
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, visibleCards.length);
        pageInfo.textContent = `Showing ${start}-${end} of ${visibleCards.length} notifications`;

        // Enable/disable prev/next buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // Show/hide cards based on current page
        visibleCards.forEach((card, index) => {
            const pageNum = Math.floor(index / itemsPerPage) + 1;
            card.style.display = pageNum === currentPage ? '' : 'none';
        });
    }

    function previousPage() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            scrollToTop();
        }
    }

    function nextPage() {
        const visibleCards = Array.from(notificationCards).filter(card => card.style.display !== 'none');
        const totalPages = Math.ceil(visibleCards.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            scrollToTop();
        }
    }

    function goToPage(pageNum) {
        currentPage = pageNum;
        updatePagination();
        scrollToTop();
    }

    function scrollToTop() {
        document.querySelector('.notifications-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();