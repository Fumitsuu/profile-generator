document.addEventListener('DOMContentLoaded', () => {
    // 1. GRAB DOM ELEMENTS
    const registeredBtn = document.getElementById('registered-btn');
    const newCandidateBtn = document.getElementById('new-candidate-btn');
    
    const registeredSection = document.getElementById('registered-section');
    const newCandidateSection = document.getElementById('new-candidate-section');
    const profilePreviewSection = document.getElementById('profile-preview-section');
    
    const registeredForm = document.getElementById('registered-form');
    const newCandidateForm = document.getElementById('new-candidate-form');
    
    const profilePreview = document.getElementById('profile-preview');
    const exportBtn = document.getElementById('export-btn');
    const styleSelect = document.getElementById('style-select');
    
    // Replace with your Google Sheets "published as CSV" link
    // Make sure the columns match the form fields / relevantHeaders below
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQtJF1jCrrgVAj3z1xEZyaIcLf9H0PJQTF9kjuTF9iiZ7PXvtuZ5x1h91DsiXFBiIjoYqKDOoeXYMlp/pub?output=csv';

    // 2. DEFINE HEADERS FOR REGISTERED CANDIDATE LOOKUP
    // (Minimal subset needed to render the profile, or expanded as you prefer)
    const relevantHeaders = [
        'Code', 'Title', 'PreferedPronoun', 'FirstName', 'LastName', 'Password', 'EmailID',
        'Phone', 'Skype', 'VirtualMeeting', 'School', 'CurrentCity', 'CurrentCountry',
        'CurrentCountryCode', 'Website', 'SocialMedia', 'Video_lnk', 'SpouseEmail',
        'Dependants', 'Experience', 'DOB', 'Spouse', 'NoActive', 'AlumniSchool',
        'OldEmailID', 'PositionSought', 'SocialMedia1', 'SocialMedia2', 'Display',
        'LastAccessDateTime', 'LastNoticeDate', 'EmailValidated', 'Citizenship',
        'PrimaryCitizenship', 'SecondaryCitizenship', 'WorkTypeVirtual', 'WorkTypeCampus',
        'WorkTypeShort', 'Vaccination', 'CreatedDateTime', 'ApprovedDateTime'
    ];

    // 3. SHOW/HIDE SECTIONS BASED ON BUTTONS
    registeredBtn.addEventListener('click', () => {
        // Show the registered candidate form section
        registeredSection.classList.add('visible');
        // Hide the new candidate form and profile preview
        newCandidateSection.classList.remove('visible');
        profilePreviewSection.classList.remove('visible');
        // Reset export button
        disableExport();
    });

    newCandidateBtn.addEventListener('click', () => {
        // Show the new candidate registration form section
        newCandidateSection.classList.add('visible');
        // Hide the registered candidate form and profile preview
        registeredSection.classList.remove('visible');
        profilePreviewSection.classList.remove('visible');
        // Reset export button
        disableExport();
    });

    // 4. HANDLE REGISTERED CANDIDATE FORM SUBMISSION (FETCH DATA)
    registeredForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload

        const candidateEmail = document.getElementById('candidate-email').value.trim();
        if (!candidateEmail) {
            alert('Please enter a candidate\'s email.');
            return;
        }

        fetchCandidateData(candidateEmail);
    });

    async function fetchCandidateData(candidateEmail) {
        try {
            const response = await fetch(sheetUrl);
            if (!response.ok) throw new Error('Failed to fetch data from Google Sheets.');

            const data = await response.text();
            const rows = data.split('\n').map(row => row.split(','));
            const headers = rows[0].map(header => header.trim());
            const emailIndex = headers.indexOf('EmailID');

            // Find the row that matches the provided Email
            const candidateRow = rows.find(row => row[emailIndex]?.trim().toLowerCase() === candidateEmail.toLowerCase());

            if (!candidateRow) {
                alert('Candidate not found. Please check the email and try again.');
                return;
            }

            // Map row data to an object
            const profileData = mapCandidateData(headers, candidateRow);
            // Render the profile and show preview
            renderProfile(profileData);
            profilePreviewSection.classList.add('visible');
            enableExport();
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again later.');
        }
    }

    // 5. HANDLE NEW CANDIDATE FORM SUBMISSION
    newCandidateForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent page reload

        // Collect form data
        const formData = new FormData(newCandidateForm);

        // Map it to an object matching relevant headers
        const newCandidateData = {};
        relevantHeaders.forEach((header) => {
            // For convenience, the <input name="Code"> in HTML matches the 'Code' header, etc.
            // If an input doesn't exist for some header, it remains 'N/A'
            newCandidateData[header] = formData.get(header) ? formData.get(header).trim() : 'N/A';
        });

        // (Optional) Send new candidate data to the spreadsheet
        // You need a Google Apps Script or endpoint to accept POST requests and append the new row.
        // Below is a placeholder example (commented out):
        /*
        try {
            const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
                method: 'POST',
                body: JSON.stringify(newCandidateData),
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            if (!result.success) {
                alert('Could not save to spreadsheet. Please try again.');
                return;
            }
        } catch (error) {
            console.error(error);
            alert('Error saving data. Please try again.');
            return;
        }
        */

        // Render the profile locally using the data from the form
        renderProfile(newCandidateData);
        profilePreviewSection.classList.add('visible');
        enableExport();

        // Optionally reset the form
        // newCandidateForm.reset();
    });

    // 6. MAP ROW DATA (CSV) -> PROFILE OBJECT
    function mapCandidateData(headers, row) {
        const profileData = {};
        headers.forEach((header, index) => {
            if (relevantHeaders.includes(header)) {
                profileData[header] = row[index]?.trim() || 'N/A';
            }
        });
        return profileData;
    }

    // 7. RENDER PROFILE PREVIEW (USED BY BOTH REGISTERED AND NEW CANDIDATE)
    function renderProfile(data) {
        // Example minimal rendering; expand as needed with more sections
        profilePreview.innerHTML = `
            <div class="profile-card">
                <!-- Header (Avatar + Basic Info) -->
                <header class="profile-card__header">
                    <div class="profile-card__avatar">
                        <img 
                            src="https://via.placeholder.com/80" 
                            alt="Profile Picture" 
                            class="profile-card__avatar-img"
                        />
                    </div>
                    <div class="profile-card__info">
                        <h1 class="profile-card__name">
                            ${data.FirstName || 'N/A'} ${data.LastName || 'N/A'}
                        </h1>
                        <p class="profile-card__title">
                            ${data.Title || 'N/A'}
                        </p>
                        <address class="profile-card__contact">
                            ${data.CurrentCity || 'N/A'}, ${data.CurrentCountry || ''}
                            <br>
                            <a href="tel:${data.Phone}" class="profile-card__link">
                                ${data.Phone || '(123) 456-7890'}
                            </a>
                            <br>
                            <a href="mailto:${data.EmailID}" class="profile-card__link">
                                ${data.EmailID || 'no_reply@example.com'}
                            </a>
                        </address>
                    </div>
                </header>

                <!-- Main Content -->
                <main class="profile-card__main">
                    <section class="profile-card__section">
                        <h2 class="profile-card__section-title">Personal Information</h2>
                        <ul class="profile-card__list">
                            <li><strong>Preferred Pronoun:</strong> ${data.PreferedPronoun || 'N/A'}</li>
                            <li><strong>Date of Birth:</strong> ${data.DOB || 'N/A'}</li>
                            <li><strong>Citizenship:</strong> ${data.Citizenship || 'N/A'}</li>
                            <li><strong>Primary Citizenship:</strong> ${data.PrimaryCitizenship || 'N/A'}</li>
                            <li><strong>Secondary Citizenship:</strong> ${data.SecondaryCitizenship || 'N/A'}</li>
                            <li><strong>Spouse:</strong> ${data.Spouse || 'N/A'}</li>
                            <li><strong>Dependants:</strong> ${data.Dependants || 'N/A'}</li>
                        </ul>
                    </section>

                    <section class="profile-card__section">
                        <h2 class="profile-card__section-title">Professional Details</h2>
                        <ul class="profile-card__list">
                            <li><strong>Position Sought:</strong> ${data.PositionSought || 'N/A'}</li>
                            <li><strong>Experience:</strong> ${data.Experience || 'N/A'}</li>
                            <li><strong>School:</strong> ${data.School || 'N/A'}</li>
                            <li><strong>Alumni School:</strong> ${data.AlumniSchool || 'N/A'}</li>
                            <li><strong>Vaccination Status:</strong> ${data.Vaccination || 'N/A'}</li>
                        </ul>
                    </section>

                    <section class="profile-card__section">
                        <h2 class="profile-card__section-title">Work Preferences</h2>
                        <ul class="profile-card__list">
                            <li><strong>Work Type (Virtual):</strong> ${data.WorkTypeVirtual || 'N/A'}</li>
                            <li><strong>Work Type (Campus):</strong> ${data.WorkTypeCampus || 'N/A'}</li>
                            <li><strong>Work Type (Short):</strong> ${data.WorkTypeShort || 'N/A'}</li>
                        </ul>
                    </section>
                </main>

                <!-- Sidebar -->
                <aside class="profile-card__aside">
                    <section class="profile-card__section">
                        <h2 class="profile-card__section-title">Online Presence</h2>
                        <ul class="profile-card__list">
                            <li>
                                <strong>Website:</strong>
                                ${
                                    data.Website
                                        ? `<a href="${data.Website}" target="_blank" class="profile-card__link">${data.Website}</a>`
                                        : 'N/A'
                                }
                            </li>
                            <li>
                                <strong>Social Media:</strong>
                                ${
                                    data.SocialMedia
                                        ? `<a href="${data.SocialMedia}" target="_blank" class="profile-card__link">${data.SocialMedia}</a>`
                                        : 'N/A'
                                }
                            </li>
                            <li>
                                <strong>Video Link:</strong>
                                ${
                                    data.Video_lnk
                                        ? `<a href="${data.Video_lnk}" target="_blank" class="profile-card__link">Watch Video</a>`
                                        : 'N/A'
                                }
                            </li>
                        </ul>
                    </section>

                    <section class="profile-card__section">
                        <h2 class="profile-card__section-title">Key Dates</h2>
                        <ul class="profile-card__list">
                            <li><strong>Last Access Date:</strong> ${data.LastAccessDateTime || 'N/A'}</li>
                            <li><strong>Last Notice Date:</strong> ${data.LastNoticeDate || 'N/A'}</li>
                            <li><strong>Created Date:</strong> ${data.CreatedDateTime || 'N/A'}</li>
                            <li><strong>Approved Date:</strong> ${data.ApprovedDateTime || 'N/A'}</li>
                        </ul>
                    </section>
                </aside>
            </div>
        `;

        // Apply the selected style
        const selectedStyle = styleSelect.value;
        // Give the outer container the selected style classes
        profilePreview.className = `profile-container ${selectedStyle}`;
    }

    // 8. ENABLE/DISABLE EXPORT BUTTON
    function enableExport() {
        exportBtn.disabled = false;
        exportBtn.setAttribute('aria-disabled', 'false');
    }

    function disableExport() {
        exportBtn.disabled = true;
        exportBtn.setAttribute('aria-disabled', 'true');
    }

    // 9. HANDLE STYLE CHANGES (UPDATES THE PREVIEW THEME)
    styleSelect.addEventListener('change', () => {
        const selectedStyle = styleSelect.value;
        profilePreview.className = `profile-container ${selectedStyle}`;
    });

    // 10. EXPORT PROFILE AS PDF
    exportBtn.addEventListener('click', () => {
        const options = {
            margin: 1,
            filename: 'profile.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };
        html2pdf().set(options).from(profilePreview).save();
    });
});