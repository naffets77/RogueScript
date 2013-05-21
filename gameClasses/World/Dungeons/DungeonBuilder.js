; (function (RS) {


    function DungeonBuilder(options) {

        this.source = "World/Dungeons/DungeonBuilder.js";


        this.height = RS.dataClean.verifyNumber(options.height, this.source, "Constructor", "height");
        this.width = RS.dataClean.verifyNumber(options.width, this.source, "Constructor", "width");

        this.tileMap = RS.dataClean.verifyRequired(options.tileMap, this.source, "Constructor", "tileMap");


        RS.dataClean.verifyNumber(options.startLoc.x, this.source, "Constructor", "startLoc.x");
        RS.dataClean.verifyNumber(options.startLoc.y, this.source, "Constructor", "startLoc.y");
        this.startLoc = options.startLoc;

    }


    DungeonBuilder.prototype.newDungeon = function () {

        this.createBlueprint();
   
        // need to make sure Blueprint makes sense

        // add walls
        this.populateWalls();



    }

 

    // Dungeon Builder Helpers

    DungeonBuilder.prototype.createBlueprint = function() {


        resetTileMap(this.tileMap, this.height, this.width); // Sets All Nodes as Visited


        var startNode = new dungeonNode(this.startLoc);

        this.tileMap.unOccupyTile(startNode.loc.x, startNode.loc.y, 1, 1);


        var cellsToTest = [startNode];
        var cellsToSkip = [];

        var count = 0;

        while (true) {

            count++;

            // We're done if we've covered everything
            if (cellsToTest.length == 0) {
                break;
            }

            if (count > 1000) {
                break;
            }

            // Get Current Cell To Test
            var current = cellsToTest[cellsToTest.length - 1];

            // Get Direction To Test
            var rand = Math.floor(Math.random() * 4);


            var loc = { x: null, y: null };

            switch (rand) {

                case 0: // top
                    loc.x = current.loc.x;
                    loc.y = current.loc.y - 1;
                    break;

                case 1: // right
                    loc.x = current.loc.x + 1;
                    loc.y = current.loc.y;
                    break;

                case 2: // bottom
                    loc.x = current.loc.x;
                    loc.y = current.loc.y + 1;
                    break;

                case 3: //left
                    loc.x = current.loc.x - 1;
                    loc.y = current.loc.y;
                    break;
            }

            // Test Direction if valid 'wall' to be removed
            // 1. is not on the edge
            // 2. has at least 3 other walls next to it




            if (this.tileMap.isTileOccupied(loc.x, loc.y, 1, 1)) { // only bother test if there's something there


                //console.log('Testing: ' + loc.x + "," + loc.y);

                if (isValidCellLocation(loc.x, loc.y, this.width, this.height, this.tileMap)) {

                    //console.log('--Is Valid For Removal');
                    current.tested[rand] = true; // done looking at that guy
                    var openCell = new dungeonNode(loc); //{ loc: [loc.x, loc.y], tested: [null, null, null, null] };
                    this.tileMap.unOccupyTile(openCell.loc.x, openCell.loc.y, 1, 1);

                    if (!inCellsToSkip(openCell, cellsToSkip)) {
                        cellsToTest.push(openCell);
                    }

                }

                    // 
                else {
                    current.tested[rand] = false;

                    var finishedWithCell = true;
                    for (var i = 0; i < current.tested.length; i++) {

                        if (current.tested[i] == null) { // we haven't looked at it
                            finishedWithCell = false;
                        }
                    }

                    if (finishedWithCell) {
                        cellsToTest.pop();
                        cellsToSkip.push(current);

                        //console.log("Testing Complete: " + current.loc[0] + "," + current.loc[1]);
                    }

                }
            }
        }

    }

    DungeonBuilder.prototype.populateWalls = function () {

        // TODO: Figure out how to preload and use this texture. Seems to be working here for now...
        var WallTexture = new IgeTexture('/Content/Images/Sprites/Environment/block_dirt.png');

        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {

                if (this.tileMap.isTileOccupied(i, j, 1, 1)) {

                    /**/
                    var container = new IgeEntity()
                    .depth(1)
                    .id('wallContainer_' + i + '_' + j)
                    .isometric(true) // Set the entity to position isometrically instead of in 2d space
                    .size3d(32, 32, 16)// Set 3d bounds to width 80 (along x axis), length 120 (along y axis), height 90 (along z axis)
                    .drawBounds(false)
                    .addGroup("NonPlayerObject").addGroup("Wall")
                    .mount(this.tileMap)
                    .translateToTile(i, j, 0);


                    /**/
                    new IgeEntity()
                        .id('wall' + '_' + i + '_' + j)
                        .height(74)
                        .width(74)
                        .depth(1)
                        .drawBounds(false)
                        .texture(WallTexture)
                        .mount(container).translateTo(1, -7, 0);


                }
            }
        }

    }

    // General Helper Functions

    function resetTileMap(tileMap, height, width) {
        for (var i = 0 ; i < height; i++) {
            for (var j = 0; j < width; j++) {
                tileMap.occupyTile(i, j, 1, 1, 1);
            }
        }
    }

    function inCellsToSkip(cell, cellsToSkip) {

        var skip = false;

        for (var i = 0; i < cellsToSkip.length; i++) {

            if (cellsToSkip[i].loc.x == cell.loc.x && cellsToSkip[i].loc.y == cell.loc.y) {
                skip = true;
            }
        }

        return skip;
    }

    function isValidCellLocation(x, y, height, width, tilemap) {

        //if (!(y > 0 && y < height - 1 && x > 0 && x < width - 1)) {
        //console.log("-- Edge Not Eligible for removal");
        //}


        return (y > 0 && y < height - 1 && x > 0 && x < width - 1) && isWall(tilemap, x, y);
    }

    function isWall(tilemap, x, y) {

        var isWall = false;


        if (tilemap.isTileOccupied(x, y, 1, 1)) {

            var wallCount = 0;

            // top
            if (tilemap.isTileOccupied(x, y + 1, 1, 1)) {
                wallCount++;
            }

            // right
            if (tilemap.isTileOccupied(x + 1, y, 1, 1)) {
                wallCount++;
            }

            //left
            if (tilemap.isTileOccupied(x - 1, y, 1, 1)) {
                wallCount++;
            }

            // bottom
            if (tilemap.isTileOccupied(x, y - 1, 1, 1)) {
                wallCount++;
            }


            //console.log("-- Counting Walls: " + wallCount);

            if (wallCount >= 2) {
                isWall = true;
            }
            else {
                // console.log("-- Too Few Walls, Not Eligible For Removal");
            }
        }
        else {
            //console.log("-- Not Occupied - Not Valid For Removal");
        }

        return isWall;
    }



    // Helper Objects

    function dungeonNode(loc) {
        this.loc = loc;
        this.tested = [null, null, null, null];
    }


    // Add to RS Namespace

    RS.DungeonBuilder = DungeonBuilder;

})(RogueScript);