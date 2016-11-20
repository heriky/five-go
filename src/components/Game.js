import React,{PropTypes, Component} from 'react' ;

import Board from './Board';
import Square from './Square';

import calcWinner,{deepCopy} from '../utils/gameUtil';
//import {onConnect, onReceived, sendMsg} from '../api/socket';
import io from 'socket.io-client' ;
var socket = io();

class Game extends Component{
  constructor(props){
    super(props) ;

    this.isFetching = false;
    this.handleClick = this.handleClick.bind(this);
    this.jumpTo = this.jumpTo.bind(this);

    const squares = [];
    for(var i=0; i<15; i++){
      squares.push(new Array(15).fill(null)); // 引用出错
    }

    this.state = {
      history: [{squares}],
      step:0,
      xIsNext: true,
      winner: null
    }
  }

  componentDidMount(){
    socket.on('message', msg=>{
      console.log('收到消息:', msg);
      this.isFetching = false;
      if (msg != null) {this.setState(msg);}
    });
  }


  handleClick(x,y){
    if (this.isFetching) { return ;}
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = deepCopy(current.squares); // 保持不可变

    // 游戏结束，或者当前位置有值，则跳过
    if (this.state.winner || squares[x][y]) { return; }

    // 更新状态，传递数据流
    squares[x][y] = this.state.xIsNext ? 'X': 'O';
    const winner = calcWinner(squares, x, y) || null;
    this.setState((prevState, props)=>{
      var newState = {
        history: [...history, {squares}],
        step: history.length,
        xIsNext: !prevState.xIsNext,
        winner: winner
      }
      // 服务器推送
      socket.emit('change_state', newState);
      this.isFetching = true;
      return newState;
    });
  }

  jumpTo(move){
    this.setState((prevState, props)=>{
      return {step: move}
    })
  }

  render(){
    const history = this.state.history ;
    const current = history[this.state.step];

    const winner = this.state.winner;
    let status; // 游戏状态
    if (winner) {
      status = 'Winner: '+ (this.state.winner)
    }else{
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move)=>{
      const desc = move ? 'Move #'+move : 'move start!' ;
      return (
        <li key = {move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    })

    const isFetching = this.isFetching ;
    return (
      <div className="game" style={{cursor: isFetching||winner? "not-allowed":"default"}}>
        <div className="game-board">
          <Board onClick={this.handleClick}  col={this.props.col} row={this.props.row} squares = {current.squares}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;