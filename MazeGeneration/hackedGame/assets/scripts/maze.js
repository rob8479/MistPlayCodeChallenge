class Maze {
    
    /* Change this whole Class */


    constructor () {
        
    }
    
    
    // creates maze and maze colliders
    createMaze (game, mazeKey, handleFinishLevel) {
        
        this.game = game;
        this.mazeKey = mazeKey;
        this.handleFinishLevel = handleFinishLevel;
        
        this.maze = this.game.add.sprite(0, 0, this.mazeKey); // draws maze sprite
        this.maze.anchor.setTo(0.5);
        this.game.physics.p2.enable(this.maze, enableBodyDebug); // enables physics
        this.maze.body.clearShapes();  // clears collider
        this.maze.body.loadPolygon('mazeColliders', this.mazeKey); // adds custom collider
        this.maze.body.static = true; // makes maze immovable
        
        this.placeJump();
        
    }
    
    placeJump () {

        
        this.spaceJumpLocations = this.game.cache.getJSON('spaceJumpData');
        
        this.spaceJumpX = worldBoundsX + (this.spaceJumpLocations.locations[currentLevel][0][0] + (worldWidth - mazeWidth) / 2);
        this.spaceJumpY = -(worldBoundsY + (this.spaceJumpLocations.locations[currentLevel][0][1] + (worldHeight - mazeHeight) / 2));
        
        this.spaceJump = this.game.add.sprite(this.spaceJumpX, this.spaceJumpY, 'spaceJump');
        this.spaceJump.anchor.setTo(0.5);
        this.game.physics.p2.enable(this.spaceJump, enableBodyDebug);
        this.spaceJump.body.data.shapes[0].sensor = true;

        // rotates portal
        this.game.add.tween(this.spaceJump.body).to( { rotation: this.game.math.degToRad(360) }, 4000, "Linear", true, 0, -1, false);
//        this.game.add.tween(this.spaceJump).to( { tint: 0x000000 }, 2000000, "Linear", true, 0, -1, true);
        this.spaceJump.tint = 0xffffff;
        
        // creates a particle effect that emmits from the player when an energy cell is collected
        var emitter = this.game.add.emitter(this.spaceJumpX, this.spaceJumpY);
        
        var boosterColour = 0;
        
        // makes particles for space jump!! ****************
        
        emitter.makeParticles('spaceJump');
        
        // impacts direction of particles
        emitter.minParticleSpeed.setTo(-30, -30);
        emitter.maxParticleSpeed.setTo(30, 30);
        
        emitter.minParticleScale = 0.5;
        emitter.maxParticleScale = 0.2;
        emitter.gravity = 0;
        
        emitter.setAlpha(1, 0, 5000, Phaser.Easing.Linear.None); // fades particles over time
//        emitter.start(false, 5000, 500, 100000);
        emitter.flow(5000, 400, 1, -1, true);
        
        
//         *****************************************
//        emitter.forEach(function(particle) {  
//            particle.tint = boosterColours[boosterColour]; // cycles through array of colours
//            boosterColour = (boosterColour + 1) % boosterColours.length;
//        }, this);
        
        
    }
    
    
}