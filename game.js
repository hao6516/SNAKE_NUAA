class SnakeGame {
    constructor() {
        // window.addEventListener('resize', function() {
        //     console.log('resize');
        //     document.body.style.zoom = '100%';
        // });
        
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        const img = new Image();

        // 图片加载完成后，将其绘制到canvas上
        img.onload = function() {
            // 计算图片放置的中心位置
            const x = (this.canvas.width - img.width) / 2;
            const y = (this.canvas.height - img.height) / 2;

            // 在canvas上绘制图片
            ctx.drawImage(img, x, y);
        };

        // 设置图片的源地址
        img.src = './a1.png'; //
        this.canvas.width = 380;
        this.canvas.height = 380;
        this.gridSize = 20;
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.gameSpeed = 400;

        this.startButton = document.getElementById('startButton');
        this.scoreElement = document.getElementById('scoreValue');

        this.startButton.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // 新增属性
        this.isPaused = false;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        // this.difficultySelect = document.getElementById('difficulty');
        this.pauseButton = document.getElementById('pauseButton');
        this.highScoreElement = document.getElementById('highScoreValue');
        this.eatSound = document.getElementById('eatSound');
        this.gameOverSound = document.getElementById('gameOverSound');
        
        // 设置最高分显示
        this.highScoreElement.textContent = this.highScore;
        
        // 添加暂停按钮事件监听
        this.pauseButton.addEventListener('click', () => this.togglePause());
        
        // 添加触摸控制
        this.setupTouchControls();
        
        // 更新游戏速度
        // this.difficultySelect.addEventListener('change', () => {
        //     this.gameSpeed = parseInt(this.difficultySelect.value);
        //     if (this.gameLoop) {
        //         clearInterval(this.gameLoop);
        //         this.gameLoop = setInterval(() => this.gameStep(), this.gameSpeed);
        //     }
        // });

        // 添加蛇身花纹
        this.snakePattern = document.createElement('canvas');
        this.snakePattern.width = this.gridSize;
        this.snakePattern.height = this.gridSize;
        this.createSnakePattern();
    }

    createSnakePattern() {
        const patternCtx = this.snakePattern.getContext('2d');
        const gradient = patternCtx.createLinearGradient(0, 0, this.gridSize, this.gridSize);
        gradient.addColorStop(0, '#ffd700');
        gradient.addColorStop(0.5, '#ff4d4d');
        gradient.addColorStop(1, '#ffd700');
        
        patternCtx.fillStyle = gradient;
        patternCtx.fillRect(0, 0, this.gridSize, this.gridSize);
    }

    setupTouchControls() {
        const directions = ['up', 'down', 'left', 'right'];
        directions.forEach(dir => {
            document.getElementById(`${dir}Button`)?.addEventListener('click', () => {
                const event = { key: `Arrow${dir.charAt(0).toUpperCase() + dir.slice(1)}` };
                this.handleKeyPress(event);
            });
        });
    }

    togglePause() {
        if (!this.gameLoop) return;
        
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            clearInterval(this.gameLoop);
            this.pauseButton.textContent = '继续';
        } else {
            this.gameLoop = setInterval(() => this.gameStep(), this.gameSpeed);
            this.pauseButton.textContent = '暂停';
        }
    }

    startGame() {
        // 初始化蛇的位置
        this.snake = [
            { x: 6, y: 10 },
            { x: 5, y: 10 },
            { x: 4, y: 10 }
        ];
        this.direction = 'right';
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.generateFood();
        
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.gameStep(), this.gameSpeed);
        this.startButton.textContent = '重置';
        this.gameSpeed = 400;
        this.isPaused = false;
        this.pauseButton.textContent = '暂停';
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
        const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
        this.food = { x, y };
        
        // 确保食物不会生成在蛇身上
        if (this.snake.some(segment => segment.x === x && segment.y === y)) {
            this.generateFood();
        }
    }

    handleKeyPress(event) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        const newDirection = keyMap[event.key];
        if (!newDirection) return;

        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        if (opposites[newDirection] !== this.direction) {
            this.direction = newDirection;
        }
    }

    gameStep() {
        if (this.isPaused) return;
        const head = { ...this.snake[0] };

        // 根据方向移动蛇头
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // 检查碰撞
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        // 检查是否撞墙
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }

        // 检查是否撞到自己
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    gameOver() {
        this.gameOverSound.play();
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        
        alert(`游戏结束！得分：${this.score}`);
        this.startButton.textContent = '开始';
        this.pauseButton.textContent = '暂停';
    }

    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格背景
        this.ctx.strokeStyle = '#f0f0f0';
        for(let i = 0; i < this.canvas.width; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        for(let i = 0; i < this.canvas.height; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }

        // 绘制蛇
        const pattern = this.ctx.createPattern(this.snakePattern, 'repeat');
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = pattern;
            this.ctx.beginPath();
            this.ctx.roundRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1,
                index === 0 ? 8 : 4
            );
            this.ctx.fill();
            
            // 绘制蛇眼睛（只在蛇头上）
            if (index === 0) {
                this.drawSnakeEyes(segment);
            }
        });

        // 绘制食物（像春节糖果）
        this.drawFood();
    }

    drawSnakeEyes(head) {
        const eyeSize = 20;
        const eyeOffset = 5;
        const eyeImage = new Image(); // 创建一个图片对象
    
        // 图片加载完成后绘制
        eyeImage.onload = () => {
            switch(this.direction) {
                case 'right':
                    this.ctx.drawImage(eyeImage, head.x * this.gridSize, head.y * this.gridSize, eyeSize, eyeSize);
                    // this.ctx.drawImage(eyeImage, head.x * this.gridSize, head.y * this.gridSize + this.gridSize, eyeSize, eyeSize);
                    break;
                case 'left':
                    this.ctx.drawImage(eyeImage, head.x * this.gridSize , head.y * this.gridSize , eyeSize, eyeSize);
                    // this.ctx.drawImage(eyeImage, head.x * this.gridSize + 4, head.y * this.gridSize + this.gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                    break;
                case 'up':
                    this.ctx.drawImage(eyeImage, head.x * this.gridSize, head.y * this.gridSize, eyeSize, eyeSize);
                    // this.ctx.drawImage(eyeImage, head.x * this.gridSize + this.gridSize - eyeOffset - eyeSize, head.y * this.gridSize + 4, eyeSize, eyeSize);
                    break;
                case 'down':
                    this.ctx.drawImage(eyeImage, head.x * this.gridSize , head.y * this.gridSize , eyeSize, eyeSize);
                    // this.ctx.drawImage(eyeImage, head.x * this.gridSize + this.gridSize - eyeOffset - eyeSize, head.y * this.gridSize + 12, eyeSize, eyeSize);
                    break;
            }
        };
    
        // 设置图片的源地址
        eyeImage.src = './snake_head.png'; // 替换为你的图片路径
    }

    drawFood() {
        const x = this.food.x * this.gridSize;
        const y = this.food.y * this.gridSize;
        
        // 绘制糖果包装
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.roundRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4, 5);
        this.ctx.fill();
        
        // 绘制糖果花纹
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.moveTo(x + 5, y + this.gridSize/2);
        this.ctx.lineTo(x + this.gridSize - 5, y + this.gridSize/2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + this.gridSize/2, y + 5);
        this.ctx.lineTo(x + this.gridSize/2, y + this.gridSize - 5);
        this.ctx.stroke();
    }

    // 在吃到食物时播放音效
    eatFood() {
        this.eatSound.play();
        this.score += 10;
        this.scoreElement.textContent = this.score;
        this.generateFood();
    }
}

// 初始化游戏
window.onload = () => {
    new SnakeGame();
}; 