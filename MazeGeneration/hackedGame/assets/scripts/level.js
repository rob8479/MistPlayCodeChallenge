// Level
//
// This is a script that contains everything required to create a level.
// It creates the maze, creates physics & colliders, the player, items,
// handles health and collisions.
//
// Created by Jacob Leaney

var worldSpinSpeed = 0.2; // how fast the world spins
var speed = 10; // start speed of player
var maxSpeed = 70; // max/main speed of player
var rotationSpeed = 80; // how fast player rotates
var enableBodyDebug = false; // bool to show physics bodies or not
var cells = []; // array of energy cells
//var deltaTime;
var filter;
var particleSpeed = 50; // how fast the particles move that are emitted from collecting a token

var firstShake = false;
var secondShake = false;

var levelComplete = false;

// world dimensions
var worldWidth;
var worldHeight;

// used to set the '0' point at the centre of the world/screen
var worldBoundsX;
var worldBoundsY;
 
//var stageColour = "#10192c"; // the background colour of the game

var fullEnergy = 100; //

var energyBarY;

var gameWorldGroup;

var lines = [];
var points = [];

// different energy level colours
var energyBarColour; // colour of player's energy bar
const energyFullColour = 0x00ffaa;
const energyMidColour = 0xefed58;
const energyLowColour = 0xad2020;
var energyBarCreated = false;

var instructionsPanel = null;

class Level {
    
    //
    constructor(mazeKey, debug, game) {
        
        this.mazeKey = mazeKey; // determines which maze/map will be loaded
        this.game = game;
        enableBodyDebug = debug; // collider debug mode
        
    }
    
    // Globally controlled function. Like 'setup' or 'start' function
    create(){
        
        this.setWorldDimensions();
        
        this.allowInteraction = false;
        
        this.gameOn = false;
        
        this.gameStartTime = 0;
        
        this.game.world.setBounds(worldBoundsX, worldBoundsY, worldWidth, worldHeight);
        
        this.game.stage.backgroundColor = stageColour;
        
        this.game.world.angle = 0;
        
        this.playerGroup = this.game.add.group();
        
        if (currentLevel >= introduceCells) {
            this.createEnergyBar();
        }
        
        // creates 3 seperate stars backgrounds
        this.createStars(); 
        
        /** Change this */
        this.levelMaze = new Maze();
        this.levelMaze.createMaze(this.game, this.mazeKey);

        lines = this.levelMaze.getLines();
        points = this.levelMaze.getPoints();

        console.log(points);
 

        /** Change this collision detection**/

        this.levelMaze.spaceJump.body.onBeginContact.add((function () {
            
            // 'if' statement stops functions being called more than once
            if (!levelComplete) {
                this.levelMaze.maze.body.clearShapes();
                this.handleFinishLevel();
            }
            
            
        }), this);
        
        // creates cells
        if (currentLevel >= introduceCells) {
            
            this.createCells();
        }

        // creates the player
        speed = 10; // sets starting speed for player
        this.player = new Rocket();
        this.player.createRocket(this.game, 'rocket');
        this.game.camera.follow(this.player.sprite); // camera follows player
        
//        // adds player to group for bringing to top purposes
        this.playerGroup.add(this.player.sprite); 
        this.game.world.bringToTop(this.playerGroup);
        
        //this.levelMaze.maze.body.createBodyCallback(this.player.sprite, this.handleCrash, this); // sets callback for maze collision
        
//        this.initTimeText();
//        this.displayHighScore();
        
//        this.radius1 = 109.55;
//        this.radis2 = 208.5;
        this.playerLocation = 0; // sets player location to centre
        this.newGame = true;
        
//        this.createColliderTriggers();
        
        this.tokensCollected = 0;
        
//        this.energyCellText();
        
//        this.cameraSetup();

        // displays instructions if level introduces new mechanic
//        this.displayInstructons();
        
        // fades level in visually
        this.fadeIn();        
        
        firstShake = false;
        secondShake = false;
        
        energyBarColour = 0x00ffaa;
        levelComplete = false;
        
        // gives access to the Utils script
        this.utils = new Utils();
        
        this.tokensCollected = 0;
	}

    // Globally controlled function, updates every frame.
    update() {
        
        if (currentLevel >= introduceCells) {
            
            this.updateEnergyBar();
        }

        if (!this.gameOn) {
        this.game.input.onTap.add(this.startGame, this);

        }
        
        else if (this.gameOn && !levelComplete) {
            
            if (this.newGame) {
                this.resetGameTime();
                this.newGame = false;
            }
            
            if (!this.game.input.activePointer.isDown) {
                this.player.enableInput = true;
//              this.game.camera.follow(this.player.sprite, Phaser.Camera.FOLLOW_LOCKON, 1, 1);
            }

            // movement system and updates player
            this.player.update();
            
            // spins backgrouns to give dizzy effect
            if (spinWorld) {
//                gameWorldGroup.angle += worldSpinSpeed; 
                //this.game.world.angle += worldSpinSpeed;
            }            
            
            // Stars background effect
            for (var i = 0; i < this.stars.length; i++) {
                
                this.stars[i].pivot.x = -this.player.sprite.body.x;
                this.stars[i].pivot.y = -this.player.sprite.body.y;
            }
 
        }
        
        // spins the dashed circles through the maze
//        this.mazeLayer0.angle -= 0.05;
//        this.mazeLayer1.angle += 0.05;
        
        // stores the amount of time the current game has been running for
        // Every time the rocket collides with a wall, it is considered to be a 'new game'
        this.gameLength = this.game.time.totalElapsedSeconds() - this.gameStartTime;
//        this.energyText.text = "Energy Cells: " + this.tokensCollected;
        
        this.handleEnergyLevels();

        //Added to Render the Maze Lines
        this.render();
        //Check for collisions
        this.checkCollisions();
    }

    /**
     * Draws the Lines
     */
    render(){
        var c = 'rgb(255,255,255)';
        for(var i = 0; i < lines.length; i++){
            this.game.debug.geom(lines[i],c);
        }
    }

    checkCollisions(){
        var play = this.player.sprite.x;
        for(var i = 0; i < points.length; i++){
            var xDiff = points[i][0] - this.player.sprite.x;
            var yDiff = points[i][1] - this.player.sprite.y;
            if(Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)) < 20){
                this.handleCrash();
            }
        }     
        
        
    }
    
    // sets dimensions and bounds of world
    setWorldDimensions() {
        
        worldWidth = mazeWidth * 6;
        worldHeight = mazeHeight * 6;
        worldBoundsX = -(worldWidth / 2);
        worldBoundsY = -(worldHeight / 2);
    }
    
    // sets up the camera
    cameraSetup() {
        
        this.game.camera.x = this.levelMaze.spaceJumpX - this.game.width/2;
        this.game.camera.y = this.levelMaze.spaceJumpY - this.game.height/2;
        
        // lerps
        this.game.time.events.add(Phaser.Timer.SECOND * 3, (function () {
            
            this.game.camera.follow(this.player.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.03, 0.03);
            
        }), this);
        
    }

    // sets up the time counter text
    initTimeText() {
        
        var style = { font: "22px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.timeText = this.game.add.text(0, 0, "", style);
        
        this.gameStartTime;

    }
    
    // Updates the text displaying the amount of time that has passed since the beginning of the game.
    updateTimeText() {

        // updates time text with amount of seconds since game started
        this.timeText.setText(this.gameLength.toFixed(1));
        
        // sets text's position to be relative to rocket
        this.timeText.position.x = this.player.sprite.body.x + 25
        this.timeText.position.y = this.player.sprite.body.y - 15
    }
    
    // creates the background stars and animates them
    createStars() {
        
        this.stars = [];
        
        for (var i = 0; i < 3; i++) {
            
            this.stars[i] = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'stars' + [i]);
            this.stars[i].anchor.setTo(0.5);
            this.stars[i].scale.setTo(0.5);
            this.stars[i].alpha = 0.4;
            
        }
        
        var starsTweenFast = this.game.add.tween(this.stars[1]).to( { alpha: 0.5 }, 300, "Linear", true, 0, -1, true);
        var starsTweenSlow = this.game.add.tween(this.stars[0]).to( { alpha: 0.6 }, 300, "Linear", true, 300, -1, true);
        
    }
    
    // creates and places energy cells in world
    createCells() {
        
        // allocates JSON file to variable
        this.cellLocations = this.game.cache.getJSON('cellData');
        
        // cycles through an array containing the current level's cell locations
        for (let i = 0; i < this.cellLocations.cellData[currentLevel - 1].length; i++) {
            
            // converts Physics Editor values to this game's world values
            // world can change size depending on the size of the maze and the cells will stay in the right location
            this.cellX = worldBoundsX + (this.cellLocations.cellData[currentLevel - 1][i][0] + (worldWidth - mazeWidth) / 2);
            this.cellY = worldBoundsY + (this.cellLocations.cellData[currentLevel - 1][i][1] + (worldHeight - mazeHeight) / 2);

            cells[i] = this.game.add.sprite(this.cellX, -this.cellY, 'cell'); // creates cell sprite in location taken from JSON data file
            
            cells[i].scale.setTo(0.15);
            this.game.physics.p2.enable(cells[i], enableBodyDebug); // enables physics on the cell
            
            cells[i].anchor.setTo(0.5); // sets anchor to centre
            cells[i].body.static = true; // makes cell immovable
            cells[i].body.data.shapes[0].sensor = true; // turns cell into sensor instead of rigid collider
            
            // cell will shrink and lose its collider, +1 is added to the player's score, player's energy is refilled, a particle effect
            // will play, and the player's spaceship will animate
            cells[i].body.onBeginContact.add(function () {
                this.game.add.tween(cells[i].scale).to( { x: 0, y: 0 }, 500, "Linear", true, 0, 0, false);
                cells[i].body.clearShapes(); // clears cell's collider
                this.tokensCollected += 1; // adds +1 to a count of how many cells have been collected
                this.player.energy = fullEnergy; // restores player's to 100%
                this.collectionAnimations(); // plays particle effect and player scaling animation              
            }, this);
            
//            cells[i].tint = cellColour; // changes colour of tokens
            
            // makes the tokens spin
            this.game.add.tween(cells[i].body).to( { rotation: this.game.math.degToRad(360) }, 4000, "Linear", true, 0, -1, true);
            
//            gameWorldGroup.add(cells[i]); // adds cell to group that main rotation group
        }
    }
        
    // creates player in world and brings player to top
    createPlayer() {
        this.player = new Rocket();
        this.player.createRocket(this.game, 'rocket');
        this.game.camera.follow(this.player.sprite);
        
        this.playerGroup = this.game.add.group();
        this.playerGroup.add(this.player.sprite);
    }
    
    // displays play instructions
    displayInstructons() {

        var instructionsGroup = this.game.add.group(this.game.world, 'instructionsGroup', true);
        
        // displays movement instructions
        if (currentLevel === 1) {
            instructionsPanel = this.game.add.sprite(this.game.width/2, this.game.height - 100, 'instructionsPanel');
            instructionsPanel.anchor.setTo(0.5);
            instructionsPanel.scale.setTo(0.85);
            instructionsPanel.alpha = 0;

            this.game.add.tween(instructionsPanel).to( { alpha: 1 }, 500, "Linear", true, 1000, 0, false);
            instructionsGroup.add(instructionsPanel);
            
            this.game.time.events.add(Phaser.Timer.SECOND * 4, (function () {
            
                this.game.add.tween(instructionsPanel).to( { alpha: 0 }, 1000, "Linear", true, 0, 0, false);
            
            }), this);

        }
        
        // displays text telling the player to swipe to spin
        else if (currentLevel === 4) {
            
            var tutorialStyle = { font: "22px Arial", fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" };
            this.swipeText = this.game.add.text(this.game.world.centerX, 175, "", tutorialStyle);
            this.swipeText.stroke = stageColour;
            this.swipeText.strokeThickness = 3;
            this.swipeText.anchor.setTo(0.5);
            this.swipeText.setText(
                'Swipe to switch' +
                '\nyour direction'
            );
            
        }
  
    }
    
    // displays highscore
    displayHighScore() {
        
        var graphics = this.game.add.graphics(0, 0);
        
        var rectWidth = 250;
        var rectHeight = 80;
        
        graphics.beginFill(0x111b2f, 1);
        graphics.lineStyle(5, 0x802929, 1);
        graphics.drawRect(0 - rectWidth/2, 135, rectWidth, rectHeight, 9);
        
        this.highScore = 0;
        
        var style = { font: "22px Arial", fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" };
        this.highScoreText = this.game.add.text(this.game.world.centerX, 175, "High Score: 0", style);
        this.highScoreText.anchor.setTo(0.5);
    }
    
    // updates the high score when the game restarts
    updateHighScore() {
        
        if (this.tokensCollected > this.highScore) {
            this.highScore = this.tokensCollected;
            this.highScoreText.text = "High Score: " + this.highScore;   
            
        }
    }
    
    // resets the game start time
    resetGameTime() {
        this.gameStartTime = this.game.time.totalElapsedSeconds();
    }
    
    // starts game / allows movement
    startGame() {
        
        if (this.allowInteraction) {
            this.gameOn = true;
        }
        
    }
    
    // displays how many cells have been collected in this level
    energyCellText() {
        
        var style = { font: "22px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.energyText = this.game.add.text(5, 5, "Energy Cells:", style);
        this.energyText.fixedToCamera = true;
        
    }
    
    // draws a box over the screen and fades it out to make the game 'fade in'
    fadeIn() {
        
        var fadeIn = this.game.add.graphics(0, 0);
        
        fadeIn.beginFill(stageColour, 1);
        fadeIn.drawRect(this.game.camera.x - this.game.width/2, this.game.camera.y - this.game.height/2, this.game.width, this.game.height);
        fadeIn.alpha = 1;
        var fadeInTween = this.game.add.tween(fadeIn).to( { alpha: 0 }, 500, "Linear", true, 1000, 0, false);
        fadeInTween.onComplete.add(function () {
            this.allowInteraction = true;
            
            if (this.energy) {
                
                this.energyOuter.alpha = 1;
                // makes energy scale outline bounce
                var outerTween = this.game.add.tween(this.energyOuter.scale).to( { x: 1.1, y: 1.3 }, 100, "Linear", true, 0, 0, true);
                outerTween.onComplete.add((function () {
                
                    // fills energy bar from 0%
                    var energyBarFill = this.game.add.tween(this.energy.scale).to( { x: 1, y: 1 }, 1000, "Linear", true, 0, 0, false);
                    energyBarFill.onComplete.add((function () {
                        
                        // allows energy bar to be updated based on player's actual energy
                        energyBarCreated = true;
                        this.enableInput = true;

                    }), this);
                
                }), this);
            }
            
        }, this);
        
        // fades in energy bar (energy bar is attached to stage)
//        if (this.energy) {
//            var energyFadeTween = this.game.add.tween(this.energyFade).to( { alpha: 0 }, 500, "Linear", true, 1000, 0, false);
//        
//        }
        
                                            
        
    }
    
    // fades level out
    fadeOut() {
         
        var fadeOut = this.game.add.graphics(worldBoundsX, worldBoundsY);
        
        fadeOut.beginFill(stageColour, 1);
        fadeOut.drawRect(-this.game.width/2, -this.game.height/2, this.game.world.width, this.game.world.height);
        fadeOut.alpha = 0;
        var tween = this.game.add.tween(fadeOut).to( { alpha: 1 }, 600, "Linear", true, 0, 0, false);
        
        // functions called when fade out is finished and screen is blank
        tween.onComplete.add((function () {
            
            if (this.energy) {
                this.interfaceGroup.destroy();
                energyBarCreated = false;
            }
            this.game.state.start('EndLevel');
            
        }), this)
        
        var currentTotalCells = Number(localStorage.getItem('totalCells'));
        var newTotalCells =  currentTotalCells + this.tokensCollected;
        localStorage.setItem('totalCells', String(newTotalCells));
        
        if (instructionsPanel) {
            this.game.add.tween(instructionsPanel).to( { alpha: 0 }, 500, "Linear", true, 0, 0, false);
        }
        
        
//        Fades out energy bar - not working
//        this.game.add.tween(this.energyFade).to( { alpha: 1 }, 500, "Linear", true, 1000, 0, false);

    }
    
    // LEGACY
    // creates triggers which shift which colliders are active on the maze
    createColliderTriggers() {
        
        this.trigger = [];
        
        // creates all triggers
        for (let i = 0; i < 3; i++) {
            this.trigger[i] = this.game.add.sprite(0, 0, 'maze');
            this.trigger[i].alpha = 0;
            this.game.physics.p2.enable(this.trigger[i], enableBodyDebug);
            this.trigger[i].body.clearShapes();  
            this.trigger[i].body.loadPolygon('mazeData', 'trigger' + [i]);
            this.trigger[i].body.data.shapes[0].sensor = true;
            this.trigger[i].body.onBeginContact.add(()=> {
            
                // when trigger is hit, shapes are cleared and next maze bodies are added
                var data = 'mazeData' + (i+1);
                this.maze.body.clearShapes();
                this.maze.body.loadPolygon('mazeData', data );
            }, this);
        }
        
    }
    
    // sets up energy bar
    createEnergyBar() {
        
        const energyBarWidth = 312;
        const energyBarHeight = 18;
        energyBarY = this.game.height / 2 * 0.1;
        
        // sets up energy bar and outline
        this.energyOuter = this.game.add.sprite(this.game.width/2, energyBarY, 'energyOuter');
        this.energyOuter.anchor.setTo(0.5, 0);
        this.energyOuter.alpha = 0; // resets to 1 after fade in completes - check fadeIn()
        
        // main energy bar
        // anchored to top of screen
        this.energy = this.game.add.sprite((this.game.width - energyBarWidth) / 2, energyBarY + (this.energyOuter.height - energyBarHeight)/2, 'energy');
        this.energy.tint = energyFullColour;
        this.energy.anchor.setTo(0, 0);
        this.energy.scale.setTo(0, 1);
   
        // attached energy bars to stage instead of world, so they don't transform with the world
        this.interfaceGroup = this.game.add.group(null, 'ui', true);      
        this.interfaceGroup.add(this.energyOuter);
        this.interfaceGroup.add(this.energy);
//        this.interfaceGroup.add(this.energyFade);

    }
    
    // updates energy bar
    updateEnergyBar() {
        
        if (energyBarCreated) {
            this.energy.scale.setTo(this.utils.mathMap(this.player.energy, 0, 100, 0, 1), 1);
        }
        
        this.energy.tint = energyBarColour;
    }
    
    // shakes the screen
    camShake() {
        
        this.game.camera.shake(0.03, 350); // intensity and duration
    }
    
    // particle effect and player scaling animation when a cell is collected
    collectionAnimations() {
        
        // creates a particle effect that emmits from the player when an energy cell is collected
        var emitter = this.game.add.emitter(this.player.sprite.x, this.player.sprite.y, 40);
        
        emitter.makeParticles('sparkle');
        
        // impacts direction of particles
        emitter.minParticleSpeed.setTo(-particleSpeed, -particleSpeed);
        emitter.maxParticleSpeed.setTo(particleSpeed, particleSpeed);
        
        emitter.minParticleScale = 0.1;
        emitter.maxParticleScale = 0.5;
        emitter.gravity = 0;
        emitter.setAlpha(1, 0, 1500, Phaser.Easing.Linear.None); // fades particles over time
        emitter.start(true, 1500, 15, 30);
        
        // puts player on top of particles
        
        // quickly scales player up and down
        this.game.add.tween(this.player.sprite.scale).to( { x: 1.5, y: 1.5 }, 150, "Linear", true, 0, 0, true);
        
        this.game.add.tween(this.energyOuter.scale).to( { x: 1.05, y: 1.3 }, 100, "Linear", true, 0, 0, true);

    }
    
    // handles various scenarios of the player's energy level
    handleEnergyLevels () {
        
        // pixelates camera and changes energy bar colour
        if (!firstShake) {
            
            if (this.player.energy <= 25) {
            
//                this.camShake();
                this.game.camera.shake(0.01, 150);
                firstShake = true;

                energyBarColour = energyMidColour; // makes energy bar yellow
                
            }
        }
        
        // pixelates camera and changes energy bar colour
        if (!secondShake) {
            
            if (this.player.energy <= 10) {
            
//                this.camShake();
                this.game.camera.shake(0.01, 150);
                secondShake = true;

                energyBarColour = energyLowColour; // makes energy bar red
                
            }
        }
        
        // restarts the game at 0% energy
        if (this.player.energy <= 0) {
            
            this.handleCrash();
        }
        
        // resets pixelation and energy bar colour on energy restore
        if (this.player.energy > 35) {
            
            firstShake = false;
            secondShake = false;
//            filter.sizeX = 0.1;
//            filter.sizeY = 0.1;
            
            energyBarColour = energyFullColour;
        }
    }
    
    // handles level completion
    handleFinishLevel() {
        
        this.player.enableInput = false;
        this.gameOn = false;
        levelComplete = true;
        this.player.speed = 0;
        
        localStorage.setItem('cellsCollected', String(this.tokensCollected)); 
        gameLength = this.gameLength;
        
        this.setHighScore();

        failed = false;
        
        this.fadeOut();    
                
    }
    
    // handles collision with maze wall
    handleCrash() {
        
//        this.restart();
        
        failed = true;
        this.camShake(); // shakes the camera
        this.gameOn = false;
        this.player.enableInput = false; // freezes player controls
        this.player.sprite.body.moveForward(0); // stops player from moving
        this.player.sprite.body.clearShapes(); // gets rid of colliders on player
        this.player.sprite.body.moveForward(-speed * 0.1); // moves player backwards
        
        localStorage.setItem('cellsCollected', String(this.tokensCollected)); // sets amount of cells collected in this round
        
        // stops rocket animations and sets it to default image (no boost)
//        this.player.sprite.animations.stop();
//        this.player.sprite.frame = 0;
        
        this.fadeOut();
    }
    
    // checks and updates high score if it is beaten. Initialises high score at '0' if first time playing level.
    setHighScore () {
        
        const highScoreKey = 'highScore' + String(currentLevel);
        const currentHighScore = Number(localStorage.getItem(highScoreKey));

        if (this.tokensCollected > currentHighScore) {
            
            const newHighScore = this.tokensCollected;
            localStorage.setItem(highScoreKey, newHighScore);
        } 
    }
    
    // restarts the game state
    restart() {
        
        this.game.state.start('Game');
        this.game.world.angle = 0;        
    }
}

RocketMaze.Level = new Level();

