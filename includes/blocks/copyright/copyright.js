( function( wp ) {
	'use strict';

	const {
		createElement,
	}                           = wp.element;
	const {
		registerBlockType,
	}                            = wp.blocks;
	const {
		PanelBody,
		TextControl,
	}                           = wp.components;
	const {
		AlignmentToolbar,
		BlockControls,
		InspectorControls,
		RichText,
		useBlockProps,
	}                           = wp.blockEditor;
	const {
		__,
	}                           = wp.i18n;
	const {
		decodeEntities,
	}                           = wp.htmlEntities;

	registerBlockType( 'shc/copyright', {
		icon: createElement(
			'svg',
			{
				xmlns: 'http://www.w3.org/2000/svg',
				viewBox: '0 0 367.467 367.467',
			},
			createElement(
				'g',
				{},
				createElement(
					'path',
					{
						d: 'M183.73,0.018C82.427,0.018,0,82.404,0,183.733c0,101.289,82.427,183.716,183.73,183.716 c101.315,0,183.737-82.427,183.737-183.716C367.467,82.404,285.045,0.018,183.73,0.018z M183.73,326.518 c-78.743,0-142.798-64.052-142.798-142.784c0-78.766,64.055-142.817,142.798-142.817c78.752,0,142.807,64.052,142.807,142.817 C326.536,262.466,262.481,326.518,183.73,326.518z',
					}
				),
				createElement(
					'path',
					{
						d: 'M244.036,217.014c-11.737,20.141-33.562,32.635-56.956,32.635c-36.329,0-65.921-29.585-65.921-65.915 c0-36.36,29.592-65.955,65.921-65.955c23.395,0,45.219,12.54,56.956,32.641l1.517,2.627h44.28l-2.658-7.129 c-7.705-20.413-21.225-37.769-39.122-50.157c-17.942-12.42-39.017-19.009-60.973-19.009c-58.981,0-106.946,48.006-106.946,106.982 c0,58.98,47.965,106.941,106.946,106.941c21.956,0,43.03-6.567,60.973-19.006c17.897-12.391,31.417-29.741,39.122-50.154 l2.658-7.133h-44.28L244.036,217.014z',
					}
				),
			),
		),

		edit( { attributes, isSelected, setAttributes } ) {
			const { launchYear, copyrightStatement, align } = attributes;

			const currentYear = new Date().getFullYear();

			const controls = [ isSelected && createElement(
				InspectorControls,
				{
					key: 'inspector'
				},
				createElement(
					PanelBody,
					{
						title: __( 'Settings', 'shc-copyright' )
					},
					createElement(
						TextControl,
						{
							label: __( 'Launch Year', 'shc-copyright' ),
							help: __( 'The year this site was launched.  If the launch year is the same as the current year, or if lanuch year is 0, then only the current year will display.', 'shc-copyright' ),
							type: 'number',
							min: 0,
							max: currentYear,
							value: launchYear,
							onChange: ( launchYear ) => {
								// insure 0 <= launchYear <= currentYear.
								launchYear = parseInt( launchYear );
								if ( 0 <= launchYear && launchYear <= currentYear ) {
									setAttributes( { launchYear: launchYear } );
								}
							},
						},
					),
				)
			) ];

 			const blockProps = useBlockProps(
				{
					key: 'block',
					className: align ? 'has-text-align-' + align : '',
				}
			);

			return [
				controls,
				createElement(
					'div',
					blockProps,
					createElement(
						BlockControls,
						{},
						createElement(
							AlignmentToolbar,
							{
								value: align,
								onChange: ( align ) => {
									setAttributes( { align: align } )
								}
							},
						),
					),
					decodeEntities( '&copy;' ) + ' ',
					createElement(
						'span',
						{
							className: 'copyright-years',
						},
						(
							launchYear === currentYear
							  	? currentYear
					  			: (
									launchYear
					  					? launchYear + decodeEntities( '&ndash;' ) + currentYear
					  					: currentYear
					  			  )
				  		 ) + ' ',
					),
					createElement(
						RichText,
						{
							tagName: 'div',
							className: 'copyright-statement',
							multiline: 'p',
							value: copyrightStatement,
							onChange: ( copyrightStatement ) => {
								setAttributes( { copyrightStatement: copyrightStatement } )
							},
							placeholder: __( 'Copyright statement', 'shc-copyright' ),
						},
					),
				)
			];
		},
		
		save( { attributes } ) {
			const { copyrightStatement, align } = attributes;
			const blockProps = useBlockProps.save(
				{
					key: 'block',
					className: align ? 'has-text-align-' + align : '',
				}
			);
			
			return (			
				createElement(
					'div',
					blockProps,
					decodeEntities( '&copy;&nbsp;' ),
					createElement(
						'span',
						{
							className: 'copyright-years',
						},
						'${COPYRIGHT_YEARS}'
					),
					decodeEntities( '&nbsp;' ),
					createElement(
						RichText.Content,
						{
							tagName: 'div',
							className: 'copyright-statement',
							value: copyrightStatement,
						}
					)
				)
			);
		}
	} );
} )( wp );
