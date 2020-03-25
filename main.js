var g, game = {

    settings: {
        upArrowEngaged: false,
        userScore: 0,
        highScore: 0,
        numLife: 3,
        scoreDiv: document.getElementById("score"),
        owl: document.getElementById("owl"),
        mario: document.getElementById("mario"),
        extra: document.getElementById("extraPoints"),
        gameDiv: document.getElementById("gameDiv"),
        mainMenu: document.getElementById("mainMenuDiv"),
        scoreMenu: document.getElementById("scoreMainMenu"),
        heighMenu: document.getElementById("heighScore"),
        gameOver: document.getElementById("gameOver"),
        lifeDiv: document.getElementById("lifeRemain"),
        overlay: document.getElementById("overlay"),
        jump: new Audio('media/audio/Mario-jump-sound.mp3'),
        gameOverSound: new Audio('media/audio/end-game.mp3'),
        background: new Audio('media/audio/backgroud.mp3'),

        marioId: null,
        owlMove: null,
        scoreBoard: null,

        jumpHeight: self.mario.style.bottom,
    },

    init: function () {
        self = this.settings;
        this.initAction();
    },

    initAction: function () {
        self.highScore = localStorage.getItem("highScore");
        self.heighMenu.innerHTML = '0'.repeat(6 - self.highScore.toString().length) + self.highScore;
    },

    updateLifeaRemain: function () {
        self.lifeDiv.innerHTML = '<img src="media/image/life.png" class="life"/>'.repeat(self.numLife);
    },

    startGame: function () {
        self.numLife = 3;
        self.userScore = 0;
        self.upArrowEngaged = false;
        self.background.loop = true;
        self.background.play();

        this.moveOwl();
        this.setScore();
        this.updateLifeaRemain();

        self.mainMenu.style.display = 'none';
        self.gameDiv.style.display = 'block';
    },

    endGame: function () {
        self.gameOverSound.play();
        clearInterval(self.owlMove);
        clearInterval(self.marioId);
        clearInterval(self.scoreBoard);

        self.mainMenu.style.display = 'block';
        self.gameDiv.style.display = 'none';
        self.mario.style.bottom = self.jumpHeight;
        self.upArrowEngaged = false;
        self.gameOver.innerHTML = '<b>GAME OVER</b>';
        self.scoreMenu.innerHTML = '0'.repeat(6 - self.userScore.toString().length) + self.userScore;
        self.heighMenu.innerHTML = '0'.repeat(6 - self.highScore.toString().length) + self.highScore;
        this.setScoreBoardDigit();
    },

    setScore: function () {
        self.scoreBoard = window.setInterval(() => {
            this.setScoreBoardDigit(self.userScore++);
        }, 500);
    },

    setScoreBoardDigit() {
        remainLength = 6 - self.userScore.toString().length;
        self.scoreDiv.innerHTML = '0'.repeat(remainLength) + self.userScore;
        if (self.highScore < self.userScore) {
            self.highScore = self.userScore;
            localStorage.setItem("highScore", self.highScore);
        }
    },

    moveSelection: function (event) {
        switch (event.keyCode) {
            case 37:
                this.leftArrowPressed();
                break;

            case 39:
                this.rightArrowPressed();
                break;

            case 38:
            case 32:
                this.upArrowPressed();
                break;

            case 40:
                this.downArrowPressed();
                break;
        }
    },

    leftArrowPressed: function () {
        console.log('left');
    },

    rightArrowPressed: function () {
        console.log('right');
    },

    upArrowPressed: function () {
        if ('none' != self.mainMenu.style.display) {
            this.startGame();
        } else if (!self.upArrowEngaged) {
            self.upArrowEngaged = true;
            self.jump.play();
            this.jumpMario();
        }
    },

    downArrowPressed: function () {
        console.log('down');
    },

    jumpMario: function () {
        let i = 0, reachTop = false, reachBottom = false;
        self.marioId = window.setInterval(() => {

            if (!reachTop) {
                self.mario.style.bottom = self.jumpHeight + i;
                i = i + 1;
                reachTop = (i > 80) ? true : false;
            } else if (reachTop && !reachBottom) {
                self.mario.style.bottom = self.jumpHeight + i;
                i = i - 1;
                reachBottom = (i < 0) ? true : false;
            } else {
                self.mario.style.bottom = self.jumpHeight;
                self.upArrowEngaged = false;
                clearInterval(self.marioId);
            }
        }, 1);
    },

    moveOwl: function () {
        let i = 100;
        self.owlMove = window.setInterval(() => {
            if (i == 40) {
                if (self.mario.style.bottom < '20px') {
                    self.numLife--;
                    this.updateLifeaRemain();
                    self.overlay.style.display = "block";
                    var overlayInterval = setInterval(function () {
                        self.overlay.style.display = 'none';
                        clearInterval(overlayInterval);
                    }, 25);
                    if (self.numLife <= 0)
                        this.endGame();
                } else {
                    self.extra.style.display = 'block';
                    self.userScore += 100;
                    this.setScoreBoardDigit(self.userScore);
                    var refreshId = setInterval(function () {
                        self.extra.style.display = 'none';
                        clearInterval(refreshId);
                    }, 500);
                }
            }

            if (i > -10) {
                self.owl.style.left = i + '%';
                i--;
            } else {
                clearInterval(self.owlMove);
                this.moveOwl();
            }
        }, 20);
    },

    tapJump: function() {
        if(self.gameDiv.style.display == 'block') {
            this.upArrowPressed();
        }
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    game.init();
});