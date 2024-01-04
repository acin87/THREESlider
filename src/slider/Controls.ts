import { SliderOption } from './Options.interface';

const MOUSE_WHEEL_EVENT = 'wheel';
const MOUSE_CLICK_EVENT = 'click';
// const TOUCH_MOVE = 'touchmove';
// const TOUCH_END = 'touchend';
const MOUSE_DOWN = 'mousedown';
const MOUSE_UP = 'mouseup';
const MOUSE_MOVE = 'mousemove';
class Controls{

	direction: number;
	acceleration: number;
	position: number;
	speed: number;
	maxSpeed: number;
	dampen: number;
	canvas: HTMLCanvasElement;
	dots: boolean | undefined;
	positionPerImage: number;
	imageArrayLenght: number;
	dotsContainer: HTMLDivElement | undefined;
	actions: number; // 1 - wheel, 2 - dots
	onAction: boolean;
	mouseDown: boolean;
	
	
	constructor(canvas: HTMLCanvasElement, options: SliderOption, imageCount: number){

		this.direction = 0;
		this.acceleration = 0;
		this.speed = 8;
		this.position = 0;
		this.maxSpeed = 500;
		this.dampen = 0.9;
		this.canvas = canvas;
		this.dots = options.dots;
		this.positionPerImage = 0;
		this.imageArrayLenght = imageCount;
		this.actions = 0;
		this.onAction = true;
		this.mouseDown = false;

	
		
		
		canvas.addEventListener(MOUSE_WHEEL_EVENT, (e) => {
			this.actions = 1;
			this.direction = Math.sign(e.deltaY);
			if(this.onAction){
				this.acceleration = Math.sign(e.deltaY)*this.speed;
			}
		});

		canvas.addEventListener(MOUSE_DOWN, (e)=>{
			e.preventDefault();
			this.mouseDown = true;
		});
		
		canvas.addEventListener(MOUSE_MOVE, (e)=>{
			if(this.mouseDown){
				if (e.movementX > 0 && e.movementY == 0) {
					this.direction = 1;
				} else if (e.movementX < 0 && e.movementY == 0) {
					this.direction = -1;
				}
				this.actions = 1;
				this.acceleration = 8;
			}
		});
		
		canvas.addEventListener(MOUSE_UP, (e) => {
			e.preventDefault();
			this.mouseDown = false;
		});

		if(options.autoLoop){

			options.loop = true;
			let delay = 4000;
			if(options.autoLoop.delay){
				delay = options.autoLoop.delay;
			}
			setInterval(()=>{
				this.actions = 1;
				this.direction = 1;
				this.acceleration +=8;
			},delay);
		}
			
		if(options.arrow){
			this.initArrows();
		}
		if(options.dots){
			this.dotsContainer = this.createDotsContainer();
		}
	}

	initArrows(){

		const container = this.canvas.parentElement;
		const nav = document.createElement('div');
		const prev_arrow = document.createElement('label');
		const next_arrow = document.createElement('label');
		nav.className = 'nav';
		prev_arrow.className = 'prev';
		next_arrow.className = 'next';
		
		nav?.appendChild(prev_arrow);
		nav?.appendChild(next_arrow);
		container?.appendChild(nav);
		
		next_arrow?.addEventListener(MOUSE_CLICK_EVENT, (e)=>{
			e.preventDefault();
			this.acceleration -=8;
			this.actions = 1;
			this.direction = 1;
		});

		prev_arrow?.addEventListener(MOUSE_CLICK_EVENT, (e)=>{
			e.preventDefault();
			this.acceleration +=8;
			this.actions = 1;
			this.direction = -1;
		});
	}

	update(){
		if(this.acceleration != 0 && this.position < this.maxSpeed){
			this.onAction = false;
			this.position += this.dampen * this.acceleration;
			
			if(this.position > this.maxSpeed || this.position < -this.maxSpeed){
				this.position = 0;
				this.acceleration = 0;
				this.onAction = true;
			}
		}
	}

	createDotsContainer(){
		const container = this.canvas.parentElement;
		const dotsContainer = document.createElement('div');
		dotsContainer.className = 'nav-dots';
		for (let i = 0; i < this.imageArrayLenght; i++) {
			const icon = document.createElement('label');
			icon.className = 'nav-dot';
			icon.setAttribute('id', `${i}`);
			if(i == 0){
				icon.classList.add('nav-dot-selected');
			}
			
			dotsContainer.appendChild(icon);
		}
		container?.appendChild(dotsContainer);
		return dotsContainer;
	}

	updateDotsPosions(pos:number){
		if(this.dotsContainer != undefined){
			const dot = this.dotsContainer.children;
			for (let i = 0; i <  this.dotsContainer.childElementCount; i++) {
				dot[i].classList.remove('nav-dot-selected');
				if(pos == i){
					dot[i].classList.add('nav-dot-selected');
				}
			}	
		}
	}
}
export {Controls};