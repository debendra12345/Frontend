/**
 * ============================================
 * Tech.Care HealthCare Dashboard - Main Script
 * ============================================
 *
 * Fetches patient data from Coalition Technologies API,
 * filters for Jessica Taylor, and renders the full dashboard
 * including blood pressure chart, vitals, diagnostic list,
 * patient profile, and lab results.
 */

// ============================================
// CONSTANTS
// ============================================
const API_URL = 'https://fedskillstest.coalitiontechnologies.workers.dev';
const API_USERNAME = 'coalition';
const API_PASSWORD = 'skills-test';

// ============================================
// DOM REFERENCES
// Populated after DOMContentLoaded to ensure elements exist
// ============================================
let DOM = {};

// Chart instance reference (for cleanup)
let bpChartInstance = null;

// Global reference for all fetched patients (used for click handling)
let allPatientsData = [];

/**
 * Populates the DOM reference object after the document is ready.
 */
function initDOMRefs() {
  DOM = {
    loadingOverlay: null,   // removed — layout renders immediately via skeletons
    errorOverlay: document.getElementById('error-overlay'),
    errorMessage: document.getElementById('error-message'),
    patientList: document.getElementById('patient-list'),
    // Chart
    bpChart: document.getElementById('bp-chart'),
    systolicValue: document.getElementById('systolic-value'),
    systolicLevel: document.getElementById('systolic-level'),
    diastolicValue: document.getElementById('diastolic-value'),
    diastolicLevel: document.getElementById('diastolic-level'),
    // Vitals
    respiratoryValue: document.getElementById('respiratory-value'),
    respiratoryStatus: document.getElementById('respiratory-status'),
    temperatureValue: document.getElementById('temperature-value'),
    temperatureStatus: document.getElementById('temperature-status'),
    heartRateValue: document.getElementById('heart-rate-value'),
    heartRateStatus: document.getElementById('heart-rate-status'),
    // Diagnostic Table
    diagnosticTbody: document.getElementById('diagnostic-tbody'),
    // Profile
    profilePhoto: document.getElementById('profile-photo'),
    profileName: document.getElementById('profile-name'),
    profileDob: document.getElementById('profile-dob'),
    profileGender: document.getElementById('profile-gender'),
    profilePhone: document.getElementById('profile-phone'),
    profileEmergency: document.getElementById('profile-emergency'),
    profileInsurance: document.getElementById('profile-insurance'),
    // Lab Results
    labResultsList: document.getElementById('lab-results-list'),
  };

  // Attach event listener for clicking on patient items list
  DOM.patientList.addEventListener('click', (e) => {
    const item = e.target.closest('.patient-item');
    if (!item) return;

    const patientName = item.dataset.name;
    if (!patientName) return; // Ignore skeleton clicks

    const selectedPatient = allPatientsData.find(p => p.name === patientName);

    if (selectedPatient) {
      // Re-render UI with newly selected patient
      renderUI(selectedPatient, allPatientsData);
      
      // Scroll smoothly back to top for a better mobile/tablet experience
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Global click handler to manage Nav active states and placeholder buttons
  document.body.addEventListener('click', (e) => {
    // 1. Handle Navigation links
    const navItem = e.target.closest('.nav-item');
    if (navItem) {
      e.preventDefault(); // Prevent page jump from href="#"
      // Remove active class from all
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      // Add active class to clicked
      navItem.classList.add('active');
      return;
    }

    // 2. Prevent default on any other empty anchor links
    const anchor = e.target.closest('a');
    if (anchor && anchor.getAttribute('href') === '#') {
      e.preventDefault();
    }

    // 3. Handle standalone buttons (Search, Download, Show All)
    const btn = e.target.closest('button');
    if (btn && !btn.classList.contains('patient-item')) {
      // Small visual feedback animation to prove it registered
      const originalScale = btn.style.transform;
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => btn.style.transform = originalScale, 150);
      
      // Example of handling specific buttons
      if (btn.id === 'show-all-btn') {
        console.log('Show All Information clicked - placeholder');
      } else if (btn.classList.contains('lab-download-btn')) {
        console.log('Downloading lab result - placeholder');
      }
    }
  });
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetches all patient data from the API using Basic Auth.
 * Encodes credentials properly (not hardcoded base64).
 * @returns {Promise<Array>} Array of patient objects
 */
async function fetchPatientData() {
  // Encode credentials using btoa (proper encryption as per API docs)
  const credentials = btoa(`${API_USERNAME}:${API_PASSWORD}`);

  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Filters the patient array to find Jessica Taylor.
 * @param {Array} patients - Array of all patients
 * @returns {Object|null} Jessica Taylor's data or null
 */
function filterJessicaTaylor(patients) {
  return patients.find(patient => patient.name === 'Jessica Taylor') || null;
}

// ============================================
// RENDER FUNCTIONS
// ============================================

/**
 * Main render orchestrator. Populates all UI sections.
 * @param {Object} jessica - Jessica Taylor's patient data
 * @param {Array} allPatients - All patients for the sidebar
 */
function renderUI(jessica, allPatients) {
  renderPatientList(allPatients, jessica.name);
  renderProfile(jessica);
  renderVitals(jessica);
  renderDiagnosticList(jessica);
  renderLabResults(jessica);
  renderChart(jessica);
}

/**
 * Renders the patient list in the left sidebar.
 * Highlights Jessica Taylor as the active patient.
 * @param {Array} patients - All patient objects
 * @param {string} activeName - Name of the active patient
 */
function renderPatientList(patients, activeName) {
  DOM.patientList.innerHTML = patients.map(patient => {
    const isActive = patient.name === activeName;
    return `
      <li class="patient-item ${isActive ? 'active' : ''}" data-name="${patient.name}">
        <img
          src="${patient.profile_picture}"
          alt="${patient.name}"
          class="patient-avatar"
          width="48"
          height="48"
          loading="lazy"
        >
        <div class="patient-info">
          <span class="patient-name">${patient.name}</span>
          <span class="patient-meta">${patient.gender}, ${patient.age}</span>
        </div>
        <span class="material-icons patient-more-icon">more_horiz</span>
      </li>
    `;
  }).join('');
}

/**
 * Renders the patient profile card on the right sidebar.
 * @param {Object} patient - Jessica Taylor's patient data
 */
function renderProfile(patient) {
  DOM.profilePhoto.src = patient.profile_picture;
  DOM.profilePhoto.alt = patient.name;
  DOM.profileName.textContent = patient.name;
  DOM.profileDob.textContent = formatDate(patient.date_of_birth);
  DOM.profileGender.textContent = patient.gender;
  DOM.profilePhone.textContent = patient.phone_number;
  DOM.profileEmergency.textContent = patient.emergency_contact;
  DOM.profileInsurance.textContent = patient.insurance_type;
}

/**
 * Renders the vital signs cards using the latest diagnosis history entry.
 * @param {Object} patient - Jessica Taylor's patient data
 */
function renderVitals(patient) {
  // Use the most recent diagnosis history entry for vital values
  const latestDiagnosis = patient.diagnosis_history?.[0];

  if (!latestDiagnosis) return;

  // Respiratory Rate
  DOM.respiratoryValue.textContent = `${latestDiagnosis.respiratory_rate.value} bpm`;
  DOM.respiratoryStatus.textContent = latestDiagnosis.respiratory_rate.levels;

  // Temperature
  DOM.temperatureValue.textContent = `${latestDiagnosis.temperature.value}°F`;
  DOM.temperatureStatus.textContent = latestDiagnosis.temperature.levels;

  // Heart Rate
  DOM.heartRateValue.textContent = `${latestDiagnosis.heart_rate.value} bpm`;
  DOM.heartRateStatus.textContent = latestDiagnosis.heart_rate.levels;

  // BP legend: most recent systolic & diastolic values with arrow direction
  const systolicLevels = latestDiagnosis.blood_pressure.systolic.levels;
  const diastolicLevels = latestDiagnosis.blood_pressure.diastolic.levels;

  DOM.systolicValue.textContent = latestDiagnosis.blood_pressure.systolic.value;
  DOM.systolicLevel.textContent = systolicLevels;
  DOM.diastolicValue.textContent = latestDiagnosis.blood_pressure.diastolic.value;
  DOM.diastolicLevel.textContent = diastolicLevels;

  // Dynamically swap arrow direction in the BP legend based on level text
  const systolicArrow = document.getElementById('systolic-arrow');
  const diastolicArrow = document.getElementById('diastolic-arrow');
  if (systolicArrow) {
    systolicArrow.textContent = isHigher(systolicLevels) ? 'arrow_upward' : 'arrow_downward';
  }
  if (diastolicArrow) {
    diastolicArrow.textContent = isHigher(diastolicLevels) ? 'arrow_upward' : 'arrow_downward';
  }
}

/**
 * Renders the diagnostic list table.
 * @param {Object} patient - Jessica Taylor's patient data
 */
function renderDiagnosticList(patient) {
  const diagnostics = patient.diagnostic_list || [];

  DOM.diagnosticTbody.innerHTML = diagnostics.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.status}</td>
    </tr>
  `).join('');
}

/**
 * Renders the lab results list.
 * @param {Object} patient - Jessica Taylor's patient data
 */
function renderLabResults(patient) {
  const labs = patient.lab_results || [];

  DOM.labResultsList.innerHTML = labs.map(lab => `
    <li class="lab-result-item">
      <span class="lab-result-name">${lab}</span>
      <button class="lab-download-btn" aria-label="Download ${lab}">
        <span class="material-icons" style="font-size:20px;color:#707070">download</span>
      </button>
    </li>
  `).join('');
}

/**
 * Renders the Blood Pressure line chart using Chart.js.
 * Shows systolic (pink) and diastolic (purple) over last 6 months.
 * @param {Object} patient - Jessica Taylor's patient data
 */
function renderChart(patient) {
  const diagnosisHistory = patient.diagnosis_history || [];

  // Extract last 6 months of data (reversed so oldest is first on X axis)
  const recentData = diagnosisHistory.slice(0, 6).reverse();

  // Build labels (e.g., "Oct, 2023")
  const labels = recentData.map(entry => {
    const monthShort = entry.month.substring(0, 3);
    return `${monthShort}, ${entry.year}`;
  });

  // Extract systolic and diastolic values
  const systolicData = recentData.map(entry => entry.blood_pressure.systolic.value);
  const diastolicData = recentData.map(entry => entry.blood_pressure.diastolic.value);

  // Destroy previous chart instance if it exists
  if (bpChartInstance) {
    bpChartInstance.destroy();
  }

  // Create the chart
  const ctx = DOM.bpChart.getContext('2d');

  bpChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Systolic',
          data: systolicData,
          borderColor: '#E66FD2',
          backgroundColor: '#E66FD2',
          pointBackgroundColor: '#E66FD2',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 2,
          tension: 0.4, // Smooth curves
          fill: false,
        },
        {
          label: 'Diastolic',
          data: diastolicData,
          borderColor: '#8C6FE6',
          backgroundColor: '#8C6FE6',
          pointBackgroundColor: '#8C6FE6',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 2,
          tension: 0.4,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          display: false, // We have a custom legend panel
        },
        tooltip: {
          backgroundColor: '#FFFFFF',
          titleColor: '#072635',
          bodyColor: '#072635',
          borderColor: '#EDEDED',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            family: 'Manrope',
            weight: '700',
            size: 13,
          },
          bodyFont: {
            family: 'Manrope',
            size: 12,
          },
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw} mmHg`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: 'Manrope',
              size: 12,
            },
            color: '#707070',
          },
          border: {
            display: false,
          },
        },
        y: {
          min: 60,
          max: 180,
          ticks: {
            stepSize: 20,
            font: {
              family: 'Manrope',
              size: 12,
            },
            color: '#707070',
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
          border: {
            display: false,
          },
        },
      },
    },
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Formats an ISO date string to a readable format.
 * e.g., "1996-08-23" → "August 23, 1996"
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Shows the loading overlay (no-op: layout renders immediately via skeletons).
 */
function showLoading() {
  DOM.errorOverlay.classList.add('hidden');
}

/**
 * Hides the loading overlay (no-op).
 */
function hideLoading() {
  // Nothing to hide — skeletons are replaced by real content in renderPatientList()
}

/**
 * Shows the error overlay with a message.
 * @param {string} message - Error message to display
 */
function showError(message) {
  DOM.loadingOverlay.classList.add('hidden');
  DOM.errorOverlay.classList.remove('hidden');
  DOM.errorMessage.textContent = message || 'An error occurred while fetching patient data.';
}

// ============================================
// UTILITY: Arrow Direction Helper
// ============================================

/**
 * Returns true if the level text implies "higher" / above average.
 * @param {string} level - Level string from API e.g. "Higher than Average"
 * @returns {boolean}
 */
function isHigher(level) {
  return typeof level === 'string' && level.toLowerCase().includes('higher');
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Main initialization function.
 * Fetches data, filters Jessica Taylor, renders UI.
 * Chart.js is deferred — we poll until it's available.
 */
async function init() {
  showLoading();

  try {
    // Fetch patient data and wait for Chart.js to be ready in parallel
    const [patients] = await Promise.all([
      fetchPatientData(),
      waitForChartJS(),  // ensure deferred Chart.js is loaded before we render chart
    ]);

    // Store globally for the click handler
    allPatientsData = patients;

    // Filter for initial patient (Jessica Taylor)
    const jessica = filterJessicaTaylor(patients);

    if (!jessica) {
      showError('Patient "Jessica Taylor" was not found in the data.');
      return;
    }

    // Render everything
    renderUI(jessica, patients);
    hideLoading();

  } catch (error) {
    console.error('Failed to initialize dashboard:', error);
    showError(`Failed to load data: ${error.message}`);
  }
}

/**
 * Polls until Chart.js (deferred) is available on window.Chart.
 * Resolves immediately if already loaded.
 * @returns {Promise<void>}
 */
function waitForChartJS() {
  return new Promise((resolve) => {
    if (typeof Chart !== 'undefined') return resolve();
    const interval = setInterval(() => {
      if (typeof Chart !== 'undefined') {
        clearInterval(interval);
        resolve();
      }
    }, 20);
  });
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initDOMRefs(); // Populate DOM references after DOM is parsed
  init();        // Kick off data fetch and render
});
