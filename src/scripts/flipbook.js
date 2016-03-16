/*
 * Flipbook Class
 * @param {DOM node} el - the element to make a flipbook.
 */
export class Flipbook {
	constructor( el ) {
		this._el = el;
		this._currentPage = 0;
		this._pages = Array.prototype.slice.apply( this._el.querySelectorAll( '.flipbook__page' ) );
		this._pageCount = this._pages.length - 1;
		this._transitionDuration = 1000;
		this._clips = [ 'clip-right' , 'clip-left' ];
		this._flipInProgress = false;

		this._pages[this._currentPage].classList.add( 'current' );
	}
};

const proto = Flipbook.prototype;


/*
 * Moves the flipbook to a specific page number.
 * @param {integer} pageNum - The zero-based pagenumber to navigate to.
 */
proto.flipToPage = function( pageNum ) {
	// Bail out if we're trying to go to the same page, or one that doesn't exist, or if we're already in the middle of flipping:
	if( pageNum < 0 || pageNum > this._pageCount || pageNum == this._currentPage || this._flipInProgress ) {
		return false;
	}

	// Get the flip direction:
	// 0 = backwards, 1 = forwards.
	const direction = pageNum < this._currentPage ? 0 : 1;
	const pageFrom = this._pages[this._currentPage];
	const pageTo = this._pages[pageNum];
	const flipDirection = direction ? 'flipping-forward' : 'flipping-backward';

	// Output the container:
	const flipPage = this._createFlipPage( pageFrom, pageTo, direction );
	this._el.insertBefore( flipPage, this._el.firstChild );

	// Add the flipping class:
	setTimeout( function() {
		flipPage.classList.add( flipDirection );
	}, 1 );

	// Clean up After ourselves:
	this._flipInProgress = true;
	setTimeout( function() {
		this._el.removeChild( flipPage );
		this._flipInProgress = false;
		this._setCurrentPage( pageNum );
		this._removeClipClasses();
	}.bind( this ), this._transitionDuration );

	return true;
};


/*
 * Creates the page we use to mimick flipping the book.
 * @param {DOM node} pageFrom - The page we're currently on.
 * @param {DOM node} pageTo - The page we want to go to.
 * @param {integer} direction - 0 = backwards, 1 = forwards.
 */
proto._createFlipPage = function( pageFrom, pageTo, direction ) {
	// Clone the nodes:
	const pageFromClone = pageFrom.cloneNode( true );
	const pageToClone = pageTo.cloneNode( true );

	const clipDirection = this._clips[direction];
	const oppClipDirection = direction ? this._clips[0] : this._clips[1];

	// Create the container:
	const flipPage = document.createElement( 'div' );
	flipPage.classList.add( 'flipPage' );

	// Clipping classes:
	pageFromClone.classList.add( clipDirection );
	pageToClone.classList.add( oppClipDirection );
	pageToClone.classList.add( 'back' );
	pageFrom.classList.add( oppClipDirection );
	pageTo.classList.add( 'to' );

	// Put the stuff in the container:
	flipPage.appendChild( pageFromClone );
	flipPage.appendChild( pageToClone );

	return flipPage;
};


/*
 * Sets the current page, adding and removing classes as appropriate.
 * @param {integer} pageNum - The zero-based pagenumber to set.
 */
proto._setCurrentPage = function( pageNum ) {
	this._currentPage = pageNum;
	const currentPageNode = document.querySelector( '.flipbook__page.current' );
	const toPageNode = document.querySelector( '.flipbook__page.to' );
	const newCurrentPageNode = this._pages[this._currentPage];


	// Remove old classes:
	currentPageNode.classList.remove( 'current' );
	toPageNode.classList.remove( 'to' );

	// Add new classes:
	newCurrentPageNode.classList.add( 'current' );
};


/* Removes classes used during the flip animation that are no longer needed. */
proto._removeClipClasses = function() {
	this._pages.forEach( ( page ) => {
		page.classList.remove( 'clip-right' );
		page.classList.remove( 'clip-left' );
	});
};
