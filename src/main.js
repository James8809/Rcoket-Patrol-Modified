let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Menu, Menu2, Menu3, Play, Play2]
}

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyCLICK;
let input, mouse;

// James Liu, rocket patrol modified, 7/7, 
// it took me like 2 days to complete but I started late because I was trying to finish the endless runner project first.
// I am going for the intermediate tier, changed all artwork for the in-game assts, 
// added mouse control, added alernating two player compete mode,
// and added new spaceship type that is faster, smaller, and worth more points