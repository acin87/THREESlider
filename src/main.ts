import { Slider } from './slider/Slider';

const body = document.querySelector('body');
const canvas = document.createElement('canvas');



const slider = new Slider(canvas,
	{
		dots: true,
		loop: true,
		arrow: true
		
	});

const canvasContainer = slider.getCanvasContainer();
body?.appendChild(canvasContainer);
slider.init();