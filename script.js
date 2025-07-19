const MY_SECRET_API_KEY = "AIzaSyD6_urosALLp6C9twGzJuMoM-5oFzJ_ssk";
const passwordInput = document.getElementById('passwordInput');
const roastButton = document.getElementById('roastButton');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');
const roastContent = document.getElementById('roastContent');
const roastMessage = document.getElementById('roastMessage');
const roastImage = document.getElementById('roastImage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const toggleVisibility = document.getElementById('toggleVisibility');
const eyeOpen = document.getElementById('eye-open');
const eyeClosed = document.getElementById('eye-closed');

const memeDatabase = [
    'https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif',
    'https://media.tenor.com/1B5-G4I_f48AAAAC/disappointed-disappointment.gif',
    'https://media.tenor.com/1W9R_t4-L2wAAAAC/kermit-the-frog-typing.gif',
    'https://media.tenor.com/g2a1l2B12zAAAAAC/disgusted-disgust-ew.gif',
    'https://media.tenor.com/tZ2Xd8_oZ_sAAAAC/no-no-no-way.gif',
    'https://media.tenor.com/hmfGmxKq5wQAAAAC/spongebob-spongebob-squarepants.gif',
    'https://media.tenor.com/1f_1D5_sB-sAAAAC/what-the-hell-is-this-will-smith.gif'
];

toggleVisibility.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeOpen.classList.toggle('hidden', isPassword);
    eyeClosed.classList.toggle('hidden', !isPassword);
});

roastButton.addEventListener('click', () => {
    const apiKey = MY_SECRET_API_KEY;
    const password = passwordInput.value;

    if (!apiKey) {
        displayError("Please enter your API Key first. 🔑");
        return;
    }

    if (!password) {
        displayError("You gotta enter a password to roast. Duh. 🤔");
        return;
    }

    resultSection.classList.remove('hidden');
    roastContent.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loader.classList.remove('hidden');

    analyzeAndRoast(password, apiKey);
});

function getPasswordCharacteristics(password) {
    const characteristics = [];
    if (password.length < 8) characteristics.push("it's shorter than my attention span");
    if (password.length > 20) characteristics.push("it's longer than a CVS receipt");
    if (!/[A-Z]/.test(password)) characteristics.push("has no uppercase letters");
    if (!/[a-z]/.test(password)) characteristics.push("has no lowercase letters");
    if (!/\d/.test(password)) characteristics.push("has no numbers");
    if (!/[^A-Za-z0-9]/.test(password)) characteristics.push("has no special characters");
    if (/(password|1234|qwerty|iloveyou)/i.test(password)) characteristics.push("uses a super common word");

    if (characteristics.length === 0) {
        return "it's actually kinda decent, I'm shook.";
    }
    return characteristics.join(', ');
}

async function analyzeAndRoast(password, apiKey) {
    const characteristics = getPasswordCharacteristics(password);
    const prompt = `You are a savage, hilarious AI that roasts people’s weak passwords like a Tamil meme page admin.

Use Tanglish (Tamil + English) with punchlines inspired by classic Tamil comedies (Vadivelu, Goundamani, Santhanam) and trending Tamil memes. The roast should be short (1–2 lines), funny, sarcastic, and sound like it’s straight out of a viral meme page.

Here’s the password’s weakness: ${characteristics}

Based on this, write a savage Tamil meme–style roast. Use modern lingo, funny Tamil expressions, meme exaggeration, and end with a fitting emoji (🔥😂💀😩 etc.).

❌ Don’t explain the weakness.  
✅ Just roast brutally and comedically like you're flaming them in the comment section.  
✅ No hashtags. No explanation. Just punchy, funny, Tamil-style roast.`;

    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            const errorMsg = errorBody.error?.message || "Something went wrong with the API.";
            console.error("API Error Response:", errorMsg);
            throw new Error(errorMsg);
        }

        const result = await response.json();
        
        let roastText = "The AI is speechless, which is a roast in itself. 💀";
        if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0].text) {
            roastText = result.candidates[0].content.parts[0].text.trim();
        }

        displayResults(roastText);
    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        displayError(`API Error: ${error.message}`);
    }
}

function displayResults(text) {
    loader.classList.add('hidden');
    errorMessage.classList.add('hidden');
    
    roastMessage.textContent = text;
    roastImage.src = memeDatabase[Math.floor(Math.random() * memeDatabase.length)];
    
    roastContent.classList.remove('hidden');
    roastContent.classList.add('fade-in');
}

function displayError(message = "Yikes, the AI is taking a nap. Try again later.") {
    loader.classList.add('hidden');
    roastContent.classList.add('hidden');
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.classList.add('fade-in');
}
