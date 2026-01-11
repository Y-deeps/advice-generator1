const adviceIdElement = document.getElementById('advice-id');
const adviceTextElement = document.getElementById('advice-text');
const diceButton = document.getElementById('dice-button');

const API_URL = 'https://api.adviceslip.com/advice';

async function fetchAdvice() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.slip) {
            return {
                id: data.slip.id,
                advice: data.slip.advice
            };
        } else {
            throw new Error('Invalid data structure received from API');
        }
    } catch (error) {
        console.error('Error fetching advice:', error);
        // Return a fallback advice in case of API failure
        return {
            id: 'Error',
            advice: 'Unable to fetch advice. Please try again later.'
        };
    }
}

function updateAdviceUI(advice) {
    // Add fade out effect
    adviceTextElement.style.opacity = '0';
    adviceIdElement.style.opacity = '0';
    
    setTimeout(() => {
        adviceIdElement.textContent = advice.id;
        adviceTextElement.textContent = `"${advice.advice}"`;
        
        // Add fade in effect
        adviceTextElement.style.opacity = '1';
        adviceIdElement.style.opacity = '1';
    }, 300);
}

async function generateNewAdvice() {
    // Add loading state to button
    diceButton.classList.add('loading');
    diceButton.disabled = true;
    
    try {
        const advice = await fetchAdvice();
        updateAdviceUI(advice);
    } catch (error) {
        console.error('Error in generateNewAdvice:', error);
        updateAdviceUI({
            id: 'Error',
            advice: 'Something went wrong. Please try again.'
        });
    } finally {
        // Remove loading state
        diceButton.classList.remove('loading');
        diceButton.disabled = false;
    }
}

// Add transition styles for smooth opacity changes
adviceTextElement.style.transition = 'opacity 0.3s ease-in-out';
adviceIdElement.style.transition = 'opacity 0.3s ease-in-out';

// Event listener for dice button
diceButton.addEventListener('click', generateNewAdvice);

// Load initial advice when page loads
document.addEventListener('DOMContentLoaded', () => {
    generateNewAdvice();
});

// Add keyboard support for accessibility
diceButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        generateNewAdvice();
    }
});
