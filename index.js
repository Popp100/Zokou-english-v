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
} = require("pino");
const conf = require("./set");
const fs = require("fs-extra");
let evt = require("./framework/zokou");
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
} = require('./bdd/antilien');
const {
  atbverifierEtatJid,
  atbrecupererActionJid
} = require("./bdd/antibot");
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
} = require("./bdd/welcome");
async function authentification() {
  try {
    if (!fs.existsSync(__dirname + '/auth/creds.json')) {
      console.log("connexion en cour ...");
      await fs.writeFileSync(__dirname + '/auth/creds.json', atob(session), 'utf8');
    } else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
      await fs.writeFileSync(__dirname + '/auth/creds.json', atob(session), 'utf8');
    }
  } catch (_0x43d690) {
    console.log("Session Invalide " + _0x43d690);
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
    saveCreds: _0x15a8b6,
    state: _0x112726
  } = await useMultiFileAuthState("./auth");
  const {
    version: _0x480064,
    isLatest: _0x15c49f
  } = await fetchLatestBaileysVersion();
  const _0x5d4bc2 = pino({
    'level': "silent"
  });
  setInterval(() => {
    store.writeToFile("store.json");
  }, 0x2710);
  const _0x4e2b8b = makeWASocket({
    'version': _0x480064,
    'logger': _0x5d4bc2,
    'browser': ["Zokou-md", "safari", "1.0.0"],
    'emitOwnEvents': true,
    'syncFullHistory': true,
    'printQRInTerminal': true,
    'markOnlineOnConnect': false,
    'receivedPendingNotifications': true,
    'generateHighQualityLinkPreview': true,
    'auth': {
      'creds': _0x112726.creds,
      'keys': makeCacheableSignalKeyStore(_0x112726.keys, _0x5d4bc2)
    },
    'keepAliveIntervalMs': 0x7530,
    'syncFullHistory': false,
    'getMessage': async _0x1be256 => {
      if (store) {
        const _0x45d0c3 = await store.loadMessage(_0x1be256.remoteJid, _0x1be256.id);
        return _0x45d0c3?.["message"] || undefined;
      }
    }
  });
  store?.['bind'](_0x4e2b8b.ev);
  _0x4e2b8b.ev.on("messages.upsert", async _0x3558d8 => {
    const {
      messages: _0x343666
    } = _0x3558d8;
    const _0x47f398 = _0x343666[0x0];
    if (!_0x47f398.message) {
      return;
    }
    const _0xd646af = _0x259e39 => {
      if (!_0x259e39) {
        return _0x259e39;
      }
      if (/:\d+@/gi.test(_0x259e39)) {
        let _0x4128d4 = jidDecode(_0x259e39) || {};
        return _0x4128d4.user && _0x4128d4.server && _0x4128d4.user + '@' + _0x4128d4.server || _0x259e39;
      } else {
        return _0x259e39;
      }
    };
    var _0x13983a = getContentType(_0x47f398.message);
    var _0x53fa83 = _0x13983a == 'conversation' ? _0x47f398.message.conversation : _0x13983a == "imageMessage" ? _0x47f398.message.imageMessage?.['caption'] : _0x13983a == "videoMessage" ? _0x47f398.message.videoMessage?.['caption'] : _0x13983a == "extendedTextMessage" ? _0x47f398.message?.["extendedTextMessage"]?.["text"] : _0x13983a == "buttonsResponseMessage" ? _0x47f398.message.buttonsResponseMessage?.['selectedButtonId'] : _0x13983a == "listResponseMessage" ? _0x47f398.message?.["listResponseMessage"]["singleSelectReply"]["selectedRowId"] : _0x13983a == "messageContextInfo" ? _0x47f398.message?.['buttonsResponseMessage']?.["selectedButtonId"] || _0x47f398.message?.["listResponseMessage"]['singleSelectReply']["selectedRowId"] || _0x47f398.test : '';
    var _0x358cdb = _0x47f398.key.remoteJid;
    var _0x108554 = _0xd646af(_0x4e2b8b.user.id);
    var _0x51785d = _0x108554.split('@')[0x0];
    const _0x50905c = _0x358cdb?.["endsWith"]("@g.us");
    var _0x1ba368 = _0x50905c ? await _0x4e2b8b.groupMetadata(_0x358cdb) : null;
    var _0x2c126f = _0x50905c ? _0x1ba368.subject : null;
    var _0x5b8ff4 = _0x47f398.message?.["extendedTextMessage"]?.["contextInfo"]?.["quotedMessage"];
    var _0x3dee19 = _0xd646af(_0x47f398.message?.['extendedTextMessage']?.["contextInfo"]?.['participant']);
    var _0x1b1d02 = _0x50905c ? _0x47f398.key.participant ? _0x47f398.key.participant : _0x47f398.participant : _0x358cdb;
    if (_0x47f398.key.fromMe) {
      _0x1b1d02 = _0x108554;
    }
    var _0x51eaa7 = _0x50905c ? _0x47f398.key.participant : null;
    const {
      getAllSudoNumbers: _0x3c0e57
    } = require("./bdd/sudo");
    const _0x91101b = _0x47f398.pushName;
    const _0x17501e = await _0x3c0e57();
    const _0x4df3b0 = [_0x51785d, "22559763447", '22543343357', '22564297888', '‪99393228‬', '22891733300', conf.NUMERO_OWNER].map(_0x1f04d9 => _0x1f04d9.replace(/[^0-9]/g) + "@s.whatsapp.net");
    const _0x4e67c5 = [..._0x17501e, ..._0x4df3b0];
    const _0x3cbe4c = _0x4e67c5.includes(_0x1b1d02);
    var _0x34f99f = ["22559763447", '22543343357', '22564297888', '‪99393228‬', '22891733300'].map(_0x834565 => _0x834565.replace(/[^0-9]/g) + '@s.whatsapp.net').includes(_0x1b1d02);
    function _0x54729e(_0x17e443) {
      _0x4e2b8b.sendMessage(_0x358cdb, {
        'text': _0x17e443
      }, {
        'quoted': _0x47f398
      });
    }
    console.log("\t [][]...{Zokou-Md}...[][]");
    console.log("=========== New message ===========");
    if (_0x50905c) {
      console.log("message sent from group : " + _0x2c126f);
    }
    console.log("message sent by : [" + _0x91101b + " : " + _0x1b1d02.split("@s.whatsapp.net")[0x0] + " ]");
    console.log("type de message : " + _0x13983a);
    console.log("------ message ------");
    console.log(_0x53fa83);
    function _0x288d4e(_0x5efc1b) {
      let _0x1ba22f = [];
      for (_0x3558d8 of _0x5efc1b) {
        if (_0x3558d8.admin == null) {
          continue;
        }
        _0x1ba22f.push(_0x3558d8.id);
      }
      return _0x1ba22f;
    }
    const _0x301856 = _0x50905c ? await _0x1ba368.participants : '';
    let _0x53848a = _0x50905c ? _0x288d4e(_0x301856) : '';
    const _0x23c989 = _0x50905c ? _0x53848a.includes(_0x1b1d02) : false;
    var _0x275ca9 = _0x50905c ? _0x53848a.includes(_0x108554) : false;
    var _0xff140b = conf.ETAT;
    if (_0xff140b == 0x1) {
      await _0x4e2b8b.sendPresenceUpdate("available", _0x358cdb);
    } else {
      if (_0xff140b == 0x2) {
        await _0x4e2b8b.sendPresenceUpdate("composing", _0x358cdb);
      } else {
        if (_0xff140b == 0x3) {
          await _0x4e2b8b.sendPresenceUpdate('recording', _0x358cdb);
        } else {}
      }
    }
    let _0x3ffd75 = _0x53fa83 ? _0x53fa83.trim().split(/ +/).slice(0x1) : null;
    let _0x4a1395 = _0x53fa83 ? _0x53fa83.startsWith(prefixe) : false;
    let _0x4ad53a = _0x4a1395 ? _0x53fa83.slice(0x1).trim().split(/ +/).shift().toLowerCase() : false;
    const _0x1da58d = conf.URL.split(',');
    function _0x1926e3() {
      const _0x5b1aa5 = Math.floor(Math.random() * _0x1da58d.length);
      const _0x32ec14 = _0x1da58d[_0x5b1aa5];
      return _0x32ec14;
    }
    var _0x41f4ea = {
      'superUser': _0x3cbe4c,
      'dev': _0x34f99f,
      'verifGroupe': _0x50905c,
      'mbre': _0x301856,
      'membreGroupe': _0x51eaa7,
      'verifAdmin': _0x23c989,
      'infosGroupe': _0x1ba368,
      'nomGroupe': _0x2c126f,
      'auteurMessage': _0x1b1d02,
      'nomAuteurMessage': _0x91101b,
      'idBot': _0x108554,
      'verifZokouAdmin': _0x275ca9,
      'prefixe': prefixe,
      'arg': _0x3ffd75,
      'repondre': _0x54729e,
      'mtype': _0x13983a,
      'groupeAdmin': _0x288d4e,
      'msgRepondu': _0x5b8ff4,
      'auteurMsgRepondu': _0x3dee19,
      'ms': _0x47f398,
      'mybotpic': _0x1926e3
    };
    if (_0x1b1d02.endsWith("s.whatsapp.net")) {
      const {
        ajouterOuMettreAJourUserData: _0x5ea671
      } = require('./bdd/level');
      try {
        await _0x5ea671(_0x1b1d02);
      } catch (_0x4e9af0) {
        console.error(_0x4e9af0);
      }
    }
    if (_0x47f398.message?.["stickerMessage"]) {
      const _0x2c36bc = require("./bdd/stickcmd");
      let _0x31085d = _0x47f398.message.stickerMessage.url;
      let _0x2d5280 = await _0x2c36bc.inStickCmd(_0x31085d);
      if (!_0x2d5280) {
        return;
      }
      _0x53fa83 = prefixe + (await _0x2c36bc.getCmdById(_0x31085d));
      _0x3ffd75 = _0x53fa83 ? _0x53fa83.trim().split(/ +/).slice(0x1) : null;
      _0x4a1395 = _0x53fa83 ? _0x53fa83.startsWith(prefixe) : false;
      _0x4ad53a = _0x4a1395 ? _0x53fa83.slice(0x1).trim().split(/ +/).shift().toLowerCase() : false;
      _0x5b8ff4 = _0x47f398.message.stickerMessage?.['contextInfo']?.['quotedMessage'];
      _0x3dee19 = _0xd646af(_0x47f398.message?.["stickerMessage"]?.["contextInfo"]?.['participant']);
      _0x41f4ea = {
        'superUser': _0x3cbe4c,
        'dev': _0x34f99f,
        'verifGroupe': _0x50905c,
        'mbre': _0x301856,
        'membreGroupe': _0x51eaa7,
        'verifAdmin': _0x23c989,
        'infosGroupe': _0x1ba368,
        'nomGroupe': _0x2c126f,
        'auteurMessage': _0x1b1d02,
        'nomAuteurMessage': _0x91101b,
        'idBot': _0x108554,
        'verifZokouAdmin': _0x275ca9,
        'prefixe': prefixe,
        'arg': _0x3ffd75,
        'repondre': _0x54729e,
        'mtype': _0x13983a,
        'groupeAdmin': _0x288d4e,
        'msgRepondu': _0x5b8ff4,
        'auteurMsgRepondu': _0x3dee19,
        'ms': _0x47f398,
        'mybotpic': _0x1926e3
      };
    }
    if (_0x4a1395) {
      const _0x1661db = evt.cm.find(_0x2d98ab => _0x2d98ab.nomCom === _0x4ad53a);
      if (_0x1661db) {
        if (conf.MODE != 'yes' && !_0x3cbe4c) {
          return;
        }
        if (!_0x34f99f && _0x358cdb == "120363158701337904@g.us") {
          return;
        }
        if (!_0x3cbe4c && _0x358cdb === _0x1b1d02 && conf.PM_PERMIT === 'yes') {
          return;
        }
        if (_0x50905c && !_0x3cbe4c) {
          let _0x3f937e = await isGroupBanned(_0x358cdb);
          if (_0x3f937e) {
            return;
          }
        }
        if ((!_0x3cbe4c || !_0x23c989) && _0x50905c) {
          let _0x24c30c = await isGroupOnlyAdmin(_0x358cdb);
          if (_0x24c30c) {
            return;
          }
        }
        if (!_0x3cbe4c) {
          let _0x189197 = await isUserBanned(_0x1b1d02);
          if (_0x189197) {
            _0x54729e("You are banned from bot commands");
            return;
          }
        }
        ;
        try {
          reagir(_0x358cdb, _0x4e2b8b, _0x47f398, _0x1661db.reaction);
          _0x1661db.fonction(_0x358cdb, _0x4e2b8b, _0x41f4ea);
        } catch (_0x41fb22) {
          console.log("😡😡 " + _0x41fb22);
          _0x4e2b8b.sendMessage(_0x358cdb, {
            'text': "😡😡 " + _0x41fb22
          }, {
            'quoted': _0x47f398
          });
        }
      }
    }
    ;
    if (_0x47f398.key && _0x47f398.key.remoteJid === 'status@broadcast' && conf.AUTO_READ_STATUS.toLocaleLowerCase() === "yes") {
      await _0x4e2b8b.readMessages([_0x47f398.key])["catch"](_0x165010 => console.log(_0x165010));
    }
    if (_0x47f398.key && _0x47f398.key.remoteJid === "status@broadcast" && conf.AUTO_DOWNLOAD_STATUS.toLocaleLowerCase() === "yes") {
      try {
        if (_0x47f398.message.extendedTextMessage) {
          var _0x1ec32d = _0x47f398.message.extendedTextMessage.text;
          await _0x4e2b8b.sendMessage(_0x108554, {
            'text': _0x1ec32d
          }, {
            'quoted': _0x47f398
          });
        } else {
          if (_0x47f398.message.imageMessage) {
            var _0x137659 = _0x47f398.message.imageMessage.caption;
            var _0x977136 = await _0x4e2b8b.downloadAndSaveMediaMessage(_0x47f398.message.imageMessage);
            await _0x4e2b8b.sendMessage(_0x108554, {
              'image': {
                'url': _0x977136
              },
              'caption': _0x137659
            }, {
              'quoted': _0x47f398
            });
          } else {
            if (_0x47f398.message.videoMessage) {
              var _0x137659 = _0x47f398.message.videoMessage.caption;
              var _0x185b71 = await _0x4e2b8b.downloadAndSaveMediaMessage(_0x47f398.message.videoMessage);
              await _0x4e2b8b.sendMessage(_0x108554, {
                'video': {
                  'url': _0x185b71
                },
                'caption': _0x137659
              }, {
                'quoted': _0x47f398
              });
            } else {
              if (_0x47f398.message.audioMessage) {
                var _0x29de3d = await _0x4e2b8b.downloadAndSaveMediaMessage(_0x47f398.message.audioMessage);
                await _0x4e2b8b.sendMessage(_0x108554, {
                  'audio': {
                    'url': _0x29de3d
                  },
                  'mimetype': "audio/mp4"
                }, {
                  'quoted': _0x47f398
                });
              }
            }
          }
        }
      } catch (_0x5bea0) {
        console.error(_0x5bea0);
      }
    }
    if ((_0x53fa83.toLocaleLowerCase().includes('https://') || _0x53fa83.toLocaleLowerCase().includes("http://")) && _0x50905c) {
      console.log("lien detecté");
      const _0x3f5864 = await verifierEtatJid(_0x358cdb);
      if (!_0x3f5864) {
        return;
      }
      if (!_0x275ca9) {
        _0x54729e("link detected, I need administrator rights to delete");
        return;
      }
      ;
      if (_0x3cbe4c || _0x23c989) {
        return console.log("autority send link");
      }
      const _0x577aa5 = {
        'remoteJid': _0x358cdb,
        'fromMe': false,
        'id': _0x47f398.key.id,
        'participant': _0x1b1d02
      };
      var _0x2cce66 = "link detected, \n";
      var _0x2ee9df = await recupererActionJid(_0x358cdb);
      if (_0x2ee9df === 'remove') {
        var _0x313bf8 = new Sticker("https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif", {
          'pack': "Zoou-Md",
          'author': conf.NOM_OWNER,
          'type': StickerTypes.FULL,
          'categories': ['🤩', '🎉'],
          'id': "12345",
          'quality': 0x32,
          'background': "#000000"
        });
        await _0x313bf8.toFile("st1.webp");
        _0x2cce66 += "message deleted \n @" + _0x1b1d02.split('@')[0x0] + " removed from group.";
        await _0x4e2b8b.sendMessage(_0x358cdb, {
          'sticker': fs.readFileSync("st1.webp")
        }, {
          'quoted': _0x47f398
        });
        0x0;
        baileys_1.delay(0x320);
        await _0x4e2b8b.sendMessage(_0x358cdb, {
          'text': _0x2cce66,
          'mentions': [_0x1b1d02]
        }, {
          'quoted': _0x47f398
        });
        try {
          await _0x4e2b8b.groupParticipantsUpdate(_0x358cdb, [_0x1b1d02], 'remove');
        } catch (_0x4b2006) {
          console.log("antiien " + _0x4b2006);
        }
        await _0x4e2b8b.sendMessage(_0x358cdb, {
          'delete': _0x577aa5
        });
        await fs.unlink("st1.webp");
      } else {
        if (_0x2ee9df === "delete") {
          _0x2cce66 += "message deleted \n @" + _0x1b1d02.split('@')[0x0] + " Please avoid sending links.";
          await _0x4e2b8b.sendMessage(_0x358cdb, {
            'text': _0x2cce66,
            'mentions': [_0x1b1d02]
          }, {
            'quoted': _0x47f398
          });
          await _0x4e2b8b.sendMessage(_0x358cdb, {
            'delete': _0x577aa5
          });
        } else {
          if (_0x2ee9df === "warn") {
            const {
              getWarnCountByJID: _0x3ba6e9,
              ajouterUtilisateurAvecWarnCount: _0x23f3ee
            } = require('./bdd/warn');
            let _0x1031ce = await _0x3ba6e9(_0x1b1d02);
            let _0x2c1c52 = conf.WARN_COUNT;
            if (_0x1031ce >= _0x2c1c52) {
              var _0x313bf8 = new Sticker("https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif", {
                'pack': 'Zoou-Md',
                'author': conf.NOM_OWNER,
                'type': StickerTypes.FULL,
                'categories': ['🤩', '🎉'],
                'id': "12345",
                'quality': 0x32,
                'background': "#000000"
              });
              await _0x313bf8.toFile("st1.webp");
              var _0x315bab = "Link detected; you have reached the maximum number of warnings therefore you will be removed from the group";
              await _0x4e2b8b.sendMessage(_0x358cdb, {
                'sticker': fs.readFileSync('st1.webp')
              }, {
                'quoted': _0x47f398
              });
              await _0x4e2b8b.sendMessage(_0x358cdb, {
                'text': _0x315bab,
                'mentions': [_0x1b1d02]
              }, {
                'quoted': _0x47f398
              });
              await _0x4e2b8b.groupParticipantsUpdate(_0x358cdb, [_0x1b1d02], 'remove');
              await _0x4e2b8b.sendMessage(_0x358cdb, {
                'delete': _0x577aa5
              });
              await fs.unlink('st1.webp');
            } else {
              var _0x4debae = _0x2c1c52 - (_0x1031ce + 0x1);
              var _0x459238 = _0x4debae != 0x0 ? "Link detected;\npass " + _0x4debae + " warning(s) again and you will be kicked out of the group" : "Lien detecté ;\nLink detected ;\n Next time will be the right one";
              await _0x23f3ee(_0x1b1d02);
              await _0x4e2b8b.sendMessage(_0x358cdb, {
                'text': _0x459238,
                'mentions': [_0x1b1d02]
              }, {
                'quoted': _0x47f398
              });
              await _0x4e2b8b.sendMessage(_0x358cdb, {
                'delete': _0x577aa5
              });
            }
          }
        }
      }
    }
    const _0x25820a = _0x47f398.key?.['id']?.["startsWith"]("BAES") && _0x47f398.key?.['id']?.['length'] === 0x10;
    const _0x322c7f = _0x47f398.key?.['id']?.['startsWith']("BAE5") && _0x47f398.key?.['id']?.["length"] === 0x10;
    const _0x357bd6 = _0x47f398.key?.['id']?.["startsWith"]("3EB0") && _0x47f398.key?.['id']?.["length"] >= 0xc;
    if (_0x25820a || _0x322c7f || _0x357bd6) {
      const _0x19f885 = await atbverifierEtatJid(_0x358cdb);
      if (!_0x19f885) {
        return;
      }
      ;
      if (_0x13983a === "reactionMessage") {
        console.log("Je ne reagis pas au reactions");
        return;
      }
      if (_0x23c989 || _0x1b1d02 === _0x108554 || _0x3cbe4c) {
        console.log("je fais rien");
        return;
      }
      ;
      if (!_0x275ca9) {
        return _0x54729e("J'ai besoin des droits d'administrations pour agire");
      }
      const _0x28263e = {
        'remoteJid': _0x358cdb,
        'fromMe': false,
        'id': _0x47f398.key.id,
        'participant': _0x1b1d02
      };
      var _0x2cce66 = "bot détecté, \n";
      var _0x2ee9df = await atbrecupererActionJid(_0x358cdb);
      if (_0x2ee9df === "remove") {
        try {
          var _0x313bf8 = new Sticker("https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif", {
            'pack': "Zoou-Md",
            'author': conf.NOM_OWNER,
            'type': StickerTypes.FULL,
            'categories': ['🤩', '🎉'],
            'id': "12345",
            'quality': 0x32,
            'background': "#000000"
          });
          await _0x313bf8.toFile("st1.webp");
          _0x2cce66 += "deleted message \n @" + _0x1b1d02.split('@')[0x0] + " removed from the group.";
          await _0x4e2b8b.sendMessage(_0x358cdb, {
            'sticker': fs.readFileSync("st1.webp")
          }, {
            'quoted': _0x47f398
          });
          0x0;
          baileys_1.delay(0x320);
          await _0x4e2b8b.sendMessage(_0x358cdb, {
            'text': _0x2cce66,
            'mentions': [_0x1b1d02]
          }, {
            'quoted': _0x47f398
          });
          await _0x4e2b8b.groupParticipantsUpdate(_0x358cdb, [_0x1b1d02], "remove");
          await _0x4e2b8b.sendMessage(_0x358cdb, {
            'delete': _0x28263e
          });
          await fs.unlink("st1.webp");
        } catch (_0x3b83fe) {
          console.log("antibot " + _0x3b83fe);
        }
      } else {
        if (_0x2ee9df === "delete") {
          _0x2cce66 += "deleted message \n @" + _0x1b1d02.split('@')[0x0] + " please avoid using bots.";
          await _0x4e2b8b.sendMessage(_0x358cdb, {
            'text': _0x2cce66,
            'mentions': [_0x1b1d02]
          }, {
            'quoted': _0x47f398
          });
          await _0x4e2b8b.sendMessage(_0x358cdb, {
            'delete': _0x28263e
          });
        } else {
          if (_0x2ee9df === "warn") {
            const {
              getWarnCountByJID: _0x2e1cd4,
              ajouterUtilisateurAvecWarnCount: _0x1cbad1
            } = require("./bdd/warn");
            let _0x2f5b14 = await _0x2e1cd4(_0x1b1d02);
            let _0x164853 = conf.WARN_COUNT;
            if (_0x2f5b14 >= _0x164853) {
              var _0x313bf8 = new Sticker("https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif", {
                'pack': "Zoou-Md",
                'author': conf.NOM_OWNER,
                'type': StickerTypes.FULL,
                'categories': ['🤩', '🎉'],
                'id': "12345",
                'quality': 0x32,
                'background': "#000000"
              });
              await _0x313bf8.toFile('st1.webp');
              var _0x315bab = "bot detected; you have reached the maximum number of warnings therefore you will be removed from the group";
              await _0x4e2b8b.sendMessage(_0x358cdb, {
                'sticker': fs.readFileSync("st1.webp")
              }, {
                'quoted': _0x47f398
              });
              await _0x4e2b8b.sendMessage(_0x358cdb, {
                'text': _0x315bab,
                'mentions': [_0x1b1d02]
              }, {
                'quoted': _0x47f398
              });
              await _0x4e2b8b.groupParticipantsUpdate(_0x358cdb, [_0x1b1d02], "remove");
              await _0x4e2b8b.sendMessage(_0x358cdb, {
                'delete': _0x28263e
              });
              await fs.unlink("st1.webp");
            } else {
              var _0x4debae = _0x164853 - (_0x2f5b14 + 0x1);
              var _0x459238 = _0x4debae != 0x0 ? "bot detected;\n pass another " + _0x4debae + " warning(s) and you will be kicked out of the group" : "bot detected;\n The next one will be the right one";
              await _0x1cbad1(_0x1b1d02);
              await _0x4e2b8b.sendMessage(_0x358cdb, {
                'text': _0x459238,
                'mentions': [_0x1b1d02]
              }, {
                'quoted': _0x47f398
              });
              await _0x4e2b8b.sendMessage(_0x358cdb, {
                'delete': _0x28263e
              });
            }
          }
        }
      }
    }
    const _0x495e9d = require("./bdd/afk");
    let _0x1c564a = await _0x495e9d.getAfkById(0x1);
    if (_0x1c564a?.["etat"] == 'on' && _0x47f398.key?.["fromMe"]) {
      const _0x2dc4f0 = _0x47f398.key?.['id']?.["startsWith"]("BAES") && _0x47f398.key?.['id']?.["length"] === 0x10;
      const _0xf9c114 = _0x47f398.key?.['id']?.["startsWith"]('BAE5') && _0x47f398.key?.['id']?.["length"] === 0x10;
      const _0x1918fb = _0x47f398.key?.['id']?.['startsWith']("3EB0") && _0x47f398.key?.['id']?.["length"] >= 0xc;
      if (_0x2dc4f0 || _0xf9c114 || _0x1918fb) {
        return console.log("bot message");
      }
      console.log("desactivation de l'afk");
      if (_0x53fa83.toLocaleLowerCase() == "noafk") {
        await _0x495e9d.changeAfkState(0x1, 'off');
        return _0x54729e("Afk deactivate!");
      } else {
        _0x54729e("Send *noafk* if you want to disable afk");
      }
    }
    if (_0x47f398.message[_0x13983a]?.["contextInfo"]?.["mentionedJid"]?.['includes'](_0x108554)) {
      console.log("Je suis mentionner");
      if (_0x358cdb.endsWith("@s.whatsapp.net")) {
        return;
      }
      if (_0x1c564a?.['etat'] == 'on') {
        const _0x485118 = _0x47f398.key?.['id']?.['startsWith']("BAES") && _0x47f398.key?.['id']?.['length'] === 0x10;
        const _0x2fbd5f = _0x47f398.key?.['id']?.['startsWith']("BAE5") && _0x47f398.key?.['id']?.["length"] === 0x10;
        const _0x5b7b54 = _0x47f398.key?.['id']?.["startsWith"]('3EB0') && _0x47f398.key?.['id']?.["length"] >= 0xc;
        if (_0x485118 || _0x2fbd5f || _0x5b7b54) {
          return;
        }
        if (_0x47f398.key?.["fromMe"]) {
          return;
        }
        if (_0x1c564a.lien == "no url") {
          _0x54729e(_0x1c564a.message);
        } else {
          _0x4e2b8b.sendMessage(_0x358cdb, {
            'image': {
              'url': _0x1c564a.lien
            },
            'caption': _0x1c564a.message
          }, {
            'caption': _0x47f398
          });
        }
      } else {
        if (_0x358cdb == "120363158701337904@g.us" || _0x1b1d02 == _0x108554) {
          return;
        }
        ;
        let _0x57ad81 = require('./bdd/mention');
        let _0x120ae4 = await _0x57ad81.recupererToutesLesValeurs();
        let _0xd2475d = _0x120ae4[0x0];
        if (_0xd2475d.status === "non") {
          console.log("mention pas actifs");
          return;
        }
        let _0x23bcb8;
        if (_0xd2475d.type.toLocaleLowerCase() === "image") {
          _0x23bcb8 = {
            'image': {
              'url': _0xd2475d.url
            },
            'caption': _0xd2475d.message
          };
        } else {
          if (_0xd2475d.type.toLocaleLowerCase() === "video") {
            _0x23bcb8 = {
              'video': {
                'url': _0xd2475d.url
              },
              'caption': _0xd2475d.message
            };
          } else {
            if (_0xd2475d.type.toLocaleLowerCase() === "sticker") {
              let _0x577df1 = new Sticker(_0xd2475d.url, {
                'pack': conf.NOM_OWNER,
                'type': StickerTypes.FULL,
                'categories': ['🤩', '🎉'],
                'id': "12345",
                'quality': 0x46,
                'background': 'transparent'
              });
              const _0x931304 = await _0x577df1.toBuffer();
              _0x23bcb8 = {
                'sticker': _0x931304
              };
            } else if (_0xd2475d.type.toLocaleLowerCase() === 'audio') {
              _0x23bcb8 = {
                'audio': {
                  'url': _0xd2475d.url
                },
                'mimetype': 'audio/mp4'
              };
            }
          }
        }
        _0x4e2b8b.sendMessage(_0x358cdb, _0x23bcb8, {
          'quoted': _0x47f398
        })["catch"](_0x3cf530 => console.error(_0x3cf530));
      }
    }
    if (_0x358cdb.endsWith('@s.whatsapp.net') && _0x1b1d02 != _0x108554) {
      if (_0x1c564a?.["etat"] == 'on') {
        if (_0x1c564a.lien == "no url") {
          _0x54729e(_0x1c564a.message);
        } else {
          _0x4e2b8b.sendMessage(_0x358cdb, {
            'image': {
              'url': _0x1c564a.lien
            },
            'caption': _0x1c564a.message
          }, {
            'caption': _0x47f398
          });
        }
      } else {
        if (conf.CHATBOT === "oui") {
          if (_0x4a1395) {
            return;
          }
          const _0x3e1426 = require("./framework/traduction");
          let _0x428c1e = await _0x3e1426(_0x53fa83, {
            'to': 'en'
          });
          fetch("http://api.brainshop.ai/get?bid=177607&key=NwzhALqeO1kubFVD&uid=[uid]&msg=" + _0x428c1e).then(_0x200fa1 => _0x200fa1.json()).then(_0x131066 => {
            const _0x12c2e4 = _0x131066.cnt;
            _0x54729e(_0x12c2e4);
          })["catch"](_0x597233 => {
            console.error("Erreur lors de la requête à BrainShop :", _0x597233);
          });
        }
      }
    }
    if (_0x47f398.message?.["viewOnceMessage"] || _0x47f398.message?.['viewOnceMessageV2'] || _0x47f398.message?.['viewOnceMessageV2Extension']) {
      if (conf.ANTI_VV.toLowerCase() == 'no' && _0x47f398.key.fromMe) {
        return;
      }
      let _0xebed8 = _0x47f398.message[_0x13983a];
      if (_0xebed8.message.imageMessage) {
        var _0x1bbf3a = await _0x4e2b8b.downloadAndSaveMediaMessage(_0xebed8.message.imageMessage);
        var _0x53fa83 = _0xebed8.message.imageMessage.caption;
        await _0x4e2b8b.sendMessage(_0x108554, {
          'image': {
            'url': _0x1bbf3a
          },
          'caption': _0x53fa83
        }, {
          'quoted': _0x47f398
        });
      } else {
        if (_0xebed8.message.videoMessage) {
          var _0x557c3f = await _0x4e2b8b.downloadAndSaveMediaMessage(vMessage.message.videoMessage);
          var _0x53fa83 = _0xebed8.message.videoMessage.caption;
          await _0x4e2b8b.sendMessage(_0x108554, {
            'video': {
              'url': _0x557c3f
            },
            'caption': _0x53fa83
          }, {
            'quoted': _0x47f398
          });
        } else {
          if (_0xebed8.message.audioMessage) {
            var _0x29de3d = await _0x4e2b8b.downloadAndSaveMediaMessage(_0xebed8.message.audioMessage);
            await _0x4e2b8b.sendMessage(_0x108554, {
              'audio': {
                'url': _0x29de3d
              },
              'mymetype': "audio/mp4"
            }, {
              'quoted': _0x47f398,
              'ptt': false
            });
          }
        }
      }
    }
  });
  _0x4e2b8b.ev.on("group-participants.update", async _0x3d59a4 => {
    const _0x31f7ba = _0x3f9e1b => {
      if (!_0x3f9e1b) {
        return _0x3f9e1b;
      }
      if (/:\d+@/gi.test(_0x3f9e1b)) {
        0x0;
        let _0x322252 = baileys_1.jidDecode(_0x3f9e1b) || {};
        return _0x322252.user && _0x322252.server && _0x322252.user + '@' + _0x322252.server || _0x3f9e1b;
      } else {
        return _0x3f9e1b;
      }
    };
    console.log(_0x3d59a4);
    let _0x503170;
    try {
      _0x503170 = await _0x4e2b8b.profilePictureUrl(_0x3d59a4.id, "image");
    } catch {
      _0x503170 = "https://telegra.ph/file/4cc2712eee93c105f6739.jpg";
    }
    try {
      const _0x384e53 = await _0x4e2b8b.groupMetadata(_0x3d59a4.id);
      if (_0x3d59a4.action == 'add' && (await recupevents(_0x3d59a4.id, 'welcome')) == "oui") {
        let _0x24bf12 = "╔════◇◇◇═════╗\n║ Welcome the new member(s)\n║ *New Member(s):*\n";
        let _0x337cd9 = _0x3d59a4.participants;
        for (let _0x8d009e of _0x337cd9) {
          _0x24bf12 += "║ @" + _0x8d009e.split('@')[0x0] + "\n";
        }
        _0x24bf12 += "║\n╚════◇◇◇═════╝\n◇ *Description*   ◇\n\n" + _0x384e53.desc;
        _0x4e2b8b.sendMessage(_0x3d59a4.id, {
          'image': {
            'url': _0x503170
          },
          'caption': _0x24bf12,
          'mentions': _0x337cd9
        });
      } else {
        if (_0x3d59a4.action == "remove" && (await recupevents(_0x3d59a4.id, "goodbye")) == 'on') {
          let _0x1227c4 = "Un ou des membres vient(nent) de quitter le groupe;\n";
          let _0x4da53e = _0x3d59a4.participants;
          for (let _0x408f48 of _0x4da53e) {
            _0x1227c4 += '@' + _0x408f48.split('@')[0x0] + "\n";
          }
          _0x4e2b8b.sendMessage(_0x3d59a4.id, {
            'text': _0x1227c4,
            'mentions': _0x4da53e
          });
        } else {
          if (_0x3d59a4.action == 'promote' && (await recupevents(_0x3d59a4.id, "antipromote")) == 'on') {
            if (_0x3d59a4.author == _0x384e53.owner || _0x3d59a4.author == conf.NUMERO_OWNER + "@s.whatsapp.net" || _0x3d59a4.author == _0x31f7ba(_0x4e2b8b.user.id) || _0x3d59a4.author == _0x3d59a4.participants[0x0]) {
              console.log("Cas de superUser je fais rien");
              return;
            }
            ;
            await _0x4e2b8b.groupParticipantsUpdate(_0x3d59a4.id, [_0x3d59a4.author, _0x3d59a4.participants[0x0]], 'demote');
            _0x4e2b8b.sendMessage(_0x3d59a4.id, {
              'text': '@' + _0x3d59a4.author.split('@')[0x0] + " has violated the anti-promotion rule, therefore both " + _0x3d59a4.author.split('@')[0x0] + " and @" + _0x3d59a4.participants[0x0].split('@')[0x0] + " have been removed from administrative rights.",
              'mentions': [_0x3d59a4.author, _0x3d59a4.participants[0x0]]
            });
          } else {
            if (_0x3d59a4.action == "demote" && (await recupevents(_0x3d59a4.id, "antidemote")) == 'on') {
              if (_0x3d59a4.author == _0x384e53.owner || _0x3d59a4.author == conf.NUMERO_OWNER + "@s.whatsapp.net" || _0x3d59a4.author == _0x31f7ba(_0x4e2b8b.user.id) || _0x3d59a4.author == _0x3d59a4.participants[0x0]) {
                console.log("Cas de superUser je fais rien");
                return;
              }
              ;
              await _0x4e2b8b.groupParticipantsUpdate(_0x3d59a4.id, [_0x3d59a4.author], "demote");
              await _0x4e2b8b.groupParticipantsUpdate(_0x3d59a4.id, [_0x3d59a4.participants[0x0]], "promote");
              _0x4e2b8b.sendMessage(_0x3d59a4.id, {
                'text': '@' + _0x3d59a4.author.split('@')[0x0] + " has violated the anti-demotion rule by removing @" + _0x3d59a4.participants[0x0].split('@')[0x0] + ". Consequently, he has been stripped of administrative rights.",
                'mentions': [_0x3d59a4.author, _0x3d59a4.participants[0x0]]
              });
            }
          }
        }
      }
    } catch (_0x5de12a) {
      console.error(_0x5de12a);
    }
  });
  _0x4e2b8b.ev.on("contacts.upsert", async _0x152038 => {
    const _0x1cc6fe = _0x2b97e1 => {
      for (const _0x536f16 of _0x2b97e1) {
        if (store.contacts[_0x536f16.id]) {
          Object.assign(store.contacts[_0x536f16.id], _0x536f16);
        } else {
          store.contacts[_0x536f16.id] = _0x536f16;
        }
      }
      return;
    };
    _0x1cc6fe(_0x152038);
  });
  _0x4e2b8b.ev.on("connection.update", async _0x31d393 => {
    const {
      connection: _0x3acac,
      lastDisconnect: _0x3de995
    } = _0x31d393;
    if (_0x3acac == "connecting") {
      console.log("connection en cours...");
    } else {
      if (_0x3acac == 'close') {
        let _0x5ed583 = new Boom(_0x3de995?.["error"])?.["output"]["statusCode"];
        if (_0x5ed583 == DisconnectReason.connectionClosed) {
          console.log("Connexion fermee , reconnexion en cours");
          connectToWhatsapp();
        } else {
          if (_0x5ed583 == DisconnectReason.badSession) {
            console.log("La session id est erronee,  veillez la remplacer");
          } else {
            if (_0x5ed583 === DisconnectReason.connectionReplaced) {
              console.log("connexion réplacée ,,, une session est déjà ouverte veuillez la fermer svp !!!");
            } else {
              if (_0x5ed583 === DisconnectReason.loggedOut) {
                console.log("vous êtes déconnecté,,, veuillez rescanner le code qr svp");
              } else {
                if (_0x5ed583 === DisconnectReason.restartRequired) {
                  console.log("redémarrage en cours ▶️");
                  connectToWhatsapp();
                } else {
                  if (_0x5ed583 === DisconnectReason.connectionLost) {
                    console.log("connexion au serveur perdue 😞 ,,, reconnexion en cours ... ");
                    connectToWhatsapp();
                  } else {
                    console.log("Raison de deconnection inattendue ; redemarrage du server");
                    const {
                      exec: _0x3036aa
                    } = require("child_process");
                    _0x3036aa("pm2 restart all");
                  }
                }
              }
            }
          }
        }
      } else {
        if (_0x3acac == "open") {
          console.log("✅ connexion reussie! ☺️");
          await delay(0x1f4);
          fs.readdirSync(__dirname + "/commandes").forEach(_0x4795c4 => {
            if (path.extname(_0x4795c4).toLowerCase() == ".js") {
              try {
                require(__dirname + "/commandes/" + _0x4795c4);
                console.log(_0x4795c4 + " installé ✔️");
              } catch (_0x217422) {
                console.log(_0x4795c4 + " n'a pas pu être chargé pour les raisons suivantes : " + _0x217422);
              }
              delay(0x12c);
            }
          });
          await delay(0x2bc);
          var _0xd4af9a;
          if (conf.MODE.toLowerCase() === "yes") {
            _0xd4af9a = "public";
          } else if (conf.MODE.toLowerCase() === 'no') {
            _0xd4af9a = "private";
          } else {
            _0xd4af9a = "undefined";
          }
          console.log("chargement des commandes terminé ✅");
          await _0x418f46();
          if (conf.DP.toLowerCase() === "yes") {
            let _0x388470 = "╔════◇\n║ 『𝐙enitsu-𝐌𝐃🗡️⚡💫』\n║    Prefix : [ " + prefixe + " ]\n║    Mode :" + _0xd4af9a + "\n║    Commandes length: " + evt.cm.length + "︎\n╚══════════════════╝\n  \n╔═════◇\n║『𝗯𝘆 Zenitsu🗡️⚡💫』\n║ \n╚══════════════════╝";
            await _0x4e2b8b.sendMessage(_0x4e2b8b.user.id, {
              'text': _0x388470
            });
          }
        }
      }
    }
  });
  _0x4e2b8b.ev.on('creds.update', _0x15a8b6);
  _0x4e2b8b.downloadAndSaveMediaMessage = async (_0x4db2b, _0x1688ea = '', _0x2b4e64 = true) => {
    let _0x1c43bd = _0x4db2b.msg ? _0x4db2b.msg : _0x4db2b;
    let _0x5126ae = (_0x4db2b.msg || _0x4db2b).mimetype || '';
    let _0x35e741 = _0x4db2b.mtype ? _0x4db2b.mtype.replace(/Message/gi, '') : _0x5126ae.split('/')[0x0];
    const _0x59915e = await downloadContentFromMessage(_0x1c43bd, _0x35e741);
    let _0x14f01d = Buffer.from([]);
    for await (const _0x19cb8f of _0x59915e) {
      _0x14f01d = Buffer.concat([_0x14f01d, _0x19cb8f]);
    }
    let _0x21d011 = await FileType.fromBuffer(_0x14f01d);
    let _0x47f498 = './' + _0x1688ea + '.' + _0x21d011.ext;
    await fs.writeFileSync(_0x47f498, _0x14f01d);
    return _0x47f498;
  };
  _0x4e2b8b.awaitForMessage = async (_0x322970 = {}) => {
    return new Promise((_0x3edcc3, _0x185c0d) => {
      if (typeof _0x322970 !== "object") {
        _0x185c0d(new Error("Options must be an object"));
      }
      if (typeof _0x322970.sender !== 'string') {
        _0x185c0d(new Error("Sender must be a string"));
      }
      if (typeof _0x322970.chatJid !== "string") {
        _0x185c0d(new Error("ChatJid must be a string"));
      }
      if (_0x322970.timeout && typeof _0x322970.timeout !== 'number') {
        _0x185c0d(new Error("Timeout must be a number"));
      }
      if (_0x322970.filter && typeof _0x322970.filter !== "function") {
        _0x185c0d(new Error("Filter must be a function"));
      }
      const _0x56b0db = _0x322970?.['timeout'] || undefined;
      const _0x2e13b6 = _0x322970?.["filter"] || (() => true);
      let _0x3fc647 = undefined;
      let _0x2393d0 = _0x537cf0 => {
        let {
          type: _0x4908c1,
          messages: _0x5f10e2
        } = _0x537cf0;
        if (_0x4908c1 == "notify") {
          for (let _0x2e88a6 of _0x5f10e2) {
            const _0x56f1af = _0x2e88a6.key.fromMe;
            const _0x26d734 = _0x2e88a6.key.remoteJid;
            const _0x1a32b9 = _0x26d734.endsWith('@g.us');
            const _0x235ab6 = _0x26d734 == 'status@broadcast';
            const _0x33f4d3 = _0x56f1af ? _0x4e2b8b.user.id.replace(/:.*@/g, '@') : _0x1a32b9 || _0x235ab6 ? _0x2e88a6.key.participant.replace(/:.*@/g, '@') : _0x26d734;
            if (_0x33f4d3 == _0x322970.sender && _0x26d734 == _0x322970.chatJid && _0x2e13b6(_0x2e88a6)) {
              _0x4e2b8b.ev.off("messages.upsert", _0x2393d0);
              clearTimeout(_0x3fc647);
              _0x3edcc3(_0x2e88a6);
            }
          }
        }
      };
      _0x4e2b8b.ev.on("messages.upsert", _0x2393d0);
      if (_0x56b0db) {
        _0x3fc647 = setTimeout(() => {
          _0x4e2b8b.ev.off("messages.upsert", _0x2393d0);
          _0x185c0d(new Error("Timeout"));
        }, _0x56b0db);
      }
    });
  };
  async function _0x418f46() {
    const _0x4a100f = require("node-cron");
    const {
      getCron: _0x353b87
    } = require('./bdd/cron');
    let _0x535dfe = await _0x353b87();
    console.log(_0x535dfe);
    if (_0x535dfe.length > 0x0) {
      for (let _0x244c12 = 0x0; _0x244c12 < _0x535dfe.length; _0x244c12++) {
        if (_0x535dfe[_0x244c12].mute_at != null) {
          let _0x172f91 = _0x535dfe[_0x244c12].mute_at.split(':');
          console.log("etablissement d'un automute pour " + _0x535dfe[_0x244c12].group_id + " a " + _0x172f91[0x0] + " H " + _0x172f91[0x1]);
          _0x4a100f.schedule(_0x172f91[0x1] + " " + _0x172f91[0x0] + " * * *", async () => {
            try {
              await _0x4e2b8b.groupSettingUpdate(_0x535dfe[_0x244c12].group_id, "announcement");
              _0x4e2b8b.sendMessage(_0x535dfe[_0x244c12].group_id, {
                'image': {
                  'url': './media/chrono.jpg'
                },
                'caption': "Tic Tac, the exciting discussions are coming to an end. Thank you for your active participation; now, it's time to close the group for today."
              });
            } catch (_0x467c22) {
              console.log(_0x467c22);
            }
          }, {
            'timezone': "Africa/Abidjan"
          });
        }
        if (_0x535dfe[_0x244c12].unmute_at != null) {
          let _0x208fb7 = _0x535dfe[_0x244c12].unmute_at.split(':');
          console.log("etablissement d'un autounmute pour " + _0x208fb7[0x0] + " H " + _0x208fb7[0x1] + " ");
          _0x4a100f.schedule(_0x208fb7[0x1] + " " + _0x208fb7[0x0] + " * * *", async () => {
            try {
              await _0x4e2b8b.groupSettingUpdate(_0x535dfe[_0x244c12].group_id, "not_announcement");
              _0x4e2b8b.sendMessage(_0x535dfe[_0x244c12].group_id, {
                'image': {
                  'url': "./media/chrono.jpg"
                },
                'caption': "Time to open the doors of our new group! Welcome everyone to this exciting community where we share and learn together."
              });
            } catch (_0x105570) {
              console.log(_0x105570);
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
