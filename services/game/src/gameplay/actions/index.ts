import DamageTypes from '../DamageTypes';
import { Burn, Poison } from '../status_effects';
import Action from './Action';
import ActionsList from './ActionsList';
import addAction from './AddAction';
import applyStatusEffect from './generic/ApplyStatusEffect';
import basicAttack from './generic/BasicAttack';
import './items';

addAction('punch', 1000, basicAttack, { amount: 10, types: [DamageTypes.Physical], penetration: 0 });
addAction('bite', 2000, basicAttack, { amount: 7, types: [DamageTypes.Physical], penetration: 50 });
addAction('iron-sword', 2000, basicAttack, { amount: 7, types: [DamageTypes.Physical] });
addAction('iron-spear', 2000, basicAttack, { amount: 5, types: [DamageTypes.Physical], penetration: 50 });
addAction('spit-venom', 2000, applyStatusEffect, { StatusEffect: Poison });
addAction('fireball', 2000, applyStatusEffect, { StatusEffect: Burn });

export {
    Action,
    ActionsList,
    addAction,
};
