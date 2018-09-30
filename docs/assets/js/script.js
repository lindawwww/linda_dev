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
				var promise = Trello.get( `/cards/${productCard.id}/customFieldItems` )
				.then( function (productCustomFieldItems){
					var deferred = $.Deferred();
					console.log(productCustomFieldItems);
					for(index=0; index<productCustomFieldItems.length; index++){
						// productCustomFields[0].name = '原価'
						// productCustomFields[1].name = '単価'
						console.log(productCustomFieldItems[index].idCustomField);
						console.log(productCustomFields[0]);
						console.log(productCustomFields[1]);
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
								var partsCardId = data.id;
								(function(index, deferred){
									Trello.get( `/cards/${partsCardId}/board` )
									.then( function (partsBoardInfo) {
// 									console.log("layer1 index: "+index);
										Trello.get( `/boards/${partsBoardInfo.id}/customFields` )
										.then( function (partsCustomFields) {
// 										console.log("layer2 index: "+index);
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
														} else {console.log("this is null");}
													} else if (partsCustomFieldItems[subindex].idCustomField === partsCustomFields[1].id){
														if(partsCustomFieldItems[subindex].value.number !== null){
															storage.setItem("partsUnitPrice"+index, partsCustomFieldItems[subindex].value.number);
															console.log(storage.getItem("partsUnitPrice"+index));
														} else {console.log("this is null");}
													} else { console.log("partsCustomFields error"); }
													if(index===0 && subindex===1){
														console.log("FINISHED THE PROCESS!!");
														deferred.resolve();
													}
												}// end of subindex
											});
										});
									});
								})(index, deferred);
							});
						}
					} else { console.log("No attachments!!");}
					return deferred.promise();
				});
				promise.done(function (){
					console.log("Done the deferred!!");
					window.open('docs/components/printProductCard.html','_blank');
				});
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
			var promise = Trello.get( `/boards/${orderBoardInfo.id}/customFields` )
			.then( function (customFields) {
				var deferred = $.Deferred();
				Trello.get( `/cards/${orderCard.id}/customFieldItems` )
				.then( function (customFieldItems){
					for(index=0; index<customFieldItems.length; index++){
						// customFields[0].name = '記入者'
						// customFields[1].name = '先方担当者'
						// customFields[2].name = '合計売上'
						// customFields[3].name = '合計原価'
						// customFields[4].name = '受注日'
						if(customFieldItems[index].idCustomField === customFields[0].id){
							storage.setItem("orderRepresentative", customFieldItems[index].value.text);
							console.log(customFieldItems[index].value.text);
						} else if(customFieldItems[index].idCustomField === customFields[1].id){
							storage.setItem("orderCustomerRepresentative", customFieldItems[index].value.text);
							console.log(customFieldItems[index].value.text);
						} else if(customFieldItems[index].idCustomField === customFields[2].id){
							storage.setItem("orderTotalUnitPrice", customFieldItems[index].value.number);
							console.log(customFieldItems[index].value.number);
						} else if(customFieldItems[index].idCustomField === customFields[3].id){
							storage.setItem("orderTotalCost", customFieldItems[index].value.number);
							console.log(customFieldItems[index].value.number);
						} else if (customFieldItems[index].idCustomField === customFields[4].id){
							var date = customFieldItems[index].value.date.split('T');
							storage.setItem("dateReceivedOrder", date[0]);
							console.log(date[0]);
						} else { console.log("CustomFields error"); }
					}
				});
				if( storage.getItem("numberOfProductAttachments")!==0 ){
					for(index=orderCard.attachments.length-1; index>=0; index--){
						var str = orderCard.attachments[index].url.split("/");
						$.ajaxSetup({async: false});
						$.getJSON("https://trello.com/1/cards/"+str[4]+"?key=b1cc5bee67e2cfc80d86fe30ad1d46bf&token=84f11f74eebf02e2c1e195f17f9015b7402d96fb149beac9d27786dc6e41071e", function(data){
							var productCardId = data.id;
							(function(index, deferred){
								Trello.get( `/cards/${productCardId}/board` )
								.then( function (productBoardInfo) {
// 									console.log("layer1 index: "+index);
									Trello.get( `/boards/${productBoardInfo.id}/customFields` )
									.then( function (productCustomFields) {
// 										console.log("layer2 index: "+index);
										Trello.get( `/cards/${productCardId}/customFieldItems` )
										.then( function (productCustomFieldItems){
											console.log("layer3 index: "+index+"---------------");
											console.log(orderCard.attachments[index]);
											console.log(orderCard.attachments[index].url);
											storage.setItem("attachmentProductName"+index,orderCard.attachments[index].name);
											for(subindex=0; subindex<productCustomFieldItems.length; subindex++){
												// productCustomFields[0].name = '原価'
												// productCustomFields[1].name = '単価'
												// productCustomFields[2].name = '数量'
												if(productCustomFieldItems[subindex].idCustomField === productCustomFields[0].id){
													if(productCustomFieldItems[subindex].value.number !== null){
														storage.setItem("productCost"+index, productCustomFieldItems[subindex].value.number);
														console.log(storage.getItem("productCost"+index));
													} else { console.log("this is null"); }
												} else if (productCustomFieldItems[subindex].idCustomField === productCustomFields[1].id){
													if(productCustomFieldItems[subindex].value.number !== null){
														storage.setItem("productUnitPrice"+index, productCustomFieldItems[subindex].value.number);
														console.log(storage.getItem("productUnitPrice"+index));
													} else {console.log("this is null");}
												} else if (productCustomFieldItems[subindex].idCustomField === productCustomFields[2].id){
													if(productCustomFieldItems[subindex].value.number !== null){
														storage.setItem("numberOfProduct"+index, productCustomFieldItems[subindex].value.number);
														console.log(storage.getItem("numberOfProduct"+index));
													} else {console.log("this is null");}
												} else { console.log("productCustomFields error"); }
												if(index===0 && subindex===1){
													console.log("FINISHED THE PROCESS!!");
													deferred.resolve();
												}
											} // end of subindex
										});
									});
								});
							})(index, deferred);
						}); // .getJSON
					}
				} else { console.log("No attachments!!"); }
				return deferred.promise();
			});
			promise.done( function(){
				console.log("Done the deferred!!");
				window.open('docs/components/printOrderCard.html','_blank')
			});
		});
	}); // t.card
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
