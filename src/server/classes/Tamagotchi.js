// We define a class for our pet here and set up some basic behaviours and properties.
class Thamagotchi {
  constructor(initName) {
    this._name = initName;
    this._health = 100;
    this._food = 30;
    this._sleep = 30;
    this._hygene = 10;
    this._attention = 30;
    this._maxHealth = 100;
    this._maxFood = 30;
    this._maxHygene = 10;
    this._maxSleep = 30;
    this._maxAttention = 30;
    this._foodInc = 2;
  }

}
module.exports = Thamagotchi;