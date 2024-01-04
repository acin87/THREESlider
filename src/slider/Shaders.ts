const GlichShaders = {
	vertexShader: `
		precision mediump float;
		precision mediump int;

		attribute vec4 color;
		
		varying vec3 vPosition;
		varying vec4 vColor;
		varying vec2 vUv;
		
		void main()	{
			vUv = uv;
			vPosition = position;
			vColor = color;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0);
		}
	`,
	fragmentShader: `
		precision mediump float;
		precision mediump int;

		uniform int invert;
		uniform float blend;
		uniform sampler2D tex1;
      	uniform sampler2D tex2;

  		varying vec2 vUv;

		float displaceAmount = 0.5;
  
		void main()	{
			// invert blend;
			float blend2 = 1.-blend;
			
			vec4 image1 = texture2D(tex1, vUv);
			vec4 image2 = texture2D(tex2, vUv);

			float t1 = ((image2.x*displaceAmount)*blend)*2.;//start image speed vector, example replace *2. to /10.
			float t2 = ((image1.x*displaceAmount)*blend2)*2.;//end image speed vector, example /10.0
			
			vec4 imageA = texture2D(tex2, vec2(vUv.x-t1, vUv.y))*blend2; // vUv.x-t1, vUv.x+t2 - horizontal animation,
			vec4 imageB = texture2D(tex1, vec2(vUv.x+t2, vUv.y))*blend;  // vUv.y-t1, vUv.y+t2 - vertical animation

			//invert animation
			if(invert == 1){
				imageA = texture2D(tex2, vec2(vUv.x+t1, vUv.y))*blend2;	// vUv.x-t1, vUv.x+t2 - horizontal animation,
				imageB = texture2D(tex1, vec2(vUv.x-t2, vUv.y))*blend;	// vUv.y-t1, vUv.y+t2 - vertical animation
			}

			gl_FragColor = imageA.bbra * blend + imageA * blend2 + imageB.bbra * blend2 + imageB * blend;
			
		}
	`
};
export default GlichShaders;