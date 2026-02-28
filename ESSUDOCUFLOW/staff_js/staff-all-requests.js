// ===== STAFF ALL REQUESTS - JAVASCRIPT =====
(function() {
    'use strict';

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const documentFilter = document.getElementById('documentFilter');
    const statusFilter = document.getElementById('statusFilter');
    const paymentFilter = document.getElementById('paymentFilter');
    const programFilter = document.getElementById('programFilter');
    const rushFilter = document.getElementById('rushFilter');
    const requestsTableBody = document.getElementById('requestsTableBody');
    const detailsModal = document.getElementById('detailsModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const printBtn = document.getElementById('printBtn');

    // Stat Elements
    const statPending = document.getElementById('statPending');
    const statProcessing = document.getElementById('statProcessing');
    const statCompleted = document.getElementById('statCompleted');
    const statRejected = document.getElementById('statRejected');

    // Requests Data Placeholder (Empty Array for now)
    const requestsData = []; // Populate dynamically from server or API

    // Initialize
    function init() {
        attachEventListeners();
        populateTable(requestsData);
        updateStats();
    }

    function attachEventListeners() {
        // Filters
        searchInput.addEventListener('input', filterAndDisplay);
        documentFilter.addEventListener('change', filterAndDisplay);
        statusFilter.addEventListener('change', filterAndDisplay);
        paymentFilter.addEventListener('change', filterAndDisplay);
        programFilter.addEventListener('change', filterAndDisplay);
        rushFilter.addEventListener('change', filterAndDisplay);

        // Modals
        modalClose.addEventListener('click', closeModal);
        modalCancel.addEventListener('click', closeModal);
        detailsModal.addEventListener('click', function(e) {
            if (e.target === detailsModal) closeModal();
        });

        // Export
        exportCsvBtn.addEventListener('click', exportCSV);
        exportPdfBtn.addEventListener('click', exportPDF);
        printBtn.addEventListener('click', printDetails);
    }

    // Populate Table
    function populateTable(data) {
        requestsTableBody.innerHTML = '';
        data.forEach(request => {
            const row = createTableRow(request);
            requestsTableBody.appendChild(row);
        });
    }

    function createTableRow(request) {
        const tr = document.createElement('tr');
        tr.dataset.requestId = request.id;
        tr.dataset.docType = request.docType;
        tr.dataset.status = request.processingStatus;
        tr.dataset.payment = request.paymentStatus;
        tr.dataset.program = request.program;
        tr.dataset.rush = request.priority === 'Rush' ? 'true' : 'false';

        tr.innerHTML = `
            <td class="request-id-cell">${request.id || ''}</td>
            <td>${request.name || ''}</td>
            <td>${request.studentId || ''}</td>
            <td>${request.program || ''}</td>
            <td>${request.docType || ''}</td>
            <td>${request.dateRequested || ''}</td>
            <td><span class="payment-badge ${request.paymentStatus?.toLowerCase().replace(' ', '-') || ''}">${request.paymentStatus || ''}</span></td>
            <td><span class="status-badge ${request.processingStatus || ''}">${capitalizeFirst(request.processingStatus || '')}</span></td>
            <td><span class="priority-badge ${request.priority?.toLowerCase() || ''}">${request.priority || ''}</span></td>
            <td>${request.assignedStaff || ''}</td>
            <td>${request.dateCompleted || ''}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-view" data-request-id="${request.id || ''}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-print-row">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="btn-export-row">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        `;

        // View button click
        tr.querySelector('.btn-view').addEventListener('click', () => handleViewDetails(request));

        // Print button
        tr.querySelector('.btn-print-row').addEventListener('click', () => {
            handleViewDetails(request);
            setTimeout(() => printDetails(), 500);
        });

        // Export button
        tr.querySelector('.btn-export-row').addEventListener('click', () => {
            exportSingleRequest(request);
        });

        return tr;
    }

    // Filter and Display
    function filterAndDisplay() {
        const searchTerm = searchInput.value.toLowerCase();
        const docType = documentFilter.value;
        const status = statusFilter.value;
        const payment = paymentFilter.value;
        const program = programFilter.value;
        const rushOnly = rushFilter.checked;

        const filtered = requestsData.filter(req => {
            const matchesSearch = searchTerm === '' || 
                                 req.name?.toLowerCase().includes(searchTerm) ||
                                 req.studentId?.toLowerCase().includes(searchTerm) ||
                                 req.id?.toLowerCase().includes(searchTerm);

            const matchesDoc = docType === '' || req.docType === docType;
            const matchesStatus = status === '' || req.processingStatus === status;
            const matchesPayment = payment === '' || req.paymentStatus === payment;
            const matchesProgram = program === '' || req.program === program;
            const matchesRush = !rushOnly || req.priority === 'Rush';

            return matchesSearch && matchesDoc && matchesStatus && matchesPayment && matchesProgram && matchesRush;
        });

        populateTable(filtered);
    }

    // View Details
    function handleViewDetails(request) {
        document.getElementById('modalTitle').textContent = `${request.name || ''} - Document Request`;
        document.getElementById('modalRequestId').textContent = `Request ID: ${request.id || ''}`;
        document.getElementById('detailName').textContent = request.name || '';
        document.getElementById('detailStudentId').textContent = request.studentId || '';
        document.getElementById('detailEmail').textContent = request.email || '';
        document.getElementById('detailPhone').textContent = request.phone || '';
        document.getElementById('detailAddress').textContent = request.address || '';
        document.getElementById('detailDocType').textContent = request.docType || '';
        document.getElementById('detailPurpose').textContent = request.purpose || '';
        document.getElementById('detailCopies').textContent = request.copies || '';
        document.getElementById('detailPriority').textContent = request.priority || '';
        document.getElementById('detailPaymentMethod').textContent = request.paymentMethod || '';
        document.getElementById('detailAmount').textContent = request.amount || '';
        document.getElementById('detailPaymentDate').textContent = request.paymentDate || '';
        document.getElementById('detailPaymentStatus').textContent = request.paymentStatus || '';

        // Timeline
        const timeline = document.getElementById('statusTimeline');
        timeline.innerHTML = '';
        (request.timeline || []).forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${item.status || ''}`;
            timelineItem.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${item.date || ''}</div>
                    <div class="timeline-title">${item.title || ''}</div>
                    <p class="timeline-description">${item.description || ''}</p>
                </div>
            `;
            timeline.appendChild(timelineItem);
        });

        detailsModal.classList.add('active');
    }

    function closeModal() {
        detailsModal.classList.remove('active');
    }

    // Export Functions
    function exportCSV() {
        const rows = Array.from(requestsTableBody.querySelectorAll('tr'));
        let csv = 'Request ID,Student Name,Student ID,Program,Document Type,Date Requested,Payment Status,Processing Status,Priority,Assigned Staff,Date Completed\n';
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const data = Array.from(cells).slice(0, 11).map(cell => cell.textContent);
            csv += data.map(cell => `"${cell}"`).join(',') + '\n';
        });
        downloadFile(csv, 'all-requests.csv', 'text/csv');
        alert('✅ CSV exported successfully!');
    }

    function exportPDF() {
        alert('📄 PDF export functionality would be implemented with a library like jsPDF');
    }

    function exportSingleRequest(request) {
        const csv = `Request Details for ${request.name || ''}\nRequest ID,${request.id || ''}\nStudent Name,${request.name || ''}\nStudent ID,${request.studentId || ''}\nProgram,${request.program || ''}\nDocument Type,${request.docType || ''}\nDate Requested,${request.dateRequested || ''}\nPayment Status,${request.paymentStatus || ''}\nProcessing Status,${request.processingStatus || ''}\n`;
        downloadFile(csv, `${request.id || 'request'}.csv`, 'text/csv');
        alert(`✅ Request ${request.id || ''} exported!`);
    }

    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    function printDetails() {
        window.print();
    }

    // Update Stats
    function updateStats() {
        const pending = requestsData.filter(r => r.processingStatus === 'pending').length;
        const processing = requestsData.filter(r => r.processingStatus === 'processing').length;
        const completed = requestsData.filter(r => r.processingStatus === 'completed').length;
        const rejected = requestsData.filter(r => r.processingStatus === 'rejected').length;

        statPending.textContent = pending;
        statProcessing.textContent = processing;
        statCompleted.textContent = completed;
        statRejected.textContent = rejected;
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