var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */

        './gameClasses/RogueScript.js',

        './gameClasses/World/Dungeons/DungeonBuilder.js',


        './gameClasses/Player/Components/MouseUpComponent.js',
        './gameClasses/Player/Components/CollectionsComponent.js',
        './gameClasses/Player/Behaviors/LOSBehavior.js',

        './gameClasses/Character.js',
        './gameClasses/CharacterContainer.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }