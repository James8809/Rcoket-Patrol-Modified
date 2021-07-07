class Play2 extends Phaser.Scene{
    constructor() {
        super("playScene2");
    }

    init() {

    }
    preload() {
    }
    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

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

        // add rocket p2
        this.p2Rocket = new Rocket(this, game.config.width/2 + borderUISize,
            game.config.height - borderUISize - borderPadding,
            'rocket2').setOrigin(0.5, 0);

        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6,
            borderUISize*4, 'spaceship3', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship2(this, game.config.width + borderUISize*3,
            borderUISize*5 + borderPadding*2, 'spaceship2', 0, 50).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 +
            borderPadding*4, 'spaceship3', 0, 10).setOrigin(0, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p2Score = 0;
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
            borderUISize + borderPadding*2, "Player 2 score: ", scoreConfig);
        
        scoreConfig.align = 'right';
        scoreConfig.fixedWidth = 50;
        this.scoreLeft = this.add.text(borderUISize*6,
            borderUISize + borderPadding*2, this.p2Score, scoreConfig);
        
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            if (game.settings.score1 > this.p2Score) { 
                this.add.text(game.config.width/2, game.config.height/2 + 32, 'Player1 win !', scoreConfig).setOrigin(0.5);
            } else if (game.settings.score1 < this.p2Score){
                this.add.text(game.config.width/2, game.config.height/2 + 32, 'Player2 win !', scoreConfig).setOrigin(0.5);
            } else {
                this.add.text(game.config.width/2, game.config.height/2 + 32, 'Tied Game? Unblievable!', scoreConfig).setOrigin(0.5);
            }
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu',
            scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }
    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
        // check input for restart at the menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 4;  // update tile sprite

        if (!this.gameOver) {
            this.p2Rocket.update();             // update p1 rocket
            // update spaceships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if (this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
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
        this.p2Score += ship.points;
        this.scoreLeft.text = this.p2Score;
        this.sound.play('sfx_explosion');
    }
}