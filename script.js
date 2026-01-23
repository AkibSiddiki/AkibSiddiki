document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update visible section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetTab) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Simple Input Handler
    const askInput = document.querySelector('.footer-input input');
    const submitBtn = document.querySelector('.submit-btn');

    const handleAsk = () => {
        const question = askInput.value.trim();
        if (question) {
            alert(`You asked: "${question}"\n\n(This is a demonstration of the UI. In a real application, this could connect to an AI service or FAQ system.)`);
            askInput.value = '';
        }
    };

    submitBtn.addEventListener('click', handleAsk);
    askInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAsk();
    });
});
