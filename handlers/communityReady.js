
module.exports = function () {

  var stem = this;

  stem.states.isCommunityReady = true;
  stem.states.isGiver = (stem.config.initBot === stem.bot.steamID);

  // Wait for the `initBot` to send the trade first
  if (stem.config.initBot !== stem.bot.steamID)
    return;

  stem.log.info('Sending trade to', stem.config.initTradeBot);

  stem.bot.trade(stem.config.initTradeBot);

};
