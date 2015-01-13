
module.exports = function (tradeID, steamID) {

  var stem = this;

  // Deny trade if not yet logged into Steam community
  if (!stem.states.isCommunityReady)
    return stem.bot.respondToTrade(tradeID, false);

  // Deny trade request if the current session is still in progress
  else if (stem.states.isTrading)
    return stem.bot.respondToTrade(tradeID, false);

  stem.log.info('Accepting trade request from', steamID);

  // Accept trade
  stem.bot.respondToTrade(tradeID, true);

};
