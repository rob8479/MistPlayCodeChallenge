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
	console.log(generateMazeGrid(numberOfSections,numberOfLayers));
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

	for(var i = 0; i < numberOfSections; i++){
		for(var j = 0; j < numberOfLayers; j++){
			grid[i][j] = Math.floor((Math.random() * 100) + 1);
			//grid[i][j] = 0;
		}
	}
	
	return grid;
}

function runPrims(){

}

function drawMaze(){

}

function addStars(){

}

