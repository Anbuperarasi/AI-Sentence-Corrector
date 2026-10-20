async function correctSentence() {
    console.log("Button clicked successfully!"); // Console-இல் பட்டன் கிளிக் ஆவதை சரிபார்க்க

    const inputText = document.getElementById('inputText').value;
    const resultBox = document.getElementById('resultBox');
    const correctedOutput = document.getElementById('correctedOutput');

    if (!inputText.trim()) {
        alert("Please enter a sentence first!");
        return;
    }

    resultBox.style.display = "block";
    correctedOutput.innerText = "Correcting...";

    try {
        const response = await fetch('/api/correct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: inputText })
        });

        const data = await response.json();

        if (response.ok && data.correctedText) {
            correctedOutput.innerText = data.correctedText;
        } else {
            correctedOutput.innerText = "Error: " + (data.error || "Failed to correct sentence");
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        correctedOutput.innerText = "Server Error! Make sure 'node server.js' is running.";
    }
}