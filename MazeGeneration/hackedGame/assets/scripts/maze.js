var lines = [];
var points = [];

class Maze {
    
    constructor () {
        
        
    }
    
    
    // creates maze and maze colliders
    createMaze (game, mazeKey,graphics) {
        
        this.game = game;
        this.mazeKey = mazeKey;
        //this.handleFinishLevel = handleFinishLevel;
        this.graphics = graphics;
        this.createNewMaze(10,6,70);
        this.placeJump();
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
     * @param {*} circleWidth - The number which represents how wide each layer is
     * 
     * The main function that generates a level.
     * 
     * First it generates a random grid of noise, before running the maze generation algorithm, and then generating the elements to draw the maze.
     * Then it adds the exit portal
     * 
     */

    createNewMaze(numberOfSections, numberOfLayers,circleWidth){
        this.circleWidth = circleWidth;
        this.numberOfLayers = numberOfLayers;
        this.numberOfSections = numberOfSections;
        var temp = this.generateMazeGrid(numberOfSections,numberOfLayers);
        this.maze = this.runPrims(temp, numberOfSections, numberOfLayers);
        this.drawMaze(numberOfSections,numberOfLayers,this.maze,circleWidth);
        this.calculateJumpPosition(numberOfSections,numberOfLayers,circleWidth);
    }

    /**
     * 
     * @param {*} numberOfStars - The number of stars
     * 
     * Randomly chooses locations to spawn stars within the level
     */
    getStarPositions(numberOfStars){
        
        var numberSpawned = 0;
        var starPositions = [];

        while(numberSpawned != numberOfStars){
            //Randomly Select the layer and section
            var layer = Math.floor((Math.random() * (this.numberOfLayers)));
            var section = Math.floor((Math.random() * (this.numberOfSections)));
            
            //If there is not already a star at this position, add one to the maze
            if(!this.maze[section,layer].star){
                this.maze[section,layer].star = true;
                //Calculate the world co-ords
                var x = ((this.circleWidth * (layer)) + (this.circleWidth * 2.5))  * Math.cos(section * this.sectorSize + (this.sectorSize / 2));
                var y = ((this.circleWidth * (layer)) + (this.circleWidth * 2.5))  * Math.sin(section * this.sectorSize + (this.sectorSize / 2));
                //Push co-ords to array
                starPositions.push([x,y]);
                numberSpawned++;
            }
        
        }

        return starPositions;

    }

    /**
     * 
     * @param {*} numberOfSections - Number of sections in a circle
     * @param {*} numberOfLayers - Number of layers - the total number of circles
     * @param {*} circleWidth - The Width of each circle
     * 
     * Randomly selects a section where the exit will be spawned. Then, generates the x and y co-ordinate to spawn it.
     * This is what this.placeJump requires in order to spawn the portal.
     */
    calculateJumpPosition(numberOfSections,numberOfLayers,circleWidth){
        //Random number between 0 and the numberOfSections - 1
        var randomSection = Math.floor((Math.random() * numberOfSections - 1));
        //Trig. to get the position
        var x = ((circleWidth * (numberOfLayers) + circleWidth) - (circleWidth/2))  * Math.cos(randomSection * this.sectorSize + (this.sectorSize / 2));
        var y = ((circleWidth * (numberOfLayers) + circleWidth) - (circleWidth/2))  * Math.sin(randomSection * this.sectorSize + (this.sectorSize / 2));
        //Save the values
        this.spaceJumpX = x;
        this.spaceJumpY = y;
        //Set the exit as taken, so we cannot spawn a star on top of the exit gate
        this.maze[randomSection,numberOfLayers - 1].star = true;
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
                //Where the section has a star in it or not
                data.star = false;
                grid[i][j] = data;
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

        return maze;	
    }

    /**
     * 
     * @param {*} maze  - The maze array
     * 
     * Prints out to console the generated maze. Made up of arrows showing the paths
     */
    debugPrint(maze){
        
        for(var j = 0; j < maze[0].length ; j++){
            var output = "";
            for(var i = 0; i < maze.length; i++){
                
                if(maze[i][j].parent == "root"){
                    output = output + " S";
                }

                //Check Right
                if(i != maze.length - 1){
                    if(maze[i][j].parent == maze[i + 1][j]){
                        output = output + " <";
                    }
                }

                //Check Left
                if(i != 0){
                    if(maze[i][j].parent == maze[i - 1][j]){
                        output = output + " >";
                    }
                }

                //Check Down
                if(j != maze[0].length - 1){
                    if(maze[i][j].parent == maze[i][j + 1]){
                        output = output + " ^";
                    }
                }

                //Check Up
                if(j != 0){
                    if(maze[i][j].parent == maze[i][j - 1]){
                        output = output + " v";
                    }
                }
            }
            console.log(output);
        }

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

        //this.debugPrint(maze);

        //Draw the inner most ring - the Spawn Area
        for(var i = 1; i < numberOfSections; i++){
            this.graphics.arc(0,0,circleWidth,(i * sectorSize), ((i + 1) * sectorSize),false);
            this.calculateArcHitPoints(circleWidth,i * sectorSize,sectorSize,10);
        }

        
        //Draw The inner Layers
        for(var j = 0; j < numberOfLayers - 1; j++){
            for(var i = 0; i < numberOfSections; i++){
                //If the current cell is the parent of the next cell, or if the next cell is the parent of the current cell, continue - leave the gap
                if((maze[i][j].x == maze[i][j+1].parent.x && maze[i][j].y == maze[i][j+1].parent.y) || 
                    (maze[i][j+1].x == maze[i][j].parent.x && maze[i][j+1].y == maze[i][j].parent.y)){
                    continue;
                } else {
                   this.graphics.arc(0,0,circleWidth * j + circleWidth * 2,(i * sectorSize), ((i + 1) * sectorSize),false);
                   this.calculateArcHitPoints(circleWidth * j + circleWidth * 2,i * sectorSize,sectorSize,10);
                }
            }
        } 

        //Draw the outmost ring - the Border of the entire maze
        for(var i = 0; i < numberOfSections; i++){
            this.graphics.arc(0,0,circleWidth * (numberOfLayers - 1) + circleWidth * 2,(i * sectorSize), ((i + 1) * sectorSize),false);
            this.calculateArcHitPoints(circleWidth * (numberOfLayers - 1) + circleWidth * 2,i * sectorSize,sectorSize,10);
        }

        //Dividers inside each level
        for(var j = 0; j < numberOfLayers; j++){
            for(var i = 0; i < numberOfSections - 1; i++){
                if((maze[i][j].x == maze[i + 1][j].parent.x && maze[i][j].y == maze[i + 1][j].parent.y) ||
                        (maze[i + 1][j].x == maze[i][j].parent.x && maze[i + 1][j].y == maze[i][j].parent.y)){
                        continue;
                    } else{
                        
                        //This is where I need to figure out how to the dividers 
                        //Added the +/- 4 to so lines overlap
                        var x1 = (circleWidth * (j + 1) - 4)  * Math.cos(i * sectorSize + sectorSize);
                        var y1 = (circleWidth * (j + 1) - 4)  * Math.sin(i * sectorSize  + sectorSize);

                        var x2 = (circleWidth * (j + 2) + 4)  * Math.cos(i * sectorSize  + sectorSize);
                        var y2 = (circleWidth * (j + 2) + 4)  * Math.sin(i * sectorSize  + sectorSize);
 
                       this.calculateLineHitPoints(circleWidth * (j+1),circleWidth,i * sectorSize + sectorSize,10);
                       this.graphics.moveTo(x1,y1);
                       this.graphics.lineTo(x2,y2);
                    }
            }
         }
        
        //The wall accross all levels (the ends of the square - we may be able to remove this if we implemented wrap around neighbours)
        for(var j = 0; j < numberOfLayers; j++){
            //The +/- is for half the width of the line
            x1 = (circleWidth * (j + 1) - 4)  * Math.cos(0);
            y1 = (circleWidth * (j + 1) - 4)  * Math.sin(0);

            x2 = (circleWidth * (j + 2) + 4)  * Math.cos(0);
            y2 = (circleWidth * (j + 2) + 4)  * Math.sin(0);

            this.calculateLineHitPoints(circleWidth * (j + 1),circleWidth,0,10);
            this.graphics.moveTo(x1,y1);
            this.graphics.lineTo(x2,y2);
        }
        
        
    }
    /**
     * 
     * @param {*} radius  - Distance from the centre of the circles
     * @param {*} startAngle  - Angle where the arc begins
     * @param {*} segementSize - The total size of the segement
     * @param {*} percission - How many points to produce. The higher, the more points.
     */
    calculateArcHitPoints(radius,startAngle,segementSize,percission){
        //Radius, Start Angle, End Angle, Segement Size, Percission
        var step = segementSize/percission;

        //Loop through
        for(var i = 0; i < percission; i++){
            //Calculate the Point
            var x = (radius  * Math.cos(startAngle + (i * step)));
            var y = (radius  * Math.sin(startAngle + (i * step)));
            //Push the points
            points.push([x,y]);
        }

    }

    /**
     * 
     * @param {*} startDistance - Starting radius
     * @param {*} lineSize - The width of the line
     * @param {*} angle - The angle in which the line emits from
     * @param {*} percission - How many points should be generated
     */
    calculateLineHitPoints(startDistance, lineSize, angle, percission){
        var step = lineSize / percission;

        for(var i = 0; i < percission; i++){
            //Calculate hte points
            var x = (startDistance + (i * step))  *  Math.cos(angle);
            var y = (startDistance + (i * step)) * Math.sin(angle);
            //Push the Points
            points.push([x,y]);
        }


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