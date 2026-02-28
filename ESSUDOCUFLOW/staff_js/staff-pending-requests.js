// ===== STAFF PENDING REQUESTS - JAVASCRIPT =====
(function() {
    'use strict';

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const documentFilter = document.getElementById('documentFilter');
    const programFilter = document.getElementById('programFilter');
    const paymentFilter = document.getElementById('paymentFilter');
    const sortFilter = document.getElementById('sortFilter');
    const rushFilter = document.getElementById('rushFilter');
    const requestRows = document.querySelectorAll('.request-row');
    const pendingCount = document.getElementById('pendingCount');

    // Modal Elements
    const detailsModal = document.getElementById('detailsModal');
    const confirmModal = document.getElementById('confirmModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmAction = document.getElementById('confirmAction');

    // Sample Request Data
    const requestsData = {
        'REQ-2026-001': {
            name: 'Juan Dela Cruz',
            email: 'juan@student.essu.edu.ph',
            phone: '+63 917-234-5678',
            address: '123 Main Street, Guiuan, Eastern Samar',
            docType: 'Transcript of Records (TOR)',
            purpose: 'Employment',
            copies: '2',
            instructions: 'Deliver via email',
            paymentMethod: 'Bank Transfer',
            amount: '₱200',
            paymentDate: 'Feb 12, 2026',
            paymentRef: 'TRF-2026-12345',
            attachments: ['Valid ID', 'Bank Receipt']
        },
        'REQ-2026-002': {
            name: 'Maria Santos',
            email: 'maria@student.essu.edu.ph',
            phone: '+63 917-345-6789',
            address: '456 Oak Avenue, Guiuan, Eastern Samar',
            docType: 'Diploma',
            purpose: 'Further Studies',
            copies: '1',
            instructions: 'Original copy required',
            paymentMethod: 'GCash',
            amount: '₱250',
            paymentDate: 'Feb 11, 2026',
            paymentRef: 'GCH-2026-67890',
            attachments: ['Valid ID', 'GCash Receipt']
        },
        'REQ-2026-003': {
            name: 'Carlos Reyes',
            email: 'carlos@student.essu.edu.ph',
            phone: '+63 917-456-7890',
            address: '789 Pine Road, Guiuan, Eastern Samar',
            docType: 'Certificate of Graduation',
            purpose: 'Personal Copy',
            copies: '1',
            instructions: 'N/A',
            paymentMethod: 'Pending',
            amount: '₱75',
            paymentDate: 'Not Paid',
            paymentRef: 'N/A',
            attachments: ['Valid ID']
        },
        'REQ-2026-004': {
            name: 'Angela Davis',
            email: 'angela@student.essu.edu.ph',
            phone: '+63 917-567-8901',
            address: '321 Elm Street, Guiuan, Eastern Samar',
            docType: 'Good Moral Certificate',
            purpose: 'Board Exam',
            copies: '2',
            instructions: 'Rush processing needed',
            paymentMethod: 'Online Banking',
            amount: '₱100',
            paymentDate: 'Feb 09, 2026',
            paymentRef: 'ONB-2026-24680',
            attachments: ['Valid ID', 'Bank Transfer Proof', 'Authorization Letter']
        },
        'REQ-2026-005': {
            name: 'Robert Johnson',
            email: 'robert@student.essu.edu.ph',
            phone: '+63 917-678-9012',
            address: '654 Maple Drive, Guiuan, Eastern Samar',
            docType: 'Transcript of Records (TOR)',
            purpose: 'Employment',
            copies: '1',
            instructions: 'Standard delivery',
            paymentMethod: 'Debit Card',
            amount: '₱100',
            paymentDate: 'Feb 08, 2026',
            paymentRef: 'DBC-2026-13579',
            attachments: ['Valid ID', 'Card Receipt']
        },
        'REQ-2026-006': {
            name: 'Jennifer Lee',
            email: 'jennifer@student.essu.edu.ph',
            phone: '+63 917-789-0123',
            address: '987 Cedar Lane, Guiuan, Eastern Samar',
            docType: 'Certificate of Graduation',
            purpose: 'Personal Copy',
            copies: '1',
            instructions: 'N/A',
            paymentMethod: 'Pending Verification',
            amount: '₱75',
            paymentDate: 'Feb 07, 2026',
            paymentRef: 'VERIFY-2026-01',
            attachments: ['Valid ID', 'Receipt (needs verification)']
        },
        'REQ-2026-007': {
            name: 'Michael Brown',
            email: 'michael@student.essu.edu.ph',
            phone: '+63 917-890-1234',
            address: '147 Birch Court, Guiuan, Eastern Samar',
            docType: 'Diploma',
            purpose: 'Further Studies',
            copies: '1',
            instructions: 'Rush - needed ASAP',
            paymentMethod: 'Bank Transfer',
            amount: '₱300',
            paymentDate: 'Feb 06, 2026',
            paymentRef: 'TRF-2026-56789',
            attachments: ['Valid ID', 'Bank Receipt']
        },
        'REQ-2026-008': {
            name: 'Sophie Wilson',
            email: 'sophie@student.essu.edu.ph',
            phone: '+63 917-901-2345',
            address: '258 Ash Street, Guiuan, Eastern Samar',
            docType: 'Good Moral Certificate',
            purpose: 'Personal Copy',
            copies: '1',
            instructions: 'N/A',
            paymentMethod: 'Unpaid',
            amount: '₱50',
            paymentDate: 'Not Paid',
            paymentRef: 'N/A',
            attachments: ['Valid ID']
        }
    };

    let currentAction = null;
    let currentRequestId = null;

    // Initialize
    function init() {
        attachEventListeners();
        filterRequests();
    }

    function attachEventListeners() {
        // Filter events
        searchInput.addEventListener('input', filterRequests);
        documentFilter.addEventListener('change', filterRequests);
        programFilter.addEventListener('change', filterRequests);
        paymentFilter.addEventListener('change', filterRequests);
        sortFilter.addEventListener('change', sortRequests);
        rushFilter.addEventListener('change', filterRequests);

        // View details buttons
        document.querySelectorAll('.btn-view-details').forEach(btn => {
            btn.addEventListener('click', handleViewDetails);
        });

        // Action menu buttons
        document.querySelectorAll('.btn-approve').forEach(btn => {
            btn.addEventListener('click', handleApprove);
        });

        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', handleReject);
        });

        document.querySelectorAll('.btn-correct').forEach(btn => {
            btn.addEventListener('click', handleRequestCorrection);
        });

        document.querySelectorAll('.btn-move-processing').forEach(btn => {
            btn.addEventListener('click', handleMoveProcessing);
        });

        // Modal buttons
        modalClose.addEventListener('click', closeDetailsModal);
        modalCancel.addEventListener('click', closeDetailsModal);
        closeConfirmModal.addEventListener('click', closeConfirmModal);
        confirmCancel.addEventListener('click', closeConfirmation);
        confirmAction.addEventListener('click', executeAction);

        // Modal action buttons
        document.getElementById('approveModalBtn').addEventListener('click', handleApproveFromModal);
        document.getElementById('rejectModalBtn').addEventListener('click', handleRejectFromModal);

        // Close modal on background click
        detailsModal.addEventListener('click', function(e) {
            if (e.target === detailsModal) closeDetailsModal();
        });

        confirmModal.addEventListener('click', function(e) {
            if (e.target === confirmModal) closeConfirmation();
        });
    }

    // Filter Requests
    function filterRequests() {
        const searchTerm = searchInput.value.toLowerCase();
        const docType = documentFilter.value;
        const program = programFilter.value;
        const payment = paymentFilter.value;
        const rushOnly = rushFilter.checked;

        let visibleCount = 0;

        requestRows.forEach(row => {
            const name = row.children[1].textContent.toLowerCase();
            const studentId = row.children[2].textContent.toLowerCase();
            const requestId = row.children[0].textContent.toLowerCase();
            const prog = row.getAttribute('data-program');
            const doc = row.getAttribute('data-document');
            const pay = row.getAttribute('data-payment');
            const isRush = row.getAttribute('data-rush') === 'true';

            // Search filter
            const matchesSearch = searchTerm === '' || 
                                 name.includes(searchTerm) || 
                                 studentId.includes(searchTerm) || 
                                 requestId.includes(searchTerm);

            // Document filter
            const matchesDoc = docType === '' || doc === docType;

            // Program filter
            const matchesProgram = program === '' || prog === program;

            // Payment filter
            const matchesPayment = payment === '' || pay === payment;

            // Rush filter
            const matchesRush = !rushOnly || isRush;

            if (matchesSearch && matchesDoc && matchesProgram && matchesPayment && matchesRush) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        pendingCount.textContent = visibleCount;
    }

    // Sort Requests
    function sortRequests() {
        const sortValue = sortFilter.value;
        const tbody = document.querySelector('.requests-table tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            if (sortValue === 'oldest') {
                return 0; // Keep original order (oldest first)
            } else if (sortValue === 'newest') {
                return -1; // Reverse order
            } else if (sortValue === 'rush') {
                const aRush = a.getAttribute('data-rush') === 'true';
                const bRush = b.getAttribute('data-rush') === 'true';
                return bRush - aRush;
            }
        });

        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
    }

    // View Details
    function handleViewDetails(e) {
        const requestId = this.getAttribute('data-request-id');
        const row = this.closest('tr');
        const data = requestsData[requestId];

        // Set modal content
        document.getElementById('modalTitle').textContent = 'Request Details - ' + row.children[1].textContent;
        document.getElementById('modalRequestId').textContent = requestId;
        document.getElementById('detailName').textContent = data.name;
        document.getElementById('detailStudentId').textContent = row.children[2].textContent;
        document.getElementById('detailEmail').textContent = data.email;
        document.getElementById('detailPhone').textContent = data.phone;
        document.getElementById('detailAddress').textContent = data.address;
        document.getElementById('detailDocType').textContent = data.docType;
        document.getElementById('detailPurpose').textContent = data.purpose;
        document.getElementById('detailCopies').textContent = data.copies;
        document.getElementById('detailInstructions').textContent = data.instructions || 'None';
        document.getElementById('detailPaymentMethod').textContent = data.paymentMethod;
        document.getElementById('detailAmount').textContent = data.amount;
        document.getElementById('detailPaymentDate').textContent = data.paymentDate;
        document.getElementById('detailPaymentRef').textContent = data.paymentRef;

        // Set attachments
        const attachmentsList = document.getElementById('attachmentsList');
        attachmentsList.innerHTML = '';
        data.attachments.forEach(attachment => {
            const item = document.createElement('div');
            item.className = 'attachment-item';
            item.innerHTML = `
                <i class="fas fa-file"></i>
                <span>${attachment}</span>
                <span class="status">Uploaded</span>
            `;
            attachmentsList.appendChild(item);
        });

        currentRequestId = requestId;
        detailsModal.classList.add('active');
    }

    // Action Handlers
    function handleApprove(e) {
        currentRequestId = this.closest('tr').querySelector('.btn-view-details').getAttribute('data-request-id');
        openConfirmation('Approve Request', 'Are you sure you want to approve this request?', 'approve');
    }

    function handleReject(e) {
        currentRequestId = this.closest('tr').querySelector('.btn-view-details').getAttribute('data-request-id');
        openConfirmation('Reject Request', 'Provide a reason for rejection (optional):', 'reject');
    }

    function handleRequestCorrection(e) {
        currentRequestId = this.closest('tr').querySelector('.btn-view-details').getAttribute('data-request-id');
        openConfirmation('Request Correction', 'Specify what needs to be corrected (optional):', 'correction');
    }

    function handleMoveProcessing(e) {
        currentRequestId = this.closest('tr').querySelector('.btn-view-details').getAttribute('data-request-id');
        openConfirmation('Move to Processing', 'This request will be moved to processing. Continue?', 'move-processing');
    }

    function handleApproveFromModal(e) {
        openConfirmation('Approve Request', 'Are you sure you want to approve this request?', 'approve');
    }

    function handleRejectFromModal(e) {
        openConfirmation('Reject Request', 'Provide a reason for rejection (optional):', 'reject');
    }

    // Open Confirmation Modal
    function openConfirmation(title, message, action) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        
        const reasonSection = document.getElementById('reasonSection');
        if (action === 'reject' || action === 'correction') {
            reasonSection.style.display = 'block';
        } else {
            reasonSection.style.display = 'none';
        }

        currentAction = action;
        confirmModal.classList.add('active');
    }

    // Close Confirmation
    function closeConfirmation() {
        confirmModal.classList.remove('active');
        document.getElementById('reasonInput').value = '';
        currentAction = null;
    }

    // Execute Action
    function executeAction() {
        const reason = document.getElementById('reasonInput').value;

        const messages = {
            'approve': '✅ Request approved successfully!',
            'reject': '❌ Request rejected. Notification sent to student.',
            'correction': '🔄 Correction requested. Student will be notified.',
            'move-processing': '📊 Request moved to processing.'
        };

        alert(messages[currentAction] || 'Action completed');
        closeConfirmation();
        closeDetailsModal();

        // In real app, would send to server
        console.log('Action:', currentAction, 'RequestID:', currentRequestId, 'Reason:', reason);
    }

    // Close Modals
    function closeDetailsModal() {
        detailsModal.classList.remove('active');
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();