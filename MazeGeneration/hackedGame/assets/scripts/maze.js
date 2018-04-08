var lines = [];
var points = [];

class Maze {
    
    constructor () {
        
        
    }
    
    
    // creates maze and maze colliders
    createMaze (game, mazeKey, handleFinishLevel) {
        
        this.game = game;
        this.mazeKey = mazeKey;
        this.handleFinishLevel = handleFinishLevel;
        
        this.createNewMaze(10,6,70);
        this.placeJump();
    }

    /**
     * @returns All line objects which represent the maze
     */
    getLines(){
        return lines;
    }

    /**
     * Returns an array of points which represent the lines
     */
    getPoints(){
        return points;
    }


    /**
     * 
     * @param {*} numberOfSections - The number of "spokes". These are the number of grid cells we have per layer  
     * @param {*} numberOfLayers - The number of layers the total maze has. I.e. - the number of nested circles
     * 
     * The main function that generates a level.
     */

    createNewMaze(numberOfSections, numberOfLayers,circleWidth){
        var temp = this.generateMazeGrid(numberOfSections,numberOfLayers);
        var maze = this.runPrims(temp, numberOfSections, numberOfLayers);
        this.drawMaze(numberOfSections,numberOfLayers,maze,circleWidth);
        this.calculateJumpPosition(numberOfSections,numberOfLayers,circleWidth);
    }


    calculateJumpPosition(numberOfSections,numberOfLayers,circleWidth){
        
        var randomSection = Math.floor((Math.random() * numberOfSections - 1));

        var x = ((circleWidth * (numberOfLayers)) - (circleWidth/2))  * Math.cos(randomSection * this.sectorSize + (this.sectorSize / 2));
        var y = ((circleWidth * (numberOfLayers)) - (circleWidth/2))  * Math.sin(randomSection * this.sectorSize + (this.sectorSize / 2));

        this.spaceJumpX = x;
        this.spaceJumpY = y;
    }


    /**
     * 
     * @param {*} numberOfSections - The width of the grid
     * @param {*} numberOfLayers - the height of the grid
     * 
     * @returns a numberOfSections x numberOfLayers grid, which each value being random noise.
     */
    generateMazeGrid(numberOfSections, numberOfLayers){
        //Create a 2D array... oh Javascript :l 
        var grid = new Array(numberOfSections);
        for (var i = 0; i < numberOfSections; i++) {
            grid[i] = new Array(numberOfLayers);
        }

        //Look through and fill the grid
        for(var i = 0; i < numberOfSections; i++){
            for(var j = 0; j < numberOfLayers; j++){
                var data = {}
                //The weight is a random weight used for maze generation
                data.weight = Math.floor((Math.random() * 100) + 1);
                data.x = i;
                data.y = j;
                //Parent is the value in the path as to where we came from. This means that this is part of the path, between Parent and this one. Do not draw a line
                data.parent = null;
                grid[i][j] = data
            }
        }
        
        return grid;
    }


    /**
     * 
     * @param {*} maze - The 2D array of objects that represent the Maze
     * @param {*} numberOfSections - Number of sections i.e. the width of the layers
     * @param {*} numberOfLayers - The number of circles
     * 
     * @returns A fully completed perfect maze
     * 
     * Takes in a maze, and edits it so there is a path through it. This runs the Prim's Algorithm.
     */
    runPrims(maze,numberOfSections, numberOfLayers){
        // For now, just do a simple array, but this can be implemented more efficently for a PQ

        var frontier = []
        maze[0][0].parent = "root"; //Need this to stop it being readded to the maze
        //Starts from Point 0,0
        frontier.push(maze[0][0]);
        //Get minimum of the frontier
        function getMinimum(){
            var currentMinimumIndex = -1;
            var currentBestWeight = 2000;
            //Loop through and find the minimum weight
            for(var i = 0; i < frontier.length; i++){
                if(frontier[i].weight < currentBestWeight){
                    currentBestWeight = frontier[i].weight;
                    currentMinimumIndex = i;
                }
            }

            //Error Check
            if(currentMinimumIndex == -1){
                console.log("Wuh woah: Error line 92 - Frontier is empty, yet was still called");
            } else {
                //Return the minimum
                var temp =  frontier.splice(currentMinimumIndex,1)[0];
                //console.log("Removed " + temp.x + " " + temp.y);
                return temp;
            }
            
        }

        //Get neighbours
        function getNeighbours(cell){
            //As long as it is bounds
            //if parent is null, updated parent, then add to list
            //Null would mean that we have not already gotten here from some other root
            
                    /**
             * 		|y-1|
             * 	 x-1| O	|x+1
             * 		|y+1|
             */
            
            // Left
            if(cell.x != 0){
                if(maze[cell.x - 1][cell.y].parent == null){
                    maze[cell.x - 1][cell.y].parent = cell;
                    frontier.push(maze[cell.x - 1][cell.y]);
                }	
            }
            

            //Right
            if(cell.x != numberOfSections - 1){
                if(maze[cell.x + 1][cell.y].parent == null){
                    maze[cell.x + 1][cell.y].parent = cell;
                    frontier.push(maze[cell.x + 1][cell.y]);
                }	
            }

            //Up
            if(cell.y != 0){
                if(maze[cell.x][cell.y - 1].parent == null){
                    maze[cell.x][cell.y - 1].parent = cell;
                    frontier.push(maze[cell.x][cell.y - 1]);
                }
            }

            //Down
            if(cell.y != numberOfLayers - 1){
                if(maze[cell.x][cell.y + 1].parent == null){
                    maze[cell.x][cell.y + 1].parent = cell;
                    frontier.push(maze[cell.x][cell.y + 1]);
                }
            }


        }

        //Whilst we still have elements in the frontier, get the cell with the minimum weight in the frontier, and then get its neighbours
        while(frontier.length > 0){
            var min = getMinimum();
            getNeighbours(min);
        }

        /*
        for(var i = 0; i < maze.length; i++){
            for(var j = 0; j < maze[0].length; j++){
                console.log(maze[i][j].x + " , " + maze[i][j].y + " Weight: " + maze[i][j].weight);
            }
        }*/

        /*
        for(var i = 0; i < maze.length; i++){
            for(var j = 0; j < maze[0].length; j++){
                if(i == 0 && j == 0){
                    continue;
                }
                console.log(maze[i][j].x + " , " + maze[i][j].y + " Parent: " + maze[i][j].parent.x + " , " + maze[i][j].parent.y);
            }
        }
        */

        return maze;	
    }

    /**
     * 
     * @param {*} numberOfSections - Number of divisons per layer
     * @param {*} numberOfLayers  - Number of Circles
     * @param {*} maze  - The Maze
     * 
     * From the generated Maze, it first draws the rings. It looks ahead "down" a layer, and if the parent of that cell is the current cell, we draw a wall.
     * 
     * After, we then draw the dividers within each layer. Similar idea as to before, but with straight lines
     */
    drawMaze(numberOfSections,numberOfLayers, maze, circleWidth){
        var sectorSize = ((360 / numberOfSections) * Math.PI) /180;
        this.sectorSize = sectorSize;

        //Draw The Circles, but only using straight lines
        for(var j = 0; j < numberOfLayers - 1; j++){
            for(var i = 0; i < numberOfSections; i++){
                if(maze[i][j].x == maze[i][j+1].parent.x && maze[i][j].y == maze[i][j+1].parent.y){
                    continue;
                } else {
                    var x1 = ((circleWidth * j + circleWidth)  * Math.cos(i * sectorSize));
                    var y1 = ((circleWidth * j + circleWidth)  * Math.sin(i * sectorSize));

                    var x2 = ((circleWidth * j) + circleWidth)  * Math.cos(i * sectorSize + sectorSize);
                    var y2 = ((circleWidth * j) + circleWidth)  * Math.sin(i * sectorSize + sectorSize);

                    var temp = new Phaser.Line(x1, y1, x2, y2);
                    lines.push(temp);

                    var p = temp.coordinatesOnLine(10);
                    for(var k = 0; k < p.length; k++){
                        points.push(p[k]);
                    }
                    
                }
            }
        }

        //Draw the outmost ring - the Border of the entire maze
        for(var i = 0; i < numberOfSections; i++){
            var x1 = ((circleWidth * (numberOfLayers - 1) + circleWidth)  * Math.cos(i * sectorSize));
            var y1 = ((circleWidth * (numberOfLayers - 1) + circleWidth)  * Math.sin(i * sectorSize));

            var x2 = ((circleWidth * (numberOfLayers - 1)) + circleWidth)  * Math.cos(i * sectorSize + sectorSize);
            var y2 = ((circleWidth * (numberOfLayers - 1)) + circleWidth)  * Math.sin(i * sectorSize + sectorSize);

            var temp = new Phaser.Line(x1, y1, x2, y2);
                    lines.push(temp);

                    var p = temp.coordinatesOnLine(10);
                    for(var k = 0; k < p.length; k++){
                        points.push(p[k]);
                    }
        }

        /*
        //Draw the dividers within each Layer
        for(var j = 1; j < numberOfLayers; j++){
            for(var i = 0; i < numberOfSections - 1 ; i++){	
                if(maze[i][j].x == maze[i + 1][j].parent.y && maze[i][j].x == maze[i + 1][j].parent.y){
                    continue;
                } else{
                    //This is where I need to figure out how to the dividers 
                    x1 = (circleWidth * j)  * Math.cos(i * sectorSize) + 400;
                    y1 = (circleWidth * j)  * Math.sin(i * sectorSize) + 300;

                    x2 = (circleWidth * (j + 1))  * Math.cos(i * sectorSize) + 400;
                    y2 = (circleWidth * (j + 1))  * Math.sin(i * sectorSize) + 300;

                    lines.push(new Phaser.Line(x1, y1, x2, y2));
                }
            }			

        }
        */
        }
    
    placeJump () {
        this.spaceJump = this.game.add.sprite(this.spaceJumpX, this.spaceJumpY, 'spaceJump');
        this.spaceJump.anchor.setTo(0.5,0.5);
        this.game.physics.p2.enable(this.spaceJump, enableBodyDebug);
        this.spaceJump.body.data.shapes[0].sensor = true;

        // rotates portal
        this.game.add.tween(this.spaceJump.body).to( { rotation: this.game.math.degToRad(360) }, 4000, "Linear", true, 0, -1, false);
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