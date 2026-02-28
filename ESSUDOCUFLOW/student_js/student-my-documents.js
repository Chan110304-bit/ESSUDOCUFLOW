// ===== MY DOCUMENTS - COMPLETE SYSTEM WITH FILTERS =====

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // DOM Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const docRows = document.querySelectorAll('.doc-row');

    // Modals
    const detailModal = document.getElementById('detailModal');
    const reuploadModal = document.getElementById('reuploadModal');
    const reasonModal = document.getElementById('reasonModal');

    // Detail Modal Elements
    const detailReqId = document.getElementById('detailReqId');
    const detailDocType = document.getElementById('detailDocType');
    const detailPurpose = document.getElementById('detailPurpose');
    const detailDateSubmitted = document.getElementById('detailDateSubmitted');
    const remarksSection = document.getElementById('remarksSection');
    const remarksText = document.getElementById('remarksText');

    // Reupload Modal Elements
    const reuploadRemarks = document.getElementById('reuploadRemarks');
    const reuploadForm = document.getElementById('reuploadForm');
    const submitReuploadBtn = document.getElementById('submitReupload');

    // Reason Modal Elements
    const reasonText = document.getElementById('reasonText');
    const newRequestBtn = document.getElementById('newRequestBtn');

    // ===== REQUEST DATA ===== 
    const requestsData = {
        'REQ-001': {
            requestId: 'REQ-001',
            docType: 'Transcript of Records',
            purpose: 'Employment',
            dateSubmitted: 'Jan 10, 2026',
            status: 'pending',
            payment: 'paid',
            requirements: [
                { name: 'Valid ID', status: 'complete' },
                { name: 'Payment Receipt', status: 'complete' },
                { name: 'Authorization Letter', status: 'complete' }
            ],
            timeline: [
                { date: 'Jan 10, 2026', event: 'Submitted' },
                { date: 'Jan 11, 2026', event: 'Under Review' }
            ]
        },
        'REQ-002': {
            requestId: 'REQ-002',
            docType: 'Diploma Certificate',
            purpose: 'Graduation',
            dateSubmitted: 'Jan 08, 2026',
            status: 'processing',
            payment: 'paid',
            requirements: [
                { name: 'Valid ID', status: 'complete' },
                { name: 'Payment Receipt', status: 'complete' },
                { name: 'Authorization Letter', status: 'complete' }
            ],
            timeline: [
                { date: 'Jan 08, 2026', event: 'Submitted' },
                { date: 'Jan 09, 2026', event: 'Accepted' },
                { date: 'Jan 10, 2026', event: 'Processing' }
            ]
        },
        'REQ-003': {
            requestId: 'REQ-003',
            docType: 'Good Moral Certificate',
            purpose: 'Further Studies',
            dateSubmitted: 'Jan 05, 2026',
            status: 'revision',
            payment: 'unpaid',
            remarks: 'The uploaded ID is too blurry. Please upload a clearer image. Also, the payment receipt amount does not match the required fee.',
            requirements: [
                { name: 'Valid ID', status: 'incomplete' },
                { name: 'Payment Receipt', status: 'incomplete' },
                { name: 'Authorization Letter', status: 'complete' }
            ],
            timeline: [
                { date: 'Jan 05, 2026', event: 'Submitted' },
                { date: 'Jan 06, 2026', event: 'Under Review' },
                { date: 'Jan 07, 2026', event: 'For Revision - Missing/Incorrect Documents' }
            ],
            missingDocs: ['Valid ID', 'Payment Receipt']
        },
        'REQ-004': {
            requestId: 'REQ-004',
            docType: 'Certificate of Completion',
            purpose: 'Professional Requirement',
            dateSubmitted: 'Dec 20, 2025',
            status: 'rejected',
            payment: 'unpaid',
            reason: 'The submitted documents do not match the requirements. Your program is not eligible for this certificate type. Please verify your eligibility before submitting a new request.',
            requirements: [
                { name: 'Valid ID', status: 'complete' },
                { name: 'Payment Receipt', status: 'incomplete' },
                { name: 'Authorization Letter', status: 'incomplete' }
            ],
            timeline: [
                { date: 'Dec 20, 2025', event: 'Submitted' },
                { date: 'Dec 21, 2025', event: 'Under Review' },
                { date: 'Dec 23, 2025', event: 'Rejected - Ineligibility' }
            ]
        }
    };

    // ===== INITIALIZE =====
    initializeTabs();
    initializeActions();
    initializeModals();
    initializeSubmittedFilters();
    initializeApprovedFilters();
    initializeHistoryFilters();

    // ===== TAB SWITCHING =====
    function initializeTabs() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetTab = this.dataset.tab;

                // Remove active from all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active to clicked
                this.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }

    // ===== SUBMITTED DOCUMENTS FILTERS =====
    function initializeSubmittedFilters() {
        const searchInput = document.querySelector('.submitted-search');
        const statusFilter = document.querySelector('.submitted-status-filter');
        const paymentFilter = document.querySelector('.submitted-payment-filter');
        const priorityFilter = document.querySelector('.submitted-priority-filter');
        const resetBtn = document.querySelector('.submitted-reset');

        function applySubmittedFilters() {
            const searchTerm = searchInput.value.toLowerCase();
            const statusValue = statusFilter.value;
            const paymentValue = paymentFilter.value;
            const priorityValue = priorityFilter.value;

            document.querySelectorAll('.submitted-table tbody tr').forEach(row => {
                const id = row.dataset.id.toLowerCase();
                const docType = row.querySelector('.type-col').textContent.toLowerCase();
                const status = row.dataset.status;
                const payment = row.dataset.payment;
                const priority = row.dataset.priority;

                const matchesSearch = searchTerm === '' || id.includes(searchTerm) || docType.includes(searchTerm);
                const matchesStatus = statusValue === '' || status === statusValue;
                const matchesPayment = paymentValue === '' || payment === paymentValue;
                const matchesPriority = priorityValue === '' || priority === priorityValue;

                row.style.display = (matchesSearch && matchesStatus && matchesPayment && matchesPriority) ? 'table-row' : 'none';
            });
        }

        searchInput.addEventListener('input', applySubmittedFilters);
        statusFilter.addEventListener('change', applySubmittedFilters);
        paymentFilter.addEventListener('change', applySubmittedFilters);
        priorityFilter.addEventListener('change', applySubmittedFilters);

        resetBtn.addEventListener('click', function() {
            searchInput.value = '';
            statusFilter.value = '';
            paymentFilter.value = '';
            priorityFilter.value = '';
            applySubmittedFilters();
        });
    }

    // ===== APPROVED DOCUMENTS FILTERS =====
    function initializeApprovedFilters() {
        const searchInput = document.querySelector('.approved-search');
        const releaseFilter = document.querySelector('.approved-release-filter');
        const doctypeFilter = document.querySelector('.approved-doctype-filter');
        const resetBtn = document.querySelector('.approved-reset');

        function applyApprovedFilters() {
            const searchTerm = searchInput.value.toLowerCase();
            const releaseValue = releaseFilter.value;
            const doctypeValue = doctypeFilter.value;

            document.querySelectorAll('.approved-table tbody tr').forEach(row => {
                const docName = row.querySelector('td:first-child').textContent.toLowerCase();
                const controlNum = row.querySelector('code').textContent.toLowerCase();
                const release = row.dataset.release;
                const doctype = row.dataset.type;

                const matchesSearch = searchTerm === '' || docName.includes(searchTerm) || controlNum.includes(searchTerm);
                const matchesRelease = releaseValue === '' || release === releaseValue;
                const matchesDoctype = doctypeValue === '' || doctype === doctypeValue;

                row.style.display = (matchesSearch && matchesRelease && matchesDoctype) ? 'table-row' : 'none';
            });
        }

        searchInput.addEventListener('input', applyApprovedFilters);
        releaseFilter.addEventListener('change', applyApprovedFilters);
        doctypeFilter.addEventListener('change', applyApprovedFilters);

        resetBtn.addEventListener('click', function() {
            searchInput.value = '';
            releaseFilter.value = '';
            doctypeFilter.value = '';
            applyApprovedFilters();
        });
    }

    // ===== DOWNLOAD HISTORY FILTERS =====
    function initializeHistoryFilters() {
        const searchInput = document.querySelector('.history-search');
        const dateFilter = document.querySelector('.history-date-filter');
        const doctypeFilter = document.querySelector('.history-doctype-filter');
        const resetBtn = document.querySelector('.history-reset');

        function applyHistoryFilters() {
            const searchTerm = searchInput.value.toLowerCase();
            const dateValue = dateFilter.value;
            const doctypeValue = doctypeFilter.value;

            document.querySelectorAll('.history-item').forEach(item => {
                const docName = item.querySelector('h4').textContent.toLowerCase();
                const date = item.dataset.date;
                const doctype = item.dataset.type;

                const matchesSearch = searchTerm === '' || docName.includes(searchTerm);
                const matchesDate = dateValue === '' || date === dateValue || dateValue === 'all';
                const matchesDoctype = doctypeValue === '' || doctype === doctypeValue;

                item.style.display = (matchesSearch && matchesDate && matchesDoctype) ? 'block' : 'none';
            });
        }

        searchInput.addEventListener('input', applyHistoryFilters);
        dateFilter.addEventListener('change', applyHistoryFilters);
        doctypeFilter.addEventListener('change', applyHistoryFilters);

        resetBtn.addEventListener('click', function() {
            searchInput.value = '';
            dateFilter.value = '';
            doctypeFilter.value = '';
            applyHistoryFilters();
        });
    }

    // ===== ACTION BUTTONS =====
    function initializeActions() {
        docRows.forEach(row => {
            const status = row.dataset.status;
            const id = row.dataset.id;

            // View button (all statuses)
            row.querySelector('.action-btn.view')?.addEventListener('click', () => {
                showDetailModal(id);
            });

            // Remarks button (revision only)
            row.querySelector('.action-btn.remarks')?.addEventListener('click', () => {
                showDetailModal(id);
            });

            // Re-upload button (revision only)
            row.querySelector('.action-btn.reupload')?.addEventListener('click', () => {
                showReuploadModal(id);
            });

            // Reason button (rejected only)
            row.querySelector('.action-btn.reason')?.addEventListener('click', () => {
                showReasonModal(id);
            });

            // New request button (rejected only)
            row.querySelector('.action-btn.new-request')?.addEventListener('click', () => {
                window.location.href = 'request.html';
            });
        });

        // Download buttons in approved tab
        document.querySelectorAll('.action-btn.download').forEach(btn => {
            btn.addEventListener('click', () => {
                alert('Downloading document...');
            });
        });

        // Preview buttons
        document.querySelectorAll('.action-btn.preview').forEach(btn => {
            btn.addEventListener('click', () => {
                alert('Opening preview...');
            });
        });
    }

    // ===== DETAIL MODAL =====
    function showDetailModal(requestId) {
        const data = requestsData[requestId];
        if (!data) return;

        // Populate details
        detailReqId.textContent = data.requestId;
        detailDocType.textContent = data.docType;
        detailPurpose.textContent = data.purpose;
        detailDateSubmitted.textContent = data.dateSubmitted;

        // Populate requirements
        const reqList = detailModal.querySelector('.requirements-list');
        reqList.innerHTML = data.requirements.map(req => `
            <div class="req-item">
                <span class="req-name">${req.name}</span>
                <span class="req-status ${req.status}">
                    <i class="fas fa-${req.status === 'complete' ? 'check-circle' : 'times-circle'}"></i>
                    ${req.status === 'complete' ? 'Complete' : 'Incomplete'}
                </span>
            </div>
        `).join('');

        // Show/hide remarks based on status
        if (data.status === 'revision' && data.remarks) {
            remarksSection.style.display = 'block';
            remarksText.textContent = data.remarks;
        } else {
            remarksSection.style.display = 'none';
        }

        // Populate timeline
        updateTimeline(data.timeline);

        openModal(detailModal);
    }

    // ===== UPDATE TIMELINE =====
    function updateTimeline(timeline) {
        const timelineContainer = detailModal.querySelector('.timeline');
        timelineContainer.innerHTML = '';

        timeline.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <p class="timeline-date">${item.date}</p>
                    <p class="timeline-event">${item.event}</p>
                </div>
            `;
            timelineContainer.appendChild(timelineItem);
        });
    }

    // ===== RE-UPLOAD MODAL =====
    function showReuploadModal(requestId) {
        const data = requestsData[requestId];
        if (!data || !data.remarks) return;

        reuploadRemarks.textContent = data.remarks;

        // Show upload fields for missing docs
        document.getElementById('uploadGroup1').style.display = 'none';
        document.getElementById('uploadGroup2').style.display = 'none';

        if (data.missingDocs.includes('Valid ID')) {
            document.getElementById('uploadGroup1').style.display = 'block';
        }
        if (data.missingDocs.includes('Payment Receipt')) {
            document.getElementById('uploadGroup2').style.display = 'block';
        }

        // Store current request ID
        reuploadForm.dataset.requestId = requestId;

        openModal(reuploadModal);
    }

    // ===== REASON MODAL =====
    function showReasonModal(requestId) {
        const data = requestsData[requestId];
        if (!data || !data.reason) return;

        reasonText.textContent = data.reason;
        openModal(reasonModal);
    }

    // ===== SUBMIT RE-UPLOAD =====
    submitReuploadBtn.addEventListener('click', function() {
        const hasFiles = Array.from(reuploadForm.querySelectorAll('.file-input'))
            .filter(input => input.offsetParent !== null)
            .some(input => input.files.length > 0);

        if (!hasFiles) {
            alert('Please select at least one file to upload');
            return;
        }

        alert('Documents submitted for reprocessing! Status changed to "Pending Review".');
        closeModal(reuploadModal);

        // Update UI - this would normally be done server-side
        const requestId = reuploadForm.dataset.requestId;
        const row = document.querySelector(`[data-id="${requestId}"]`);
        if (row) {
            row.dataset.status = 'pending';
            row.querySelector('.status-badge').innerHTML = `
                <i class="fas fa-circle"></i> Pending
            `;
            row.querySelector('.status-badge').className = 'status-badge pending';
            row.querySelector('.action-btn.remarks').style.display = 'none';
            row.querySelector('.action-btn.reupload').style.display = 'none';
        }
    });

    // ===== NEW REQUEST REDIRECT =====
    newRequestBtn.addEventListener('click', function() {
        window.location.href = 'request.html';
    });

    // ===== MODALS =====
    function initializeModals() {
        // Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                closeModal(this.closest('.modal'));
            });
        });

        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                closeModal(this.closest('.modal'));
            });
        });

        // Click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this);
                }
            });
        });

        // ESC key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    closeModal(modal);
                });
            }
        });
    }

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});