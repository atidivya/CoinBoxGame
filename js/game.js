// initialize phaser

var game = new Phaser.Game(500, 340, Phaser.AUTO, '');

//define global variable

game.global = {
    score: 0
};

//add the states

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

//start the 'boot' state

game.state.start('boot');