
var validItemNames = ['Scrap Metal',
                      'Refined Metal',
                      'Reclaimed Metal'];

module.exports = function (steamID) {

  var stem = this;

  stem.states.lastTraded = steamID;
  stem.states.isTrading = true;

  stem.log.info('Trade session started');

  // Open trade session
  stem.botTrade.open(steamID);

  if (!stem.states.isGiver)
    return;

  // Load TF2 inventory
  stem.botTrade.loadInventory(440, 2, function (inventory) {

    // Inventory failed to load
    if (!inventory) {

      stem.log.error('Failed to load inventory, cancelling trade');
      return stem.botTrade.cancel(function () {

        stem.states.isTrading = false;
        stem.states.isGiver = !stem.states.isGiver;

      });

    }

    inventory = inventory.filter(function (item) {

      // Only return metals if required
      if (stem.config.metalsOnly)
        return (item.tradable && ~validItemNames.indexOf(item.market_hash_name));

      /**
       * Is this a strange item
       * @type {Boolean}
       */
      var isStrange = item.tags.some(function (itemTag) {

        return (itemTag.internal_name === 'strange');

      });

      return (item.tradable && !isStrange);

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
