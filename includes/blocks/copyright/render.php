<?php
/**
 * Render template for shc/copyright-block.
 *
 * @since 0.9.0
 *
 * @var string[] $attributes The block attributes.
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

$classes = array(
	'wp-block-shc-copyright',
	$attributes['align'] ? "has-text-align-{$attributes['align']}" : '',
	! empty( $attributes['className'] ) ? $attributes['className'] : '',
);

?>

<div class='<?php echo esc_attr( implode( ' ', array_filter( $classes ) ) ); ?>'>
	&copy;
	<span class='copyright-years'><?php echo esc_html( $copyright_years ); ?></span>
	<div class='copyright-statement'><?php echo wp_kses_post( $attributes['copyrightStatement'] ); ?></div>
</div>
