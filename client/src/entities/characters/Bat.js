import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config) {
        super(x, y, config);

        this.baseSprite.setScale(1);
    
        this.displayName.setText(dungeonz.getTextDef("Mob name: Bat"));
    
        // this.baseSprite.animations.add('u',    ['bat-up-1',     'bat-up-2',     'bat-up-3'],    5, true);
        // this.baseSprite.animations.add('d',    ['bat-down-1',   'bat-down-2',   'bat-down-3'],  5, true);
        // this.baseSprite.animations.add('l',    ['bat-left-1',   'bat-left-2',   'bat-left-3'],  5, true);
        // this.baseSprite.animations.add('r',    ['bat-right-1',  'bat-right-2',  'bat-right-3'], 5, true);
    
        // this.baseSprite.animations.play(this.direction);
    }
};


Entity.prototype.baseFrames = {
    u: 'bat-up-1',
    d: 'bat-down-1',
    l: 'bat-left-1',
    r: 'bat-right-1'
};

export default Entity;