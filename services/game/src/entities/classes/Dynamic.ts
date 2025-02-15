import {
    DirectionsPermutationsAsRowColOffsets, Offset, RowCol, RowColOffsetsByDirection,
} from '@rogueworld/types';
import { getRandomElement, getRandomIntInclusive, tileDistanceBetween } from '@rogueworld/utils';
import Damage from '../../gameplay/Damage';
import Drop from '../../gameplay/Drop';
// import { FactionRelationshipStatuses, getFactionRelationship } from '../../gameplay/Factions';
import { ItemState } from '../../inventory';
import Entity, { EntityConfig } from './Entity';
import Player from './Player';

class Dynamic extends Entity {
    static serverOnly = true;

    /**
     * The other entity that this entity is trying to do something with.
     * i.e. mob to attack, item to pick up, object to interact with.
     */
    target?: Entity;

    /**
     * How often (in ms) this mob looks for a new position within the wander range to wander
     * towards.
     * Lower is more often.
     */
    static baseWanderRate?: number = undefined;

    wanderLoop?: NodeJS.Timeout;

    /**
     * How far this entity will wander the next time it does so. Somewhere between 1 tile, and it's
     * view range.
     * Changes each time it wanders, so it doesn't just move the same distance each time.
     */
    wanderTargetPosition?: RowCol;

    /**
     * How far away the target needs to be for this mob to start targeting it, and any further away
     * before this mob stops targeting it.
     * Also used for the max wander distance per wander.
     */
    static viewRange?: number = undefined;

    /**
     * How far away this entity can attack another entity from.
     */
    static baseAttackRange?: number = undefined;

    /**
     * An array of pickups that could be created when this mob is destroyed.
     */
    static dropList: Array<Drop> = [];

    attackRange?: number;

    constructor(config: EntityConfig) {
        super(config);

        const EntityType = this.constructor as typeof Dynamic;

        // Start the loops. Loops are disabled if their rate is 0.
        if (EntityType.baseMoveRate) {
            this.moveRate = EntityType.baseMoveRate;

            this.moveLoop = setTimeout(
                this.move.bind(this),
                this.moveRate + getRandomIntInclusive(0, this.moveRate),
            );
        }

        if (EntityType.baseWanderRate) {
            this.wanderLoop = setTimeout(
                this.wander.bind(this),
                EntityType.baseWanderRate + getRandomIntInclusive(0, EntityType.baseWanderRate),
            );
        }

        if (EntityType.baseAttackRange) {
            this.attackRange = EntityType.baseAttackRange;
        }
    }

    move() {
        if (!this.board) return false;

        if (this.moveLoop) {
            // Prevent multiple move loops from being created if this move function is called again.
            clearTimeout(this.moveLoop);
            this.moveLoop = setTimeout(this.move.bind(this), this.getMoveRate());
        }

        this.onMove();

        return true;
    }

    onMove() {
        if (this.target) {
            // If the target is out of view range, forget about them.
            if (!this.isEntityWithinViewRange(this.target)) {
                this.target = undefined;
                return;
            }
            // If they are on the same tile, try to move apart.
            if (this.row === this.target.row && this.col === this.target.col) {
                // Don't move if doing an action, or it will interrupt itself.
                if (this.actionTimeout) return;

                this.moveAwayFromCurrentTile();
                return;
            }

            // If the target is out of the attack range, move closer.
            if (!this.isEntityWithinAttackRange(this.target)) {
                const offset = RowColOffsetsByDirection[
                    this.getDirectionToPosition(this.target)
                ];

                // Check if there is a damaging tile in front.
                if (!this.checkForMoveHazards(offset.row, offset.col)) return;

                // Don't move if doing an action, or it will interrupt itself.
                if (this.actionTimeout) return;

                super.move(offset.row, offset.col);
            }
            // Target is within attack range, attack them.
            // Don't attempt to attack while they are already doing something.
            else if (!this.actionTimeout) {
                // Use one of their available actions.
                const EntityType = this.constructor as typeof Entity;
                if (!EntityType.actions) return;

                this.performAction(
                    getRandomElement(EntityType.actions),
                    this.target,
                );
            }
        }
        // No target, wander around.
        else if (this.wanderTargetPosition) {
            // If still too far away, move closer.
            if (tileDistanceBetween(this.wanderTargetPosition, this) > 1) {
                const offset = RowColOffsetsByDirection[
                    this.getDirectionToPosition(this.wanderTargetPosition)
                ];
                    // Check if there is a damaging tile in front.
                if (!this.checkForMoveHazards(offset.row, offset.col)) return;

                super.move(offset.row, offset.col);
            }
        }
    }

    /**
     * Move this entity away from the tile it is on. Tries each direction in a random order.
     */
    moveAwayFromCurrentTile() {
        if (!this.board) return;

        const { row, col } = this;
        const { grid } = this.board;

        // Get a randomised set of directions to try to move in.
        const randomDirectionOffsets = getRandomElement(
            DirectionsPermutationsAsRowColOffsets,
        );

        randomDirectionOffsets.some((offsets) => {
            // Check if any of the directions are not blocked.
            if (grid[row + offsets.row][col + offsets.col].isLowBlocked() === false) {
                super.move(offsets.row, offsets.col);
                return true;
            }
            return false;
        });
    }

    checkForMoveHazards(byRows: Offset, byCols: Offset) {
        // Check the grid row element being accessed is valid.
        if (!this.board?.grid[this.row + byRows]) return false;

        /** @type {BoardTile} */
        const boardTile = this.board.getTileAt(this.row + byRows, this.col + byCols);

        // Check the grid col element (the tile itself) being accessed is valid.
        if (!boardTile) return false;

        if (boardTile.groundType.hazardous) return false;

        return true;
    }

    /**
     * Find somewhere else for this mob to move to.
     * Changes to a random direction, and sets a random distance to travel.
     */
    wander() {
        const EntityType = this.constructor as typeof Dynamic;

        // Make sure the loop continues before doing anything else.
        this.wanderLoop = setTimeout(
            this.wander.bind(this),
            (EntityType.baseWanderRate || 10000)
            + getRandomIntInclusive(0, (EntityType.baseWanderRate || 10000)),
        );

        // Don't wander if a target is set.
        if (this.target) return;

        // Get a random position within their view range to use as their new wander target.
        const viewRange = EntityType.viewRange || 0;
        const rowOffset = getRandomIntInclusive(-viewRange, viewRange);
        const colOffset = getRandomIntInclusive(-viewRange, viewRange);

        this.wanderTargetPosition = { row: this.row + rowOffset, col: this.col + colOffset };
    }

    onDamage(damage: Damage, damagedBy?: Entity) {
        if (damagedBy instanceof Player) {
            this.target = damagedBy;
        }
        else if (damagedBy instanceof Entity) {
            // // Check the faction relationship for if to target the attacker or not.
            // // If damaged by a friendly mob, ignore the damage.
            // if (getFactionRelationship(
            //     this.faction,
            //     damagedBy.faction,
            // ) === FactionRelationshipStatuses.Friendly) {
            //     return;
            // }
            // // Damaged by a hostile or neutral mob, target it.

            // this.target = damagedBy;
        }

        // this.lastDamagedTime = Date.now();

        super.onDamage(damage, damagedBy);
    }

    onAllHitPointsLost() {
        if (this.board) {
            // Give all nearby players the glory value of this mob.
            const nearbyPlayers = this.board.getNearbyPlayers(this.row, this.col, 7);

            if (this.gloryValue) {
                for (let i = 0; i < nearbyPlayers.length; i += 1) {
                    nearbyPlayers[i].modGlory(+this.gloryValue);
                    // nearbyPlayers[i].tasks.progressTask(this.taskIdKilled);
                }
            }

            this.dropItems();
        }

        super.onAllHitPointsLost();
    }

    /**
     * Create some pickups for whatever this mob has dropped from its drop list.
     */
    dropItems() {
        const EntityType = this.constructor as typeof Dynamic;

        EntityType.dropList.forEach((dropConfig) => {
            if (!this.board) return;

            // Roll for this drop as many times as it is configured to.
            for (let roll = 0; roll < dropConfig.rolls; roll += 1) {
                // Do the roll.
                if (dropConfig.dropRate >= getRandomIntInclusive(1, 100)) {
                    // Create a new pickup which will be added to the board.
                    new dropConfig.PickupType({
                        row: this.row,
                        col: this.col,
                        board: this.board,
                        itemState: new ItemState({
                            ItemType: dropConfig.PickupType.ItemType,
                            quantity: dropConfig.quantity,
                        }),
                    }).emitToNearbyPlayers();
                }
            }
        });
    }

    /**
     * Is the entity within the view range of this entity, in any direction.
     */
    isEntityWithinViewRange(entity: Entity) {
        const EntityType = this.constructor as typeof Dynamic;
        if (Math.abs(this.col - entity.col) >= (EntityType.viewRange || 0)) return false;
        if (Math.abs(this.row - entity.row) >= (EntityType.viewRange || 0)) return false;
        return true;
    }

    isEntityWithinAttackRange(entity: Entity) {
        return tileDistanceBetween(this, entity) <= (this.attackRange || 0);
    }
}

export default Dynamic;
