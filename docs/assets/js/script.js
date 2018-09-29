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
var subindex = 0;
var onProductBtnClick = function ( t, opts ){
	storage.setItem("windowFlag","CLOSED");
	t.card( 'id', 'name', 'desc', 'attachments', 'customFieldItems' )
	.then( function( productCard ) {

		//setting up the board's id
		Trello.get( `/cards/${productCard.id}/board` )
		.then( function (productBoardInfo) {

			storage.setItem("productName", productCard.name);
			storage.setItem("productDescription", productCard.desc.replace(/\n/g, '<br>'));
			storage.setItem("numberOfMaterialAttachments",productCard.attachments.length);
			Trello.get( `/boards/${productBoardInfo.id}/customFields` )
			.then( function (productCustomFields) {
				Trello.get( `/cards/${productCard.id}/customFieldItems` )
				.then( function (productCustomFieldItems){
					var flag=0;
					for(index=0; index<productCustomFieldItems.length; index++){
						// productCustomFields[0].name = '原価'
						// productCustomFields[1].name = '単価'
						if(productCustomFieldItems[index].idCustomField === productCustomFields[0].id){
							storage.setItem("productCost", productCustomFieldItems[index].value.number);
							console.log("set the product cost");
						} else if (productCustomFieldItems[index].idCustomField === productCustomFields[1].id){
							storage.setItem("productUnitPrice", productCustomFieldItems[index].value.number);
							console.log("set the product unit-price");
						} else { console.log("productCustomFields error"); }
					}
					console.log("number of attachments: "+storage.getItem("numberOfMaterialAttachments"));
					if( storage.getItem("numberOfMaterialAttachments")!=='0' ){
						for(index=productCard.attachments.length-1; index>=0; index--){
							var str = productCard.attachments[index].url.split("/");
							$.ajaxSetup({async: false});
							$.getJSON("https://trello.com/1/cards/"+str[4]+"?key=b1cc5bee67e2cfc80d86fe30ad1d46bf&token=84f11f74eebf02e2c1e195f17f9015b7402d96fb149beac9d27786dc6e41071e", function(data){
								console.log("correct index??"+index);
								var partsCardId = data.id;
								(function(index,deferrd){
									Trello.get( `/cards/${partsCardId}/board` )
									.then( function (partsBoardInfo) {
									console.log("layer1 index: "+index);
										Trello.get( `/boards/${partsBoardInfo.id}/customFields` )
										.then( function (partsCustomFields) {
										console.log("layer2 index: "+index);
											Trello.get( `/cards/${partsCardId}/customFieldItems` )
											.then( function (partsCustomFieldItems){
												console.log("layer3 index: "+index+"---------------");
												console.log(productCard.attachments[index].name);
												console.log(productCard.attachments[index].url);
												storage.setItem("attachmentMaterialName"+index,productCard.attachments[index].name);
												for(subindex=0; subindex<partsCustomFieldItems.length; subindex++){
													// partsCustomFields[0].name = '職人名'
													// partsCustomFields[1].name = '希望単価'
													if(partsCustomFieldItems[subindex].idCustomField === partsCustomFields[0].id){
														if(partsCustomFieldItems[subindex].value.text !== null){
															storage.setItem("partsArtisan"+index, partsCustomFieldItems[subindex].value.text);
															console.log(storage.getItem("partsArtisan"+index));
															console.log("set the parts artisan");
														} else { /*storage.setItem("partsArtisan"+index, null);*/ console.log("this is null");}
													} else if (partsCustomFieldItems[subindex].idCustomField === partsCustomFields[1].id){
														if(partsCustomFieldItems[subindex].value.number !== null){
															storage.setItem("partsUnitPrice"+index, partsCustomFieldItems[subindex].value.number);
															console.log(storage.getItem("partsUnitPrice"+index));
															console.log("set the parts unit-price");
														} else { /*storage.setItem("partsUnitPrice"+index, null);*/ console.log("this is null");}
													} else { console.log("partsCustomFields error"); }
													if(index===0 && subindex===1){
														console.log("FINISHED THE PROCESS!!");
														flag=1;
														storage.setItem("Flag",flag);
													}
												}// end of subindex
											});
										});
									});
								})(index);
							});
						}
					} else { console.log("No attachments!!");}
// 					console.log("FINISHED THE PROCESS!!");
// 					deferred.resolve();
// 					return deferred;
				}).done(function (){
					console.log(typeof storage.getItem("Flag"));
					if(storage.getItem("Flag")==='1'){
						window.open('docs/components/printProductCard.html','_blank');
					}
				});

// 				deferred.done( function (){
// 				if(storage.getItem("windowFlag")==="CLOSED"){
// 					window.open('docs/components/printProductCard.html','_blank');
// 					storage.setItem("windowFlag","OPEN");
// 				} else { console.log("Already opened"); }});
			});
		});
	});//t.card
};
var onOrderBtnClick = function (t, ops){
	// var commentJson = JSON.parse(commentRes.getContentText());
	t.card( 'id', 'name', 'desc', 'attachments', 'customFieldItems', 'idList' )
	.then( function( orderCard ){

		Trello.get( `/cards/${orderCard.id}/board` )
		.then( function (orderBoardInfo) {
			storage.setItem("orderName", orderCard.name);
			// orderCard.desc = orderCard.desc.replace(/\n/g, '<br>');
			storage.setItem("orderDescription", orderCard.desc.replace(/\n/g, '<br>'));
			storage.setItem("numberOfProductAttachments",orderCard.attachments.length);

			Trello.get( `/lists/${orderCard.idList}` )
			.then(function (listInfo){
				console.log(listInfo);
				// Lists[0].name = 'ヤマト'
				// Lists[1].name = 'hoge'
				storage.setItem("orderCustomer",listInfo.name);
			});
			Trello.get( `/boards/${orderBoardInfo.id}/customFields` )
			.then( function (customFields) {
				var subDeferred = Trello.get( `/cards/${orderCard.id}/customFieldItems` )
				.done( function (customFieldItems){
					var deferred = new $.Deferred();
					for(index=0; index<customFieldItems.length; index++){
						// customFields[0].name = '記入者'
						// customFields[1].name = '先方担当者'
						// customFields[2].name = '合計売上'
						// customFields[3].name = '合計原価'
						// customFields[4].name = '受注日'
						if(customFieldItems[index].idCustomField === customFields[0].id){
							storage.setItem("orderRepresentative", customFieldItems[index].value.text);
							console.log("set the representative");
						}	else if(customFieldItems[index].idCustomField === customFields[1].id){
							storage.setItem("orderCustomerRepresentative", customFieldItems[index].value.text);
							console.log("set the customer representative");
						} else if(customFieldItems[index].idCustomField === customFields[2].id){
							storage.setItem("orderTotalUnitPrice", customFieldItems[index].value.number);
							console.log("set the order's total unit-price");
						} else if(customFieldItems[index].idCustomField === customFields[3].id){
							storage.setItem("orderTotalCost", customFieldItems[index].value.number);
							console.log("set the order's total cost");
						} else if (customFieldItems[index].idCustomField === customFields[4].id){
							var date = customFieldItems[index].value.date.split('T');
							console.log(date);
							storage.setItem("dateReceivedOrder", date[0]);
							console.log("set the date received order");
						} else { console.log("CustomFields error"); }
					}
					deferred.resolve();
					return deferred;
				}).fail( function(errorMsg) {
					console.log( errorMsg );
				});

				if( storage.getItem("numberOfProductAttachments")!==0 ){
					for(index=orderCard.attachments.length-1; index>=0; index--){
						//console.log(orderCard.attachments[index]);
						console.log(orderCard.attachments[index].name);
						storage.setItem("attachmentProductName"+index,orderCard.attachments[index].name)
					}
				} else { console.log("No attachments!!"); }
				//it works when subDeferred is done
				subDeferred.done( function(){
					window.open('docs/components/printOrderCard.html','_blank')
				});
			});
		});
	});
};

window.TrelloPowerUp.initialize( {

	'card-buttons': function( t, opts ) {

		// todo: ここもあとでボードごとの切り替えをcontrollerを経由しないでできるようにする
		const board = opts.context.board;
		if( board === TrelloBoards.Product.id ) {  // Product Board Button
			console.log( 'product board' );
			return [{
				icon    : TrelloIcons.CONTROLLER,
				text    : '印刷',
				callback: onProductBtnClick,
			},
			{
				icon    : TrelloIcons.CONTROLLER,
				text    : '素材を追加',
				callback: function( t ) {
					return t.modal( {
						title: '素材 - 新規作成',
						url   : 'docs/components/register_parts.html',
						height: 550,
						args  : { // popupを跨ぐと、グローバル変数としてアクセスできないのでargsで渡す
							env   : TrelloOrganization.dev,
							boards: TrelloBoards,
						},
						fullscreen: false,
					} );
				}
			}];
		} else if( board === TrelloBoards.Order.id ) { // Order Board Button
			console.log( 'order board' )
			return [{
				icon    : TrelloIcons.CONTROLLER,
				text    : '印刷',
				callback: onOrderBtnClick,
			},
			{
				icon    : TrelloIcons.CONTROLLER,
				text    : '商品を検索',
				callback: function( t ) {
					return t.modal({
						title: '商品検索 - 登録',
						url   : 'docs/components/register_products.html',
						height: 690,
						args  : { // popupを跨ぐと、グローバル変数としてアクセスできないのでargsで渡す
							env   : TrelloOrganization.dev,
							boards: TrelloBoards,
						},
						fullscreen: false,
					});
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
