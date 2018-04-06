class Panel {
    
    constructor(game) {
        
        this.game = game;
    }
    
    
    drawPanel (x, y, w, h, alpha, fill, lineWeight, lineColour) {
        
        this.x = x;
        this.y = y;
        this.w = w;
        this.y = y;
        
        const angle = 6
        const lineAlpha = 1;
        
        // clears game over panel so it can be redrawn every frame while player & panel are moving
        if (this.panel) {
            this.panel.clear();
        }

        this.panel = this.game.add.graphics(0, 0);
        
        this.panel.beginFill(fill, alpha);
        this.panel.lineStyle(lineWeight, lineColour, lineAlpha);
        
        this.panel.drawRoundedRect(x, y, w, h, angle)

    }
//    
//    addButton (buttonKey, callback, context) {
//        
//        
//
//    }

}

