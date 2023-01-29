/*
 * note that some of the tasks defined here may not be used in EVERY project
 * I build.
 */

module.exports = function( grunt ) {
	'use strict';

	var pkg = grunt.file.readJSON( 'package.json' );

	// Project configuration.
	grunt.initConfig( {
		pkg: pkg,

		// cleanup
		clean: {
			build: [
				'<%= pkg.name %>', '<%= pkg.name %>.zip', 'assets/**/*.min.*', 'assets/css/**/*-rtl.css'
			],
			release: [
				'<%= pkg.name %>'
			],
		},

		// minify JS files
		uglify: {
			build: {
				files: [
					{
						expand: true,
						src: [
							'assets/js/**/*.js',
							'!assets/js/**/*.min.js',
						],
						dest: '.',
						ext: '.min.js',
					}
				],
			},
		},

		// create RTL CSS files
		rtlcss: {
			options: {
				// borrowed from Core's Gruntfile.js, with a few mods
				// 1. reformated (e.g., [\n\t{ -> [ {, etc)
				// 2. dashicon content strings changed from '"\\f140"'
				//    to "'\\f140'", etc
				opts: {
					clean: false,
					processUrls: {
						atrule: true,
						decl: false,
					},
					stringMap: [
						{
							name: 'import-rtl-stylesheet',
							priority: 10,
							exclusive: true,
							search: ['.css'],
							replace: ['-rtl.css'],
							options: {
								scope: 'url',
								ignoreCase: false
							},
						},
					],
				},
				// @todo grunt-rtlcss appears to require leading tabs in order for the
				//       "plugin" to find the appropriate lines for change.  Look into
				//       whether there is a config option to change that, in case
				//       assets/css/wphelpkiticons.css gets committed with spaces.
				plugins: [
					{
						name: 'swap-dashicons-left-right-arrows',
						priority: 10,
						directives: {
							control: {},
							value: []
						},
						processors: [
							{
								expr: /content/im,
								action: function( prop, value ) {
									if ( value === "'\\f141'" ) { // dashicons-arrow-left
										value = "'\\f139'";
									}
									else if ( value === "'\\f340'" ) { // dashicons-arrow-left-alt
										value = "'\\f344'";
									}
									else if ( value === "'\\f341'" ) { // dashicons-arrow-left-alt2
										value = "'\\f345'";
									}
									else if ( value === "'\\f139'" ) { // dashicons-arrow-right
										value = "'\\f141'";
									}
									else if ( value === "'\\f344'" ) { // dashicons-arrow-right-alt
										value = "'\\f340'";
									}
									else if ( value === "'\\f345'" ) { // dashicons-arrow-right-alt2
										value = "'\\f341'";
									}

									return {
										prop: prop,
										value: value
									};
								},
							}
						],
					}
				],
			},
			build: {
				files: [
					{
						expand: true,
						src: [
							'assets/css/**/*.css',
							'!assets/css/**/*-rtl.css', '!assets/css/**/*.min.css',
							],
						dest: '.',
						ext: '-rtl.css',
					}
				],
			},
		},

		// SASS pre-process CSS files
		sass: {
			options: {
				style: 'expanded',
			},
			build: {
				files: [
					{
						expand: true,
						src: [
							'assets/css/**/*.scss'
						],
						dest: '.',
						ext: '.css',
					}
				],
			},
		},

		// minify CSS files
		cssmin: {
			build: {
				files: [
					{
						expand: true,
						src: [
							'assets/css/**/*.css',
							'!assets/css/**/*.min.css',
						],
						dest: '.',
						ext: '.min.css',
					}
				],
			},
		},

		// copy files from one place to another.
		copy: {
			release: {
				expand: true,
				src: [
					'plugin.php', 'readme.txt', 'assets/**',
					'includes/**', 'admin/**','utils/**',
					'vendor/composer/**', 'vendor/autoload.php',

					'!assets/css/**/*.scss',
					'!vendor/composer/installed.sv'
				],
				dest: '<%= pkg.name %>',
			},
			composer_require: {
				expand: true,
				src: get_dependencies( grunt.file.readJSON( 'composer.json' ), 'composer' ),
				dest: '<%= pkg.name %>',
			},
			npm_dependencies: {
				expand: true,
				src: get_dependencies( pkg, 'npm' ),
				dest: '<%= pkg.name %>',
			},
		},
		
		// package into a zip
		zip: {
			release: {
				expand: true,
				cwd: '.',
				src: '<%= pkg.name %>/**',
				dest: '<%= pkg.name %>.<%= pkg.version %>.zip',
			},
		},

		// do string search/replace on various files, based on values in package.json.
		replace: {
			// replace strings in readme.txt
			readme: {
				src: 'readme.txt',
				overwrite: true,
				replacements: [
					{
						from: /^=== (.*) ===/m,
						to: '=== <%= pkg.plugin_name %> ==='
					},
					{
						from: /^(Contributors:) (.*)/m,
						to: '$1 <%= pkg.contribs %>',
					},
					{
						from: /^(Tags:) (.*)/m,
						to: '$1 <%= pkg.tags %>',
					},
					{
						from: /^(Requires at least:) (.*)/m,
						to: '$1 <%= pkg.requires_at_least %>',
					},
					{
						from: /^(Requires PHP:) (.*)/m,
						to: '$1 <%= pkg.requires_php %>',
					},
					{
						from: /^(Tested up to:) (.*)/m,
						to: '$1 <%= pkg.tested_up_to %>',
					},
					{
						from: /^(Stable tag:) (.*)/m,
						to: '$1 <%= pkg.version %>',
					},
					{
						from: /^(License:) (.*)/m,
						to: '$1 <%= pkg.license %>',
					},
					{
						from: /^(License URI:) (.*)/m,
						to: '$1 <%= pkg.license_uri %>',
					},
					{
						from: /^(Donate [lL]ink:) (.*)/m,
						to: '$1 <%= pkg.donate_link %>',
					},
					{
						// for this regex to work the readme.txt file MUST have
						// unix line endings (Windows won't work).
						// note the look ahead. Also, the repeat on the
						// newline char class MUST be {2,2}, using just {2} always
						// fails.
						from: /.*(?=[\n\r]{2,2}== Description ==)/m,
						to: '<%= pkg.description %>',
					},
				],
			},
			// replace strings in plugin.php
			plugin: {
				src: 'plugin.php',
				overwrite: true,
				replacements: [
					{
						from: /^(\s*\*\s*Plugin Name:\s*)(.*)/m,
						to: '$1<%= pkg.plugin_name %>',
					},
					{
						from: /^(\s*\*\s*Description:\s*)(.*)/m,
						to: '$1<%= pkg.description %>',
					},
					{
						from: /^(\s*\* Version:\s*)(.*)/mg,
						to: '$1<%= pkg.version %>',
					},
					{
						from: /^(.*const VERSION =) '(.*)'/m,
						to: "$1 '<%= pkg.version %>'",
					},
					{
						from: /^(\s*\*\s*Text Domain:\s*)(.*)/m,
						to: '$1<%= pkg.name %>',
					},
					{
						from: /^(\s*\*\s*Requires at least:\s*)(.*)/m,
						to: '$1<%= pkg.requires_at_least %>',
					},
					{
						from: /^(\s*\*\s*Requires PHP:\s*)(.*)/m,
						to: '$1<%= pkg.requires_php %>',
					},
					{
						from: /^(\s*\*\s*Plugin URI:\s*)(.*)/m,
						to: '$1<%= pkg.repository %>/<%= pkg.name %>',
					},
					// this is for the github_plugin_uri comment
					{
						from: /^(\s*\*\s*GitHub Plugin URI:\s&)(.*)/m,
						to: '$1<%= pkg.repository %>/<%= pkg.name %>',
					},
					{
						from: /^(\s*\*\s*License:\s*)(.*)/m,
						to: '$1<%= pkg.license %>',
					},
					{
						from: /^(\s*\*\s*License URI:\s*)(.*)/m,
						to: '$1<%= pkg.license_uri %>',
					},
					{
						from: /^(\s*\*\s*Donate [lL]ink:\s*)(.*)/m,
						to: '$1<%= pkg.donate_link %>',
					},
				],
			},
			// set the PHP namesapce
			namespace: {
				src: [
					'plugin.php', 'uninstall.php', 'includes/**/*.php',
					'vendor/shc/**/*.php',
				],
				overwrite: true,
				replacements: [
					{
						from: /^namespace (.*);$/m,
						to: 'namespace <%= pkg.namespace %>;',
					}
				],
			},
			// set the @pacakge tag in the file-level DocBlocks of PHP files.
			package: {
				src: [
					'plugin.php', 'uninstall.php', 'includes/**/*.php',
					'vendor/shc/**/*.php',
				],
				overwrite: true,
				replacements: [
					{
						from: /^(\s*\*\s*@package\s+)(.*)/m,
						to: '$1<%= pkg.name %>',
					}
				],
			},
			// set the version in any block.json files.
            version_block_json:{
				src: ['includes/blocks/**/block.json'],
				overwrite: true,
				replacements: [
					{
						from: /^(\s*"version":\s*")(.*)",/mg,
						to: '$1<%= pkg.version %>",',
					}
				]
			},
			// set the version in any *asset.php files (for blocks).
            version_block_asset:{
				src: ['includes/blocks/**/*.asset.php'],
				overwrite: true,
				replacements: [
					{
						from: /^(\s*'version'\s*=>\s*)'(.*)',/mg,
						to: "$1'<%= pkg.version %>',",
					}
				]
			},
			plugin_name_phpunit: {
				src: ['phpunit.xml.dist'],
				overwrite: true,
				replacements: [
					{
						from: /^(\s*<const name='PLUGIN_TEST_NAME' value=')([^']+)(' \/>)/m,
						to: '$1<%= pkg.name %>$3',
					},
				],
			},
			// set the name in composer.json.
            composer_name: {
                src: ['composer.json'],
                overwrite: true,
                replacements: [
                	// this is for "name" : "plugin-name"
                    {
                        from: /^(\s*"name"\s*:\s*")(.*)"/m,
                        to: '$1shc/<%= pkg.name %>"',
                    },
                ],
            },
		},

		// lint JS.
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			release: {
				src: [
					'assets/**/*.js',

					'!assets/**/*.min.js'
				]
			},
			build: {
				src: [
					'Gruntfile.js',
				],
			},
		},

		// watch for mods to certain files and fire appropriate tasks
		// when they change
		// note: I do NOT use this vary often
		watch: {
			css: {
				files: [
					'assets/css/**/*.scss'
				],
				tasks: ['sass'],
				options: {
					spawn: false,
				},
			},
			js: {
				files: [
					'assets/js/**/*.js',
					'!assets/js/**/*.min.js'
				],
				tasks: ['jshint'],
				options: {
					spawn: false,
				},
			},
		},

		// Create README.md for GitHub.
		wp_readme_to_markdown: {
			options: {
				screenshot_url: '.org-repo-assets/{screenshot}.png?raw=true',
			},
			dest: {
				files: {
					'README.md': 'readme.txt'
				},
			},
		},

		// Run shell commands.
		shell: {
			options: {
				execOptions: {
					// prepend 'vendor/bin' to the PATH environment variable,
					// to ensure we get our copy of the commands, in any of them
					// are also installed globally.
					env: { 'PATH': ( 'win32' === process.platform ? '.\\vendor\\bin\\' : './vendor/bin/' ).concat( ';', process.env.PATH ) },
				}, 
			},
			phpcs: {
				command: 'phpcs',
			},
			phpcbf: { 
				command: 'phpcbf',
			},
			phpunit: {
				command: 'phpunit' + ( grunt.option( 'group' ) ? ' --group ' + grunt.option( 'group' ) : '' ),
			},
			phpunit_ms: {
				command: 'phpunit -c tests/phpunit/multisite.xml' + ( grunt.option( 'group' ) ? ' --group ' + grunt.option( 'group' ) : '' ),
			},
		},
	} );

	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-composer' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
//	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-text-replace' );
	grunt.loadNpmTasks( 'grunt-rtlcss' );
	grunt.loadNpmTasks( 'grunt-shell' );
	grunt.loadNpmTasks( 'grunt-wp-readme-to-markdown' );
	grunt.loadNpmTasks( 'grunt-zip' );

	// finally, register our tasks.
	grunt.registerTask( 'default', [ 'build' ] );
	grunt.registerTask( 'build', [ 'clean', 'autoload', 'uglify', /*'sass',*/ 'rtlcss', 'cssmin' ] );

	grunt.registerTask( 'precommit', [ /*'phpunit', 'phpunit_ms',*/ 'phpcs', 'jshint:release' ] );
	// build and package everything up into a ZIP suitable for installing on a WP site.
	grunt.registerTask(
		'package',
		[
			'build', 'precommit',
			'readme', 'replace',
			// make sure that autoloads for dev dependencies aren't included.'
			'stash_composer_installed', 'autoload-release',
			'copy', 'zip:release', 'clean:release',
			// rebuild autoloads with dev dependencies.'
			'restore_composer_installed', 'autoload',
		]
	);

	grunt.registerTask( 'phpcs', [ 'shell:phpcs' ] );
	grunt.registerTask( 'phpcbf', [ 'shell:phpcbf' ] );
	grunt.registerTask( 'phpunit', [ 'shell:phpunit' ] );
	grunt.registerTask( 'phpunit_ms', [ 'shell:phpunit_ms' ] );

	// this task is normally only run early in the project, when I haven't
	// yet decided on what namespace I want to use :-)
	grunt.registerTask( 'namespace', [ 'replace:namespace' ] );
	// run this task whenevr a new class class is added
	// (or the name of an existing one is changed
	grunt.registerTask( 'autoload', [ 'composer:dump-autoload' ] );
	grunt.registerTask( 'autoload-release', [ 'composer:dump-autoload:classmap-authoritative' ] );
	// regenerate the readme(s).
	grunt.registerTask( 'readme', ['replace:readme', 'wp_readme_to_markdown'] );

	// see the "release" task for where this task is used.
	// note that this is NOT general purpose and won't work IF our plugin has required
	// dependencies that use composer's autoloader.
	grunt.registerTask(
		'stash_composer_installed',
		'Stash composer\'s installed.json so that the output of composer dump:autoload will only contain our classes.',
		function() {
			if ( grunt.file.exists( 'vendor/composer/installed.json' ) ) {
				grunt.file.copy( 'vendor/composer/installed.json', 'vendor/composer/installed.sv' );
				grunt.file.delete( 'vendor/composer/installed.json' );
				grunt.log.writeln( 'installed.json stashed' );
			}
		}
	);
	// see the "release" task for where this task is used.
	grunt.registerTask(
		'restore_composer_installed',
		'Restore composer\'s installed.json, after stash_composer_installed was run.',
		function() {
			if ( grunt.file.exists( 'vendor/composer/installed.sv' ) ) {
				grunt.file.copy( 'vendor/composer/installed.sv', 'vendor/composer/installed.json' );
				grunt.file.delete( 'vendor/composer/installed.sv' );
				grunt.log.writeln( 'installed.json restored' );
			}
		}
	);
};

/**
 * Extract dependencies from {package,composer}.json, e.g. for use in a 'src:' property of a task.
 *
 * @since 0.1.0
 *
 * @param {object} json The parsed json file.
 * @param {string} which Whether thejson is for npm or composer.
 * @returns array
 *
 * @link https://stackoverflow.com/a/34629499/7751811
 */
function get_dependencies( json, which ) {
	'use strict';

	var prop, dir;

	switch ( which ) {
		case 'npm':
			prop = 'dependencies';
			dir  = 'node_modules';

			break;
		case 'composer':
			prop = 'require';
			dir  = 'vendor';

			break;
	}

	if ( ! json.hasOwnProperty( prop ) ) {
		return [];
	}

	return Object.keys( json[ prop ] ).map(
		function( val ) {
			return dir + '/' + val + '/**';
		}
	);
}
