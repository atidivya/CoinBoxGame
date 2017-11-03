var loadState = {
	preload: function(){
		//add a loading label on the screen

		var loadingLabel = game.add.text(game.width/2, 150, 'loading .....', {font: '30px Arial', fill:'#ffffff'});
		loadingLabel.anchor.setTo(0.5, 0.5);

		//display the progress bar

		var progressBar = game.add.sprite(game.width/2, 200, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(progressBar);

		//load the assets


        //game.load.image('player', 'assets/player.png');
        game.load.spritesheet('player', 'assets/player2.png', 20, 20);

        //adding the walls

        game.load.image('wallV', 'assets/wallVertical.png');
        game.load.image('wallH', 'assets/wallHorizontal.png');

        //add coins

        game.load.image('coin', 'assets/coin.png');

        //add enemies

        game.load.image('enemy', 'assets/enemy.png');

        // load new asset that will be used in the menu state

        game.load.image('background', 'assets/background.png');


        // sound when the player jumps

        game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);

        //sound when the player takes the coin

        game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);

        //sound when the player dies

        game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);
        
        //load the particle
        
        game.load.image('pixel', 'assets/pixel.png');
        
        //load mute button
        game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
        
        //load touch buttons
        
        game.load.image('jumpButton', 'assets/jumpButton.png');
        game.load.image('rightButton', 'assets/rightButton.png');
        game.load.image('leftButton', 'assets/leftButton.png');

	},
	create: function(){
		//go to the menu state
		game.state.start('menu');
	}
}