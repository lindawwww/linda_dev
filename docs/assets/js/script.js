/* If you're feeling fancy you can add interactivity
to your site with Javascript */

'use strict';
// prints "hi" in the browser's dev tools console
console.log( 'hi' );

// ボード情報
const TrelloBoards = {

		"Product"  : {
			"id" : "5b99dac219c10a16dca9ae9b",
			"url": "https://trello.com/b/azpZBFAZ/product"
		},
		"Parts"    : {
			"id" : "5b99dacd30b8a441f1ae0f0b",
			"url": "https://trello.com/b/d0UXeBZn/partsdev"
		},
		"Order"    : {
			"id" : "5b99dab3f3ddd87e5818ae47",
			"url": "https://trello.com/b/DDRwu6QG/order"
		},
		"OrderMeta": {
			"id" : "5b99dae016ee91871fa10e07",
			"url": "https://trello.com/b/zSnkrBMh/order-meta"
		},
}

// アイコン
const TrelloIcons = {
	WHITE_ICON  : 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg',
	BLACK_ICON  : 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-black.svg',
	CONTROLLER  : 'https://github.com/lindawwww/linda_dev/tree/master/docs/assets/image/joystick_light.png',
	SEARCH_DARK : 'https://github.com/lindawwww/linda_dev/tree/master/docs/assets/image/search_dark.png',
	SEARCH_LIGHT: 'https://github.com/lindawwww/linda_dev/tree/master/docs/assets/image/search_light.png',
}

// Organization
// envを決めるために最初だけ使う
const TrelloOrganization = {
	"dev" : "5b99d8e2be13c9696fcacff8",
}

var productBoard = TrelloBoards.Product;
var storage = sessionStorage;
var index = 0;

// var customData = {
//
// 		"cost"  : {
// 			"value" : 0,
// 		},
// 		"unit_price" : {
// 			"value" : 0,
// 		},
// }

var onBtnClick = function ( t, opts ){
	t.card( 'id', 'name', 'desc', 'attachments', 'customFieldItems' )
	.then( function( productCard ) {
		//setting up the board's id
		Trello.get( `/cards/${productCard.id}/board` )
		.then( function (productBoardInfo) {

			storage.setItem("name", productCard.name);
			console.log(typeof productCard.desc);
			console.log(productCard.desc);
			productCard.desc = productCard.desc.replace(/\\r\\n?\\n\\r?\\r?\\n?/g, 'aaa');
			// productCard.desc = productCard.desc.replace(/(<br>|<br \/>)/gi, '\n');
			storage.setItem("description", productCard.desc);
			console.log(productCard.desc);
			Trello.get( `/boards/${productBoardInfo.id}/customFields` )
			.then( function (customFields) {

				console.log("define subDeferred");
				var subDeferred = Trello.get( `/cards/${productCard.id}/customFieldItems` )
				.done( function (customFieldItems){
					console.log("start subDeferred");
					var deferred = new $.Deferred();
					for(index=0; index<customFieldItems.length; index++){
						// customFields[0].name = '原価'
						// customFields[1].name = '単価'
						if(customFieldItems[index].idCustomField === customFields[0].id){
							storage.setItem("cost", customFieldItems[index].value.number);
							console.log("set the cost");
							// deferred.resolve();
						} else if (customFieldItems[index].idCustomField === customFields[1].id){
							storage.setItem("unit_price", customFieldItems[index].value.number);
							console.log("set the unit_price");
						} else { console.log("invalid field"); }
					}
					console.log("finish the sub process");
					deferred.resolve();
					return deferred;
				}).fail( function(errorMsg) {
					console.log( errorMsg );
				});
				// deferred can't turn over
				//
				// }).always(function (){
				// 	console.log("finish the sub process");
				// 	deferred.resolve();
				// 	return deferred;
				// });

				// console.log("successfully worked so far "+productCard.attachments.length);
				// //console.log(productCard.attachments);
				// storage.setItem("numberOfAttachments",productCard.attachments.length);

				// Trello.get(`/cards/${productCard.id}/attachments/${productCard.attachments[0].id}`)
				// .then( function (attachmentInfo0) {
				// 	//console.log(attachmentInfo0);
				// 	// $.getJSON(attachmentInfo0.url+".json" , function(data) {
				// 	// 	console.log(data);
				// 	// });
				// });
				for(index=productCard.attachments.length-1; index>=0; index--){
					//console.log(productCard.attachments[index]);
					console.log(productCard.attachments[index].name);
					storage.setItem("attachmentName"+index,productCard.attachments[index].name)
				}
				console.log("subDeferred done");
				//it works when subDeferred is done
				subDeferred.done( function(){
					window.open('docs/components/printProductCard.html','_blank')
				});
			});
		});
		// console.log("deferred done");
		// deferred.done(window.open('docs/components/printProductCard.html','_blank'));
	});//t.card
};

window.TrelloPowerUp.initialize( {

	'card-buttons': function( t, opts ) {

		// todo: ここもあとでボードごとの切り替えをcontrollerを経由しないでできるようにする
		const board = opts.context.board;
		if( board === TrelloBoards.Product.id ) {  // Product Board Button
			console.log( 'product board' );
			return [ {
				icon    : TrelloIcons.CONTROLLER,
				text    : '素材を追加',
				callback: function( t ) {
					// return t.popup( {
					// 	title : '素材 - 新規作成',
					// 	url   : 'docs/components/register_parts_pop.html',
					// 	args  : { // popupを跨ぐと、グローバル変数としてアクセスできないのでargsで渡す
					// 		env   : TrelloOrganization.dev,
					// 		boards: TrelloBoards,
					// 	},
					// 	height: 340, // initial height, can be changed later
					// } );
					return t.modal( {
						title: '素材 - 新規作成',
						url   : 'docs/components/register_parts.html',
						args  : { // popupを跨ぐと、グローバル変数としてアクセスできないのでargsで渡す
							env   : TrelloOrganization.dev,
							boards: TrelloBoards,
						},
						fullscreen: false,
					} );
				}
			},
			{
				icon    : TrelloIcons.CONTROLLER,
				text    : '印刷',
				callback: onBtnClick,
			} ];
		} else if( board === TrelloBoards.Order.id ) { // Order Board Button
			console.log( 'order board' )
			return [ {
				icon    : TrelloIcons.CONTROLLER,
				text    : '商品を検索',
				callback: function( t ) {
				// 	return t.popup( {
				// 		title : '商品検索 - 登録',
				// 		url   : 'docs/components/register_products_pop.html',
				// 		args  : { // popupを跨ぐと、グローバル変数としてアクセスできないのでargsで渡す
				// 			env   : TrelloOrganization.dev,
				// 			boards: TrelloBoards,
				// 		},
				// 		height: 440, // initial height, can be changed later
				// 	} );
				return t.modal( {
					title: '商品検索 - 登録',
					url   : 'docs/components/register_products_pop.html',
					args  : { // popupを跨ぐと、グローバル変数としてアクセスできないのでargsで渡す
						env   : TrelloOrganization.dev,
						boards: TrelloBoards,
					},
					fullscreen: false,
				} );
				}
			} ,
		{
			icon    : TrelloIcons.CONTROLLER,
			text    : '商品を検索',
			callback: function( t ) {
				return t.popup( {
					title : '商品検索 - 登録',
					url   : 'docs/components/register_products_pop.html',
					args  : { // popupを跨ぐと、グローバル変数としてアクセスできないのでargsで渡す
						env   : TrelloOrganization.dev,
						boards: TrelloBoards,
					},
					height: 440, // initial height, can be changed later
				} );
			}
		}];
		} else if( board === TrelloBoards.Parts.id ) { // Order Board Button
			console.log( 'parts board' );
			return [ {
				icon    : TrelloIcons.CONTROLLER,
				text    : '素材を追加',
				callback: function( t ) {
					if( confirm( '素材を登録しますか?' ) ) {
						//素材カードを完了時、親である商品カードへ遷移 (アタッチされている商品カード)
						t.card( 'attachments' )
						.then( function( card ) {
							t.navigate( {
								url: card.attachments[ 0 ].url
							} );
						} );
					}
				}
			} ];
		} else { console.log( 'other board' ); }
	}
} );
