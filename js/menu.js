    var menuState = {
	create: function(){

		//add a background image
		game.add.image(0, 0, 'background');
        
          
        //add button that calls toggleSound function when pressed
        
          this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
        //if game already muted, display the speaker with no sound
        this.muteButton.frame = game.sound.mute ? 1:0;

		// display the name of the game

		var nameLabel = game.add.text(game.width/2, -50, 'Super Coin Box', {font: '50px Geo', fill: '#ffffff'});
		nameLabel.anchor.setTo(0.5, 0.5);
        
        //create a tween on the name label
        var tween = game.add.tween(nameLabel);
        //change y position of label to 80 in 1000 ms
        tween.to({y:80},1000);
        //start the tween
        tween.start();

		//Show the score at the center of the screen

        var text = 'Score: ' + game.global.score + '\nBest Score: ' + localStorage.getItem('bestScore');
        
        var scoreLabel = game.add.text(game.width/2, game.height/2, text, {font:'25px Arial', fill:'#ffffff', align:'left'});



        
        //explain how to start the game
        
        var text;
        if(game.device.desktop){
            text = 'press SPACEBAR to start';
        } else {
            text = 'touch the screen to start';
        }
        
        //display the text variable
        
        var startLabel = game.add.text(game.width/2, game.height-80, text,{font:'25px Geo', fill: '#ffffff'});
        
       // var startLabel = game.add.text(game.width/2, game.height-80, 'press the SPACEBAR arrow key to start', {font: '25px Arial', fill:'#ffffff'});
        startLabel.anchor.setTo(0.5, 0.5);
        
        //add tween to the start label
        
        var tweenStartLabel = game.add.tween(startLabel);
        
        // rotate label to -2 degrees in 500ms
        tweenStartLabel.to({angle: -2}, 500);
        
        //rotate label to 2 degrees in 1000ms
        tweenStartLabel.to({angle: 2}, 1000);
        
        //finally, back to original position
        tweenStartLabel.to({angle: 0}, 500);
        
        //loop indefinitely the tween
        tweenStartLabel.loop();
        
        //start the tween
        tweenStartLabel.start();
        
        // create new Phaser keyboard variable
		// when pressed, call the start
        
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		upKey.onDown.add(this.start, this);
        
        //for touch events
        
        if(!game.device.desktop){
            game.input.onDown.add(this.start, this);
        }
        
        //if 'bestScore' is not defined
        //it means that this the first time game is played
        
        if(!localStorage.getItem('bestScore')){
            //then set the best score to 0
            localStorage.setItem('bestScore', 0);
        }
        
        //if the score is higher than the best score
        if(game.global.score > localStorage.getItem('bestScore')){
            //then update the best score
            localStorage.setItem('bestScore', game.global.score);
        }
      
        
      
        
        
	},
	start: function(){
        
        //prevent mute button to start the game
        //if we tap on the top left corner of the game in mobile
        
        if(!game.device.desktop && game.input.y < 50 && game.input.x < 60){
            //it means we want to mute the game, we dont wat to start the game
            return;
        }
		//start the actual game
		game.state.start('play');
	},
    
    toggleSound: function(){
        //switch the variable from true to false, or vice versa
        //when game.sound.mute = true, phaser will mute the game
        
        this.muteButton.frame = game.sound.mute ? 1 :  0;
    },
}