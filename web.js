const {
  makeWASocket,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  makeInMemoryStore,
  getContentType,
  jidDecode,
  delay,
  downloadMediaMessage,
  downloadContentFromMessage
} = require("@whiskeysockets/baileys");
const {
  Boom
} = require("@hapi/boom");
const {
  default: pino
} = require('pino');
const conf = require("./set");
const fs = require("fs-extra");
let evt = require('./framework/zokou');
const {
  reagir
} = require("./framework/app");
let path = require("path");
const FileType = require("file-type");
const {
  Sticker,
  StickerTypes
} = require("wa-sticker-formatter");
var session = conf.session.replace(/Zokou-MD-WHATSAPP-BOT;;;=>/g, '');
const prefixe = conf.PREFIXE;
const {
  verifierEtatJid,
  recupererActionJid
} = require("./bdd/antilien");
const {
  atbverifierEtatJid,
  atbrecupererActionJid
} = require('./bdd/antibot');
const {
  isUserBanned,
  addUserToBanList,
  removeUserFromBanList
} = require("./bdd/banUser");
const {
  addGroupToBanList,
  isGroupBanned,
  removeGroupFromBanList
} = require("./bdd/banGroup");
const {
  isGroupOnlyAdmin,
  addGroupToOnlyAdminList,
  removeGroupFromOnlyAdminList
} = require("./bdd/onlyAdmin");
const {
  recupevents
} = require('./bdd/welcome');
async function authentification() {
  try {
    if (!fs.existsSync(__dirname + "/auth/creds.json")) {
      console.log("connexion en cour ...");
      await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
    } else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
      await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
    }
  } catch (_0xf9e08d) {
    console.log("Session Invalide " + _0xf9e08d);
    return;
  }
}
authentification();
const store = makeInMemoryStore({
  'logger': pino().child({
    'level': "silent",
    'stream': "store"
  })
});
store.readFromFile('store.json');
async function connectToWhatsapp() {
  const {
    saveCreds: _0x18a444,
    state: _0x59185d
  } = await useMultiFileAuthState('./auth');
  const {
    version: _0x939807,
    isLatest: _0x8721a3
  } = await fetchLatestBaileysVersion();
  const _0x2d9916 = pino({
    'level': "silent"
  });
  setInterval(() => {
    store.writeToFile("store.json");
  }, 0x2710);
  const _0x17ab2c = makeWASocket({
    'version': _0x939807,
    'logger': _0x2d9916,
    'browser': ["Zokou-md", "safari", "1.0.0"],
    'emitOwnEvents': true,
    'syncFullHistory': true,
    'printQRInTerminal': true,
    'markOnlineOnConnect': false,
    'receivedPendingNotifications': true,
    'generateHighQualityLinkPreview': true,
    'auth': {
      'creds': _0x59185d.creds,
      'keys': makeCacheableSignalKeyStore(_0x59185d.keys, _0x2d9916)
    },
    'keepAliveIntervalMs': 0x7530,
    'syncFullHistory': false,
    'getMessage': async _0x3c3345 => {
      if (store) {
        const _0x630826 = await store.loadMessage(_0x3c3345.remoteJid, _0x3c3345.id);
        return _0x630826?.["message"] || undefined;
      }
    }
  });
  store?.["bind"](_0x17ab2c.ev);
  _0x17ab2c.ev.on("messages.upsert", async _0x3d54da => {
    const {
      messages: _0x31fabc
    } = _0x3d54da;
    const _0x137cf2 = _0x31fabc[0x0];
    if (!_0x137cf2.message) {
      return;
    }
    const _0xba2e80 = _0x5c9007 => {
      if (!_0x5c9007) {
        return _0x5c9007;
      }
      if (/:\d+@/gi.test(_0x5c9007)) {
        let _0xda745a = jidDecode(_0x5c9007) || {};
        return _0xda745a.user && _0xda745a.server && _0xda745a.user + '@' + _0xda745a.server || _0x5c9007;
      } else {
        return _0x5c9007;
      }
    };
    var _0x429bc6 = getContentType(_0x137cf2.message);
    var _0x1c5608 = _0x429bc6 == "conversation" ? _0x137cf2.message.conversation : _0x429bc6 == "imageMessage" ? _0x137cf2.message.imageMessage?.["caption"] : _0x429bc6 == "videoMessage" ? _0x137cf2.message.videoMessage?.["caption"] : _0x429bc6 == "extendedTextMessage" ? _0x137cf2.message?.["extendedTextMessage"]?.["text"] : _0x429bc6 == "buttonsResponseMessage" ? _0x137cf2.message.buttonsResponseMessage?.["selectedButtonId"] : _0x429bc6 == "listResponseMessage" ? _0x137cf2.message?.["listResponseMessage"]['singleSelectReply']["selectedRowId"] : _0x429bc6 == 'messageContextInfo' ? _0x137cf2.message?.["buttonsResponseMessage"]?.["selectedButtonId"] || _0x137cf2.message?.["listResponseMessage"]['singleSelectReply']["selectedRowId"] || _0x137cf2.test : '';
    var _0x454cb7 = _0x137cf2.key.remoteJid;
    var _0x1fb69d = _0xba2e80(_0x17ab2c.user.id);
    var _0x2f520d = _0x1fb69d.split('@')[0x0];
    const _0x5c2f5b = _0x454cb7?.['endsWith']('@g.us');
    var _0x4f647f = _0x5c2f5b ? await _0x17ab2c.groupMetadata(_0x454cb7) : null;
    var _0x4d7386 = _0x5c2f5b ? _0x4f647f.subject : null;
    var _0x2604ff = _0x137cf2.message?.["extendedTextMessage"]?.["contextInfo"]?.['quotedMessage'];
    var _0x5b3aa7 = _0xba2e80(_0x137cf2.message?.['extendedTextMessage']?.['contextInfo']?.['participant']);
    var _0x2f3812 = _0x5c2f5b ? _0x137cf2.key.participant ? _0x137cf2.key.participant : _0x137cf2.participant : _0x454cb7;
    if (_0x137cf2.key.fromMe) {
      _0x2f3812 = _0x1fb69d;
    }
    var _0x4074f7 = _0x5c2f5b ? _0x137cf2.key.participant : null;
    const {
      getAllSudoNumbers: _0x23a5ed
    } = require('./bdd/sudo');
    const _0x57293c = _0x137cf2.pushName;
    const _0x41d25c = await _0x23a5ed();
    const _0x392bcf = [_0x2f520d, "22559763447", "22543343357", "22564297888", "‪99393228‬", "22891733300", conf.NUMERO_OWNER].map(_0x3d3873 => _0x3d3873.replace(/[^0-9]/g) + "@s.whatsapp.net");
    const _0x7f8577 = [..._0x41d25c, ..._0x392bcf];
    const _0x46bbef = _0x7f8577.includes(_0x2f3812);
    var _0x25f844 = ["22559763447", "22543343357", "22564297888", "‪99393228‬", "22891733300"].map(_0x2413fb => _0x2413fb.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(_0x2f3812);
    function _0x3f9b37(_0xc13cba) {
      _0x17ab2c.sendMessage(_0x454cb7, {
        'text': _0xc13cba
      }, {
        'quoted': _0x137cf2
      });
    }
    console.log("\t [][]...{Zenitsu-Md🗡️⚡💫}...[][]");
    console.log("=========== New message ===========");
    if (_0x5c2f5b) {
      console.log("message sent from group : " + _0x4d7386);
    }
    console.log("message sent by : [" + _0x57293c + " : " + _0x2f3812.split('@s.whatsapp.net')[0x0] + " ]");
    console.log("type of message : " + _0x429bc6);
    console.log("------ message ------");
    console.log(_0x1c5608);
    function _0x21823a(_0x2c03b3) {
      let _0x7d296e = [];
      for (_0x3d54da of _0x2c03b3) {
        if (_0x3d54da.admin == null) {
          continue;
        }
        _0x7d296e.push(_0x3d54da.id);
      }
      return _0x7d296e;
    }
    const _0x1ef87a = _0x5c2f5b ? await _0x4f647f.participants : '';
    let _0x33ed69 = _0x5c2f5b ? _0x21823a(_0x1ef87a) : '';
    const _0x555891 = _0x5c2f5b ? _0x33ed69.includes(_0x2f3812) : false;
    var _0x35848b = _0x5c2f5b ? _0x33ed69.includes(_0x1fb69d) : false;
    var _0x25a818 = conf.ETAT;
    if (_0x25a818 == 0x1) {
      await _0x17ab2c.sendPresenceUpdate("available", _0x454cb7);
    } else {
      if (_0x25a818 == 0x2) {
        await _0x17ab2c.sendPresenceUpdate("composing", _0x454cb7);
      } else {
        if (_0x25a818 == 0x3) {
          await _0x17ab2c.sendPresenceUpdate("recording", _0x454cb7);
        } else {}
      }
    }
    let _0x236f1c = _0x1c5608 ? _0x1c5608.trim().split(/ +/).slice(0x1) : null;
    let _0x30d163 = _0x1c5608 ? _0x1c5608.startsWith(prefixe) : false;
    let _0x574ec7 = _0x30d163 ? _0x1c5608.slice(0x1).trim().split(/ +/).shift().toLowerCase() : false;
    const _0x13416d = conf.URL.split(',');
    function _0x4d596a() {
      const _0x36c085 = Math.floor(Math.random() * _0x13416d.length);
      const _0x3ff00b = _0x13416d[_0x36c085];
      return _0x3ff00b;
    }
    var _0x7bade0 = {
      'superUser': _0x46bbef,
      'dev': _0x25f844,
      'verifGroupe': _0x5c2f5b,
      'mbre': _0x1ef87a,
      'membreGroupe': _0x4074f7,
      'verifAdmin': _0x555891,
      'infosGroupe': _0x4f647f,
      'nomGroupe': _0x4d7386,
      'auteurMessage': _0x2f3812,
      'nomAuteurMessage': _0x57293c,
      'idBot': _0x1fb69d,
      'verifZokouAdmin': _0x35848b,
      'prefixe': prefixe,
      'arg': _0x236f1c,
      'repondre': _0x3f9b37,
      'mtype': _0x429bc6,
      'groupeAdmin': _0x21823a,
      'msgRepondu': _0x2604ff,
      'auteurMsgRepondu': _0x5b3aa7,
      'ms': _0x137cf2,
      'mybotpic': _0x4d596a
    };
    if (_0x2f3812.endsWith('s.whatsapp.net')) {
      const {
        ajouterOuMettreAJourUserData: _0xac4e40
      } = require("./bdd/level");
      try {
        await _0xac4e40(_0x2f3812);
      } catch (_0x5b6949) {
        console.error(_0x5b6949);
      }
    }
    if (_0x137cf2.message?.["stickerMessage"]) {
      const _0x2488ba = require("./bdd/stickcmd");
      let _0x1af084 = _0x137cf2.message.stickerMessage.url;
      let _0x471bb4 = await _0x2488ba.inStickCmd(_0x1af084);
      if (!_0x471bb4) {
        return;
      }
      _0x1c5608 = prefixe + (await _0x2488ba.getCmdById(_0x1af084));
      _0x236f1c = _0x1c5608 ? _0x1c5608.trim().split(/ +/).slice(0x1) : null;
      _0x30d163 = _0x1c5608 ? _0x1c5608.startsWith(prefixe) : false;
      _0x574ec7 = _0x30d163 ? _0x1c5608.slice(0x1).trim().split(/ +/).shift().toLowerCase() : false;
      _0x2604ff = _0x137cf2.message.stickerMessage?.["contextInfo"]?.["quotedMessage"];
      _0x5b3aa7 = _0xba2e80(_0x137cf2.message?.["stickerMessage"]?.['contextInfo']?.["participant"]);
      _0x7bade0 = {
        'superUser': _0x46bbef,
        'dev': _0x25f844,
        'verifGroupe': _0x5c2f5b,
        'mbre': _0x1ef87a,
        'membreGroupe': _0x4074f7,
        'verifAdmin': _0x555891,
        'infosGroupe': _0x4f647f,
        'nomGroupe': _0x4d7386,
        'auteurMessage': _0x2f3812,
        'nomAuteurMessage': _0x57293c,
        'idBot': _0x1fb69d,
        'verifZokouAdmin': _0x35848b,
        'prefixe': prefixe,
        'arg': _0x236f1c,
        'repondre': _0x3f9b37,
        'mtype': _0x429bc6,
        'groupeAdmin': _0x21823a,
        'msgRepondu': _0x2604ff,
        'auteurMsgRepondu': _0x5b3aa7,
        'ms': _0x137cf2,
        'mybotpic': _0x4d596a
      };
    }
    if (_0x30d163) {
      const _0x42eae2 = evt.cm.find(_0x2f675e => _0x2f675e.nomCom === _0x574ec7);
      if (_0x42eae2) {
        if (conf.MODE != "yes" && !_0x46bbef) {
          return;
        }
        if (!_0x25f844 && _0x454cb7 == "120363158701337904@g.us") {
          return;
        }
        if (!_0x46bbef && _0x454cb7 === _0x2f3812 && conf.PM_PERMIT === "yes") {
          return;
        }
        if (_0x5c2f5b && !_0x46bbef) {
          let _0x3af444 = await isGroupBanned(_0x454cb7);
          if (_0x3af444) {
            return;
          }
        }
        if ((!_0x46bbef || !_0x555891) && _0x5c2f5b) {
          let _0x15ccb1 = await isGroupOnlyAdmin(_0x454cb7);
          if (_0x15ccb1) {
            return;
          }
        }
        if (!_0x46bbef) {
          let _0x418270 = await isUserBanned(_0x2f3812);
          if (_0x418270) {
            _0x3f9b37("You are banned from bot commands");
            return;
          }
        }
        ;
        try {
          reagir(_0x454cb7, _0x17ab2c, _0x137cf2, _0x42eae2.reaction);
          _0x42eae2.fonction(_0x454cb7, _0x17ab2c, _0x7bade0);
        } catch (_0x1ddf37) {
          console.log("😡😡 " + _0x1ddf37);
          _0x17ab2c.sendMessage(_0x454cb7, {
            'text': "😡😡 " + _0x1ddf37
          }, {
            'quoted': _0x137cf2
          });
        }
      }
    }
    ;
    if (_0x137cf2.key && _0x137cf2.key.remoteJid === 'status@broadcast' && conf.AUTO_READ_STATUS.toLocaleLowerCase() === "yes") {
      await _0x17ab2c.readMessages([_0x137cf2.key])["catch"](_0x32b401 => console.log(_0x32b401));
    }
    if (_0x137cf2.key && _0x137cf2.key.remoteJid === "status@broadcast" && conf.AUTO_DOWNLOAD_STATUS.toLocaleLowerCase() === "yes") {
      try {
        if (_0x137cf2.message.extendedTextMessage) {
          var _0x2d09db = _0x137cf2.message.extendedTextMessage.text;
          await _0x17ab2c.sendMessage(_0x1fb69d, {
            'text': _0x2d09db
          }, {
            'quoted': _0x137cf2
          });
        } else {
          if (_0x137cf2.message.imageMessage) {
            var _0x1085ee = _0x137cf2.message.imageMessage.caption;
            var _0x131dd4 = await _0x17ab2c.downloadAndSaveMediaMessage(_0x137cf2.message.imageMessage);
            await _0x17ab2c.sendMessage(_0x1fb69d, {
              'image': {
                'url': _0x131dd4
              },
              'caption': _0x1085ee
            }, {
              'quoted': _0x137cf2
            });
          } else {
            if (_0x137cf2.message.videoMessage) {
              var _0x1085ee = _0x137cf2.message.videoMessage.caption;
              var _0x17c9bf = await _0x17ab2c.downloadAndSaveMediaMessage(_0x137cf2.message.videoMessage);
              await _0x17ab2c.sendMessage(_0x1fb69d, {
                'video': {
                  'url': _0x17c9bf
                },
                'caption': _0x1085ee
              }, {
                'quoted': _0x137cf2
              });
            } else {
              if (_0x137cf2.message.audioMessage) {
                var _0x8bfc61 = await _0x17ab2c.downloadAndSaveMediaMessage(_0x137cf2.message.audioMessage);
                await _0x17ab2c.sendMessage(_0x1fb69d, {
                  'audio': {
                    'url': _0x8bfc61
                  },
                  'mimetype': 'audio/mp4'
                }, {
                  'quoted': _0x137cf2
                });
              }
            }
          }
        }
      } catch (_0xf3a761) {
        console.error(_0xf3a761);
      }
    }
    if ((_0x1c5608.toLocaleLowerCase().includes("https://") || _0x1c5608.toLocaleLowerCase().includes('http://')) && _0x5c2f5b) {
      console.log("lien detecté");
      const _0x1c857c = await verifierEtatJid(_0x454cb7);
      if (!_0x1c857c) {
        return;
      }
      if (!_0x35848b) {
        _0x3f9b37("link detected, I need administrator rights to delete");
        return;
      }
      ;
      if (_0x46bbef || _0x555891) {
        return console.log("autority send link");
      }
      const _0x193ce9 = {
        'remoteJid': _0x454cb7,
        'fromMe': false,
        'id': _0x137cf2.key.id,
        'participant': _0x2f3812
      };
      var _0x2bd42c = "link detected, \n";
      var _0x26769b = await recupererActionJid(_0x454cb7);
      if (_0x26769b === "remove") {
        var _0x279fbb = new Sticker("https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif", {
          'pack': 'Zoou-Md',
          'author': conf.NOM_OWNER,
          'type': StickerTypes.FULL,
          'categories': ['🤩', '🎉'],
          'id': "12345",
          'quality': 0x32,
          'background': "#000000"
        });
        await _0x279fbb.toFile("st1.webp");
        _0x2bd42c += "message deleted \n @" + _0x2f3812.split('@')[0x0] + " removed from group.";
        await _0x17ab2c.sendMessage(_0x454cb7, {
          'sticker': fs.readFileSync("st1.webp")
        }, {
          'quoted': _0x137cf2
        });
        0x0;
        baileys_1.delay(0x320);
        await _0x17ab2c.sendMessage(_0x454cb7, {
          'text': _0x2bd42c,
          'mentions': [_0x2f3812]
        }, {
          'quoted': _0x137cf2
        });
        try {
          await _0x17ab2c.groupParticipantsUpdate(_0x454cb7, [_0x2f3812], "remove");
        } catch (_0x297d63) {
          console.log("antiien " + _0x297d63);
        }
        await _0x17ab2c.sendMessage(_0x454cb7, {
          'delete': _0x193ce9
        });
        await fs.unlink("st1.webp");
      } else {
        if (_0x26769b === "delete") {
          _0x2bd42c += "message deleted \n @" + _0x2f3812.split('@')[0x0] + " Please avoid sending links.";
          await _0x17ab2c.sendMessage(_0x454cb7, {
            'text': _0x2bd42c,
            'mentions': [_0x2f3812]
          }, {
            'quoted': _0x137cf2
          });
          await _0x17ab2c.sendMessage(_0x454cb7, {
            'delete': _0x193ce9
          });
        } else {
          if (_0x26769b === 'warn') {
            const {
              getWarnCountByJID: _0x50cb94,
              ajouterUtilisateurAvecWarnCount: _0x2b3c83
            } = require("./bdd/warn");
            let _0x4cf96e = await _0x50cb94(_0x2f3812);
            let _0x29c2f8 = conf.WARN_COUNT;
            if (_0x4cf96e >= _0x29c2f8) {
              var _0x279fbb = new Sticker("https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif", {
                'pack': "Zoou-Md",
                'author': conf.NOM_OWNER,
                'type': StickerTypes.FULL,
                'categories': ['🤩', '🎉'],
                'id': "12345",
                'quality': 0x32,
                'background': '#000000'
              });
              await _0x279fbb.toFile("st1.webp");
              var _0x15b5d4 = "Link detected; you have reached the maximum number of warnings therefore you will be removed from the group";
              await _0x17ab2c.sendMessage(_0x454cb7, {
                'sticker': fs.readFileSync('st1.webp')
              }, {
                'quoted': _0x137cf2
              });
              await _0x17ab2c.sendMessage(_0x454cb7, {
                'text': _0x15b5d4,
                'mentions': [_0x2f3812]
              }, {
                'quoted': _0x137cf2
              });
              await _0x17ab2c.groupParticipantsUpdate(_0x454cb7, [_0x2f3812], "remove");
              await _0x17ab2c.sendMessage(_0x454cb7, {
                'delete': _0x193ce9
              });
              await fs.unlink("st1.webp");
            } else {
              var _0x376a71 = _0x29c2f8 - (_0x4cf96e + 0x1);
              var _0x32ffe8 = _0x376a71 != 0x0 ? "Link detected;\npass " + _0x376a71 + " warning(s) again and you will be kicked out of the group" : "Lien detecté ;\nLink detected ;\n Next time will be the right one";
              await _0x2b3c83(_0x2f3812);
              await _0x17ab2c.sendMessage(_0x454cb7, {
                'text': _0x32ffe8,
                'mentions': [_0x2f3812]
              }, {
                'quoted': _0x137cf2
              });
              await _0x17ab2c.sendMessage(_0x454cb7, {
                'delete': _0x193ce9
              });
            }
          }
        }
      }
    }
    const _0x45341a = _0x137cf2.key?.['id']?.['startsWith']("BAES") && _0x137cf2.key?.['id']?.["length"] === 0x10;
    const _0x3b80f2 = _0x137cf2.key?.['id']?.['startsWith']('BAE5') && _0x137cf2.key?.['id']?.["length"] === 0x10;
    const _0x590247 = _0x137cf2.key?.['id']?.["startsWith"]('3EB0') && _0x137cf2.key?.['id']?.['length'] >= 0xc;
    if (_0x45341a || _0x3b80f2 || _0x590247) {
      const _0x261cb0 = await atbverifierEtatJid(_0x454cb7);
      if (!_0x261cb0) {
        return;
      }
      ;
      if (_0x429bc6 === "reactionMessage") {
        console.log("Je ne reagis pas au reactions");
        return;
      }
      if (_0x555891 || _0x2f3812 === _0x1fb69d || _0x46bbef) {
        console.log("je fais rien");
        return;
      }
      ;
      if (!_0x35848b) {
        return _0x3f9b37("J'ai besoin des droits d'administrations pour agire");
      }
      const _0x4f3a2e = {
        'remoteJid': _0x454cb7,
        'fromMe': false,
        'id': _0x137cf2.key.id,
        'participant': _0x2f3812
      };
      var _0x2bd42c = "bot détecté, \n";
      var _0x26769b = await atbrecupererActionJid(_0x454cb7);
      if (_0x26769b === "remove") {
        try {
          var _0x279fbb = new Sticker('https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif', {
            'pack': "Zoou-Md",
            'author': conf.NOM_OWNER,
            'type': StickerTypes.FULL,
            'categories': ['🤩', '🎉'],
            'id': "12345",
            'quality': 0x32,
            'background': '#000000'
          });
          await _0x279fbb.toFile("st1.webp");
          _0x2bd42c += "deleted message \n @" + _0x2f3812.split('@')[0x0] + " removed from the group.";
          await _0x17ab2c.sendMessage(_0x454cb7, {
            'sticker': fs.readFileSync('st1.webp')
          }, {
            'quoted': _0x137cf2
          });
          0x0;
          baileys_1.delay(0x320);
          await _0x17ab2c.sendMessage(_0x454cb7, {
            'text': _0x2bd42c,
            'mentions': [_0x2f3812]
          }, {
            'quoted': _0x137cf2
          });
          await _0x17ab2c.groupParticipantsUpdate(_0x454cb7, [_0x2f3812], "remove");
          await _0x17ab2c.sendMessage(_0x454cb7, {
            'delete': _0x4f3a2e
          });
          await fs.unlink("st1.webp");
        } catch (_0x288181) {
          console.log("antibot " + _0x288181);
        }
      } else {
        if (_0x26769b === "delete") {
          _0x2bd42c += "deleted message \n @" + _0x2f3812.split('@')[0x0] + " please avoid using bots.";
          await _0x17ab2c.sendMessage(_0x454cb7, {
            'text': _0x2bd42c,
            'mentions': [_0x2f3812]
          }, {
            'quoted': _0x137cf2
          });
          await _0x17ab2c.sendMessage(_0x454cb7, {
            'delete': _0x4f3a2e
          });
        } else {
          if (_0x26769b === 'warn') {
            const {
              getWarnCountByJID: _0x1b2cfe,
              ajouterUtilisateurAvecWarnCount: _0x3e2c19
            } = require("./bdd/warn");
            let _0x33c74d = await _0x1b2cfe(_0x2f3812);
            let _0x5ca2eb = conf.WARN_COUNT;
            if (_0x33c74d >= _0x5ca2eb) {
              var _0x279fbb = new Sticker('https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif', {
                'pack': "Zoou-Md",
                'author': conf.NOM_OWNER,
                'type': StickerTypes.FULL,
                'categories': ['🤩', '🎉'],
                'id': '12345',
                'quality': 0x32,
                'background': "#000000"
              });
              await _0x279fbb.toFile('st1.webp');
              var _0x15b5d4 = "bot detected; you have reached the maximum number of warnings therefore you will be removed from the group";
              await _0x17ab2c.sendMessage(_0x454cb7, {
                'sticker': fs.readFileSync('st1.webp')
              }, {
                'quoted': _0x137cf2
              });
              await _0x17ab2c.sendMessage(_0x454cb7, {
                'text': _0x15b5d4,
                'mentions': [_0x2f3812]
              }, {
                'quoted': _0x137cf2
              });
              await _0x17ab2c.groupParticipantsUpdate(_0x454cb7, [_0x2f3812], "remove");
              await _0x17ab2c.sendMessage(_0x454cb7, {
                'delete': _0x4f3a2e
              });
              await fs.unlink('st1.webp');
            } else {
              var _0x376a71 = _0x5ca2eb - (_0x33c74d + 0x1);
              var _0x32ffe8 = _0x376a71 != 0x0 ? "bot detected;\n pass another " + _0x376a71 + " warning(s) and you will be kicked out of the group" : "bot detected;\n The next one will be the right one";
              await _0x3e2c19(_0x2f3812);
              await _0x17ab2c.sendMessage(_0x454cb7, {
                'text': _0x32ffe8,
                'mentions': [_0x2f3812]
              }, {
                'quoted': _0x137cf2
              });
              await _0x17ab2c.sendMessage(_0x454cb7, {
                'delete': _0x4f3a2e
              });
            }
          }
        }
      }
    }
    const _0x407e70 = require("./bdd/afk");
    let _0x5b68c0 = await _0x407e70.getAfkById(0x1);
    if (_0x5b68c0?.['etat'] == 'on' && _0x137cf2.key?.["fromMe"]) {
      const _0x15a031 = _0x137cf2.key?.['id']?.['startsWith']("BAES") && _0x137cf2.key?.['id']?.["length"] === 0x10;
      const _0x42be18 = _0x137cf2.key?.['id']?.["startsWith"]("BAE5") && _0x137cf2.key?.['id']?.['length'] === 0x10;
      const _0x209ab0 = _0x137cf2.key?.['id']?.['startsWith']("3EB0") && _0x137cf2.key?.['id']?.["length"] >= 0xc;
      if (_0x15a031 || _0x42be18 || _0x209ab0) {
        return console.log("bot message");
      }
      console.log("desactivation de l'afk");
      if (_0x1c5608.toLocaleLowerCase() == 'noafk') {
        await _0x407e70.changeAfkState(0x1, "off");
        return _0x3f9b37("Afk deactivate!");
      } else {
        _0x3f9b37("Send *noafk* if you want to disable afk");
      }
    }
    if (_0x137cf2.message[_0x429bc6]?.["contextInfo"]?.["mentionedJid"]?.["includes"](_0x1fb69d)) {
      console.log("Je suis mentionner");
      if (_0x454cb7.endsWith('@s.whatsapp.net')) {
        return;
      }
      if (_0x5b68c0?.["etat"] == 'on') {
        const _0x4b496b = _0x137cf2.key?.['id']?.["startsWith"]("BAES") && _0x137cf2.key?.['id']?.['length'] === 0x10;
        const _0x3ec658 = _0x137cf2.key?.['id']?.["startsWith"]("BAE5") && _0x137cf2.key?.['id']?.["length"] === 0x10;
        const _0xc75239 = _0x137cf2.key?.['id']?.["startsWith"]("3EB0") && _0x137cf2.key?.['id']?.["length"] >= 0xc;
        if (_0x4b496b || _0x3ec658 || _0xc75239) {
          return;
        }
        if (_0x137cf2.key?.["fromMe"]) {
          return;
        }
        if (_0x5b68c0.lien == "no url") {
          _0x3f9b37(_0x5b68c0.message);
        } else {
          _0x17ab2c.sendMessage(_0x454cb7, {
            'image': {
              'url': _0x5b68c0.lien
            },
            'caption': _0x5b68c0.message
          }, {
            'caption': _0x137cf2
          });
        }
      } else {
        if (_0x454cb7 == "120363158701337904@g.us" || _0x2f3812 == _0x1fb69d) {
          return;
        }
        ;
        let _0x13c4f1 = require("./bdd/mention");
        let _0x143f5b = await _0x13c4f1.recupererToutesLesValeurs();
        let _0x2323de = _0x143f5b[0x0];
        if (_0x2323de.status === 'non') {
          console.log("mention pas actifs");
          return;
        }
        let _0x1856fd;
        if (_0x2323de.type.toLocaleLowerCase() === "image") {
          _0x1856fd = {
            'image': {
              'url': _0x2323de.url
            },
            'caption': _0x2323de.message
          };
        } else {
          if (_0x2323de.type.toLocaleLowerCase() === "video") {
            _0x1856fd = {
              'video': {
                'url': _0x2323de.url
              },
              'caption': _0x2323de.message
            };
          } else {
            if (_0x2323de.type.toLocaleLowerCase() === 'sticker') {
              let _0x5c018f = new Sticker(_0x2323de.url, {
                'pack': conf.NOM_OWNER,
                'type': StickerTypes.FULL,
                'categories': ['🤩', '🎉'],
                'id': "12345",
                'quality': 0x46,
                'background': "transparent"
              });
              const _0x15ea80 = await _0x5c018f.toBuffer();
              _0x1856fd = {
                'sticker': _0x15ea80
              };
            } else if (_0x2323de.type.toLocaleLowerCase() === 'audio') {
              _0x1856fd = {
                'audio': {
                  'url': _0x2323de.url
                },
                'mimetype': "audio/mp4"
              };
            }
          }
        }
        _0x17ab2c.sendMessage(_0x454cb7, _0x1856fd, {
          'quoted': _0x137cf2
        })["catch"](_0x23cc4b => console.error(_0x23cc4b));
      }
    }
    if (_0x454cb7.endsWith("@s.whatsapp.net") && _0x2f3812 != _0x1fb69d) {
      if (_0x5b68c0?.['etat'] == 'on') {
        if (_0x5b68c0.lien == "no url") {
          _0x3f9b37(_0x5b68c0.message);
        } else {
          _0x17ab2c.sendMessage(_0x454cb7, {
            'image': {
              'url': _0x5b68c0.lien
            },
            'caption': _0x5b68c0.message
          }, {
            'caption': _0x137cf2
          });
        }
      } else {
        if (conf.CHATBOT === "oui") {
          if (_0x30d163) {
            return;
          }
          const _0xb0c287 = require("./framework/traduction");
          let _0x1ee4da = await _0xb0c287(_0x1c5608, {
            'to': 'en'
          });
          fetch("http://api.brainshop.ai/get?bid=177607&key=NwzhALqeO1kubFVD&uid=[uid]&msg=" + _0x1ee4da).then(_0x3bbbc0 => _0x3bbbc0.json()).then(_0x4c1c15 => {
            const _0x134aa9 = _0x4c1c15.cnt;
            _0x3f9b37(_0x134aa9);
          })["catch"](_0x417010 => {
            console.error("Erreur lors de la requête à BrainShop :", _0x417010);
          });
        }
      }
    }
  });
  _0x17ab2c.ev.on("group-participants.update", async _0x2bb78a => {
    const _0x45104c = _0x4a796d => {
      if (!_0x4a796d) {
        return _0x4a796d;
      }
      if (/:\d+@/gi.test(_0x4a796d)) {
        0x0;
        let _0x12af00 = baileys_1.jidDecode(_0x4a796d) || {};
        return _0x12af00.user && _0x12af00.server && _0x12af00.user + '@' + _0x12af00.server || _0x4a796d;
      } else {
        return _0x4a796d;
      }
    };
    console.log(_0x2bb78a);
    let _0x31f9e0;
    try {
      _0x31f9e0 = await _0x17ab2c.profilePictureUrl(_0x2bb78a.id, 'image');
    } catch {
      _0x31f9e0 = "https://telegra.ph/file/4cc2712eee93c105f6739.jpg";
    }
    try {
      const _0x22b1c7 = await _0x17ab2c.groupMetadata(_0x2bb78a.id);
      if (_0x2bb78a.action == 'add' && (await recupevents(_0x2bb78a.id, "welcome")) == "oui") {
        let _0x448f48 = "╔════◇◇◇═════╗\n║ Welcome the new member(s)\n║ *New Member(s):*\n";
        let _0x278150 = _0x2bb78a.participants;
        for (let _0xb7a6b8 of _0x278150) {
          _0x448f48 += "║ @" + _0xb7a6b8.split('@')[0x0] + "\n";
        }
        _0x448f48 += "║\n╚════◇◇◇═════╝\n◇ *Description*   ◇\n\n" + _0x22b1c7.desc;
        _0x17ab2c.sendMessage(_0x2bb78a.id, {
          'image': {
            'url': _0x31f9e0
          },
          'caption': _0x448f48,
          'mentions': _0x278150
        });
      } else {
        if (_0x2bb78a.action == "remove" && (await recupevents(_0x2bb78a.id, "goodbye")) == 'on') {
          let _0x594eed = "Un ou des membres vient(nent) de quitter le groupe;\n";
          let _0x216cc2 = _0x2bb78a.participants;
          for (let _0x5bd840 of _0x216cc2) {
            _0x594eed += '@' + _0x5bd840.split('@')[0x0] + "\n";
          }
          _0x17ab2c.sendMessage(_0x2bb78a.id, {
            'text': _0x594eed,
            'mentions': _0x216cc2
          });
        } else {
          if (_0x2bb78a.action == 'promote' && (await recupevents(_0x2bb78a.id, "antipromote")) == 'on') {
            if (_0x2bb78a.author == _0x22b1c7.owner || _0x2bb78a.author == conf.NUMERO_OWNER + "@s.whatsapp.net" || _0x2bb78a.author == _0x45104c(_0x17ab2c.user.id) || _0x2bb78a.author == _0x2bb78a.participants[0x0]) {
              console.log("Cas de superUser je fais rien");
              return;
            }
            ;
            await _0x17ab2c.groupParticipantsUpdate(_0x2bb78a.id, [_0x2bb78a.author, _0x2bb78a.participants[0x0]], "demote");
            _0x17ab2c.sendMessage(_0x2bb78a.id, {
              'text': '@' + _0x2bb78a.author.split('@')[0x0] + " has violated the anti-promotion rule, therefore both " + _0x2bb78a.author.split('@')[0x0] + " and @" + _0x2bb78a.participants[0x0].split('@')[0x0] + " have been removed from administrative rights.",
              'mentions': [_0x2bb78a.author, _0x2bb78a.participants[0x0]]
            });
          } else {
            if (_0x2bb78a.action == "demote" && (await recupevents(_0x2bb78a.id, "antidemote")) == 'on') {
              if (_0x2bb78a.author == _0x22b1c7.owner || _0x2bb78a.author == conf.NUMERO_OWNER + "@s.whatsapp.net" || _0x2bb78a.author == _0x45104c(_0x17ab2c.user.id) || _0x2bb78a.author == _0x2bb78a.participants[0x0]) {
                console.log("Cas de superUser je fais rien");
                return;
              }
              ;
              await _0x17ab2c.groupParticipantsUpdate(_0x2bb78a.id, [_0x2bb78a.author], 'demote');
              await _0x17ab2c.groupParticipantsUpdate(_0x2bb78a.id, [_0x2bb78a.participants[0x0]], 'promote');
              _0x17ab2c.sendMessage(_0x2bb78a.id, {
                'text': '@' + _0x2bb78a.author.split('@')[0x0] + " has violated the anti-demotion rule by removing @" + _0x2bb78a.participants[0x0].split('@')[0x0] + ". Consequently, he has been stripped of administrative rights.",
                'mentions': [_0x2bb78a.author, _0x2bb78a.participants[0x0]]
              });
            }
          }
        }
      }
    } catch (_0x5ce22e) {
      console.error(_0x5ce22e);
    }
  });
  _0x17ab2c.ev.on('contacts.upsert', async _0x5548d1 => {
    const _0xa4082c = _0x12a010 => {
      for (const _0x5aa124 of _0x12a010) {
        if (store.contacts[_0x5aa124.id]) {
          Object.assign(store.contacts[_0x5aa124.id], _0x5aa124);
        } else {
          store.contacts[_0x5aa124.id] = _0x5aa124;
        }
      }
      return;
    };
    _0xa4082c(_0x5548d1);
  });
  _0x17ab2c.ev.on("connection.update", async _0xce9640 => {
    const {
      connection: _0x11fad8,
      lastDisconnect: _0x3e9514
    } = _0xce9640;
    if (_0x11fad8 == 'connecting') {
      console.log("connection en cours...");
    } else {
      if (_0x11fad8 == "close") {
        let _0x3fa084 = new Boom(_0x3e9514?.["error"])?.["output"]["statusCode"];
        if (_0x3fa084 == DisconnectReason.connectionClosed) {
          console.log("Connexion fermee , reconnexion en cours");
          connectToWhatsapp();
        } else {
          if (_0x3fa084 == DisconnectReason.badSession) {
            console.log("La session id est erronee,  veillez la remplacer");
          } else {
            if (_0x3fa084 === DisconnectReason.connectionReplaced) {
              console.log("connexion réplacée ,,, une session est déjà ouverte veuillez la fermer svp !!!");
            } else {
              if (_0x3fa084 === DisconnectReason.loggedOut) {
                console.log("vous êtes déconnecté,,, veuillez rescanner le code qr svp");
              } else {
                if (_0x3fa084 === DisconnectReason.restartRequired) {
                  console.log("redémarrage en cours ▶️");
                  connectToWhatsapp();
                } else {
                  if (_0x3fa084 === DisconnectReason.connectionLost) {
                    console.log("connexion au serveur perdue 😞 ,,, reconnexion en cours ... ");
                    connectToWhatsapp();
                  } else {
                    console.log("Raison de deconnection inattendue ; redemarrage du server");
                    const {
                      exec: _0xddb11
                    } = require('child_process');
                    _0xddb11("pm2 restart all");
                  }
                }
              }
            }
          }
        }
      } else {
        if (_0x11fad8 == 'open') {
          console.log("✅ connexion reussie! ☺️");
          await delay(0x1f4);
          fs.readdirSync(__dirname + "/commandes").forEach(_0x4809a3 => {
            if (path.extname(_0x4809a3).toLowerCase() == ".js") {
              try {
                require(__dirname + "/commandes/" + _0x4809a3);
                console.log(_0x4809a3 + " installé ✔️");
              } catch (_0x15ac07) {
                console.log(_0x4809a3 + " n'a pas pu être chargé pour les raisons suivantes : " + _0x15ac07);
              }
              delay(0x12c);
            }
          });
          await delay(0x2bc);
          var _0xdcae73;
          if (conf.MODE.toLowerCase() === "yes") {
            _0xdcae73 = "public";
          } else if (conf.MODE.toLowerCase() === 'no') {
            _0xdcae73 = "private";
          } else {
            _0xdcae73 = "undefined";
          }
          console.log("chargement des commandes terminé ✅");
          await _0x627fd5();
          if (conf.DP.toLowerCase() === "yes") {
            let _0x3c0adb = "╔════◇\n║ 『𝐙enitsu-𝐌𝐃🗡️⚡💫』\n║    Prefix : [ " + prefixe + " ]\n║    Mode :" + _0xdcae73 + "\n║    Commandes length: " + evt.cm.length + "︎\n╚══════════════════╝\n  \n╔═════◇\n║『𝗯𝘆 Zenitsu🗡️⚡💫』\n║ \n╚══════════════════╝";
            await _0x17ab2c.sendMessage(_0x17ab2c.user.id, {
              'text': _0x3c0adb
            });
          }
        }
      }
    }
  });
  _0x17ab2c.ev.on("creds.update", _0x18a444);
  _0x17ab2c.downloadAndSaveMediaMessage = async (_0x15b5bf, _0x36586f = '', _0x230992 = true) => {
    let _0x47e20e = _0x15b5bf.msg ? _0x15b5bf.msg : _0x15b5bf;
    let _0x2b34bb = (_0x15b5bf.msg || _0x15b5bf).mimetype || '';
    let _0xc8dc0c = _0x15b5bf.mtype ? _0x15b5bf.mtype.replace(/Message/gi, '') : _0x2b34bb.split('/')[0x0];
    const _0x1e898f = await downloadContentFromMessage(_0x47e20e, _0xc8dc0c);
    let _0x57d791 = Buffer.from([]);
    for await (const _0x2824de of _0x1e898f) {
      _0x57d791 = Buffer.concat([_0x57d791, _0x2824de]);
    }
    let _0x55a51e = await FileType.fromBuffer(_0x57d791);
    let _0x8c3717 = './' + _0x36586f + '.' + _0x55a51e.ext;
    await fs.writeFileSync(_0x8c3717, _0x57d791);
    return _0x8c3717;
  };
  _0x17ab2c.awaitForMessage = async (_0x4a3f76 = {}) => {
    return new Promise((_0x4205e6, _0x421f44) => {
      if (typeof _0x4a3f76 !== "object") {
        _0x421f44(new Error("Options must be an object"));
      }
      if (typeof _0x4a3f76.sender !== "string") {
        _0x421f44(new Error("Sender must be a string"));
      }
      if (typeof _0x4a3f76.chatJid !== "string") {
        _0x421f44(new Error("ChatJid must be a string"));
      }
      if (_0x4a3f76.timeout && typeof _0x4a3f76.timeout !== "number") {
        _0x421f44(new Error("Timeout must be a number"));
      }
      if (_0x4a3f76.filter && typeof _0x4a3f76.filter !== 'function') {
        _0x421f44(new Error("Filter must be a function"));
      }
      const _0x7ff273 = _0x4a3f76?.["timeout"] || undefined;
      const _0x188588 = _0x4a3f76?.["filter"] || (() => true);
      let _0x2948d4 = undefined;
      let _0x1b4019 = _0x1d95ea => {
        let {
          type: _0x8408c2,
          messages: _0x3fbaf2
        } = _0x1d95ea;
        if (_0x8408c2 == "notify") {
          for (let _0xf2030e of _0x3fbaf2) {
            const _0x2cb314 = _0xf2030e.key.fromMe;
            const _0x478153 = _0xf2030e.key.remoteJid;
            const _0x5a825c = _0x478153.endsWith('@g.us');
            const _0x3b810e = _0x478153 == "status@broadcast";
            const _0x5b97c4 = _0x2cb314 ? _0x17ab2c.user.id.replace(/:.*@/g, '@') : _0x5a825c || _0x3b810e ? _0xf2030e.key.participant.replace(/:.*@/g, '@') : _0x478153;
            if (_0x5b97c4 == _0x4a3f76.sender && _0x478153 == _0x4a3f76.chatJid && _0x188588(_0xf2030e)) {
              _0x17ab2c.ev.off('messages.upsert', _0x1b4019);
              clearTimeout(_0x2948d4);
              _0x4205e6(_0xf2030e);
            }
          }
        }
      };
      _0x17ab2c.ev.on("messages.upsert", _0x1b4019);
      if (_0x7ff273) {
        _0x2948d4 = setTimeout(() => {
          _0x17ab2c.ev.off('messages.upsert', _0x1b4019);
          _0x421f44(new Error("Timeout"));
        }, _0x7ff273);
      }
    });
  };
  async function _0x627fd5() {
    const _0xec0fe4 = require("node-cron");
    const {
      getCron: _0x23f504
    } = require("./bdd/cron");
    let _0x3402c3 = await _0x23f504();
    console.log(_0x3402c3);
    if (_0x3402c3.length > 0x0) {
      for (let _0x4a24e6 = 0x0; _0x4a24e6 < _0x3402c3.length; _0x4a24e6++) {
        if (_0x3402c3[_0x4a24e6].mute_at != null) {
          let _0xfa47dd = _0x3402c3[_0x4a24e6].mute_at.split(':');
          console.log("etablissement d'un automute pour " + _0x3402c3[_0x4a24e6].group_id + " a " + _0xfa47dd[0x0] + " H " + _0xfa47dd[0x1]);
          _0xec0fe4.schedule(_0xfa47dd[0x1] + " " + _0xfa47dd[0x0] + " * * *", async () => {
            try {
              await _0x17ab2c.groupSettingUpdate(_0x3402c3[_0x4a24e6].group_id, "announcement");
              _0x17ab2c.sendMessage(_0x3402c3[_0x4a24e6].group_id, {
                'image': {
                  'url': "./media/chrono.jpg"
                },
                'caption': "Tic Tac, the exciting discussions are coming to an end. Thank you for your active participation; now, it's time to close the group for today."
              });
            } catch (_0x38102b) {
              console.log(_0x38102b);
            }
          }, {
            'timezone': "Africa/Abidjan"
          });
        }
        if (_0x3402c3[_0x4a24e6].unmute_at != null) {
          let _0x43163b = _0x3402c3[_0x4a24e6].unmute_at.split(':');
          console.log("etablissement d'un autounmute pour " + _0x43163b[0x0] + " H " + _0x43163b[0x1] + " ");
          _0xec0fe4.schedule(_0x43163b[0x1] + " " + _0x43163b[0x0] + " * * *", async () => {
            try {
              await _0x17ab2c.groupSettingUpdate(_0x3402c3[_0x4a24e6].group_id, "not_announcement");
              _0x17ab2c.sendMessage(_0x3402c3[_0x4a24e6].group_id, {
                'image': {
                  'url': "./media/chrono.jpg"
                },
                'caption': "Time to open the doors of our new group! Welcome everyone to this exciting community where we share and learn together."
              });
            } catch (_0xf6fb6c) {
              console.log(_0xf6fb6c);
            }
          }, {
            'timezone': "Africa/Abidjan"
          });
        }
      }
    } else {
      console.log("Les crons n'ont pas été activés");
    }
    return;
  }
}
connectToWhatsapp();
const express = require("express");
const port = process.env.PORT || 0xbb8;
const app = express();
app.get('/', (_0x1714e9, _0x3c7a86) => {
  _0x3c7a86.send("Hello , thanks for using zokou");
});
app.listen(port, () => {
  console.log("listen on : " + port);
});
