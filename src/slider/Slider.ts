
import * as THREE from 'three';
import GlichShaders from './Shaders';
import { Controls } from './Controls';
import { SliderOption } from './Options.interface';

const root = './public';
const files = 'ABCDEFGHIJ';//CDEFGHIJKLMNOPQRSTUVWXYZ
const ext = 'png';

const CANVAS_STYLE = 'ThreeSlider';


class Slider {
	
	public canvas: HTMLCanvasElement;
	private scene: THREE.Scene;
	private camera: THREE.PerspectiveCamera;
	private mesh: THREE.Mesh;
	private geometry: THREE.PlaneGeometry;
	private material: THREE.ShaderMaterial;
	private renderer: THREE.WebGLRenderer;
	private textures: THREE.Texture [];
	private scrollPerImage: number;
	public controls: Controls;

	private dotsContainer: HTMLDivElement | undefined;
	public options: SliderOption;

	private currentTextures: number;
	private nextTextures: number;

	private updated: boolean;
	
	
	constructor(canvas: HTMLCanvasElement, options?: SliderOption){

		this.options = new Object();
		this.initOptions(options);
	
		this.canvas = canvas;
		this.canvas.className = CANVAS_STYLE;
		
		this.updated = true;

		//Load textures
		this.textures = this.loadTextures();

		this.currentTextures = 0;
		this.nextTextures = 0;

		//inti Controls
		this.controls = new Controls(canvas, this.options, this.textures.length);
		this.dotsContainer = this.controls.dotsContainer;


		if(this.options.dots){
			this.createDotsListener();
		}

		this.scrollPerImage = 500;
		//init THREE.js framework
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas
		});
		this.scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			45,
			this.canvas.clientWidth / this.canvas.clientWidth,
			0.1,
			2000);
		camera.position.set(0, 0, 10);
		
		this.camera = camera;
				
		this.scene.add(camera);
		this.geometry = new THREE.PlaneGeometry(22, 9, 4, 4);
		this.material = this.createMaterial();
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(this.mesh);
		
	}
	private initOptions(options?: SliderOption){
		this.options.dots = false;
		this.options.loop = true;
		this.options.arrow = false;
		if (options != undefined) {	
			this.options = Object.assign(this.options, options);
		}
	}

	private createMaterial(){
		const material = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 1.0 },
				blend: { value: 0.0 },
				tex1: { value: this.textures[1] },
				tex2: { value: this.textures[0] },
				invert: { value: 0 }
			},
			vertexShader: GlichShaders.vertexShader,
			fragmentShader: GlichShaders.fragmentShader
		});
		return material;
	}


	private setBlend(value: number){
		this.material.uniforms.blend.value = Math.abs(value);
		if(value > 0.99 || value < -0.99 )
		{
			this.material.uniforms.blend.value = 1;
		}
	}

	private loadTextures() {
		const loader = new THREE.TextureLoader;
		const textureArray = [];
		
		for (let i = 0; i < files.length; i++) {
			const texture = loader.load(`${root}/${files[i]}.${ext}`);
			texture.name =  `${i}`;
			textureArray.push (texture);
		}
		return textureArray;
	}

	createDotsListener(){
		if(this.dotsContainer != undefined){
			const dot = this.dotsContainer.children;
			for (let i = 0; i <  this.dotsContainer.childElementCount; i++){
				dot[i].addEventListener('click', (e)=>{
					e.preventDefault();
					const id = Number(dot[i].getAttribute('id'));
					
					this.controls.actions = 2;
					if(this.currentTextures != id){
						this.nextTextures = id;
					}
					this.updateTextures();
					this.currentTextures = this.nextTextures;
					if(this.currentTextures > id){
						this.material.uniforms.invert.value = 0;
						this.controls.acceleration += 8;
					}else{
						this.material.uniforms.invert.value = 1;
						this.controls.acceleration -= 8;
					}
					
				});
			}
		}
	}
	updateTextures(){
		this.material.uniforms.tex1.value = this.textures[this.nextTextures];
		this.material.uniforms.tex2.value = this.textures[this.currentTextures];
	}

	init(){
		this.renderer.setAnimationLoop(()=>{
			this.controls.update();
			if(this.controls.position != 0){
				if(Math.abs(this.controls.position) == 7.2 && this.currentTextures <= this.textures.length - 1 ){
					const direction = this.controls.direction;
					const actions = this.controls.actions;
					
					switch (actions) {
						case 1:
							if(direction > 0){
								if(this.currentTextures == this.textures.length - 1){
									if(!this.options.loop){
										this.updated = false;
									}
									else{
										this.nextTextures = 0;
									}
								}
								else{
									this.nextTextures += 1;
									this.updated = true;
								}
								this.material.uniforms.invert.value = 0;
							}
							else{
								
								if(this.currentTextures == 0){
									if(!this.options.loop){
										this.updated = false;
									}
									else{
										this.nextTextures = this.textures.length - 1;
									}
								}
								else{
									this.nextTextures -= 1;
									this.updated = true;
								}
								this.material.uniforms.invert.value = 1;
							}
							
							if(this.updated){
								this.updateTextures();
							}
							this.currentTextures = this.nextTextures;
							break;
					
						default:
							break;
					}
					
					
				}

				this.controls.updateDotsPosions(this.currentTextures);
				if(this.updated){
					this.setBlend((this.controls.position % this.scrollPerImage) / (this.scrollPerImage));
				}
			}

			this.renderer.render(this.scene,this.camera);
			if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
				this.renderer.setPixelRatio(window.devicePixelRatio);
				this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
				this.camera.aspect = this.canvas.clientWidth /  this.canvas.clientHeight;
				this.camera.updateProjectionMatrix();
			}
		});
	}
	getDots(){
		
	}
}
export {Slider};