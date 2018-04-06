// Boot
//
// This script determines some of the basic game/device parameters
// and loads assets needed for the preloading state.
//
// Create by Jacob Leaney

var RocketMaze = {};

var music; 

var sr = window.devicePixelRatio;

class Boot {

    constructor() {
        
        
    }
    
    init() {
        
        // increase to add multi touch support
        this.input.maxPointers = 1;

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.forceLandscape = false;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

    }
    
    preload() {

        // loads all buttons for menus
        this.load.image('logo', 'assets/images/rocketLittle.png');
        this.load.image('title', 'assets/images/title1.png');
        this.load.image('playButton', 'assets/images/playButton.png');
        this.load.image('shopButton', 'assets/images/shopButton.png');
        this.load.image('createdBy', 'assets/images/createdBy.png');
        
        // ***************** Temporary
//        this.load.image('aboutButton', 'assets/images/aboutButton.png'); *******************
        this.load.image('aboutButton', 'assets/images/resetButton.png'); 
        
        this.load.image('menuButton', 'assets/images/menuButton.png');
        
        this.load.image('shopImage', 'assets/images/shopMockup.png');
        
        
        // background star layers (small, medium large stars)
        this.load.image('stars0', 'assets/images/stars0.png');
        this.load.image('stars1', 'assets/images/stars1.png');
        this.load.image('stars2', 'assets/images/stars2.png');
        this.load.image('star', 'assets/images/star.png');
        
        // loads background music
        this.load.audio('musicTrack', 'assets/audio/dizzy.m4a');
        
        // token/collectable image
        this.load.image('cell', 'assets/images/starYellow.png');

    }
    
    create() {

        // starts preloader state
        this.state.start('Preloader');
        
                this.game.scale.onOrientationChange.add(() => {
            if(this.state.current === "Preloader")
            {
                console.log(this.scale.screenOrientation);
                this.game.scale.setGameSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
                this.state.restart();
            }
        });


    }

}

RocketMaze.Boot = new Boot();

