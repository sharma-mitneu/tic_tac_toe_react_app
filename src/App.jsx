import { useState } from "react"
import GameBoard from "./components/GameBoard"
import Player from "./components/Player"
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const PLAYERS = {
  O: 'Player 2',
  X: 'Player 1'
}

const INITIAL_GAME_BOARD = [
  [null, null, null], 
  [null, null, null], 
  [null, null, null]
]

function deriveActivePlayer(gameTurns){
  let currPlayer = 'X'
  if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
    currPlayer = 'O'
  }
  return currPlayer;
}

function deriveGameBoard(gameTurns){

  let gameBoard = [...INITIAL_GAME_BOARD.map(arr => [...arr])];
    
  for(const turn of gameTurns){
      const {square, player} = turn;
      const {row, col} = square;

      gameBoard[row][col] = player;
  }

  return gameBoard;

}

function deriveWinner(gameBoard, player){

  let winner;

  for(const combinations of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameBoard[combinations[0].row][combinations[0].column];
    const secondSquareSymbol = gameBoard[combinations[1].row][combinations[1].column];
    const thirdSquareSymbol = gameBoard[combinations[2].row][combinations[2].column];

    if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol){
      winner = player[firstSquareSymbol];
    }
  }

  return winner;

}

function App() {

  const[player, setPlayer] = useState(PLAYERS);

  const[gameTurns, setGameTurns] = useState([]);
  // const [activePlayer, setActivePlayer] = useState('X');


  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, player);
  const hasDraw = gameTurns.length === 9 && !winner;


  function handleSelectSquare(rowIndex, colIndex){
    // setActivePlayer((curActivePlayer) => curActivePlayer === 'X' ? 'O' : 'X');
    setGameTurns((prevTurns) => {
      // let currPlayer = 'X'

      // if(prevTurns.length > 0 && prevTurns[0].player === 'X'){
      //   currPlayer = 'O'
      // }

      const currPlayer = deriveActivePlayer(gameTurns);

      const updatedTurns = [{ 
        square: {row: rowIndex, col: colIndex},
        player: currPlayer
      },...prevTurns]

      console.log(updatedTurns);
      return updatedTurns;
    });
  }

  function handleRestart(){
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName){
    setPlayer(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      };
    });
  }

  return (
   <main>
    <div id="game-container">
      <ol id="players" className="highlight-player">
        <Player initialName={PLAYERS.X} symbol="X" isActive={activePlayer === 'X'} onChangeName ={handlePlayerNameChange} />
        <Player initialName={PLAYERS.O} symbol="O" isActive={activePlayer === 'O'} onChangeName ={handlePlayerNameChange}/>
      </ol>
      {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
      <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard}/>
    </div>
    <Log turns={gameTurns} />
   </main>
  )
}

export default App
