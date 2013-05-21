var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		ige.showStats(1);

		// Load our textures
		var self = this;
	    var gameTexture = [];

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

		gameTexture[5] = new IgeCellSheet('/Content/Images/Sprites/Environment/grassSheet.png', 4, 1);

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
						//.drawGrid(mazeHeight)
						.drawMouse(true)
                        .gridColor("#444")
						.drawBounds(false)
						.isometricMounts(true)
                        .depthSortMode(2)
					    .highlightOccupied(false)
						.mouseUp(function (x, y, event) {
						    //console.log(this.id(), x, y, event.button);
						})
						.mount(self.scene1);


			         self.textureMap1 = new IgeTextureMap()
						.depth(0)
						.tileWidth(32)
						.tileHeight(32)
						//.drawGrid(3)
						//.drawMouse(true)
						.translateTo(-100, -200, 0)
						.drawBounds(false)
						.autoSection(10)
						.drawSectionBounds(false)
						.isometricMounts(true)
						//.translateTo(300, 300, 0)
						.mount(self.scene1);

			        var texIndex = self.textureMap1.addTexture(gameTexture[5]);

			    // Generate some random data, large amounts of it
			        for (var x = 0; x < 150; x++) {
			            for (var y = 0; y < 150; y++) {
			                var rand = Math.ceil(Math.random() * 4);
			                self.textureMap1.paintTile(x, y, texIndex, rand);
			            }
			        }


			        // Define a function that will be called when the
			        // mouse cursor moves over one of our entities
			        overFunc = function () {
			            this.highlight(true);
			            this.drawBounds(true);
			            this.drawBoundsData(true);
			            console.log("Mouse Over");
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
                        .addComponent(MouseUpComponent)
                        .addComponent(CollectionsComponent)
                        .isometric(true)
                        .mouseOver(overFunc)
                        .mouseOut(outFunc)
                        .drawBounds(false)
                        .drawBoundsData(false)
                        .mount(self.tileMap)
                        .translateToTile(1, 1, 0);

			        // Translate the camera to the initial player position
			        self.vp1.camera.lookAt(self.player1);

			        // Tell the camera to track our player character with some
			        // tracking smoothing (set to 20)
			        self.vp1.camera.trackTranslate(self.player1, 20);


			        var DungeonBuilder = new RS.DungeonBuilder({
			            height: mazeHeight,
			            width: mazeWidth,
			            tileMap: self.tileMap,
			            startLoc: { x: 1, y: 1 }
			        });

			        DungeonBuilder.newDungeon();

			        
                    // Required for Pathing
			        self.pathFinder = new IgePathFinder()
					.neighbourLimit(100);

				}
			});
		});
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') { module.exports = Client; }

