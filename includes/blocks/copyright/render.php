<?php
/**
 * Render template for shc/copyright-block.
 *
 * @since 0.9.0
 *
 * @var string[] $attributes The block attributes.
 * @var string   $content    The block content (inner blocks).
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

$content = str_replace( '${COPYRIGHT_YEARS}', $copyright_years, $content );

echo wp_kses_post( $content );

return;
