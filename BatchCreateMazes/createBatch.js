const fs = require('fs');

var points = [];
var mazes = {};

/**
 * 
 * @param {*} numberOfMazes - Number of mazes to produce
 * @param {*} numberOfLayers - How big the mazes should be
 * @param {*} numberOfSectors - How many sections per layer there should
 * @param {*} circleWidth - How thick the circles should be
 * 
 * The main control function. Produces a batch of numberOfMazes mazes. All mazes are the same shape.
 */
function createBatchMazes(numberOfMazes,numberOfLayers,numberOfSectors,circleWidth){
    //Loop for X number of Mazes
    for(var i = 0; i < numberOfMazes; i++){
        //Name for Level
        var key = "Level " + i;
        mazes[key] = [];
        //Reset points to empty array
        points = [];
        //Generate Random Noise grid 
        var maze = generateMazeGrid(numberOfSectors,numberOfLayers);
        //Run Prims
        maze = runPrims(maze,numberOfSectors,numberOfLayers);
        //Calculate Line Positions
        calculatePositions(maze,numberOfSectors,numberOfLayers,circleWidth);
        //Get exit position
        var jumpPosition = calculateJumpPosition(maze,numberOfSectors,numberOfLayers,circleWidth);
        //Get Star Positions
        var starPositions = getStarPositions(4,numberOfLayers,numberOfSectors,circleWidth,maze)
        //Create Object
        var data = {
            points: points,
            jumpPosition: jumpPosition,
            starPositions, starPositions
        };
        mazes[key].push(data);
    }

    //Write the file out
    fs.writeFile('./data.json',JSON.stringify(mazes,null,2),'utf-8');
}

/**
 * 
 * @param {*} numberOfStars - The number of stars
 * 
 * Randomly chooses locations to spawn stars within the level
 */
function getStarPositions(numberOfStars,numberOfLayers,numberOfSections,circleWidth,maze){
    
    var numberSpawned = 0;
    var starPositions = [];

    while(numberSpawned != numberOfStars){
        //Randomly Select the layer and section
        var layer = Math.floor((Math.random() * (numberOfLayers)));
        var section = Math.floor((Math.random() * (numberOfSections)));
        var sectorSize = ((360 / numberOfSections) * Math.PI) /180;
        
        //If there is not already a star at this position, add one to the maze
        if(!maze[section,layer].star){
            maze[section,layer].star = true;
            //Calculate the world co-ords
            var x = ((circleWidth * (layer)) + (circleWidth * 2.5))  * Math.cos(section * sectorSize + (sectorSize / 2));
            var y = ((circleWidth * (layer)) + (circleWidth * 2.5))  * Math.sin(section * sectorSize + (sectorSize / 2));
            //Push co-ords to array
            starPositions.push([x,y]);
            numberSpawned++;
        }
    
    }

    return starPositions;

}

/**
 * 
 * @param {*} maze - The maze object
 * @param {*} numberOfSections - Number of sections in a circle
 * @param {*} numberOfLayers - Number of layers - the total number of circles
 * @param {*} circleWidth - The Width of each circle
 * 
 * Randomly selects a section where the exit will be spawned. Then, generates the x and y co-ordinate to spawn it.
 * This is what this.placeJump requires in order to spawn the portal.
 */
function calculateJumpPosition(maze,numberOfSections,numberOfLayers,circleWidth){
    //Random number between 0 and the numberOfSections - 1
    var randomSection = Math.floor((Math.random() * numberOfSections - 1));
    var sectorSize = ((360 / numberOfSections) * Math.PI) /180;
    //Trig. to get the position
    var x = ((circleWidth * (numberOfLayers) + circleWidth) - (circleWidth/2))  * Math.cos(randomSection * sectorSize + (sectorSize / 2));
    var y = ((circleWidth * (numberOfLayers) + circleWidth) - (circleWidth/2))  * Math.sin(randomSection * sectorSize + (sectorSize / 2));
    //Set the exit as taken, so we cannot spawn a star on top of the exit gate
    maze[randomSection,numberOfLayers - 1].star = true;
    //Return the position
    return [x,y];
}

/**
 * 
 * @param {*} numberOfSections - The width of the grid
 * @param {*} numberOfLayers - the height of the grid
 * 
 * @returns a numberOfSections x numberOfLayers grid, which each value being random noise.
 */
function generateMazeGrid(numberOfSections, numberOfLayers){
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
function runPrims(maze,numberOfSections, numberOfLayers){
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
 * @param {*} radius - From the centre of the circle, how far is this circle
 * @param {*} startAngle - The starting position of the sector
 * @param {*} segementSize - The size of the Sector
 * 
 * Gives the 2 end points of a segment. Starting at startAngle, and then the second point at startAngle + segmentSize
 */
function calculateEndPoints(radius,startAngle,segementSize){
    var x1 = (radius  * Math.cos(startAngle));
    var y1 = (radius  * Math.sin(startAngle));

    var x2 = (radius * Math.cos(startAngle + segementSize));
    var y2 = (radius * Math.sin(startAngle + segementSize));

    return [[x1,y1],[x2,y2]];
}

/**
 * 
 * @param {*} maze - The maze grid
 * @param {*} numberOfSections - Number of sections per layer
 * @param {*} numberOfLayers - Number of layers
 * @param {*} circleWidth - The thickness of the circles
 * 
 * Given a maze, figures out whether to generate points or not
 */
function calculatePositions(maze,numberOfSections,numberOfLayers,circleWidth){
    var sectorSize = ((360 / numberOfSections) * Math.PI) /180;
    
    //Calculate the points of the inner ring
    for(var i = 1; i < numberOfSections; i++){
        var temp = calculateEndPoints(circleWidth,i * sectorSize,sectorSize);
        points.push(temp[0]);
        points.push(temp[1]);
    }

    //Calculate points for inner rings
    for(var j = 0; j < numberOfLayers - 1; j++){
        for(var i = 0; i < numberOfSections; i++){
            //If the current cell is the parent of the next cell, or if the next cell is the parent of the current cell, continue - leave the gap
            if((maze[i][j].x == maze[i][j+1].parent.x && maze[i][j].y == maze[i][j+1].parent.y) || 
                (maze[i][j+1].x == maze[i][j].parent.x && maze[i][j+1].y == maze[i][j].parent.y)){
                continue;
            } else {
                var temp = calculateEndPoints(circleWidth * j + circleWidth * 2,i * sectorSize,sectorSize);
                points.push(temp[0]);
                points.push(temp[1]);
            }
        }
    } 
    
    //Outer Wall
    for(var i = 0; i < numberOfSections; i++){
        var temp = calculateEndPoints(circleWidth * (numberOfLayers - 1) + circleWidth * 2,i * sectorSize,sectorSize);
        points.push(temp[0]);
        points.push(temp[1]);
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

                    points.push([x1,y1]);
                    points.push([x2,y2]);
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

        //points.push([x1,y1]);
        //points.push([x2.y2]);
    }
}


/**
 * CHANGE PARAMETERS FOR WHAT BATCHES YOU WANT
*/
createBatchMazes(5,5,5,5,5);