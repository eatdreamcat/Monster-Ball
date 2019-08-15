window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AudioController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6bfadvomfpBW76yybhNYu6p", "AudioController");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var HashMap_1 = require("../Utils/HashMap");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var Game_1 = require("../Game/Game");
    var table_1 = require("../table");
    var Config_1 = require("../Config/Config");
    var AudioController = function() {
      function AudioController() {
        this.clips = new HashMap_1.HashMap();
        this.bgmAudioID = -1;
        this.curBgmName = "";
        this.rocketMoveAudioID = -1;
      }
      Object.defineProperty(AudioController, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new AudioController();
        },
        enumerable: true,
        configurable: true
      });
      AudioController.prototype.init = function(callback) {
        var self = this;
        cc.loader.loadResDir("sounds", cc.AudioClip, function(err, clips, urls) {
          if (err) console.error(err); else {
            for (var _i = 0, clips_1 = clips; _i < clips_1.length; _i++) {
              var clip = clips_1[_i];
              self.clips.add(clip.name, clip);
            }
            self.initEvent();
            self.play("Normal_BGM", true);
            callback && callback();
          }
        });
      };
      AudioController.prototype.initEvent = function() {
        var _this = this;
        EventManager_1.gEventMgr.targetOff(this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.JUMP, function(ballID) {
          _this.play(ballID + "-jump", false, 1);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_ATTACK, function(monsterID) {
          var staticMonsterID = monsterID.split("-")[1];
          _this.play(staticMonsterID + "-attack", false, 1);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_ADD, function(monsterID) {
          _this.play(monsterID + "-attack", false, 1);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_ATTACK_DONE, function() {
          _this.play("boom", false, 1);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PRE_SELECT_BALL, function(ballID) {
          _this.play(ballID + "-ready", false, 1);
          _this.play("change_tab", false, 1);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.CHANGE_CUR_BALL, function(ball) {
          if (ball) _this.rocketMoveAudioID = _this.play(ball.BallID + "-move", true, 1); else {
            -1 != _this.rocketMoveAudioID && _this.stop("2002-move", _this.rocketMoveAudioID);
            _this.rocketMoveAudioID = -1;
          }
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_BALL_ITEM_NUMBER, function(ballID) {
          _this.play(ballID + "-boom", false, 1);
        });
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.ADD_EFFECT, function(effectType, pos, isRocket) {
          switch (effectType) {
           case Config_1.EffectType.Boom:
            _this.play("2002-boom", false, 1);
          }
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.BALL_HIT, function() {
          _this.play("ball_hit", false, 1);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MAINUI_TOUCH, function() {
          _this.play("UI_click", false, 1);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.BOSS_ZAI_STEP, function(step) {
          _this.play("1017-step" + step, false);
        });
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.BOSS_WARNING, function() {
          _this.play("warnning", false, 1);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.ITEM_USE, function(type, itemID, __) {
          _this.play("item-" + itemID, false, 1);
          switch (type) {
           case table_1.Monster_ball_prop_form.HuiFuNaiJiuDu:
           case table_1.Monster_ball_prop_form.JiaFenShu:
           case table_1.Monster_ball_prop_form.QuanBuGuaiWuTingDun:
            break;

           case table_1.Monster_ball_prop_form.QuanPingGongJiGuaiWu:
            _this.play("plane_queue", false);
          }
        });
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.CHANGE_GAME_SCENE, function() {
          var isBossLevel = Game_1.Game.levelStaticInfo.form == table_1.Monster_ball_paly_level_form.BOSSGuan;
          var bgmName = isBossLevel ? "Boss_BGM" : "Normal_BGM";
          if (bgmName != _this.curBgmName) {
            -1 != _this.bgmAudioID && _this.stop(_this.curBgmName, _this.bgmAudioID);
            _this.bgmAudioID = _this.play(bgmName, true, .7);
            _this.curBgmName = bgmName;
          }
        }, this);
      };
      AudioController.prototype.stop = function(clipName, audioID) {
        if (AudioController.canPlay) cc.audioEngine.stop(audioID); else for (var _i = 0, _a = AudioController.PlayedList; _i < _a.length; _i++) {
          var clipItem = _a[_i];
          clipItem.skip = clipItem.clipName == clipName;
        }
      };
      AudioController.prototype.play = function(clipName, loop, volume) {
        void 0 === volume && (volume = 1);
        if (!AudioController.canPlay && !AudioController.hasBindTouch) {
          AudioController.hasBindTouch = true;
          var self_1 = this;
          var playFunc_1 = function() {
            cc.game.canvas.removeEventListener("touchstart", playFunc_1);
            AudioController.canPlay = true;
            var item;
            while ((item = AudioController.PlayedList.pop()) && self_1.clips.get(item.clipName) && !item.skip) {
              var audioID = cc.audioEngine.play(self_1.clips.get(item.clipName), item.loop, item.volume);
              cc.audioEngine.setCurrentTime(audioID, (Date.now() - item.supTime) / 1e3);
            }
          };
          cc.game.canvas.addEventListener("touchstart", playFunc_1);
        }
        if (!this.clips.get(clipName)) return -1;
        if (AudioController.canPlay) return cc.audioEngine.play(this.clips.get(clipName), loop, volume);
        AudioController.PlayedList.push({
          clipName: clipName,
          loop: loop,
          volume: volume,
          supTime: Date.now(),
          skip: false
        });
        return -2;
      };
      AudioController.PlayedList = [];
      AudioController.canPlay = cc.sys.os.toLowerCase() != cc.sys.OS_IOS.toLowerCase();
      AudioController.hasBindTouch = false;
      return AudioController;
    }();
    exports.gAudio = AudioController.inst;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Game/Game": "Game",
    "../Utils/HashMap": "HashMap",
    "../table": "table"
  } ],
  Background: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6e6c977y+ZNJ5vXdpMVKfjC", "Background");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Background = function(_super) {
      __extends(Background, _super);
      function Background() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.sceneID = 0;
        _this.isBroken = false;
        return _this;
      }
      Background.prototype.onLoad = function() {};
      Background.prototype.start = function() {};
      Object.defineProperty(Background.prototype, "animation", {
        get: function() {
          return this.ani ? this.ani : this.ani = this.getComponent(cc.Animation);
        },
        enumerable: true,
        configurable: true
      });
      Background.prototype.reuse = function() {
        this.sceneID = arguments[0][0];
        this.initEvent();
        this.isBroken = false;
      };
      Background.prototype.unuse = function() {
        this.sceneID = 0;
        this.offEvent();
      };
      Background.prototype.sceneBroken = function(percent) {
        if (0 == this.sceneID) return;
        if (percent > .5) {
          if (this.isBroken) {
            this.isBroken = false;
            this.animation.play("recover");
          }
        } else if (!this.isBroken) {
          this.isBroken = true;
          this.animation.play("broken");
          console.log(percent);
        }
      };
      Background.prototype.initEvent = function() {
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_SCENE_HP_PROGRESS, this.sceneBroken, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.CHANGE_SCENE_DONE, this.reset, this);
      };
      Background.prototype.reset = function() {
        console.log(" back ground reset!!!!!!!");
        this.isBroken = false;
        var state = this.animation.getAnimationState("recover");
        this.animation.play("recover", state.duration);
      };
      Background.prototype.offEvent = function() {
        EventManager_1.gEventMgr.targetOff(this);
      };
      Background = __decorate([ ccclass ], Background);
      return Background;
    }(cc.Component);
    exports.default = Background;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName"
  } ],
  BallCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cbde4kdX39M2qMC/gDXEsJg", "BallCtrl");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventName_1 = require("../Event/EventName");
    var Config_1 = require("../Config/Config");
    var Game_1 = require("../Game/Game");
    var table_1 = require("../table");
    var EventManager_1 = require("../Event/EventManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BallCtrl = function(_super) {
      __extends(BallCtrl, _super);
      function BallCtrl() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      BallCtrl.prototype.reuse = function() {
        this.initEvent();
        this.collider = this.getComponent(cc.PhysicsCircleCollider);
        this.updateBallID(arguments[0][0], arguments[0][1], arguments[0][2]);
      };
      BallCtrl.prototype.unuse = function() {
        this.offEvent();
        this.ballID = this.ball = null;
      };
      BallCtrl.prototype.initEvent = function() {
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.JUMP, this.jump.bind(this), this);
      };
      BallCtrl.prototype.offEvent = function() {
        EventManager_1.gEventMgr.targetOff(this);
      };
      BallCtrl.prototype.jump = function(ballID, direction) {
        if (!this.ball || this.ball.Form == table_1.Monster_ball_ball_form.ZhaDan) return;
        if (this.node.y > cc.winSize.height) return;
        if (direction == Config_1.JUMP_DIR.LEFT) {
          this.angularVelocity = -Config_1.PhysicConf.angularVelocity;
          this.linearVelocity = Config_1.PhysicConf.linearVelocity.neg();
        } else {
          this.linearVelocity = Config_1.PhysicConf.linearVelocity;
          this.angularVelocity = Config_1.PhysicConf.angularVelocity;
        }
        this.applyForceToCenter(Config_1.PhysicConf.applyForce.mul(this.collider.density * Math.PI * this.collider.radius * this.collider.radius), true);
      };
      BallCtrl.prototype.updateBallID = function(ballID, ball, rotation) {
        this.ballID = ballID;
        this.ball = ball;
        rotation && this.node.setRotation(rotation);
        if (this.ball.Form == table_1.Monster_ball_ball_form.ZhaDan) {
          var rad = Math.abs(this.node.rotation * Math.PI / 180);
          this.linearVelocity = cc.v2(800 * -Math.abs(Math.sin(rad)), 800 * Math.abs(Math.cos(rad)));
        }
      };
      BallCtrl.prototype.onBeginContact = function(contact, self, other) {
        if (this.ball && this.ball.Form == table_1.Monster_ball_ball_form.ZhaDan) {
          console.log("\u706b\u7bad\u7206\u70b8");
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.ADD_EFFECT, Config_1.EffectType.Boom, contact.getWorldManifold().points[0], true);
        } else EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.BALL_HIT);
        if (other.node.group == Config_1.Group.Weakness) {
          console.log("\u653b\u51fb\u5f31\u70b9");
          Game_1.Game.ballAttack(this.ballID, other.node.name);
        } else this.ball && this.ball.Form == table_1.Monster_ball_ball_form.ZhaDan && Game_1.Game.ballCost(this.ballID);
      };
      BallCtrl = __decorate([ ccclass ], BallCtrl);
      return BallCtrl;
    }(cc.RigidBody);
    exports.default = BallCtrl;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Game/Game": "Game",
    "../table": "table"
  } ],
  BallTab: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9354f2hBvpIz6dPHa99KtaZ", "BallTab");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game/Game");
    var TableMgr_1 = require("../TableMgr");
    var table_1 = require("../table");
    var EventName_1 = require("../Event/EventName");
    var EventManager_1 = require("../Event/EventManager");
    var CameraController_1 = require("../Controller/CameraController");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BallTab = function(_super) {
      __extends(BallTab, _super);
      function BallTab() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.BallIcon = null;
        _this.LifeTimeSprite = null;
        _this.Button = null;
        _this.MainUI = null;
        _this.LifeTime = null;
        _this.BallSelectRange = null;
        _this.RocketRange = null;
        _this.rocketLife = 0;
        _this.isReady = false;
        _this.initZIndex = 0;
        return _this;
      }
      BallTab.prototype.onLoad = function() {
        this.reset();
        this.initZIndex = this.node.zIndex;
      };
      BallTab.prototype.reset = function() {
        this.Button.interactable = false;
        this.Button.enabled = false;
        this.LifeTimeSprite.enabled = false;
        this.BallIcon.node.getChildByName("array").active = false;
        this.BallIcon.enabled = false;
        this.BallIcon.node.color = cc.Color.WHITE;
        this.ballIconInitPos = this.BallIcon.node.getPosition();
        this.BallIcon.node.setScale(.75);
        this.lifeTotal = this.LifeTimeSprite.node.height;
        this.RocketRange.node.active = false;
        this.isReady = false;
      };
      BallTab.prototype.initEvent = function() {
        var _this = this;
        this.Button.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.Button.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCancel, this);
        this.Button.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.Button.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.CUR_BALL_UPDATE, this.changeCurBall, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_BALL_LIFE, this.updateBallLife, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.GEN_NEXT_LEVEL, this.reset, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PRE_SELECT_BALL, function(ballID) {
          if (_this.ballInfo.ID != ballID) {
            _this.LifeTimeSprite.enabled = false;
            _this.BallIcon.node.setScale(.75);
          }
        }, this);
      };
      BallTab.prototype.offEvent = function() {
        this.Button.node.targetOff(this);
        EventManager_1.gEventMgr.targetOff(this);
      };
      BallTab.prototype.start = function() {};
      BallTab.prototype.preSelect = function() {
        this.Button.interactable = true;
        this.LifeTimeSprite.enabled = true;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PRE_SELECT_BALL, this.ballInfo.ID);
      };
      BallTab.prototype.onTouchStart = function(event) {
        if (!this.Button.enabled || Game_1.Game.getBallNumber(this.ballInfo.ID) <= 0) return;
        this.preSelect();
        this.node.zIndex = cc.macro.MAX_ZINDEX;
      };
      BallTab.prototype.onTouchMove = function(event) {
        if (!this.Button.interactable) return;
        var iconLocal = this.node.convertToNodeSpaceAR(event.getLocation());
        var rocketlocal = this.RocketRange.node.convertToNodeSpaceAR(event.getLocation());
        rocketlocal.x = Math.abs(rocketlocal.x);
        var balllocal = this.BallSelectRange.convertToNodeSpaceAR(event.getLocation());
        var ballContains = this.BallSelectRange.width >= balllocal.x && balllocal.x >= 0 && this.BallSelectRange.height >= balllocal.y && balllocal.y >= 0;
        var rocketContains = this.RocketRange.node.width >= rocketlocal.x && rocketlocal.x >= 0 && this.RocketRange.node.height >= rocketlocal.y && rocketlocal.y >= 0;
        ballContains || (this.isReady = true);
        if ((rocketContains || this.ballInfo.form != table_1.Monster_ball_ball_form.ZhaDan) && (!this.isReady || !ballContains || this.ballInfo.form == table_1.Monster_ball_ball_form.ZhaDan) && (balllocal.y >= 100 * cc.Camera.main.zoomRatio || this.ballInfo.form == table_1.Monster_ball_ball_form.ZhaDan)) {
          if (this.ballInfo.form == table_1.Monster_ball_ball_form.ZhaDan && this.isReady) {
            var radiu = this.RocketRange.node.width;
            var rad = Math.atan2(rocketlocal.y, rocketlocal.x) - Math.PI / 2;
            iconLocal.x = Math.sin(rad) * radiu;
            iconLocal.y = Math.cos(rad) * radiu;
            iconLocal = this.RocketRange.node.convertToWorldSpaceAR(iconLocal);
            iconLocal = this.node.convertToNodeSpaceAR(iconLocal);
          }
          this.BallIcon.node.setPosition(iconLocal);
        }
        this.BallIcon.node.setScale(1.2);
        if (this.ballInfo.form == table_1.Monster_ball_ball_form.ZhaDan) {
          if (rocketContains && this.isReady) {
            this.BallIcon.node.getChildByName("array").active = true;
            this.isReady = true;
            CameraController_1.gCamera.canZoomOut = false;
            CameraController_1.gCamera.readyRocket(true);
            rocketlocal = this.RocketRange.node.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(iconLocal));
            rocketlocal.x = Math.abs(rocketlocal.x);
            var rad = Math.atan2(rocketlocal.y, rocketlocal.x) - Math.PI / 2;
            this.BallIcon.node.rotation = rad / Math.PI * 180 - this.BallIcon.node.parent.rotation;
          }
          this.RocketRange.node.active = true;
        } else this.BallIcon.node.getChildByName("array").active = false;
      };
      BallTab.prototype.resetState = function() {
        this.isReady = false;
        this.BallIcon.node.scale = .75;
        this.BallIcon.node.rotation = 0;
        this.BallIcon.node.getChildByName("array").active = false;
        this.BallIcon.node.setPosition(this.ballIconInitPos);
        this.Button.interactable = false;
        this.node.zIndex = this.initZIndex;
        this.ballInfo.form == table_1.Monster_ball_ball_form.ZhaDan && (this.RocketRange.node.active = false);
      };
      BallTab.prototype.onTouchCancel = function(event) {
        if (!this.Button.interactable) return;
        CameraController_1.gCamera.canZoomOut = true;
        if (!this.isReady) {
          this.resetState();
          return;
        }
        var ballLocal = this.node.convertToWorldSpaceAR(this.BallIcon.node.position).scaleSelf(cc.v2(1 / cc.Camera.main.zoomRatio, 1 / cc.Camera.main.zoomRatio));
        ballLocal = this.MainUI.parent.convertToNodeSpaceAR(ballLocal);
        ballLocal.x -= cc.Camera.main.zoomRatio > .51 ? 0 : cc.winSize.width / 2;
        Game_1.Game.changeCurBall(this.ballInfo.ID, ballLocal, this.BallIcon.node.rotation + this.BallIcon.node.parent.rotation);
        this.resetState();
      };
      BallTab.prototype.updateBallNumber = function() {
        console.log("id:" + this.ballInfo.ID + ",update Ball number:" + Game_1.Game.getBallNumber(this.ballInfo.ID));
        var num = Game_1.Game.getBallNumber(this.ballInfo.ID);
        this.rocketLife = this.ballInfo.lifetime;
        this.BallIcon.node.color = num > 0 ? cc.Color.WHITE : cc.Color.RED;
        num <= 0 && EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PRE_SELECT_BALL, null);
      };
      BallTab.prototype.updateBallLife = function(percent) {
        this.LifeTime.height = this.lifeTotal * percent;
      };
      BallTab.prototype.changeCurBall = function(isDelete, ballID) {
        this.Button.interactable = false;
        this.LifeTime.height = this.lifeTotal;
        if (isDelete) {
          this.Button.enabled = true;
          this.updateBallNumber();
        } else {
          this.LifeTimeSprite.enabled = ballID == this.ballInfo.ID;
          this.Button.enabled = false;
          this.ballInfo.ID != ballID && this.BallIcon.node.setScale(.75);
          this.BallIcon.node.color = Game_1.Game.getBallNumber(this.ballInfo.ID) > 0 ? cc.Color.WHITE : cc.Color.RED;
        }
      };
      BallTab.prototype.updateBallInfo = function(ballID, callback) {
        this.ballInfo = TableMgr_1.TableMgr.inst.getMonster_ball_ball(ballID);
        this.rocketLife = this.ballInfo.lifetime;
        this.ballInfo ? this.initEvent() : this.offEvent();
        var icon = this.BallIcon;
        var button = this.Button;
        cc.loader.loadRes("Texture/ball/" + ballID, cc.SpriteFrame, function(err, spriteFrame) {
          if (err) console.error(err); else {
            icon.enabled = true;
            button.enabled = true;
            icon.spriteFrame = spriteFrame;
            callback && callback();
          }
        });
      };
      BallTab.prototype.update = function(dt) {
        if (this.ballInfo && this.isReady && this.ballInfo.form == table_1.Monster_ball_ball_form.ZhaDan) {
          this.rocketLife -= dt;
          this.updateBallLife(this.rocketLife / this.ballInfo.lifetime);
          if (this.rocketLife <= 0) {
            this.rocketLife = this.ballInfo.lifetime;
            this.onTouchCancel(null);
          }
        }
      };
      __decorate([ property(cc.Sprite) ], BallTab.prototype, "BallIcon", void 0);
      __decorate([ property(cc.Sprite) ], BallTab.prototype, "LifeTimeSprite", void 0);
      __decorate([ property(cc.Button) ], BallTab.prototype, "Button", void 0);
      __decorate([ property(cc.Node) ], BallTab.prototype, "MainUI", void 0);
      __decorate([ property(cc.Node) ], BallTab.prototype, "LifeTime", void 0);
      __decorate([ property(cc.Node) ], BallTab.prototype, "BallSelectRange", void 0);
      __decorate([ property(cc.Sprite) ], BallTab.prototype, "RocketRange", void 0);
      BallTab = __decorate([ ccclass ], BallTab);
      return BallTab;
    }(cc.Component);
    exports.default = BallTab;
    cc._RF.pop();
  }, {
    "../Controller/CameraController": "CameraController",
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Game/Game": "Game",
    "../TableMgr": "TableMgr",
    "../table": "table"
  } ],
  Ball: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1f57YRG6xFoKerGym3BE8x", "Ball");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var table_1 = require("../table");
    var TableMgr_1 = require("../TableMgr");
    var Game_1 = require("./Game");
    var BuffManager_1 = require("./BuffManager");
    var EventName_1 = require("../Event/EventName");
    var EventManager_1 = require("../Event/EventManager");
    var Ball = function() {
      function Ball(ballID) {
        this.enableLifeTime = false;
        this.ballID = ballID;
        var ballData = TableMgr_1.TableMgr.inst.getMonster_ball_ball(this.ballID);
        this.form = ballData.form;
        this.continue = ballData.continue;
        this.lifeTime = ballData.lifetime;
        this.enableLifeTime = this.lifeTime > 0 && this.form != table_1.Monster_ball_ball_form.ZhaDan;
        this.attack = ballData.attack;
        this.durable = ballData.durable;
        this.totalDurable = ballData.durable;
        this.totalLife = ballData.lifetime;
        this.combo = ballData.combo;
        this.buff = new BuffManager_1.BuffManager(this.ballID);
      }
      Object.defineProperty(Ball.prototype, "BallID", {
        get: function() {
          return this.ballID;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Ball.prototype, "EnableLifeTime", {
        get: function() {
          return this.enableLifeTime;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Ball.prototype, "Combo", {
        get: function() {
          return this.combo;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Ball.prototype, "Attack", {
        get: function() {
          return this.attack;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Ball.prototype, "LifeTime", {
        get: function() {
          return this.lifeTime;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Ball.prototype, "Continue", {
        get: function() {
          return this.continue;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Ball.prototype, "Form", {
        get: function() {
          return this.form;
        },
        enumerable: true,
        configurable: true
      });
      Ball.prototype.use = function() {
        if (this.enableLifeTime && this.Form != table_1.Monster_ball_ball_form.ZhaDan) return true;
        this.durable -= this.attack;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_BALL_LIFE, this.durable / this.totalDurable);
        return this.durable > 0;
      };
      Ball.prototype.costLifeTime = function(cost) {
        this.lifeTime += cost;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_BALL_LIFE, this.lifeTime / this.totalLife);
        return this.lifeTime > 0;
      };
      Ball.prototype.update = function(dt) {
        this.buff.update(dt);
        if (this.EnableLifeTime && !this.costLifeTime(-dt)) {
          Game_1.Game.removeBall(this.BallID);
          Game_1.Game.setCurBall(null);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_BALL_ITEM_NUMBER);
        }
      };
      return Ball;
    }();
    exports.Ball = Ball;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../TableMgr": "TableMgr",
    "../table": "table",
    "./BuffManager": "BuffManager",
    "./Game": "Game"
  } ],
  BaseScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "07e9084SKFEuJNZQVjlVclA", "BaseScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BaseScene = function(_super) {
      __extends(BaseScene, _super);
      function BaseScene() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      BaseScene.prototype.showUI = function(url, pos) {
        void 0 === pos && (pos = cc.v2(0, 0));
        var self = this;
        var nodeName = url.split("/").join("_");
        this.node.getChildByName(nodeName) ? console.warn("\u754c\u9762\u5df2\u663e\u793a:" + url) : cc.loader.loadRes(url, cc.Prefab, function(err, prefab) {
          if (err) console.error(err); else {
            var prefabNode = cc.instantiate(prefab);
            prefabNode.setPosition(pos);
            self.node.addChild(prefabNode, 1, nodeName);
          }
        });
      };
      BaseScene.prototype.closeUI = function(url, release) {
        void 0 === release && (release = false);
        var nodeName = url.split("/").join("_");
        var child = this.node.getChildByName(nodeName);
        if (child) {
          child.removeFromParent(true);
          release && cc.loader.releaseRes(url);
        }
      };
      BaseScene = __decorate([ ccclass ], BaseScene);
      return BaseScene;
    }(cc.Component);
    exports.default = BaseScene;
    cc._RF.pop();
  }, {} ],
  BossGodzimora: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "41a0dWPcVhI2oULmMmcubZg", "BossGodzimora");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Monster_1 = require("../Game/Monster");
    var MonsterSpine_1 = require("./MonsterSpine");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var table_1 = require("../table");
    var Weakness_1 = require("./Weakness");
    var PixelSprite_1 = require("../Shader/PixelSprite");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BossGodzimora = function(_super) {
      __extends(BossGodzimora, _super);
      function BossGodzimora() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.weaknessRoot = null;
        _this.spine = null;
        _this.monster = null;
        _this.stepTime = 0;
        _this.step = 1;
        return _this;
      }
      Object.defineProperty(BossGodzimora.prototype, "Spine", {
        get: function() {
          return this.spine ? this.spine : this.spine = this.getComponent(MonsterSpine_1.default);
        },
        enumerable: true,
        configurable: true
      });
      BossGodzimora.prototype.reuse = function() {
        this.updateMonsterInfo(arguments[0][0], arguments[0][1]);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_DIE, this.die, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_UPDATE_STAGE, this.updateStage, this);
        this.weaknessRoot.active = true;
      };
      BossGodzimora.prototype.unuse = function() {
        this.monster = null;
        this.id = null;
        EventManager_1.gEventMgr.targetOff(this);
      };
      BossGodzimora.prototype.die = function(monsterID) {
        if (this.id != monsterID) return;
        this.monster = null;
        this.weaknessRoot.active = false;
      };
      BossGodzimora.prototype.updateMonsterInfo = function(id, monster) {
        this.monster = monster;
        this.enabled = this.monster.Type == table_1.Monster_ball__monster_monster.BOSS;
        this.id = id;
        for (var _i = 0, _a = this.weaknessRoot.children; _i < _a.length; _i++) {
          var weakness_1 = _a[_i];
          weakness_1.name = this.id;
        }
        this.node.setPosition(408, -334);
        var spine = this.Spine;
        var self = this;
        cc.loader.loadRes("Spine/1016/gesimola", sp.SkeletonData, function(err, sk) {
          if (err) console.error(err); else {
            spine.skeletonData = sk;
            spine.defaultAnimation = "idle";
            self.updateWeakness(spine);
          }
        });
      };
      BossGodzimora.prototype.updateWeakness = function(spine) {
        for (var _i = 0, _a = this.weaknessRoot.children; _i < _a.length; _i++) {
          var weaknessNode = _a[_i];
          var weak = weaknessNode.getComponent(Weakness_1.default);
          switch (this.monster.Stage) {
           case 2:
            [ "bone23", "bone31" ].indexOf(weak.followBone) >= 0 ? weak.node.active = false : weak.node.active = true;
          }
          weak.spine = spine;
          weak.start();
        }
        this.monster.resetState();
        this.node.getComponent(PixelSprite_1.default) && this.node.getComponent(PixelSprite_1.default).init();
      };
      BossGodzimora.prototype.updateStage = function() {
        if (!this.monster) return;
        var spine = this.Spine;
        var self = this;
        2 == this.monster.Stage && cc.loader.loadRes("Spine/1016/gesimola_by", sp.SkeletonData, function(err, sk) {
          if (err) console.error(err); else {
            spine.skeletonData = sk;
            spine.defaultAnimation = "idle";
            self.updateWeakness(spine);
          }
        });
      };
      BossGodzimora.prototype.onLoad = function() {};
      BossGodzimora.prototype.start = function() {};
      BossGodzimora.prototype.update = function(dt) {
        if (!this.monster) return;
        if (this.monster.CanMove) {
          this.Spine.move();
          this.stepTime += dt;
          if (this.stepTime > this.monster.MoveSpeed / 400) {
            this.stepTime = 0;
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.BOSS_ZAI_STEP, this.step);
            1 == this.step ? this.step = 2 : this.step = 1;
          }
          this.monster.setState(Monster_1.MonsterState.HIDE);
          this.node.x >= 1600 ? this.node.scaleX = 1 : this.node.x <= -1600 ? this.node.scaleX = -1 : Math.abs(this.node.x) < 800 && this.monster.delState(Monster_1.MonsterState.HIDE);
          this.node.x -= this.monster.MoveSpeed * dt * this.node.scaleX;
        } else this.Spine.idle();
      };
      __decorate([ property(cc.Node) ], BossGodzimora.prototype, "weaknessRoot", void 0);
      BossGodzimora = __decorate([ ccclass ], BossGodzimora);
      return BossGodzimora;
    }(cc.Component);
    exports.default = BossGodzimora;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Game/Monster": "Monster",
    "../Shader/PixelSprite": "PixelSprite",
    "../table": "table",
    "./MonsterSpine": "MonsterSpine",
    "./Weakness": "Weakness"
  } ],
  BossZai: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1bbfdrPLKtMvrefLffwM6N4", "BossZai");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Monster_1 = require("../Game/Monster");
    var MonsterSpine_1 = require("./MonsterSpine");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var table_1 = require("../table");
    var Weakness_1 = require("./Weakness");
    var PixelSprite_1 = require("../Shader/PixelSprite");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BossZai = function(_super) {
      __extends(BossZai, _super);
      function BossZai() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.weaknessRoot = null;
        _this.spine = null;
        _this.monster = null;
        _this.stepTime = 0;
        _this.step = 1;
        return _this;
      }
      Object.defineProperty(BossZai.prototype, "Spine", {
        get: function() {
          return this.spine ? this.spine : this.spine = this.getComponent(MonsterSpine_1.default);
        },
        enumerable: true,
        configurable: true
      });
      BossZai.prototype.reuse = function() {
        this.updateMonsterInfo(arguments[0][0], arguments[0][1]);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_DIE, this.die, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_UPDATE_STAGE, this.updateStage, this);
        this.weaknessRoot.active = true;
      };
      BossZai.prototype.unuse = function() {
        this.monster = null;
        this.id = null;
        EventManager_1.gEventMgr.targetOff(this);
      };
      BossZai.prototype.die = function(monsterID) {
        if (this.id != monsterID) return;
        this.monster = null;
        this.weaknessRoot.active = false;
      };
      BossZai.prototype.updateMonsterInfo = function(id, monster) {
        this.monster = monster;
        this.enabled = this.monster.Type == table_1.Monster_ball__monster_monster.BOSS;
        this.id = id;
        for (var _i = 0, _a = this.weaknessRoot.children; _i < _a.length; _i++) {
          var weakness_1 = _a[_i];
          weakness_1.name = this.id;
        }
        this.node.setPosition(-1290, -295);
        var spine = this.Spine;
        var self = this;
        cc.loader.loadRes("Spine/1017/zai", sp.SkeletonData, function(err, sk) {
          if (err) console.error(err); else {
            spine.skeletonData = sk;
            spine.defaultAnimation = "idle";
            self.updateWeakness(spine);
          }
        });
      };
      BossZai.prototype.updateWeakness = function(spine) {
        for (var _i = 0, _a = this.weaknessRoot.children; _i < _a.length; _i++) {
          var weaknessNode = _a[_i];
          var weak = weaknessNode.getComponent(Weakness_1.default);
          "bone42" == weak.followBone && 3 == this.monster.Stage ? weak.node.active = false : weak.node.active = true;
          weak.spine = spine;
          weak.start();
        }
        this.monster.resetState();
        this.node.getComponent(PixelSprite_1.default) && this.node.getComponent(PixelSprite_1.default).init();
      };
      BossZai.prototype.updateStage = function() {
        if (!this.monster) return;
        var spine = this.Spine;
        var self = this;
        3 == this.monster.Stage && cc.loader.loadRes("Spine/1017/zai_by", sp.SkeletonData, function(err, sk) {
          if (err) console.error(err); else {
            spine.skeletonData = sk;
            spine.defaultAnimation = "idle";
            self.updateWeakness(spine);
          }
        });
      };
      BossZai.prototype.onLoad = function() {};
      BossZai.prototype.start = function() {};
      BossZai.prototype.update = function(dt) {
        if (!this.monster) return;
        if (1 == this.monster.Stage) {
          this.node.setPosition(-1290, -295);
          this.Spine.idle();
        } else if (this.monster.CanMove) {
          this.Spine.move();
          this.stepTime += dt;
          if (this.stepTime > this.monster.MoveSpeed / 400) {
            this.stepTime = 0;
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.BOSS_ZAI_STEP, this.step);
            1 == this.step ? this.step = 2 : this.step = 1;
          }
          this.monster.setState(Monster_1.MonsterState.HIDE);
          this.node.x >= 1600 ? this.node.scaleX = 1 : this.node.x <= -1600 ? this.node.scaleX = -1 : Math.abs(this.node.x) < 800 && this.monster.delState(Monster_1.MonsterState.HIDE);
          this.node.x -= this.monster.MoveSpeed * dt * this.node.scaleX;
        } else this.Spine.idle();
      };
      __decorate([ property(cc.Node) ], BossZai.prototype, "weaknessRoot", void 0);
      BossZai = __decorate([ ccclass ], BossZai);
      return BossZai;
    }(cc.Component);
    exports.default = BossZai;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Game/Monster": "Monster",
    "../Shader/PixelSprite": "PixelSprite",
    "../table": "table",
    "./MonsterSpine": "MonsterSpine",
    "./Weakness": "Weakness"
  } ],
  BuffManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4ca32PuwAhJlZP+EuDUhIFK", "BuffManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BuffType;
    (function(BuffType) {
      BuffType[BuffType["NUMB"] = 0] = "NUMB";
      BuffType[BuffType["STIFF"] = 1] = "STIFF";
      BuffType[BuffType["RELAX"] = 2] = "RELAX";
      BuffType[BuffType["RECOVER"] = 3] = "RECOVER";
      BuffType[BuffType["INVINCIBLE"] = 4] = "INVINCIBLE";
    })(BuffType = exports.BuffType || (exports.BuffType = {}));
    var BuffManager = function() {
      function BuffManager(id) {
        this.buffs = new Array();
        this.id = "";
        this.id = id;
      }
      BuffManager.prototype.addBuff = function(buffOption) {
        buffOption.name = buffOption.name || "unknow buff";
        buffOption.isCover = true === buffOption.isCover;
        buffOption.isImmediately = false !== buffOption.isImmediately;
        var now = Date.now();
        for (var _i = 0, _a = this.buffs; _i < _a.length; _i++) {
          var buffItem = _a[_i];
          if (buffItem.type == buffOption.type && buffOption.target === buffItem.target) {
            if (buffOption.isCover) {
              buffItem.deleteTime = buffOption.lastTime + now;
              buffItem.handler = buffOption.handler;
            } else buffItem.deleteTime += buffOption.lastTime;
            return;
          }
        }
        buffOption.init && buffOption.init.apply(buffOption.target, buffOption.args);
        if (buffOption.isImmediately) {
          buffOption.handler.apply(buffOption.target, buffOption.args);
          buffOption.isOnce && (buffOption.handler = null);
        }
        this.buffs.push({
          name: buffOption.name,
          type: buffOption.type,
          handler: buffOption.handler,
          isOnce: buffOption.isOnce,
          completeHandler: buffOption.completeHandler,
          duration: buffOption.duration,
          excuteTime: buffOption.isImmediately ? now : now + buffOption.duration,
          deleteTime: buffOption.lastTime + now,
          target: buffOption.target,
          args: buffOption.args,
          del: false,
          addTime: now
        });
      };
      BuffManager.prototype.update = function(dt) {
        if (this.buffs.length <= 0) return;
        var now = Date.now();
        var delBuffs = [];
        for (var _i = 0, _a = this.buffs; _i < _a.length; _i++) {
          var buffItem = _a[_i];
          if (buffItem.del || !buffItem.target) {
            delBuffs.push(this.buffs.indexOf(buffItem));
            continue;
          }
          if (now >= buffItem.deleteTime) {
            buffItem.completeHandler && buffItem.completeHandler.apply(buffItem.target);
            buffItem.del = true;
            delBuffs.push(this.buffs.indexOf(buffItem));
            continue;
          }
          if (now >= buffItem.excuteTime && buffItem.handler) {
            buffItem.excuteTime = now + buffItem.duration;
            buffItem.handler.apply(buffItem.target, buffItem.args);
            buffItem.isOnce && (buffItem.handler = null);
          }
        }
        for (var _b = 0, delBuffs_1 = delBuffs; _b < delBuffs_1.length; _b++) {
          var delIndex = delBuffs_1[_b];
          this.buffs.splice(delIndex, 1);
        }
      };
      BuffManager.prototype.clear = function() {
        this.buffs = [];
      };
      return BuffManager;
    }();
    exports.BuffManager = BuffManager;
    cc._RF.pop();
  }, {} ],
  ButterFlySpring: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c859e4OhH9NpLv8p9FG1kcs", "ButterFlySpring");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ButterflySpring = function(_super) {
      __extends(ButterflySpring, _super);
      function ButterflySpring() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.material = new ShaderManager_1.ButterflySpringMaterial();
        _this.time = 0;
        return _this;
      }
      ButterflySpring.prototype.onLoad = function() {
        var sprite = this.getComponent(cc.Sprite);
        if (!sprite) return;
        sprite["_spriteMaterial"] = this.material;
        sprite["_activateMaterial"]();
      };
      ButterflySpring.prototype.start = function() {};
      ButterflySpring.prototype.update = function(dt) {
        this.time += 10 * dt;
      };
      ButterflySpring = __decorate([ ccclass ], ButterflySpring);
      return ButterflySpring;
    }(cc.Component);
    exports.default = ButterflySpring;
    cc._RF.pop();
  }, {
    "./ShaderManager": "ShaderManager"
  } ],
  CameraController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3c1b6oCCV1ORbSP1LtO4Sla", "CameraController");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game/Game");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var CameraController = function() {
      function CameraController() {
        var _this = this;
        this.minZoomRatio = .5;
        this.maxMoveYRatio = .5;
        this.zoomRatioSense = 1;
        this.isEnableCameraZoom = true;
        this.MainCamera = null;
        this.UICamera = null;
        this.target = null;
        this.enableFollow = true;
        this.canZoomOut = true;
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.lateUpdate.bind(this), this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_ATTACK_DONE, function(isBoss) {
          isBoss && _this.shake();
        }, this);
      }
      Object.defineProperty(CameraController, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new CameraController();
        },
        enumerable: true,
        configurable: true
      });
      CameraController.prototype.shake = function() {
        var shakeRange = .5;
        var moveY = cc.sequence(cc.moveBy(.03, cc.v2(0, 50 * shakeRange)), cc.moveBy(.06, cc.v2(0, -100 * shakeRange)), cc.moveBy(.03, cc.v2(0, 50 * shakeRange)));
        var shakeUpDown = cc.repeat(moveY, 5);
        this.MainCamera.node.runAction(shakeUpDown);
      };
      CameraController.prototype.initCamera = function() {
        this.enableFollow = true;
        if (!this.MainCamera || !this.MainCamera.node) return;
        if (CAMERA_SHOW_ALL) {
          this.MainCamera.node.y = 360;
          this.MainCamera.zoomRatio = .5;
        } else {
          this.MainCamera.node.y = 0;
          this.MainCamera.zoomRatio = 1;
        }
      };
      CameraController.prototype.zoomIn = function() {
        this.enableFollow = false;
        this.MainCamera.node.stopActionByTag(101);
        var zoomIn = cc.moveTo(.3, cc.v2(0, 360));
        zoomIn.setTag(100);
        this.MainCamera.node.runAction(zoomIn);
      };
      CameraController.prototype.zoomOut = function() {
        if (!this.canZoomOut || CAMERA_SHOW_ALL) return;
        var zoomOut = cc.moveTo(.3, cc.v2(0, 0));
        zoomOut.setTag(101);
        this.MainCamera.node.stopActionByTag(100);
        this.MainCamera.node.runAction(zoomOut);
        this.enableFollow = true;
      };
      CameraController.prototype.bindUICamera = function(camera) {
        this.UICamera = camera;
      };
      CameraController.prototype.bindMainCamera = function(camera) {
        this.MainCamera = camera;
      };
      CameraController.prototype.setTarget = function(newTarget) {
        if (CAMERA_SHOW_ALL) return;
        this.target = newTarget;
        if (!this.target) {
          console.clear();
          console.log(" \u7403\u6ca1\u4e86");
          this.readyRocket(false);
        }
      };
      CameraController.prototype.readyRocket = function(isReady) {
        if (CAMERA_SHOW_ALL) return;
        if (this.enableFollow == !isReady) return;
        console.log("enable follow:" + this.enableFollow);
        isReady ? this.zoomIn() : this.zoomOut();
      };
      CameraController.prototype.lateUpdate = function() {
        if (!this.MainCamera || !this.MainCamera.node || !this.UICamera || !this.UICamera.node || !Game_1.Game.isRun()) return;
        if (CAMERA_SHOW_ALL || !this.enableFollow) {
          if (this.MainCamera.zoomRatio > .5) {
            this.MainCamera.zoomRatio -= .02;
            this.MainCamera.zoomRatio = this.MainCamera.zoomRatio < .5 ? .5 : this.MainCamera.zoomRatio;
          }
          return;
        }
        if (!this.target || !this.target.isValid) {
          this.MainCamera.zoomRatio < 1 ? this.MainCamera.zoomRatio += .05 : this.MainCamera.zoomRatio > 1 && (this.MainCamera.zoomRatio -= .05);
          this.MainCamera.zoomRatio = CMath.Clamp(this.MainCamera.zoomRatio, 1, 0);
          return;
        }
        this.MainCamera.node.y = this.target.y - cc.winSize.height / 4;
        this.MainCamera.node.y = CMath.Clamp(this.MainCamera.node.y, cc.winSize.height * this.maxMoveYRatio, 0);
        this.target.x > cc.winSize.width / 4 ? this.MainCamera.node.x = this.target.x - cc.winSize.width / 4 : this.target.x < -cc.winSize.width / 4 && (this.MainCamera.node.x = this.target.x + cc.winSize.width / 4);
        this.MainCamera.node.x = CMath.Clamp(this.MainCamera.node.x, cc.winSize.width / 2, -cc.winSize.width / 2);
        if (this.isEnableCameraZoom) {
          var ratioX = 1 - Math.abs(this.MainCamera.node.x) / cc.winSize.width * 2;
          var ratioY = 1 - Math.abs(this.MainCamera.node.y) / cc.winSize.height;
          ratioY < this.minZoomRatio && (ratioY = this.minZoomRatio);
          ratioY += (1 - ratioX) * (1 - ratioY);
          this.MainCamera.zoomRatio = ratioY;
        }
      };
      return CameraController;
    }();
    exports.gCamera = CameraController.inst;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Game/Game": "Game"
  } ],
  Config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "66da32otSlAnK03HjoFTe1o", "Config");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Config = {
      GameID: 216437,
      AppKey: "bc7b7fd603714d888deff0986e24f742#C",
      Secret: "6f86c9c856504b5d917dd06585553a3f",
      CocosAppID: "619821021",
      channel: "Matchvs",
      platform: "alpha",
      gameVersion: 1,
      DeviceID: "1",
      MaxPlayer: 2,
      isMultiPlayer: false,
      FPS: 30
    };
    exports.PhysicConf = {
      enabled: true,
      gravity: cc.v2(0, -2e3),
      debugDrawFlags: 0,
      angularVelocity: 360,
      linearVelocity: cc.v2(300, 0),
      applyForce: cc.v2(0, 30)
    };
    var JUMP_DIR;
    (function(JUMP_DIR) {
      JUMP_DIR[JUMP_DIR["LEFT"] = 0] = "LEFT";
      JUMP_DIR[JUMP_DIR["RIGHT"] = 1] = "RIGHT";
    })(JUMP_DIR = exports.JUMP_DIR || (exports.JUMP_DIR = {}));
    exports.Group = {
      Default: "default",
      Player: "player",
      UI: "UI",
      Monster: "monster",
      Effect: "effect",
      Wall: "wall",
      Weakness: "weakness",
      Ground: "ground"
    };
    var EffectType;
    (function(EffectType) {
      EffectType[EffectType["Flash"] = 0] = "Flash";
      EffectType[EffectType["Boom"] = 1] = "Boom";
    })(EffectType = exports.EffectType || (exports.EffectType = {}));
    exports.ItemRefreshPos = {
      6002: [ cc.v2(-524, 1247), cc.v2(577, 1247) ],
      6003: [ cc.v2(-619, 1247), cc.v2(582, 1247) ],
      6001: [ cc.v2(177, 1247), cc.v2(947, 1247) ]
    };
    cc._RF.pop();
  }, {} ],
  Debug: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b3685Iyy4BMe4ql3TJBX6ML", "Debug");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var CameraController_1 = require("../Controller/CameraController");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DebugUI = function(_super) {
      __extends(DebugUI, _super);
      function DebugUI() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.close = null;
        _this.showAll = null;
        _this.invincibel = null;
        _this.pxiel = null;
        return _this;
      }
      DebugUI.prototype.onLoad = function() {
        var _this = this;
        this.node.setScale(0);
        this.node.runAction(cc.scaleTo(.2, 1, 1));
        this.showAll.isChecked = CAMERA_SHOW_ALL;
        this.invincibel.isChecked = INVINCIBLE;
        this.pxiel.isChecked = PXIEL;
        this.close.node.on(cc.Node.EventType.TOUCH_END, function() {
          _this.node.runAction(cc.sequence(cc.scaleTo(.2, 0, 0), cc.callFunc(function() {
            _this.node.removeFromParent(true);
          }, _this)));
        }, this);
        this.showAll.node.on("toggle", function() {
          CAMERA_SHOW_ALL = _this.showAll.isChecked;
          CAMERA_SHOW_ALL ? CameraController_1.gCamera.zoomIn() : CameraController_1.gCamera.zoomOut();
        }, this);
        this.invincibel.node.on("toggle", function() {
          INVINCIBLE = _this.invincibel.isChecked;
        }, this);
        this.pxiel.node.on("toggle", function() {
          PXIEL = _this.pxiel.isChecked;
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PXIEL_ENABLE);
        }, this);
      };
      DebugUI.prototype.start = function() {};
      __decorate([ property(cc.Button) ], DebugUI.prototype, "close", void 0);
      __decorate([ property(cc.Toggle) ], DebugUI.prototype, "showAll", void 0);
      __decorate([ property(cc.Toggle) ], DebugUI.prototype, "invincibel", void 0);
      __decorate([ property(cc.Toggle) ], DebugUI.prototype, "pxiel", void 0);
      DebugUI = __decorate([ ccclass ], DebugUI);
      return DebugUI;
    }(cc.Component);
    exports.default = DebugUI;
    cc._RF.pop();
  }, {
    "../Controller/CameraController": "CameraController",
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName"
  } ],
  Effect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "810c2x/gUBN8aCpP6YT0wU/", "Effect");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../Config/Config");
    var CameraController_1 = require("../Controller/CameraController");
    var GameFactory_1 = require("../Factory/GameFactory");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Effect = function(_super) {
      __extends(Effect, _super);
      function Effect() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.effectType = Config_1.EffectType.Boom;
        return _this;
      }
      Object.defineProperty(Effect.prototype, "Animation", {
        get: function() {
          return this.animation ? this.animation : this.animation = this.getComponent(cc.Animation);
        },
        enumerable: true,
        configurable: true
      });
      Effect.prototype.reuse = function() {
        var _this = this;
        var isRocket = arguments[0][1];
        this.Animation.play("boom", 0);
        this.Animation.on(cc.Animation.EventType.FINISHED, function() {
          _this.effectType == Config_1.EffectType.Boom && isRocket && CameraController_1.gCamera.zoomOut();
          GameFactory_1.gFactory.puEffect(_this.effectType, _this.node);
        }, this);
      };
      Effect.prototype.unuse = function() {
        this.Animation.targetOff(this);
      };
      Effect.prototype.onLoad = function() {};
      Effect.prototype.start = function() {};
      __decorate([ property({
        type: cc.Enum(Config_1.EffectType)
      }) ], Effect.prototype, "effectType", void 0);
      Effect = __decorate([ ccclass ], Effect);
      return Effect;
    }(cc.Component);
    exports.default = Effect;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../Controller/CameraController": "CameraController",
    "../Factory/GameFactory": "GameFactory"
  } ],
  EventManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6e82sGGBdLtIXuBXMooro8", "EventManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager = function() {
      function EventManager() {
        this.eventTarget = new cc.EventTarget();
      }
      Object.defineProperty(EventManager, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new EventManager();
        },
        enumerable: true,
        configurable: true
      });
      EventManager.prototype.emit = function(type, arg1, arg2, arg3, arg4, arg5) {
        this.eventTarget.emit(type.toString(), arg1, arg2, arg3, arg4, arg5);
      };
      EventManager.prototype.on = function(type, callback, target, useCapture) {
        return this.eventTarget.on(type.toString(), callback, target, useCapture);
      };
      EventManager.prototype.once = function(type, callback, target) {
        this.eventTarget.once(type.toString(), callback, target);
      };
      EventManager.prototype.dispatchEvent = function(event) {
        this.eventTarget.dispatchEvent(event);
      };
      EventManager.prototype.off = function(type, callback, target) {
        this.eventTarget.off(type.toString(), callback, target);
      };
      EventManager.prototype.hasEventListener = function(type) {
        return this.eventTarget.hasEventListener(type.toString());
      };
      EventManager.prototype.targetOff = function(target) {
        this.eventTarget.targetOff(target);
      };
      return EventManager;
    }();
    exports.gEventMgr = EventManager.inst;
    cc._RF.pop();
  }, {} ],
  EventName: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "26b15WZ9RVFY7I6JqAX2LjE", "EventName");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GlobalEvent;
    (function(GlobalEvent) {
      GlobalEvent[GlobalEvent["JUMP"] = 0] = "JUMP";
      GlobalEvent[GlobalEvent["MONSTER_ATTACK"] = 1] = "MONSTER_ATTACK";
      GlobalEvent[GlobalEvent["MONSTER_ADD"] = 2] = "MONSTER_ADD";
      GlobalEvent[GlobalEvent["MONSTER_ATTACK_DONE"] = 3] = "MONSTER_ATTACK_DONE";
      GlobalEvent[GlobalEvent["UPDATE_BALL_ITEM_NUMBER"] = 4] = "UPDATE_BALL_ITEM_NUMBER";
      GlobalEvent[GlobalEvent["CHANGE_CUR_BALL"] = 5] = "CHANGE_CUR_BALL";
      GlobalEvent[GlobalEvent["CHANGE_GAME_SCENE"] = 6] = "CHANGE_GAME_SCENE";
      GlobalEvent[GlobalEvent["CHANGE_SCENE_DONE"] = 7] = "CHANGE_SCENE_DONE";
      GlobalEvent[GlobalEvent["UPDATE_SCENE_HP_PROGRESS"] = 8] = "UPDATE_SCENE_HP_PROGRESS";
      GlobalEvent[GlobalEvent["UPDATE_SCORE"] = 9] = "UPDATE_SCORE";
      GlobalEvent[GlobalEvent["ADD_NEW_MONSTER"] = 10] = "ADD_NEW_MONSTER";
      GlobalEvent[GlobalEvent["ADD_MONSTER_DONE"] = 11] = "ADD_MONSTER_DONE";
      GlobalEvent[GlobalEvent["MONSTER_DIE"] = 12] = "MONSTER_DIE";
      GlobalEvent[GlobalEvent["MONSTER_HIT"] = 13] = "MONSTER_HIT";
      GlobalEvent[GlobalEvent["ADD_EFFECT"] = 14] = "ADD_EFFECT";
      GlobalEvent[GlobalEvent["PRE_SELECT_BALL"] = 15] = "PRE_SELECT_BALL";
      GlobalEvent[GlobalEvent["CUR_BALL_UPDATE"] = 16] = "CUR_BALL_UPDATE";
      GlobalEvent[GlobalEvent["ALL_INIT_DONE"] = 17] = "ALL_INIT_DONE";
      GlobalEvent[GlobalEvent["UPDATE_BALL_LIFE"] = 18] = "UPDATE_BALL_LIFE";
      GlobalEvent[GlobalEvent["GEN_NEXT_LEVEL"] = 19] = "GEN_NEXT_LEVEL";
      GlobalEvent[GlobalEvent["MONSTER_UPDATE_STAGE"] = 20] = "MONSTER_UPDATE_STAGE";
      GlobalEvent[GlobalEvent["GAME_OVER"] = 21] = "GAME_OVER";
      GlobalEvent[GlobalEvent["BOSS_WARNING"] = 22] = "BOSS_WARNING";
      GlobalEvent[GlobalEvent["ADD_ITEM"] = 23] = "ADD_ITEM";
      GlobalEvent[GlobalEvent["ITEM_USE"] = 24] = "ITEM_USE";
      GlobalEvent[GlobalEvent["PLANE_ATTACK_DONE"] = 25] = "PLANE_ATTACK_DONE";
      GlobalEvent[GlobalEvent["BALL_HIT"] = 26] = "BALL_HIT";
      GlobalEvent[GlobalEvent["MAINUI_TOUCH"] = 27] = "MAINUI_TOUCH";
      GlobalEvent[GlobalEvent["BOSS_ZAI_STEP"] = 28] = "BOSS_ZAI_STEP";
      GlobalEvent[GlobalEvent["OPEN_DEBUG"] = 29] = "OPEN_DEBUG";
      GlobalEvent[GlobalEvent["PXIEL_ENABLE"] = 30] = "PXIEL_ENABLE";
    })(GlobalEvent = exports.GlobalEvent || (exports.GlobalEvent = {}));
    cc._RF.pop();
  }, {} ],
  GameFactory: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "76474PsLk5HM4oIbHHEogNf", "GameFactory");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TableMgr_1 = require("../TableMgr");
    var HashMap_1 = require("../Utils/HashMap");
    var Config_1 = require("../Config/Config");
    var ObjPool = function() {
      function ObjPool(template, initSize, poolHandlerComps) {
        this._pool = [];
        this.poolHandlerComps = [];
        this.poolHandlerComps = poolHandlerComps;
        this.template = template;
        this.initPool(initSize);
      }
      ObjPool.prototype.initPool = function(size) {
        for (var i = 0; i < size; ++i) {
          var newNode = cc.instantiate(this.template);
          this.put(newNode);
        }
      };
      ObjPool.prototype.size = function() {
        return this._pool.length;
      };
      ObjPool.prototype.clear = function() {
        var count = this._pool.length;
        for (var i = 0; i < count; ++i) this._pool[i].destroy && this._pool[i].destroy();
        this._pool.length = 0;
      };
      ObjPool.prototype.put = function(obj) {
        if (obj && -1 === this._pool.indexOf(obj)) {
          obj.removeFromParent(false);
          if (this.poolHandlerComps) {
            var handlers = this.poolHandlerComps;
            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
              var handler = handlers_1[_i];
              var comp = obj.getComponent(handler);
              comp && comp.unuse && comp.unuse.apply(comp);
            }
          } else {
            var handlers = obj.getComponents(cc.Component);
            for (var _a = 0, handlers_2 = handlers; _a < handlers_2.length; _a++) {
              var handler = handlers_2[_a];
              handler && handler.unuse && handler.unuse.apply(handler);
            }
          }
          this._pool.push(obj);
        }
      };
      ObjPool.prototype.get = function() {
        var _ = [];
        for (var _i = 0; _i < arguments.length; _i++) _[_i] = arguments[_i];
        var last = this._pool.length - 1;
        last < 0 && this.initPool(10);
        last = this._pool.length - 1;
        var obj = this._pool[last];
        this._pool.length = last;
        if (this.poolHandlerComps) {
          var handlers = this.poolHandlerComps;
          for (var _a = 0, handlers_3 = handlers; _a < handlers_3.length; _a++) {
            var handler = handlers_3[_a];
            var comp = obj.getComponent(handler);
            comp && comp.reuse && comp.reuse.apply(comp, arguments);
          }
        } else {
          var handlers = obj.getComponents(cc.Component);
          for (var _b = 0, handlers_4 = handlers; _b < handlers_4.length; _b++) {
            var handler = handlers_4[_b];
            handler && handler.unuse && handler.reuse.apply(handler, arguments);
          }
        }
        return obj;
      };
      return ObjPool;
    }();
    var Step;
    (function(Step) {
      Step[Step["INIT"] = 0] = "INIT";
      Step[Step["MONSTER"] = 2] = "MONSTER";
      Step[Step["BALL"] = 4] = "BALL";
      Step[Step["BACKGROUND"] = 8] = "BACKGROUND";
      Step[Step["ITEM"] = 16] = "ITEM";
      Step[Step["EFFECT"] = 32] = "EFFECT";
      Step[Step["DONE"] = 62] = "DONE";
    })(Step || (Step = {}));
    var GameFactory = function() {
      function GameFactory() {
        this.step = Step.INIT;
        this.monstersPool = new HashMap_1.HashMap();
        this.ballPool = new HashMap_1.HashMap();
        this.scenePool = new HashMap_1.HashMap();
        this.itemPool = new HashMap_1.HashMap();
        this.effectPool = new HashMap_1.HashMap();
      }
      Object.defineProperty(GameFactory, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new GameFactory();
        },
        enumerable: true,
        configurable: true
      });
      GameFactory.prototype.init = function(callback) {
        this.doneCallback = callback;
        this.initMonsters();
        this.initBalls();
        this.initBackground();
        this.initItems();
        this.initEffect();
      };
      GameFactory.prototype.nextStep = function(step) {
        this.step |= step;
        console.log("Factory Step:" + Step[step]);
        this.step >= Step.DONE && this.doneCallback && this.doneCallback();
      };
      GameFactory.prototype.initMonsters = function() {
        var monsters = TableMgr_1.TableMgr.inst.getAll_Monster_ball__monster_Data();
        var self = this;
        var count = 0;
        var total = 0;
        for (var id in monsters) total++;
        var _loop_1 = function(id) {
          var url = "Prefabs/Monster/Monster-" + id;
          cc.loader.loadRes(url, cc.Prefab, function(err, prefab) {
            if (err) console.error(err); else {
              var monsterNode = cc.instantiate(prefab);
              self.monstersPool.add(id, new ObjPool(monsterNode, 10));
              count++;
              count >= total && self.nextStep(Step.MONSTER);
            }
          });
        };
        for (var id in monsters) _loop_1(id);
      };
      GameFactory.prototype.initBalls = function() {
        var balls = TableMgr_1.TableMgr.inst.getAll_Monster_ball_ball_Data();
        console.log(balls);
        var self = this;
        var count = 0;
        var total = 0;
        for (var id in balls) total++;
        var _loop_2 = function(id) {
          var url = "Prefabs/Ball/Ball-" + id;
          cc.loader.loadRes(url, cc.Prefab, function(err, prefab) {
            if (err) console.error(err); else {
              var ball = cc.instantiate(prefab);
              self.ballPool.add(id, new ObjPool(ball, 10));
              count++;
              count >= total && self.nextStep(Step.BALL);
            }
          });
        };
        for (var id in balls) _loop_2(id);
      };
      GameFactory.prototype.initBackground = function() {
        var scenes = TableMgr_1.TableMgr.inst.getAll_Monster_ball_scene_Data();
        var self = this;
        var count = 0;
        var total = 0;
        for (var id in scenes) total++;
        var _loop_3 = function(id) {
          var url = "Prefabs/Background/Background-" + id;
          cc.loader.loadRes(url, cc.Prefab, function(err, prefab) {
            if (err) console.error(err); else {
              var scene = cc.instantiate(prefab);
              self.scenePool.add(id, new ObjPool(scene, 1));
              count++;
              count >= total && self.nextStep(Step.BACKGROUND);
            }
          });
        };
        for (var id in scenes) _loop_3(id);
      };
      GameFactory.prototype.initItems = function() {
        var items = TableMgr_1.TableMgr.inst.getAll_Monster_ball_prop_Data();
        var self = this;
        var count = 0;
        var total = 0;
        for (var id in items) total++;
        var _loop_4 = function(id) {
          var url = "Prefabs/Item/Item-" + id;
          cc.loader.loadRes(url, cc.Prefab, function(err, prefab) {
            if (err) console.error(err); else {
              var item = cc.instantiate(prefab);
              self.itemPool.add(id, new ObjPool(item, 10));
              count++;
              count >= total && self.nextStep(Step.ITEM);
            }
          });
        };
        for (var id in items) _loop_4(id);
      };
      GameFactory.prototype.initEffect = function() {
        var effectUrl = {};
        effectUrl[Config_1.EffectType.Boom] = "Prefabs/Effect/Boom";
        var self = this;
        var count = 0;
        var total = 0;
        for (var type in effectUrl) total++;
        var _loop_5 = function(type) {
          var url = effectUrl[type];
          cc.loader.loadRes(url, cc.Prefab, function(err, prefab) {
            if (err) console.error(err); else {
              var effect = cc.instantiate(prefab);
              self.effectPool.add(parseInt(type), new ObjPool(effect, 10));
              count++;
              count >= total && self.nextStep(Step.EFFECT);
            }
          });
        };
        for (var type in effectUrl) _loop_5(type);
      };
      GameFactory.prototype.getEffect = function(type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        return this.effectPool.get(type).get(args);
      };
      GameFactory.prototype.puEffect = function(type, effect) {
        this.effectPool.get(type).put(effect);
      };
      GameFactory.prototype.getMonster = function(monsterID) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        return this.monstersPool.get(monsterID).get(args);
      };
      GameFactory.prototype.getBall = function(ballID) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        return this.ballPool.get(ballID).get(args);
      };
      GameFactory.prototype.putMonster = function(monsterID, monster) {
        this.monstersPool.get(monsterID).put(monster);
      };
      GameFactory.prototype.putBall = function(ballID, ball) {
        this.ballPool.get(ballID).put(ball);
      };
      GameFactory.prototype.getBackground = function(sceneID) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        return this.scenePool.get(sceneID).get(args);
      };
      GameFactory.prototype.putBackground = function(sceneID, scene) {
        this.scenePool.get(sceneID).put(scene);
      };
      GameFactory.prototype.getItems = function(itemID) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        console.log(itemID);
        return this.itemPool.get(itemID).get(args);
      };
      GameFactory.prototype.puItems = function(itemID, item) {
        this.itemPool.get(itemID).put(item);
      };
      return GameFactory;
    }();
    exports.gFactory = GameFactory.inst;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../TableMgr": "TableMgr",
    "../Utils/HashMap": "HashMap"
  } ],
  GameScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "77e59C16F1K6ZvgXVsPzEEZ", "GameScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseScene_1 = require("./BaseScene");
    var Config_1 = require("../Config/Config");
    var Game_1 = require("../Game/Game");
    var EventName_1 = require("../Event/EventName");
    var EventManager_1 = require("../Event/EventManager");
    var CameraController_1 = require("../Controller/CameraController");
    var GameFactory_1 = require("../Factory/GameFactory");
    var table_1 = require("../table");
    var Background_1 = require("./Background");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GameScene = function(_super) {
      __extends(GameScene, _super);
      function GameScene() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.BackgroundRoot = null;
        _this.BallRoot = null;
        _this.ItemRoot = null;
        _this.EffectRoot = null;
        _this.MonsterRoot = null;
        _this.LoadingBlock = null;
        _this.oldScene = null;
        _this.MainCamera = null;
        _this.UICamera = null;
        _this.physicManager = cc.director.getPhysicsManager();
        return _this;
      }
      GameScene.prototype.initPhysic = function() {
        this.physicManager.enabled = Config_1.PhysicConf.enabled;
        this.physicManager.gravity = Config_1.PhysicConf.gravity;
        this.physicManager.debugDrawFlags |= Config_1.PhysicConf.debugDrawFlags;
      };
      GameScene.prototype.onLoad = function() {
        var _this = this;
        this.oldScene.node.active = false;
        cc.director.preloadScene("Over", null, function(err, sceneAsset) {
          err ? console.error(err) : _this.overScene = sceneAsset.scene;
        });
        this.MonsterRoot.removeAllChildren();
        this.BackgroundRoot.removeAllChildren();
        CameraController_1.gCamera.bindMainCamera(this.MainCamera);
        CameraController_1.gCamera.bindUICamera(this.UICamera);
        CameraController_1.gCamera.initCamera();
        this.initPhysic();
        this.initEvent();
        this.LoadingBlock.active = true;
        this.showUI("Prefabs/MainUI");
        (true, true) && (window["GameScene"] = this);
      };
      GameScene.prototype.start = function() {};
      GameScene.prototype.initEvent = function() {
        var _this = this;
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.CHANGE_CUR_BALL, this.updateCurBall, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.CHANGE_GAME_SCENE, this.updateCurScene, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.ADD_NEW_MONSTER, this.updateMonsters, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_DIE, this.removeMonster, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.ADD_EFFECT, this.addEffect, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.ALL_INIT_DONE, function() {
          _this.LoadingBlock.active = false;
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.GAME_OVER, this.gameOver, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.ADD_ITEM, this.addItem, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.OPEN_DEBUG, function() {
          _this.showUI("Prefabs/Debug", cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        }, this);
      };
      GameScene.prototype.gameOver = function() {
        this.showUI("Prefabs/OverLayer");
      };
      GameScene.prototype.updateMonsters = function() {
        var _this = this;
        if (Game_1.Game.addMonsters.length <= 0) return;
        Game_1.Game.addMonsters.forEach(function(id, monster) {
          var old = _this.MonsterRoot.getChildByName(id);
          old && old.removeFromParent(true);
          var realID = id.split("-")[1];
          monster.Type == table_1.Monster_ball__monster_monster.BOSS && EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.BOSS_WARNING);
          var monsterNode = GameFactory_1.gFactory.getMonster(realID, id, monster);
          _this.MonsterRoot.addChild(monsterNode);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.MONSTER_ADD, monster.MonsterID);
        });
        Game_1.Game.addMonsters.clear();
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.ADD_MONSTER_DONE);
      };
      GameScene.prototype.removeMonster = function() {};
      GameScene.prototype.updateCurScene = function(sceneID) {
        if (!sceneID) {
          console.error("sceneID undefined!");
          return;
        }
        var oldScene = this.BackgroundRoot.children[0];
        if (oldScene && oldScene.name == sceneID.toString()) {
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.ADD_NEW_MONSTER);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.CHANGE_SCENE_DONE, sceneID);
          return;
        }
        var self = this;
        if (oldScene) {
          var background = oldScene.getComponent(Background_1.default);
          var state = background && background.isBroken ? "_broken" : "_normal";
          cc.loader.loadRes("Texture/Scene/" + oldScene.name + state, cc.SpriteFrame, function(err, spriteFrame) {
            GameFactory_1.gFactory.putBackground(oldScene.name, oldScene);
            if (err) console.error(err); else {
              self.oldScene.node.active = true;
              self.oldScene.spriteFrame = spriteFrame;
            }
            var newScene = GameFactory_1.gFactory.getBackground(sceneID.toString(), sceneID);
            newScene.name = sceneID.toString();
            self.BackgroundRoot.addChild(newScene);
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.CHANGE_SCENE_DONE, sceneID);
          });
        } else {
          this.oldScene.node.active = false;
          var newScene = GameFactory_1.gFactory.getBackground(sceneID.toString(), sceneID);
          newScene.name = sceneID.toString();
          this.BackgroundRoot.addChild(newScene);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.CHANGE_SCENE_DONE, sceneID);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.ADD_NEW_MONSTER);
        }
      };
      GameScene.prototype.addItem = function(addItems) {
        for (var _i = 0, addItems_1 = addItems; _i < addItems_1.length; _i++) {
          var item = addItems_1[_i];
          var itemNode = GameFactory_1.gFactory.getItems(item.itemID, item.itemID, item.index);
          itemNode.setPosition(item.initPos);
          this.ItemRoot.addChild(itemNode);
        }
      };
      GameScene.prototype.updateCurBall = function(ball, pos, rotation) {
        if (ball) {
          var ballNode = GameFactory_1.gFactory.getBall(ball.BallID.toString(), ball.BallID, ball, rotation);
          ballNode.name = ball.BallID.toString();
          pos && ballNode.setPosition(pos);
          this.BallRoot.removeAllChildren();
          this.BallRoot.addChild(ballNode);
          CameraController_1.gCamera.setTarget(ballNode);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.CUR_BALL_UPDATE, false, ball.BallID);
        } else if (this.BallRoot.childrenCount > 0) {
          var oldBall = this.BallRoot.children[0];
          GameFactory_1.gFactory.putBall(oldBall.name, oldBall);
          CameraController_1.gCamera.setTarget(null);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.CUR_BALL_UPDATE, true, null);
        }
      };
      GameScene.prototype.addEffect = function(effectType, pos, isRocket) {
        void 0 === isRocket && (isRocket = true);
        var effect = GameFactory_1.gFactory.getEffect(effectType, effectType, isRocket);
        var position = this.EffectRoot.convertToNodeSpaceAR(pos);
        effect.setPosition(position);
        this.EffectRoot.addChild(effect);
      };
      GameScene.prototype.update = function(dt) {
        Game_1.Game.update(dt);
      };
      __decorate([ property(cc.Node) ], GameScene.prototype, "BackgroundRoot", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "BallRoot", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "ItemRoot", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "EffectRoot", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "MonsterRoot", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "LoadingBlock", void 0);
      __decorate([ property(cc.Sprite) ], GameScene.prototype, "oldScene", void 0);
      __decorate([ property(cc.Camera) ], GameScene.prototype, "MainCamera", void 0);
      __decorate([ property(cc.Camera) ], GameScene.prototype, "UICamera", void 0);
      GameScene = __decorate([ ccclass ], GameScene);
      return GameScene;
    }(BaseScene_1.default);
    exports.default = GameScene;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../Controller/CameraController": "CameraController",
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Factory/GameFactory": "GameFactory",
    "../Game/Game": "Game",
    "../table": "table",
    "./Background": "Background",
    "./BaseScene": "BaseScene"
  } ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6a81f8eJfVKtIiDBlLB7gVo", "Game");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TableMgr_1 = require("../TableMgr");
    var Ball_1 = require("./Ball");
    var HashMap_1 = require("../Utils/HashMap");
    var EventName_1 = require("../Event/EventName");
    var table_1 = require("../table");
    var Monster_1 = require("./Monster");
    var BuffManager_1 = require("./BuffManager");
    var EventManager_1 = require("../Event/EventManager");
    var CameraController_1 = require("../Controller/CameraController");
    var Config_1 = require("../Config/Config");
    var GameMgr = function() {
      function GameMgr() {
        this.levels = [];
        this.level = 0;
        this.sceneID = 0;
        this.curHp = 0;
        this.totalScore = 0;
        this.combo = 0;
        this.balls = new HashMap_1.HashMap();
        this.monsters = new HashMap_1.HashMap();
        this.items = new HashMap_1.HashMap();
        this.curItems = new HashMap_1.HashMap();
        this.monsterIDQueue = [];
        this.fighttingMonsters = new HashMap_1.HashMap();
        this.addMonsters = new HashMap_1.HashMap();
        this.monsterCounts = 0;
        this.isRunning = false;
        this.monsterUpdateTime = 0;
        this.needAddMonster = false;
        this.itemRefreshCD = 5;
        this.itemCD = 0;
        this.needAddItem = false;
        this.buff = new BuffManager_1.BuffManager("game");
      }
      Object.defineProperty(GameMgr, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new GameMgr();
        },
        enumerable: true,
        configurable: true
      });
      GameMgr.prototype.initItems = function() {
        if (!this.levelStaticInfo || 0 == this.level) {
          console.error("\u9700\u8981\u5148\u521d\u59cb\u5316\u5f53\u524dlevel\uff1a" + this.level);
          return;
        }
        this.itemCD = 0;
        this.needAddItem = true;
        this.items.clear();
        if (!this.levelStaticInfo.prop) return;
        for (var _i = 0, _a = this.levelStaticInfo.prop; _i < _a.length; _i++) {
          var itemInfo = _a[_i];
          var itemID = parseInt(itemInfo.split("|")[0]);
          var itemNumber = parseInt(itemInfo.split("|")[1]);
          this.items.add(itemID.toString(), itemNumber);
        }
      };
      GameMgr.prototype.initMonsters = function() {
        if (!this.levelStaticInfo || 0 == this.level) {
          console.error("\u9700\u8981\u5148\u521d\u59cb\u5316\u5f53\u524dlevel\uff1a" + this.level);
          return;
        }
        this.monsters.clear();
        this.fighttingMonsters.clear();
        this.monsterCounts = 0;
        this.monsterIDQueue = [];
        for (var i = 1; i <= 3; ++i) {
          if (!this.levelStaticInfo["monster" + i]) break;
          for (var _i = 0, _a = this.levelStaticInfo["monster" + i]; _i < _a.length; _i++) {
            var monsterInfo = _a[_i];
            if ("" == monsterInfo) continue;
            var monsterID = parseInt(monsterInfo.split("|")[0]);
            var monsterPid = monsterID.toString() + "-" + i.toString();
            this.monsterIDQueue.push(monsterPid);
            var monsterNumber = parseInt(monsterInfo.split("|")[1]);
            var monsters = [];
            while (monsterNumber-- > 0) {
              var monster = new Monster_1.Monster(monsterID);
              monster.initPos = i;
              monsters.push(monster);
            }
            var addMonsters = this.monsters.get(monsterPid);
            addMonsters ? this.monsters.add(monsterPid, addMonsters.concat(monsters)) : this.monsters.add(monsterPid, monsters);
          }
        }
        var obj = {};
        for (var i = 0; i < this.monsterIDQueue.length; ++i) if (obj[this.monsterIDQueue[i]]) {
          this.monsterIDQueue.splice(i, 1);
          --i;
        } else obj[this.monsterIDQueue[i]] = i;
        console.log(this.monsterIDQueue);
        console.log(this.monsters.values.concat());
      };
      GameMgr.prototype.setRunning = function(isRunning) {
        this.isRunning = isRunning;
      };
      GameMgr.prototype.isRun = function() {
        return this.isRunning;
      };
      GameMgr.prototype.updateFightMonsters = function(dispatch) {
        void 0 === dispatch && (dispatch = false);
        if (this.checkNextLevel()) return;
        if (this.monsterIDQueue.length <= 0) return;
        if (this.fighttingMonsters.length >= this.levelStaticInfo.monste_max) {
          console.log("\u8d85\u8fc7\u6700\u5927\u6570\u91cf");
          return;
        }
        var monsterQue = this.monsterIDQueue.concat();
        var isFightMonsterUpdate = false;
        while (monsterQue.length > 0) {
          var newMonsterID = monsterQue.shift();
          var monsterAddNumber = 1;
          if (!newMonsterID) continue;
          if (this.fighttingMonsters.length >= this.levelStaticInfo.monste_max) break;
          var monsters = this.monsters.get(newMonsterID);
          if (!monsters) continue;
          while (monsterAddNumber-- > 0) {
            var monster = monsters.pop();
            if (!monster) break;
            var id = this.monsterCounts + "-" + newMonsterID;
            if (this.fighttingMonsters.get(id)) {
              console.error("\u91cd\u590d\u7684\u602a\u7269:" + id);
              continue;
            }
            isFightMonsterUpdate = true;
            this.monsterCounts++;
            this.fighttingMonsters.add(id, monster);
            this.addMonsters.add(id, monster);
            if (this.fighttingMonsters.length >= this.levelStaticInfo.monste_max) break;
          }
          if (monsters.length > 0) ; else {
            console.log("monster remove:" + newMonsterID);
            this.monsters.remove(newMonsterID);
            var delIndex = this.monsterIDQueue.indexOf(newMonsterID);
            this.monsterIDQueue.splice(delIndex, 1);
          }
        }
        if (isFightMonsterUpdate) {
          dispatch && EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.ADD_NEW_MONSTER);
          this.needAddMonster = false;
        }
      };
      GameMgr.prototype.initBalls = function() {
        if (0 == this.level || !this.levelStaticInfo) {
          console.error("\u9700\u8981\u5148\u521d\u59cb\u5316\u5f53\u524dlevel\uff1a" + this.level);
          return;
        }
        this.balls.clear();
        var ballInfo = TableMgr_1.TableMgr.inst.getMonster_ball_paly_level(this.level).ball;
        for (var _i = 0, ballInfo_1 = ballInfo; _i < ballInfo_1.length; _i++) {
          var ball = ballInfo_1[_i];
          if ("" == ball) continue;
          var ballID = parseInt(ball.split("|")[0]);
          var ballNumber = parseInt(ball.split("|")[1]);
          var balls = [];
          while (ballNumber-- > 0) balls.push(new Ball_1.Ball(ballID));
          this.balls.add(ballID, balls);
        }
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_BALL_ITEM_NUMBER);
      };
      GameMgr.prototype.initLevels = function() {
        this.levels = [];
        var allLevelData = TableMgr_1.TableMgr.inst.getAll_Monster_ball_paly_level_Data();
        for (var levelID in allLevelData) this.levels.push(parseInt(levelID));
        this.levels.sort(function(a, b) {
          return a - b;
        });
        console.log(this.levels);
        this.level = 0;
        this.nextLevel();
      };
      GameMgr.prototype.nextLevel = function() {
        this.setCurBall(null);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.GEN_NEXT_LEVEL);
        var now = Date.now();
        this.setRunning(false);
        this.buff.clear();
        var self = this;
        function nextTick() {
          console.log(" start next level: " + (Date.now() - now) + "ms");
          if (0 != self.level && self.levelStaticInfo) {
            self.addScore(self.levelStaticInfo.score);
            self.curHp >= self.levelStaticInfo.hp_mini && self.addScore(self.levelStaticInfo.subjoin);
          }
          if (self.levels.length <= 0) {
            console.log("cross over all level");
            return;
          }
          self.level = self.levels.shift();
          self.levelStaticInfo = TableMgr_1.TableMgr.inst.getMonster_ball_paly_level(self.level);
          self.sceneID != self.levelStaticInfo.map && (self.sceneID = self.levelStaticInfo.map);
          self.initMonsters();
          self.initBalls();
          self.initItems();
          self.updateFightMonsters();
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.CHANGE_GAME_SCENE, self.levelStaticInfo.map);
          self.curHp = self.levelStaticInfo.hp;
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_SCENE_HP_PROGRESS, self.curHp / self.levelStaticInfo.hp, 0);
        }
        CameraController_1.gCamera.initCamera();
        cc.director.once(cc.Director.EVENT_BEFORE_UPDATE, nextTick.bind(this), this);
      };
      GameMgr.prototype.start = function() {
        this.setScore(0);
        this.initLevels();
      };
      GameMgr.prototype.setScore = function(score) {
        this.totalScore = score;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_SCORE, this.totalScore);
      };
      GameMgr.prototype.addScore = function(score) {
        this.totalScore += score;
        this.totalScore = Math.max(0, this.totalScore);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_SCORE, this.totalScore);
      };
      GameMgr.prototype.changeCurBall = function(ballID, pos, rotation) {
        if (this.curBall) {
          if (this.curBall.BallID == ballID) return;
          var oldBalls = this.balls.get(this.curBall.BallID);
          oldBalls && oldBalls.push(this.curBall);
        }
        var newBalls = this.balls.get(ballID);
        if (!newBalls || newBalls.length <= 0) {
          console.error(" ball not exist in balls:" + ballID);
          return;
        }
        this.setCurBall(newBalls.shift(), pos, rotation);
      };
      GameMgr.prototype.setCurBall = function(ball, pos, rotation) {
        this.curBall = ball;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.CHANGE_CUR_BALL, ball, pos, rotation);
      };
      GameMgr.prototype.getBallNumber = function(ballID) {
        var ball = this.balls.get(ballID);
        return ball ? ball.length : 0;
      };
      GameMgr.prototype.addHp = function(hp, addTotal) {
        void 0 === addTotal && (addTotal = -1e3);
        if (INVINCIBLE) return;
        this.curHp += hp;
        console.log("\u57ce\u5e02\u53d7\u5230\u653b\u51fb:" + hp + ",\u5269\u4f59\u8840\u91cf:" + this.curHp);
        this.curHp = CMath.Clamp(this.curHp, this.levelStaticInfo.hp, 0);
        var percent = -1e3 != addTotal ? addTotal / this.levelStaticInfo.hp : null;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_SCENE_HP_PROGRESS, this.curHp / this.levelStaticInfo.hp, percent);
        this.curHp <= 1 && this.gameOver();
      };
      GameMgr.prototype.ballCost = function(ballID) {
        if (!this.curBall) {
          console.error(" cur ball null");
          return;
        }
        if (this.curBall.BallID != ballID) {
          console.error("cur ball id unmatch:" + this.curBall.BallID + ":" + ballID);
          return;
        }
        if (!this.curBall.use()) {
          console.log("\u8010\u4e45\u5ea6\u8017\u5c3d");
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_BALL_ITEM_NUMBER, ballID);
          this.setCurBall(null);
          this.removeBall(ballID);
        }
      };
      GameMgr.prototype.removeBall = function(ballID) {
        var balls = this.balls.get(ballID);
        balls && balls.length <= 0 && this.balls.remove(ballID);
        this.balls.length <= 0 && this.monsters.length > 0 && this.fighttingMonsters.length > 0 && this.gameOver();
      };
      GameMgr.prototype.gameOver = function() {
        this.setRunning(false);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.GAME_OVER);
      };
      GameMgr.prototype.excuteBallUpdate = function(dt) {
        this.curBall && this.curBall.update(dt);
      };
      GameMgr.prototype.excuteMonstersUpdate = function(dt) {
        this.fighttingMonsters.forEach(function(id, monster) {
          monster.update(dt, id);
        });
      };
      GameMgr.prototype.checkNextLevel = function() {
        if (this.monsters.length <= 0 && this.fighttingMonsters.length <= 0) {
          this.nextLevel();
          return true;
        }
        return false;
      };
      GameMgr.prototype.update = function(dt) {
        if (!this.isRunning) return;
        if (this.checkNextLevel()) return;
        this.buff.update(dt);
        this.excuteBallUpdate(dt);
        this.needAddMonster && (this.monsterUpdateTime += dt);
        if (this.monsterUpdateTime > 3 || 0 == this.fighttingMonsters.length) {
          this.updateFightMonsters(true);
          this.monsterUpdateTime = 0;
        }
        this.excuteMonstersUpdate(dt);
        if (this.needAddItem) {
          this.itemCD += dt;
          if (this.itemCD >= this.itemRefreshCD) {
            this.itemCD = 0;
            this.needAddItem = false;
            this.addItem();
          }
        }
      };
      GameMgr.prototype.addItem = function() {
        var _this = this;
        var maxNum = this.levelStaticInfo.prop_max;
        if (maxNum <= 0 || this.items.length <= 0) return;
        var addItem = [];
        var delItem = [];
        var initPoss = Config_1.ItemRefreshPos[exports.Game.sceneID].concat();
        this.items.forEach(function(id, val) {
          if (val <= 0) {
            delItem.push(id);
            return;
          }
          if (addItem.length >= maxNum || initPoss.length <= 0) return;
          var index = initPoss.length - 1;
          if (_this.curItems.get(index)) {
            initPoss.pop();
            return;
          }
          _this.curItems.add(index, id);
          var item = {
            itemID: id,
            initPos: initPoss.pop(),
            index: index
          };
          _this.items.add(id, val - 1);
          addItem.push(item);
        });
        for (var _i = 0, delItem_1 = delItem; _i < delItem_1.length; _i++) {
          var del = delItem_1[_i];
          this.items.remove(del);
        }
        addItem.length > 0 && EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.ADD_ITEM, addItem);
      };
      GameMgr.prototype.removeItem = function(index) {
        this.curItems.remove(index);
        this.needAddItem = true;
      };
      GameMgr.prototype.attackAll = function(attack) {
        var monsterIDs = this.fighttingMonsters.keys;
        for (var _i = 0, monsterIDs_1 = monsterIDs; _i < monsterIDs_1.length; _i++) {
          var monsterID = monsterIDs_1[_i];
          var monster = this.fighttingMonsters.get(monsterID);
          if (!monster) {
            console.warn(" monster is null");
            continue;
          }
          if (monster.Invincible) continue;
          if (monster.addHp(-attack)) {
            monster.setState(Monster_1.MonsterState.HIT);
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.MONSTER_HIT, monsterID);
          } else {
            this.addScore(monster.Score);
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.MONSTER_DIE, monsterID);
            this.fighttingMonsters.remove(monsterID);
            this.needAddMonster = true;
          }
        }
      };
      GameMgr.prototype.numbAll = function(time) {
        this.fighttingMonsters.forEach(function(monsterID, monster) {
          if (monster.Invincible) return;
          var buffOption = {
            name: "\u9ebb\u75f9\u602a\u517d",
            type: BuffManager_1.BuffType.NUMB,
            isCover: false,
            isImmediately: true,
            isOnce: true,
            handler: function() {
              monster.setState(Monster_1.MonsterState.NUMB);
            },
            completeHandler: function() {
              monster.delState(Monster_1.MonsterState.NUMB);
            },
            lastTime: 1e3 * time,
            duration: 0,
            target: monster
          };
          monster.buff.addBuff(buffOption);
        });
      };
      GameMgr.prototype.ballAttack = function(ballID, monsterID) {
        if (!this.curBall) {
          console.log("\u5f53\u524d\u573a\u666f\u6ca1\u6709\u7403,\u53ef\u80fd\u662flifeTime\u7528\u5c3d:" + ballID);
          return;
        }
        if (this.curBall.BallID != ballID) {
          console.error("\u653b\u51fb\u7403:" + ballID + " \u4e0d\u662f\u5f53\u524d\u7403:" + this.curBall.BallID);
          return;
        }
        var monster = this.fighttingMonsters.get(monsterID);
        if (!monster) {
          console.error("\u53d7\u653b\u51fb\u602a\u7269\u4e0d\u5728\u5f53\u524d\u6218\u6597\u602a\u7269\u5217\u8868:" + monsterID);
          return;
        }
        if (monster.Invincible) return;
        if (monster.addHp(-this.curBall.Attack)) {
          var buffOpt = {
            name: "\u65e0\u654c",
            type: BuffManager_1.BuffType.INVINCIBLE,
            handler: function() {
              monster.setState(Monster_1.MonsterState.INVINCIBLE);
            },
            completeHandler: function() {
              monster.delState(Monster_1.MonsterState.INVINCIBLE);
            },
            isOnce: true,
            isImmediately: true,
            duration: 0,
            lastTime: 2e3,
            target: this,
            isCover: true
          };
          monster.buff.addBuff(buffOpt);
          monster.setState(Monster_1.MonsterState.HIT);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.MONSTER_HIT, monsterID);
          switch (this.curBall.Form) {
           case table_1.Monster_ball_ball_form.DianJiMaBi:
            this.numbMonster(monster);
          }
        } else {
          this.addScore(monster.Score);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.MONSTER_DIE, monsterID);
          this.fighttingMonsters.remove(monsterID);
          this.needAddMonster = true;
        }
        this.ballCost(ballID);
      };
      GameMgr.prototype.numbMonster = function(monster) {
        if (!this.curBall) {
          console.error("\u653b\u51fb\u7403\u4e0d\u5b58\u5728");
          return;
        }
        var buffOption = {
          name: "\u9ebb\u75f9\u602a\u517d",
          type: BuffManager_1.BuffType.NUMB,
          isCover: false,
          isImmediately: true,
          isOnce: true,
          handler: function() {
            monster.setState(Monster_1.MonsterState.NUMB);
          },
          completeHandler: function() {
            monster.delState(Monster_1.MonsterState.NUMB);
          },
          lastTime: 1e3 * this.curBall.Continue,
          duration: 0,
          target: monster
        };
        monster.buff.addBuff(buffOption);
      };
      return GameMgr;
    }();
    exports.Game = GameMgr.inst;
    true, window["Game"] = exports.Game;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../Controller/CameraController": "CameraController",
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../TableMgr": "TableMgr",
    "../Utils/HashMap": "HashMap",
    "../table": "table",
    "./Ball": "Ball",
    "./BuffManager": "BuffManager",
    "./Monster": "Monster"
  } ],
  HashMap: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "96215VUsb1F1bf/LYNJmv41", "HashMap");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var HashMap = function() {
      function HashMap() {
        this._list = new Array();
        this.clear();
      }
      HashMap.prototype.getIndexByKey = function(key) {
        var count = this._list.length;
        for (var index = 0; index < count; index++) {
          var element = this._list[index];
          if (element.key == key) return index;
        }
        return -1;
      };
      Object.defineProperty(HashMap.prototype, "keys", {
        get: function() {
          var keys = new Array();
          for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
            var element = _a[_i];
            element && keys.push(element.key);
          }
          return keys;
        },
        enumerable: true,
        configurable: true
      });
      HashMap.prototype.add = function(key, value) {
        var data = {
          key: key,
          value: value
        };
        var index = this.getIndexByKey(key);
        -1 != index ? this._list[index] = data : this._list.push(data);
      };
      Object.defineProperty(HashMap.prototype, "values", {
        get: function() {
          return this._list;
        },
        enumerable: true,
        configurable: true
      });
      HashMap.prototype.remove = function(key) {
        var index = this.getIndexByKey(key);
        if (-1 != index) {
          var data = this._list[index];
          this._list.splice(index, 1);
          return data;
        }
        return null;
      };
      HashMap.prototype.has = function(key) {
        var index = this.getIndexByKey(key);
        return -1 != index;
      };
      HashMap.prototype.get = function(key) {
        var index = this.getIndexByKey(key);
        if (-1 != index) {
          var data = this._list[index];
          return data.value;
        }
        return null;
      };
      Object.defineProperty(HashMap.prototype, "length", {
        get: function() {
          return this._list.length;
        },
        enumerable: true,
        configurable: true
      });
      HashMap.prototype.sort = function(compare) {
        this._list.sort(compare);
      };
      HashMap.prototype.forEachKeyValue = function(f) {
        var count = this._list.length;
        for (var index = 0; index < count; index++) {
          var element = this._list[index];
          f(element);
        }
      };
      HashMap.prototype.forEach = function(f) {
        var count = this._list.length;
        for (var index = 0; index < count; index++) {
          var element = this._list[index];
          f(element.key, element.value);
        }
      };
      HashMap.prototype.clear = function() {
        this._list = [];
      };
      return HashMap;
    }();
    exports.HashMap = HashMap;
    cc._RF.pop();
  }, {} ],
  HorizontalMovement: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2bd18kkyVhB3qxIKwDUpik5", "HorizontalMovement");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Monster_1 = require("../Game/Monster");
    var MonsterSpine_1 = require("./MonsterSpine");
    var EventName_1 = require("../Event/EventName");
    var EventManager_1 = require("../Event/EventManager");
    var MonsterCtrl_1 = require("./MonsterCtrl");
    var BuffManager_1 = require("../Game/BuffManager");
    var table_1 = require("../table");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var HorizontalMovement = function(_super) {
      __extends(HorizontalMovement, _super);
      function HorizontalMovement() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.monster = null;
        _this.stage = 0;
        _this.moveCD = 0;
        return _this;
      }
      HorizontalMovement.prototype.reuse = function() {
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_DIE, this.die, this);
        this.updateMonsterInfo(arguments[0][0], arguments[0][1]);
      };
      HorizontalMovement.prototype.die = function(monsterID) {
        if (this.id != monsterID) return;
        this.monster = null;
      };
      Object.defineProperty(HorizontalMovement.prototype, "Spine", {
        get: function() {
          return this.spine ? this.spine : this.spine = this.getComponent(MonsterSpine_1.default);
        },
        enumerable: true,
        configurable: true
      });
      HorizontalMovement.prototype.unuse = function() {
        EventManager_1.gEventMgr.targetOff(this);
        this.monster = null;
        this.id = this.readID = "";
        this.stage = 0;
      };
      HorizontalMovement.prototype.updateMonsterInfo = function(id, monster) {
        this.id = id;
        this.readID = monster.MonsterID.toString();
        this.monster = monster;
        this.stage = this.monster.Stage;
        this.enabled = this.monster.realMoveType == MonsterCtrl_1.MoveType.GroundMove && this.monster.Type != table_1.Monster_ball__monster_monster.BOSS;
      };
      HorizontalMovement.prototype.start = function() {};
      HorizontalMovement.prototype.update = function(dt) {
        var _this = this;
        if (!this.monster) return;
        if (!(cc.director.getTotalFrames() % 300)) {
          var buffOpt = {
            name: "\u4f11\u606f\u4e00\u4e0b",
            type: BuffManager_1.BuffType.RELAX,
            handler: function() {
              console.log("\u8bbe\u7f6e\u4f11\u606f");
              _this.monster.setState(Monster_1.MonsterState.RELAX);
            },
            completeHandler: function() {
              _this.monster && _this.monster.delState(Monster_1.MonsterState.RELAX);
            },
            isOnce: true,
            isImmediately: true,
            duration: 0,
            lastTime: 1e3 * this.monster.StiffTime,
            target: this,
            isCover: true
          };
          this.monster.buff.addBuff(buffOpt);
        }
        if (this.monster.CanMove) {
          this.Spine.move();
          this.monster.setState(Monster_1.MonsterState.HIDE);
          this.node.x >= 1600 ? this.node.scaleX = 1 : this.node.x <= -1600 ? this.node.scaleX = -1 : Math.abs(this.node.x) < 800 && this.monster.delState(Monster_1.MonsterState.HIDE);
          this.node.x -= this.monster.MoveSpeed * dt * this.node.scaleX;
        } else this.Spine.idle();
      };
      HorizontalMovement = __decorate([ ccclass ], HorizontalMovement);
      return HorizontalMovement;
    }(cc.Component);
    exports.default = HorizontalMovement;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Game/BuffManager": "BuffManager",
    "../Game/Monster": "Monster",
    "../table": "table",
    "./MonsterCtrl": "MonsterCtrl",
    "./MonsterSpine": "MonsterSpine"
  } ],
  Item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b575eAMZaJP3IL3H96DDZtz", "Item");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var table_1 = require("../table");
    var GameFactory_1 = require("../Factory/GameFactory");
    var Game_1 = require("../Game/Game");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var TableMgr_1 = require("../TableMgr");
    var BuffManager_1 = require("../Game/BuffManager");
    var Config_1 = require("../Config/Config");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Item = function(_super) {
      __extends(Item, _super);
      function Item() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.itemData = null;
        _this.index = -1;
        return _this;
      }
      Item.prototype.start = function() {
        var _this = this;
        this.type = cc.RigidBodyType.Static;
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.GEN_NEXT_LEVEL, function() {
          _this.itemID && _this.node && GameFactory_1.gFactory.puItems(_this.itemID, _this.node);
        }, this);
      };
      Item.prototype.update = function(dt) {
        if (!this.node || !this.node.isValid || !this.itemID) return;
        this.node.y -= 2;
        if (this.node.y < -500) {
          Game_1.Game.removeItem(this.index);
          GameFactory_1.gFactory.puItems(this.itemID, this.node);
        }
      };
      Item.prototype.reuse = function() {
        this.itemID = arguments[0][0];
        this.index = arguments[0][1];
        this.itemData = TableMgr_1.TableMgr.inst.getMonster_ball_prop(this.itemID);
        this.node.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(2, 30), cc.rotateTo(4, -30))));
      };
      Item.prototype.unuse = function() {
        this.itemData = null;
        this.index = null;
        this.itemID = null;
      };
      Item.prototype.onBeginContact = function(contact, self, other) {
        if (this.itemData) {
          var callback = void 0;
          switch (this.itemData.form) {
           case table_1.Monster_ball_prop_form.HuiFuNaiJiuDu:
            callback = function(duration) {
              var totalRecover = this.itemData.recover;
              var lastTime = duration || this.itemData.continue;
              var counts = lastTime * Config_1.Config.FPS;
              var recoverPer = totalRecover / counts;
              var addTotal = Game_1.Game.curHp + totalRecover;
              var buffOpt = {
                name: "\u56de\u8840",
                type: BuffManager_1.BuffType.RECOVER,
                init: function() {
                  Game_1.Game.addHp(0, addTotal);
                },
                handler: function() {
                  Game_1.Game.addHp(recoverPer);
                },
                completeHandler: function() {
                  Game_1.Game.addHp(0, 0);
                },
                isOnce: false,
                isImmediately: true,
                duration: 0,
                lastTime: 1e3 * lastTime,
                target: this,
                isCover: true
              };
              Game_1.Game.buff.addBuff(buffOpt);
            }.bind(this);
            break;

           case table_1.Monster_ball_prop_form.JiaFenShu:
            break;

           case table_1.Monster_ball_prop_form.QuanBuGuaiWuTingDun:
            var continueTime_1 = this.itemData.continue;
            callback = function() {
              Game_1.Game.numbAll(continueTime_1);
            }.bind(this);
            break;

           case table_1.Monster_ball_prop_form.QuanPingGongJiGuaiWu:
            var attack_1 = this.itemData.attack;
            callback = function() {
              Game_1.Game.attackAll(attack_1);
              EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLANE_ATTACK_DONE);
            }.bind(this);
          }
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.ITEM_USE, this.itemData.form, this.itemData.ID, callback);
          Game_1.Game.addScore(this.itemData.subjoin);
        }
        Game_1.Game.removeItem(this.index);
        GameFactory_1.gFactory.puItems(this.itemID, this.node);
      };
      Item = __decorate([ ccclass ], Item);
      return Item;
    }(cc.RigidBody);
    exports.default = Item;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Factory/GameFactory": "GameFactory",
    "../Game/BuffManager": "BuffManager",
    "../Game/Game": "Game",
    "../TableMgr": "TableMgr",
    "../table": "table"
  } ],
  MainUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ec2bcfHFttIP5etQE6CTIcF", "MainUI");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventName_1 = require("../Event/EventName");
    var Config_1 = require("../Config/Config");
    var TableMgr_1 = require("../TableMgr");
    var Game_1 = require("../Game/Game");
    var BallTab_1 = require("./BallTab");
    var EventManager_1 = require("../Event/EventManager");
    var table_1 = require("../table");
    var Init_Step;
    (function(Init_Step) {
      Init_Step[Init_Step["START"] = 0] = "START";
      Init_Step[Init_Step["SCENE"] = 4] = "SCENE";
      Init_Step[Init_Step["BALL_TAB"] = 8] = "BALL_TAB";
      Init_Step[Init_Step["MONSTER"] = 16] = "MONSTER";
      Init_Step[Init_Step["DONE"] = 28] = "DONE";
    })(Init_Step = exports.Init_Step || (exports.Init_Step = {}));
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MainUI = function(_super) {
      __extends(MainUI, _super);
      function MainUI() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.HpProgressBar = null;
        _this.greenHpBar = null;
        _this.ScoreLabel = null;
        _this.bgBlock = null;
        _this.Debug = null;
        _this.BallTabRoot = null;
        _this.BallNumber = null;
        _this.Top = null;
        _this.Bottom = null;
        _this.Left = null;
        _this.Right = null;
        _this.Wainning = null;
        _this.animation = null;
        _this.score = 0;
        _this.step = Init_Step.START;
        _this.itemCallback = {};
        _this.oldProgress = 0;
        _this.levelLabel = null;
        return _this;
      }
      MainUI.prototype.initEvent = function() {
        var _this = this;
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_SCENE_HP_PROGRESS, this.updateProgress, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_SCORE, this.updateScore, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouched.bind(this), this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.CHANGE_GAME_SCENE, this.startLoadScene, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.BOSS_WARNING, this.bossWarning, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.CHANGE_SCENE_DONE, this.onSceneLoadDone.bind(this), this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PRE_SELECT_BALL, this.updateCurBall, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.CUR_BALL_UPDATE, this.onCurBallUpdate, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.GEN_NEXT_LEVEL, function() {
          console.log(" gen next level\uff1a" + Date.now());
          _this.enableBlock(true);
          EventManager_1.gEventMgr.once(EventName_1.GlobalEvent.ADD_MONSTER_DONE, function() {
            _this.next(Init_Step.MONSTER);
          }, _this);
        }, this);
        this.Animation.on(cc.Animation.EventType.FINISHED, this.onAnimationDone, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.ITEM_USE, this.itemUse, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function() {
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.MAINUI_TOUCH);
        }, this);
      };
      MainUI.prototype.onCurBallUpdate = function(isDelete, ballID) {
        if (this.curBallID && isDelete || ballID == this.curBallID) {
          var num = Game_1.Game.getBallNumber(this.curBallID);
          this.updateTabLabel("/" + num);
        } else this.updateTabLabel("");
      };
      MainUI.prototype.initAdaptionSize = function() {
        if (!cc.sys.isMobile) return;
        this.Left.width = Math.abs(cc.view.getFrameSize().width - cc.winSize.width) / 2;
        this.Right.width = this.Left.width;
        this.Top.height = Math.abs(cc.view.getFrameSize().height - cc.winSize.height) / 2;
        this.Bottom.height = this.Top.height;
      };
      Object.defineProperty(MainUI.prototype, "Animation", {
        get: function() {
          this.animation || (this.animation = this.getComponent(cc.Animation));
          return this.animation;
        },
        enumerable: true,
        configurable: true
      });
      MainUI.prototype.bossWarning = function() {
        if (this.Wainning.active) return;
        console.log("boss warning");
        this.Wainning.active = true;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.BOSS_WARNING);
        this.Animation.playAdditive("warning");
      };
      MainUI.prototype.onSceneLoadDone = function(sceneID) {
        this.sceneID = sceneID;
        var sceneInfo = TableMgr_1.TableMgr.inst.getMonster_ball_scene(this.sceneID) || {
          name: "unknow area"
        };
        this.next(Init_Step.SCENE);
      };
      MainUI.prototype.next = function(step) {
        this.step |= step;
        console.log("MAINUI Step:" + Init_Step[step] + ", total :" + this.step);
        if (this.step >= Init_Step.DONE) {
          this.Animation.playAdditive("sceneFade");
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.ALL_INIT_DONE);
          this.step = Init_Step.START;
        }
      };
      MainUI.prototype.itemUse = function(type, itemid, callback) {
        switch (type) {
         case table_1.Monster_ball_prop_form.HuiFuNaiJiuDu:
          var state = this.Animation.playAdditive("recover");
          callback(state.duration);
          break;

         case table_1.Monster_ball_prop_form.JiaFenShu:
          break;

         case table_1.Monster_ball_prop_form.QuanBuGuaiWuTingDun:
          callback();
          break;

         case table_1.Monster_ball_prop_form.QuanPingGongJiGuaiWu:
          this.Animation.playAdditive("plane");
          this.itemCallback["plane"] = callback;
        }
      };
      MainUI.prototype.onAnimationDone = function() {
        switch (arguments[1].clip.name) {
         case "sceneFade":
          Game_1.Game.setRunning(true);
          this.enableBlock(false);
          break;

         case "warning":
          this.Wainning.active = false;
          break;

         case "recover":
         case "plane":
          if (this.itemCallback[arguments[1].clip.name]) {
            this.itemCallback[arguments[1].clip.name]();
            this.itemCallback[arguments[1].clip.name] = null;
          }
        }
      };
      Object.defineProperty(MainUI.prototype, "LevelLabel", {
        get: function() {
          this.levelLabel || (this.levelLabel = this.bgBlock.getChildByName("SceneDec").getComponent(cc.Label));
          return this.levelLabel;
        },
        enumerable: true,
        configurable: true
      });
      MainUI.prototype.enableBlock = function(enable) {
        this.bgBlock.active || (this.bgBlock.active = true);
        if (enable) {
          this.bgBlock.getComponent(cc.BlockInputEvents).enabled = true;
          this.bgBlock.opacity = 255;
          this.bgBlock.getChildByName("SceneDec").active = true;
          this.LevelLabel.string = "Level: " + Game_1.Game.level.toString();
        } else {
          this.bgBlock.getComponent(cc.BlockInputEvents).enabled = false;
          this.bgBlock.opacity = 0;
          this.bgBlock.getChildByName("SceneDec").active = false;
        }
      };
      MainUI.prototype.onLoad = function() {
        this.Debug.active = true;
        this.initDebug();
        this.enableBlock(true);
        this.HpProgressBar.progress = 1;
        this.oldProgress = 1;
        this.ScoreLabel.string = "0";
        this.initAdaptionSize();
        this.initEvent();
        this.Wainning.active = false;
        cc.director.once(cc.Director.EVENT_AFTER_UPDATE, Game_1.Game.start, Game_1.Game);
      };
      MainUI.prototype.initDebug = function() {
        this.Debug.active = true;
        this.Debug.getChildByName("DebugButton").on(cc.Node.EventType.TOUCH_END, function() {
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.OPEN_DEBUG);
        }, this);
      };
      MainUI.prototype.startLoadScene = function() {
        this.enableBlock(true);
        this.sceneID = 0;
        this.updateTabLabel("");
        console.log("\u5f00\u59cb\u52a0\u8f7d\u573a\u666f");
        this.updateBallList();
      };
      MainUI.prototype.updateCurBall = function(ballID) {
        this.curBallID = ballID;
        ballID ? this.updateTabLabel("/" + Game_1.Game.getBallNumber(ballID)) : this.updateTabLabel("");
      };
      MainUI.prototype.updateTabLabel = function(content) {
        this.BallNumber.string = content;
      };
      MainUI.prototype.updateScore = function(score) {
        console.log(" score: " + score);
        this.score = score;
        this.ScoreLabel.string = score.toString();
      };
      MainUI.prototype.updateBallList = function() {
        var levelData = TableMgr_1.TableMgr.inst.getMonster_ball_paly_level(Game_1.Game.level);
        for (var _i = 0, _a = this.BallTabRoot.children; _i < _a.length; _i++) {
          var ballTab = _a[_i];
          ballTab.getComponent(BallTab_1.default).offEvent();
        }
        var count = 0;
        for (var i = 0; i < levelData.ball.length; ++i) {
          var ballInfo = levelData.ball[i];
          if (!ballInfo) continue;
          var ballItem = this.BallTabRoot.getChildByName("Item" + (i + 1));
          if (!ballItem) continue;
          ballItem.getComponent(BallTab_1.default).updateBallInfo(parseInt(ballInfo.split("|")[0]), function() {
            ++count >= levelData.ball.length && this.next(Init_Step.BALL_TAB);
          }.bind(this));
        }
      };
      MainUI.prototype.onTouched = function(touch) {
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.JUMP, Game_1.Game.curBall ? Game_1.Game.curBall.BallID : 0, touch.getLocationX() > cc.winSize.width / 2 ? Config_1.JUMP_DIR.RIGHT : Config_1.JUMP_DIR.LEFT);
      };
      MainUI.prototype.updateProgress = function(percent, total) {
        this.HpProgressBar.progress = percent;
        this.HpProgressBar.progress = Math.max(this.HpProgressBar.progress, 0);
        if (this.oldProgress > this.HpProgressBar.progress) {
          this.greenHpBar.width -= (this.oldProgress - this.HpProgressBar.progress) * this.HpProgressBar.totalLength;
          this.greenHpBar.width < 0 && (this.greenHpBar.width = 0);
          var state = this.HpProgressBar.getComponent(cc.Animation).getAnimationState("hp_add");
          state.isPlaying || this.HpProgressBar.getComponent(cc.Animation).play("hp_add");
        }
        this.oldProgress = this.HpProgressBar.progress;
        total < 0 && (total = 0);
        null != total && (this.greenHpBar.width = this.HpProgressBar.totalLength * total);
      };
      MainUI.prototype.start = function() {};
      MainUI.prototype.update = function(dt) {};
      __decorate([ property(cc.ProgressBar) ], MainUI.prototype, "HpProgressBar", void 0);
      __decorate([ property(cc.Node) ], MainUI.prototype, "greenHpBar", void 0);
      __decorate([ property(cc.Label) ], MainUI.prototype, "ScoreLabel", void 0);
      __decorate([ property(cc.Node) ], MainUI.prototype, "bgBlock", void 0);
      __decorate([ property(cc.Node) ], MainUI.prototype, "Debug", void 0);
      __decorate([ property(cc.Node) ], MainUI.prototype, "BallTabRoot", void 0);
      __decorate([ property(cc.Label) ], MainUI.prototype, "BallNumber", void 0);
      __decorate([ property(cc.Node) ], MainUI.prototype, "Top", void 0);
      __decorate([ property(cc.Node) ], MainUI.prototype, "Bottom", void 0);
      __decorate([ property(cc.Node) ], MainUI.prototype, "Left", void 0);
      __decorate([ property(cc.Node) ], MainUI.prototype, "Right", void 0);
      __decorate([ property(cc.Node) ], MainUI.prototype, "Wainning", void 0);
      MainUI = __decorate([ ccclass ], MainUI);
      return MainUI;
    }(cc.Component);
    exports.default = MainUI;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Game/Game": "Game",
    "../TableMgr": "TableMgr",
    "../table": "table",
    "./BallTab": "BallTab"
  } ],
  MonsterCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6346cfqv9ZIhaO00OrsI747", "MonsterCtrl");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Monster_1 = require("../Game/Monster");
    var table_1 = require("../table");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var Game_1 = require("../Game/Game");
    var MonsterSpine_1 = require("./MonsterSpine");
    var TeleportMovement_1 = require("./TeleportMovement");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MoveType;
    (function(MoveType) {
      MoveType[MoveType["FlyMove"] = 0] = "FlyMove";
      MoveType[MoveType["GroundMove"] = 1] = "GroundMove";
      MoveType[MoveType["Static"] = 2] = "Static";
      MoveType[MoveType["Teleport"] = 3] = "Teleport";
    })(MoveType = exports.MoveType || (exports.MoveType = {}));
    var MonsterCtrl = function(_super) {
      __extends(MonsterCtrl, _super);
      function MonsterCtrl() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.weaknessRoot = null;
        _this.ani = null;
        _this.spine = null;
        _this.monster = null;
        _this.initAni = "";
        _this.moveAni = "";
        return _this;
      }
      MonsterCtrl.prototype.reuse = function() {
        this.updateMonsterInfo(arguments[0][0], arguments[0][1]);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_DIE, this.die, this);
        this.weaknessRoot.active = true;
      };
      MonsterCtrl.prototype.unuse = function() {
        this.monster = null;
        this.id = null;
        EventManager_1.gEventMgr.off(EventName_1.GlobalEvent.MONSTER_DIE, this.die, this);
        this.animation.targetOff(this);
      };
      MonsterCtrl.prototype.die = function(monsterID) {
        if (this.id != monsterID) return;
        this.monster = null;
        this.weaknessRoot.active = false;
      };
      Object.defineProperty(MonsterCtrl.prototype, "animation", {
        get: function() {
          this.ani || (this.ani = this.node.getComponent(cc.Animation));
          return this.ani;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(MonsterCtrl.prototype, "Spine", {
        get: function() {
          return this.spine ? this.spine : this.spine = this.getComponent(MonsterSpine_1.default);
        },
        enumerable: true,
        configurable: true
      });
      MonsterCtrl.prototype.move = function() {
        this.monster.realMoveType == MoveType.Teleport && (this.weaknessRoot.active = false);
      };
      MonsterCtrl.prototype.idle = function() {
        this.monster.realMoveType == MoveType.Teleport && (this.weaknessRoot.active = true);
      };
      MonsterCtrl.prototype.update = function(dt) {
        Math.abs(this.node.scaleX) < 1 && (this.node.scaleX = this.node.scaleX > 0 ? 1 : -1);
        if (!this.monster) {
          this.animation.stop();
          this.Spine.idle();
          return;
        }
        if (this.monster.realMoveType == MoveType.Teleport || this.monster.realMoveType == MoveType.GroundMove || this.monster.realMoveType == MoveType.Static) return;
        if (this.monster.CanMove) {
          this.animation.resume();
          this.Spine.move();
        } else {
          this.animation.pause();
          this.Spine.idle();
        }
      };
      MonsterCtrl.prototype.updateMonsterInfo = function(id, monster) {
        this.monster = monster;
        this.enabled = this.monster.Type != table_1.Monster_ball__monster_monster.BOSS;
        this.id = id;
        this.moveAni = "move-" + Game_1.Game.sceneID + "-" + this.monster.initPos;
        this.initAni = "init-" + Game_1.Game.sceneID + "-" + this.monster.initPos;
        switch (this.monster.Stage) {
         case Monster_1.MonsterStage.STAGE_0:
          this.checkMoveType_0();
          break;

         case Monster_1.MonsterStage.STAGE_1:
          this.checkMoveType_1();
          break;

         case Monster_1.MonsterStage.STAGE_2:
          this.checkMoveType_2();
        }
        this.initPos();
        for (var _i = 0, _a = this.weaknessRoot.children; _i < _a.length; _i++) {
          var weakness = _a[_i];
          weakness.name = this.id;
        }
      };
      MonsterCtrl.prototype.initPos = function() {
        var pos = cc.v2(0, 0);
        var clips = this.animation.getClips();
        for (var _i = 0, clips_1 = clips; _i < clips_1.length; _i++) {
          var clip = clips_1[_i];
          if (clip && clip.name == this.initAni && clip["curveData"]["props"] && clip["curveData"]["props"]["position"]) {
            pos.x = clip["curveData"]["props"]["position"][0]["value"][0];
            pos.y = clip["curveData"]["props"]["position"][0]["value"][1];
            break;
          }
        }
        switch (this.monster.realMoveType) {
         case MoveType.FlyMove:
          this.flyMoveInit(pos);
          break;

         case MoveType.GroundMove:
          this.node.setPosition(pos);
          this.play(this.initAni);
          break;

         case MoveType.Static:
          this.node.setPosition(pos);
          this.play(this.initAni);
          this.Spine.idle();
          break;

         case MoveType.Teleport:
          this.getComponent(TeleportMovement_1.default).addPoint(pos);
        }
      };
      MonsterCtrl.prototype.flyMoveInit = function(initPoint) {
        this.node.setPosition(initPoint);
        this.play(this.initAni);
        this.animation.on(cc.Animation.EventType.FINISHED, this.animationFinished, this);
      };
      MonsterCtrl.prototype.play = function(clipName, startTime, wrapMode, speed) {
        void 0 === startTime && (startTime = 0);
        void 0 === wrapMode && (wrapMode = cc.WrapMode.Normal);
        void 0 === speed && (speed = 0);
        console.log("play:" + clipName);
        var state = this.animation.getAnimationState(clipName);
        var self = this;
        if (null === state) cc.loader.loadRes("Animation/Monster/" + this.monster.MonsterID + "/" + Game_1.Game.sceneID + "/" + clipName, cc.AnimationClip, function(err, clip) {
          if (err) console.error(err); else {
            self.animation.addClip(clip);
            var state_1 = self.animation.play(clip.name, startTime);
            state_1.wrapMode = wrapMode;
            state_1.speed = speed > 0 ? speed : state_1.speed;
          }
        }); else {
          var state_2 = this.animation.play(clipName, startTime);
          state_2.wrapMode = wrapMode;
          state_2.speed = speed > 0 ? speed : state_2.speed;
        }
      };
      MonsterCtrl.prototype.animationFinished = function() {
        console.log(" -------------- animation finished ----------------");
        this.play(this.moveAni, 0, cc.WrapMode.Loop, this.monster.MoveSpeed);
      };
      MonsterCtrl.prototype.checkMoveType_0 = function() {
        switch (this.monster.MoveType) {
         case table_1.Monster_ball__monster_type_1.FeiHangPingYi:
          this.monster.realMoveType = MoveType.FlyMove;
          break;

         case table_1.Monster_ball__monster_type_1.GuDingWeiZhiBuDong:
          this.monster.realMoveType = MoveType.Static;
          break;

         case table_1.Monster_ball__monster_type_1.LuDiPingYi:
          this.monster.realMoveType = MoveType.GroundMove;
          break;

         case table_1.Monster_ball__monster_type_1.QuanTuShunYi:
          this.monster.realMoveType = MoveType.Teleport;
        }
      };
      MonsterCtrl.prototype.checkMoveType_1 = function() {
        switch (this.monster.MoveType) {
         case table_1.Monster_ball__monster_type_2.FeiHangPingYi:
          this.monster.realMoveType = MoveType.FlyMove;
          break;

         case table_1.Monster_ball__monster_type_2.GuDingWeiZhiBuDong:
          this.monster.realMoveType = MoveType.Static;
          break;

         case table_1.Monster_ball__monster_type_2.LuDiPingYi:
          this.monster.realMoveType = MoveType.GroundMove;
          break;

         case table_1.Monster_ball__monster_type_2.QuanTuShunYi:
          this.monster.realMoveType = MoveType.Teleport;
        }
      };
      MonsterCtrl.prototype.checkMoveType_2 = function() {
        switch (this.monster.MoveType) {
         case table_1.Monster_ball__monster_type_3.FeiHangPingYi:
          this.monster.realMoveType = MoveType.FlyMove;
          break;

         case table_1.Monster_ball__monster_type_3.GuDingWeiZhiBuDong:
          this.monster.realMoveType = MoveType.Static;
          break;

         case table_1.Monster_ball__monster_type_3.LuDiPingYi:
          this.monster.realMoveType = MoveType.GroundMove;
          break;

         case table_1.Monster_ball__monster_type_3.QuanTuShunYi:
          this.monster.realMoveType = MoveType.Teleport;
        }
      };
      __decorate([ property(cc.Node) ], MonsterCtrl.prototype, "weaknessRoot", void 0);
      MonsterCtrl = __decorate([ ccclass ], MonsterCtrl);
      return MonsterCtrl;
    }(cc.Component);
    exports.default = MonsterCtrl;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Game/Game": "Game",
    "../Game/Monster": "Monster",
    "../table": "table",
    "./MonsterSpine": "MonsterSpine",
    "./TeleportMovement": "TeleportMovement"
  } ],
  MonsterSpine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "91cc7aGeypK+J4TzKgkQw9C", "MonsterSpine");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Monster_1 = require("../Game/Monster");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var Game_1 = require("../Game/Game");
    var BuffManager_1 = require("../Game/BuffManager");
    var GameFactory_1 = require("../Factory/GameFactory");
    var MonsterCtrl_1 = require("./MonsterCtrl");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MonsterSpine = function(_super) {
      __extends(MonsterSpine, _super);
      function MonsterSpine() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.monster = null;
        _this.stage = 0;
        _this.motions = [];
        return _this;
      }
      MonsterSpine.prototype.reuse = function() {
        this.initEvent();
        this.updateMonsterInfo(arguments[0][0], arguments[0][1]);
      };
      MonsterSpine.prototype.unuse = function() {
        this.offEvent();
        this.motions = [];
        this.stage = 0;
        this.id = this.readID = null;
        this.monster = null;
      };
      MonsterSpine.prototype.initEvent = function() {
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_ATTACK, this.attack, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_HIT, this.hit, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_DIE, this.die, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_UPDATE_STAGE, this.updateStage, this);
        this.setCompleteListener(this.onComplete.bind(this));
      };
      MonsterSpine.prototype.offEvent = function() {
        EventManager_1.gEventMgr.targetOff(this);
        this.setCompleteListener(null);
      };
      MonsterSpine.prototype.setAnimation = function(trackIndex, name, loop) {
        _super.prototype.setAnimation.call(this, trackIndex, name, loop);
        this.motions.push({
          name: name,
          loop: loop
        });
        this.motions.length > 10 && this.motions.splice(0, this.motions.length - 10);
      };
      MonsterSpine.prototype.normal = function(skipMotions) {
        void 0 === skipMotions && (skipMotions = []);
        if (!this.monster) return;
        if (this.motions.length > 0) {
          var motion = void 0;
          while ((motion = this.motions.pop()) && skipMotions.indexOf(motion.name) >= 0) ;
          motion ? this.setAnimation(0, motion.name, motion.loop) : this.idle();
        } else this.idle();
      };
      MonsterSpine.prototype.idle = function() {
        if (!this.monster || "" == this.id || "idle" == this.animation) return;
        if (!this.monster.CanIdle) return;
        this.setAnimation(0, "idle", true);
      };
      MonsterSpine.prototype.move = function() {
        if (!this.monster || "" == this.id || "move" == this.animation) return;
        this.monster.realMoveType == MonsterCtrl_1.MoveType.Teleport && this.monster.setState(Monster_1.MonsterState.HIDE);
        this.setAnimation(0, "move", this.monster.realMoveType != MonsterCtrl_1.MoveType.Teleport);
      };
      MonsterSpine.prototype.attack = function(id) {
        if (this.id != id) return;
        this.monster.setState(Monster_1.MonsterState.ATTACKING);
        "move" == this.animation && this.motions.push({
          name: "move",
          loop: false
        });
        this.setAnimation(0, "attack", false);
      };
      MonsterSpine.prototype.die = function(monsterID) {
        if (this.id != monsterID) return;
        this.node.name = "die fuck monster";
        this.setAnimation(0, "die", false);
        this.id = "";
        this.monster = null;
      };
      MonsterSpine.prototype.hit = function(monsterID) {
        if (this.id != monsterID) return;
        this.onInterupt(this.animation);
        this.setAnimation(0, "hit", false);
      };
      MonsterSpine.prototype.onInterupt = function(animation) {
        switch (animation) {
         case "attack":
          this.monster && this.monster.delState(Monster_1.MonsterState.ATTACKING);
          break;

         case "die":
          GameFactory_1.gFactory.putMonster(this.readID, this.node);
          break;

         case "fly":
         case "idle":
          break;

         case "move":
          this.monster.realMoveType == MonsterCtrl_1.MoveType.Teleport && this.monster && this.monster.delState(Monster_1.MonsterState.HIDE);
          break;

         case "hit":
          this.monster && this.monster.delState(Monster_1.MonsterState.HIT);
        }
      };
      MonsterSpine.prototype.eventListener = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        console.log(args);
      };
      MonsterSpine.prototype.onComplete = function(TrackEntry) {
        var _this = this;
        switch (TrackEntry.animation.name) {
         case "attack":
          this.monster.delState(Monster_1.MonsterState.ATTACKING);
          Game_1.Game.addHp(-this.monster.Attack);
          this.idle();
          var buffOpt = {
            name: "\u50f5\u76f4",
            type: BuffManager_1.BuffType.STIFF,
            handler: function() {
              _this.monster.setState(Monster_1.MonsterState.STIFF);
            },
            completeHandler: function() {
              _this.monster && _this.monster.delState(Monster_1.MonsterState.STIFF);
            },
            isOnce: true,
            isImmediately: true,
            duration: 0,
            lastTime: 1e3 * this.monster.StiffTime,
            target: this,
            isCover: true
          };
          this.monster && this.monster.buff.addBuff(buffOpt);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.MONSTER_ATTACK_DONE, this.monster && this.monster.isBoss);
          break;

         case "die":
          GameFactory_1.gFactory.putMonster(this.readID, this.node);
          break;

         case "fly":
         case "idle":
          break;

         case "move":
          this.monster.realMoveType == MonsterCtrl_1.MoveType.Teleport && this.monster && this.monster.delState(Monster_1.MonsterState.HIDE);
          break;

         case "hit":
          this.monster && this.monster.delState(Monster_1.MonsterState.HIT);
        }
      };
      MonsterSpine.prototype.updateMonsterInfo = function(id, monster) {
        this.id = id;
        this.readID = monster.MonsterID.toString();
        this.monster = monster;
        this.stage = this.monster.Stage;
      };
      MonsterSpine.prototype.updateStage = function() {
        if (!this.monster) return;
        this.stage = this.monster.Stage;
      };
      MonsterSpine.prototype.start = function() {
        this.idle();
      };
      MonsterSpine.prototype.update = function(dt) {
        if (!this.monster && "die fuck monster" != this.node.name) return;
        if (this.monster && this.monster.State & Monster_1.MonsterState.NUMB) return;
        var action = this.node.getActionByTag(Monster_1.MonsterState.INVINCIBLE);
        if (this.monster && this.monster.State & Monster_1.MonsterState.INVINCIBLE) if (action && !action.isDone()) ; else {
          action && this.node.stopAction(action);
          action = cc.repeatForever(cc.sequence(cc.fadeOut(.2), cc.fadeIn(.5)));
          action.setTag(Monster_1.MonsterState.INVINCIBLE);
          this.node.runAction(action);
        } else {
          action && this.node.stopAction(action);
          this.node.opacity = 255;
        }
        _super.prototype.update.call(this, dt);
      };
      MonsterSpine.prototype.onDestroy = function() {
        console.log(" Monster Spine Destroy!!!!!!!");
      };
      MonsterSpine = __decorate([ ccclass ], MonsterSpine);
      return MonsterSpine;
    }(sp.Skeleton);
    exports.default = MonsterSpine;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Factory/GameFactory": "GameFactory",
    "../Game/BuffManager": "BuffManager",
    "../Game/Game": "Game",
    "../Game/Monster": "Monster",
    "./MonsterCtrl": "MonsterCtrl"
  } ],
  Monster: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "65415PJrYdEEpruhESUj1Op", "Monster");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var table_1 = require("../table");
    var TableMgr_1 = require("../TableMgr");
    var EventName_1 = require("../Event/EventName");
    var BuffManager_1 = require("./BuffManager");
    var EventManager_1 = require("../Event/EventManager");
    var MonsterState;
    (function(MonsterState) {
      MonsterState[MonsterState["NORMAL"] = 2] = "NORMAL";
      MonsterState[MonsterState["STIFF"] = 4] = "STIFF";
      MonsterState[MonsterState["HIT"] = 8] = "HIT";
      MonsterState[MonsterState["DIE"] = 16] = "DIE";
      MonsterState[MonsterState["NUMB"] = 32] = "NUMB";
      MonsterState[MonsterState["INVINCIBLE"] = 64] = "INVINCIBLE";
      MonsterState[MonsterState["HIDE"] = 128] = "HIDE";
      MonsterState[MonsterState["ATTACKING"] = 256] = "ATTACKING";
      MonsterState[MonsterState["RELAX"] = 512] = "RELAX";
    })(MonsterState = exports.MonsterState || (exports.MonsterState = {}));
    var MoveLimit = MonsterState.DIE | MonsterState.HIT | MonsterState.NUMB | MonsterState.STIFF | MonsterState.ATTACKING | MonsterState.RELAX;
    var AttackLimit = MonsterState.DIE | MonsterState.HIT | MonsterState.NUMB | MonsterState.STIFF | MonsterState.HIDE | MonsterState.ATTACKING;
    var IdleLimit = MonsterState.DIE | MonsterState.HIT | MonsterState.NUMB | MonsterState.HIDE | MonsterState.ATTACKING;
    var MonsterStage;
    (function(MonsterStage) {
      MonsterStage[MonsterStage["STAGE_0"] = 1] = "STAGE_0";
      MonsterStage[MonsterStage["STAGE_1"] = 2] = "STAGE_1";
      MonsterStage[MonsterStage["STAGE_2"] = 3] = "STAGE_2";
    })(MonsterStage = exports.MonsterStage || (exports.MonsterStage = {}));
    var Birth_Point;
    (function(Birth_Point) {
      Birth_Point[Birth_Point["P_1"] = 1] = "P_1";
      Birth_Point[Birth_Point["P_2"] = 2] = "P_2";
      Birth_Point[Birth_Point["P_3"] = 3] = "P_3";
    })(Birth_Point = exports.Birth_Point || (exports.Birth_Point = {}));
    var Monster = function() {
      function Monster(monsterID) {
        this.state = MonsterState.NORMAL;
        this.isBoss = false;
        this.monsterID = monsterID;
        this.stage = MonsterStage.STAGE_0;
        this.monsterStaticData = TableMgr_1.TableMgr.inst.getMonster_ball__monster(this.monsterID);
        this.type = this.monsterStaticData.monster;
        this.updatePro();
        this.buff = new BuffManager_1.BuffManager(this.monsterID);
      }
      Monster.prototype.updatePro = function() {
        this.attackTime = 0;
        this.resetState();
        this.curHp = this.monsterStaticData["hp_" + this.stage];
        this.totalHp = this.curHp;
        this.attackSpeed = this.monsterStaticData["hz_" + this.stage];
        this.moveSpeed = this.monsterStaticData["speed_" + this.stage];
        this.moveType = this.monsterStaticData["type_" + this.stage];
        this.attack = this.monsterStaticData["attack_" + this.stage];
        this.stiffTime = this.monsterStaticData.interval;
        this.isBoss = this.monsterStaticData.monster == table_1.Monster_ball__monster_monster.BOSS;
      };
      Monster.prototype.resetState = function() {
        this.state = MonsterState.NORMAL;
      };
      Object.defineProperty(Monster.prototype, "State", {
        get: function() {
          return this.state;
        },
        enumerable: true,
        configurable: true
      });
      Monster.prototype.setState = function(state) {
        if (this.state & state) return;
        this.state |= state;
      };
      Monster.prototype.delState = function(state) {
        if (!(this.state & state)) {
          console.warn(" \u6ca1\u6709\u8be5\u72b6\u6001:" + MonsterState[state]);
          return;
        }
        this.state &= 65535 ^ state;
      };
      Object.defineProperty(Monster.prototype, "StiffTime", {
        get: function() {
          return this.stiffTime;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "MonsterID", {
        get: function() {
          return this.monsterID;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "Attack", {
        get: function() {
          return this.attack;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "Type", {
        get: function() {
          return this.type;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "MoveType", {
        get: function() {
          return this.moveType;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "MoveSpeed", {
        get: function() {
          return this.moveSpeed;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "Score", {
        get: function() {
          return this.monsterStaticData.score;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "Stage", {
        get: function() {
          return this.stage;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "Invincible", {
        get: function() {
          return this.state & MonsterState.INVINCIBLE;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "CanMove", {
        get: function() {
          return !(this.state & MoveLimit);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "CanAttack", {
        get: function() {
          return !(this.state & AttackLimit);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "CanIdle", {
        get: function() {
          return !(this.state & IdleLimit);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Monster.prototype, "Name", {
        get: function() {
          return this.monsterStaticData.name;
        },
        enumerable: true,
        configurable: true
      });
      Monster.prototype.addHp = function(hp) {
        this.curHp += hp;
        console.log("\u602a\u517d:" + this.MonsterID + "\u88ab\u653b\u51fb:" + hp + ",curHp:" + this.curHp);
        if (this.curHp <= 0) {
          if (this.checkStage()) {
            this.stage++;
            this.updatePro();
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.MONSTER_UPDATE_STAGE);
            return true;
          }
          return false;
        }
        return true;
      };
      Monster.prototype.checkStage = function() {
        var nextStage = this.stage + 1;
        return this.monsterStaticData["hp_" + nextStage] && this.monsterStaticData["attack_" + nextStage] && this.monsterStaticData["hz_" + nextStage] && this.monsterStaticData["type_" + nextStage] && this.monsterStaticData["speed_" + nextStage];
      };
      Monster.prototype.checkCanAttack = function(dt) {
        if (!this.CanAttack) return false;
        this.attackTime += dt;
        if (this.attackTime >= this.attackSpeed) {
          this.attackTime = 0;
          return true;
        }
        return false;
      };
      Monster.prototype.update = function(dt, id) {
        this.checkCanAttack(dt) && EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.MONSTER_ATTACK, id);
        this.buff.update(dt);
      };
      return Monster;
    }();
    exports.Monster = Monster;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../TableMgr": "TableMgr",
    "../table": "table",
    "./BuffManager": "BuffManager"
  } ],
  OverLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ccbfcmg50JNpaiViKnXy98B", "OverLayer");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TableMgr_1 = require("../TableMgr");
    var Game_1 = require("../Game/Game");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var OverLayer = function(_super) {
      __extends(OverLayer, _super);
      function OverLayer() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.Level = null;
        _this.Quit = null;
        _this.Score = null;
        _this.LevelCross = null;
        return _this;
      }
      OverLayer.prototype.onLoad = function() {
        this.Quit.target.on(cc.Node.EventType.TOUCH_END, function() {
          true;
          cc.game.restart();
        }, this);
        var scoreData = TableMgr_1.TableMgr.inst.getAll_Monster_ball_evaluate_Data();
        var totalScore = Game_1.Game.totalScore;
        var scoreId = "1";
        for (var ID in scoreData) {
          var data = scoreData[ID];
          if (totalScore < data.min) break;
          scoreId = ID;
        }
        var self = this;
        this.Level.enabled = false;
        cc.loader.loadRes("Texture/OverLayer/bg_battleover_" + scoreData[scoreId].evaluate, cc.SpriteFrame, function(err, spriteFrame) {
          if (err) {
            console.error(err);
            self.Level.node.active = false;
          } else {
            self.Level.enabled = true;
            self.Level.spriteFrame = spriteFrame;
          }
        });
        this.Score.string = totalScore.toString();
        this.LevelCross.string = Game_1.Game.level.toString();
      };
      OverLayer.prototype.start = function() {};
      __decorate([ property(cc.Sprite) ], OverLayer.prototype, "Level", void 0);
      __decorate([ property(cc.Button) ], OverLayer.prototype, "Quit", void 0);
      __decorate([ property(cc.Label) ], OverLayer.prototype, "Score", void 0);
      __decorate([ property(cc.Label) ], OverLayer.prototype, "LevelCross", void 0);
      OverLayer = __decorate([ ccclass ], OverLayer);
      return OverLayer;
    }(cc.Component);
    exports.default = OverLayer;
    cc._RF.pop();
  }, {
    "../Game/Game": "Game",
    "../TableMgr": "TableMgr"
  } ],
  OverScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "53e47P/BpVLeoOB8uulsdo3", "OverScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseScene_1 = require("./BaseScene");
    var ShaderManager_1 = require("../Shader/ShaderManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var OverScene = function(_super) {
      __extends(OverScene, _super);
      function OverScene() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        return _this;
      }
      OverScene.prototype.onLoad = function() {
        ShaderManager_1.ShaderManager.inst;
      };
      OverScene.prototype.start = function() {};
      OverScene.prototype.setLabel = function(info) {
        this.label.string = info;
      };
      __decorate([ property(cc.Label) ], OverScene.prototype, "label", void 0);
      OverScene = __decorate([ ccclass ], OverScene);
      return OverScene;
    }(BaseScene_1.default);
    exports.default = OverScene;
    cc._RF.pop();
  }, {
    "../Shader/ShaderManager": "ShaderManager",
    "./BaseScene": "BaseScene"
  } ],
  PixelSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c64fcoDOyNPZbGi3+VHD13I", "PixelSprite");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PixelSprite = function(_super) {
      __extends(PixelSprite, _super);
      function PixelSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.material = new ShaderManager_1.PixelStyleMaterial();
        _this.spineMaterial = new ShaderManager_1.PixelSpineMaterial();
        _this.oldMaterial = null;
        _this.oldSpineMaterial = null;
        _this.sampleCount = 800;
        return _this;
      }
      PixelSprite.prototype.onLoad = function() {
        var _this = this;
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PXIEL_ENABLE, function() {
          PXIEL ? _this.init() : _this.reset();
        }, this);
        PXIEL ? this.init() : this.reset();
      };
      PixelSprite.prototype.init = function() {
        if (!PXIEL) return;
        var sprite = this.getComponent(cc.Sprite);
        var spine = this.getComponent(sp.Skeleton);
        var label = this.getComponent(cc.Label);
        this.material.setDefine("disableColor", true);
        this.spineMaterial.setDefine("disableColor", true);
        this.material.setProperty("sampleCount", this.sampleCount);
        this.spineMaterial.setProperty("sampleCount", this.sampleCount);
        if (sprite) {
          this.oldMaterial = sprite["_spriteMaterial"];
          sprite["_spriteMaterial"] = this.material;
          sprite["_activateMaterial"]();
        }
        if (label) {
          this.oldMaterial = label["_material"];
          label["_frame"] && label["_frame"]["_texture"] && (this.material.texture = label["_frame"]["_texture"]);
          label["_material"] = this.material;
          label["_activateMaterial"]();
        }
        if (spine) {
          this.oldSpineMaterial = spine["_material"];
          spine["_updateMaterial"](this.spineMaterial);
        }
      };
      PixelSprite.prototype.reset = function() {
        var sprite = this.getComponent(cc.Sprite);
        var spine = this.getComponent(sp.Skeleton);
        var label = this.getComponent(cc.Label);
        if (sprite && this.oldMaterial) {
          sprite["_spriteMaterial"] = this.oldMaterial;
          sprite["_activateMaterial"]();
        }
        if (label && this.oldMaterial) {
          label["_material"] = this.oldMaterial;
          label["_activateMaterial"]();
        }
        spine && this.oldSpineMaterial && spine["_updateMaterial"](this.oldSpineMaterial);
      };
      __decorate([ property(cc.Integer) ], PixelSprite.prototype, "sampleCount", void 0);
      PixelSprite = __decorate([ ccclass ], PixelSprite);
      return PixelSprite;
    }(cc.Component);
    exports.default = PixelSprite;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "./ShaderManager": "ShaderManager"
  } ],
  PointWave: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2c428jDL5pI957sgmd8a2px", "PointWave");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PointWaveSprite = function(_super) {
      __extends(PointWaveSprite, _super);
      function PointWaveSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.material = new ShaderManager_1.PointWaveMaterial();
        _this.time = 0;
        _this.waveRange = .01;
        return _this;
      }
      PointWaveSprite.prototype.onLoad = function() {
        var _this = this;
        console.log(this.node);
        var sprite = this.getComponent(cc.Sprite);
        if (!sprite) return;
        sprite["_spriteMaterial"] = this.material;
        sprite["_activateMaterial"]();
        this.material.setProperty("range", .01);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
          var location = _this.node.convertToNodeSpace(event.getLocation());
          location.x /= _this.node.getContentSize().width;
          location.y /= _this.node.getContentSize().height;
          location.y = 1 - location.y;
          _this.time = 0;
          _this.waveRange = .01;
          _this.material.setProperty("time", _this.time);
          _this.material.setProperty("range", _this.waveRange);
          _this.material.setProperty("point", location);
        }, this);
      };
      PointWaveSprite.prototype.start = function() {};
      PointWaveSprite.prototype.update = function(dt) {
        this.material.setProperty("range", this.waveRange);
        this.material.setProperty("time", this.time);
        this.material.setProperty("deltaTime", dt);
        this.time += dt / 2;
        this.waveRange > .1 && (this.waveRange = .1);
      };
      PointWaveSprite = __decorate([ ccclass ], PointWaveSprite);
      return PointWaveSprite;
    }(cc.Component);
    exports.default = PointWaveSprite;
    cc._RF.pop();
  }, {
    "./ShaderManager": "ShaderManager"
  } ],
  ShaderManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c4d6fndbe5Ef5yjK0EAjTVc", "ShaderManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderTemplate_1 = require("./ShaderTemplate");
    var renderEngine = cc.renderer.renderEngine;
    var Material = renderEngine.Material;
    var renderer = renderEngine.renderer;
    var gfx = renderEngine.gfx;
    var ShaderManager = function() {
      function ShaderManager() {
        var programLib = cc.renderer["_forward"]["_programLib"];
        if (!programLib) {
          console.error("programLib not exist!");
          return;
        }
        for (var _i = 0, templates_1 = ShaderTemplate_1.templates; _i < templates_1.length; _i++) {
          var template = templates_1[_i];
          programLib._templates[template.name] || programLib.define(template.name, template.vert, template.frag, template.defines);
        }
      }
      Object.defineProperty(ShaderManager, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new ShaderManager();
        },
        enumerable: true,
        configurable: true
      });
      return ShaderManager;
    }();
    exports.ShaderManager = ShaderManager;
    false;
    var TransitionMaterial = function(_super) {
      __extends(TransitionMaterial, _super);
      function TransitionMaterial() {
        var _this = _super.call(this) || this;
        _this.time = 0;
        _this.range = .1;
        var pass = new renderer.Pass("transition_sprite");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "color",
          type: renderer.PARAM_COLOR4
        }, {
          name: "time",
          type: renderer.PARAM_FLOAT
        }, {
          name: "range",
          type: renderer.PARAM_FLOAT
        } ], [ pass ]);
        _this["_color"] = {
          r: 1,
          g: 1,
          b: 1,
          a: 1
        };
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          color: _this._color,
          time: _this.time,
          range: _this.range
        }, [ {
          name: "useTexture",
          value: true
        }, {
          name: "useModel",
          value: false
        }, {
          name: "useColor",
          value: true
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(TransitionMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(TransitionMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(TransitionMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(TransitionMaterial.prototype, "useTexture", {
        get: function() {
          return this._effect.getDefine("useTexture");
        },
        set: function(val) {
          this._effect.define("useTexture", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(TransitionMaterial.prototype, "useColor", {
        get: function() {
          return this._effect.getDefine("useColor");
        },
        set: function(val) {
          this._effect.define("useColor", val);
        },
        enumerable: true,
        configurable: true
      });
      TransitionMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      TransitionMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.useColor = this.useColor;
        copy.updateHash();
        return copy;
      };
      return TransitionMaterial;
    }(Material);
    exports.TransitionMaterial = TransitionMaterial;
    var WaveMaterial = function(_super) {
      __extends(WaveMaterial, _super);
      function WaveMaterial() {
        var _this = _super.call(this) || this;
        _this.time = 0;
        _this.range = 2;
        _this.deltaTime = 0;
        var pass = new renderer.Pass("wave_sprite");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "color",
          type: renderer.PARAM_COLOR4
        }, {
          name: "time",
          type: renderer.PARAM_FLOAT
        }, {
          name: "deltaTime",
          type: renderer.PARAM_FLOAT
        }, {
          name: "range",
          type: renderer.PARAM_FLOAT
        } ], [ pass ]);
        _this["_color"] = {
          r: 1,
          g: 1,
          b: 1,
          a: 1
        };
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          color: _this._color,
          time: _this.time,
          range: _this.range,
          deltaTime: _this.deltaTime
        }, [ {
          name: "useTexture",
          value: true
        }, {
          name: "useModel",
          value: false
        }, {
          name: "useColor",
          value: true
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(WaveMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WaveMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WaveMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WaveMaterial.prototype, "useTexture", {
        get: function() {
          return this._effect.getDefine("useTexture");
        },
        set: function(val) {
          this._effect.define("useTexture", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WaveMaterial.prototype, "useColor", {
        get: function() {
          return this._effect.getDefine("useColor");
        },
        set: function(val) {
          this._effect.define("useColor", val);
        },
        enumerable: true,
        configurable: true
      });
      WaveMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      WaveMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.useColor = this.useColor;
        copy.updateHash();
        return copy;
      };
      return WaveMaterial;
    }(Material);
    exports.WaveMaterial = WaveMaterial;
    var ButterflySpringMaterial = function(_super) {
      __extends(ButterflySpringMaterial, _super);
      function ButterflySpringMaterial() {
        var _this = _super.call(this) || this;
        var pass = new renderer.Pass("butterfly_spring");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "color",
          type: renderer.PARAM_COLOR4
        } ], [ pass ]);
        _this["_color"] = {
          r: 1,
          g: 1,
          b: 1,
          a: 1
        };
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          color: _this._color
        }, [ {
          name: "useTexture",
          value: true
        }, {
          name: "useModel",
          value: false
        }, {
          name: "useColor",
          value: true
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(ButterflySpringMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ButterflySpringMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ButterflySpringMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ButterflySpringMaterial.prototype, "useTexture", {
        get: function() {
          return this._effect.getDefine("useTexture");
        },
        set: function(val) {
          this._effect.define("useTexture", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ButterflySpringMaterial.prototype, "useColor", {
        get: function() {
          return this._effect.getDefine("useColor");
        },
        set: function(val) {
          this._effect.define("useColor", val);
        },
        enumerable: true,
        configurable: true
      });
      ButterflySpringMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      ButterflySpringMaterial.prototype.setDefine = function(key, val) {
        this._effect.define(key, val);
      };
      ButterflySpringMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.useColor = this.useColor;
        copy.updateHash();
        return copy;
      };
      return ButterflySpringMaterial;
    }(Material);
    exports.ButterflySpringMaterial = ButterflySpringMaterial;
    var PointWaveMaterial = function(_super) {
      __extends(PointWaveMaterial, _super);
      function PointWaveMaterial() {
        var _this = _super.call(this) || this;
        _this.time = 0;
        _this.range = 2;
        _this.deltaTime = 0;
        _this.point = cc.v2(0, 0);
        var pass = new renderer.Pass("point_wave");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "color",
          type: renderer.PARAM_COLOR4
        }, {
          name: "point",
          type: renderer.PARAM_FLOAT2
        }, {
          name: "time",
          type: renderer.PARAM_FLOAT
        }, {
          name: "deltaTime",
          type: renderer.PARAM_FLOAT
        }, {
          name: "range",
          type: renderer.PARAM_FLOAT
        } ], [ pass ]);
        _this["_color"] = {
          r: 1,
          g: 1,
          b: 1,
          a: 1
        };
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          color: _this._color,
          time: _this.time,
          range: _this.range,
          deltaTime: _this.deltaTime,
          point: _this.point
        }, [ {
          name: "useTexture",
          value: true
        }, {
          name: "useModel",
          value: false
        }, {
          name: "useColor",
          value: true
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(PointWaveMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PointWaveMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PointWaveMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PointWaveMaterial.prototype, "useTexture", {
        get: function() {
          return this._effect.getDefine("useTexture");
        },
        set: function(val) {
          this._effect.define("useTexture", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PointWaveMaterial.prototype, "useColor", {
        get: function() {
          return this._effect.getDefine("useColor");
        },
        set: function(val) {
          this._effect.define("useColor", val);
        },
        enumerable: true,
        configurable: true
      });
      PointWaveMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      PointWaveMaterial.prototype.setDefine = function(key, val) {
        this._effect.define(key, val);
      };
      PointWaveMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.useColor = this.useColor;
        copy.updateHash();
        return copy;
      };
      return PointWaveMaterial;
    }(Material);
    exports.PointWaveMaterial = PointWaveMaterial;
    var PixelStyleMaterial = function(_super) {
      __extends(PixelStyleMaterial, _super);
      function PixelStyleMaterial() {
        var _this = _super.call(this) || this;
        var pass = new renderer.Pass("pixel_style");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "color",
          type: renderer.PARAM_COLOR4
        }, {
          name: "sampleCount",
          type: renderer.PARAM_FLOAT
        } ], [ pass ]);
        _this["_color"] = {
          r: 1,
          g: 1,
          b: 1,
          a: 1
        };
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          color: _this._color,
          sampleCount: 100
        }, [ {
          name: "useTexture",
          value: true
        }, {
          name: "useModel",
          value: false
        }, {
          name: "disableColor",
          value: false
        }, {
          name: "useColor",
          value: true
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(PixelStyleMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelStyleMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelStyleMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelStyleMaterial.prototype, "useTexture", {
        get: function() {
          return this._effect.getDefine("useTexture");
        },
        set: function(val) {
          this._effect.define("useTexture", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelStyleMaterial.prototype, "useColor", {
        get: function() {
          return this._effect.getDefine("useColor");
        },
        set: function(val) {
          this._effect.define("useColor", val);
        },
        enumerable: true,
        configurable: true
      });
      PixelStyleMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      PixelStyleMaterial.prototype.setDefine = function(key, val) {
        this._effect.define(key, val);
      };
      PixelStyleMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.useColor = this.useColor;
        copy.updateHash();
        return copy;
      };
      return PixelStyleMaterial;
    }(Material);
    exports.PixelStyleMaterial = PixelStyleMaterial;
    var PixelSpineMaterial = function(_super) {
      __extends(PixelSpineMaterial, _super);
      function PixelSpineMaterial() {
        var _this = _super.call(this) || this;
        var pass = new renderer.Pass("spine_pxiel");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "sampleCount",
          type: renderer.PARAM_FLOAT
        } ], [ pass ]);
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          sampleCount: 100
        }, [ {
          name: "useModel",
          value: true
        }, {
          name: "disableColor",
          value: false
        }, {
          name: "alphaTest",
          value: false
        }, {
          name: "use2DPos",
          value: true
        }, {
          name: "useTint",
          value: false
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(PixelSpineMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelSpineMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelSpineMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelSpineMaterial.prototype, "use2DPos", {
        get: function() {
          return this._effect.getDefine("use2DPos");
        },
        set: function(val) {
          this._effect.define("use2DPos", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelSpineMaterial.prototype, "alphaTest", {
        get: function() {
          return this._effect.getDefine("alphaTest");
        },
        set: function(val) {
          this._effect.define("alphaTest", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelSpineMaterial.prototype, "useTint", {
        get: function() {
          return this._effect.getDefine("useTint");
        },
        set: function(val) {
          this._effect.define("useTint", val);
        },
        enumerable: true,
        configurable: true
      });
      PixelSpineMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      PixelSpineMaterial.prototype.setDefine = function(key, val) {
        this._effect.define(key, val);
      };
      PixelSpineMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.updateHash();
        return copy;
      };
      return PixelSpineMaterial;
    }(Material);
    exports.PixelSpineMaterial = PixelSpineMaterial;
    cc._RF.pop();
  }, {
    "./ShaderTemplate": "ShaderTemplate"
  } ],
  ShaderTemplate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "201c4JgGAhL0JiWCcaco4XQ", "ShaderTemplate");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.templates = [ {
      name: "transition_sprite",
      vert: "\n    uniform mat4 viewProj;\n    attribute vec3 a_position;\n    attribute lowp vec4 a_color;\n    varying mediump vec4 v_pos;\n    #ifdef useModel \n        uniform mat4 model;\n    #endif\n    #ifdef useTexture\n        attribute mediump vec2 a_uv0;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifndef useColor \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel\n             mvp = viewProj * model;\n        #else\n             mvp = viewProj;  \n        #endif  \n        vec4 pos = mvp * vec4(a_position, 1);\n        #ifndef useColor\n             v_fragmentColor = a_color;\n        #endif\n        #ifdef useTexture    \n             uv0 = a_uv0;  \n        #endif  \n        v_pos = pos;\n        gl_Position = pos;\n    }",
      frag: "\n    uniform float time;\n    uniform float range;\n    varying mediump vec4 v_pos;\n    #ifdef useTexture  \n        uniform sampler2D texture;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifdef useColor\n        uniform lowp vec4 color;\n    #else  \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {  \n        #ifdef useColor    \n             vec4 o = color;\n        #else\n             vec4 o = v_fragmentColor;  \n        #endif  \n        #ifdef useTexture    \n             o *= texture2D(texture, uv0); \n             if (uv0.x <= time) {\n                float factor = time - uv0.x;\n                if (factor > range) o.w *= 0.0;\n                else o.w *= (1.0-factor/range);\n                \n            } else {\n                o.w *=  1.0;\n            }\n        #else\n            float px = v_pos.x + 1.0;\n            if (px <= time*2.0) {\n                float factor = time*2.0 - px;\n                if (factor > range) o.w *= 0.0;\n                else o.w *= (1.0-factor/range);\n            } else {\n                o.w *=  1.0;\n            }\n        #endif  \n        \n        gl_FragColor = o;\n    }",
      defines: [ {
        name: "useModel"
      }, {
        name: "useTexture"
      }, {
        name: "useColor"
      } ]
    }, {
      name: "butterfly_spring",
      vert: "\n  \n    uniform mat4 viewProj;\n    attribute vec3 a_position;\n    attribute lowp vec4 a_color;\n    #ifdef useModel \n        uniform mat4 model;\n    #endif\n    #ifdef useTexture\n        attribute mediump vec2 a_uv0;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifndef useColor \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel\n             mvp = viewProj * model;\n        #else\n             mvp = viewProj;  \n        #endif  \n        vec4 pos = mvp * vec4(a_position, 1);\n        #ifndef useColor\n             v_fragmentColor = a_color;\n        #endif\n        #ifdef useTexture    \n             uv0 = a_uv0;  \n        #endif  \n    \n        gl_Position = pos;\n    }",
      frag: "\n    #ifdef useTexture  \n        uniform sampler2D texture;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifdef useColor\n        uniform lowp vec4 color;\n    #else  \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {  \n        #ifdef useColor    \n             vec4 o = color;\n        #else\n             vec4 o = v_fragmentColor;  \n        #endif  \n        #ifdef useTexture    \n             vec2 uv_temp = uv0;\n             float x = uv_temp.x;\n             float y = uv_temp.y;\n             float offset = uv0.x * 3.14 / 2.0;\n             o.r = offset;\n             o *= texture2D(texture, uv_temp); \n\n        #endif  \n        gl_FragColor = o;\n    }",
      defines: [ {
        name: "useModel"
      }, {
        name: "useTexture"
      }, {
        name: "useColor"
      } ]
    }, {
      name: "wave_sprite",
      vert: "\n    uniform float time;\n    uniform float deltaTime;\n    varying float v_time;\n    varying float v_deltaTime;\n    uniform mat4 viewProj;\n    attribute vec3 a_position;\n    attribute lowp vec4 a_color;\n    #ifdef useModel \n        uniform mat4 model;\n    #endif\n    #ifdef useTexture\n        attribute mediump vec2 a_uv0;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifndef useColor \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel\n             mvp = viewProj * model;\n        #else\n             mvp = viewProj;  \n        #endif  \n        vec4 pos = mvp * vec4(a_position, 1);\n        #ifndef useColor\n             v_fragmentColor = a_color;\n        #endif\n        #ifdef useTexture    \n             uv0 = a_uv0;  \n        #endif  \n        v_time = time;\n        v_deltaTime = deltaTime;\n        gl_Position = pos;\n    }",
      frag: "\n    varying float v_time;\n    varying float v_deltaTime;\n    \n    uniform float range;\n    #ifdef useTexture  \n        uniform sampler2D texture;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifdef useColor\n        uniform lowp vec4 color;\n    #else  \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {  \n        #ifdef useColor    \n             vec4 o = color;\n        #else\n             vec4 o = v_fragmentColor;  \n        #endif  \n        #ifdef useTexture    \n             vec2 uv_temp = uv0;\n             float x = uv_temp.x;\n             float y = uv_temp.y;\n             uv_temp.x += range*(sin(v_deltaTime + v_time + y) - sin(v_time + y));\n             uv_temp.y += range*(sin(v_deltaTime + v_time + x) - sin(v_time + x));\n             \n             o *= texture2D(texture, uv_temp); \n            \n        #endif  \n        //if (abs(o.x - 1.0) < 0.05 && abs(o.y - 1.0) < 0.05 && abs(o.z - 1.0) < 0.05) o.w = 0.0;\n        gl_FragColor = o;\n    }",
      defines: [ {
        name: "useModel"
      }, {
        name: "useTexture"
      }, {
        name: "useColor"
      } ]
    }, {
      name: "point_wave",
      vert: "\n    uniform float time;\n    uniform float deltaTime;\n    varying float v_time;\n    varying float v_deltaTime;\n    uniform mat4 viewProj;\n    attribute vec3 a_position;\n    attribute lowp vec4 a_color;\n    #ifdef useModel \n        uniform mat4 model;\n    #endif\n    #ifdef useTexture\n        attribute mediump vec2 a_uv0;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifndef useColor \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel\n             mvp = viewProj * model;\n        #else\n             mvp = viewProj;  \n        #endif  \n        vec4 pos = mvp * vec4(a_position, 1);\n        #ifndef useColor\n             v_fragmentColor = a_color;\n        #endif\n        #ifdef useTexture    \n             uv0 = a_uv0;  \n        #endif  \n        v_time = time;\n        v_deltaTime = deltaTime;\n        gl_Position = pos;\n    }",
      frag: "\n    varying float v_time;\n    varying float v_deltaTime;\n    uniform mediump vec2 point;  \n    uniform float range;\n    #ifdef useTexture  \n        uniform sampler2D texture;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifdef useColor\n        uniform lowp vec4 color;\n    #else  \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {  \n        #ifdef useColor    \n             vec4 o = color;\n        #else\n             vec4 o = v_fragmentColor;  \n        #endif  \n        #ifdef useTexture    \n             vec2 uv_temp = uv0;\n             float x = uv_temp.x;\n             float y = uv_temp.y;\n             float r = sqrt((x-point.x)*(x-point.x) + (y-point.y)*(y-point.y));\n             float f = abs(range - abs(r - v_time));\n             if (abs(r - v_time) < range) {\n                 if(x > point.x) {\n                    uv_temp.x -= 0.01;\n                 } else if (x < point.x) {\n                     uv_temp.x += 0.01;\n                 }\n               \n                 if(y > point.y) {\n                    uv_temp.y -= 0.01;\n                 } else if (y > point.y) {\n                     uv_temp.y += 0.01;\n                 }\n                 \n                o.r *= (1.0 + f);\n                o.b *= (1.0 + f);\n                o.g *= (1.0 + f);\n             \n             } else {\n                #ifdef useShadow\n                 if (f > 0.3) f = 0.3;\n                o.r *= (1.0 - f);\n                o.b *= (1.0 - f);\n                o.g *= (1.0 - f);\n                #endif \n\n             }\n             o *= texture2D(texture, uv_temp); \n            \n        #endif  \n        //if (abs(o.x - 1.0) < 0.05 && abs(o.y - 1.0) < 0.05 && abs(o.z - 1.0) < 0.05) o.w = 0.0;\n        gl_FragColor = o;\n    }",
      defines: [ {
        name: "useModel"
      }, {
        name: "useTexture"
      }, {
        name: "useColor"
      } ]
    }, {
      name: "pixel_style",
      vert: "\n    uniform mat4 viewProj;\n    attribute vec3 a_position;\n    attribute lowp vec4 a_color;\n    #ifdef useModel \n        uniform mat4 model;\n    #endif\n    #ifdef useTexture\n        attribute mediump vec2 a_uv0;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifndef useColor \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel\n             mvp = viewProj * model;\n        #else\n             mvp = viewProj;  \n        #endif  \n        vec4 pos = mvp * vec4(a_position, 1);\n        #ifndef useColor\n             v_fragmentColor = a_color;\n        #endif\n        #ifdef useTexture    \n             uv0 = a_uv0;  \n        #endif  \n        gl_Position = pos;\n    }",
      frag: "\n    uniform float sampleCount;\n    #ifdef useTexture  \n        uniform sampler2D texture;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifdef useColor\n        uniform lowp vec4 color;\n    #else  \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {  \n        #ifdef useColor    \n             vec4 o = color;\n        #else\n             vec4 o = v_fragmentColor;  \n        #endif  \n        #ifdef useTexture    \n             vec2 uv_temp = uv0;\n             float count = 1.0 / sampleCount;\n\n             float i = floor(uv0.x / count);\n             float j = floor(uv0.y / count);\n             float startX = count * i;\n             float endX = startX + count;\n             float pointX = (startX + endX) / 2.0;\n             \n\n             float startY = count * j;\n             float endY= startY + count;\n             float pointY = (startY + endY) / 2.0;\n             \n             if (uv0.x > startX && uv0.x < endX && uv0.y > startY && uv0.y < endY) {\n                uv_temp.x = pointX;\n                uv_temp.y = pointY;\n            }\n             o *= texture2D(texture, uv_temp); \n             #ifdef disableColor  \n                 float av = (o.r+o.g+o.b) / 3.0;  \n                 o.r = av;\n                 o.g = av;\n                 o.b = av;\n            #endif  \n        #endif  \n        gl_FragColor = o;\n    }",
      defines: [ {
        name: "useModel"
      }, {
        name: "useTexture"
      }, {
        name: "useColor"
      } ]
    }, {
      name: "spine_pxiel",
      vert: "\n    uniform mat4 viewProj;\n    #ifdef use2DPos\n      attribute vec2 a_position;\n    #else\n      attribute vec3 a_position;\n    #endif\n    attribute lowp vec4 a_color;\n    #ifdef useTint\n      attribute lowp vec4 a_color0;\n    #endif\n    #ifdef useModel  \n      uniform mat4 model;\n    #endif\n    attribute mediump vec2 a_uv0;\n    varying mediump vec2 uv0;\n    varying lowp vec4 v_light;\n    #ifdef useTint  \n      varying lowp vec4 v_dark;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel    \n           mvp = viewProj * model;  \n        #else    \n           mvp = viewProj;  \n        #endif\n        #ifdef use2DPos  \n           vec4 pos = mvp * vec4(a_position, 0, 1);\n        #else  \n           vec4 pos = mvp * vec4(a_position, 1);  \n        #endif  \n        v_light = a_color;  \n        #ifdef useTint    \n           v_dark = a_color0;  \n        #endif  \n        uv0 = a_uv0;  \n        gl_Position = pos;\n    }",
      frag: "\n        uniform float sampleCount;\n        uniform sampler2D texture;\n        varying mediump vec2 uv0;\n        #ifdef alphaTest  \n           uniform lowp float alphaThreshold;\n        #endif\n        varying lowp vec4 v_light;\n        #ifdef useTint\n           varying lowp vec4 v_dark;\n        #endif\n        void main () {\n                vec2 uv_temp = uv0;\n                float count = 1.0 / sampleCount;\n\n                float i = floor(uv0.x / count);\n                float j = floor(uv0.y / count);\n                float startX = count * i;\n                float endX = startX + count;\n                float pointX = (startX + endX) / 2.0;\n             \n\n                float startY = count * j;\n                float endY= startY + count;\n                float pointY = (startY + endY) / 2.0;\n             \n                if (uv0.x > startX && uv0.x < endX && uv0.y > startY && uv0.y < endY) {\n                   uv_temp.x = pointX;\n                   uv_temp.y = pointY;\n                }\n\n                vec4 texColor = texture2D(texture, uv_temp);\n                vec4 finalColor;  \n                #ifdef useTint\n                    finalColor.a = v_light.a * texColor.a;    \n                    finalColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;  \n                #else\n                    finalColor = texColor * v_light;\n                #endif  \n                #ifdef alphaTest    \n                    if (finalColor.a <= alphaThreshold)      \n                        discard;  \n                #endif  \n                #ifdef disableColor    \n                    float av = (finalColor.r+finalColor.g+finalColor.b) / 3.0;  \n                    finalColor.r = av;\n                    finalColor.g = av;\n                    finalColor.b = av;\n                #endif  \n                gl_FragColor = finalColor;\n        }",
      defines: [ {
        name: "useModel"
      }, {
        name: "alphaTest"
      }, {
        name: "use2DPos"
      }, {
        name: "useTint"
      } ]
    } ];
    cc._RF.pop();
  }, {} ],
  TableMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "25685du2JVGR48ndlFQxrEJ", "TableMgr");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TableMgr = function() {
      function TableMgr() {
        this.load = TableMgr.JSON_URL && "" != TableMgr.JSON_URL ? cc.loader.load.bind(cc.loader) : cc.loader.loadRes.bind(cc.loader);
        this.fileFormat = TableMgr.JSON_URL && "" != TableMgr.JSON_URL ? ".json?time=" + Date.now() : "";
        this.total = 0;
        this.complete = 0;
        this.Monster_ball__monster = {};
        this.Monster_ball_ball = {};
        this.Monster_ball_evaluate = {};
        this.Monster_ball_paly_level = {};
        this.Monster_ball_prop = {};
        this.Monster_ball_scene = {};
      }
      Object.defineProperty(TableMgr, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new TableMgr();
        },
        enumerable: true,
        configurable: true
      });
      TableMgr.prototype.startLoad = function(url, complete, progress) {
        this.completeCallback = complete;
        this.progressCallback = progress;
        var self = this;
        this.load(TableMgr.JSON_URL + url.trim().split("/").join("") + "/file_list" + this.fileFormat, function(err, JsonAsset) {
          if (err) console.error(err.errorMessage); else {
            var jsonArray = "Array" == JsonAsset.constructor["name"] ? JsonAsset : JsonAsset.json;
            this.total = jsonArray.length;
            for (var _i = 0, jsonArray_1 = jsonArray; _i < jsonArray_1.length; _i++) {
              var jsonFile = jsonArray_1[_i];
              self.loadJson(url.trim().split("/").join("") + "/" + jsonFile.replace(".json", ""));
            }
          }
        }.bind(this));
      };
      TableMgr.prototype.loadJson = function(url) {
        console.log("start load:" + url);
        var self = this;
        var tableName = url.split("/")[1];
        this.load(TableMgr.JSON_URL + url + this.fileFormat, function(err, JsonAsset) {
          if (err) console.error(err.errorMessage); else {
            var jsonArray = "Array" == JsonAsset.constructor["name"] ? JsonAsset : JsonAsset.json;
            for (var _i = 0, jsonArray_2 = jsonArray; _i < jsonArray_2.length; _i++) {
              var json = jsonArray_2[_i];
              self[tableName][json["ID"]] = json;
            }
            self.completeLoad();
          }
        }.bind(this));
      };
      TableMgr.prototype.completeLoad = function() {
        this.complete++;
        this.complete >= this.total && this.completeCallback && this.completeCallback();
      };
      TableMgr.prototype.getMonster_ball__monster = function(key) {
        if (this.Monster_ball__monster[key]) return this.Monster_ball__monster[key];
        console.error("Monster_ball__monster \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball__monster_Data = function() {
        return this.Monster_ball__monster;
      };
      TableMgr.prototype.getMonster_ball_ball = function(key) {
        if (this.Monster_ball_ball[key]) return this.Monster_ball_ball[key];
        console.error("Monster_ball_ball \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball_ball_Data = function() {
        return this.Monster_ball_ball;
      };
      TableMgr.prototype.getMonster_ball_evaluate = function(key) {
        if (this.Monster_ball_evaluate[key]) return this.Monster_ball_evaluate[key];
        console.error("Monster_ball_evaluate \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball_evaluate_Data = function() {
        return this.Monster_ball_evaluate;
      };
      TableMgr.prototype.getMonster_ball_paly_level = function(key) {
        if (this.Monster_ball_paly_level[key]) return this.Monster_ball_paly_level[key];
        console.error("Monster_ball_paly_level \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball_paly_level_Data = function() {
        return this.Monster_ball_paly_level;
      };
      TableMgr.prototype.getMonster_ball_prop = function(key) {
        if (this.Monster_ball_prop[key]) return this.Monster_ball_prop[key];
        console.error("Monster_ball_prop \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball_prop_Data = function() {
        return this.Monster_ball_prop;
      };
      TableMgr.prototype.getMonster_ball_scene = function(key) {
        if (this.Monster_ball_scene[key]) return this.Monster_ball_scene[key];
        console.error("Monster_ball_scene \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball_scene_Data = function() {
        return this.Monster_ball_scene;
      };
      TableMgr.JSON_URL = "";
      return TableMgr;
    }();
    exports.TableMgr = TableMgr;
    cc._RF.pop();
  }, {} ],
  TeleportMovement: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5e6c2gIX6pDwbna9tCpyw+h", "TeleportMovement");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Monster_1 = require("../Game/Monster");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var MonsterSpine_1 = require("./MonsterSpine");
    var MonsterCtrl_1 = require("./MonsterCtrl");
    var table_1 = require("../table");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TeleportMovement = function(_super) {
      __extends(TeleportMovement, _super);
      function TeleportMovement() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.monster = null;
        _this.stage = 0;
        _this.moveCD = 0;
        _this.telePoint = [ cc.v2(-591, 225), cc.v2(-253, 608), cc.v2(645, 290), cc.v2(401, 103) ];
        _this.curTelePoint = [];
        return _this;
      }
      TeleportMovement.prototype.onLoad = function() {};
      TeleportMovement.prototype.reuse = function() {
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.MONSTER_DIE, this.die, this);
        this.updateMonsterInfo(arguments[0][0], arguments[0][1]);
        this.node.zIndex = -100;
      };
      TeleportMovement.prototype.unuse = function() {
        EventManager_1.gEventMgr.targetOff(this);
        this.monster = null;
        this.id = this.readID = "";
        this.stage = 0;
      };
      TeleportMovement.prototype.addPoint = function(p) {
        var canADD = true;
        for (var _i = 0, _a = this.telePoint; _i < _a.length; _i++) {
          var point = _a[_i];
          if (CMath.Distance(point, p) < 10) {
            canADD = false;
            break;
          }
        }
        canADD && this.telePoint.push(p);
        this.curTelePoint = this.telePoint.concat();
        console.log(this.telePoint);
      };
      TeleportMovement.prototype.start = function() {};
      TeleportMovement.prototype.die = function(monsterID) {
        if (this.id != monsterID) return;
        this.monster = null;
      };
      Object.defineProperty(TeleportMovement.prototype, "Spine", {
        get: function() {
          return this.spine ? this.spine : this.spine = this.getComponent(MonsterSpine_1.default);
        },
        enumerable: true,
        configurable: true
      });
      TeleportMovement.prototype.updateMonsterInfo = function(id, monster) {
        this.id = id;
        this.readID = monster.MonsterID.toString();
        this.monster = monster;
        this.stage = this.monster.Stage;
        this.enabled = this.monster.realMoveType == MonsterCtrl_1.MoveType.Teleport && this.monster.Type != table_1.Monster_ball__monster_monster.BOSS;
      };
      TeleportMovement.prototype.update = function(dt) {
        if (!this.monster) return;
        if (this.monster.State & Monster_1.MonsterState.NUMB) return;
        this.moveCD += dt;
        if (this.moveCD >= this.monster.StiffTime && this.monster.CanMove) {
          this.moveCD = 0;
          this.Spine.move();
          setTimeout(this.move.bind(this), 600);
        } else this.Spine.idle();
      };
      TeleportMovement.prototype.move = function() {
        var index = cc.director.getTotalFrames() % this.curTelePoint.length;
        this.node.setPosition(this.curTelePoint.splice(index, 1)[0]);
        this.node.scaleX = this.node.x > 0 ? 1 : -1;
        0 == this.curTelePoint.length && (this.curTelePoint = this.telePoint.concat());
        console.log(this.curTelePoint);
      };
      TeleportMovement = __decorate([ ccclass ], TeleportMovement);
      return TeleportMovement;
    }(cc.Component);
    exports.default = TeleportMovement;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "../Game/Monster": "Monster",
    "../table": "table",
    "./MonsterCtrl": "MonsterCtrl",
    "./MonsterSpine": "MonsterSpine"
  } ],
  TransitionMask: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "62af3eKgRRIeIqN2zIFLGIM", "TransitionMask");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TransitionMask = function(_super) {
      __extends(TransitionMask, _super);
      function TransitionMask() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.transitionMaterial = new ShaderManager_1.TransitionMaterial();
        _this.startTrans = false;
        _this.time = 0;
        return _this;
      }
      TransitionMask.prototype.onLoad = function() {
        var mask = this.getComponent(cc.Mask);
        mask["_material"] = this.transitionMaterial;
        mask["_activateMaterial"]();
        this.transitionMaterial.setProperty("range", .1);
      };
      TransitionMask.prototype.start = function() {};
      TransitionMask.prototype.update = function(dt) {
        if (!this.startTrans) return;
        this.time += 1.2 * dt;
        this.transitionMaterial.setProperty("time", this.time);
      };
      TransitionMask = __decorate([ ccclass ], TransitionMask);
      return TransitionMask;
    }(cc.Component);
    exports.default = TransitionMask;
    cc._RF.pop();
  }, {
    "./ShaderManager": "ShaderManager"
  } ],
  TransitionSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "21b9bI2CjxK8rInGsLpCraP", "TransitionSprite");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TransitionSprite = function(_super) {
      __extends(TransitionSprite, _super);
      function TransitionSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.transitionMaterial = new ShaderManager_1.TransitionMaterial();
        _this.time = 0;
        return _this;
      }
      TransitionSprite.prototype.onLoad = function() {
        var sprite = this.getComponent(cc.Sprite);
        sprite["_spriteMaterial"] = this.transitionMaterial;
        sprite["_activateMaterial"]();
        this.transitionMaterial.setProperty("range", .1);
      };
      TransitionSprite.prototype.start = function() {};
      TransitionSprite.prototype.update = function(dt) {
        if (!this.node.active) {
          this.Time = 0;
          return;
        }
        this.Time += .8 * dt;
        if (this.time > 2) {
          this.Time = 0;
          this.node.active = false;
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.ADD_NEW_MONSTER);
        }
      };
      Object.defineProperty(TransitionSprite.prototype, "Time", {
        get: function() {
          return this.time;
        },
        set: function(val) {
          this.time = val;
          this.transitionMaterial.setProperty("time", this.time);
        },
        enumerable: true,
        configurable: true
      });
      TransitionSprite = __decorate([ ccclass ], TransitionSprite);
      return TransitionSprite;
    }(cc.Component);
    exports.default = TransitionSprite;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "./ShaderManager": "ShaderManager"
  } ],
  WaveSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8b316Iw6W5OFqaeK8iUMK9S", "WaveSprite");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var WaveSprite = function(_super) {
      __extends(WaveSprite, _super);
      function WaveSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.wave = new ShaderManager_1.WaveMaterial();
        _this.time = 0;
        return _this;
      }
      WaveSprite.prototype.onLoad = function() {
        var sprite = this.getComponent(cc.Sprite);
        if (!sprite) return;
        sprite["_spriteMaterial"] = this.wave;
        sprite["_activateMaterial"]();
        this.wave.setProperty("range", 1);
      };
      WaveSprite.prototype.start = function() {};
      WaveSprite.prototype.update = function(dt) {
        this.time += 10 * dt;
        this.wave.setProperty("time", this.time);
        this.wave.setProperty("deltaTime", dt);
      };
      WaveSprite = __decorate([ ccclass ], WaveSprite);
      return WaveSprite;
    }(cc.Component);
    exports.default = WaveSprite;
    cc._RF.pop();
  }, {
    "./ShaderManager": "ShaderManager"
  } ],
  Weakness: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2d081m50EpBtb8U+/H/IVeC", "Weakness");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var Config_1 = require("../Config/Config");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var weakness = function(_super) {
      __extends(weakness, _super);
      function weakness() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.spine = null;
        _this.followBone = "";
        _this.bone = null;
        _this.initBone = {
          worldX: 0,
          worldY: 0,
          rotation: 0
        };
        return _this;
      }
      weakness.prototype.onLoad = function() {
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLANE_ATTACK_DONE, this.addBoom, this);
      };
      weakness.prototype.unLoad = function() {
        EventManager_1.gEventMgr.targetOff(this);
      };
      weakness.prototype.addBoom = function() {
        if (!this.node || !this.node.active || !this.node.isValid || !this.node.parent || !this.node.parent.isValid || !this.node.parent.active) return;
        setTimeout(function() {
          if (!this.node || !this.node.isValid || !this.node.parent || !this.node.parent.isValid || !this.node.parent.active) return;
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.ADD_EFFECT, Config_1.EffectType.Boom, this.node.parent.convertToWorldSpaceAR(this.node.position), false);
        }.bind(this), 1500 * Math.random());
      };
      weakness.prototype.start = function() {
        this.pos = cc.v2(this.node.position.x, this.node.position.y);
        if (!this.spine || "" == this.followBone) return;
        this.spine.updateWorldTransform();
        this.bone = this.spine.findBone(this.followBone);
      };
      weakness.prototype.update = function(dt) {
        if (!this.node || !this.node.active || !this.node.isValid || !this.node.parent || !this.node.parent.isValid || !this.node.parent.active) return;
        this.node.setPosition(this.pos);
        if (!this.bone) return;
        if (0 == this.initBone.worldX && 0 == this.initBone.worldY) {
          this.initBone.worldX = this.bone.worldX;
          this.initBone.worldY = this.bone.worldY;
          this.initBone.rotation = this.bone.rotation;
        }
        this.node.x += this.bone.worldX - this.initBone.worldX;
        this.node.y += this.bone.worldY - this.initBone.worldY;
        this.node.rotation = this.bone.rotation - this.initBone.rotation;
      };
      weakness.prototype.onDestroy = function() {
        EventManager_1.gEventMgr.targetOff(this);
      };
      __decorate([ property(sp.Skeleton) ], weakness.prototype, "spine", void 0);
      __decorate([ property ], weakness.prototype, "followBone", void 0);
      weakness = __decorate([ ccclass ], weakness);
      return weakness;
    }(cc.Component);
    exports.default = weakness;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName"
  } ],
  WelcomeScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eb0baSzE0ZOwI4WnZ36jDbT", "WelcomeScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseScene_1 = require("./BaseScene");
    var HashMap_1 = require("../Utils/HashMap");
    var Config_1 = require("../Config/Config");
    var TableMgr_1 = require("../TableMgr");
    var ShaderManager_1 = require("../Shader/ShaderManager");
    var GameFactory_1 = require("../Factory/GameFactory");
    var AudioController_1 = require("../Controller/AudioController");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LOAD_STEP;
    (function(LOAD_STEP) {
      LOAD_STEP[LOAD_STEP["READY"] = 2] = "READY";
      LOAD_STEP[LOAD_STEP["INIT"] = 4] = "INIT";
      LOAD_STEP[LOAD_STEP["REGISTER"] = 8] = "REGISTER";
      LOAD_STEP[LOAD_STEP["LOGIN"] = 16] = "LOGIN";
      LOAD_STEP[LOAD_STEP["MATCH"] = 32] = "MATCH";
      LOAD_STEP[LOAD_STEP["JSON_PARSE"] = 64] = "JSON_PARSE";
      LOAD_STEP[LOAD_STEP["ANIMATION_DONE"] = 128] = "ANIMATION_DONE";
      LOAD_STEP[LOAD_STEP["SCENE_DONE"] = 256] = "SCENE_DONE";
      LOAD_STEP[LOAD_STEP["AUDIO"] = 512] = "AUDIO";
      LOAD_STEP[LOAD_STEP["DONE"] = 1022] = "DONE";
    })(LOAD_STEP = exports.LOAD_STEP || (exports.LOAD_STEP = {}));
    var WelcomeScene = function(_super) {
      __extends(WelcomeScene, _super);
      function WelcomeScene() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.nextSceneName = "Game";
        _this.loadingPercent = null;
        _this.maxPercent = 0;
        _this.Tip = null;
        _this.percentLabel = null;
        _this._callbacks = new HashMap_1.HashMap();
        _this._step = LOAD_STEP.READY;
        return _this;
      }
      WelcomeScene.prototype.onLoad = function() {
        var _this = this;
        true;
        ShaderManager_1.ShaderManager.inst;
        cc.game.setFrameRate(Config_1.Config.FPS);
        this.maxPercent = 0;
        this.loadingPercent.progress = 0;
        this.defaultAnimation = this.node.getComponent(cc.Animation);
        this.defaultAnimation ? this.defaultAnimation.once(cc.Animation.EventType.FINISHED, this.animationDone, this) : this.nextStep(LOAD_STEP.ANIMATION_DONE);
        if (Config_1.Config.isMultiPlayer) ; else {
          this.nextStep(LOAD_STEP.LOGIN);
          this.nextStep(LOAD_STEP.MATCH);
          this.nextStep(LOAD_STEP.REGISTER);
          this.nextStep(LOAD_STEP.INIT);
        }
        TableMgr_1.TableMgr.JSON_URL = "https://eatdreamcat.github.io/Monster-Ball/";
        TableMgr_1.TableMgr.inst.startLoad("json/", function() {
          GameFactory_1.gFactory.init(function() {
            this.nextStep(LOAD_STEP.JSON_PARSE);
          }.bind(_this));
        });
        AudioController_1.gAudio.init(function() {
          this.nextStep(LOAD_STEP.AUDIO);
        }.bind(this));
        cc.director.preloadScene(this.nextSceneName, null, function(err, sceneAsset) {
          if (err) console.error("\u573a\u666f\u52a0\u8f7d\u9519\u8bef"); else {
            _this.nextScene = sceneAsset.scene;
            _this.nextStep(LOAD_STEP.SCENE_DONE);
          }
        });
      };
      WelcomeScene.prototype.update = function(dt) {
        this.loadingPercent.progress += dt / 5;
        this.loadingPercent.progress > this.maxPercent && (this.loadingPercent.progress = this.maxPercent);
        this.percentLabel.string = (100 * this.loadingPercent.progress).toFixed(2) + "%";
        this.loadingPercent.progress >= 1 && this.node.emit("load_done");
      };
      WelcomeScene.prototype.animationDone = function() {
        this.defaultAnimation.off(cc.Animation.EventType.FINISHED);
        this.nextStep(LOAD_STEP.ANIMATION_DONE);
      };
      WelcomeScene.prototype.registerStep = function(step, callback) {
        this._callbacks.add(step, callback);
      };
      WelcomeScene.prototype.nextStep = function(loadStep) {
        var _this = this;
        this._step |= loadStep;
        console.log("CUR STEP:" + LOAD_STEP[loadStep] + ", total: " + this._step);
        this.maxPercent = (this._step & (65535 ^ LOAD_STEP.ANIMATION_DONE)) / (LOAD_STEP.DONE & (65535 ^ LOAD_STEP.ANIMATION_DONE));
        console.log(" MAXPERCENT:" + this.maxPercent);
        if (this._step >= LOAD_STEP.DONE) {
          this.node.once("load_done", function() {
            _this.nextScene ? cc.director.runSceneImmediate(_this.nextScene) : cc.director.loadScene(_this.nextSceneName);
          }, this);
          this.defaultAnimation.play().wrapMode = cc.WrapMode.Loop;
        } else if (loadStep == LOAD_STEP.ANIMATION_DONE && this.defaultAnimation) {
          this._step &= 65535 ^ LOAD_STEP.ANIMATION_DONE;
          this.defaultAnimation.once(cc.Animation.EventType.FINISHED, this.animationDone, this);
          this.defaultAnimation.play();
        }
      };
      __decorate([ property({
        displayName: "\u6e38\u620f\u573a\u666f\u540d",
        tooltip: "\u9ed8\u8ba4\u8fdb\u5165Game\u573a\u666f\uff0c\u5982\u679c\u9700\u8981\u6307\u5b9a\u573a\u666f\uff0c\u53ef\u4ee5\u6307\u5b9a"
      }) ], WelcomeScene.prototype, "nextSceneName", void 0);
      __decorate([ property(cc.ProgressBar) ], WelcomeScene.prototype, "loadingPercent", void 0);
      __decorate([ property(cc.Label) ], WelcomeScene.prototype, "Tip", void 0);
      __decorate([ property(cc.Label) ], WelcomeScene.prototype, "percentLabel", void 0);
      WelcomeScene = __decorate([ ccclass ], WelcomeScene);
      return WelcomeScene;
    }(BaseScene_1.default);
    exports.default = WelcomeScene;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../Controller/AudioController": "AudioController",
    "../Factory/GameFactory": "GameFactory",
    "../Shader/ShaderManager": "ShaderManager",
    "../TableMgr": "TableMgr",
    "../Utils/HashMap": "HashMap",
    "./BaseScene": "BaseScene"
  } ],
  table: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe7e46QRHJN1oi9gtz30zLf", "table");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Monster_ball__monster_monster;
    (function(Monster_ball__monster_monster) {
      Monster_ball__monster_monster[Monster_ball__monster_monster["XiaoGuai"] = 1] = "XiaoGuai";
      Monster_ball__monster_monster[Monster_ball__monster_monster["BOSS"] = 2] = "BOSS";
    })(Monster_ball__monster_monster = exports.Monster_ball__monster_monster || (exports.Monster_ball__monster_monster = {}));
    var Monster_ball__monster_type_1;
    (function(Monster_ball__monster_type_1) {
      Monster_ball__monster_type_1[Monster_ball__monster_type_1["GuDingWeiZhiBuDong"] = 1] = "GuDingWeiZhiBuDong";
      Monster_ball__monster_type_1[Monster_ball__monster_type_1["LuDiPingYi"] = 2] = "LuDiPingYi";
      Monster_ball__monster_type_1[Monster_ball__monster_type_1["FeiHangPingYi"] = 3] = "FeiHangPingYi";
      Monster_ball__monster_type_1[Monster_ball__monster_type_1["QuanTuShunYi"] = 4] = "QuanTuShunYi";
    })(Monster_ball__monster_type_1 = exports.Monster_ball__monster_type_1 || (exports.Monster_ball__monster_type_1 = {}));
    var Monster_ball__monster_type_2;
    (function(Monster_ball__monster_type_2) {
      Monster_ball__monster_type_2[Monster_ball__monster_type_2["LuDiPingYi"] = 1] = "LuDiPingYi";
      Monster_ball__monster_type_2[Monster_ball__monster_type_2["FeiHangPingYi"] = 2] = "FeiHangPingYi";
      Monster_ball__monster_type_2[Monster_ball__monster_type_2["QuanTuShunYi"] = 3] = "QuanTuShunYi";
      Monster_ball__monster_type_2[Monster_ball__monster_type_2["GuDingWeiZhiBuDong"] = 4] = "GuDingWeiZhiBuDong";
    })(Monster_ball__monster_type_2 = exports.Monster_ball__monster_type_2 || (exports.Monster_ball__monster_type_2 = {}));
    var Monster_ball__monster_type_3;
    (function(Monster_ball__monster_type_3) {
      Monster_ball__monster_type_3[Monster_ball__monster_type_3["LuDiPingYi"] = 1] = "LuDiPingYi";
      Monster_ball__monster_type_3[Monster_ball__monster_type_3["FeiHangPingYi"] = 2] = "FeiHangPingYi";
      Monster_ball__monster_type_3[Monster_ball__monster_type_3["QuanTuShunYi"] = 3] = "QuanTuShunYi";
      Monster_ball__monster_type_3[Monster_ball__monster_type_3["GuDingWeiZhiBuDong"] = 4] = "GuDingWeiZhiBuDong";
    })(Monster_ball__monster_type_3 = exports.Monster_ball__monster_type_3 || (exports.Monster_ball__monster_type_3 = {}));
    var Monster_ball_ball_form;
    (function(Monster_ball_ball_form) {
      Monster_ball_ball_form[Monster_ball_ball_form["PuTong"] = 1] = "PuTong";
      Monster_ball_ball_form[Monster_ball_ball_form["ZhaDan"] = 2] = "ZhaDan";
      Monster_ball_ball_form[Monster_ball_ball_form["DianJiMaBi"] = 3] = "DianJiMaBi";
    })(Monster_ball_ball_form = exports.Monster_ball_ball_form || (exports.Monster_ball_ball_form = {}));
    var Monster_ball_paly_level_form;
    (function(Monster_ball_paly_level_form) {
      Monster_ball_paly_level_form[Monster_ball_paly_level_form["PuTongGuanQia"] = 1] = "PuTongGuanQia";
      Monster_ball_paly_level_form[Monster_ball_paly_level_form["BOSSGuan"] = 2] = "BOSSGuan";
    })(Monster_ball_paly_level_form = exports.Monster_ball_paly_level_form || (exports.Monster_ball_paly_level_form = {}));
    var Monster_ball_prop_form;
    (function(Monster_ball_prop_form) {
      Monster_ball_prop_form[Monster_ball_prop_form["HuiFuNaiJiuDu"] = 1] = "HuiFuNaiJiuDu";
      Monster_ball_prop_form[Monster_ball_prop_form["QuanPingGongJiGuaiWu"] = 2] = "QuanPingGongJiGuaiWu";
      Monster_ball_prop_form[Monster_ball_prop_form["QuanBuGuaiWuTingDun"] = 3] = "QuanBuGuaiWuTingDun";
      Monster_ball_prop_form[Monster_ball_prop_form["JiaFenShu"] = 4] = "JiaFenShu";
    })(Monster_ball_prop_form = exports.Monster_ball_prop_form || (exports.Monster_ball_prop_form = {}));
    cc._RF.pop();
  }, {} ]
}, {}, [ "BallCtrl", "Item", "Config", "AudioController", "CameraController", "Effect", "EventManager", "EventName", "GameFactory", "Ball", "BuffManager", "Game", "Monster", "BossGodzimora", "BossZai", "HorizontalMovement", "MonsterCtrl", "MonsterSpine", "TeleportMovement", "Weakness", "Background", "BaseScene", "GameScene", "OverScene", "WelcomeScene", "ButterFlySpring", "PixelSprite", "PointWave", "ShaderManager", "ShaderTemplate", "TransitionMask", "TransitionSprite", "WaveSprite", "TableMgr", "BallTab", "Debug", "MainUI", "OverLayer", "HashMap", "table" ]);