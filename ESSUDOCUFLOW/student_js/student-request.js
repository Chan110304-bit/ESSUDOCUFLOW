// ===== DOCUMENT REQUEST PAGE =====
// Backend tables touched on submit:
//   - requests         (document_type, purpose, num_copies, status='Pending')
//   - request_subjects (course_code, course_name, semester, status) — TOR & Grades Report only
//   - request_files    (file_type, file_name, file_path, uploaded_by)
//   - clearance_forms  (is_complete = FALSE initially)
//   - payment_info     (amount_due — optional)
// NOTE: No delivery_method or delivery_address — all documents are digital only.

(function () {
    'use strict';

    // ===== DOM ELEMENTS =====

    // Step 1 — requests.document_type
    const docOptions = document.querySelectorAll('.doc-option');
    const docInputs  = document.querySelectorAll('input[name="document_type"]');

    // Step 2 — requests.purpose, requests.num_copies
    const purposeField = document.getElementById('purposeField'); // name="purpose"
    const copiesField  = document.getElementById('copiesField');  // name="num_copies"

    // Step 3 — request_subjects (TOR & Grades Report only)
    const subjectStep      = document.getElementById('subjectStep');
    const addSubjectBtn    = document.getElementById('addSubjectBtn');
    const subjectTableBody = document.getElementById('subjectTableBody');

    // Step 4 — clearance_forms.is_complete
    const clearanceCheck = document.getElementById('clearanceCheck'); // name="clearance_confirmed"

    // Step 5 — request_files
    const uploadButtons = {
        payment: {  // file_type = 'Payment Receipt'
            btn:  document.getElementById('paymentBtn'),
            file: document.getElementById('paymentFile'),   // name="payment_receipt"
            name: document.getElementById('paymentName')
        },
        clearance: { // file_type = 'Clearance Form'
            btn:  document.getElementById('clearanceBtn'),
            file: document.getElementById('clearanceFile'), // name="clearance_form"
            name: document.getElementById('clearanceName')
        },
        id: {        // file_type = 'Valid ID'
            btn:  document.getElementById('idBtn'),
            file: document.getElementById('idFile'),        // name="valid_id"
            name: document.getElementById('idName')
        }
    };

    // Step 6 — review display (read-only)
    const reviewDoc           = document.getElementById('reviewDoc');       // requests.document_type
    const reviewPurpose       = document.getElementById('reviewPurpose');   // requests.purpose
    const reviewCopies        = document.getElementById('reviewCopies');    // requests.num_copies
    const reviewPaymentFile   = document.getElementById('reviewPaymentFile');
    const reviewClearanceFile = document.getElementById('reviewClearanceFile');
    const reviewIdFile        = document.getElementById('reviewIdFile');

    // Modal
    const modal        = document.getElementById('modal');
    const submitBtn    = document.getElementById('submitBtn');
    const modalClose   = document.getElementById('modalClose');
    const modalCancel  = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalDoc     = document.getElementById('modalDoc');     // requests.document_type
    const modalPurpose = document.getElementById('modalPurpose'); // requests.purpose
    const modalCopies  = document.getElementById('modalCopies');  // requests.num_copies

    // ===== DOCUMENT TYPES THAT REQUIRE SUBJECT LISTING =====
    // Triggers Step 3 (request_subjects table)
    const SUBJECT_STEP_DOCS = ['Transcript of Records', 'Grades Report'];

    // ===== INIT =====
    function init() {
        attachEventListeners();
        setupFileUploads();
        updateReview();
        handleDocumentSelect(); // set initial state
    }

    // ===== EVENT LISTENERS =====
    function attachEventListeners() {
        // Step 1: document_type
        docOptions.forEach(opt => opt.addEventListener('click', handleDocumentSelect));
        docInputs.forEach(input => input.addEventListener('change', handleDocumentSelect));

        // Step 2: live review updates
        purposeField.addEventListener('change', updateReview);
        copiesField.addEventListener('input', updateReview);

        // Step 3: add subject row
        addSubjectBtn.addEventListener('click', addSubjectRow);

        // Submit flow
        submitBtn.addEventListener('click', openModal);
        modalClose.addEventListener('click', closeModal);
        modalCancel.addEventListener('click', closeModal);
        modalConfirm.addEventListener('click', submitForm);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }

    // ===== STEP 1: DOCUMENT TYPE =====
    // Maps to: requests.document_type
    function handleDocumentSelect() {
        docOptions.forEach(opt => opt.classList.remove('selected'));

        const checked = document.querySelector('input[name="document_type"]:checked');
        if (checked) {
            const label = checked.closest('.doc-option');
            if (label) label.classList.add('selected');
        }

        // Show Step 3 only for TOR and Grades Report → will generate request_subjects rows
        const selectedValue = checked ? checked.value : '';
        const needsSubjects = SUBJECT_STEP_DOCS.includes(selectedValue);
        subjectStep.style.display = needsSubjects ? 'block' : 'none';

        updateReview();
    }

    // ===== STEP 3: ADD SUBJECT ROW =====
    // Each row → one record in request_subjects:
    //   course_code, course_name, semester, status (default 'Pending')
    function addSubjectRow() {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" name="course_code[]" placeholder="e.g., MATH 101"></td>
            <td><input type="text" name="course_name[]" placeholder="e.g., Calculus I"></td>
            <td><input type="text" name="semester[]" placeholder="e.g., 1st Sem 2023-2024"></td>
            <td><span class="grade-badge pending">Pending</span></td>
        `;
        subjectTableBody.appendChild(newRow);
    }

    // ===== STEP 6: UPDATE REVIEW DISPLAY =====
    function updateReview() {
        // requests.document_type
        const checked = document.querySelector('input[name="document_type"]:checked');
        const docValue = checked ? checked.value : '—';
        reviewDoc.textContent = docValue;
        modalDoc.textContent  = docValue;

        // requests.purpose
        const purposeValue = purposeField.value || '—';
        reviewPurpose.textContent = purposeValue;
        modalPurpose.textContent  = purposeValue;

        // requests.num_copies
        const copiesValue = copiesField.value || '1';
        reviewCopies.textContent = copiesValue;
        modalCopies.textContent  = copiesValue;

        // request_files — uploaded file names
        const { payment, clearance, id } = uploadButtons;
        reviewPaymentFile.textContent   = payment.file.files[0]   ? '✓ ' + payment.file.files[0].name   : 'No file uploaded';
        reviewClearanceFile.textContent = clearance.file.files[0] ? '✓ ' + clearance.file.files[0].name : 'No file uploaded';
        reviewIdFile.textContent        = id.file.files[0]        ? '✓ ' + id.file.files[0].name        : 'No file uploaded';
    }

    // ===== STEP 5: FILE UPLOADS =====
    // Each upload → request_files: file_type, file_name, file_path, uploaded_by
    function setupFileUploads() {
        for (const key in uploadButtons) {
            const { btn, file, name } = uploadButtons[key];

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                file.click();
            });

            file.addEventListener('change', function () {
                if (this.files && this.files[0]) {
                    const fileName = this.files[0].name;
                    const display  = fileName.length > 25 ? fileName.substring(0, 22) + '...' : fileName;
                    name.textContent    = '✓ ' + display;
                    name.style.display  = 'inline-block';
                    btn.style.display   = 'none';
                } else {
                    name.style.display = 'none';
                    btn.style.display  = 'inline-flex';
                }
                updateReview();
            });
        }
    }

    // ===== VALIDATION =====
    function validateForm() {
        // Step 2: purpose required
        if (!purposeField.value) {
            alert('Please select the purpose of your request.');
            purposeField.focus();
            return false;
        }

        // Step 4: clearance_forms.is_complete confirmation
        if (!clearanceCheck.checked) {
            alert('Please confirm that you will complete the clearance process.');
            clearanceCheck.focus();
            return false;
        }

        // Step 5: all three files required
        if (!uploadButtons.payment.file.files.length) {
            alert('Please upload your payment receipt.');
            return false;
        }
        if (!uploadButtons.clearance.file.files.length) {
            alert('Please upload your signed clearance form.');
            return false;
        }
        if (!uploadButtons.id.file.files.length) {
            alert('Please upload your valid ID.');
            return false;
        }

        return true;
    }

    // ===== MODAL =====
    function openModal() {
        if (!validateForm()) return;
        updateReview();
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    // ===== SUBMIT =====
    // On confirm, backend should insert into:
    //   1. requests         (document_type, purpose, num_copies, status='Pending')
    //   2. request_subjects (if TOR/Grades Report: course_code[], course_name[], semester[], status='Pending')
    //   3. request_files    (Payment Receipt, Clearance Form, Valid ID)
    //   4. clearance_forms  (is_complete = FALSE)
    //   5. payment_info     (amount_due — optional, based on document_type)
    function submitForm() {
        if (!validateForm()) {
            closeModal();
            return;
        }

        const requestID = 'REQ-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        alert(
            '✅ Your document request has been submitted successfully!\n\n' +
            'Request ID: ' + requestID + '\n\n' +
            'You will receive a confirmation email shortly. Staff will review your request within 24 hours.'
        );

        closeModal();
        resetForm();
        window.scrollTo(0, 0);
    }

    // ===== RESET =====
    function resetForm() {
        document.querySelectorAll('input[type="text"], input[type="number"]').forEach(el => el.value = '');
        document.querySelectorAll('select').forEach(el => el.value = '');
        document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);

        // Reset to first document type
        const firstDoc = document.querySelector('input[name="document_type"]');
        if (firstDoc) firstDoc.checked = true;

        // Reset file uploads
        for (const key in uploadButtons) {
            const { btn, file, name } = uploadButtons[key];
            file.value          = '';
            name.textContent    = '';
            name.style.display  = 'none';
            btn.style.display   = 'inline-flex';
        }

        handleDocumentSelect();
        updateReview();
    }

    // ===== START =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();