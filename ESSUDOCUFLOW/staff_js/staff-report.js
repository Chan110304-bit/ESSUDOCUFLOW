// ===== STAFF REPORTS - CLEAN JAVASCRIPT STRUCTURE =====
(function () {
    'use strict';

    // DOM Elements
    const timeRangeFilter = document.getElementById('timeRangeFilter');
    const documentFilter = document.getElementById('documentFilter');
    const programFilter = document.getElementById('programFilter');
    const staffFilter = document.getElementById('staffFilter');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const printBtn = document.getElementById('printBtn');
    const docTypeTableBody = document.getElementById('docTypeTableBody');
    const staffTableBody = document.getElementById('staffTableBody');
    const delayedTableBody = document.getElementById('delayedTableBody');

    let requestsTrendChart = null;
    let documentTypeChart = null;

    // ===== INIT =====
    function init() {
        attachEventListeners();
        updateAllReports();
        initializeCharts();
        loadExternalLibraries();
    }

    function loadExternalLibraries() {
        // Load jsPDF
        if (!window.jspdf) {
            const script1 = document.createElement('script');
            script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(script1);

            script1.onload = () => {
                const script2 = document.createElement('script');
                script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js';
                document.head.appendChild(script2);
            };
        }

        // Load SheetJS
        if (!window.XLSX) {
            const xlsxScript = document.createElement('script');
            xlsxScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
            document.head.appendChild(xlsxScript);
        }
    }

    function attachEventListeners() {
        timeRangeFilter && timeRangeFilter.addEventListener('change', updateAllReports);
        documentFilter && documentFilter.addEventListener('change', updateAllReports);
        programFilter && programFilter.addEventListener('change', updateAllReports);
        staffFilter && staffFilter.addEventListener('change', updateAllReports);
        exportPdfBtn && exportPdfBtn.addEventListener('click', exportToPDF);
        exportExcelBtn && exportExcelBtn.addEventListener('click', exportToExcel);
        printBtn && printBtn.addEventListener('click', printReport);
    }

    // ===== UPDATE ALL REPORTS =====
    function updateAllReports() {
        updateSummaryCards();
        updateProcessingStats();
        updateDocumentTypeTable();
        updateStaffPerformanceTable();
        updateDelayedRequestsTable();
        updateFilterDropdowns();
    }

    function updateFilterDropdowns() {
        // Clear filters
        if (documentFilter) documentFilter.innerHTML = '<option value="">All Documents</option>';
        if (staffFilter) staffFilter.innerHTML = '<option value="">All Staff</option>';
    }

    // ===== SUMMARY CARDS =====
    function updateSummaryCards() {
        // Placeholders
        ['totalRequests', 'totalApproved', 'totalRejected', 'totalCompleted', 'rushRequests', 'totalRevenue'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '0';
        });
    }

    // ===== PROCESSING STATS =====
    function updateProcessingStats() {
        const items = document.querySelectorAll('.stat-item .stat-value');
        items.forEach(el => { el.textContent = '0 days'; });
    }

    // ===== CHARTS =====
    function initializeCharts() {
        // Empty chart placeholders
        if (document.getElementById('requestsTrendChart')) requestsTrendChart = null;
        if (document.getElementById('documentTypeChart')) documentTypeChart = null;
    }

    // ===== DOCUMENT TYPE TABLE =====
    function updateDocumentTypeTable() {
        if (docTypeTableBody) {
            docTypeTableBody.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fas fa-inbox"></i><p>No document data available</p></td></tr>`;
        }
    }

    // ===== STAFF TABLE =====
    function updateStaffPerformanceTable() {
        if (staffTableBody) {
            staffTableBody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-users"></i><p>No staff data available</p></div></td></tr>`;
        }
    }

    // ===== DELAYED TABLE =====
    function updateDelayedRequestsTable() {
        if (delayedTableBody) {
            delayedTableBody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-check-circle"></i><p>No delayed requests</p></div></td></tr>`;
            const badge = document.querySelector('#delayedCount');
            if (badge) badge.textContent = '0';
        }
    }

    // ===== EXPORT TO PDF =====
    function exportToPDF() { alert('No data to export'); }

    // ===== EXPORT TO EXCEL =====
    function exportToExcel() { alert('No data to export'); }

    // ===== PRINT =====
    function printReport() { alert('No data to print'); }

    // ===== START =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();