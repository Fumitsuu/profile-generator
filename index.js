document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('save-btn');
    const exportBtn = document.getElementById('export-btn');
    const profilePreview = document.getElementById('profile-preview');
    const templateSelector = document.getElementById('template');

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
            <div class="profile-card">
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
            </div>
        `;

        if (template === 'classic') {
            profileHTML = `<div style="font-family: serif; background-color: #f9f9f9; padding: 1rem; border-radius: 12px;">${profileHTML}</div>`;
        } else if (template === 'minimal') {
            profileHTML = `<div style="color: #333; font-size: 14px; padding: 1rem; background-color: #fff; border-radius: 8px;">${profileHTML}</div>`;
        }

        profilePreview.innerHTML = profileHTML;
    }

    // Synchronize GrapesJS Content with Preview
    document.getElementById('template').addEventListener('change', () => {
        const html = editor.getHtml();
        const css = editor.getCss();
        profilePreview.innerHTML = `
            <style>${css}</style>
            ${html}
        `;
    });

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

    // Dynamically Update GrapesJS Editor
    function loadGrapesEditorContent(profileData) {
        const templateContent = `
            <div class="profile-template">
                <h1>${profileData.name || 'Your Name'}</h1>
                <p><strong>Age:</strong> ${profileData.age || 'Your Age'}</p>
                <p><strong>Address:</strong> ${profileData.address || 'Your Address'}</p>
                <p><strong>Contact:</strong> ${profileData.contact || 'Your Contact Info'}</p>
                <h2>Education</h2>
                <p>${profileData.education || 'Your Education Details'}</p>
                <h2>Experience</h2>
                <p>${profileData.experience || 'Your Work Experience'}</p>
            </div>
        `;

        editor.setComponents(templateContent);
    }

    // Load Initial Profile Data into GrapesJS
    loadGrapesEditorContent({
        name: 'John Doe',
        age: 30,
        address: '123 Main St, Springfield',
        contact: '+123456789',
        education: 'B.Sc. in Computer Science, XYZ University',
        experience: 'Software Engineer at ABC Corp',
    });
});