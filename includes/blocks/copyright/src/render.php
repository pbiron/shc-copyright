<?php
/**
 * Render template for the shc-copyright/copyright block.
 *
 * @since 0.9.1
 *
 * The following global variables are in scope when this template is loaded:
 *
 * @var array<string,int> $attributes    The block attributes.
 * @var WP_Block          $block         The parsed block
 * @var string            $content       The block content (inner blocks).
 * @var string            $template_path The path to this file.
 *
 * @package shc-copyright
 */

$launch_year  = $attributes['launchYear'];
$current_year = (int) wp_date( 'Y' );

if ( ! $launch_year || $launch_year === $current_year ) {
	$copyright_years = $current_year;
} else {
	$copyright_years = "{$launch_year}&ndash;{$current_year}";
}

$content = str_replace( 'SHC_COPYRIGHT_YEARS_VALUE', (string) $copyright_years, $content );

echo wp_kses_post( $content );
