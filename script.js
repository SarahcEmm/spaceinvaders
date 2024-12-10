const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Set initial canvas size to fit viewport
    function resizeCanvas() {
      canvas.width = window.innerWidth * 0.8; // Set canvas to 80% of screen width
      canvas.height = window.innerHeight * 0.6; // Set canvas to 60% of screen height
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Call this on load

    // Load images
    const playerImage = new Image();
    playerImage.src = "Designer__46_-removebg-preview.png";

    const enemyImage = new Image();
    enemyImage.src = "Designer__44_-removebg-preview.png";

    // Player properties
    const playerWidth = 60,
          playerHeight = 60,
          playerSpeed = 7;
    let playerX = canvas.width / 2 - playerWidth / 2;

    // Bullet properties
    const bulletWidth = 5,
          bulletHeight = 10,
          bulletSpeed = 7;
    let bullets = [];

    // Enemy properties
    const enemyRows = 4,
          enemyCols = 8,
          enemyWidth = 40,
          enemyHeight = 40,
          enemySpacing = 20;
    let enemies = [];
    let enemySpeed = 1; // Speed of enemy movement
    let movingRight = true;
    let gameOver = false;

    // Dynamically create enemies
    function createEnemies() {
      enemies = [];
      for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
          enemies.push({
            x: col * (enemyWidth + enemySpacing) + 50,
            y: row * (enemyHeight + enemySpacing) + 50,
            width: enemyWidth,
            height: enemyHeight,
          });
        }
      }
    }

    // Draw player
    function drawPlayer() {
      ctx.drawImage(playerImage, playerX, canvas.height - playerHeight - 10, playerWidth, playerHeight);
    }

    // Draw bullets
    function drawBullets() {
      ctx.fillStyle = "yellow";
      bullets.forEach((bullet, index) => {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
        bullet.y -= bulletSpeed;

        if (bullet.y < 0) bullets.splice(index, 1);
      });
    }

    // Draw enemies
    function drawEnemies() {
      enemies.forEach((enemy) => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
      });
    }

    // Handle enemy movement
    function moveEnemies() {
      let hitEdge = false;
      enemies.forEach((enemy) => {
        if (movingRight && enemy.x + enemy.width + enemySpeed > canvas.width) {
          hitEdge = true;
        }
        if (!movingRight && enemy.x - enemySpeed < 0) {
          hitEdge = true;
        }
      });

      if (hitEdge) {
        movingRight = !movingRight;
        enemies.forEach((enemy) => {
          enemy.y += 10;
          if (enemy.y + enemy.height >= canvas.height) {
            triggerGameOver();
          }
        });
      }

      enemies.forEach((enemy) => {
        if (movingRight) {
          enemy.x += enemySpeed;
        } else {
          enemy.x -= enemySpeed;
        }
      });
    }

    // Trigger Game Over
    function triggerGameOver() {
      gameOver = true;
      document.getElementById("gameOver").style.display = "block";
    }

    // Game loop
    function gameLoop() {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPlayer();
      drawBullets();
      drawEnemies();
      moveEnemies();
      requestAnimationFrame(gameLoop);
    }

    let isLeftPressed = false;
    let isRightPressed = false;

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") isLeftPressed = true;
      if (e.key === "ArrowRight") isRightPressed = true;
      if (e.key === " ") {
        bullets.push({ x: playerX + playerWidth / 2 - bulletWidth / 2, y: canvas.height - playerHeight - 10 });
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft") isLeftPressed = false;
      if (e.key === "ArrowRight") isRightPressed = false;
    });

    function updatePlayerPosition() {
      if (isLeftPressed && playerX > 0) playerX -= playerSpeed;
      if (isRightPressed && playerX + playerWidth < canvas.width) playerX += playerSpeed;
    }

    createEnemies();
    setInterval(() => {
      if (!gameOver) updatePlayerPosition();
    }, 1000 / 60);

    gameLoop();