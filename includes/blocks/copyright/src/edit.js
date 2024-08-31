import { PanelBody, TextControl }                                                      from '@wordpress/components';
import { AlignmentToolbar, BlockControls, InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { __ }                                                                          from '@wordpress/i18n';
import { decodeEntities }                                                              from '@wordpress/html-entities';

import './editor.scss';

export default function Edit( { attributes, isSelected, setAttributes } ) {
		const { launchYear, copyrightStatement, align } = attributes;

		const currentYear = new Date().getFullYear();

		const controls = [
			<InspectorControls key='inspector'>
				<PanelBody
						title={ __( 'Settings', 'shc-copyright' ) }>
					<TextControl
						label= { __( 'Launch Year', 'shc-copyright' ) }
						help= { __( 'The year this site was launched.  If the launch year is the same as the current year, or if lanuch year is 0, then only the current year will display.', 'shc-copyright' ) }
						type='number'
						min={ 0 }
						max={ currentYear }
						value= { launchYear }
						onChange={ ( launchYear ) => {
							// insure 0 <= launchYear <= currentYear.
							launchYear = parseInt( launchYear );
							if ( 0 <= launchYear && launchYear <= currentYear ) {
								setAttributes( { launchYear: launchYear } );
							}
						} }
					/>
				</PanelBody>
			</InspectorControls>
		];

 		const blockProps = useBlockProps(
			{
				key: 'block',
				className: align ? 'has-text-align-' + align : '',
			}
		);

		return [
			isSelected && controls,
			<div { ...blockProps }>
				<BlockControls>
					<AlignmentToolbar
						value={ align }
						onChange={ ( align ) => { setAttributes( { align: align } ) } }
					/>
				</BlockControls>
				{ decodeEntities( '&copy;&nbsp;' ) }
				<span className='copyright-years'>
					{
						launchYear === currentYear
							? currentYear
				  			: launchYear ? launchYear + decodeEntities( '&ndash;' ) + currentYear : currentYear
				  	}
				</span>
				<RichText
					tagName= 'div'
					className='copyright-statement'
					multiline='p'
					value={ copyrightStatement }
					onChange= { ( copyrightStatement ) => { setAttributes( { copyrightStatement: copyrightStatement } ) } }
					placeholder={ __( 'Copyright statement', 'shc-copyright' ) }
				/>
			</div>
		];
}
