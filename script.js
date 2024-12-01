document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Add form submission handler
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Validate inputs
        if (!nameInput.value || !emailInput.value || !messageInput.value) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        // Prepare form data
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value,
        };

        try {
            // Send form data via AJAX to the server
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Message sent successfully! Thank you.');
                form.reset(); // Reset the form after successful submission
            } else {
                alert('Failed to send the message. Please try again later.');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
