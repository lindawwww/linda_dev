const t = TrelloPowerUp.iframe();
const Promise = window.TrelloPowerUp.Promise;

// グローバル変数の引き継ぎ
window.env = t.arg( 'env' );
window.TrelloBoards = t.arg( 'boards' );
// TrelloBoards and env is necessary
if( !window.env ) throw new Error( "window.env is undefined" );
if( !window.TrelloBoards ) throw new Error( "window.TrelloBoards is undefined" );


//https://developers.trello.com/v1.0/docs/clientjs
// 素材ボードの取得
// APIエンドポイントの一覧：https://developers.trello.com/v1.0/reference#lists
// Client.js(実際の使い方)：https://api.trello.com/1/boards/id/lists
const partsBoard = TrelloBoards.Parts;


//動的に作成
//making pulldown
Trello.get( `/boards/${partsBoard.id}/lists` )
//partsCategories received above lists
.then( function( partsCategories ) {
	//expand partsCategories as partsCategory and display these by pulldown
	for( let partsCategory of partsCategories ) {
		console.log( partsCategory );
		// display each option
		let $elm = $( '<option>', { value: partsCategory.id, text: partsCategory.name } );
		$( '#parts_category_selector' ).append( $elm );
	}
} )
.catch( function( errorMsg ) {
	console.log( errorMsg );
} );

const addParts = function( name, artisan, price, idList ) {
	// Insert new cards into appointed idList of the board.
	Trello.post( '/cards', {
		name  : name, // Setting up the name of card
		//    desc: t.getContext().card,
		idList: idList // Into appointed idList
	} )
	// "newPart" is the object now just created
	.then( function( newParts ) {
		console.log( 'successfully create a part' );
		console.log( newParts );

		// get the entire customFields
		Trello.get( `/boards/${partsBoard.id}/customFields` )
		.then( function( customFields ) {
			console.log("Hi from the function to get customFields");

			const artisanCustomFieldId = customFields[ 0 ].id;
			const priceCustomFieldId = customFields[ 1 ].id;

			// register each customField
			// artisan
			Trello.put( `/card/${newParts.id}/customField/${artisanCustomFieldId}/item`, {
				value: { text: artisan }
			} )
			.then( res => console.log( res ) );
			// price
			Trello.put( `/card/${newParts.id}/customField/${priceCustomFieldId}/item`, {
				value: { number: price }
			} )
			.then( res => console.log( res ) );

			// Attach the parts card onto the product card
			t.attach( {
				name: name, // optional
				url : newParts.url // required
			} );
			// Attach the productCard onto partsCard
			attachProductCardOntoPartsCard( 'Parent Card', newParts.id );
		} )
		.catch( function( errorMsg ) {
			console.log( errorMsg );
		} );
	} )
}

const attachProductCardOntoPartsCard = function( name, newPartsCardId ) {
	// 商品カードをParent Cardとしてアタッチするために、商品カードのurlが必要なので取得する
	// getting the url to attach onto productCard, that's destination of this attachment
	t.card( 'url' )
	.then( function( productCard ) {
		// to post productCard onto each attachment of partsCard
		//
		// setting up the destination of post as first argument
		// the content as second argument
		// third argument is worked as successMassages
		// fourth argument is worked as errorMassages
		Trello.post( `cards/${newPartsCardId}/attachments`, {
			name: name,
			url : productCard.url
		}, function( successMsg ) {
			console.log( 'successfully attach parent card onto a parts card' );
			console.log( successMsg );

			t.closeModal(); // これをcallbackでやらないとcallbackの内容が出力される前に終わってしまって、msgが取得できない
			//t.storeSecret('parentProductCard', t.getContext.card); // 素材カードから商品カードへ戻ってくるための手引き
		}, function( errorMsg ) {
			console.log( errorMsg );
			t.closeModal();
		} );

	} );
}

// Within this form, save each information
// "submit" is an event which processes before sending this form.
// and "event" means the data of "id=parts_content"
window.parts_content.addEventListener( 'submit', function( event ) {
	event.preventDefault(); // cancel r
	// console.log(event);
	// If "parts_title_input" is empty, the name sets up "新しい素材"
	const partsName = window.parts_title_input.value || '新しい素材';

	// todo: ArtisanとPriceを自動でカスタムフィールドに入力したい
	const partsArtisan = window.parts_artisan_input.value;
	let partsPrice = window.parts_price_input.value;

	//Upper numeral replace into Lower numeral
	// if( typeof(partsPrice) !== 'number' ) {
	// 	partsPrice.replace( /[０-９]/g, function( s ) {
	// 		return String.fromCharCode( s.charCodeAt( 0 ) - 65248 );
	// 	} );
		// partsPrice = parseInt(partsPrice)
	//}
	addParts( partsName, partsArtisan, partsPrice, window.parts_category_selector.value );
} );
