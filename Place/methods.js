const cooldownAmount = 10;
let cooldownTime = 0; // Cooldown in seconds
const cooldownElement = document.getElementById('cooldown');

// Create a 25x30 grid dynamically
const grid = document.getElementById('grid');
const rows = 25;
const cols = 30;

for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = y;
        cell.dataset.col = x;

        // Log cell clicks to the console
        cell.addEventListener('click', () => {
            if (cooldownTime == 0) {
                console.log(`Clicked cell at row: ${y}, column: ${x}`);
                cooldownTime = cooldownAmount;
            } else {
                // Add red glow to the cooldown box
                cooldownElement.classList.add('cooldown-warning');

                // Remove the red glow after a short delay
                setTimeout(() => {
                    cooldownElement.classList.remove('cooldown-warning');
                }, 500); // 500ms delay
            }
        });
        grid.appendChild(cell);
    }
}

// Handle color palette selection
const palette = document.getElementById('palette');
let selectedColor = null;

palette.addEventListener('click', (e) => {
    if (e.target.classList.contains('color')) {
        // Remove previous selection
        document.querySelectorAll('.color').forEach(button => button.classList.remove('selected'));

        // Mark the clicked color as selected
        e.target.classList.add('selected');
        selectedColor = e.target.dataset.color;

        console.log(`Selected color: ${selectedColor}`);
    }
});



// Function to update the cooldown timer
function updateCooldown() {
    if (cooldownTime > 0) {
        cooldownElement.textContent = `Next Pixel: ${cooldownTime} s`;
        cooldownTime--;
    } else {
        cooldownElement.textContent = 'Next Pixel: Ready';
    }
}

// Start the cooldown timer
setInterval(updateCooldown, 1000);
