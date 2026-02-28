// ===== STAFF DOCUMENT TEMPLATES - JAVASCRIPT =====
(function() {
    'use strict';

    // DOM Elements
    const createTemplateBtn = document.getElementById('createTemplateBtn');
    const editorModal = document.getElementById('editorModal');
    const previewModal = document.getElementById('previewModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const closePreviewBtn2 = document.getElementById('closePreviewBtn2');
    const templatesTableBody = document.getElementById('templatesTableBody');

    // Editor Form Elements
    const templateName = document.getElementById('templateName');
    const documentType = document.getElementById('documentType');
    const versionNumber = document.getElementById('versionNumber');
    const templateStatus = document.getElementById('templateStatus');
    const templateDescription = document.getElementById('templateDescription');
    const templateContent = document.getElementById('templateContent');

    // Action Buttons
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
    const previewBtn = document.getElementById('previewBtn');
    const testGenerateBtn = document.getElementById('testGenerateBtn');

    // Sample Templates Data
    const templatesData = [
        {
            id: 1,
            name: 'TOR Template 2026',
            docType: 'TOR',
            version: 'v1.0',
            lastUpdated: 'Feb 10, 2026',
            updatedBy: 'Maria Santos',
            status: 'active',
            description: 'Transcript of Records template for academic year 2026',
            content: 'Transcript of Records\n\n{{student_name}}\nStudent ID: {{student_id}}\nProgram: {{program}}\nYear Graduated: {{year_graduated}}\n\nThis is to certify that the above student has completed the requirements...',
            registrar: { name: 'Dr. Maria Santos', title: 'University Registrar' },
            president: { name: 'Prof. Juan Cruz', title: 'University President' },
            deptHead: { name: 'Prof. Carlos Reyes', title: 'Department Head' }
        },
        {
            id: 2,
            name: 'Diploma Template 2026',
            docType: 'Diploma',
            version: 'v1.0',
            lastUpdated: 'Feb 09, 2026',
            updatedBy: 'Carlos Reyes',
            status: 'active',
            description: 'Diploma certificate template for 2026 graduates',
            content: 'DIPLOMA OF COURSE COMPLETION\n\nThis certifies that {{student_name}}\n(ID: {{student_id}})\n\nHas successfully completed the degree requirements for\n{{program}}\n\nConferred on: {{document_date}}',
            registrar: { name: 'Dr. Maria Santos', title: 'University Registrar' },
            president: { name: 'Prof. Juan Cruz', title: 'University President' },
            deptHead: { name: 'Prof. Carlos Reyes', title: 'Department Head' }
        },
        {
            id: 3,
            name: 'Good Moral Template 2026',
            docType: 'GMC',
            version: 'v1.0',
            lastUpdated: 'Feb 08, 2026',
            updatedBy: 'Jennifer Lee',
            status: 'active',
            description: 'Good Moral Certificate template',
            content: 'CERTIFICATE OF GOOD MORAL\n\nThis is to certify that {{student_name}}\nStudent No.: {{student_id}}\n\nHas been known to possess good moral character...',
            registrar: { name: 'Dr. Maria Santos', title: 'University Registrar' },
            president: { name: 'Prof. Juan Cruz', title: 'University President' },
            deptHead: { name: 'Prof. Carlos Reyes', title: 'Department Head' }
        }
    ];

    let currentTemplate = null;
    let isEditMode = false;

    // Initialize
    function init() {
        attachEventListeners();
        populateTable();
    }

    function attachEventListeners() {
        createTemplateBtn.addEventListener('click', handleCreateTemplate);
        modalClose.addEventListener('click', closeEditor);
        modalCancel.addEventListener('click', closeEditor);
        closePreviewBtn.addEventListener('click', closePreview);
        closePreviewBtn2.addEventListener('click', closePreview);
        previewBtn.addEventListener('click', handlePreview);
        testGenerateBtn.addEventListener('click', handleTestGenerate);
        saveTemplateBtn.addEventListener('click', handleSaveTemplate);

        // Upload click handlers
        document.getElementById('letterheadUpload').addEventListener('click', () => {
            document.getElementById('letterheadFile').click();
        });
        document.getElementById('backgroundUpload').addEventListener('click', () => {
            document.getElementById('backgroundFile').click();
        });

        // Signature upload handlers
        ['registrar', 'president', 'deptHead'].forEach(type => {
            document.getElementById(type + 'SigUpload').addEventListener('click', () => {
                document.getElementById(type + 'SigFile').click();
            });
        });

        // Variable tag click to insert
        document.querySelectorAll('.variable-tag').forEach(tag => {
            tag.addEventListener('click', function() {
                const variable = this.textContent.trim();
                const textarea = templateContent;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = textarea.value;
                textarea.value = text.substring(0, start) + variable + text.substring(end);
                textarea.focus();
            });
        });

        editorModal.addEventListener('click', function(e) {
            if (e.target === editorModal) closeEditor();
        });
        previewModal.addEventListener('click', function(e) {
            if (e.target === previewModal) closePreview();
        });
    }

    // Populate Table
    function populateTable() {
        templatesTableBody.innerHTML = '';
        templatesData.forEach(template => {
            const row = createTableRow(template);
            templatesTableBody.appendChild(row);
        });
    }

    function createTableRow(template) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="template-name-cell">${template.name}</td>
            <td>${template.docType}</td>
            <td><strong>${template.version}</strong></td>
            <td>${template.lastUpdated}</td>
            <td>${template.updatedBy}</td>
            <td><span class="status-badge ${template.status}">${capitalizeFirst(template.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon edit" data-action="edit" data-id="${template.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-icon" data-action="preview" data-id="${template.id}">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button class="btn-icon" data-action="duplicate" data-id="${template.id}">
                        <i class="fas fa-copy"></i> Duplicate
                    </button>
                    <button class="btn-icon" data-action="archive" data-id="${template.id}">
                        <i class="fas fa-archive"></i> Archive
                    </button>
                </div>
            </td>
        `;

        // Attach event listeners to action buttons
        tr.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const id = parseInt(this.getAttribute('data-id'));
                const template = templatesData.find(t => t.id === id);
                
                if (action === 'edit') handleEditTemplate(template);
                else if (action === 'preview') handleShowPreview(template);
                else if (action === 'duplicate') handleDuplicate(template);
                else if (action === 'archive') handleArchive(template);
            });
        });

        return tr;
    }

    // Handle Create Template
    function handleCreateTemplate() {
        isEditMode = false;
        currentTemplate = null;
        clearForm();
        document.getElementById('editorTitle').textContent = 'Create New Template';
        editorModal.classList.add('active');
    }

    // Handle Edit Template
    function handleEditTemplate(template) {
        isEditMode = true;
        currentTemplate = template;
        loadTemplateToForm(template);
        document.getElementById('editorTitle').textContent = `Edit Template: ${template.name}`;
        editorModal.classList.add('active');
    }

    // Load Template to Form
    function loadTemplateToForm(template) {
        templateName.value = template.name;
        documentType.value = template.docType;
        versionNumber.value = template.version;
        templateStatus.value = template.status;
        templateDescription.value = template.description;
        templateContent.value = template.content;

        document.getElementById('registrarName').value = template.registrar.name;
        document.getElementById('registrarTitle').value = template.registrar.title;
        document.getElementById('presidentName').value = template.president.name;
        document.getElementById('presidentTitle').value = template.president.title;
        document.getElementById('deptHeadName').value = template.deptHead.name;
        document.getElementById('deptHeadTitle').value = template.deptHead.title;
    }

    // Clear Form
    function clearForm() {
        templateName.value = '';
        documentType.value = 'TOR';
        versionNumber.value = 'v1.0';
        templateStatus.value = 'active';
        templateDescription.value = '';
        templateContent.value = '';

        document.getElementById('registrarName').value = '';
        document.getElementById('registrarTitle').value = '';
        document.getElementById('presidentName').value = '';
        document.getElementById('presidentTitle').value = '';
        document.getElementById('deptHeadName').value = '';
        document.getElementById('deptHeadTitle').value = '';
    }

    // Close Editor
    function closeEditor() {
        editorModal.classList.remove('active');
    }

    // Handle Save Template (as New Version)
    function handleSaveTemplate() {
        const newTemplate = {
            id: templatesData.length + 1,
            name: templateName.value,
            docType: documentType.value,
            version: versionNumber.value,
            lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            updatedBy: 'Admin Registrar',
            status: templateStatus.value,
            description: templateDescription.value,
            content: templateContent.value,
            registrar: {
                name: document.getElementById('registrarName').value,
                title: document.getElementById('registrarTitle').value
            },
            president: {
                name: document.getElementById('presidentName').value,
                title: document.getElementById('presidentTitle').value
            },
            deptHead: {
                name: document.getElementById('deptHeadName').value,
                title: document.getElementById('deptHeadTitle').value
            }
        };

        if (isEditMode) {
            // Archive old version
            const oldIndex = templatesData.findIndex(t => t.id === currentTemplate.id);
            if (oldIndex !== -1) {
                templatesData[oldIndex].status = 'archived';
            }
        }

        // Add new version
        templatesData.push(newTemplate);
        alert(`✅ Template saved as new version ${newTemplate.version}!`);
        populateTable();
        closeEditor();
    }

    // Handle Preview
    function handlePreview() {
        handleShowPreview({
            name: templateName.value,
            content: templateContent.value,
            registrar: { name: document.getElementById('registrarName').value },
            president: { name: document.getElementById('presidentName').value },
            deptHead: { name: document.getElementById('deptHeadName').value }
        });
    }

    function handleShowPreview(template) {
        const preview = document.getElementById('previewContent');
        preview.innerHTML = `
            <div style="background: white; padding: 40px; border-radius: 8px; font-family: serif;">
                ${template.content.replace(/\n/g, '<br>')}
                <div style="margin-top: 60px; border-top: 1px solid #ccc; padding-top: 40px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; text-align: center;">
                    <div>
                        <div style="height: 60px; border-bottom: 1px solid #000; margin-bottom: 10px;"></div>
                        <p>${template.registrar.name}</p>
                        <p style="font-size: 0.9em;">University Registrar</p>
                    </div>
                    <div>
                        <div style="height: 60px; border-bottom: 1px solid #000; margin-bottom: 10px;"></div>
                        <p>${template.president.name}</p>
                        <p style="font-size: 0.9em;">University President</p>
                    </div>
                    <div>
                        <div style="height: 60px; border-bottom: 1px solid #000; margin-bottom: 10px;"></div>
                        <p>${template.deptHead.name}</p>
                        <p style="font-size: 0.9em;">Department Head</p>
                    </div>
                </div>
            </div>
        `;
        previewModal.classList.add('active');
    }

    // Handle Test Generate
    function handleTestGenerate() {
        const testData = {
            student_name: 'Juan Dela Cruz',
            student_id: '2022-00123',
            program: 'BS Information Technology',
            year_graduated: '2026',
            document_date: new Date().toLocaleDateString(),
            purpose: 'Employment',
            honors: 'Cum Laude',
            gpa: '3.45'
        };

        let content = templateContent.value;
        Object.entries(testData).forEach(([key, value]) => {
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });

        const preview = document.getElementById('previewContent');
        preview.innerHTML = `
            <div style="background: white; padding: 40px; border-radius: 8px; font-family: serif;">
                ${content.replace(/\n/g, '<br>')}
                <p style="margin-top: 40px; font-style: italic; color: #666;">
                    [Sample data used for testing: Juan Dela Cruz, 2022-00123]
                </p>
            </div>
        `;
        previewModal.classList.add('active');
        alert('📄 Test document generated with sample data');
    }

    // Handle Duplicate
    function handleDuplicate(template) {
        const newVersion = parseFloat(template.version.substring(1)) + 0.1;
        const duplicated = {
            ...template,
            id: templatesData.length + 1,
            name: template.name + ' (Copy)',
            version: 'v' + newVersion.toFixed(1),
            lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            updatedBy: 'Admin Registrar'
        };
        templatesData.push(duplicated);
        populateTable();
        alert(`✅ Template duplicated as version ${duplicated.version}`);
    }

    // Handle Archive
    function handleArchive(template) {
        const t = templatesData.find(tp => tp.id === template.id);
        if (t) {
            t.status = 'archived';
            populateTable();
            alert('✅ Template archived');
        }
    }

    // Close Preview
    function closePreview() {
        previewModal.classList.remove('active');
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