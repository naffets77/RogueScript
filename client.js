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
						.drawBounds(true)
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
						.drawBounds(false)
						.isometricMounts(true)
					    .highlightOccupied(true)
						.mouseUp(function (x, y, event) {
						    console.log(this.id(), x, y, event.button);
						})
						.mount(self.scene1);



			        // Create Player

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
                    //    .translateTo(480, 300, 0)
                    //    .drawBounds(false)
                    //    .mount(self.tileMap)
                    //    .translateToTile(0, 1, 0);

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
			        //self.obj[0] = new self.CharacterMonk();

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
                                .mount(self.tileMap)
                                .translateToTile(i, j, 0);
                                

			                    /**/
			                    self.obj[2] = new IgeEntity()
                                    .id('wall' + '_' + i + '_' + j)
                                    .height(75)
                                    .width(75)
                                    .depth(1)
                                    .drawBounds(false)
                                    .texture(gameTexture[4])
                                    .mount(container).translateTo(1, -7, 0);
                                    
			                        
			                }
			            }
			        }
			        


/*
			        self.obj[3] = new IgeEntity()
						.id('wall2')
						.depth(1)
                        .height(64)
                        .width(64)
						.texture(gameTexture[4])
                        .drawBounds(true)
				    	.mount(self.tileMap)
                        .translateToTile(0, 2, 0);

			        self.obj[4] = new IgeEntity()
						.id('wall3')
						.depth(1)
                        .height(64)
                        .width(64)
						.texture(gameTexture[4])
                        .drawBounds(true)
				    	.mount(self.tileMap)
                        .translateToTile(0, 3, 0);

			        self.obj[5] = new IgeEntity()
						.id('wall4')
						.depth(1)
                        .height(64)
                        .width(64)
						.texture(gameTexture[4])
                        .drawBounds(true)
				    	.mount(self.tileMap)
                        .translateToTile(0, 4, 0);
*/






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

