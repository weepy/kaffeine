jQuery.fn.autoHeight = function( options )
{
	// default settings
	var defaults = {
			min: null,
			max: null,
			lines: 1,
			spacer: '<br>.'
		},
		// font-relevant styles to be inherited by mirror
		// Note: yes, these might need updating in the near future
		fontStyles = [
			'fontFamily', 
			'fontStyle', 
			'fontVariant', 
			'fontSize', 
			'fontWeight', 
			'wordSpacing', 
			'letterSpacing', 
			'textDecoration', 
			'textTransform', 
			'textIndent', 
			'lineHeight',
			'paddingTop',
			'paddingRight',
			'paddingBottom',
			'paddingLeft'
		];

	// operate on the first element only!
	var $this = this.eq(0),
		// get metadata-options if metadata-plugin is available
		meta = $this.metadata ? $this.metadata() : {};
	
	// make sure we don't accidentally import options that were not intended for us
	meta = meta.autoHeight ? meta.autoHeight : {};

	// merge defaults, metadata-options, argument-options
	var opts = jQuery.extend( {}, defaults, meta, options ),
		// append this to the content (to create empty trailing lines)
		spacer = '',
		// create mirror we can actually determine the height of
		$mirror = jQuery( '<p></p>' ).addClass( 'autoHeight' ).insertAfter( $this );
	
	// generate spacer
	for( var i=0; i < opts.lines; i++ )
		spacer += opts.spacer;
	
	// inherit width
	$mirror.width( $this.width() +'px' );
	
	// inherit font-relevant styles
	jQuery.each( fontStyles, function()
	{
		// somehow primitive strings are converted to object?
		var style = this + "";
		$mirror.css( style, $this.css( style ) );
	});
	
	// Note: safari and opera had issues with
	// conditional definition of functions 
	// using the syntax function name(){ ... }
	// with anonymous functions these problems did not occur
	
	// don't do any unneccessary checks while handling events
	// if we can supply the best suited function, provide it!
	
	// no min/max bounds specified
	var mirrorHeight = function()
	{
		return $mirror.innerHeight();
	};
	
	// min and max bounds
	if( opts.min && opts.max )
	{
		var mirrorHeight = function()
		{
			var height = $mirror.innerHeight();
			// height must be within specified bounds
			return height < opts.min ? opts.min : ( height > opts.max ? opts.max : height );
			
			// Note: maybe there's a micro-optimization hole here:
			// the probability of height being larger than max is larger than being lower than min
		};
	}
	
	// only max bound
	else if( opts.max )
	{
		var mirrorHeight = function()
		{
			var height = $mirror.innerHeight();
			// height must be within specified bounds
			return height > opts.max ? opts.max : height;
		};
	}
	
	// only min bound
	else if( opts.min )
	{
		var mirrorHeight = function()
		{
			var height = $mirror.innerHeight();
			// height must be within specified bounds
			return height < opts.min ? opts.min : height;
		};
	}
	
	function keyListener( e )
	{
		// abort on arrow-keys
		if( e.which >= 37 && e.which <=40 )
			return;
			
		// abort on shift, cmd, etc.
		if( e.which >= 16 && e.which <= 18 )
			return;
		
		// copy content of textarea over to mirror
		// transform plain-text to html - "white-space:pre-wrap" would be nice, but probably not supported by every browser out there
		// Internet Explorer needs <BR> wheras browsers need <br>
		$mirror.html( $this.val()
			.replace( /&/g, '&amp;' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' )
			.replace( /\n/g, jQuery.browser.msie ? '<BR>' : '<br>' )
			.replace( /\s{2}/g, ' &nbsp;' ) 
			+ spacer );

		// set height
		$this.height( mirrorHeight() +'px' );
		
		// animate() causes cursor to be move to the end of the <textarea>
		// maybe I'll look for a workaround (someday next year...:)
		// var h = mirrorHeight();
		// if( h != $this.height() )
		//	$this.animate( { 'height': h+'px' }, 300 )
	}

	// bind and run autoHeight for the first time			
	$this.bind( 'autoheight', keyListener ).trigger( 'autoheight' );
	

	
};



