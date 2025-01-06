document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('save-btn');
    const exportBtn = document.getElementById('export-btn');
    const profilePreview = document.getElementById('profile-preview');
    const templateSelector = document.getElementById('template');
    const fetchDataBtn = document.getElementById('fetch-data-btn');
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQtJF1jCrrgVAj3z1xEZyaIcLf9H0PJQTF9kjuTF9iiZ7PXvtuZ5x1h91DsiXFBiIjoYqKDOoeXYMlp/pub?output=csv'; // CSV link for Google Sheet

    // Initialize GrapesJS
    const editor = grapesjs.init({
        container: '#editor',
        height: '500px',
        width: 'auto',
        fromElement: false,
        storageManager: false,
        panels: { defaults: [] }, // Simplify the UI if needed
        components: '<div class="profile-template">Customize your profile here!</div>',
        style: `
            .profile-template {
                font-family: Arial, sans-serif;
                font-size: 16px;
                padding: 20px;
                border: 1px solid #ddd;
                background-color: #fff;
                border-radius: 12px;
            }
        `,
    });

    // Fetch and Load Data from Google Sheet
    fetchDataBtn?.addEventListener('click', () => {
        const candidateName = document.getElementById('candidate-name').value.trim();
        if (!candidateName) {
            alert('Please enter a name');
            return;
        }

        fetch(sheetUrl)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(','));
                const headers = rows[0].map(header => header.trim());
                const candidateRow = rows.find(row => row[headers.indexOf('FirstName')]?.trim() === candidateName);

                if (!candidateRow) {
                    alert('Candidate not found!');
                    return;
                }

                // Map row data to profile fields
                const profileData = {};
                headers.forEach((header, index) => {
                    profileData[header] = candidateRow[index]?.trim() || 'N/A';
                });

                loadGrapesEditorContent(profileData);
                renderProfile(profileData);
            })
            .catch(error => console.error('Error fetching data:', error));
    });

    // Render Profile Preview
    function renderProfile(data) {
        const template = templateSelector.value;

        let profileHTML = `
            <div class="profile-card">
                <h3>${data.FirstName} ${data.LastName}</h3>
                <p><strong>Preferred Pronoun:</strong> ${data.PreferedPronoun}</p>
                <p><strong>Title:</strong> ${data.Title}</p>
                <p><strong>Email:</strong> ${data.EmailID}</p>
                <p><strong>Phone:</strong> ${data.Phone}</p>
                <p><strong>Current City:</strong> ${data.CurrentCity}</p>
                <p><strong>Experience:</strong> ${data.Experience}</p>
            </div>
        `;

        if (template === 'classic') {
            profileHTML = `<div style="font-family: serif; background-color: #f9f9f9; padding: 1rem; border-radius: 12px;">${profileHTML}</div>`;
        } else if (template === 'minimal') {
            profileHTML = `<div style="color: #333; font-size: 14px; padding: 1rem; background-color: #fff; border-radius: 8px;">${profileHTML}</div>`;
        }

        profilePreview.innerHTML = profileHTML;
    }

    // Dynamically Update GrapesJS Editor
    function loadGrapesEditorContent(profileData) {
        const templateContent = `
            <div class="profile-template">
                <h1>${profileData.FirstName || 'Your Name'}</h1>
                <p><strong>Preferred Pronoun:</strong> ${profileData.PreferedPronoun || 'N/A'}</p>
                <p><strong>Title:</strong> ${profileData.Title || 'N/A'}</p>
                <p><strong>Email:</strong> ${profileData.EmailID || 'N/A'}</p>
                <p><strong>Current City:</strong> ${profileData.CurrentCity || 'N/A'}</p>
                <h2>Experience</h2>
                <p>${profileData.Experience || 'Your Experience'}</p>
            </div>
        `;

        editor.setComponents(templateContent);
    }

    // Export as PDF
    exportBtn.addEventListener('click', () => {
        const options = {
            margin: 1,
            filename: 'profile.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf().set(options).from(profilePreview).save();
    });

    // Save Edited Template
    saveBtn.addEventListener('click', () => {
        const html = editor.getHtml();
        const css = editor.getCss();
        console.log('Generated HTML:', html);
        console.log('Generated CSS:', css);
        alert('Template saved! Check console for details.');
    });
});