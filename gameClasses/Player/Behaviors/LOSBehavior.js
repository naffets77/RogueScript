



var LOSBehaviour = function () {

    var AABB = this._aabb;

    // console.log("updating in player component");
    // Hide / Show NPC's based on distance from character
    if (AABB != undefined) {
        var NPCs = ige.$$$("NonPlayerObject");
        var NumberOfNPCs = NPCs.length;


        var LOSManager = this._parent.collections.managers.LOSManager;
        LOSManager.reset();

        while (NumberOfNPCs--) {
            var NPC = NPCs[NumberOfNPCs];

            if (Math.distance(AABB.x, AABB.y, NPC._aabb.x, NPC._aabb.y) > 300) {
                NPC.hide();
            }
            else {
                
                // Draw line to block

                //line(AABB.x, AABB.y, NPC._aabb.x, NPC._aabb.y);

                // add to LOS Managers list to check

                LOSManager.set(NPC);

                //NPC.show();
            }
        }


        var tileMap = ige.$("ISOTileMap");
        var playerTile = this._parent.overTiles()[0];


        LOSManager.process(playerTile.x, playerTile.y, tileMap);

    }







};