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
			{ src: 'src/index.html', dest: 'docs' },
			{ src: 'src/assets', dest: 'docs' },
			{ src: 'src/index.css', dest: 'docs' }
		]})
	]
};