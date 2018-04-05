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

	createMaze(10,4);
};

/**
 * 
 * @param {*} numberOfSections - The number of "spokes". These are the number of grid cells we have per layer  
 * @param {*} numberOfLayers - The number of layers the total maze has. I.e. - the number of nested circles
 * 
 * The main function that generates a level.
 */

function createMaze(numberOfSections, numberOfLayers){
	var temp = generateMazeGrid(numberOfSections,numberOfLayers);
	runPrims(temp, numberOfSections, numberOfLayers);
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

function runPrims(maze,numberOfSections, numberOfLayers){
	// For now, just do a simple array, but this can be implemented more efficently for a PQ

	var frontier = []
	//Starts from Point 0,0
	frontier.push(maze[0][0]);
	maze[0][0].opened = true;

	//Get minimum of the frontier
	function getMinimum(){
		var currentMinimumIndex = -1;
		var currentBestWeight = 2000;
		//Loop through and find the minimum weight
		for(var i = 0; i < frontier.length; i++){
			if(frontier[i].weight < currentBestWeight){
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
	
}

function drawMaze(){

}

function addStars(){

}

