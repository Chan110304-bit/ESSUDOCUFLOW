/* ===== BASE DASHBOARD - SIDEBAR COLLAPSE/EXPAND FUNCTIONALITY ===== */

(function() {
    'use strict';

    // Get DOM elements
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    // Check if elements exist
    if (!sidebar) return;

    // ===== SIDEBAR HOVER COLLAPSE/EXPAND =====
    // Expand sidebar on hover
    sidebar.addEventListener('mouseenter', function() {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('collapsed');
        }
    });

    // Collapse sidebar when mouse leaves
    sidebar.addEventListener('mouseleave', function() {
        if (window.innerWidth > 992) {
            sidebar.classList.add('collapsed');
        }
    });

    // Initialize sidebar as collapsed on load (desktop only)
    function initializeSidebar() {
        if (window.innerWidth > 992) {
            sidebar.classList.add('collapsed');
        }
    }

    // ===== MOBILE TOGGLE FUNCTIONALITY =====
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                        sidebar.classList.remove('active');
                    }
                }
            });
        });
    }

    // ===== NAVIGATION ITEM CLICK HANDLING =====
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');

            // On mobile, close sidebar after navigation
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });

    // ===== WINDOW RESIZE HANDLING =====
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('collapsed');
                sidebar.classList.remove('active');
            } else {
                sidebar.classList.add('collapsed');
            }
        }, 250);
    });

    // ===== SMOOTH SCROLL FOR SIDEBAR =====
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.addEventListener('wheel', function(e) {
            // Allow smooth scrolling within sidebar
            if (navMenu.scrollHeight > navMenu.clientHeight) {
                e.preventDefault();
                navMenu.scrollTop += e.deltaY;
            }
        });
    }

    // ===== NAVIGATION INDICATOR =====
    function addNavIndicator() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            // Check if item has nav-indicator element
            let indicator = item.querySelector('.nav-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.className = 'nav-indicator';
                item.appendChild(indicator);
            }
        });
    }

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + B to toggle sidebar (desktop only)
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            if (window.innerWidth > 992) {
                sidebar.classList.toggle('collapsed');
            }
        }
    });

    // ===== UTILITY FUNCTIONS =====
    
    // Function to collapse sidebar programmatically
    window.collapseSidebar = function() {
        if (window.innerWidth > 992) {
            sidebar.classList.add('collapsed');
        }
    };

    // Function to expand sidebar programmatically
    window.expandSidebar = function() {
        sidebar.classList.remove('collapsed');
    };

    // Function to toggle sidebar
    window.toggleSidebar = function() {
        sidebar.classList.toggle('collapsed');
    };

    // ===== INITIALIZE =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeSidebar();
            addNavIndicator();
        });
    } else {
        initializeSidebar();
        addNavIndicator();
    }

    // ===== CONSOLE INFO =====
    console.log('Dashboard initialized with sidebar collapse/expand functionality');
    console.log('Keyboard shortcut: Ctrl/Cmd + B to toggle sidebar');
    console.log('Available functions: collapseSidebar(), expandSidebar(), toggleSidebar()');

})();