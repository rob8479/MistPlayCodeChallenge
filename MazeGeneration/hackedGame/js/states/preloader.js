// Preloader
//
// This script loads all of the required assets to play the game.
// When player preferences/saving is implemented, this will load the
// relevant data based on the level the player is meant to play
// next, to save on loading EVERYTHING. Also, everything is clickable! Juicy!
//
// Created by Jacob Leaney

var currentLevel; // contains` number representing the level the player is currently up to
var music; // contains background music
var stageColour = 0x10192c; // dark blue colour of the background and fades
var failed; // to keep track of whether player has won or lost the level

// xy location of the cell icon in the main menu
var cellX;
var cellY;
var cellScale = 0.2;

var cellColour = 0xbd73e0; // pinky colour for cells

var orienScale;
var landscapeScale = 0.5;

var titleY;
var playY;

var landscape;

class Preloader {
    
    preload() {
        
//        currentLevel = 1; // the level that the player is currently on;
        
//		this.load.spritesheet('rocket', 'assets/images/rocketSprites.png', 133, 190);
		this.load.image('rocket', 'assets/images/singleRocket.png');
        
        // loads first level mazes
        this.load.image('maze0', 'assets/images/mazes/maze0.png');
        this.load.image('maze1', 'assets/images/mazes/maze1.png');
        this.load.image('maze2', 'assets/images/mazes/maze2.png');
        this.load.image('maze3', 'assets/images/mazes/maze3.png');
        this.load.image('maze4', 'assets/images/mazes/maze4.png');
        
        this.load.image('spaceJump', 'assets/images/spacejump.png');
        
        // spinning dashed circles in maze
		this.load.image('mazeLayer0', 'assets/images/circularMazeLayer0.png');
		this.load.image('mazeLayer1', 'assets/images/circularMazeLayer1.png');
        
        // energy bar images
        this.load.image('energy', 'assets/images/energybar.jpg');
        this.load.image('energyOuter', 'assets/images/energybarOuter.jpg');
        
        // loads instruction images
        this.load.image('instructionsPanel', 'assets/images/instructions.png');
        
        this.load.image('sparkle', 'assets/images/sparkle.png');
        
        // loads colliders
        this.load.physics('mazeColliders', 'assets/data/mazeColliders.json');
        this.load.physics('rocketData', 'assets/data/rocketData.json');
        
        // holds locations of tokens
        this.game.load.json('cellData', 'assets/data/cellData.json');
        
        // holds locations for exit spacejumps
        this.game.load.json('spaceJumpData', 'assets/data/spaceJumpData.json');
        
        // gets pixelation filter
        this.game.load.script('pixelate', 'js/Pixelate.js');
        
        // Continue button image for end level screen;
        this.game.load.image('continueButton', 'assets/images/continueButton.png');
        this.game.load.image('retryButton', 'assets/images/retryButton.png');
        
        this.game.load.image('time', 'assets/images/time.png');
        
        this.game.load.image('endToken', 'assets/images/endToken.png');
        
//        this.game.load.image('cellSmall', 'assets/images/starYellowSmall.png');
        
	}

	create() {
        
        titleY = this.game.height*0.1;
            
        // if landscape
        if (window.innerHeight < window.innerWidth)
            {
                orienScale = landscapeScale;
                landscape = true;
                playY = this.game.world.centerY-10;
            }
        
        else{
            orienScale = 1;
            landscape = false;
            playY = this.game.world.centerY + 40;
        }
        
        if (!music) {
            // plays background music track
        music = this.game.add.audio('musicTrack', 1, true);
        music.play();
        }

        if (!localStorage.getItem('startedGame')) {
            
            for (let i = 0; i < 5; i++) {
                
                var highScoreKey = 'highScore' + String(i);
                localStorage.setItem(highScoreKey, '0');
                var bestTimeKey = 'bestTime' + String(i);
                localStorage.setItem(bestTimeKey, '0');
            }
            
            localStorage.setItem('startedGame', 'true');
            
        }
        
        this.game.stage.backgroundColor = stageColour;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
  
//        this.state.start('Game')
        
        this.game.world.setBounds(0, 0, this.game.width, this.game.height);
        
        this.createStars();
        
        this.displayMenu();
        
//        this.displayCells();
        
        

	}
    
    update() {
                        
    }
    
    displayMenu() {
        
        // displays title
        var title = this.game.add.sprite(this.game.world.centerX, titleY, 'title');
        title.anchor.setTo(0.5, 0);
//        title.scale.setTo(0.7*orienScale);
        title.scale.setTo(0.7*orienScale);
        title.alpha = 0;
        var titleTween = this.game.add.tween(title).to( { alpha: 1 }, 1000, "Linear", true, 500, 0, false);
        title.inputEnabled = true;
        title.events.onInputDown.add((function () {
            
//            this.game.add.tween(title.scale).to( { x: 0.8, y: 0.8}, 60, "Linear", true, 0, 0, false);
            title.scale.setTo(0.8*orienScale);
            
        }), this);
        
        title.events.onInputUp.add((function () {
            
//            this.game.add.tween(title.scale).to( { x: 0.7, y: 0.7}, 60, "Linear", true, 0, 0, false);
            title.scale.setTo(0.7);
            
        }), this);
        

        
        
        
        // displays play button
        var play = this.game.add.button(this.game.world.centerX, playY, 'playButton', (function () {
            
            this.game.add.tween(play.scale).to( { x: 1.1*orienScale, y: 1.1*orienScale}, 60, "Linear", true, 0, 0, true);
            this.fadeOut();
        }), this);

        play.anchor.setTo(0.5);
        play.alpha = 0;
        play.scale.setTo(orienScale);
        var playFadeTween = this.game.add.tween(play).to( { alpha: 1 }, 500, "Linear", true, 1250, 0, false);
        var playGrowTween = this.game.add.tween(play.scale).to ( {x: 1.05*orienScale, y: 1.05*orienScale}, 500, Phaser.Easing.Linear.InOut, true, 0, -1, true);
        
        // displays shop button
        var shop = this.game.add.button(this.game.world.centerX, playY + play.height + 20, 'shopButton', (function () {
            this.game.add.tween(shop.scale).to( { x: 1.1*orienScale, y: 1.1*orienScale}, 60, "Linear", true, 0, 0, true);
            this.displayShop();
            play.inputEnabled = false;
            about.inputEnabled = false;
        }), this);
        shop.anchor.setTo(0.5);
        shop.scale.setTo(orienScale);
        shop.alpha = 0;
        var shopFade = this.game.add.tween(shop).to( { alpha: 1 }, 500, "Linear", true, 1500, 0, false);
        
        // displays about button
        var about = this.game.add.button(this.game.world.centerX, playY + play.height * 2 + 40, 'aboutButton', (function () {
            
            this.game.add.tween(about.scale).to( { x: 1.1*orienScale, y: 1.1*orienScale}, 60, "Linear", true, 0, 0, true);
//            this.displayAboutPanel();
            this.resetGame();
        }), this);
        about.anchor.setTo(0.5);
        about.alpha = 0;
        about.scale.setTo(orienScale);
        this.game.add.tween(about).to( { alpha: 1 }, 500, "Linear", true, 1750, 0, false);
        
        if (!landscape)
            {
                var createdBy = this.game.add.sprite(this.game.world.centerX, (playY+titleY)/2 + title.height*0.5, 'createdBy');
                createdBy.anchor.setTo(0.5, 0.7);
                createdBy.scale.setTo(0.25);
                createdBy.alpha = 0;
                var createdByTween = this.game.add.tween(createdBy).to( { alpha: 0.8 }, 1000, "Linear", true, 500, 0, false);
            }
        
        else
            {
                var createdBy = this.game.add.sprite(this.game.world.width*0.75 + (shop.width/4), shop.y, 'createdBy');
                createdBy.anchor.setTo(0.5, 0.5);
                createdBy.scale.setTo(0.25);
                createdBy.alpha = 0;
                var createdByTween = this.game.add.tween(createdBy).to( { alpha: 0.8 }, 1000, "Linear", true, 500, 0, false);
            }
    }
    
    // shows the about panel
    displayAboutPanel() {
        
        var graphics = this.game.add.graphics(0, 0);
        
//        graphics.lineStyle(10, 0xFF0000, 0.8);
        graphics.beginFill(0x10192c, 1);
        graphics.drawRect(0, 0, this.game.world.width, this.game.world.height);
        
//        var style = { font: "22px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
//        var aboutText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '', style);
//        aboutText.anchor.setTo(0.5);
//        aboutText.setText(
//            'In development, release TBC.'
//            + '\n' + 'Created by Jacob Leaney.'
//        );
        
        // reloads menu
//        var exitButton = this.game.add.button(this.game.width/2, this.game.height - this.game.height / 8, 'menuButton', (function () {
//            
//            this.game.add.tween(exitButton.scale).to ( {x: 0.5, y: 0.5}, 50, "Linear", true, 0, 0, true);
//            this.game.state.start('Preloader');
//        }), this);
//        exitButton.anchor.setTo(0.5);
        
    }
    
    // randomly generates stars on the page
    createStars() {
        
        this.star = [];
        
        for (let i = 0; i < 350; i ++) {
            
            this.star[i] = this.game.add.sprite(Math.random() * this.game.width, Math.random() * this.game.height, 'star')
            this.star[i].anchor.setTo(0.5);
            this.star[i].scale.setTo(Math.random() * 0.25);
            this.star[i].alpha = 0;           //Math.random() * 0.3;
            this.game.add.tween(this.star[i]).to( { alpha: 0.7 }, 750, "Linear", true, Math.random() * (2500 - 300) + 300, -1, true);
        }
          
    }
    
    // fades screen out
    fadeOut() {
         
        var fadeOut = this.game.add.graphics(0, 0);
        
        fadeOut.beginFill(stageColour, 1);
        fadeOut.drawRect(0, 0, this.game.world.width, this.game.world.height);
        fadeOut.alpha = 0;
        var tween = this.game.add.tween(fadeOut).to( { alpha: 1 }, 500, "Linear", true, 0, 0, false);
        tween.onComplete.add((function () {
            
            this.game.state.start('Game')
            
        }), this)

    }
    
    // displays total cell count
    displayCells () {
        
        cellX = this.game.width * 0.05;
        cellY = this.game.height * 0.04;
        
        var cellImage = this.game.add.sprite(this.game.width * 0.07, this.game.height * 0.1, 'cell')
        cellImage.anchor.setTo(0.5);
        cellImage.scale.setTo(cellScale);
        this.game.add.tween(cellImage.scale).to( { x: cellScale *1.1, y: cellScale *1.1 }, 2500, Phaser.Easing.Linear.None, true, 0, 1000, true);  
//        cellImage.tint = 0xbd73e0;
        cellImage.inputEnabled = true;
        cellImage.events.onInputDown.add((function () {
            
            var emitter = this.game.add.emitter(cellX, cellY, 40);
        
            emitter.makeParticles('sparkle');
        
            // impacts direction of particles
            emitter.minParticleSpeed.setTo(-particleSpeed, -particleSpeed);
            emitter.maxParticleSpeed.setTo(particleSpeed, particleSpeed);
        
            emitter.minParticleScale = 0.1;
            emitter.maxParticleScale = 0.5;
            emitter.gravity = 0;
            emitter.setAlpha(1, 0, 1500, Phaser.Easing.Linear.None); // fades particles over time
            emitter.start(true, 1500, 15, 30);
            
        }), this);
        
        this.cellGroup = this.game.add.group(cellImage);
        this.game.world.bringToTop(this.cellGroup);
        
        const xTextStyle = { font: "15px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "bottom" };
        this.xText = this.game.add.text(cellX * 2, cellY + 3, 'x', xTextStyle);
        this.xText.anchor.setTo(0.5);
        
        const cellTextStyle = { font: "25px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "bottom" };
        this.cellText = this.game.add.text(cellX * 3, cellY + 3, '', cellTextStyle);
        this.cellText.anchor.setTo(0.5);
        
        // sets total cells text to 0 if it is a fresh game install
        if (!localStorage.getItem('totalCells')) {
            localStorage.setItem('totalCells', String(0));
        }
        
        else {
            this.cellText.setText(localStorage.getItem('totalCells'));
        }
        

    }
    
    resetGame () {
        
        localStorage.clear();
        localStorage.setItem('totalCells', '0');    
        localStorage.setItem('currentLevel', '1');
    }
    
    displayShop () {
        
        
        this.displayAboutPanel();
        
        var shopImage = this.game.add.sprite(this.game.width/2, this.game.height/2 + 40, 'shopImage');
        shopImage.anchor.setTo(0.5);
        shopImage.scale.setTo(0.8);
        
        var exitButton = this.game.add.button(this.game.width/2, this.game.height/8, 'menuButton', (function () {
            
            this.game.add.tween(exitButton.scale).to ( {x: 0.5, y: 0.5}, 50, "Linear", true, 0, 0, true);
            this.game.state.start('Preloader');
        }), this);
        exitButton.anchor.setTo(0.5);
        
        
    }
     
}

RocketMaze.Preloader = new Preloader();
