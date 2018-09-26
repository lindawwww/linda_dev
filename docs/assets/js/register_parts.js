const t = TrelloPowerUp.iframe();
const Promise = window.TrelloPowerUp.Promise;

// グローバル変数の引き継ぎ
window.env = t.arg( 'env' );
window.TrelloBoards = t.arg( 'boards' );
// TrelloBoards and env is necessary
if( !window.env ) throw new Error( "window.env is undefined" );
if( !window.TrelloBoards ) throw new Error( "window.TrelloBoards is undefined" );


const partsBoard = TrelloBoards.Parts;

(function () {
	//making pulldown
	Trello.get( `/boards/${partsBoard.id}/lists` )
	.then( function( partsCategories ) {
		for( let partsCategory of partsCategories ) {
			console.log( partsCategory );
			// display each option
			let $elm = $( '<option>', { value: partsCategory.id, text: partsCategory.name } );
			$( '#parts_category_selector' ).append( $elm );
		}
	})
	.catch( function( errorMsg ) {
		console.log( errorMsg );
	});
})();

const informAdd = function(){
	document.getElementById("time_hidden").style.display = "";
	document.getElementById("tmp").style.display = "none";
	setTimeout(function(){
		document.getElementById("time_hidden").style.display = "none";
		document.getElementById("tmp").style.display = "";
	},3000);
}

const addParts = function( name, artisan, price, idList ) {
	// Insert new cards into appointed idList of the board.
	Trello.post( '/cards', {
		name  : name,
		idList: idList
	} )
	.then( function( newParts ) {
		console.log( 'successfully create a part' );
		console.log( newParts );

		// get the entire customFields
		Trello.get( `/boards/${partsBoard.id}/customFields` )
		.then( function( customFields ) {
			console.log("Hi from the function to get customFields");
			const artisanCustomFieldId = customFields[ 0 ].id;
			const priceCustomFieldId = customFields[ 1 ].id;

			Trello.put( `/card/${newParts.id}/customField/${artisanCustomFieldId}/item`, {
				value: { text: artisan }
			} )
			.then( res => console.log( res ) );
			Trello.put( `/card/${newParts.id}/customField/${priceCustomFieldId}/item`, {
				value: { number: price }
			} )
			.then( res => console.log( res ) );
			// Attach the parts card onto this card
			t.attach( {
				name: name,
				url : newParts.url
			} );
			// Attach the productCard onto partsCard
			attachProductCardOntoPartsCard( 'Parent Card', newParts.id );
			document.getElementById('parts_content').reset();
		} )
		.catch( function( errorMsg ) {
			console.log( errorMsg );
		} );
	} )
}

const attachProductCardOntoPartsCard = function( name, newPartsCardId ) {
	t.card( 'url' )
	.then( function( productCard ) {
		Trello.post( `cards/${newPartsCardId}/attachments`, {
			name: name,
			url : productCard.url
		}, function( successMsg ) {
			console.log( 'successfully attach parent card onto a parts card' );
			console.log( successMsg );
		}, function( errorMsg ) {
			console.log( errorMsg );
		} );
	} );
}

window.parts_content.addEventListener('submit', function(event){
	event.preventDefault();
	const partsName = window.parts_title_input.value || '新しい素材';
	const partsArtisan = window.parts_artisan_input.value;
	let partsPrice = window.parts_price_input.value;
	addParts( partsName, partsArtisan, partsPrice, window.parts_category_selector.value );
	// informAdd();
});

window.complementation_btn.addEventListener("click", function(){
	t.closeModal();
});
