const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const gameOverDiv = document.getElementById("gameOver");
    const scoreboard = document.getElementById("scoreboard");

    // Load images
    const playerImage = new Image();
    playerImage.src = "Designer__46_-removebg-preview.png";

    const enemyImage = new Image();
    enemyImage.src = "Designer__44_-removebg-preview.png";

    // Player properties
    const playerWidth = 60,
          playerHeight = 60,
          playerSpeed = 8;
    let playerX = canvas.width / 2 - playerWidth / 2;

    // Bullet properties
    const bulletWidth = 5,
          bulletHeight = 10,
          bulletSpeed = 4;
    let bullets = [];

    // Enemy properties
    const enemyRows = 4,
          enemyCols = 8,
          enemyWidth = 60,
          enemyHeight = 60,
          enemySpacing = 30;
    let enemies = [];
    let enemySpeed = 3;
    let movingRight = true;
    let gameOver = false;
    let score = 0;

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

    function drawPlayer() {
      ctx.drawImage(playerImage, playerX, canvas.height - playerHeight - 10, playerWidth, playerHeight);
    }

    function drawBullets() {
      ctx.fillStyle = "yellow";
      bullets.forEach((bullet, index) => {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) bullets.splice(index, 1);
      });
    }

    function drawEnemies() {
      enemies.forEach((enemy) => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
      });
    }

    function moveEnemies() {
      let hitEdge = false;

      enemies.forEach((enemy) => {
        if (movingRight && enemy.x + enemy.width + enemySpeed > canvas.width) hitEdge = true;
        if (!movingRight && enemy.x - enemySpeed < 0) hitEdge = true;
      });

      if (hitEdge) {
        movingRight = !movingRight;
        enemies.forEach((enemy) => {
          enemy.y += 10;
          if (enemy.y >= canvas.height - 100) triggerGameOver();
        });
      }

      enemies.forEach((enemy) => {
        if (movingRight) enemy.x += enemySpeed;
        else enemy.x -= enemySpeed;
      });
    }

    function checkCollision() {
      bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bulletWidth > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bulletHeight > enemy.y
          ) {
            bullets.splice(bIndex, 1);
            enemies.splice(eIndex, 1);
            score += 10;
            scoreboard.innerText = `Score: ${score}`;

            if (enemies.length === 0) {
              alert("Congratulations! You cleared the level!");
              enemySpeed += 0.5; // Increase difficulty
              createEnemies();
            }
          }
        });
      });
    }

    function triggerGameOver() {
      gameOver = true;
      gameOverDiv.style.display = "block";
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

    function gameLoop() {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPlayer();
      drawBullets();
      drawEnemies();
      moveEnemies();
      checkCollision();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();