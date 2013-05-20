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

		gameTexture[4] = new IgeTexture('/Content/Images/Sprites/Environment/block_dirt.png');

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
                        .gridColor("#ffffff")
						.drawBounds(false)
						.isometricMounts(true)
                        .depthSortMode(2)
					    .highlightOccupied(false)
						.mouseUp(function (x, y, event) {
						    //console.log(this.id(), x, y, event.button);
						})
						.mount(self.scene1);



			        // Define a function that will be called when the
			        // mouse cursor moves over one of our entities
			        overFunc = function () {
			            this.highlight(true);
			            this.drawBounds(true);
			            this.drawBoundsData(true);
			        };

			        // Define a function that will be called when the
			        // mouse cursor moves away from one of our entities
			        outFunc = function () {
			            this.highlight(false);
			            this.drawBounds(false);
			            this.drawBoundsData(false);
			        };


			        // Create the 3d container that the player
			        // entity will be mounted to
			        self.player = new CharacterContainer()
                        .id('player')
                        .addComponent(IgePathComponent)
                        .addComponent(PlayerComponent)
                        .isometric(true)
                        .mouseOver(overFunc)
                        .mouseOut(outFunc)
                        .drawBounds(false)
                        .drawBoundsData(false)
                        .mount(self.tileMap)
                        .translateToTile(0, 1, 0);


			        //var container = new IgeEntity()
                    //.depth(1)
                    //.id('wallContainer_' + i + '_' + j)
                    //.isometric(true) // Set the entity to position isometrically instead of in 2d space
                    //.size3d(32, 32, 32)// Set 3d bounds to width 80 (along x axis), length 120 (along y axis), height 90 (along z axis)
                    //.drawBounds(true)
                    //.mount(self.tileMap)
                    //.translateToTile(0, 1, 0);

			        //// Create Player

			        //self.player1 = new Character()
                    //    .addComponent(PlayerComponent)
                    //    .box2dBody({
                    //        type: 'dynamic',
                    //        linearDamping: 0.0,
                    //        angularDamping: 0.1,
                    //        allowSleep: true,
                    //        bullet: true,
                    //        gravitic: true,
                    //        fixedRotation: true,
                    //        fixtures: [{
                    //            density: 1.0,
                    //            friction: 0.5,
                    //            restitution: 0.2,
                    //            shape: {
                    //                type: 'polygon',
                    //                data: new IgePoly2d()
                    //                    .addPoint(-0.5, 0.2)
                    //                    .addPoint(0.5, 0.2)
                    //                    .addPoint(0.5, 0.8)
                    //                    .addPoint(-0.5, 0.8)
                    //            }
                    //        }]
                    //    })
                    //    .id('player1')
                    //    .setType(0)
                    //    .isometric(true)
                    //    .drawBounds(true)
                    //    .mount(container);



			        // Translate the camera to the initial player position
			        self.vp1.camera.lookAt(self.player1);

			        // Tell the camera to track our player character with some
			        // tracking smoothing (set to 20)
			        self.vp1.camera.trackTranslate(self.player1, 20);


			        new RS.DungeonBuilder({

			            height:mazeHeight,
			            width: mazeWidth,
			            tileMap: self.tileMap,
			            startLoc : {x:0, y:1}

			        }).newDungeon();




			        for (var i = 0; i < mazeHeight; i++) {
			            for (var j = 0; j < mazeWidth; j++) {

			                if (self.tileMap.isTileOccupied(i, j, 1, 1)) {

			                    /**/
			                    var container = new IgeEntity()
                                .depth(1)
                                .id('wallContainer_' + i + '_' + j)
                                .isometric(true) // Set the entity to position isometrically instead of in 2d space
                                .size3d(32, 32, 16)// Set 3d bounds to width 80 (along x axis), length 120 (along y axis), height 90 (along z axis)
                                .drawBounds(false)
                                .addGroup("NonPlayerObject").addGroup("Wall")
                                .mount(self.tileMap)
                                .translateToTile(i, j, 0);
                                

			                    /**/
			                    self.obj[2] = new IgeEntity()
                                    .id('wall' + '_' + i + '_' + j)
                                    .height(74)
                                    .width(74)
                                    .depth(1)
                                    .drawBounds(false)
                                    .texture(gameTexture[4])
                                    .mount(container).translateTo(1, -7, 0);
                                    
			                        
			                }
			            }
			        }
			        


			        self.pathFinder = new IgePathFinder()
					.neighbourLimit(100);

				}
			});
		});
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') { module.exports = Client; }

