'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
customElements.define('compodoc-menu', /*#__PURE__*/function (_HTMLElement) {
  function _class() {
    var _this;
    _classCallCheck(this, _class);
    _this = _callSuper(this, _class);
    _this.isNormalMode = _this.getAttribute('mode') === 'normal';
    return _this;
  }
  _inherits(_class, _HTMLElement);
  return _createClass(_class, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.render(this.isNormalMode);
    }
  }, {
    key: "render",
    value: function render(isNormalMode) {
      var tp = lithtml.html(
        '\n        <nav>\n            <ul class="list">\n                <li class="title">\n                    <a href="index.html" data-type="index-link">arkham-city-core documentation</a>\n                </li>\n\n                <li class="divider"></li>\n                '
          .concat(
            isNormalMode
              ? '<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>'
              : '',
            '\n                <li class="chapter">\n                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>\n                    <ul class="links">\n                        <li class="link">\n                            <a href="overview.html" data-type="chapter-link">\n                                <span class="icon ion-ios-keypad"></span>Overview\n                            </a>\n                        </li>\n                        <li class="link">\n                            <a href="index.html" data-type="chapter-link">\n                                <span class="icon ion-ios-paper"></span>README\n                            </a>\n                        </li>\n                                <li class="link">\n                                    <a href="dependencies.html" data-type="chapter-link">\n                                        <span class="icon ion-ios-list"></span>Dependencies\n                                    </a>\n                                </li>\n                                <li class="link">\n                                    <a href="properties.html" data-type="chapter-link">\n                                        <span class="icon ion-ios-apps"></span>Properties\n                                    </a>\n                                </li>\n                    </ul>\n                </li>\n                    <li class="chapter modules">\n                        <a data-type="chapter-link" href="modules.html">\n                            <div class="menu-toggler linked" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#modules-links"'
              : 'data-bs-target="#xs-modules-links"',
            '>\n                                <span class="icon ion-ios-archive"></span>\n                                <span class="link-name">Modules</span>\n                                <span class="icon ion-ios-arrow-down"></span>\n                            </div>\n                        </a>\n                        <ul class="links collapse " ',
          )
          .concat(
            isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"',
            '>\n                            <li class="link">\n                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>\n                            </li>\n                            <li class="link">\n                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>\n                                <li class="chapter inner">\n                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#injectables-links-module-AuthModule-6cfa4750d29f81dc59a447ee4cf227307de81e2e21013de1bf7059f8fa818c06cfa910c0b9fb44caf80623e48f9d9d7cd575d163266d192077e122e94f5bc21a"'
              : 'data-bs-target="#xs-injectables-links-module-AuthModule-6cfa4750d29f81dc59a447ee4cf227307de81e2e21013de1bf7059f8fa818c06cfa910c0b9fb44caf80623e48f9d9d7cd575d163266d192077e122e94f5bc21a"',
            '>\n                                        <span class="icon ion-md-arrow-round-down"></span>\n                                        <span>Injectables</span>\n                                        <span class="icon ion-ios-arrow-down"></span>\n                                    </div>\n                                    <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="injectables-links-module-AuthModule-6cfa4750d29f81dc59a447ee4cf227307de81e2e21013de1bf7059f8fa818c06cfa910c0b9fb44caf80623e48f9d9d7cd575d163266d192077e122e94f5bc21a"'
              : 'id="xs-injectables-links-module-AuthModule-6cfa4750d29f81dc59a447ee4cf227307de81e2e21013de1bf7059f8fa818c06cfa910c0b9fb44caf80623e48f9d9d7cd575d163266d192077e122e94f5bc21a"',
            '>\n                                        <li class="link">\n                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/CoreModule.html" data-type="entity-link" >CoreModule</a>\n                                <li class="chapter inner">\n                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#injectables-links-module-CoreModule-d3e47798492dc21aa408898a13662e87d285aa5cc26d9f64e5965406e18f0b4f56fb87ab7433ab4e975ef25aac3cc628524c3b3c83cd314a3a5bcfbc86ba8b0c"'
              : 'data-bs-target="#xs-injectables-links-module-CoreModule-d3e47798492dc21aa408898a13662e87d285aa5cc26d9f64e5965406e18f0b4f56fb87ab7433ab4e975ef25aac3cc628524c3b3c83cd314a3a5bcfbc86ba8b0c"',
            '>\n                                        <span class="icon ion-md-arrow-round-down"></span>\n                                        <span>Injectables</span>\n                                        <span class="icon ion-ios-arrow-down"></span>\n                                    </div>\n                                    <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="injectables-links-module-CoreModule-d3e47798492dc21aa408898a13662e87d285aa5cc26d9f64e5965406e18f0b4f56fb87ab7433ab4e975ef25aac3cc628524c3b3c83cd314a3a5bcfbc86ba8b0c"'
              : 'id="xs-injectables-links-module-CoreModule-d3e47798492dc21aa408898a13662e87d285aa5cc26d9f64e5965406e18f0b4f56fb87ab7433ab4e975ef25aac3cc628524c3b3c83cd314a3a5bcfbc86ba8b0c"',
            '>\n                                        <li class="link">\n                                            <a href="injectables/HashService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HashService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>\n                                <li class="chapter inner">\n                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#injectables-links-module-DatabaseModule-c4196bdf465b3c21f6959f8ec9b29ad0e8e06aec8f7b7550f1e4bcda0291e8640c81d43ec2d05ee2843d6d940de46a0e96464005063b9466b82df459152698e4"'
              : 'data-bs-target="#xs-injectables-links-module-DatabaseModule-c4196bdf465b3c21f6959f8ec9b29ad0e8e06aec8f7b7550f1e4bcda0291e8640c81d43ec2d05ee2843d6d940de46a0e96464005063b9466b82df459152698e4"',
            '>\n                                        <span class="icon ion-md-arrow-round-down"></span>\n                                        <span>Injectables</span>\n                                        <span class="icon ion-ios-arrow-down"></span>\n                                    </div>\n                                    <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="injectables-links-module-DatabaseModule-c4196bdf465b3c21f6959f8ec9b29ad0e8e06aec8f7b7550f1e4bcda0291e8640c81d43ec2d05ee2843d6d940de46a0e96464005063b9466b82df459152698e4"'
              : 'id="xs-injectables-links-module-DatabaseModule-c4196bdf465b3c21f6959f8ec9b29ad0e8e06aec8f7b7550f1e4bcda0291e8640c81d43ec2d05ee2843d6d940de46a0e96464005063b9466b82df459152698e4"',
            '>\n                                        <li class="link">\n                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/FirestoreModule.html" data-type="entity-link" >FirestoreModule</a>\n                                <li class="chapter inner">\n                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#injectables-links-module-FirestoreModule-21d46bdc735895488fab21df903d020a52810ec160dc177fb911e0eff96062d05503ce841c214bab815fa1f451fbcf3645a28c1db3a833d52971deab50463cca"'
              : 'data-bs-target="#xs-injectables-links-module-FirestoreModule-21d46bdc735895488fab21df903d020a52810ec160dc177fb911e0eff96062d05503ce841c214bab815fa1f451fbcf3645a28c1db3a833d52971deab50463cca"',
            '>\n                                        <span class="icon ion-md-arrow-round-down"></span>\n                                        <span>Injectables</span>\n                                        <span class="icon ion-ios-arrow-down"></span>\n                                    </div>\n                                    <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="injectables-links-module-FirestoreModule-21d46bdc735895488fab21df903d020a52810ec160dc177fb911e0eff96062d05503ce841c214bab815fa1f451fbcf3645a28c1db3a833d52971deab50463cca"'
              : 'id="xs-injectables-links-module-FirestoreModule-21d46bdc735895488fab21df903d020a52810ec160dc177fb911e0eff96062d05503ce841c214bab815fa1f451fbcf3645a28c1db3a833d52971deab50463cca"',
            '>\n                                        <li class="link">\n                                            <a href="injectables/FirestoreService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FirestoreService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/FirestoreRuleModule.html" data-type="entity-link" >FirestoreRuleModule</a>\n                                <li class="chapter inner">\n                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#injectables-links-module-FirestoreRuleModule-65d481cd8e6a2b6ee77e4834dd257ff5ea7791b2933412edc1a67b4c3e590ac51a7e54d0ff8d48c5dc6ecaf11288634add01de3af2733aaa673578153fa90822"'
              : 'data-bs-target="#xs-injectables-links-module-FirestoreRuleModule-65d481cd8e6a2b6ee77e4834dd257ff5ea7791b2933412edc1a67b4c3e590ac51a7e54d0ff8d48c5dc6ecaf11288634add01de3af2733aaa673578153fa90822"',
            '>\n                                        <span class="icon ion-md-arrow-round-down"></span>\n                                        <span>Injectables</span>\n                                        <span class="icon ion-ios-arrow-down"></span>\n                                    </div>\n                                    <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="injectables-links-module-FirestoreRuleModule-65d481cd8e6a2b6ee77e4834dd257ff5ea7791b2933412edc1a67b4c3e590ac51a7e54d0ff8d48c5dc6ecaf11288634add01de3af2733aaa673578153fa90822"'
              : 'id="xs-injectables-links-module-FirestoreRuleModule-65d481cd8e6a2b6ee77e4834dd257ff5ea7791b2933412edc1a67b4c3e590ac51a7e54d0ff8d48c5dc6ecaf11288634add01de3af2733aaa673578153fa90822"',
            '>\n                                        <li class="link">\n                                            <a href="injectables/FirestoreRuleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FirestoreRuleService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/GatewayModule.html" data-type="entity-link" >GatewayModule</a>\n                            </li>\n                            <li class="link">\n                                <a href="modules/GwAuthModule.html" data-type="entity-link" >GwAuthModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-GwAuthModule-f66950eaa3f303a94b1543ffb7d0229e8ffc29edd6020eef74e44b425c2663da08c76b190eed81152b372b90cba2bdd6c952c69c5da9c7184dda1297cae1379f"'
              : 'data-bs-target="#xs-controllers-links-module-GwAuthModule-f66950eaa3f303a94b1543ffb7d0229e8ffc29edd6020eef74e44b425c2663da08c76b190eed81152b372b90cba2bdd6c952c69c5da9c7184dda1297cae1379f"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-GwAuthModule-f66950eaa3f303a94b1543ffb7d0229e8ffc29edd6020eef74e44b425c2663da08c76b190eed81152b372b90cba2bdd6c952c69c5da9c7184dda1297cae1379f"'
              : 'id="xs-controllers-links-module-GwAuthModule-f66950eaa3f303a94b1543ffb7d0229e8ffc29edd6020eef74e44b425c2663da08c76b190eed81152b372b90cba2bdd6c952c69c5da9c7184dda1297cae1379f"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/GwAuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GwAuthController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/GwFirestoreModule.html" data-type="entity-link" >GwFirestoreModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-GwFirestoreModule-c43d793c9405044811a38f43b410c3fe6a34df217f5a15cb9a71c2f4a43a055d9dca5eb9b819111a6906b26c9c5c4bdb76d598fba41b3dc517557ddfbb1f046a"'
              : 'data-bs-target="#xs-controllers-links-module-GwFirestoreModule-c43d793c9405044811a38f43b410c3fe6a34df217f5a15cb9a71c2f4a43a055d9dca5eb9b819111a6906b26c9c5c4bdb76d598fba41b3dc517557ddfbb1f046a"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-GwFirestoreModule-c43d793c9405044811a38f43b410c3fe6a34df217f5a15cb9a71c2f4a43a055d9dca5eb9b819111a6906b26c9c5c4bdb76d598fba41b3dc517557ddfbb1f046a"'
              : 'id="xs-controllers-links-module-GwFirestoreModule-c43d793c9405044811a38f43b410c3fe6a34df217f5a15cb9a71c2f4a43a055d9dca5eb9b819111a6906b26c9c5c4bdb76d598fba41b3dc517557ddfbb1f046a"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/GwFirestoreController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GwFirestoreController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/GwProjectAppModule.html" data-type="entity-link" >GwProjectAppModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-GwProjectAppModule-2c6385148aedaf05dbbb25416f04c94c3d7d98325ad61e232499547e81e3870197f6206f33a1a89ffdead6d2fff6cc749b1cff787dbae2c9cca520a6690608cd"'
              : 'data-bs-target="#xs-controllers-links-module-GwProjectAppModule-2c6385148aedaf05dbbb25416f04c94c3d7d98325ad61e232499547e81e3870197f6206f33a1a89ffdead6d2fff6cc749b1cff787dbae2c9cca520a6690608cd"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-GwProjectAppModule-2c6385148aedaf05dbbb25416f04c94c3d7d98325ad61e232499547e81e3870197f6206f33a1a89ffdead6d2fff6cc749b1cff787dbae2c9cca520a6690608cd"'
              : 'id="xs-controllers-links-module-GwProjectAppModule-2c6385148aedaf05dbbb25416f04c94c3d7d98325ad61e232499547e81e3870197f6206f33a1a89ffdead6d2fff6cc749b1cff787dbae2c9cca520a6690608cd"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/GwProjectAppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GwProjectAppController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/GwProjectFirestoreModule.html" data-type="entity-link" >GwProjectFirestoreModule</a>\n                            </li>\n                            <li class="link">\n                                <a href="modules/GwProjectFirestoreRuleModule.html" data-type="entity-link" >GwProjectFirestoreRuleModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-GwProjectFirestoreRuleModule-399ff0f703d98d77d6988b7962aa18d9b87b18fc208143ca1bcdcbf5cf0976f41c50a3f626bfeb2b842a4a7ccb4393e33697b8460e2d5604bcfaf8a5b3607b42"'
              : 'data-bs-target="#xs-controllers-links-module-GwProjectFirestoreRuleModule-399ff0f703d98d77d6988b7962aa18d9b87b18fc208143ca1bcdcbf5cf0976f41c50a3f626bfeb2b842a4a7ccb4393e33697b8460e2d5604bcfaf8a5b3607b42"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-GwProjectFirestoreRuleModule-399ff0f703d98d77d6988b7962aa18d9b87b18fc208143ca1bcdcbf5cf0976f41c50a3f626bfeb2b842a4a7ccb4393e33697b8460e2d5604bcfaf8a5b3607b42"'
              : 'id="xs-controllers-links-module-GwProjectFirestoreRuleModule-399ff0f703d98d77d6988b7962aa18d9b87b18fc208143ca1bcdcbf5cf0976f41c50a3f626bfeb2b842a4a7ccb4393e33697b8460e2d5604bcfaf8a5b3607b42"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/GwProjectFirestoreRuleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GwProjectFirestoreRuleController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/GwProjectModule.html" data-type="entity-link" >GwProjectModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-GwProjectModule-6feed908474a3b36ef177a429cebaf9e27deba13d365e8c97ba19dbe3f756a59f3f380f7f60acde8aef7b14d1f5ead61737a61ea224d69d21cd518cc2820cb6d"'
              : 'data-bs-target="#xs-controllers-links-module-GwProjectModule-6feed908474a3b36ef177a429cebaf9e27deba13d365e8c97ba19dbe3f756a59f3f380f7f60acde8aef7b14d1f5ead61737a61ea224d69d21cd518cc2820cb6d"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-GwProjectModule-6feed908474a3b36ef177a429cebaf9e27deba13d365e8c97ba19dbe3f756a59f3f380f7f60acde8aef7b14d1f5ead61737a61ea224d69d21cd518cc2820cb6d"'
              : 'id="xs-controllers-links-module-GwProjectModule-6feed908474a3b36ef177a429cebaf9e27deba13d365e8c97ba19dbe3f756a59f3f380f7f60acde8aef7b14d1f5ead61737a61ea224d69d21cd518cc2820cb6d"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/GwProjectController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GwProjectController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/GwWebsdkAuthModule.html" data-type="entity-link" >GwWebsdkAuthModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-GwWebsdkAuthModule-2b356e9ab3510e427b157bf488b9327edd3336e9cf6e247a997600eac29632be899dc650dd1936eaa89b7d67b580ed222f4381f897c0ce8e816c48cb8779a112"'
              : 'data-bs-target="#xs-controllers-links-module-GwWebsdkAuthModule-2b356e9ab3510e427b157bf488b9327edd3336e9cf6e247a997600eac29632be899dc650dd1936eaa89b7d67b580ed222f4381f897c0ce8e816c48cb8779a112"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-GwWebsdkAuthModule-2b356e9ab3510e427b157bf488b9327edd3336e9cf6e247a997600eac29632be899dc650dd1936eaa89b7d67b580ed222f4381f897c0ce8e816c48cb8779a112"'
              : 'id="xs-controllers-links-module-GwWebsdkAuthModule-2b356e9ab3510e427b157bf488b9327edd3336e9cf6e247a997600eac29632be899dc650dd1936eaa89b7d67b580ed222f4381f897c0ce8e816c48cb8779a112"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/GwWebsdkAuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GwWebsdkAuthController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/GwWebSDKFirestoreModule.html" data-type="entity-link" >GwWebSDKFirestoreModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-GwWebSDKFirestoreModule-ebdd5c2a1b029d3769c28189f676685390eeef6f817d166c9712fd26843824472ee7e7a984937c9cc496ab49ea7241806bf0009caf9769b32ffb237b576bc60c"'
              : 'data-bs-target="#xs-controllers-links-module-GwWebSDKFirestoreModule-ebdd5c2a1b029d3769c28189f676685390eeef6f817d166c9712fd26843824472ee7e7a984937c9cc496ab49ea7241806bf0009caf9769b32ffb237b576bc60c"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-GwWebSDKFirestoreModule-ebdd5c2a1b029d3769c28189f676685390eeef6f817d166c9712fd26843824472ee7e7a984937c9cc496ab49ea7241806bf0009caf9769b32ffb237b576bc60c"'
              : 'id="xs-controllers-links-module-GwWebSDKFirestoreModule-ebdd5c2a1b029d3769c28189f676685390eeef6f817d166c9712fd26843824472ee7e7a984937c9cc496ab49ea7241806bf0009caf9769b32ffb237b576bc60c"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/GwWebSDKFirestoreController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GwWebSDKFirestoreController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/GwWebsdkModule.html" data-type="entity-link" >GwWebsdkModule</a>\n                            </li>\n                            <li class="link">\n                                <a href="modules/MicroservicesModule.html" data-type="entity-link" >MicroservicesModule</a>\n                            </li>\n                            <li class="link">\n                                <a href="modules/ModulesModule.html" data-type="entity-link" >ModulesModule</a>\n                            </li>\n                            <li class="link">\n                                <a href="modules/MsFirestoreModule.html" data-type="entity-link" >MsFirestoreModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-MsFirestoreModule-f11691c5f753d1c89fa3f5b614bf5561ec084f4070a4e20415990d7d73cbf3aaed1b8b470600ca37b32ace89c24fb7a23e1279fbf9897f2ed77b4e4736f3d7b3"'
              : 'data-bs-target="#xs-controllers-links-module-MsFirestoreModule-f11691c5f753d1c89fa3f5b614bf5561ec084f4070a4e20415990d7d73cbf3aaed1b8b470600ca37b32ace89c24fb7a23e1279fbf9897f2ed77b4e4736f3d7b3"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-MsFirestoreModule-f11691c5f753d1c89fa3f5b614bf5561ec084f4070a4e20415990d7d73cbf3aaed1b8b470600ca37b32ace89c24fb7a23e1279fbf9897f2ed77b4e4736f3d7b3"'
              : 'id="xs-controllers-links-module-MsFirestoreModule-f11691c5f753d1c89fa3f5b614bf5561ec084f4070a4e20415990d7d73cbf3aaed1b8b470600ca37b32ace89c24fb7a23e1279fbf9897f2ed77b4e4736f3d7b3"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/MsFirestoreController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MsFirestoreController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/MsProjectAppModule.html" data-type="entity-link" >MsProjectAppModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-MsProjectAppModule-858fe9097680104b6f8686ffde4908f3f95312b95930b8c2eaf3c9783c78c498102e77f0d217eed0a5f5bc79c3f5307c33d73bcff1e30288c2025402f1e04386"'
              : 'data-bs-target="#xs-controllers-links-module-MsProjectAppModule-858fe9097680104b6f8686ffde4908f3f95312b95930b8c2eaf3c9783c78c498102e77f0d217eed0a5f5bc79c3f5307c33d73bcff1e30288c2025402f1e04386"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-MsProjectAppModule-858fe9097680104b6f8686ffde4908f3f95312b95930b8c2eaf3c9783c78c498102e77f0d217eed0a5f5bc79c3f5307c33d73bcff1e30288c2025402f1e04386"'
              : 'id="xs-controllers-links-module-MsProjectAppModule-858fe9097680104b6f8686ffde4908f3f95312b95930b8c2eaf3c9783c78c498102e77f0d217eed0a5f5bc79c3f5307c33d73bcff1e30288c2025402f1e04386"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/MsProjectAppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MsProjectAppController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/MsProjectFirestoreModule.html" data-type="entity-link" >MsProjectFirestoreModule</a>\n                            </li>\n                            <li class="link">\n                                <a href="modules/MsProjectFirestoreRuleModule.html" data-type="entity-link" >MsProjectFirestoreRuleModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-MsProjectFirestoreRuleModule-40cf2900072eec5e7dbd921552cfca6daac6e2ea9bc91f38c79760e494a59d2b790e68033ecdf074f452d904fb720b4339a02bc130664dd8afe8a0ac1a1606f3"'
              : 'data-bs-target="#xs-controllers-links-module-MsProjectFirestoreRuleModule-40cf2900072eec5e7dbd921552cfca6daac6e2ea9bc91f38c79760e494a59d2b790e68033ecdf074f452d904fb720b4339a02bc130664dd8afe8a0ac1a1606f3"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-MsProjectFirestoreRuleModule-40cf2900072eec5e7dbd921552cfca6daac6e2ea9bc91f38c79760e494a59d2b790e68033ecdf074f452d904fb720b4339a02bc130664dd8afe8a0ac1a1606f3"'
              : 'id="xs-controllers-links-module-MsProjectFirestoreRuleModule-40cf2900072eec5e7dbd921552cfca6daac6e2ea9bc91f38c79760e494a59d2b790e68033ecdf074f452d904fb720b4339a02bc130664dd8afe8a0ac1a1606f3"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/MsProjectFirestoreRuleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MsProjectFirestoreRuleController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/MsProjectModule.html" data-type="entity-link" >MsProjectModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-MsProjectModule-4ff23920ece8ed10657784fc46cf4fe754cca8422ed61e70c2d97fe04ef1f14b099b6a6a589aee9d3d491e02621a11b36e0223db6ad97eb5484763159f70c662"'
              : 'data-bs-target="#xs-controllers-links-module-MsProjectModule-4ff23920ece8ed10657784fc46cf4fe754cca8422ed61e70c2d97fe04ef1f14b099b6a6a589aee9d3d491e02621a11b36e0223db6ad97eb5484763159f70c662"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-MsProjectModule-4ff23920ece8ed10657784fc46cf4fe754cca8422ed61e70c2d97fe04ef1f14b099b6a6a589aee9d3d491e02621a11b36e0223db6ad97eb5484763159f70c662"'
              : 'id="xs-controllers-links-module-MsProjectModule-4ff23920ece8ed10657784fc46cf4fe754cca8422ed61e70c2d97fe04ef1f14b099b6a6a589aee9d3d491e02621a11b36e0223db6ad97eb5484763159f70c662"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/MsProjectController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MsProjectController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/MsUserModule.html" data-type="entity-link" >MsUserModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-MsUserModule-c61e8664e44bb225d6cbb0922392601b526d6a29943242e743a7a8fabdd5a9c4705267f584cbaba50f142ca44d6c63cba924c087ac29d5a052725dfe1208eaf4"'
              : 'data-bs-target="#xs-controllers-links-module-MsUserModule-c61e8664e44bb225d6cbb0922392601b526d6a29943242e743a7a8fabdd5a9c4705267f584cbaba50f142ca44d6c63cba924c087ac29d5a052725dfe1208eaf4"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-MsUserModule-c61e8664e44bb225d6cbb0922392601b526d6a29943242e743a7a8fabdd5a9c4705267f584cbaba50f142ca44d6c63cba924c087ac29d5a052725dfe1208eaf4"'
              : 'id="xs-controllers-links-module-MsUserModule-c61e8664e44bb225d6cbb0922392601b526d6a29943242e743a7a8fabdd5a9c4705267f584cbaba50f142ca44d6c63cba924c087ac29d5a052725dfe1208eaf4"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/MsUserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MsUserController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/MsWebsdkAuthModule.html" data-type="entity-link" >MsWebsdkAuthModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-MsWebsdkAuthModule-8cdef59125b703d525d25944bf21dcbacfe40bc3b8b054509dffd45cb8fa534c24d369f42df13df0b20b3963e96fc12c402042e58555fcb16bd70cb03e6afa0c"'
              : 'data-bs-target="#xs-controllers-links-module-MsWebsdkAuthModule-8cdef59125b703d525d25944bf21dcbacfe40bc3b8b054509dffd45cb8fa534c24d369f42df13df0b20b3963e96fc12c402042e58555fcb16bd70cb03e6afa0c"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-MsWebsdkAuthModule-8cdef59125b703d525d25944bf21dcbacfe40bc3b8b054509dffd45cb8fa534c24d369f42df13df0b20b3963e96fc12c402042e58555fcb16bd70cb03e6afa0c"'
              : 'id="xs-controllers-links-module-MsWebsdkAuthModule-8cdef59125b703d525d25944bf21dcbacfe40bc3b8b054509dffd45cb8fa534c24d369f42df13df0b20b3963e96fc12c402042e58555fcb16bd70cb03e6afa0c"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/MsWebsdkAuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MsWebsdkAuthController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/MsWebsdkFirestoreModule.html" data-type="entity-link" >MsWebsdkFirestoreModule</a>\n                                    <li class="chapter inner">\n                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#controllers-links-module-MsWebsdkFirestoreModule-892383118dd6f7895e8711cf331062e8e0de4db83c82714577478377b0ead3a7399db197b267f1d94aebe9f4cbbfdf19a57d0e7d52334f1a77924868b0c6b871"'
              : 'data-bs-target="#xs-controllers-links-module-MsWebsdkFirestoreModule-892383118dd6f7895e8711cf331062e8e0de4db83c82714577478377b0ead3a7399db197b267f1d94aebe9f4cbbfdf19a57d0e7d52334f1a77924868b0c6b871"',
            '>\n                                            <span class="icon ion-md-swap"></span>\n                                            <span>Controllers</span>\n                                            <span class="icon ion-ios-arrow-down"></span>\n                                        </div>\n                                        <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="controllers-links-module-MsWebsdkFirestoreModule-892383118dd6f7895e8711cf331062e8e0de4db83c82714577478377b0ead3a7399db197b267f1d94aebe9f4cbbfdf19a57d0e7d52334f1a77924868b0c6b871"'
              : 'id="xs-controllers-links-module-MsWebsdkFirestoreModule-892383118dd6f7895e8711cf331062e8e0de4db83c82714577478377b0ead3a7399db197b267f1d94aebe9f4cbbfdf19a57d0e7d52334f1a77924868b0c6b871"',
            '>\n                                            <li class="link">\n                                                <a href="controllers/MsWebsdkFirestoreController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MsWebsdkFirestoreController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/MsWebsdkModule.html" data-type="entity-link" >MsWebsdkModule</a>\n                            </li>\n                            <li class="link">\n                                <a href="modules/ProjectAppModule.html" data-type="entity-link" >ProjectAppModule</a>\n                                <li class="chapter inner">\n                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#injectables-links-module-ProjectAppModule-5dc65f3d9ab33e42917a0ac00eeb4cd14ca0d39dc603a3907199a2841a1a0e6c7f972c0846461b7926e89243f2e9846ee931cd09f280ff477ca77515e5eb4c01"'
              : 'data-bs-target="#xs-injectables-links-module-ProjectAppModule-5dc65f3d9ab33e42917a0ac00eeb4cd14ca0d39dc603a3907199a2841a1a0e6c7f972c0846461b7926e89243f2e9846ee931cd09f280ff477ca77515e5eb4c01"',
            '>\n                                        <span class="icon ion-md-arrow-round-down"></span>\n                                        <span>Injectables</span>\n                                        <span class="icon ion-ios-arrow-down"></span>\n                                    </div>\n                                    <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="injectables-links-module-ProjectAppModule-5dc65f3d9ab33e42917a0ac00eeb4cd14ca0d39dc603a3907199a2841a1a0e6c7f972c0846461b7926e89243f2e9846ee931cd09f280ff477ca77515e5eb4c01"'
              : 'id="xs-injectables-links-module-ProjectAppModule-5dc65f3d9ab33e42917a0ac00eeb4cd14ca0d39dc603a3907199a2841a1a0e6c7f972c0846461b7926e89243f2e9846ee931cd09f280ff477ca77515e5eb4c01"',
            '>\n                                        <li class="link">\n                                            <a href="injectables/HashService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HashService</a>\n                                        </li>\n                                        <li class="link">\n                                            <a href="injectables/ProjectAppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectAppService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/ProjectModule.html" data-type="entity-link" >ProjectModule</a>\n                                <li class="chapter inner">\n                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#injectables-links-module-ProjectModule-4b971bc2bf666dbc35be2756e0b3ae5fc9f9e3ee8bbc99cf4412bc1e05033fabc96929ef9070e66c5ad6e4b4240450898d2dc03bd39b5d2e6ff037910292e61d"'
              : 'data-bs-target="#xs-injectables-links-module-ProjectModule-4b971bc2bf666dbc35be2756e0b3ae5fc9f9e3ee8bbc99cf4412bc1e05033fabc96929ef9070e66c5ad6e4b4240450898d2dc03bd39b5d2e6ff037910292e61d"',
            '>\n                                        <span class="icon ion-md-arrow-round-down"></span>\n                                        <span>Injectables</span>\n                                        <span class="icon ion-ios-arrow-down"></span>\n                                    </div>\n                                    <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="injectables-links-module-ProjectModule-4b971bc2bf666dbc35be2756e0b3ae5fc9f9e3ee8bbc99cf4412bc1e05033fabc96929ef9070e66c5ad6e4b4240450898d2dc03bd39b5d2e6ff037910292e61d"'
              : 'id="xs-injectables-links-module-ProjectModule-4b971bc2bf666dbc35be2756e0b3ae5fc9f9e3ee8bbc99cf4412bc1e05033fabc96929ef9070e66c5ad6e4b4240450898d2dc03bd39b5d2e6ff037910292e61d"',
            '>\n                                        <li class="link">\n                                            <a href="injectables/ProjectService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/ServiceModule.html" data-type="entity-link" >ServiceModule</a>\n                            </li>\n                            <li class="link">\n                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>\n                                <li class="chapter inner">\n                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#injectables-links-module-UserModule-b067bf82334f2eff8cca13a0b570df478a998b0666fda61ecc281448f58966b1e51261b4232a5f93b18462b7b4797d1471470da2cc8d37f16816aedb8a16c706"'
              : 'data-bs-target="#xs-injectables-links-module-UserModule-b067bf82334f2eff8cca13a0b570df478a998b0666fda61ecc281448f58966b1e51261b4232a5f93b18462b7b4797d1471470da2cc8d37f16816aedb8a16c706"',
            '>\n                                        <span class="icon ion-md-arrow-round-down"></span>\n                                        <span>Injectables</span>\n                                        <span class="icon ion-ios-arrow-down"></span>\n                                    </div>\n                                    <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="injectables-links-module-UserModule-b067bf82334f2eff8cca13a0b570df478a998b0666fda61ecc281448f58966b1e51261b4232a5f93b18462b7b4797d1471470da2cc8d37f16816aedb8a16c706"'
              : 'id="xs-injectables-links-module-UserModule-b067bf82334f2eff8cca13a0b570df478a998b0666fda61ecc281448f58966b1e51261b4232a5f93b18462b7b4797d1471470da2cc8d37f16816aedb8a16c706"',
            '>\n                                        <li class="link">\n                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/WebSDKAuthModule.html" data-type="entity-link" >WebSDKAuthModule</a>\n                                <li class="chapter inner">\n                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#injectables-links-module-WebSDKAuthModule-db0118b97b288930b0a29997254651de850c6ee4df77378d8dc39a468607f2602054abbdd60b3abfbd29f972cc39c16c3ea554119b652441207d9a451f9b1578"'
              : 'data-bs-target="#xs-injectables-links-module-WebSDKAuthModule-db0118b97b288930b0a29997254651de850c6ee4df77378d8dc39a468607f2602054abbdd60b3abfbd29f972cc39c16c3ea554119b652441207d9a451f9b1578"',
            '>\n                                        <span class="icon ion-md-arrow-round-down"></span>\n                                        <span>Injectables</span>\n                                        <span class="icon ion-ios-arrow-down"></span>\n                                    </div>\n                                    <ul class="links collapse" ',
          )
          .concat(
            isNormalMode
              ? 'id="injectables-links-module-WebSDKAuthModule-db0118b97b288930b0a29997254651de850c6ee4df77378d8dc39a468607f2602054abbdd60b3abfbd29f972cc39c16c3ea554119b652441207d9a451f9b1578"'
              : 'id="xs-injectables-links-module-WebSDKAuthModule-db0118b97b288930b0a29997254651de850c6ee4df77378d8dc39a468607f2602054abbdd60b3abfbd29f972cc39c16c3ea554119b652441207d9a451f9b1578"',
            '>\n                                        <li class="link">\n                                            <a href="injectables/WebSDKAuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WebSDKAuthService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class="link">\n                                <a href="modules/WebsdkModule.html" data-type="entity-link" >WebsdkModule</a>\n                            </li>\n                </ul>\n                </li>\n                    <li class="chapter">\n                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#classes-links"'
              : 'data-bs-target="#xs-classes-links"',
            '>\n                            <span class="icon ion-ios-paper"></span>\n                            <span>Classes</span>\n                            <span class="icon ion-ios-arrow-down"></span>\n                        </div>\n                        <ul class="links collapse " ',
          )
          .concat(
            isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"',
            '>\n                            <li class="link">\n                                <a href="classes/AuditEntity.html" data-type="entity-link" >AuditEntity</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/BadRequestAlertException.html" data-type="entity-link" >BadRequestAlertException</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/BadResponse.html" data-type="entity-link" >BadResponse</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/BaseService.html" data-type="entity-link" >BaseService</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/Error.html" data-type="entity-link" >Error</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/Errors.html" data-type="entity-link" >Errors</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/FirestoreDynamicSchema.html" data-type="entity-link" >FirestoreDynamicSchema</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/FirestoreSchemaField.html" data-type="entity-link" >FirestoreSchemaField</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/GatewayController.html" data-type="entity-link" >GatewayController</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/GlobalFilter.html" data-type="entity-link" >GlobalFilter</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/GoodResponse.html" data-type="entity-link" >GoodResponse</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/Project.html" data-type="entity-link" >Project</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/ProjectApp.html" data-type="entity-link" >ProjectApp</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/RawRule.html" data-type="entity-link" >RawRule</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/RuleCondition.html" data-type="entity-link" >RuleCondition</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/User.html" data-type="entity-link" >User</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/WebSDKUser.html" data-type="entity-link" >WebSDKUser</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class="chapter">\n                            <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#injectables-links"'
              : 'data-bs-target="#xs-injectables-links"',
            '>\n                                <span class="icon ion-md-arrow-round-down"></span>\n                                <span>Injectables</span>\n                                <span class="icon ion-ios-arrow-down"></span>\n                            </div>\n                            <ul class="links collapse " ',
          )
          .concat(
            isNormalMode
              ? 'id="injectables-links"'
              : 'id="xs-injectables-links"',
            '>\n                                <li class="link">\n                                    <a href="injectables/ExceptionInterceptor.html" data-type="entity-link" >ExceptionInterceptor</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/HttpInterceptor.html" data-type="entity-link" >HttpInterceptor</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class="chapter">\n                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#guards-links"'
              : 'data-bs-target="#xs-guards-links"',
            '>\n                            <span class="icon ion-ios-lock"></span>\n                            <span>Guards</span>\n                            <span class="icon ion-ios-arrow-down"></span>\n                        </div>\n                        <ul class="links collapse " ',
          )
          .concat(
            isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"',
            '>\n                            <li class="link">\n                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class="chapter">\n                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#interfaces-links"'
              : 'data-bs-target="#xs-interfaces-links"',
            '>\n                            <span class="icon ion-md-information-circle-outline"></span>\n                            <span>Interfaces</span>\n                            <span class="icon ion-ios-arrow-down"></span>\n                        </div>\n                        <ul class="links collapse " ',
          )
          .concat(
            isNormalMode
              ? ' id="interfaces-links"'
              : 'id="xs-interfaces-links"',
            '>\n                            <li class="link">\n                                <a href="interfaces/AllProjectAppReqPayload.html" data-type="entity-link" >AllProjectAppReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/CreateFirestoreRecordReqPayload.html" data-type="entity-link" >CreateFirestoreRecordReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/CreateProjectAppReqDto.html" data-type="entity-link" >CreateProjectAppReqDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/CreateProjectAppReqPayload.html" data-type="entity-link" >CreateProjectAppReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/DeleteProjectAppReqPayload.html" data-type="entity-link" >DeleteProjectAppReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GetAllRuleConditionTypesReqPayload.html" data-type="entity-link" >GetAllRuleConditionTypesReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GetAllRuleTypesReqPayload.html" data-type="entity-link" >GetAllRuleTypesReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GetProjectAppReqPayload.html" data-type="entity-link" >GetProjectAppReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GetProjectAppSecretReqPayload.html" data-type="entity-link" >GetProjectAppSecretReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GetProjectByIdReqPayload.html" data-type="entity-link" >GetProjectByIdReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GwCreateProjectFirestoreRuleReqDto.html" data-type="entity-link" >GwCreateProjectFirestoreRuleReqDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GwProjectFirestoreRuleConditionDto.html" data-type="entity-link" >GwProjectFirestoreRuleConditionDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GwProjectFirestoreRuleDto.html" data-type="entity-link" >GwProjectFirestoreRuleDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GwUpdateProjectFirestoreRuleReqDto.html" data-type="entity-link" >GwUpdateProjectFirestoreRuleReqDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GwWebSDKAuthLogInDto.html" data-type="entity-link" >GwWebSDKAuthLogInDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GwWebSDKAuthRegisterDto.html" data-type="entity-link" >GwWebSDKAuthRegisterDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/GwWebSDKAuthReqDto.html" data-type="entity-link" >GwWebSDKAuthReqDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/JWTPayload.html" data-type="entity-link" >JWTPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/LogInByEmailAndPassword.html" data-type="entity-link" >LogInByEmailAndPassword</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/LogInByRefreshToken.html" data-type="entity-link" >LogInByRefreshToken</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/LogInResponseDto.html" data-type="entity-link" >LogInResponseDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsCreateProjectFirestoreRuleReqPayload.html" data-type="entity-link" >MsCreateProjectFirestoreRuleReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsDeleteProjectFirestoreRuleReqPayload.html" data-type="entity-link" >MsDeleteProjectFirestoreRuleReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsGetAllProjectFirestoreRulesReqPayload.html" data-type="entity-link" >MsGetAllProjectFirestoreRulesReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsGetProjectFirestoreRuleReqPayload.html" data-type="entity-link" >MsGetProjectFirestoreRuleReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MSGetProjectFirestoreRuleResPayload.html" data-type="entity-link" >MSGetProjectFirestoreRuleResPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsProjectFirestoreRule.html" data-type="entity-link" >MsProjectFirestoreRule</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsProjectFirestoreRuleCondition.html" data-type="entity-link" >MsProjectFirestoreRuleCondition</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsUpdateProjectFirestoreRuleReqPayload.html" data-type="entity-link" >MsUpdateProjectFirestoreRuleReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsWebSDKAuthLogInReqPayload.html" data-type="entity-link" >MsWebSDKAuthLogInReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsWebSDKAuthRegisterReqPayload.html" data-type="entity-link" >MsWebSDKAuthRegisterReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsWebSDKAuthReqPayload.html" data-type="entity-link" >MsWebSDKAuthReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsWebSDKFirestoreDeleteByIdReqPayload.html" data-type="entity-link" >MsWebSDKFirestoreDeleteByIdReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsWebSDKFirestoreFindByIdReqPayload.html" data-type="entity-link" >MsWebSDKFirestoreFindByIdReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsWebSDKFirestoreQuerySchemaReqPayload.html" data-type="entity-link" >MsWebSDKFirestoreQuerySchemaReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsWebSDKFirestoreStoreSchemaReqPayload.html" data-type="entity-link" >MsWebSDKFirestoreStoreSchemaReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MsWebSDKFirestoreUpdateReqPayload.html" data-type="entity-link" >MsWebSDKFirestoreUpdateReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/NewProjectDto.html" data-type="entity-link" >NewProjectDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/NewProjectReqPayload.html" data-type="entity-link" >NewProjectReqPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/RegisterByEmailAndPasswordDto.html" data-type="entity-link" >RegisterByEmailAndPasswordDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/RegisterResponseDto.html" data-type="entity-link" >RegisterResponseDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/ResponseDto.html" data-type="entity-link" >ResponseDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/SDKAuthResDto.html" data-type="entity-link" >SDKAuthResDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/SDKEndUserAuthResDto.html" data-type="entity-link" >SDKEndUserAuthResDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/SDKJwtPayload.html" data-type="entity-link" >SDKJwtPayload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/ServiceResponse.html" data-type="entity-link" >ServiceResponse</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/UpdateProjectAppReqDto.html" data-type="entity-link" >UpdateProjectAppReqDto</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/UpdateProjectAppReqPayload.html" data-type="entity-link" >UpdateProjectAppReqPayload</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class="chapter">\n                        <div class="simple menu-toggler" data-bs-toggle="collapse" ',
          )
          .concat(
            isNormalMode
              ? 'data-bs-target="#miscellaneous-links"'
              : 'data-bs-target="#xs-miscellaneous-links"',
            '>\n                            <span class="icon ion-ios-cube"></span>\n                            <span>Miscellaneous</span>\n                            <span class="icon ion-ios-arrow-down"></span>\n                        </div>\n                        <ul class="links collapse " ',
          )
          .concat(
            isNormalMode
              ? 'id="miscellaneous-links"'
              : 'id="xs-miscellaneous-links"',
            '>\n                            <li class="link">\n                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>\n                            </li>\n                            <li class="link">\n                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>\n                            </li>\n                            <li class="link">\n                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>\n                            </li>\n                            <li class="link">\n                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class="chapter">\n                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>\n                    </li>\n                    <li class="divider"></li>\n                    <li class="copyright">\n                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">\n                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">\n                        </a>\n                    </li>\n            </ul>\n        </nav>\n        ',
          ),
      );
      this.innerHTML = tp.strings;
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement)));