// QueueLess - Smart Queue Management System

// Get HTML elements
const bookingForm = document.getElementById("bookingForm");
const result = document.getElementById("result");
const queueStatus = document.getElementById("queueStatus");

// Store queue information
let queues = JSON.parse(localStorage.getItem("queues")) || {
    "Student Help Desk": [],
    "Library Counter": [],
    "Accounts Office": []
};

// Generate unique token
function generateToken(service) {

    let prefix = "";

    if (service === "Student Help Desk") {
        prefix = "H";
    }
    else if (service === "Library Counter") {
        prefix = "L";
    }
    else {
        prefix = "A";
    }

    let tokenNumber = queues[service].length + 1;

    return prefix + "-" + String(tokenNumber).padStart(3, "0");
}

// Book token
bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const service = document.getElementById("service").value;

    if (name === "" || studentId === "" || service === "") {
        alert("Please fill all the details!");
        return;
    }

    const token = generateToken(service);

    const student = {
        name: name,
        studentId: studentId,
        service: service,
        token: token
    };

    // Add student to queue
    queues[service].push(student);

    // Save data in browser
    localStorage.setItem("queues", JSON.stringify(queues));

    // Display confirmation
    result.innerHTML = `
        <h3>Token Booked Successfully!</h3>
        <p>Welcome, ${escapeHTML(name)}!</p>
        <p>Your Token Number:</p>
        <h2>${token}</h2>
        <p>Service: ${escapeHTML(service)}</p>
    `;

    // Clear form
    bookingForm.reset();

    // Update queue status
    displayQueue();

});

// Safely display user-provided text
function escapeHTML(value) {
    return value.replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

// Display queue information
function displayQueue() {

    let output = "";

    for (let service in queues) {

        output += `
            <div class="queue-box">
                <h3>${service}</h3>
                <p>People Waiting: ${queues[service].length}</p>
            </div>
        `;

    }

    queueStatus.innerHTML = output;
}

// Display queue when website opens
displayQueue();