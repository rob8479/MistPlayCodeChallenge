// Rocket
//
// This script defines all attributes of the player's rocket.
// It includes movement, physics, colliders, and the sprite.
//
// Created by Jacob Leaney

var timerRunning = false; // for checking is the double tap timer is running
var tappingDown = false; // for checking if player is tapping
var enableTurning = false; // allows turning
var spin = false; // for turning the player 180 degrees

// for the emitter / particle effect booster
var emitter;

var rot, minx, miny, maxx, maxy;

class Rocket {
    
    
    
    constructor(avatarKey) {
        
        
//        this.avatar = avatar;
        // nothing to see here yet...
    }
    
    createRocket(game, spriteKey) {
        
        
        
        this.game = game;
        
        this.sprite = this.game.add.sprite(0, 0, spriteKey);
        
        this.sprite.anchor.setTo(0.5);
//        this.sprite.scale.setTo(0.2);
        this.game.physics.p2.enable(this.sprite, enableBodyDebug);
        this.sprite.angle = 90;
        
        this.game.physics.p2.setImpactEvents(true);
        
        this.sprite.body.clearShapes();  
        this.sprite.body.loadPolygon('rocketData', 'singleRocket');
        
        // creates and plays/loops rocket booster animation      // playback rate =30
//        this.sprite.animations.add('boosterAnim', [4, 5, 6, 5], 30, true);
//        this.sprite.animations.play('boosterAnim');
        
        this.enableInput = false;
        
        this.swipe = new Swipe(this.game);
        
        this.energy = 100;
        this.rainbowBooster();
    }
    
    update() {
        
        emitter.x = this.sprite.x;
        emitter.y = this.sprite.y;
        // impacts direction of particles
        rot = -this.sprite.rotation;
        minx = 100*Math.sin(rot) + -20*Math.cos(rot);
        maxx = 150*Math.sin(rot) + 20*Math.cos(rot);
        miny = 100*Math.cos(rot) - -20*Math.sin(rot);
        maxy = 150*Math.cos(rot) - 20*Math.sin(rot);
        emitter.minParticleSpeed.setTo(minx, miny);
        emitter.maxParticleSpeed.setTo(maxx, maxy);
        
        if (currentLevel >= introduceCells) {
            this.energy -= 0.1;
        }   
        
        this.sprite.body.angularVelocity = 0;
        
        enableTurning = true;
        
        if (this.enableInput === true) {
            
////            this.game.input.onDown.add(this.tapDown, this);
////            this.game.input.onTap.add(this.onTap, this);
//            this.game.input.onUp.add(this.tapUp, this);

            if (enableTurning) {
                
                if (this.game.input.x < this.game.width/2 && this.game.input.activePointer.isDown) {
                this.sprite.body.rotateLeft(rotationSpeed);
                }
            
                else if (this.game.input.x > this.game.width/2 && this.game.input.activePointer.isDown) {
                
                  this.sprite.body.rotateRight(rotationSpeed);
                } 
                
            }
                     
        }
        
        // increases rocket speed until it reaches specified limit (starts slow for smooth start game)
        speed += 1;
        if (speed < maxSpeed) {
            this.sprite.body.moveForward(speed);
        }
        
        else {
            this.sprite.body.moveForward(maxSpeed);
        }
        
        // checks for all swipe directions
        
        if (currentLevel >= 3) {
            
            var direction = this.swipe.check();
            if (direction!==null) {
            // direction= { x: x, y: y, direction: direction }
                switch(direction.direction) {
                    case this.swipe.DIRECTION_LEFT: spin = true;
                    case this.swipe.DIRECTION_RIGHT: spin = true;
                    case this.swipe.DIRECTION_UP: spin = true;
                    case this.swipe.DIRECTION_DOWN: spin = true;
                    case this.swipe.DIRECTION_UP_LEFT: spin = true;
                    case this.swipe.DIRECTION_UP_RIGHT: spin = true;
                    case this.swipe.DIRECTION_DOWN_LEFT: spin = true;
                    case this.swipe.DIRECTION_DOWN_RIGHT: spin = true;
                    }
            }
        }
        
        if (spin) {
            this.sprite.body.clearShapes();  
            var playerSpin = this.game.add.tween(this.sprite.body).to( {
                rotation: this.sprite.body.rotation + this.game.math.degToRad(180)
            }, 200, "Linear", true, 0, 0, false);
            
            spin = false;
            playerSpin.onComplete.add(function () {
                this.sprite.body.loadPolygon('rocketData', 'singleRocket');
            }, this)
        }

    }
    
    // handles double tap
    tapDown() {                                            
                                                     
        
        if (timerRunning && !tappingDown) {
            
            this.game.add.tween(this.sprite.body).to( {
                rotation: this.sprite.body.rotation + this.game.math.degToRad(180)
            }, 200, "Linear", true, 0, 0, false);
            
            clearTimeout(this.tapTimer);
            timerRunning = false;
        }
        
        else {
            
            timerRunning = true;
            tappingDown = true;
            
            var game = this.game;
            
            this.tapTimer = setTimeout(function () {
                
                timerRunning = false;
                if (tappingDown) {
                    enableTurning = true;
                    
                }
                
            }, 0); 
        }
        
    }
    
    rainbowBooster() {
        var boosterColour = 0;
        
        emitter = this.game.add.emitter(0, 0, 500);
        
        emitter.makeParticles('sparkle');
        //this.sprite.addChild(emitter);
        
        emitter.gravity = 0;
        emitter.forEach(function(particle) {  
//            particle.tint = this.utils.randomColour();
            particle.tint = boosterColours[boosterColour]; // cycles through array of colours
            boosterColour = (boosterColour + 1) % boosterColours.length;
//            particle.tint = Math.random() * 0xffffff
        }, this);
        emitter.setAlpha(0, 1, 500, Phaser.Easing.Linear.None,true); // fades particles over time
        emitter.setScale(1, 0.7, 500, Phaser.Easing.Linear.None); // fades particles over time
        emitter.start(false, 1000, 30, 0);
        
    }
    
    tapUp() {
        tappingDown = false;
        enableTurning = false;
    }

}
