const t = window.TrelloPowerUp.iframe();
const Promise = window.TrelloPowerUp.Promise;

// グローバル変数の引き継ぎ
window.env = t.arg( 'env' );
window.TrelloBoards = t.arg( 'boards' );
// TrelloBoards and env is necessary
if( !window.env ) throw new Error( "window.env is undefined" );
if( !window.TrelloBoards ) throw new Error( "window.TrelloBoards is undefined" );


const view = (() => {
	const context = t.getContext();
	// Parts
	if( context.board === TrelloBoards[env].Parts.id ) {
		// 完了
		const finishAddPartsBtn = window.document.getElementById( 'finish_add_parts' );
		if( finishAddPartsBtn.classList.contains( 'hidden' ) ) finishAddPartsBtn.classList.remove( 'hidden' );
	}
	// Products
	if( context.board === TrelloBoards[env].Product.id ) {
		// 素材を追加
		const addPartsBtn = window.document.getElementById( 'add_parts' );
		if( addPartsBtn.classList.contains( 'hidden' ) ) addPartsBtn.classList.remove( 'hidden' );
	}
	// Order
	if( context.board === TrelloBoards[env].Order.id ) {
		// 商品を検索
		const searchProductBtn = window.document.getElementById( 'add_ordermeta' );
		if( searchProductBtn.classList.contains( 'hidden' ) ) searchProductBtn.classList.remove( 'hidden' );
	}
})();


const controller = (() => {
	// 「素材を追加」ボタンの動作
	window.document.getElementById( 'add_parts' ).addEventListener( 'click', () => {
		t.popup( {
			title : '素材 - 新規作成',
			url   : './register_product.html',
			args  : { // popupを跨ぐと、グローバル変数としてアクセスできないのでargsで渡す
				env : env,
				boards: TrelloBoards,
			},
			height: 278 // initial height, can be changed later
		} );
	} );

	// 「商品を検索」ボタンの動作
	window.document.getElementById( 'add_ordermeta' ).addEventListener( 'click', () => {
		t.popup( {
			title : '商品検索 - 登録',
			url   : './register_order.html',
			args  : { // popupを跨ぐと、グローバル変数としてアクセスできないのでargsで渡す
				env : env,
				boards: TrelloBoards,
			},
			height: 440, // initial height, can be changed later
		} );
	} );

	// 「完了」ボタンの動作
	window.document.getElementById( 'finish_add_parts' ).addEventListener( 'click', () => {
		if( confirm( '素材を登録しますか?' ) ) {
			console.log( "Parts successfully added." )
			// alert( '商品ボードへ移動します...' )

			// window.location.href = Boards.Product_dev.url;
			// => X-Frame-Options: DENY のせいで飛べない ref.) https://developer.mozilla.org/ja/docs/Web/HTTP/X-Frame-Options
			// ので、別の方法で。
			// https://developers.trello.com/reference/#t-navigate
			// こんなものがあった

			//素材カードを完了時、親である商品カードへ遷移 (アタッチされている商品カード)
			t.card( 'attachments' )
			.then( function( card ) {
				t.navigate( {
					url: card.attachments[ 0 ].url
				} );
			} );
		}
	} );
})();

