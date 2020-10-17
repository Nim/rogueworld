import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Gnarl"));
    
        // this.baseSprite.animations.add('u',    ['gnarl-oak-up-1',     'gnarl-oak-up-2'],    2, true);
        // this.baseSprite.animations.add('d',    ['gnarl-oak-down-1',   'gnarl-oak-down-2'],  2, true);
        // this.baseSprite.animations.add('l',    ['gnarl-oak-left-1',   'gnarl-oak-left-2'],  2, true);
        // this.baseSprite.animations.add('r',    ['gnarl-oak-right-1',  'gnarl-oak-right-2'], 2, true);
    
        // this.baseSprite.animations.play(this.direction);
    }

};

Entity.prototype.baseFrames = {
    u: 'gnarl-oak-up-1',
    d: 'gnarl-oak-down-1',
    l: 'gnarl-oak-left-1',
    r: 'gnarl-oak-right-1'
};

export default Entity;