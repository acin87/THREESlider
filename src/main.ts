import { Slider } from './slider/Slider';

const body = document.querySelector('body');
const canvas = document.createElement('canvas');
const container = document.createElement('div');

container.appendChild(canvas);
const slider = new Slider(canvas,
	{
		dots: true,
		loop: true,
		arrow: true
		
	});


container.className = canvas.className +'-container';
body?.appendChild(container);
slider.init();