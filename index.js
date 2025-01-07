document.addEventListener('DOMContentLoaded', () => {
    const fetchDataBtn = document.getElementById('fetch-data-btn');
    const profilePreview = document.getElementById('profile-preview');
    const exportBtn = document.getElementById('export-btn');
    const styleSelect = document.getElementById('style-select');
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQtJF1jCrrgVAj3z1xEZyaIcLf9H0PJQTF9kjuTF9iiZ7PXvtuZ5x1h91DsiXFBiIjoYqKDOoeXYMlp/pub?output=csv';

    const relevantHeaders = [
        'FirstName', 'LastName', 'PreferedPronoun', 'Title', 'EmailID', 'Phone', 'Skype',
        'VirtualMeeting', 'School', 'CurrentCity', 'CurrentCountry', 'Website', 'SocialMedia',
        'SocialMedia1', 'SocialMedia2', 'PositionSought', 'Experience', 'Vaccination',
        'PrimaryCitizenship', 'SecondaryCitizenship', 'WorkTypeVirtual', 'WorkTypeCampus',
        'WorkTypeShort', 'Dependants', 'DOB', 'Spouse', 'NoActive', 'Video_lnk'
    ];

    // Fetch Data from Google Sheets
    fetchDataBtn.addEventListener('click', () => {
        const candidateName = document.getElementById('candidate-name').value.trim();

        if (!candidateName) {
            alert('Please enter a candidate\'s name.');
            return;
        }

        fetchCandidateData(candidateName);
    });

    const fetchCandidateData = async (candidateName) => {
        try {
            const response = await fetch(sheetUrl);
            if (!response.ok) throw new Error('Failed to fetch data from Google Sheets.');

            const data = await response.text();
            const rows = data.split('\n').map(row => row.split(','));
            const headers = rows[0].map(header => header.trim());
            const candidateIndex = headers.indexOf('FirstName');

            const candidateRow = rows.find(row => row[candidateIndex]?.trim() === candidateName);

            if (!candidateRow) {
                alert('Candidate not found. Please check the name and try again.');
                return;
            }

            const profileData = mapCandidateData(headers, candidateRow);
            renderProfile(profileData);
            enableExport();
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again later.');
        }
    };

    const mapCandidateData = (headers, row) => {
        const profileData = {};
        headers.forEach((header, index) => {
            if (relevantHeaders.includes(header)) {
                profileData[header] = row[index]?.trim() || 'N/A';
            }
        });
        return profileData;
    };

    // Render Profile Preview
    function renderProfile(data) {
        profilePreview.innerHTML = `
            <div class="profile-card">
                <!-- Header: Avatar + Basic Info -->
                <header class="profile-card__header">
                    <div class="profile-card__avatar">
                        <img 
                            src="https://via.placeholder.com/80" 
                            alt="Profile Picture" 
                            class="profile-card__avatar-img"
                        />
                    </div>
                    <div class="profile-card__info">
                        <h1 class="profile-card__name">${data.FirstName || 'N/A'} ${data.LastName || 'N/A'}</h1>
                        <p class="profile-card__title">${data.Title || 'N/A'}</p>
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
                            <li><strong>Dependants:</strong> ${data.Dependants || 'N/A'}</li>
                            <li><strong>Spouse:</strong> ${data.Spouse || 'N/A'}</li>
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
                        <h2 class="profile-card__section-title">Contact Information</h2>
                        <ul class="profile-card__list">
                            <li>
                                <strong>Email:</strong> 
                                <a href="mailto:${data.EmailID}" class="profile-card__link">
                                    ${data.EmailID || 'N/A'}
                                </a>
                            </li>
                            <li>
                                <strong>Phone:</strong> 
                                <a href="tel:${data.Phone}" class="profile-card__link">
                                    ${data.Phone || 'N/A'}
                                </a>
                            </li>
                            <li><strong>Skype:</strong> ${data.Skype || 'N/A'}</li>
                            <li>
                                <strong>Virtual Meeting:</strong>
                                ${
                                    data.VirtualMeeting
                                        ? `<a href="${data.VirtualMeeting}" target="_blank" class="profile-card__link">Join Meeting</a>`
                                        : 'N/A'
                                }
                            </li>
                        </ul>
                    </section>
    
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
    
    // Apply selected style
    const selectedStyle = styleSelect.value;
    profilePreview.className = `profile-card profile-container ${selectedStyle}`;
}

    // Enable Export Button
    const enableExport = () => {
        exportBtn.disabled = false;
        exportBtn.setAttribute('aria-disabled', 'false');
    };

    // Handle Style Changes
    styleSelect.addEventListener('change', () => {
        const selectedStyle = styleSelect.value;
        profilePreview.className = `profile-container ${selectedStyle}`;
    });

    // Export Profile as PDF
    exportBtn.addEventListener('click', () => {
        const options = {
            margin: 1,
            filename: `${document.getElementById('candidate-name').value.trim()}_profile.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf().set(options).from(profilePreview).save();
    });
});