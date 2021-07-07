class Rocket extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this); // add to existing, displayList, updateList
        this.isFiring = false;    // track rocket's firing status
        this.moveSpeed = game.settings.spaceshipSpeed/3*2;       // pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update() {
        if(!game.settings.mouseCon){
            // left/right movement
            if(!this.isFiring) {
                if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                    this.x -= this.moveSpeed;
                } else if (keyRIGHT.isDown && this.x <= game.config.width -
                borderUISize - this.width) {
                    this.x += this.moveSpeed;
                }
            }
            // fire button
            if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
                this.isFiring = true;
                this.sfxRocket.play();   // play sfx
            }
            // if fired, move up
            if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
                this.y -= this.moveSpeed;
            }
            // reset on miss
            if(this.y <= borderUISize * 3 + borderPadding) {
                this.reset();
            }
        }else {
            
            if (!this.isFiring && input.x >= borderUISize + this.width
                && input.x <= game.config.width - borderUISize - this.width) { 
                this.x = input.x;
            }
            if(mouse.isDown && !this.isFiring) {
                this.isFiring = true;
                this.sfxRocket.play();   // play sfx
            }
            // if fired, move up
            if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
                this.y -= this.moveSpeed;
            }
            // reset on miss
            if(this.y <= borderUISize * 3 + borderPadding) {
                this.reset();
            }
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize -borderPadding - 6;
    }
}