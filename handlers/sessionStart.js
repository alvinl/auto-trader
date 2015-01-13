
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
    if (!inventory)
      return stem.botTrade.cancel();

    inventory = inventory.filter(function (item) {

      return item.tradable;

    });

    stem.botTrade.addItem(inventory[0], function () {

      stem.log.info('Added item', inventory[0].market_hash_name);

      setTimeout(function () {

        stem.botTrade.ready();

      }, 3000);

    });

  });

};
