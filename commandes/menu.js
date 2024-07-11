const {
  zokou
} = require(__dirname + '/../framework/zokou');
const {
  format
} = require(__dirname + "/../framework/mesfonctions");
const os = require('os');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
zokou({
  'nomCom': 'menu',
  'categorie': 'General'
}, async (_0x61e41a, _0x4f8896, _0x1971cc) => {
  let {
    ms: _0x3616de,
    repondre: _0x310440,
    prefixe: _0x5c0bf4,
    nomAuteurMessage: _0x370c2e,
    mybotpic: _0x224398
  } = _0x1971cc;
  let {
    cm: _0x5d6de6
  } = require(__dirname + "/../framework//zokou");
  var _0x34289f = {};
  var _0xd70f6f = "public";
  if (s.MODE.toLocaleLowerCase() != "yes") {
    _0xd70f6f = "private";
  }
  _0x5d6de6.map(async (_0xfa52c8, _0x1b9221) => {
    if (!_0x34289f[_0xfa52c8.categorie]) {
      _0x34289f[_0xfa52c8.categorie] = [];
    }
    _0x34289f[_0xfa52c8.categorie].push(_0xfa52c8.nomCom);
  });
  moment.tz.setDefault("Etc/GMT");
  const _0x26a57a = moment().format("HH:mm:ss");
  const _0x39f5be = moment().format("DD/MM/YYYY");
  let _0x104f7b = "\n╭────✧" + s.BOT + "✧────◆\n│   *Préfix* : " + s.PREFIXE + "\n│   *Owner* : " + s.OWNER_NAME + "\n│   *Mode* : " + _0xd70f6f + "\n│   *Commands* : " + _0x5d6de6.length + "\n│   *Date* : " + _0x39f5be + "\n│   *Hour* : " + _0x26a57a + "\n│   *Mémoire* : " + format(os.totalmem() - os.freemem()) + '/' + format(os.totalmem()) + "\n│   *Plateforme* : " + os.platform() + "\n│   *Développer* : Zenitsu-MD🗡️⚡💫\n╰─────✧WA-BOT✧─────◆ \n\n";
  let _0x1f3a4e = "\n👋 Hello " + _0x370c2e + " 👋\n\n*List of commands :*\n◇                             ◇\n";
  for (const _0x235db9 in _0x34289f) {
    _0x1f3a4e += "╭────❏ " + _0x235db9 + " ❏";
    for (const _0x24b838 of _0x34289f[_0x235db9]) {
      _0x1f3a4e += "\n│ ✿ " + _0x24b838;
    }
    _0x1f3a4e += "\n╰═════════════⊷ \n";
  }
  _0x1f3a4e += "\n◇            ◇\n*»»————— ★ —————««*\n\"To use a command, insert " + _0x5c0bf4 + " followed by the command_name.\"\n \n    Powered by Zenitsu🗡️⚡💫\n                                                \n*»»————— ★ —————««*\n";
  var _0x56c1bb = _0x224398();
  if (_0x56c1bb.match(/\.(mp4|gif)$/i)) {
    try {
      _0x4f8896.sendMessage(_0x61e41a, {
        'video': {
          'url': _0x56c1bb
        },
        'caption': _0x104f7b + _0x1f3a4e,
        'footer': "Je suis *Zenitsu-MD🗡️⚡💫*, développé par Zenitsu🗡️⚡💫",
        'gifPlayback': true
      }, {
        'quoted': _0x3616de
      });
    } catch (_0x35c135) {
      console.log("🥵🥵 Menu erreur " + _0x35c135);
      _0x310440("🥵🥵 Menu erreur " + _0x35c135);
    }
  } else {
    if (_0x56c1bb.match(/\.(jpeg|png|jpg)$/i)) {
      try {
        _0x4f8896.sendMessage(_0x61e41a, {
          'image': {
            'url': _0x56c1bb
          },
          'caption': _0x104f7b + _0x1f3a4e,
          'footer': "Je suis *Zenitsu-MD🗡️⚡💫*, développé par Zenitsu🗡️⚡💫"
        }, {
          'quoted': _0x3616de
        });
      } catch (_0xed152f) {
        console.log("🥵🥵 Menu erreur " + _0xed152f);
        _0x310440("🥵🥵 Menu erreur " + _0xed152f);
      }
    } else {
      _0x310440(_0x104f7b + _0x1f3a4e);
    }
  }
});
