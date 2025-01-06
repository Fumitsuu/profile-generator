document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('save-btn');
    const exportBtn = document.getElementById('export-btn');
    const preview = document.getElementById('profile-preview');

    // Save Profile Data and Render Preview
    saveBtn.addEventListener('click', () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const skills = document.getElementById('skills').value;

        // Save data locally (optional, for browser persistence)
        localStorage.setItem('profile', JSON.stringify({ name, email, skills }));

        // Render profile preview
        preview.innerHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Skills:</strong> ${skills}</p>
        `;
    });

    // Export Profile as PDF
    exportBtn.addEventListener('click', () => {
        const html2pdf = window.html2pdf;
        if (!html2pdf) {
            alert('html2pdf.js library is required for exporting PDFs.');
            return;
        }

        html2pdf().from(preview).save('profile.pdf');
    });
});