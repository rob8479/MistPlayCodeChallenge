/**
 * Level.
 */
function Level() {
	
	Phaser.State.call(this);
	
}

/** @type Phaser.State */
var Level_proto = Object.create(Phaser.State.prototype);
Level.prototype = Level_proto;
Level.prototype.constructor = Level;

Level.prototype.init = function () {
	
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
	this.stage.backgroundColor = '#ffffff';
	
};

Level.prototype.create = function () {
	var graphics = this.add.graphics(this.world.centerX, this.world.centerY);
	this.physics.arcade.enable(graphics);
	graphics.lineStyle(3, 0x00000);
	createMaze(10,5,graphics);
	/*
	var graphics = this.add.graphics(this.world.centerX, this.world.centerY);
	graphics.lineStyle(3, 0x00000);
	graphics.arc(0,0,10,0,(360 * Math.PI / 180),false);
	graphics.arc(0,0,50,0,(360 * Math.PI / 180),false);
	graphics.arc(0,0,100,0,(360 * Math.PI / 180),false);
	var x = graphics.arc(0,0,150,0,(360 * Math.PI / 180),false);

	console.log(x);
	var line = new Phaser.Line;
	console.log(line);
	*/
};

/**
 * 
 * @param {*} numberOfSections - The number of "spokes". These are the number of grid cells we have per layer  
 * @param {*} numberOfLayers - The number of layers the total maze has. I.e. - the number of nested circles
 * 
 * The main function that generates a level.
 */

function createMaze(numberOfSections, numberOfLayers,graphics){
	var temp = generateMazeGrid(numberOfSections,numberOfLayers);
	var maze = runPrims(temp, numberOfSections, numberOfLayers);
	drawMaze(graphics,numberOfSections,numberOfLayers,maze);
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
function runPrims(maze,numberOfSections, numberOfLayers){
	// For now, just do a simple array, but this can be implemented more efficently for a PQ

	var frontier = []
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
			return frontier.splice(currentMinimumIndex,1)[0];
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
			if(maze[cell.x - 1 % numberOfSections][cell.y].parent == null){
				maze[cell.x - 1 % numberOfSections][cell.y].parent = cell;
				frontier.push(maze[cell.x - 1 % numberOfSections][cell.y]);
			}	
		}

		//Right
		if(cell.x != numberOfSections - 1){
			if(maze[cell.x + 1 % numberOfSections][cell.y].parent == null){
				maze[cell.x + 1 % numberOfSections][cell.y].parent = cell;
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
 * @param {*} graphics - The graphics context used to draw the lines
 * @param {*} numberOfSections - Number of divisons per layer
 * @param {*} numberOfLayers  - Number of Circles
 * @param {*} maze  - The Maze
 * 
 * From the generated Maze, it first draws the rings. It looks ahead "down" a layer, and if the parent of that cell is the current cell, we draw a wall.
 * 
 * After, we then draw the dividers within each layer. Similar idea as to before, but with straight lines
 */
function drawMaze(graphics,numberOfSections,numberOfLayers, maze){
	var sectorSize = ((360 / numberOfSections) * Math.PI) /180;
	var nintyDegrees = (90 * Math.PI)/180;
	var circleWidth = 50;

	//Draw the Circles "rings"
	for(var j = 0; j < numberOfLayers - 1; j++){
		for(var i = 0; i < numberOfSections; i++){
			//graphics.arc(0,0,10,i * sectorSize,(i + 1) * sectorSize,false);
			if(maze[i][j] == maze[i][j+1].parent){
				continue;
			} else {
				graphics.arc(0,0,circleWidth * j + circleWidth,i * sectorSize,(i + 1) * sectorSize,false);
			}
		}
	}

	for(var i = 0; i < numberOfSections - 1; i++){
			graphics.arc(0,0,circleWidth * numberOfLayers,i * sectorSize,(i + 1) * sectorSize,false);
		
	}

	console.log("wuddup333");
	
	//Draw the dividers within each Layer
	for(var j = 1; j < numberOfLayers - 1; j++){
		for(var i = 0; i < numberOfSections - 1 ; i++){	
			if(maze[i][j] == maze[i + 1][j].parent){
				continue;
			} 
				//This is where I need to figure out how to the dividers 
				x1 = ((circleWidth * j)  * Math.cos(i * sectorSize));
				y1 = ((circleWidth * j)  * Math.sin(i * sectorSize));

				x2 = ((circleWidth * j) + circleWidth)  * Math.cos(i * sectorSize);
				y2 = ((circleWidth * j) + circleWidth)  * Math.sin(i * sectorSize);

				graphics.moveTo(x1,y1);
				graphics.lineTo(x2,y2);
			
		}


		
	}

	
	

}

function addStars(){

}

