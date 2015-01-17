
/**
 * Dependencies
 */

var async = require('async'),
    _     = require('lodash');


/**
 * Internal names for cases, chests and crates
 * @type {Array}
 */
var INTERNAL_CRATE_NAMES = ['Supply Crate',
                            'TF_LockedCrate',
                            'CSGO_Type_WeaponCase',
                            'treasure_chest',
                            'retired_treasure_chest'];

module.exports = function (steamID) {

  var stem = this;

  stem.states.lastTraded = steamID;
  stem.states.isTrading = true;

  stem.log.info('Trade session started');

  // Open trade session
  stem.botTrade.open(steamID);

  if (!stem.states.isGiver)
    return;

  // Load inventories
  async.parallel(stem.states.invsToLoad, function (err, inventories) {

    // An inventory failed to load
    if (err) {

      stem.log.error('Failed to load inventory, cancelling trade. (%s)', err.message);
      return stem.botTrade.cancel(function () {

        stem.states.isTrading = false;
        stem.states.isGiver = !stem.states.isGiver;

      });

    }

    /**
     * Flattened inventory of valid items that we can use to trade.
     * @type {Array}
     */
    var inventory = _.flatten(inventories).filter(function (item) {

      // Only return crates if required
      if (stem.config.cratesOnly) {

        /**
         * Is this item a crate, chest, or a case.
         * @type {Boolean}
         */
        var isCrate = item.tags.some(function (itemTag) {

          return (~INTERNAL_CRATE_NAMES.indexOf(itemTag.internal_name));

        });

        return (item.tradable && isCrate);

      }

      /**
       * Is this a strange item
       * @type {Boolean}
       */
      var isItemStrange = item.tags.some(function (itemTag) {

        return (itemTag.internal_name === 'strange');

      });

      return (item.tradable && !isItemStrange);

    });

    // No tradable items found
    if (!inventory.length) {

      stem.log.warn('No tradable items found, cancelling trade.');
      return stem.botTrade.cancel(function () {

        stem.states.isTrading = false;
        stem.states.isGiver = !stem.states.isGiver;

      });

    }

    stem.botTrade.addItem(inventory[0], function () {

      stem.log.info('Added item', inventory[0].market_hash_name);

      setTimeout(function () {

        stem.botTrade.ready();

      }, 3000);

    });

  });

};
