
module.exports = function (stem) {

  /**
   * Validate config
   */

  if (!stem.config.hasOwnProperty('initBot'))
    throw new Error('Missing initBot property in config.');

  else if (!stem.config.hasOwnProperty('initTradeBot'))
    throw new Error('Missing initTradeBot property in config.');

  else if (!stem.config.hasOwnProperty('inventories'))
    throw new Error('Missing inventories property in config.');

  else if (!stem.config.inventories.length)
    throw new Error('Inventories property should have at least 1 inventory specified.');

  /**
   * Set default states
   */

  stem.states.isCommunityReady = false;
  stem.states.isAdminNotified = false;
  stem.states.isTrading = false;
  stem.states.isGiver = false;
  stem.states.lastTraded = '';

  stem.states.startupTime = Date.now();
  stem.states.prevTradesPerMin = 0;
  stem.states.tradesCompleted = 0;
  stem.states.tradesPerMin = 0;

  /**
   * Inventory codes assigned to their app and context id's
   * @type {Object}
   */
  var inventoryCodes ={

    'TF2':   '440:2',
    'CS:GO': '730:2',
    'DOTA2': '570:2'

  };

  stem.states.invsToLoad = [];

  // Setup async tasks to load inventories
  stem.config.inventories.forEach(function (inventoryCode) {

    inventoryCode = inventoryCode.toUpperCase();

    // Invalid inventory code
    if (!inventoryCodes.hasOwnProperty(inventoryCode))
      return stem.log.error('Invalid inventory:', inventoryCode);

    stem.states.invsToLoad.push(function (cb) {

      var loadInvOpts = {

        appId:     inventoryCodes[inventoryCode].split(':')[0],
        contextId: inventoryCodes[inventoryCode].split(':')[1]

      };

      // Load inventory
      stem.botOffers.loadMyInventory(loadInvOpts, cb);

    });

  });

  // No valid inventories
  if (!stem.states.invsToLoad.length)
    throw new Error('Inventories property should have at least 1 valid inventory specified.');

  // Setup a trade whitelist
  stem.states.tradeWhitelist = [];

  stem.states.tradeWhitelist.push(stem.config.initBot);
  stem.states.tradeWhitelist.push(stem.config.initTradeBot);

  stem.tpmInterval = setInterval(function () {

    stem.states.prevTradesPerMin = stem.states.tradesPerMin;
    stem.states.tradesPerMin = 0;

    stem.log.info('Trades per minute:', stem.states.prevTradesPerMin);

  }, 60000);

  /**
   * Register handlers
   */

  stem.api.addHandler('stem', 'communityReady', require('./handlers/communityReady'));

  stem.api.addHandler('botTrade', 'offerChanged', require('./handlers/offerChanged'));

  stem.api.addHandler('bot', 'tradeProposed', require('./handlers/tradeProposed'));

  stem.api.addHandler('bot', 'sessionStart', require('./handlers/sessionStart'));

  stem.api.addHandler('bot', 'tradeResult', require('./handlers/tradeResult'));

  stem.api.addHandler('botTrade', 'error', require('./handlers/tradeError'));

  stem.api.addHandler('botTrade', 'ready', require('./handlers/ready'));

  stem.api.addHandler('botTrade', 'end', require('./handlers/end'));

  /**
   * Register commands
   */

  stem.api.addCommand(/.status/, function (steamID) {

    var timeNow = Date.now();

    stem.bot.sendMessage(steamID, 'Status:' +
                                  '\nTrades completed: ' + stem.states.tradesCompleted +
                                  '\nTrades per minute: ' + stem.states.prevTradesPerMin +
                                  '\nUptime: %hours hours (%minutes minutes)'
                                    .replace('%hours', ((timeNow - stem.states.startupTime) / 3600000) | 0)
                                    .replace('%minutes', ((timeNow - stem.states.startupTime) / 60000) | 0));

  }, { permission: 'admin' });

};
