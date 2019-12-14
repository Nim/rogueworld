
const Utils = {
    /**
     * Gets a random number between, and including, min and max.
     * @param {Number} min
     * @param {Number} max
     * @returns {*}
     */
    getRandomIntInclusive: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Gets a random element from the given array.
     * @param {Array} array
     * @returns {*}
     */
    getRandomElement: function (array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * @param {Array} array
     * @param {String} nameKey - The name of each propety key on the result object.
     * @param {String} valueKey - The name of the property to use as each propety value.
     */
    arrayToObject: (array, nameKey, valueKey) => {
        return array.reduce((obj, item) => {
            obj[item[nameKey]] = item[valueKey];
            return obj;
        }, {});
    },

    /**
     * Prints a warning message.
     * @param {*} message
     */
    warning: function (message) {
        console.log("* WARNING: " + message);
    },

    /**
     * Stops the process and prints an error message.
     * @param {*} message
     */
    error: function (message) {
        console.error("* ERROR: " + message);
        console.trace();
        process.exit();
    }

};

module.exports = Utils;