import Matter from 'matter-js';
 
class Fireworks {
	// Number of particles per explosion
	MIN_PARTICLES = 70;
	MAX_PARTICLES = 150;
 
	particles = {}; // Store for active fireworks
	particleCount = 0;
	particlesAdded = 0;
	colors = [
		['#FE601C','#EBDB14','#EB471F','#ED7A0E'], //Yellows, oranges, and reds
		['#F32F13','#F15B0A','#B0160D','#F03535'], //Reds
		['#3590F0','#13C2DA','#1262EF','#136583'], //Blues
		['#AC27D3','#D544FF','#FF44EE','#6132E1'], //Pinks and Purples
		['#32E16F','#209912','#19DE99','#34CFAC']  //Greens and mints
	];
 
	showStarted = false;
 
	/**
	 * Start the rendering engine with the provided canvas node
	 * @param {DOMNode} canvas Canvas object to render into
	 * @param {Object} options Matter.Render options
	 */
	constructor(canvas, options) {
		this.engine = Matter.Engine.create();
		this.runner = Matter.Runner.create();
		Matter.Runner.run(this.runner, this.engine);
 
		// Init canvas for physics rendering
		this.render = Matter.Render.create({
			canvas: canvas,
			engine: this.engine,
			options: Object.assign({
				width: window.innerWidth,
				height: window.innerHeight,
				background: 'transparent',
				wireframes: false,
				planetTrails: false,
			}, options || {})
		});
 
		// Scaling variables
		this.vw = this.render.options.width / 100;
		this.vh = this.render.options.height / 100;
 
		this.engine.world.gravity.y = this.vh * 0.05;
		Matter.Render.run(this.render);
	}
 
	/**
	 * Show an animated firework explosion on the canvas
	 * @param {Object} pos x, y position of initial explosion
	 * @param {Number} number Number of particles for the explosion
	 * @param {Object} vel Velocity of particles in x and y vectors
	 */
	explode(pos, number, colors) {
		number = number || 25;
		if(this.particleCount > number * 6) this.particleCount = 0;
 
		for(let i = 0; i < number; i++) {
			this.particleCount++;
			let name = 'particle' + this.particleCount;
			let size = Matter.Common.random(this.vw * 0.01, this.vw * 0.3);
			// Random choice of the color scheme
			let color = colors[Math.round(Matter.Common.random(0, colors.length - 1))];
 
			// Create a new particle, store in instance variable
			this.particles[name] = Matter.Bodies.circle(pos.x, pos.y, size, {
				isSensor: false,
				isParticle: true,
				mass: 0,
				frictionAir: 0.02,
				render: {
					fillStyle: color
				}
			});
 
			// Draw the particle to the screen
			Matter.World.add(this.engine.world, this.particles[name]);
			
			// Randomize velocity
			Matter.Body.setVelocity(this.particles[name], { 
				x: Matter.Common.random(this.vw * -1, this.vw), 
				y: Matter.Common.random(this.vw * -1, this.vw) 
			});
 
			// Slowly fade each particle
			const decreaseScale = () => {
				Matter.Body.scale(this.particles[name], 0.9, 0.9);
				if (this.particles[name].circleRadius > this.vw * 0.002) {
					requestAnimationFrame(decreaseScale);
				} else {
					Matter.Composite.remove(this.engine.world, this.particles[name]);
					delete this.particles[name];
				}
			};
			setTimeout(decreaseScale, Matter.Common.random(200, 600));
		}
	}
 
	startShow() {
		this.showStarted = true;
 
		this._fireContinuously();
	}
 
	endShow(){ 
		this.showStarted = false;
	}

	/**
	 * Fire a number of fireworks over a period of time
	 * @param {int} n Number of fireworks to fire
	 * @param {int} ms Duration in ms over which to fire 
	 */
	fire(n, ms) {
		for(let i = 0; i < n; i++) {
			setTimeout(() => {
				this.fireRandom();
			}, Matter.Common.random(0, ms));
		}
	}
 
	fireRandom() {
		// Coordinates between 10% and 90% of visible page
		var x = this.vw * Matter.Common.random(10, 90);
		var y = this.vh * Matter.Common.random(10, 90);
		// Number of particles for the explosion
		var numParticles = Math.round(Matter.Common.random(this.MIN_PARTICLES, this.MAX_PARTICLES));
		// Choice of colors for the explosion
		const colors = this.colors[Math.round(Matter.Common.random(0, this.colors.length - 1))];
		
		this.explode({ x, y }, numParticles, colors);
	}
 
	_fireContinuously() {
		this.fireRandom();
 
		setTimeout(() => {
			if(this.showStarted){
				this._fireContinuously();
			}
		}, Matter.Common.random(0, 3000));
	}
	
}

export default Fireworks;