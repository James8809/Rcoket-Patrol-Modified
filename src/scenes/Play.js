class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }

    init() {

    }
    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('rocket2', './assets/rocket_A.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceship2', './assets/Spaceship_A.png');
        this.load.image('spaceship3', './assets/Spaceship_B.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('starfield2', './assets/starfield_A.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion_A.png',
            {frameWidth: 30, frameHeight: 25, startFrame: 0, endFrame: 9});
    }
    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield2').setOrigin(0, 0);

        // add rocket p1
        this.p1Rocket = new Rocket(this, game.config.width/2,
            game.config.height - borderUISize - borderPadding - 6,
            'rocket2').setOrigin(0.5, 0);
            
        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6,
            borderUISize*4, 'spaceship3', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship2(this, game.config.width + borderUISize*3,
            borderUISize*5 + borderPadding*2, 'spaceship2', 0, 50).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 +
            borderPadding*4, 'spaceship3', 0, 10).setOrigin(0, 0);
        
        this.add.rectangle(0, borderUISize + borderPadding,
            game.config.width, 
            borderUISize * 2, 0x00FF00).setOrigin(0,0);

        this.add.rectangle(0,0, game.config.width,
            borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0,game.config.height - borderUISize, 
            game.config.width,
            borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0,0, borderUISize, 
            game.config.height, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0,
            borderUISize,
            game.config.height, 0xFFFFFF).setOrigin(0,0);
            
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyCLICK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        input = this.input;
        mouse = this.input.mousePointer;

        // animation config
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontfamily: 'Courier',
            fontSzie: '28px',
            backgroundColor: '#4F58D8',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 150,
        }

        this.add.text(borderUISize + borderPadding,
            borderUISize + borderPadding*2, "Player 1 score: ", scoreConfig);
        
        scoreConfig.align = 'right';
        scoreConfig.fixedWidth = 50;
        this.scoreLeft = this.add.text(borderUISize*6,
            borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            if (!game.settings.isPlayer2) {
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu',
                scoreConfig).setOrigin(0.5);
            } else {
                this.add.text(game.config.width/2, game.config.height/2, 'Round End', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press → to Second Player or ← for Menu',
                scoreConfig).setOrigin(0.5);
                game.settings.score1 = this.p1Score;
            }
            this.gameOver = true;
        }, null, this);
    }
    update() {
        // check key input for restart
        if (this.gameOver && !game.settings.isPlayer2 && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select');
            this.scene.restart();
        }
        // check input for restart at the menu
        if (this.gameOver && !game.settings.isPlayer2 && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.scene.start("menuScene");
        }
        // check key input for restartrr
        if (this.gameOver && game.settings.isPlayer2 && Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.sound.play('sfx_select');
            this.scene.start("playScene2");
        }
        // check input for restart at the menu
        if (this.gameOver && game.settings.isPlayer2 && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 4;  // update tile sprite

        if (!this.gameOver) {
            this.p1Rocket.update();             // update p1 rocket
            // update spaceships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');                 // play explode animation
        boom.on('animationcomplete', () => {        // callback after anim completes
            ship.reset();                           // reset ship position
            ship.alpha = 1;                         // make ship visible again
            boom.destroy();                         // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}