Auto-trader
===
A [Stem](https://github.com/alvinl/stem) plugin that allows 2 accounts to trade one another to remove the captcha restriction.

## Installation
1. Install [Stem](https://github.com/alvinl/stem)
  1. `$ git clone https://github.com/alvinl/stem.git && cd stem`
  2. `$ npm install`
2. Install the auto-trader plugin
  1. `$ npm install git://github.com/alvinl/auto-trader.git`
3. Create a config file called auto.json (this can be named anything as long as it's a json file) with the [contents below](#config).
  - Make sure this file is created inside the `stem` folder.
4. (Optional) If you have previous [sentry](https://github.com/seishun/node-steam#sentry) files saved for your accounts you will need to copy them over. Rename them to `.<username>` and place in the stem folder, where `<username>` is the bot's username (*not* display name).
 This is to avoid having to login again with SteamGuard and avoid the 7 day trade ban.
  - Example: If you have a sentry file for your account named `bot_1.sentry` then you can copy it over inside the `stem` folder like so `$ cp bot_1.sentry stem/.bot_1`.
  - Users who have a sentry hash from using [backpack.tf-automatic](https://bitbucket.org/srabouin/backpack.tf-automatic/src) might experience an issue while trying to login with that hash. A fix is being worked on
5. Start the bot
  - `$ BOT_USERNAME=bot1 BOT_PASSWORD=botpass node bin/stem auto.json` repeat this command for the second bot. Remember to change `BOT_USERNAME` and `BOT_PASSWORD` accordingly.
  - Example: Start the first bot with the following command `$ BOT_USERNAME=bot1 BOT_PASSWORD=botpass node bin/stem auto.json` and the second via `$ BOT_USERNAME=bot2 BOT_PASSWORD=botpass node bin/stem auto.json`

Remember to check the [notes](#notes) section and available [commands](#commands)

### Config
```json
{

  "botname": "",
  "username": "",
  "password": "",
  "admins": ["1223", "23343"],
  "plugins": ["auto-trade"],

  "initBot": "76561198089129440",
  "initTradeBot": "76561198089063899"

}
```
**Config values**
The following properties need to be filled out:
  - `admins` - An array of strings containing the steamID's of admins
  - `initBot` - The steamID of the first bot that will be trading
  - `initTradeBot` - The steamID that the first bot will be trading with

## Notes
1. Verify that the 2 accounts that are trading each other are friends with one another and have at least 5 TF2 items in each account.
2. There are some cases where the bots may stall while trading each other, restarting both bots will fix this.
3. If there are any crashes please open an issue with the crash log.
4. If you have any questions please open an issue regarding them.

## Commands
Commands that you can message the bots
> .status

This command will return the amount of trades per minute and trades completed since starting the bot.
