document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from reloading the page

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Save the form data to localStorage (simulating saving the data)
    const contactData = {
        name: name,
        email: email,
        message: message,
    };
    localStorage.setItem('contactMessage', JSON.stringify(contactData));

    // Display thank you message
    document.getElementById('responseMessage').classList.remove('hidden');

    // Clear the form
    document.getElementById('contactForm').reset();

    // Simulate sending email (In real-life, you would send this data to a server)
    console.log("Simulating sending message to ChristinaPhan99202@gmail.com:");
    console.log(contactData);
});
