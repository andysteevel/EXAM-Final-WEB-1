/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let accuracy = 100;
let incorrectWordsIndices = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 50) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    accuracy = 100;
    incorrectWordsIndices = [];
    accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results.textContent = "";
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - startTime) / 6000; // Seconds
    const correctCount = currentWordIndex - incorrectWordsIndices.length;
    const wpm = (correctCount * 5) / elapsedTime; // 5 chars = 1 word    
    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed

        const typedWord = inputField.value.trim();
        const currentWord = wordsToType[currentWordIndex];  

        if (typedWord === currentWord) {
            if (!previousEndTime) previousEndTime = startTime;
        } else {
            wordDisplay.children[currentWordIndex].style.color = "red";
            incorrectWordsIndices.push(currentWordIndex);
            accuracy = Math.max(0, accuracy - 2);
            accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
        }

        currentWordIndex++;
        
        if (currentWordIndex < wordsToType.length) {
            highlightNextWord();
            inputField.value = "";
            event.preventDefault();
        } else {
            const { wpm } = getCurrentStats();
            results.textContent = `Test completed! WPM: ${wpm}, Final Accuracy: ${accuracy}%`;
            inputField.disabled = true;
        }
    }
};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;
    
    // Ne réinitialise pas la couleur des mots incorrects
    Array.from(wordElements).forEach((el, index) => {
        if (!incorrectWordsIndices.includes(index)) {
            el.style.color = index === currentWordIndex ? "red" : "black";
        }
    });
    
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});

inputField.addEventListener("input", () => {
    const currentWord = wordsToType[currentWordIndex];
    const typedWord = inputField.value;
    const wordElement = wordDisplay.children[currentWordIndex];
    
    if (!incorrectWordsIndices.includes(currentWordIndex)) {
        wordElement.style.color = typedWord === currentWord.slice(0, typedWord.length) ? "red" : "darkred";
    }
});

document.getElementById('restart-button').addEventListener('click', () => {
    inputField.disabled = false;
    startTest();
    inputField.focus();
});

modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();
