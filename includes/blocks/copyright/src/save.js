import { RichText, useBlockProps }	from '@wordpress/block-editor';
import { __ }						from '@wordpress/i18n';
import { decodeEntities }			from '@wordpress/html-entities';

export default function Save( { attributes } ) {
	const { copyrightStatement, align } = attributes;

	const blockProps = useBlockProps.save(
		{
			key: 'block',
			className: align ? 'has-text-align-' + align : '',
		}
	);
	
	return (			
		<div { ...blockProps }>
			{ decodeEntities( '&copy;&nbsp;' ) }
			<span className='copyright-years'>SHC_COPYRIGHT_YEARS_VALUE</span>
			<RichText.Content
				tagName='div'
				className='copyright-statement'
				value={ copyrightStatement }
			/>
		</div>
	);
}
