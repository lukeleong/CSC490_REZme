document.getElementById('injuryForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = {
        injuryName: document.getElementById('injuryName').value,
        injuryDate: document.getElementById('injuryDate').value,
        severity: document.getElementById('severity').value,
        bodyPart: document.getElementById('bodyPart').value,
        description: document.getElementById('description').value,
        userId: document.getElementById('userId').value,
    };

    fetch('/models/injuries', { // Adjust the URL if necessary
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {  // Check if the response status is not ok
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Injury logged successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to log injury.');
    });
});