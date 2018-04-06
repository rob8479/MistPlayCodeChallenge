// Game
//
// This script runs the main part of the game. It will check the 
// player preferences to get data about which level the player is 
// up to, what avatar they were last using, and any other information
// that needs to be saved and reproduced.
//
// Created by Jacob Leaney

var mazeKey;
var tokenKey;
var level;
var introduceCells = 3;
var spinWorld = true;
var debug = false;

var mazeWidth; // 500
var mazeHeight;

var gameLength;

var boosterColours = [
    0xff2c2c, 0xff2c5e, 0xff2c8a, 0xff2cc1, 0xff2cfd, 0x9e2cff, 0x682cff, 
    0x362cff, 0x2c63ff, 0x2c9eff, 0x2cdfff, 0x2cffd0, 0x2cff85, 0x36ff2c, 
    0x9eff2c, 0xe9ff2c, 0xffbc2c, 0xff852c
];

class Game {
    
    create() {
        
        // In brand new game creation, will set default level
        if (!localStorage.getItem('currentLevel')) {
            
            localStorage.setItem('currentLevel', String(1))
        }
        
        //currentLevel = Number(localStorage.getItem('currentLevel')) // retreives current level from local storage
        currentLevel = 3;

        level = currentLevel;
        
        this.setupMaze(); // gets maze height, width, and sprite key for the current level

        tokenKey = 'tokens' + String(currentLevel - 1); // sets the key for the current level for spawning cells

        this.level = new Level(mazeKey, debug, this.game);
        
        this.level.create(); // Creates and displays actual level

    }
    
    update () {
        
        
        this.level.update();
        
    }
    
    setupMaze () {
        
        /** Change This Function */


        mazeKey = 'maze' + String(currentLevel - 1);
        mazeWidth = this.game.cache.getImage(mazeKey).width;
        mazeHeight = this.game.cache.getImage(mazeKey).height;
        
    }

}

RocketMaze.Game = new Game();