"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _matterJs = _interopRequireDefault(require("matter-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Fireworks =
/*#__PURE__*/
function () {
  // Number of particles per explosion
  // Store for active fireworks

  /**
   * Start the rendering engine with the provided canvas node
   * @param {DOMNode} canvas Canvas object to render into
   * @param {Object} options Matter.Render options
   */
  function Fireworks(canvas, options) {
    _classCallCheck(this, Fireworks);

    this.MIN_PARTICLES = 70;
    this.MAX_PARTICLES = 150;
    this.particles = {};
    this.particleCount = 0;
    this.particlesAdded = 0;
    this.colors = [['#FE601C', '#EBDB14', '#EB471F', '#ED7A0E'], //Yellows, oranges, and reds
    ['#F32F13', '#F15B0A', '#B0160D', '#F03535'], //Reds
    ['#3590F0', '#13C2DA', '#1262EF', '#136583'], //Blues
    ['#AC27D3', '#D544FF', '#FF44EE', '#6132E1'], //Pinks and Purples
    ['#32E16F', '#209912', '#19DE99', '#34CFAC'] //Greens and mints
    ];
    this.showStarted = false;
    this.engine = _matterJs["default"].Engine.create();
    this.runner = _matterJs["default"].Runner.create();

    _matterJs["default"].Runner.run(this.runner, this.engine); // Init canvas for physics rendering


    this.render = _matterJs["default"].Render.create({
      canvas: canvas,
      engine: this.engine,
      options: Object.assign({
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false,
        planetTrails: false
      }, options || {})
    }); // Scaling variables

    this.vw = this.render.options.width / 100;
    this.vh = this.render.options.height / 100;
    this.engine.world.gravity.y = this.vh * 0.05;

    _matterJs["default"].Render.run(this.render);
  }
  /**
   * Show an animated firework explosion on the canvas
   * @param {Object} pos x, y position of initial explosion
   * @param {Number} number Number of particles for the explosion
   * @param {Object} vel Velocity of particles in x and y vectors
   */


  _createClass(Fireworks, [{
    key: "explode",
    value: function explode(pos, number, colors) {
      var _this = this;

      number = number || 25;
      if (this.particleCount > number * 6) this.particleCount = 0;

      var _loop = function _loop(i) {
        _this.particleCount++;
        var name = 'particle' + _this.particleCount;

        var size = _matterJs["default"].Common.random(_this.vw * 0.01, _this.vw * 0.3); // Random choice of the color scheme


        var color = colors[Math.round(_matterJs["default"].Common.random(0, colors.length - 1))]; // Create a new particle, store in instance variable

        _this.particles[name] = _matterJs["default"].Bodies.circle(pos.x, pos.y, size, {
          isSensor: false,
          isParticle: true,
          mass: 0,
          frictionAir: 0.02,
          render: {
            fillStyle: color
          }
        }); // Draw the particle to the screen

        _matterJs["default"].World.add(_this.engine.world, _this.particles[name]); // Randomize velocity


        _matterJs["default"].Body.setVelocity(_this.particles[name], {
          x: _matterJs["default"].Common.random(_this.vw * -1, _this.vw),
          y: _matterJs["default"].Common.random(_this.vw * -1, _this.vw)
        }); // Slowly fade each particle


        var decreaseScale = function decreaseScale() {
          _matterJs["default"].Body.scale(_this.particles[name], 0.9, 0.9);

          if (_this.particles[name].circleRadius > _this.vw * 0.002) {
            requestAnimationFrame(decreaseScale);
          } else {
            _matterJs["default"].Composite.remove(_this.engine.world, _this.particles[name]);

            delete _this.particles[name];
          }
        };

        setTimeout(decreaseScale, _matterJs["default"].Common.random(200, 600));
      };

      for (var i = 0; i < number; i++) {
        _loop(i);
      }
    }
  }, {
    key: "startShow",
    value: function startShow() {
      this.showStarted = true;

      this._fireContinuously();
    }
  }, {
    key: "endShow",
    value: function endShow() {
      this.showStarted = false;
    }
    /**
     * Fire a number of fireworks over a period of time
     * @param {int} n Number of fireworks to fire
     * @param {int} ms Duration in ms over which to fire 
     */

  }, {
    key: "fire",
    value: function fire(n, ms) {
      var _this2 = this;

      for (var i = 0; i < n; i++) {
        setTimeout(function () {
          _this2.fireRandom();
        }, _matterJs["default"].Common.random(0, ms));
      }
    }
  }, {
    key: "fireRandom",
    value: function fireRandom() {
      // Coordinates between 10% and 90% of visible page
      var x = this.vw * _matterJs["default"].Common.random(10, 90);

      var y = this.vh * _matterJs["default"].Common.random(10, 90); // Number of particles for the explosion


      var numParticles = Math.round(_matterJs["default"].Common.random(this.MIN_PARTICLES, this.MAX_PARTICLES)); // Choice of colors for the explosion

      var colors = this.colors[Math.round(_matterJs["default"].Common.random(0, this.colors.length - 1))];
      this.explode({
        x: x,
        y: y
      }, numParticles, colors);
    }
  }, {
    key: "_fireContinuously",
    value: function _fireContinuously() {
      var _this3 = this;

      this.fireRandom();
      setTimeout(function () {
        if (_this3.showStarted) {
          _this3._fireContinuously();
        }
      }, _matterJs["default"].Common.random(0, 3000));
    }
  }]);

  return Fireworks;
}();

var _default = Fireworks;
exports["default"] = _default;