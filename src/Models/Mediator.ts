import Player from './Player'
import Place from './Place'
import PlayAction from '../Actions/PlayAction'

export default class Mediator {

  private _currentPlayer : Player
  private player1 : Player
  private player2 : Player
  private socoreElement : HTMLElement

  constructor (pl1 : Player, pl2 : Player) {
    this._currentPlayer = pl1
    this.player1 = pl1
    this.player2 = pl2
    this.createDOMElement()
    this.formatScoreElement()
  }

  /* Getters and Setters */

  get element () : HTMLElement {
    return this.socoreElement
  }

  get currentPlayer () {
    return this._currentPlayer
  }

  /* Methods */

  public play (from : Place, to : Place, board : Place[][]) : boolean {
    let play = new PlayAction(from, to, board)
    if (!this.canPlay(play)) return false
    return this.performPlay(play)
  }

  private canPlay (play : PlayAction) : boolean {
    let { to, from } = play
    return to.isEmpty() ||
            this.isCurrentPlayer(to.piece.player) ||
            play.isEatingAnEnemyPiece()
  }

  private performPlay (play : PlayAction) : boolean {
    let isAdvancingPlace = play.isAdvancingPlace()
    let isPlaySuccess = play.performPlay()

    if(isPlaySuccess && isAdvancingPlace) {
      this.alternateBetweenPlayers()
    }

    return isPlaySuccess
  }

  public isCurrentPlayer (player : Player) {
   return this._currentPlayer === player
  }

  public alternateBetweenPlayers () : Player {
    this.changePlayer()
    this.formatScoreElement()
    return this.currentPlayer
  }

  private changePlayer () : void {
    if (this.isCurrentPlayer(this.player1)) {
      this._currentPlayer  = this.player2
    } else {
      this._currentPlayer  = this.player1
    }
  }

  private createDOMElement () : void {
    this.socoreElement = document.createElement('p')
    this.socoreElement.classList.add('checkers-score')
  }

  private formatScoreElement () : void {
    let littlePiece = this.getLittlePiceElement()
    this.socoreElement.innerHTML = 'É a vez do jogador '
    this.socoreElement.appendChild(littlePiece)
  }

  private getLittlePiceElement () : HTMLElement {
    var littlePiece = document.createElement('span')
    littlePiece.classList.add('little-piece')
    littlePiece.style.backgroundColor = this.currentPlayer.color
    return littlePiece
  }

}