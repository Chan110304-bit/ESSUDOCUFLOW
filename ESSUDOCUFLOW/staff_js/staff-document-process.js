// ===== STAFF DOCUMENT PROCESSING - JAVASCRIPT =====
(function() {
    'use strict';

    // DOM Elements
    const processingTableBody = document.getElementById('processingTableBody');
    const processingModal = document.getElementById('processingModal');
    const confirmModal = document.getElementById('confirmModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmAction = document.getElementById('confirmAction');
    const processingCount = document.getElementById('processingCount');

    // Action Buttons
    const readyBtn = document.getElementById('readyBtn');
    const holdBtn = document.getElementById('holdBtn');
    const printBtn = document.getElementById('printBtn');
    const viewRecordBtn = document.getElementById('viewRecordBtn');

    // Placeholder for processing requests
    const processingRequests = []; // No sample data, populate dynamically

    let currentRequest = null;
    let pendingAction = null;

    // Initialize
    function init() {
        attachEventListeners();
        populateTable();
        updateCount();
    }

    function attachEventListeners() {
        modalClose.addEventListener('click', closeModal);
        modalCancel.addEventListener('click', closeModal);
        processingModal.addEventListener('click', function(e) {
            if (e.target === processingModal) closeModal();
        });

        closeConfirmModal.addEventListener('click', closeConfirmation);
        confirmCancel.addEventListener('click', closeConfirmation);
        confirmAction.addEventListener('click', executeAction);

        readyBtn.addEventListener('click', handleReady);
        holdBtn.addEventListener('click', handleHold);
        printBtn.addEventListener('click', handlePrint);
        viewRecordBtn.addEventListener('click', handleViewRecord);
    }

    // Populate Table
    function populateTable() {
        processingTableBody.innerHTML = '';
        processingRequests.forEach(req => {
            const row = createTableRow(req);
            processingTableBody.appendChild(row);
        });
    }

    function createTableRow(req) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="request-id-cell">${req.id}</td>
            <td>${req.name}</td>
            <td>${req.studentId}</td>
            <td>${req.docType}</td>
            <td>${req.dateApproved}</td>
            <td>${req.assignedStaff}</td>
            <td><span class="status-badge ${req.clearanceStatus}">${formatClearanceStatus(req.clearanceStatus)}</span></td>
            <td><span class="requirements-badge">${req.requirementsStatus}</span></td>
            <td>${req.processingTime}</td>
            <td>${capitalizeFirst(req.priority)}</td>
            <td>
                <button class="btn-process" data-request-id="${req.id}">
                    <i class="fas fa-cog"></i> Process
                </button>
            </td>
        `;
        tr.querySelector('.btn-process').addEventListener('click', () => handleProcess(req));
        return tr;
    }

    // Process Request
    function handleProcess(req) {
        currentRequest = req;

        // Set modal content
        document.getElementById('processingTitle').textContent = `Processing: ${req.docType}`;
        document.getElementById('processingSubtitle').textContent = `${req.id} - ${req.name} (${req.studentId})`;
        
        // Student info
        document.getElementById('procStudentName').textContent = req.name;
        document.getElementById('procStudentId').textContent = req.studentId;
        document.getElementById('procProgram').textContent = req.program;
        document.getElementById('procYear').textContent = req.year;

        // Requirements
        const reqGrid = document.getElementById('requirementsGrid');
        reqGrid.innerHTML = '';
        req.requirements?.forEach(r => {
            const item = document.createElement('div');
            item.className = 'requirement-item';
            item.innerHTML = `
                <i class="fas fa-${r.status === 'complete' ? 'check-circle' : 'exclamation-circle'}"></i>
                <div class="requirement-name">${r.name}</div>
                <span class="requirement-status ${r.status}">${capitalizeFirst(r.status)}</span>
            `;
            reqGrid.appendChild(item);
        });

        processingModal.classList.add('active');
    }

    function closeModal() {
        processingModal.classList.remove('active');
    }

    // Action Handlers
    function handleReady() {
        pendingAction = 'ready';
        openConfirmation('Mark as Ready', 'Are you sure you want to mark this document as ready for release?');
    }

    function handleHold() {
        pendingAction = 'hold';
        openConfirmation('Put On Hold', 'Are you sure you want to put this request on hold?');
    }

    function handlePrint() {
        alert('🖨️ Print action triggered.');
    }

    function handleViewRecord() {
        alert('👁️ View student record action triggered.');
    }

    // Confirmation Modal
    function openConfirmation(title, message) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        confirmModal.classList.add('active');
    }

    function closeConfirmation() {
        confirmModal.classList.remove('active');
        pendingAction = null;
    }

    function executeAction() {
        alert(`Action "${pendingAction}" executed for request.`);
        closeConfirmation();
        closeModal();
    }

    // Utility Functions
    function formatClearanceStatus(status) {
        const map = { verified: 'Verified', 'not-verified': 'Not Verified', pending: 'Pending' };
        return map[status] || status || '';
    }

    function capitalizeFirst(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    }

    function updateCount() {
        processingCount.textContent = processingRequests.length;
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();