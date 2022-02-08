import Entity from './classes/Entity';

/**
 * A list of all abstract entity types. These won't be available in any other list.
 */
const ABSTRACT_CLASSES: { [name: string]: typeof Entity } = {};

/**
 * The list of entity types, by their unique class name. i.e. "Goblin".
 */
const BY_NAME: { [name: string]: typeof Entity } = {};

export default {
    ABSTRACT_CLASSES,
    BY_NAME,
};
