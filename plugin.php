<?php
/**
 * Plugin Name:       Copyright Block
 * Description:       Block that outputs copyright statement, with years
 * Version:           0.9.2
 * Author:            Paul V. Biron/Sparrow Hawk Computing
 * Plugin URI:        https://github.com/pbiron/shc-copyright
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       shc-copyright
 * Requires at least: 6.6
 * Requires PHP:      8.1
 *
 * @package           shc-copyright
 */

defined( 'ABSPATH' ) || die;

add_action( 'init', 'shc_copyright_init' );

/**
 * Perform initialization.
 *
 * @since 0.9.0
 *
 * @return void
 *
 * @action init
 */
function shc_copyright_init() {
	// register our block.
	register_block_type( __DIR__ . '/includes/blocks/copyright/build/block.json' );

	// load translations for our editor script.
	wp_set_script_translations( 'shc-copyright-editor-script', 'shc-copyright', plugin_dir_path( __FILE__ ) . 'languages' );

	return;
}
