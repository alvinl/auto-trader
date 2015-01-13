
module.exports = function () {

  var stem = this;

  stem.log.info('Other bot is now ready, confirming trade');

  stem.botTrade.ready(function () {

    stem.botTrade.confirm(function () {

      stem.log.info('Trade confirmed');

    });

  });

};
