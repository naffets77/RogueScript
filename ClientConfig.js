var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */

        './gameClasses/PlayerComponent.js',
        './gameClasses/Character.js',
		'./gameClasses/Rotator.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }