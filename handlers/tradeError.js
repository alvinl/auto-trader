
module.exports = function () {

  var stem = this;

  stem.log.warn('Refreshing cookies');

  stem.bot.webLogOn(function (cookies) {

    stem.log.warn('Refreshed cookies');

    // Apply new cookies
    cookies.forEach(function (cookie) {

      stem.botTrade.setCookie(cookie);

    });

    // Reopen trade session if the bot was trading
    if (stem.states.isTrading)
      stem.botTrade.open(stem.states.lastTraded);

  });

};
