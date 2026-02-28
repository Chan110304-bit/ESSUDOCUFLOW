// ===== STAFF STUDENT REGISTRY - CLEAN TEMPLATE WITH PAGINATION =====
(function() {
    'use strict';

    // ===== DOM ELEMENTS =====
    const searchInput = document.getElementById('searchInput');
    const programFilter = document.getElementById('programFilter');
    const yearFilter = document.getElementById('yearFilter');
    const clearanceFilter = document.getElementById('clearanceFilter');
    const pendingFilter = document.getElementById('pendingFilter');
    const studentsTableBody = document.getElementById('studentsTableBody');
    const profileModal = document.getElementById('profileModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const totalStudents = document.getElementById('totalStudents');
    const tableCount = document.getElementById('tableCount');

    // Pagination elements
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageNumbers = document.getElementById('pageNumbers');
    const pageInfo = document.getElementById('pageInfo');
    const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');

    // Tab elements
    const formTabButtons = document.querySelectorAll('.form-tab-btn');
    const formTabContents = document.querySelectorAll('.form-tab-content');

    // ===== STATE VARIABLES =====
    let currentPage = 1;
    let itemsPerPage = 15;
    let filteredStudents = [];

    // ===== EMPTY STUDENT DATA (TO BE POPULATED DYNAMICALLY) =====
    const allStudentsData = []; // No sample data

    // ===== INITIALIZATION =====
    function init() {
        attachEventListeners();
        updateStudentCount();
        filterAndDisplay();
        console.log('Student Registry initialized (empty template)');
    }

    // ===== EVENT LISTENERS =====
    function attachEventListeners() {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            filterAndDisplay();
        });
        programFilter.addEventListener('change', () => {
            currentPage = 1;
            filterAndDisplay();
        });
        yearFilter.addEventListener('change', () => {
            currentPage = 1;
            filterAndDisplay();
        });
        clearanceFilter.addEventListener('change', () => {
            currentPage = 1;
            filterAndDisplay();
        });
        pendingFilter.addEventListener('change', () => {
            currentPage = 1;
            filterAndDisplay();
        });

        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            currentPage = 1;
            filterAndDisplay();
        });

        prevBtn.addEventListener('click', previousPage);
        nextBtn.addEventListener('click', nextPage);

        modalClose.addEventListener('click', closeModal);
        modalCancel.addEventListener('click', closeModal);

        profileModal.addEventListener('click', function(e) {
            if (e.target === profileModal) closeModal();
        });

        // Form tab switching
        formTabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                switchFormTab(tabName);
            });
        });
    }

    // ===== FILTERING =====
    function filterAndDisplay() {
        const searchTerm = searchInput.value.toLowerCase();
        const program = programFilter.value;
        const year = yearFilter.value;
        const clearance = clearanceFilter.value;
        const pending = pendingFilter.value;

        filteredStudents = allStudentsData.filter(student => {
            const matchesSearch = searchTerm === '' ||
                                 student.id.toLowerCase().includes(searchTerm) ||
                                 student.name.toLowerCase().includes(searchTerm) ||
                                 student.year.toString().includes(searchTerm);

            const matchesProgram = program === '' || student.program === program;
            const matchesYear = year === '' || student.year.toString() === year;
            const matchesClearance = clearance === '' || student.clearanceStatus === clearance;

            const hasPending = student.requestHistory?.some(r => r.status === 'pending');
            const matchesPending = pending === '' ||
                                  (pending === 'has-pending' && hasPending) ||
                                  (pending === 'no-pending' && !hasPending);

            return matchesSearch && matchesProgram && matchesYear && matchesClearance && matchesPending;
        });

        currentPage = 1;
        displayPage();
    }

    // ===== PAGINATION =====
    function displayPage() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageStudents = filteredStudents.slice(startIndex, endIndex);

        populateTable(pageStudents);
        updateTableCount(filteredStudents.length);
        updatePaginationControls();
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
        const startItem = filteredStudents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, filteredStudents.length);
        pageInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredStudents.length} students`;

        pageNumbers.innerHTML = '';
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.addEventListener('click', () => goToPage(i));
            pageNumbers.appendChild(btn);
        }

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    function previousPage() {
        if (currentPage > 1) {
            currentPage--;
            displayPage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function nextPage() {
        const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayPage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function goToPage(page) {
        currentPage = page;
        displayPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===== TABLE POPULATION =====
    function populateTable(data) {
        studentsTableBody.innerHTML = '';

        if (data.length === 0) {
            studentsTableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">No students found</td></tr>';
            return;
        }

        data.forEach(student => {
            const row = createTableRow(student);
            studentsTableBody.appendChild(row);
        });
    }

    function createTableRow(student) {
        const tr = document.createElement('tr');
        const hasPending = student.requestHistory?.some(r => r.status === 'pending') ? 'has-pending' : 'no-pending';

        tr.innerHTML = `
            <td class="student-id-cell">${student.id}</td>
            <td>${student.name}</td>
            <td>${student.program}</td>
            <td>${student.year}</td>
            <td>${student.email}</td>
            <td><span class="status-badge active">Active</span></td>
            <td><span class="clearance-badge ${student.clearanceStatus}">${formatStatus(student.clearanceStatus)}</span></td>
            <td><strong>${student.totalRequests}</strong></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action view" title="View Profile">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;

        tr.querySelector('.btn-action.view').addEventListener('click', () => {
            handleViewProfile(student);
        });

        return tr;
    }

    // ===== PROFILE MODAL, TAB SWITCHING, UTILITY FUNCTIONS =====
    // (Kept intact, ready for dynamic population)
    function handleViewProfile(student) { profileModal.classList.add('active'); }
    function closeModal() { profileModal.classList.remove('active'); }
    function switchFormTab(tabName) { formTabButtons.forEach(btn => btn.classList.remove('active')); formTabContents.forEach(content => content.classList.remove('active')); document.querySelector(`[data-tab="${tabName}"]`).classList.add('active'); document.getElementById(`form-${tabName}`).classList.add('active'); }
    function updateStudentCount() { totalStudents.textContent = allStudentsData.length; }
    function updateTableCount(count) { tableCount.textContent = `${count} student${count !== 1 ? 's' : ''}`; }
    function formatStatus(status) { const statusMap = { 'cleared': 'Cleared', 'with-balance': 'With Balance', 'pending': 'Pending' }; return statusMap[status] || status; }

    // ===== INITIALIZATION =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();