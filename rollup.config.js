import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy'

export default {
	input: 'src/index.ts',
	watch: true,
	output: {
		dir: 'dist',
		format: 'iife'
	},
	plugins: [nodeResolve(), typescript(), copy({
		targets: [
			{ src: 'src/index.html', dest: 'dist' },
			{ src: 'src/assets', dest: 'dist' },
			{ src: 'src/index.css', dest: 'dist' }
		]})
	]
};