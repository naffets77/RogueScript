var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		ige.showStats(1);

		// Load our textures
		var self = this,
			gameTexture = [];

		this.obj = [];

		ige.input.debug(true);

		// Load the fairy texture and store it in the gameTexture array
		gameTexture[0] = new IgeTexture('/Engines/ige_prototype-master/examples/assets/textures/sprites/fairy.png');

		// Load a smart texture
		gameTexture[1] = new IgeTexture('/Engines/ige_prototype-master/examples/assets/textures/smartTextures/simpleBox.js');

	    // Load a wall spriteSheet

		gameTexture[2] = new IgeSpriteSheet('/Content/Images/TileSheets/walls2.bmp', [
			// Format of the sprite area is x, y, width, height
			[0, 0, 128, 128, 'wall1'],
			[0, 128 * 3, 128, 128, 'wall2']
		]);

		gameTexture[3] = new IgeCellSheet('/Content/Images/Sprites/Characters/vx_chara02_c.png', 12, 8);

		//gameTexture[2] = new IgeSpriteSheet('/Engines/ige_prototype-master/examples/assets/textures/tiles/vx-xp-174-chest01.png');
		// Wait for our textures to load before continuing
		ige.on('texturesLoaded', function () {
			// Create the HTML canvas
			ige.createFrontBuffer(true);

		    // Add physics and setup physics world
			ige.addComponent(IgeBox2dComponent)
                .box2d.sleep(true)
                .box2d.gravity(0, 0)
                .box2d.createWorld()
                .box2d.start();

			// Start the engine
			ige.start(function (success) {
				// Check if the engine started successfully
			    if (success) {



			        // Create Player UI

			        // Create the scene
			        self.scene1 = new IgeScene2d()
						.id('Dungeon');

			        // Create the main viewport and set the scene
			        self.vp1 = new IgeViewport()
						.id('vp1')
						.autoSize(true)
						.scene(self.scene1)
						.drawBounds(false)
                        .addComponent(IgeMousePanComponent)
                        .mousePan.enabled(true)
						.mount(ige);

			        var mazeHeight = 16, mazeWidth = 16;

			        self.tileMap = new IgeTileMap2d()
						.id('ISOTileMap')
						.depth(1)
						.translateTo(-100, -200, 0)
						.tileWidth(32)
						.tileHeight(32)
						.drawGrid(mazeHeight)
						.drawMouse(true)
						.drawBounds(true)
						.isometricMounts(true)
					    .highlightOccupied(true)
						.mouseUp(function (x, y, event) {
						    console.log(this.id(), x, y, event.button);
						})
						.mount(self.scene1);



			        // Create Player

			        self.player1 = new Character()
                        .addComponent(PlayerComponent)
                        .box2dBody({
                            type: 'dynamic',
                            linearDamping: 0.0,
                            angularDamping: 0.1,
                            allowSleep: true,
                            bullet: true,
                            gravitic: true,
                            fixedRotation: true,
                            fixtures: [{
                                density: 1.0,
                                friction: 0.5,
                                restitution: 0.2,
                                shape: {
                                    type: 'polygon',
                                    data: new IgePoly2d()
                                        .addPoint(-0.5, 0.2)
                                        .addPoint(0.5, 0.2)
                                        .addPoint(0.5, 0.8)
                                        .addPoint(-0.5, 0.8)
                                }
                            }]
                        })
                        .id('player1')
                        .setType(0)
                        .translateTo(480, 300, 0)
                        .drawBounds(false)
                        .mount(self.tileMap)
                        .translateToTile(0, 1, 0);

			        // Define our player character classes
			        self.CharacterMonk = IgeEntity.extend({
			            classId: 'CharacterMonk',

			            init: function () {
			                IgeEntity.prototype.init.call(this);

			                // Setup the entity
			                this.addComponent(IgeAnimationComponent)
								.addComponent(IgeVelocityComponent)
								.animation.define('walkDown', [10, 11, 12, 11], 8, -1)
								.animation.define('walkLeft', [22, 23, 24, 23], 8, -1)
								.animation.define('walkRight', [34, 35, 36, 35], 8, -1)
								.animation.define('walkUp', [46, 47, 48, 47], 8, -1)
								.cell(10)
								.depth(1)
								.texture(gameTexture[3])
								.dimensionsFromCell()
								.mount(self.tileMap)
			                    .translateToTile(0, 1, 0);

			                ige.input.mapAction('mouseX', ige.input.mouse.x);
			                ige.input.mapAction('mouseY', ige.input.mouse.y);
			            },

			            walkTo: function (x, y) {
			                var self = this,
								distX = x - this.translate().x(),
								distY = y - this.translate().y();


			                    if (Math.abs(distX) > Math.abs(distY)) {
			                        // Moving horizontal
			                        if (distX < 0) {
			                            // Moving left
			                            this.animation.select('walkLeft');
			                        } else {
			                            // Moving right
			                            this.animation.select('walkRight');
			                        }
			                    } else {
			                        // Moving vertical
			                        if (distY < 0) {
			                            // Moving up
			                            this.animation.select('walkUp');
			                        } else {
			                            // Moving down
			                            this.animation.select('walkDown');
			                        }
			                    }


			                return this;
			            },

			            tick: function (ctx) {
			                /**/
			                this.walkTo(
								ige.input.actionVal('mouseX'),
								ige.input.actionVal('mouseY')
							);
                            
			                IgeEntity.prototype.tick.call(this, ctx);
			            }
			        });


			        // Make Monk
			        self.obj[0] = new self.CharacterMonk();




			        // Translate the camera to the initial player position
			        self.vp1.camera.lookAt(self.player1);

			        // Tell the camera to track our player character with some
			        // tracking smoothing (set to 20)
			        self.vp1.camera.trackTranslate(self.player1, 20);



                    // Setup Tilemap


			        for (var i = 0 ; i < mazeHeight; i++) {
			            for (var j = 0; j < mazeWidth; j++) {
			                self.tileMap.occupyTile(i, j, 1, 1, 1);
			            }
			        }

                    // tested: [top,right,bottom,left]
			        var entrance = { loc: [0, 1], tested: [null, null, null, null] };

			        self.tileMap.unOccupyTile(entrance.loc[0], entrance.loc[1], 1, 1);


			        var cellsToTest = [entrance];
			        var cellsToSkip = [];

			        var count = 0;




			        //create a CellStack (LIFO) to hold a list of cell locations  
			        //set TotalCells = number of cells in grid  
			        //choose a cell at random and call it CurrentCell  
			        //set VisitedCells = 1  
   
			        //while VisitedCells < TotalCells 
			        //    find all neighbors of CurrentCell with all walls intact   
			        //if one or more found 
			        //    choose one at random  
			        //    knock down the wall between it and CurrentCell  
			        //    push CurrentCell location on the CellStack  
			        //    make the new cell CurrentCell  
			        //    add 1 to VisitedCells
                    //else 
                    //    pop the most recent cell entry off the CellStack  
			        //    make it CurrentCell
			        //    endIf
			        //endWhile 

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


			            var loc = {x:null, y:null};

			            switch (rand) {

			                case 0: // top
			                    loc.x = current.loc[0];
			                    loc.y = current.loc[1] - 1;
			                    break;
			                
			                case 1: // right
			                    loc.x = current.loc[0] + 1;
			                    loc.y = current.loc[1];
			                    break;

			                case 2: // bottom
			                    loc.x = current.loc[0];
			                    loc.y = current.loc[1] + 1;
			                    break;

			                case 3: //left
			                    loc.x = current.loc[0] - 1;
			                    loc.y = current.loc[1];
			                    break;
			            }

			            // Test Direction if valid 'wall' to be removed
			            // 1. is not on the edge
			            // 2. has at least 3 other walls next to it


			            

			            if (self.tileMap.isTileOccupied(loc.x, loc.y, 1, 1)) { // only bother test if there's something there


			                //console.log('Testing: ' + loc.x + "," + loc.y);

			                if (isValidCellLocation(loc.x, loc.y, mazeWidth, mazeHeight, self.tileMap)) {

			                    //console.log('--Is Valid For Removal');
			                    current.tested[rand] = true; // done looking at that guy
			                    var openCell = { loc: [loc.x, loc.y], tested: [null, null, null, null] };
			                    self.tileMap.unOccupyTile(openCell.loc[0], openCell.loc[1], 1, 1);

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



			            




			            //if (current.tested[0] != null && current.tested[1] != null && current.tested[2] != null && current.tested[3] != null) {

			            //    cellsToTest.pop();
			            //    console.log("Testing Complete: " + current.loc[0] + "," + current.loc[1]);
			            //}

			        }








			        // -------- Examples --------

			        //self.obj[0] = new IgeEntity()
					//	.id('3d1')
					//	.isometric(true)
					//	.mount(self.tileMap)
					//	.translateToTile(0, 0, 0)
					//	.drawBounds(false)
					//	.tileWidth(1)
					//	.tileHeight(1)
					//	.occupyTile()
					//	.size3d(40, 40, 0);

			        //self.obj[1] = new IgeEntity()
					//	.id('3d2')
					//	.isometric(true)
					//	.mount(self.tileMap)
					//	.translateToTile(4, 2, 0)
					//	.drawBounds(false)
					//	.tileWidth(2)
					//	.tileHeight(2)
					//	.occupyTile()
					//	.size3d(80, 80, 0);




					// Create an entity and mount it to the scene
					// (the class Rotator is declared in ./gameClasses/Rotator.js)
					//self.obj[2] = new IgeEntity()
					//	.id('wall1')
					//	.depth(1)
                    //    .height(64)
                    //    .width(64)
					//	.texture(gameTexture[2])
                    //    .cellById('wall1')
                    //    .drawBounds(true)
				    //	.mount(self.tileMap)
                    //    .translateToTile(3, 3, 0);

					//self.obj[3] = new IgeEntity()
					//	.id('wall2')
                    //    .texture(gameTexture[2])
                    //    .height(64)
                    //    .width(64)
                    //    .cellById('wall2')
					//	.mount(self.tileMap).translateToTile(0, 0, 0);

				}
			});
		});
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') { module.exports = Client; }




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
