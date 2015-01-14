
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
      return stem.botTrade.cancel();

    }

    inventory = inventory.filter(function (item) {

      return item.tradable;

    });

    // No tradable items found
    if (!inventory.length) {

      stem.log.warn('No tradable items found, cancelling trade.');
      return stem.botTrade.cancel();

    }

    stem.botTrade.addItem(inventory[0], function () {

      stem.log.info('Added item', inventory[0].market_hash_name);

      setTimeout(function () {

        stem.botTrade.ready();

      }, 3000);

    });

  });

};
