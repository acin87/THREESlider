import { defineConfig } from 'vite';

export default defineConfig({
	
	build: {
		outDir: './dist',
		assetsDir: '', 
		assetsInlineLimit: 0,
		rollupOptions: {
	
			output: {
				entryFileNames: 'assets/js/[name]-[hash].js',
				chunkFileNames: 'assets/js/[name]-[hash].js',
				assetFileNames: (assetInfo) => {
					
					let extType = assetInfo.name.split('.')[1];
					if (/\.(png|jpe?g|gif|svg|webp|webm|mp3)$/.test(extType)) {
						extType = 'img';
					}
					return `assets/${extType}/[name]-[hash][extname]`;
				}
			}
		}
	}
});