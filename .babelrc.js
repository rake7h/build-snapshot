module.exports = {
	plugins: [],
	presets: [
		[
			'@babel/preset-env',
			{
				bugfixes: true,
				loose: true,
			},
		],
		'@babel/preset-typescript',
	],
	env: {
		test: {
			plugins: ["@babel/plugin-transform-runtime"]
		}
	}
}
