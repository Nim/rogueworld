import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);
  
        this.displayName.setText(dungeonz.getTextDef("Mob name: Sand scamp"));
    
        this.baseSprite.setScale(0.8);
    }

    // this.baseSprite.animations.add('u',    ['sand-scamp-up-1',      'sand-scamp-up-2',       'sand-scamp-up-1',       'sand-scamp-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('d',    ['sand-scamp-down-1',    'sand-scamp-down-2',     'sand-scamp-down-1',     'sand-scamp-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('l',    ['sand-scamp-left-1',    'sand-scamp-left-2',     'sand-scamp-left-1',     'sand-scamp-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('r',    ['sand-scamp-right-1',   'sand-scamp-right-2',    'sand-scamp-right-1',    'sand-scamp-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Entity.prototype.baseFrames = {
    u: 'sand-scamp-up-1',
    d: 'sand-scamp-down-1',
    l: 'sand-scamp-left-1',
    r: 'sand-scamp-right-1'
};

export default Entity;