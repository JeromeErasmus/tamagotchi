// We define a class for our critter here and set up some basic behaviours and properties.
let fs = require('fs');

class Thamagotchi {
  constructor(initName) {
    this._maxHealth = 50;
    this._maxFood = 30;
    this._maxHygene = 10;
    this._maxAttention = 15;
    this._name = initName;
    this._health = 0;
    this._food = this._maxFood;
    this._hygene = this._maxHygene;
    this._attention = this._maxHygene;
    this._foodInc = 2;
    this._hygeneInc = 1;
    this._attentionInc = 1;
    this._sleep = false;
    this._sleepDuration = 5000;
    this._maxAge = 16; // time in seconds
    this._maxAgeCount = 0;
    this._stages = [
      {label:'egg/infant', src:'src/assets/egg.txt', data: null},
      {label:'teen', src:'src/assets/teen.txt', data: null},
      {label:'adult', src:'src/assets/adult.txt', data: null},
      {label:'elderly', src:'src/assets/elderly.txt', data: null},
      {label:'dead', src:'src/assets/dead.txt', data: null}
    ];
    this._stageIndex = 0;

    this.loadAsciiAssets();
  }

  /**
   * Create a new critter.
   *
   * @param  none
   * @return Object
   */
  initNew() {
    this.health = this._maxHealth;
    this.food = this._maxFood;
    this.hygene = this._maxHygene;
    this.attention = this._maxAttention;
    this._maxAgeCount = 0;
    this._stageIndex = 0;
    
    return {
      success: true,
      messages: ["You created a new critter."]
    };
  }

  /**
   * Loads some Ascii art in from the assets folder 
   *
   * @param  none
   * @return Boolean
   */
  loadAsciiAssets() {
    this._stages.forEach(element => {
      if(element.src) {
        fs.readFile(element.src, 'utf8', (err,data) => {
          if (err) {
            // Lets handle this error here. If there is no file throw an error here
            if (err) throw err;
          }
          element.data = data;
        });
      }
    });
  }

  /**
   * This function is the game cycle that controls the smarts of the critter. 
   *
   * @param  none
   * @return Boolean
   */
  runCycle() {
    // if we hit a random number that is less than 50% we drop food
    if (this.food > 0 && Math.random() < 0.50) {
      this.food--;
    }

    let x = this.food + this.hygene;
    if (x < 30 && this.health >= 0) {
      this.health--;
      // console.log(`Bad diet / hygene. Health depleted to ${this.health}`);
    } else if (this.health < this._maxHealth) {
      this.health++;
    }

    // if we hit a random number that is less than 7% we sleep. 
    if (Math.random() < 0.07) {
      this.doSleep();
    }

    // if we hit a random number that is less than 50% we drop attention
    if (this.attention > 0 && Math.random() < 0.25) {
      this.attention--;
      if (this.attention <= 0 && this.health >= 0) {
        this.health--;
        // console.log(`No attention to critter. Health depleted to ${this.health}`);
      }
    }

    if(this._maxAgeCount < this._maxAge) {
      this.countdownTimer();
    } else {
      this.health = 0;
      console.log('critter died of old age.')
    }
    console.log(this._maxAgeCount, this._maxAge);
    console.log(this._stageIndex);

    return true;
  }

  /**
   * here we calculate the age based off a really simple countdown
   *
   * @param  none
   * @return Boolean
   */
  countdownTimer() {
    const unit = this._maxAge / (this._stages.length-1);
    if (this._maxAgeCount < (this._maxAge)) {
      this._maxAgeCount++;
      this._stageIndex = Math.floor(this._maxAgeCount / unit);
    }
    return true;
  }

  /**
   * check if our creature is alive. If yes then return false
   *
   * @param  none
   * @return Boolean
   */
  isAlive() {
    return this.health <= 0 ? false : true;
  }

  /**
   * check if our creature is sleeping. If yes then return false
   *
   * @param  none
   * @return Boolean
   */
  isSleeping() {
    return this.sleep <= 0 ? false : true;
  }

  /**
   * send the critter to sleep
   *
   * @param  none
   * @return Boolean
   */
  doSleep() {
    if (this.isAlive() && !this.isSleeping()) {
      this.sleep = true;
      const t = this._sleepDuration;
      let timerId = setTimeout(() => {
        this.sleep = false;
        clearTimeout(timerId);
      }, t)
    }
    return true;
  }

  /**
   * feed the critter
   *
   * @param  none
   * @return Object
   */
  doFeed() {
    let messages = [];
    if (this.isAlive() && !this.isSleeping()) {
      let result = this.incrementProperty(this.food, this._foodInc, this._maxFood, 'food');
      messages.push(result);

      // if we hit a random number that is less than 25% we perform a poop and reduce hygene. 
      if (Math.random() < 0.25) {
        if (this.hygene > 0) {
          this.hygene -= 2;
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

  /**
   * clean up after the critter
   *
   * @param  none
   * @return Object
   */
  doClean() {
    let messages = [];
    if (this.isAlive() && !this.isSleeping()) {
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

  /**
   * play with the critter
   *
   * @param  none
   * @return Object
   */
  doAttention() {
    let messages = [];
    if (this.isAlive() && !this.isSleeping()) {
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

  /**
   * increment a property value and create notification message
   *
   * @param  none
   * @return String
   */
  incrementProperty(prop, propInc, propMax, label) {
    let newProp = prop + propInc;
    if (newProp >= propMax) {
      newProp = propMax;
    }
    this[label] = newProp;
    return `${label} increased from ${prop} to ${newProp}`;
  }

  /**
   * get a status update of the critters properties
   *
   * @param  none
   * @return Object
   */
  getStatus() {
    let messages = [];
    if (this.isSleeping()) {
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
        maxAttention: this._maxAttention,
        age: this._stages[this._stageIndex],
      },
      messages: messages
    };
  }

  /**
   * Log server stats to console. 
   *
   * @param  none
   * @return Boolean
   */
  logStats() {
    console.log('-'.repeat(80));
    console.log('HEALTH: ', this.health, ' | food: ', this.food, ' | hygene: ', this.hygene);
    console.log('ATTENTION: ', this.attention);
    console.log('Action: ', this.sleep ? 'sleeping' : '-');
    return true;
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