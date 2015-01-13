
var isCommunityReady = false,
    isGiver          = false,
    isTrading        = false,
    lastTraded       = '';

module.exports = function (stem) {

  stem.api.addHandler('stem', 'communityReady', function () {

    isCommunityReady = true;
    isGiver = (stem.config.initBot === stem.bot.steamID);

    // Wait for the `initBot` to send the trade first
    if (stem.config.initBot !== stem.bot.steamID)
      return;

    stem.log.info('Sending trade to', stem.config.initTradeBot);

    stem.bot.trade(stem.config.initTradeBot);

  });

  stem.api.addHandler('bot', 'tradeResult', function (tradeID, tradeResponse, steamID) {

    // Trade request was accepted
    if (!tradeResponse)
      return;

    // Trade request wasn't accepted, retry in a few seconds
    setTimeout(function () {

      stem.bot.trade(steamID);

    }, 3000);

  });

  stem.api.addHandler('bot', 'tradeProposed', function (tradeID, steamID) {

    // Deny trade if not yet logged into Steam community
    if (!isCommunityReady)
      return stem.bot.respondToTrade(tradeID, false);

    else if (isTrading)
      return stem.bot.respondToTrade(tradeID, false);

    stem.log.info('New trade proposed from', steamID);

    // Accept trade
    stem.bot.respondToTrade(tradeID, true);

  });

  stem.api.addHandler('bot', 'sessionStart', function (steamID) {

    lastTraded = steamID;
    isTrading = true;

    stem.log.info('Trade session started');

    // Open trade session
    stem.botTrade.open(steamID);

    if (!isGiver)
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

  });

  stem.api.addHandler('botTrade', 'offerChanged', function () {

    stem.log.info('Item added, readying up');

    stem.botTrade.ready(function () {

      stem.log.info('Ready');

    });

  });

  stem.api.addHandler('botTrade', 'end', function () {

    stem.log.info('Trade ended');

    isTrading = false;

    isGiver = !isGiver;

    if (!isGiver)
      return;

    stem.log.info('Trading', lastTraded);
    stem.bot.trade(lastTraded);

  });

  stem.api.addHandler('botTrade', 'ready', function () {

    stem.botTrade.ready(function () {

      stem.log.info('Ready');

      stem.botTrade.confirm(function () {

        stem.log.info('Confirmed trade');

      });

    });

  });

};
