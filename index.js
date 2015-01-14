
module.exports = function (stem) {

  /**
   * Validate config
   */

  if (!stem.config.hasOwnProperty('initBot'))
    throw new Error('Missing initBot property in config.');

  else if (!stem.config.hasOwnProperty('initTradeBot'))
    throw new Error('Missing initTradeBot property in config.');

  /**
   * Set default config values
   */

  if (!stem.config.hasOwnProperty('metalsOnly'))
    stem.config.metalsOnly = true;

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

  stem.tpmInterval = setInterval(function () {

    stem.states.prevTradesPerMin = stem.states.tradesPerMin;
    stem.states.tradesPerMin = 0;

  }, 60000);

  /**
   * Register handlers
   */

  stem.api.addHandler('stem', 'communityReady', require('./handlers/communityReady'));

  stem.api.addHandler('botTrade', 'offerChanged', require('./handlers/offerChanged'));

  stem.api.addHandler('bot', 'tradeProposed', require('./handlers/tradeProposed'));

  stem.api.addHandler('bot', 'sessionStart', require('./handlers/sessionStart'));

  stem.api.addHandler('bot', 'tradeResult', require('./handlers/tradeResult'));

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

  });

};
