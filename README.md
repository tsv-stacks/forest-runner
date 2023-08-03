<center>

![IntoTheForest](https://github.com/tsv-stacks/forest-runner/assets/113384739/b560ba7a-3481-439f-8ded-a36cbfe0cc0e)

</center>

## Table of Contents

1. [About](#about)
2. [Controls](#controls)
3. [Development](#development)
   - [My First Game](#my-first-game)
   - [My Second Game](#my-second-game)
   - [Into the Forest](#into-the-forest)
4. [Future Features](#future-features)
5. [Credit](#credits)
6. [Contact Me](#contact-me)
7. [License](#license)

## About

## Controls

![tut3](https://github.com/tsv-stacks/forest-runner/assets/113384739/e03d0afe-eb32-4357-99bb-f6158abbd63a)

Debug Mode can be trigged with the ';' button on keyboard

## Development

<center>

### _[My First Game](https://tsv-stacks.github.io/my-first-game/)_

</center>

I found a short tutorial that showed me how to create a basic version of the "dinosaur" Google Chrome game. The game was an endless runner, with oncoming blocks that I had to jump over. It was a simple game, but it was a proof of concept that games could be built with JavaScript.

<center>

![ezgif com-video-to-gif (2)](https://github.com/tsv-stacks/forest-runner/assets/113384739/8c356abb-b503-4f4f-8d9c-43f99734f247)

> The game can be started by clicking the `Start` button. Once the game starts, the character can be made to jump by pressing the `Space` key on your keyboard. The game ends if the character collides with the block.

</center>

<center>

### _[My Second Game](https://arcade-game-runner.netlify.app/)_

</center>

With this new confidence and knowledge, I began working on a more advanced and visually appealing game. I found a game development course online that helped me create this new game, which was built with vanilla JavaScript, CSS, HTML5, and the Canvas API.

I wanted to make this game feel unique and rather than copy someones code or code along I decided to use assets from itch.io (a platform for game developers to share and sell their artwork and game assets). Using these assets presented me with new challenges, as I had to understand the logic behind the code in order to make necessary amendments and add my own features, such as scores, game over, and restart.

Unfortunately, due to time constraints, I was not able to fully flesh out the game as much as I would have liked. There were multiple features and functionalities missing that would have made it a complete game.

![ezgif com-optimize (1)](https://github.com/tsv-stacks/forest-runner/assets/113384739/f953a4bd-9ac5-43eb-bc3f-f0ac230b3979)

> Jump over the incoming slime enemies by using the arrow keys on your keyboard to control the player. You have 3 lives and you lose a life every time you collide with an enemy. The game ends if the player loses all three lives. To restart the game after the game over, the player can press the Enter key.

<center>

### _[Into the Forest](https://into-the-forest.netlify.app/)_

</center>

I wanted to build on the success of my previous two games and take the lessons I learned from building a local cooperative [two-player fighting game](https://github.com/tsv-stacks/fighting-game) to create the game I had envisioned, but was unable to do so due to time constraints.

This game was built over a period of six weeks, building on everything I created in the second game. The player now has many more animations and movements, and there are more attacks, each with their own hitboxes and sound effects. Enemies now have more animations and do not just sit in an idle animation. They will attack the player or at least attempt to when the player is within a certain range. I have added an in-game guide, mute, pause, and reset buttons, all with UI sounds to provide audio feedback to players. To help with hitboxes and collisions, I created a debug mode that can be triggered with the semicolon `;` button. Spawning enemies is no longer random. At certain scores, the probability of enemies spawning is increased. These changes, along with many more tweaks and adjustments, I hope make this game more enjoyable and fun to play than the last.

## To Do

- [ ] way to chain attacks
- [x] attack on space bar key
- [x] air vs ground attack
- [x] slam attack
- [ ] roll (double-tap down button)
- [ ] walking with sword out animation
- [ ] getting up after slide animation priority
- [x] game start with character on idle
- [x] hit animation
- [x] enemy death animation
- [x] player death animation
- [x] randomise animations / movements for enemies
- [x] make enemies attack when in range
- [x] ground enemies attack once or have delay
- [x] sword attack sounds
- [x] slam attack sound
- [x] define hitboxes for player attacks
- [x] player attack detection
- [x] Game Over screen
- [x] game start screen
- [x] collision animation
- [x] change debug mode key binding
- [x] Find alternate way to add svg icons and use js to update dynamically
- [x] increase difficulty as score increases
- [x] Stop all hit detection and collision detection when player is dead
- [ ] Fixe restart button

## Future Features

- [x] Pause game toggle
- [ ] Game Over Screen Music
- [x] Mute button
- [x] UI Sounds
- [ ] Background music
- [ ] Better Enemy 'AI'

## Credits

- Artwork created by [Eder Muniz](https://edermunizz.itch.io/free-pixel-art-forest)
- Player Character created by [rvros](https://rvros.itch.io/animated-pixel-hero)
- Enemies created by [LuizMelo](https://luizmelo.itch.io/monsters-creatures-fantasy)
- UI Sounds created by [Ellr](https://ellr.itch.io/universal-ui-soundpack)
- Player Sounds created by [Darkworld Audio](https://darkworldaudio.itch.io/sound-effects-survival-i)

## Contact me

If you encounter any issues or bugs, or have any suggestions for improving this project, please feel free to contact me on [twitter](https://twitter.com/tsv_stacks).

You can also submit an issue on this repository to report any bugs or suggest new features. Please provide as much detail as possible, including any error messages and steps to reproduce the issue.

## License
