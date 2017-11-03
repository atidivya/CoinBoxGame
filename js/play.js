//we create our only state called mainstate
var playState = {
    

    create:function(){
        //this function is called after preload function
        //here we set up the game, display sprites etc

        //set background color

       // game.stage.backgroundColor = '#3498db';

        //usage of pixel art
       // game.physics.startSystem(Phaser.Physics.ARCADE);
       // game.renderer.renderSession.roundPixels = true;

        this.cursor = game.input.keyboard.createCursorKeys();
        
        this.wasd = {
          up: game.input.keyboard.addKey(Phaser.Keyboard.W),
          left:game.input.keyboard.addKey(Phaser.Keyboard.A),
          right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        //display the player

        this.player = game.add.sprite(game.width/2, game.height/2, 'player');
        //anchor player
        this.player.anchor.setTo(0.5, 0.5);
        //add gravity using ARCADE physics
        game.physics.arcade.enable(this.player);
        //add vertical gravity to the player
        this.player.body.gravity.y = 500;
        //control the player
        
        //create right animation by looping the frames 1 and 2
        
        this.player.animations.add('right', [1,2], 8, true);
        
        //create the left animation by looping the frames 3 and 4
        
        this.player.animations.add('left', [3,4], 8, true);


        this.createWorld();

        //display the coin

        this.coin = game.add.sprite(60, 140, 'coin');

        //add arcade physics to the coin

        game.physics.arcade.enable(this.coin);

        //set the anchor point to the center
        this.coin.anchor.setTo(0.5, 0.5);

        //display the score

        this.scoreLabel = game.add.text(30, 30, 'score: 0', {font: '18px Arial', fill:'#ffffff'});

        // initialize the score variable

        game.global.score = 0;

        //enemies

            
        this.enemies = game.add.group();
        this.enemies.enableBody = true;

        //create atleast 10 enemies

        this.enemies.createMultiple(10, 'enemy');

        //add enemies every 2.2 seconds

       // game.time.events.loop(2200, this.addEnemy, this);
        this.nextEnemy = 0;
        //add the sounds

        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead');
        
        //create the emitter with 15 particles. we dont need to set the x and y
        //since we do not know where to do the explosion yet
        
        this.emitter = game.add.emitter(0, 0, 15);
        
        //set the 'pixel' image for the particles
        
        this.emitter.makeParticles('pixel');
        
        //set the x and y speed of the particles between -150 and 150
        //speed will be randomly picked between -150 and 150 for each particle
        
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        
        //scale the particles from 2 time their size to 0 in 800ms
        //parameters are: startX, endX, startY, endY, duration
        this.emitter.setScale(2, 0, 2, 0, 800);
        
        //use no gravity
        
        this.emitter.gravity = 0;
        
        //activate mobile inputes
        
        if(!game.device.desktop){
            
            //create an empty label to write the error message
            this.rotateLabel = game.add.text(game.width/2, game.height/2, '', {font: '30px Geo', fill:'#fff', backgroundColor:'#000'});
            this.rotateLabel.anchor.setTo(0.5, 0.5);
            
            //call the orientation change when the device is rotated
            game.scale.onOrientationChange.add(this.orientationChange, this);
            
            //call the function atleast onece
            
            this.orientationChange();
            
            //add mobile inputs
            
            this.addMobileInputs();
        }

    },
    update: function(){
        //this function will be called 60 times per second
        //it contains the game logic

        game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        //if the 'nextEnemy' time has passed
        if(this.nextEnemy < game.time.now){
            //define our variables
            var start = 4000;
            var end = 1000;
            var score = 100;
            
            //formula to decrease the delay between enemies over time
            //at first time its 4000ms, then slowly goes to 1000ms
            
            var delay = Math.max(
                start -(start - end) * game.global.score/score, end);
            
            //we add a new enemy
            this.addEnemy();
            
            //and we update 'nextEnemy' to have a new enemy in 2.2 seconds
            this.nextEnemy = game.time.now + delay;
            
        }
        //make the enemies and walls collide
        game.physics.arcade.collide(this.enemies, this.walls);
        //call player die function when player and enemy overlap
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        this.movePlayer();

        if(!this.player.inWorld){
            this.playerDie();
        }
        
        //if the player is dead, do nothing
        
        if(!this.player.alive){
            return;
        }

        //action when player takes the coin

       
    },
            movePlayer: function(){
                
                //if 0 finger are touching the screen
                
                if(game.input.totalActivePointers == 0){
                    //make sure the player is not moving
                    
                    this.moveLeft = false;
                    this.moveRight = false;
                }


            //if the left arrow key is pressed
            if(this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft){
                //move the player to the left
                //the velocity ois the pixels per second
                this.player.body.velocity.x = -200;
                //left animation
                this.player.animations.play('left');
            }

            //if the right arrow key is pressed
            else if(this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight){
                this.player.body.velocity.x = 200;
                //right animation
                this.player.animations.play('right');
            }

            // if neither key is oressed

            else {
                this.player.body.velocity.x = 0;
                this.player.animations.stop();
                this.player.frame = 0;
            }

            //if the up arrow key is pressed and the player is at the ground
            if(this.cursor.up.isDown || this.wasd.up.isDown){
                
                this.jumpPlayer();
                // jump the player
               // this.player.body.velocity.y = -320;
               // this.jumpSound.play();
            }


            
        },

        createWorld: function(){
            //create group with ARCADE physics
            this.walls = game.add.group();
            this.walls.enableBody = true;

            //create 10 walls in the group
            game.add.sprite(0, 0, 'wallV', 0, this.walls); //left side
            game.add.sprite(480, 0, 'wallV', 0, this.walls); //right side

            game.add.sprite(0, 0, 'wallH', 0, this.walls); //top left
            game.add.sprite(300, 0, 'wallH', 0, this.walls); //top right
            game.add.sprite(0, 320, 'wallH', 0, this.walls); //bottom left
            game.add.sprite(300, 320, 'wallH', 0, this.walls); //bottom right

            game.add.sprite(-100, 160, 'wallH', 0, this.walls); //middle left
            game.add.sprite(400, 160, 'wallH', 0, this.walls); //middle right

            var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
            middleTop.scale.setTo(1.5, 1);

            var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
            middleBottom.scale.setTo(1.5, 1);

            //set the walls un-movable

            this.walls.setAll('body.immovable', true);

        },

        playerDie: function(){
            
            //kill the player to make it disappear from the screen
            
            this.player.kill();
            
            //start the sound and the particles
            this.deadSound.play();
         
            
            //set the position of the emitter on the top of the player
            
            this.emitter.x = this.player.x;
            this.emitter.y = this.player.y;
            
            //start the emitter by exploding 15 particles that will live 800ms
            this.emitter.start(true, 800, null, 15);
            
            //call the 'startMenu' function in 1000ms
            game.time.events.add(1000, this.startMenu, this);
            
               
            //flash the color white for 300ms
            
            //game.camera.shake(0.02, 300);
          
        },

        //take coin function

        takeCoin: function(player, coin){
            //disappear the coin when touched by player

            //this.coin.kill();

            //increase the score

            game.global.score += 5;

            //update the score label

            this.scoreLabel.text = 'score: ' + game.global.score;

            //change coin position
            this.updateCoinPosition();

            //sound

            this.coinSound.play();

            //scale the coin to 0 to make it invisible
            this.coin.scale.setTo(0,0);

            //grow the coin back to original scale in 300ms

            game.add.tween(this.coin.scale).to({x:1,y:1}, 300).start();
        },

        updateCoinPosition: function(){

            //store possible coin position in an array

            var coinPosition = [
                {x:140, y:60}, {x:360, y:60}, //top row
                {x:60, y:140}, {x:440, y:140}, //middle row
                {x:130, y:300}, {x:370, y:300}, //bottp, row
            ];


            //remove the current position from the array
            for(var i = 0; i<coinPosition.length; i++){
                if(coinPosition[i].x == this.coin.x){
                    coinPosition.splice(i, 1);
                }
            }

            //set random position of the coin
            var newPosition = game.rnd.pick(coinPosition);

            //set the new position of the coin

            this.coin.reset(newPosition.x, newPosition.y);
        },

        addEnemy: function(){
            //get the first dead enemy from the group
            var enemy = this.enemies.getFirstDead();

            //if there is no dead enemy, do nothing

            if(!enemy){
                return;
            }

            //initialize the enemy

            enemy.anchor.setTo(0.5, 1);
            enemy.reset(game.width/2, 0);
            enemy.body.gravity.y = 500;
            enemy.body.velocity.x = 100 * game.rnd.pick([-1,1]);
            enemy.body.bounce.x = 1;
            enemy.checkWorldBounds = true;
            enemy.outOfBoundsKill = true;

        },
        startMenu: function(){
            game.state.start('menu');  
        },
    addMobileInputs: function(){
        
        //add jump button
        
        var jumpButton = game.add.sprite(350, 240, 'jumpButton');
        jumpButton.inputEnabled = true;
        jumpButton.alpha = 0.5;
        //call 'jumpPlayer' when the 'jumpButton' is pressed
        jumpButton.events.onInputDown.add(this.jumpPlayer, this);
        
        
        //movement variables
        
        this.moveLeft = false;
        this.moveRight = false;
        
        //add move left button
        
        var leftButton = game.add.sprite(50, 240, 'leftButton');
        leftButton.inputeEnabled = true;
        leftButton.alpha = 0.5;
        leftButton.events.onInputOver.add(this.setLeftTrue, this);
        leftButton.events.onInputOut.add(this.setLeftFalse, this);
        leftButton.events.onInputDown.add(this.setLeftTrue, this);
        leftButton.events.onInputUp.add(this.setLeftFalse, this);
        
        //add move right button
        
        var rightButton = game.add.sprite(130, 240, 'rightButton');
        rightButton.inputeEnabled = true;
        rightButton.alpha = 0.5;
        rightButton.events.onInputOver.add(this.setRightTrue, this);
        rightButton.events.onInputOut.add(this.setRightFalse, this);
        rightButton.events.onInputDown.add(this.setRightTrue, this);
        rightButton.events.onInputUp.add(this.setRightFalse, this);
    },
    
    //set basic functions that are used in our callbacks
    
    setLeftTrue: function(){
        this.moveLeft = true;
    },
    setLeftFalse: function(){
      this.moveLeft = false;  
    },
    setRightTrue: function(){
      this.moveRight = true;  
    },
    setRightFalse: function(){
      this.moveRight = false;  
    },
    
    jumpPlayer: function(){
        //if the player is touching the ground
        
        if(this.player.body.touching.down){
            //jump with sound
            this.player.body.velocity.y = -320;
            this.jumpSound.play();
        }
    },
    orientationChange: function(){
      //if the game is in potrait
        if(game.scale.isPortrait){
            //pause the game and add a text explanation
            game.paused = true;
            this.rotateLabel.text = 'rotate your device in landscape';
        }
        
        //if the game is in landscape
        else {
            //resume the game and remove the text
            game.paused = false;
            this.rotateLabel.text = '';
        }
    },

};

//initialize phaser

