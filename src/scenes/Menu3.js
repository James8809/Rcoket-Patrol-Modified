class Menu3 extends Phaser.Scene{
    constructor() {
        super("menuScene3");
    }

    init() {

    }
    preload() {
    }
    create() {
        // menu text configuration
        let menuConfig = {
            fontfamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#4F58D8',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0 
        }

        // show menu text
        this.add.text(game.config.width/2,
            game.config.height/2 - borderUISize - borderPadding, 
            'ROCKET PATROL', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2,
            'Press ← for single player', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding,
            'Press → for two player compete mode', menuConfig).setOrigin(0.5);    

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            game.settings.isPlayer2 = true;
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}