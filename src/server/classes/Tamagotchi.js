// We define a class for our pet here and set up some basic behaviours and properties.
class Thamagotchi {
  constructor(initName) {
    this._name = initName;
    this._health = 0;
    this._food = 30;
    this._hygene = 10;
    this._attention = 30;
    this._maxHealth = 100;
    this._maxFood = 30;
    this._maxHygene = 10;
    this._maxSleep = 30;
    this._maxAttention = 30;
    this._foodInc = 2;
    this._hygeneInc = 1;
    this._attentionInc = 1;
    this._sleep = false;
    this._sleepDuration = 5000;
  }

  initNew() {
    this.health = 100;
    return {
      success: true,
      messages: ["You created a new critter."]
    };
  }

  // this function is the game cycle that controls the smarts of the critter. 
  runCycle() {
    // if we hit a random number that is less than 50% we drop food
    if(this.food > 0 && Math.random() < 0.75) {
      this.food --;
    }

    let x = this.food + this.hygene;
    if(x < 30 && this.health >= 0) {
      this.health --;
      console.log(`Bad diet / hygene. Health depleted to ${this.health}`);
    } else if(this.health < this._maxHealth) {
      this.health ++;
    }

    // if we hit a random number that is less than 10% we perform a poop and reduce hygene. 
    if(Math.random() < 0.1) {
      this.doSleep();
    }

    // if we hit a random number that is less than 50% we drop attention
    if(this.attention > 0 && Math.random() < 0.50) {
      this.attention --;
    }
  }
  
  // check if our creature has staved itself. If yes then return false
  isAlive() {
    return this.health <= 0 ? false : true;
  }
  
  // check if our creature has staved itself. If yes then return false
  isSleeping() {
    return this.sleep <= 0 ? false : true;
  }

  // send the critter to sleep
  doSleep() {
    if (this.isAlive() && !this.isSleeping()) {
      this.sleep = true;
      const t = this._sleepDuration;
      let timerId = setTimeout(() => {
        this.sleep = false;
        clearTimeout(timerId);
      }, t)
    }
  } 

  // feed the critter
  doFeed() {
    let messages = [];
    if (this.isAlive() && !this.isSleeping()) {
      let result = this.incrementProperty(this.food, this._foodInc, this._maxFood, 'food');
      messages.push(result);

      // if we hit a random number that is less than 25% we perform a poop and reduce hygene. 
      if(Math.random() < 0.25) {
        if(this.hygene > 0) {
          this.hygene --;
        }
        messages.push(`Your critter did a poop. Hygene depleted to ${this.hygene}`);
      }

      return { 
        success: true,
        messages: messages
      };
    } else {
      return {
        success: false,
        messages: messages
      };
    }
  }
 
  // clean up after the critter
  doClean() {
    let messages = [];
    if(this.isAlive() && !this.isSleeping()) {
      messages.push("✨  You cleaned up!");
      let result = this.incrementProperty(this.hygene, this._hygeneInc, this._maxHygene, 'hygene');
      messages.push(result);

      return { 
        success: true,
        messages: messages
      };
    } else {
      return {
        success: false,
        messages: messages
      };
    }
  }

  // play with the critter
  doAttention() {
    let messages = [];
    if(this.isAlive() && !this.isSleeping()) {
      let result = this.incrementProperty(this.attention, this._attentionInc, this._maxAttention, 'attention');
      messages.push(result);

      return { 
        success: true,
        messages: messages
      };
    } else {
      return {
        success: false,
        messages: messages
      };
    }
  }

  // increment a property value and create notification message
  incrementProperty(prop, propInc, propMax, label) {
    let newProp = prop + propInc;
      if(newProp >= propMax) {
        newProp = propMax;
      }
      this[label] = newProp;
      return `${label} increased from ${prop} to ${newProp}`;
  }

  // get a status update of the critters properties
  getStatus() {
    let messages = [];
    if(this.isSleeping()) {
      messages.push('ZZZ...Your critter is asleep. Hit refresh in a few seconds...');
    }

    return {
      isAlive: this.isAlive(),
      sleep: {
        status: this.sleep,
      },
      stats: {
        food: this.food, 
        maxFood: this._maxFood,
        hygene: this.hygene,
        maxHygene: this._maxHygene,
        health: this.health,
        maxHeath: this._maxHealth,
        attention: this.attention,
        maxAttention: this._maxAttention
      },
      messages: messages
    };
  }

  logStats() {
    console.log('--------------------------------------');
    console.log('HEALTH: ', this.health, ' | food: ', this.food, ' | hygene: ', this.hygene);
    console.log('ATTENTION: ', this.attention);
    console.log('Action: ', this.sleep ? 'sleeping' : '-');
  }

  // ----------------------------------------------
  // getters and setters
  // ----------------------------------------------
  get name() {
    return this._name;
  }

  set name(val) {
    this._name = val;
  }

  get health() {
    return this._health;
  }

  set health(val) {
    this._health = val;
  }

  get food() {
    return this._food;
  }

  set food(val) {
    this._food = val;
  }

  get hygene() {
    return this._hygene;
  }

  set hygene(val) {
    this._hygene = val;
  }

  get sleep() {
    return this._sleep;
  }

  set sleep(val) {
    this._sleep = val;
  }

  get attention() {
    return this._attention;
  }

  set attention(val) {
    this._attention = val;
  }
}
module.exports = Thamagotchi;