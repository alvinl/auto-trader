
module.exports = function () {

  var stem = this;

  stem.log.info('Trade ended');

  // Ignore `end` event if trade was cancelled by the desync check
  if (stem.states.isCancelledByDesync) {

    stem.states.isCancelledByDesync = false;
    return;

  }

  stem.states.tradesCompleted++;
  stem.states.tradesPerMin++;

  stem.states.isTrading = false;
  stem.states.isGiver = !stem.states.isGiver;

  if (!stem.states.isGiver)
    return;

  // Check if `notifyThreshold` was reached
  if (stem.states.tradesCompleted === stem.config.notifyThreshold && !stem.states.isAdminNotified) {

    stem.log.warn('Notify threshold reached, notifying admins');

    stem.config.admins.forEach(function (steamID) {

      stem.bot.sendMessage(steamID, 'Notify threshold reached! Trades completed: ' + stem.states.tradesCompleted);

    });

    stem.states.isAdminNotified = true;

  }

  stem.log.info('Sending trade to', stem.states.lastTraded);
  stem.bot.trade(stem.states.lastTraded);

};
