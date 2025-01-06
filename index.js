document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('save-btn');
    const exportBtn = document.getElementById('export-btn');
    const profilePreview = document.getElementById('profile-preview');
    const templateSelector = document.getElementById('template');

    // Save and Render Profile
    saveBtn.addEventListener('click', () => {
        const profileData = {
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            address: document.getElementById('address').value,
            contact: document.getElementById('contact').value,
            education: document.getElementById('education').value,
            experience: document.getElementById('experience').value,
            skills: document.getElementById('skills').value,
            hobbies: document.getElementById('hobbies').value,
            certifications: document.getElementById('certifications').value,
            references: document.getElementById('references').value,
        };

        renderProfile(profileData);
    });

    // Render Profile Preview
    function renderProfile(data) {
        const template = templateSelector.value;

        let profileHTML = `
            <h3>${data.name}</h3>
            <p><strong>Age:</strong> ${data.age}</p>
            <p><strong>Address:</strong> ${data.address}</p>
            <p><strong>Contact:</strong> ${data.contact}</p>
            <h4>Education</h4>
            <p>${data.education}</p>
            <h4>Work Experience</h4>
            <p>${data.experience}</p>
            <h4>Skills</h4>
            <p>${data.skills}</p>
            <h4>Hobbies</h4>
            <p>${data.hobbies}</p>
            <h4>Certifications</h4>
            <p>${data.certifications}</p>
            <h4>References</h4>
            <p>${data.references}</p>
        `;

        if (template === 'classic') {
            profileHTML = `<div style="font-family: serif;">${profileHTML}</div>`;
        } else if (template === 'minimal') {
            profileHTML = `<div style="color: #333; font-size: 14px;">${profileHTML}</div>`;
        }

        profilePreview.innerHTML = profileHTML;
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
});