var bootState = {
	preload: function(){
		game.load.image('progressBar', 'assets/progressBar.png');
	},
	create: function(){
        
        	//set some game settings
		game.stage.backgroundColor = '#3498db';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.renderer.renderSession.roundPixels = true;
        
        //if device is not a desktop, it is a mobile device
        
        if(!game.device.desktop){
            //set the type of scaling to 'show all'
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            
            //set the min and max width/height of the game
            game.scale.setMinMax(game.width/2, game.height/2, game.width*2, game.height*2);
            
            //center the game on the screen
            
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            
            //add a blue color to the page to hide potential white borders
            
            document.body.style.backgroundColor = '#3498db';
        }

	

		//start the load state

		game.state.start('load');
	}
};