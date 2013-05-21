

// Will hold any collections that need to be defined upfront to avoid GC 

var CollectionsComponent = IgeClass.extend({
    classId: 'CollectionsComponent',
    componentId: 'collections',

    init: function (entity, options) {
        var self = this;

        // Store the entity that this component has been added to
        this._entity = entity;

        // Store any options that were passed to us
        this._options = options;


        this.managers = {
            LOSManager : new LOSComponentManager({count : 150})
        }

        

        this.managers.LOSManager.init();


    }
});



function LOSComponentManager(options) {
    this.dirty = [];
    this.clean = [];

    this.entitiesToCheck = [];

    this.count = options.count;
}

LOSComponentManager.prototype.init = function () {

    for (var i = 0; i < this.count; i++) {
        this.clean.push(new LOSComponent());
    }

}

LOSComponentManager.prototype.process = function (playerTileX, playerTileY, tilemap) {


    var dirty = this.dirty;
    var dirtyLength = this.dirty.length - 1;

    while(dirtyLength >= 0){

        var LOSComponentToCheck = dirty[dirtyLength];


        

        for(var i = 0; i < LOSComponentToCheck.tiles.length; i++){

            var tile = LOSComponentToCheck.tiles[i];

            this.setEntitiesInLine(playerTileX, playerTileY, tile.x, tile.y);


            this.processEntitiesInLine();
        }


        dirtyLength--;
    }

    //console.log("Processing LOS");
}

LOSComponentManager.prototype.processEntitiesInLine = function () {

    var LOSComponents = this.entitiesToCheck;
    var length = LOSComponents.length;

    var blocked = 0;

    // important to start at first element as it's the closest
    for (var i = 0; i < length; i++) {
        var LOSComponent = LOSComponents[i];

        if (blocked > 1) {
            LOSComponent.entity.hide();
        }
        else {
            if (LOSComponent.entity.inGroup("Wall")) {
                blocked++;
                LOSComponent.entity.show();
            }
        }
    }


   // console.log("Checking " + this.entitiesToCheck.length + " Entities");
    this.entitiesToCheck.length = 0;
}

LOSComponentManager.prototype.setEntitiesInLine = function (x0, y0, x1, y1, tilemap) {
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    var maxCount = 20;

    while (true && maxCount > 0) {
        //setPixel(x0, y0);  // Do what you need to for this
        //console.log("checking at " + x0 + "," + y0);

        for (var i = 0; i < this.dirty.length; i++) {
            for (var j = 0; j < this.dirty[i].tiles.length; j++) {
                if (x0 == this.dirty[i].tiles[j].x && y0 == this.dirty[i].tiles[j].y) {
                    this.entitiesToCheck.push(this.dirty[i]);
                }

            }
        }

        if ((x0 == x1) && (y0 == y1)) break;
        var e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }

        maxCount--;
    }
    
}

LOSComponentManager.prototype.set = function (entity) {

    if (this.clean.length > 0) {

        var cleanOne = this.clean.pop();
        cleanOne.init(entity);
        this.dirty.push(cleanOne);

    }
    else {
        // Need to make a few more objects and add them to our clean array... for now just blow up
        alert("TODO: Fix running out of LOS Components... just ran out with current length at : " + this.count);
    }

}

LOSComponentManager.prototype.reset = function () {

    var dirty = this.dirty;
    var clean = this.clean;

    var dirtyLength = dirty.length;

    while (dirtyLength--) {
        clean.push(dirty.pop().reset());
    }
}


/***
    LOS Component
***/

function LOSComponent() {
    this.entity = null;
    this.visible = null;
    this.tiles = null;
}

LOSComponent.prototype.init = function (entity) {

    this.reset();

    this.entity = entity;
    this.visible = true;
    this.tiles = entity.overTiles();
}

LOSComponent.prototype.reset = function () {
    this.entity = null;
    this.visible = null;
    this.tiles = null;
    return this;
}






