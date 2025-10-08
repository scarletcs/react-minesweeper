# React Minesweeper

This is a little minesweeper built in React so I could experiment with reducers.

This game works as an 8x8 grid with 12 mines. You can configure the size in code, but not in the client yet.

## How to play

- Click any tile to start the game. Mines get generated as of your first click, and can never appear in the tile you clicked or the tiles adjacent to it.
- Revealed tiles will show you how many mines are adjacent to that tile (vertically, horizontally, or diagonally). Your job is to reveal every tile that _isn't_ a mine.
- Right click to plant or remove flags. Plant flags where there's mines to keep that square untouched.
- If a numbered square has an equal number of flags adjacent to it, you can click that number to do a “force reveal” of tiles adjacent to it that you're sure are safe. (You did plant the flags in the right spot, didn't you?)

## What I liked about making this

I made this because I wanted to experiment with these things in particular:

- Properly initialise a game. I wanted to handle this efficiently, and not break any React rules in the process of handling randomness.
- Implement flood fill — both flood filling from an empty square, and from a numbered square. I wanted to work this algorithm out myself and it worked!
- Implement my own `useReducer()`. I could've just used React Redux, but not every app should push everything up to the global state, so sometimes you need local reducers. I wanted to experiment with writing my own.

## Todo list

Stuff I could still get done and might get done one day:

- Implement different game difficulties — easy, meidum, hard, custom.
- Track high scores, with fastest game completion times recorded for each difficulty.
- Add mobile support.
- Add fancy icons.
- Add an Undo button. Currently there's action history in order to be able to replay to any state in the game (like one action prior).
- Add multiple themes. The game's configured by CSS variables, so we just need different themes that override them.
