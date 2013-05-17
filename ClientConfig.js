var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */

        './gameClasses/RogueScript.js',

        './gameClasses/World/Dungeons/DungeonBuilder.js',


        './gameClasses/PlayerComponent.js',
        './gameClasses/Character.js',
		'./gameClasses/Rotator.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }