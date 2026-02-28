// ===== PROFILE PAGE - JAVASCRIPT =====
(function() {
    'use strict';

    // Edit Buttons
    const editPersonalBtn = document.getElementById('editPersonalBtn');
    const editContactBtn = document.getElementById('editContactBtn');
    const changePhotoBtn = document.getElementById('changePhotoBtn');

    // Action Buttons
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const updateEmailBtn = document.getElementById('updateEmailBtn');
    const enableTfaBtn = document.getElementById('enableTfaBtn');
    const logoutAllBtn = document.getElementById('logoutAllBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');

    // Modals
    const editPersonalModal = document.getElementById('editPersonalModal');
    const editContactModal = document.getElementById('editContactModal');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const confirmModal = document.getElementById('confirmModal');

    // Modal Close Buttons
    const closePersonalModal = document.getElementById('closePersonalModal');
    const closeContactModal = document.getElementById('closeContactModal');
    const closePasswordModal = document.getElementById('closePasswordModal');
    const closeConfirmModal = document.getElementById('closeConfirmModal');

    // Modal Action Buttons
    const cancelPersonalModal = document.getElementById('cancelPersonalModal');
    const savePersonalModal = document.getElementById('savePersonalModal');
    const cancelContactModal = document.getElementById('cancelContactModal');
    const saveContactModal = document.getElementById('saveContactModal');
    const cancelPasswordModal = document.getElementById('cancelPasswordModal');
    const savePasswordModal = document.getElementById('savePasswordModal');
    const cancelConfirmModal = document.getElementById('cancelConfirmModal');
    const confirmActionModal = document.getElementById('confirmActionModal');

    // Confirm Modal Elements
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');

    let currentAction = null;

    // Initialize
    function init() {
        attachEventListeners();
    }

    function attachEventListeners() {
        // Edit Buttons
        editPersonalBtn.addEventListener('click', openEditPersonal);
        editContactBtn.addEventListener('click', openEditContact);
        changePhotoBtn.addEventListener('click', handleChangePhoto);

        // Action Buttons
        changePasswordBtn.addEventListener('click', openChangePassword);
        updateEmailBtn.addEventListener('click', handleUpdateEmail);
        enableTfaBtn.addEventListener('click', handleEnableTfa);
        logoutAllBtn.addEventListener('click', handleLogoutAll);
        deleteAccountBtn.addEventListener('click', handleDeleteAccount);

        // Personal Modal
        closePersonalModal.addEventListener('click', () => closeModal(editPersonalModal));
        cancelPersonalModal.addEventListener('click', () => closeModal(editPersonalModal));
        savePersonalModal.addEventListener('click', handleSavePersonal);

        // Contact Modal
        closeContactModal.addEventListener('click', () => closeModal(editContactModal));
        cancelContactModal.addEventListener('click', () => closeModal(editContactModal));
        saveContactModal.addEventListener('click', handleSaveContact);

        // Password Modal
        closePasswordModal.addEventListener('click', () => closeModal(changePasswordModal));
        cancelPasswordModal.addEventListener('click', () => closeModal(changePasswordModal));
        savePasswordModal.addEventListener('click', handleSavePassword);

        // Confirm Modal
        closeConfirmModal.addEventListener('click', () => closeModal(confirmModal));
        cancelConfirmModal.addEventListener('click', () => closeModal(confirmModal));
        confirmActionModal.addEventListener('click', executeConfirmedAction);

        // Close modal on background click
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                closeModal(e.target);
            }
        });
    }

    // Modal Functions
    function openModal(modal) {
        modal.classList.add('active');
    }

    function closeModal(modal) {
        modal.classList.remove('active');
    }

    function openConfirm(title, message, action) {
        confirmTitle.textContent = title;
        confirmMessage.textContent = message;
        currentAction = action;
        openModal(confirmModal);
    }

    // Edit Personal Information
    function openEditPersonal() {
        openModal(editPersonalModal);
    }

    function handleSavePersonal() {
        alert('✅ Personal information updated successfully!');
        closeModal(editPersonalModal);
    }

    // Edit Contact Information
    function openEditContact() {
        openModal(editContactModal);
    }

    function handleSaveContact() {
        alert('✅ Contact information updated successfully!');
        closeModal(editContactModal);
    }

    // Change Photo
    function handleChangePhoto() {
        openConfirm(
            'Change Profile Photo',
            'Would you like to upload a new profile photo?',
            'changePhoto'
        );
    }

    // Change Password
    function openChangePassword() {
        openModal(changePasswordModal);
    }

    function handleSavePassword() {
        const currentPassword = document.querySelector('#changePasswordModal .form-input:nth-child(1)').value;
        const newPassword = document.querySelector('#changePasswordModal .form-input:nth-child(2)').value;
        const confirmPassword = document.querySelector('#changePasswordModal .form-input:nth-child(3)').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('❌ Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('❌ New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            alert('❌ Password must be at least 8 characters long');
            return;
        }

        alert('✅ Password changed successfully!');
        closeModal(changePasswordModal);
    }

    // Update Email
    function handleUpdateEmail() {
        openConfirm(
            'Update Email Address',
            'A verification link will be sent to your new email address. Do you want to proceed?',
            'updateEmail'
        );
    }

    // Enable 2FA
    function handleEnableTfa() {
        openConfirm(
            'Enable Two-Factor Authentication',
            'Two-factor authentication adds an extra layer of security to your account. Continue?',
            'enable2fa'
        );
    }

    // Logout All Devices
    function handleLogoutAll() {
        openConfirm(
            'Logout from All Devices',
            'This will terminate all active sessions. You will need to log in again. Continue?',
            'logoutAll'
        );
    }

    // Delete Account
    function handleDeleteAccount() {
        openConfirm(
            'Delete Account',
            'WARNING: This action cannot be undone. All your data will be permanently deleted. Are you absolutely sure?',
            'deleteAccount'
        );
    }

    // Execute Confirmed Action
    function executeConfirmedAction() {
        const messages = {
            'changePhoto': '✅ Profile photo updated successfully!',
            'updateEmail': '✅ Verification email sent! Check your new email address.',
            'enable2fa': '✅ Two-factor authentication enabled! Scan the QR code with your authenticator app.',
            'logoutAll': '✅ You have been logged out from all devices.',
            'deleteAccount': '❌ Account deletion is permanent and cannot be reversed. Your account has been scheduled for deletion.'
        };

        alert(messages[currentAction] || '✅ Action completed');
        closeModal(confirmModal);
        currentAction = null;
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();