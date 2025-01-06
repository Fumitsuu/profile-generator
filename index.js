document.addEventListener('DOMContentLoaded', () => {
    const fetchDataBtn = document.getElementById('fetch-data-btn');
    const profilePreview = document.getElementById('profile-preview');
    const exportBtn = document.getElementById('export-btn');
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQtJF1jCrrgVAj3z1xEZyaIcLf9H0PJQTF9kjuTF9iiZ7PXvtuZ5x1h91DsiXFBiIjoYqKDOoeXYMlp/pub?output=csv';

    // Fetch Data from Google Sheet
    fetchDataBtn.addEventListener('click', () => {
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

                // Create profile data object
                const profileData = {};
                headers.forEach((header, index) => {
                    profileData[header] = candidateRow[index]?.trim() || 'N/A';
                });

                renderProfile(profileData);
            })
            .catch(error => console.error('Error fetching data:', error));
    });

    // Render Profile
    function renderProfile(data) {
        profilePreview.innerHTML = `
            <div class="profile-card">
                <h3>${data.FirstName} ${data.LastName}</h3>
                <p><strong>Preferred Pronoun:</strong> ${data.PreferedPronoun}</p>
                <p><strong>Title:</strong> ${data.Title}</p>
                <p><strong>Email:</strong> <a href="mailto:${data.EmailID}">${data.EmailID}</a></p>
                <p><strong>Phone:</strong> <a href="tel:${data.Phone}">${data.Phone}</a></p>
                <p><strong>Current City:</strong> ${data.CurrentCity}</p>
                <p><strong>Current Country:</strong> ${data.CurrentCountry}</p>
                <p><strong>Experience:</strong> ${data.Experience}</p>
                <p><strong>Position Sought:</strong> ${data.PositionSought}</p>
                <p><strong>Website:</strong> <a href="${data.Website}" target="_blank">${data.Website}</a></p>
                <p><strong>Social Media:</strong> <a href="${data.SocialMedia}" target="_blank">${data.SocialMedia}</a></p>
                <p><strong>Vaccination Status:</strong> ${data.Vaccination}</p>
            </div>
        `;
    }

    // Export Profile as PDF
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