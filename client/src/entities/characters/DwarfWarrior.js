import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Dwarf warrior"));
    }

    // this.baseSprite.animations.add('u', ['dwarf-warrior-up-1', 'dwarf-warrior-up-2', 'dwarf-warrior-up-1', 'dwarf-warrior-up-3'], 10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('d', ['dwarf-warrior-down-1', 'dwarf-warrior-down-2', 'dwarf-warrior-down-1', 'dwarf-warrior-down-3'], 10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('l', ['dwarf-warrior-left-1', 'dwarf-warrior-left-2', 'dwarf-warrior-left-1', 'dwarf-warrior-left-3'], 10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('r', ['dwarf-warrior-right-1', 'dwarf-warrior-right-2', 'dwarf-warrior-right-1', 'dwarf-warrior-right-3'], 10).onComplete.add(this.moveAnimCompleted, this);
};

Entity.prototype.baseFrames = {
    u: 'dwarf-warrior-up-1',
    d: 'dwarf-warrior-down-1',
    l: 'dwarf-warrior-left-1',
    r: 'dwarf-warrior-right-1'
};

export default Entity;