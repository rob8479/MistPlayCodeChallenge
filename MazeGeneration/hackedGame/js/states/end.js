var buttonKey;

var playerTime;
var bestTime;

class EndLevel {
    
    create () {

        this.game.world.setBounds(0, 0, this.game.width, this.game.height);
        this.game.world.angle = 0;
        
        // Level title text
        const headerStyle = { font: "45px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.headerText = this.game.add.text(this.game.width/2, this.game.height/8, 'LEVEL ' + localStorage.getItem('currentLevel'), headerStyle);
        this.headerText.anchor.setTo(0.5);
        
        if (Number(localStorage.getItem('bestTime' + String(currentLevel))) == 0) {
            
            bestTime = '--.--';
        }
        
        else {
            bestTime = localStorage.getItem('bestTime' + String(currentLevel));
        }
        
        if (failed) {
            
            this.fail();
        }

        else {
            
            this.win();
        }
        
        // displays continue/try again button
        var button = this.game.add.button(this.game.width/2, this.game.height - this.game.height / 8, buttonKey, (function () {
            
            this.game.add.tween(button.scale).to ( {x: 0.9, y: 0.9}, 50, "Linear", true, 0, 0, true);
            this.fadeOut();
        }), this);
        button.anchor.setTo(0.5);
        button.scale.setTo(0.8);
        
        var buttonTween = this.game.add.tween(button.scale).to ( {x: 0.85, y: 0.85}, 450, 'Linear', true, 0, -1, true);
        
        this.createExitButton();
        
    }
    
    win () {
        
        playerTime = String(gameLength.toFixed(2));
        if (gameLength < Number(localStorage.getItem('bestTime' + String(currentLevel))) || 
            Number(localStorage.getItem('bestTime' + String(currentLevel))) == 0) {
            
            localStorage.setItem('bestTime' + String(currentLevel), String(gameLength.toFixed(2)));
        }
        
        this.displayBodyText();
        localStorage.setItem('currentLevel', String(currentLevel + 1));
        buttonKey = 'continueButton';
        this.game.time.events.add(Phaser.Timer.SECOND * 7, this.fadeOut, this);

    }
    
    fail () {
        
        playerTime = '--.--';
        this.displayBodyText();
        buttonKey = 'retryButton';
        this.game.time.events.add(Phaser.Timer.SECOND * 7, this.fadeOut, this);
        
    }
    
    displayBodyText () {
        
        this.cellLocations = this.game.cache.getJSON('cellData');
        
        var cellIcon = this.game.add.sprite(this.game.width/2, this.game.height/4, 'cell');
        
        
        // if landscape
        if (window.innerHeight < window.innerWidth)
            {
                cellIcon.anchor.setTo(0.5, 0.35);
                cellIcon.scale.setTo(0.2);
                
                var bounce1 = this.game.add.tween(cellIcon.scale).to( { x: 0.3, y: 0.3 }, 50, Phaser.Easing.Bounce.none, true, 0, 0, true);
                 bounce1.onComplete.add( (function () {
            
                 var bounce2 = this.game.add.tween(cellIcon.scale).to( { x: 0.28, y: 0.28 }, 35, Phaser.Easing.Bounce.none, true, 0, 0, true);
                 bounce2.onComplete.add( (function () {
                
                 var bounce3 = this.game.add.tween(cellIcon.scale).to( { x: 0.25, y: 0.25 }, 25, Phaser.Easing.Bounce.none, true, 0, 0, true);
                 bounce3.onComplete.add( (function () {
                    
                 var bounce4 = this.game.add.tween(cellIcon.scale).to( { x: 0.225, y: 0.225 }, 15, Phaser.Easing.Bounce.none, true, 0, 0, true);
                     
                 }), this);
                
            }), this)
            
        }), this);
            }
        
        // if portrait
        else
            {
                cellIcon.anchor.setTo(0.5, 0.75);
                cellIcon.scale.setTo(0.4);
                
                 var bounce1 = this.game.add.tween(cellIcon.scale).to( { x: 0.5, y: 0.5 }, 50, Phaser.Easing.Bounce.none, true, 0, 0, true);
                 bounce1.onComplete.add( (function () {
            
                 var bounce2 = this.game.add.tween(cellIcon.scale).to( { x: 0.48, y: 0.48 }, 35, Phaser.Easing.Bounce.none, true, 0, 0, true);
                 bounce2.onComplete.add( (function () {
                
                 var bounce3 = this.game.add.tween(cellIcon.scale).to( { x: 0.45, y: 0.45 }, 25, Phaser.Easing.Bounce.none, true, 0, 0, true);
                 bounce3.onComplete.add( (function () {
                    
                 var bounce4 = this.game.add.tween(cellIcon.scale).to( { x: 0.425, y: 0.425 }, 15, Phaser.Easing.Bounce.none, true, 0, 0, true);
                     
                 }), this);
                
            }), this)
            
        }), this);
            }
        
//        cellIcon.tint = cellColour;
        
//        this.game.add.tween(cellIcon.scale).to( { x: -0.8, y: 0.8 }, 2500, Phaser.Easing.Bounce.none, true, 0, 1000, true);  
        
       
        
        var highScoreKey = 'highScore' + String(currentLevel);
        const bodyTextStyle = { font: "50px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.cellText = this.game.add.text(this.game.width/2, this.game.height/4 + 65, '', bodyTextStyle);
        this.cellText.anchor.setTo(0.5);
        
        const bestScoreStyle = { font: "20px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
        var bestCells = this.game.add.text(this.game.width/2, this.game.height/4 + 100, '', bestScoreStyle);
        bestCells.anchor.setTo(0.5);
        
        if (currentLevel >= introduceCells) {
            
            this.cellText.setText(
            localStorage.getItem('cellsCollected') + '/' + this.cellLocations.cellData[currentLevel - 1].length);
            bestCells.setText('BEST: ' + localStorage.getItem(highScoreKey) + '/' + this.cellLocations.cellData[currentLevel - 1].length);
            
        }
        
        else {
            
            this.cellText.setText('0/0');
            bestCells.setText('BEST: 0/0');
        }
        
//        var timeIcon = this.game.add.sprite(this.game.width/2, this.game.height/2 + 25, 'time');
//        timeIcon.anchor.setTo(0.5);
//        timeIcon.scale.setTo(0.5);
//        
//        var timeText = this.game.add.text(this.game.width/2, this.game.height/2 + 25 + 65, '', bodyTextStyle);
//        timeText.anchor.setTo(0.5);
//        timeText.setText(playerTime);
//        
//        var bestTimeText = this.game.add.text(this.game.width/2, this.game.height/2 + 25 + 100, '', bestScoreStyle);
//        bestTimeText.anchor.setTo(0.5);
//        bestTimeText.setText('BEST: ' + bestTime);

    }
    
    startNextLevel (){
        
        this.game.state.start('Game');
        
    }

    fadeOut() {
         
        var fadeOut = this.game.add.graphics(0, 0);
        
        fadeOut.beginFill(stageColour, 1);
        fadeOut.drawRect(0, 0, this.game.world.width, this.game.world.height);
        fadeOut.alpha = 0;
        var tween = this.game.add.tween(fadeOut).to( { alpha: 1 }, 500, "Linear", true, 0, 0, false);
        tween.onComplete.add(function () {
            
            // the game will go back to the main menu when it has finished the demo levels
            if (currentLevel > 5) {
            this.game.state.start('Preload');
            }
            
            else {
                 this.game.state.start('Game');
            }
           
        }, this);

    }
    
    createExitButton() {
        
        var exitButton = this.game.add.button(this.game.width/2, this.game.height - this.game.height / 8 - 55, 'menuButton', (function () {
            
            this.game.add.tween(exitButton.scale).to ( {x: 0.5, y: 0.5}, 50, "Linear", true, 0, 0, true);
            this.game.state.start('Preloader');
        }), this);
        exitButton.anchor.setTo(0.5);
        exitButton.scale.setTo(0.4);
        
        
    }
    
}

RocketMaze.EndLevel = new EndLevel();