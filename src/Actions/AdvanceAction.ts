import PlayAction from './PlayAction'
import Place from '../Models/Place'
import { Action } from './Action'
import { isAdvancingPlace } from './Helpers'

export default class AdvanceAction {

  private from : Place
  private to : Place

  constructor (from : Place, to : Place) {
    this.from = from
    this.to = to
  }

  /* Methods */

  public canPerform () : boolean {
    return isAdvancingPlace(this.from, this.to)
  }

  public perform () : boolean {
    let { from, to } = this
    let piece = from.piece
    to.selected = false
    from.selected = false
    from.piece = null
    to.piece = piece
    return true
  }

}
