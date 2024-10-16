const player = document.getElementById('player');
const platforms = document.querySelectorAll('.platform');

let isJumping = false;
let gravity = 0.9;
let jumpHeight = 20;
let isGoingLeft = false;
let isGoingRight = false;
let moveSpeed = 5;

let playerPosition = {
    left: 50,
    bottom: 0
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        isGoingLeft = true;
    }
    if (e.key === 'ArrowRight') {
        isGoingRight = true;
    }
    if (e.key === ' ' && !isJumping) {
        jump();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        isGoingLeft = false;
    }
    if (e.key === 'ArrowRight') {
        isGoingRight = false;
    }
});

function jump() {
    let jumpInterval = setInterval(() => {
        if (playerPosition.bottom >= 150) {
            clearInterval(jumpInterval);
            isJumping = false;
        }
        playerPosition.bottom += jumpHeight;
        player.style.bottom = playerPosition.bottom + 'px';
    }, 20);

    isJumping = true;
}

function applyGravity() {
    if (!isJumping && playerPosition.bottom > 0) {
        playerPosition.bottom -= gravity;
        player.style.bottom = playerPosition.bottom + 'px';
    }
}

function movePlayer() {
    if (isGoingLeft && playerPosition.left > 0) {
        playerPosition.left -= moveSpeed;
        player.style.left = playerPosition.left + 'px';
    }
    if (isGoingRight && playerPosition.left < 550) {
        playerPosition.left += moveSpeed;
        player.style.left = playerPosition.left + 'px';
    }
}

function gameLoop() {
    applyGravity();
    movePlayer();
    checkCollisions();
    requestAnimationFrame(gameLoop);
}

function checkCollisions() {
    platforms.forEach(platform => {
        const platformRect = platform.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            playerRect.bottom <= platformRect.top + 5 &&
            playerRect.right > platformRect.left &&
            playerRect.left < platformRect.right &&
            playerRect.bottom >= platformRect.top
        ) {
            playerPosition.bottom = platformRect.height;
            player.style.bottom = playerPosition.bottom + 'px';
            isJumping = false;
        }
    });
}

gameLoop();
