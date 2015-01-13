
module.exports = function () {

  var stem = this;

  stem.log.info('Trade ended');

  stem.states.tradesCompleted++;
  stem.states.tradesPerMin++;

  stem.states.isTrading = false;
  stem.states.isGiver = !stem.states.isGiver;

  if (!stem.states.isGiver)
    return;

  stem.log.info('Sending trade to', stem.states.lastTraded);
  stem.bot.trade(stem.states.lastTraded);

};
