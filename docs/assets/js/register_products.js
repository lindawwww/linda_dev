const t = TrelloPowerUp.iframe();
const Promise = window.TrelloPowerUp.Promise;

// グローバル変数の引き継ぎ
window.env = t.arg( 'env' );
window.TrelloBoards = t.arg( 'boards' );
// TrelloBoards and env is necessary
if( !window.env ) throw new Error( "window.env is undefined" );
if( !window.TrelloBoards ) throw new Error( "window.TrelloBoards is undefined" );

// 現在開いているカードのリストに紐づく、他のボードのリスト情報
const productContext = {
	list        : {
		id  : null,
		name: null
	},
	customFields: {
		"作成日": null,
		"単価" : null,
		"顧客名": null,
	}
}
const orderMetaContext = {
	list        : {
		id  : null,
		name: null
	},
	customFields: {
		"数量" : null,
		"単価" : null,
		"顧客名": null,
		"作成日": null,
	}
}

/**
 * 検索処理
 *
 * @param dateQuery
 * @param wordQuery
 * @param listName
 * @param limit
 */
const searchProduct = async function( dateQuery, wordQuery, listName = "", limit = 15 ) {
	debugger;

	let queries = [];

	// フリーワード検索
	if( wordQuery ) {
		// 現在開いているカードが属するリストと同じリストの中身だけを検索
		// listNameが空の時はlist:フィルターをつけない
		wordQuery = wordQuery + (listName !== "" ? ' && list:' + listName : "");
		queries = searchByWord( queries, wordQuery )
	} else {
		// 初期ノーフィルター
		const soberQuery = (listName !== "" ? 'list:' + listName : "");
		queries = searchByWord( queries, soberQuery )
	}

	// 作成日検索
	if( dateQuery[ 0 ] !== "" && dateQuery[ 1 ] !== "" ) {
		queries = searchByCreatedDate( queries, dateQuery )
	}


	// クエリ実行
	const productCards = await resolveQuery( queries )

	debugger; // 条件にマッチした商品カードのみが抽出できているか

	if( productCards.length > 0 ) {
		console.log( `Found: ${productCards.length}` );
		// 前回の検索結果をリセット
		$( '#search_result' ).empty();
		// no-resultsが表示されている場合、隠す。
		const noResults = window.document.getElementById( 'no_results' );
		if( !noResults.classList.contains( 'hidden' ) ) noResults.classList.add( 'hidden' );

		for( let product of productCards ) {
			let $elm = $( '<a></a>', {
				text: product.name,
				href: product.shortUrl,
				// class       : "big-link attach-product label-list-item-link"
			} );
			// 埋め込みカードに変換する
			$elm = $( '<blockquote class="trello-card-compact"></blockquote>' ).wrapInner( $elm );

			// add buttonを格納するためにdivでラップする
			$elm = $( '<div class="search-result-item">' ).wrapInner( $elm );


			// 商品カードに付随する入力フォームやボタンなど
			let $addOrderMetaForm = $( '<form class="add-ordermeta-form"></form>' )
			// units input
			$( `<label for="product_units_input" class="product_units_input_label">数量:</label><input type="text" name="product_units_input" class="product_units_input"/>` ).appendTo( $addOrderMetaForm )
			// add button
			$( `<button type="submit" class="mod-primary js-add-ordermeta" data-product-url="${product.url}" data-product-id="${product.id}">+</button>` ).appendTo( $addOrderMetaForm );
			$addOrderMetaForm.appendTo( $elm )

			$( '#search_result' ).append( $elm );
			// 埋め込みカードをコンパイルする
			window.TrelloCards.load( document, { compact: true, allAnchors: false } );
		}

	} else {
		// todo:
		console.log( "No Result" )
		// 前回の検索結果をリセット
		$( '#search_result' ).empty();
		const noResults = window.document.getElementById( 'no_results' );
		if( noResults.classList.contains( 'hidden' ) ) noResults.classList.remove( 'hidden' );
	}
}

/**
 * SearchAPIを利用した検索をする
 *
 * @param {[Promise]} queries
 * @param {string}    query
 */
const searchByWord = function( queries, query ) {
	queries.push(
		new Promise( ( resolve, reject ) => {
			Trello.get( '/search', {
				query   : query,
				idBoards: TrelloBoards[ env ].Product.id,
				//		card_limit: limit, //todo: limitを外して、more機能をつける
				partial : true
			} )
			.then( function( productBoard ) {
				resolve( productBoard.cards )
			} )
		} )
	)

	return queries
}

/**
 * カスタムフィールドのDateの比較をする
 * e.g.)
 *    2018/04/01 ~ 2018/07/01 : 4/1から7/1までのもの
 *    null       ~ 2018/07/01 : 7/1以前のもの
 *    2018/04/01 ~ null       : 4/1以降のもの
 *
 * @param {[Promise]} queries
 * @param {[string]}  query - ["2018/04/01", "2018/07/01"]
 */
const searchByCreatedDate = function( queries, query ) {
	queries.push(
		new Promise( ( resolve, reject ) => {

			// 作成日検索を行う（自前search）
			// Productボードの同じリストを参照し、登録されているカードを取得
			Trello.get( `/lists/${productContext.list.id}/cards`, {
				fields: 'id,name'
			} )
			.then( function( cards ) {
				// カスタムフィールドだけの配列
				const customFieldItemsPromise = cards.map( ( card ) => {
					return Trello.get( `/cards/${card.id}/customFieldItems` )
				} );

				// 作成日で絞り込み
				Promise.all( customFieldItemsPromise )
				.then( ( customFieldItems ) => {
						/**
						 customFieldItems = [
						 customFieldItem = [
						 {
							 id           : "5b2c7d0966dd99841f90705f",
							 idCustomField: "5b145e11b3e5b6cef9642fcc",
							 idModel      : "5b2c7d0866dd99841f907034",
							 idValue      : "5b145e11b3e5b6cef9642fcd",
							 modelType    : "card",
							 value        : {data: "2018-06-07T15:00:00+09:00"}
						 }, ...
						 ]
						 ]
						 **/
						const dateCustomFieldId = productContext.customFields[ "作成日" ]
						// [ {cardId: date}, ... ] の形へ整形
						const dateSet = customFieldItems.map( ( customFieldItem, index ) => { // indexがどのカードかを突き止める
							// 内側のmapで作った配列をそのまま外側のmapの戻り値として返す
							for( const customField in customFieldItem ) {
								// "作成日"のカスタムフィールドを探し、dateValueを抜き出す
								if( customFieldItem[ customField ].id !== undefined
									&& customFieldItem[ customField ].idCustomField === dateCustomFieldId ) {
									// indexは後からカードを参照するのに便利
									return {
										index : index,
										cardId: cards[ index ].id,
										date  : customFieldItem[ customField ].value.date
									}
								}
							}
						} ).filter( item => item !== undefined ) // undefinedのものを除く

						let matchCards = [];
						// 検索作成日の範囲にある商品カードのみを抽出
						if( query[ 1 ] === "" ) { // e.g) 2018/04/01 ~
							matchCards = dateSet.map( ( item ) => {
								const dateStart = new Date( query[ 0 ] )
								const dateEnd = new Date( Date.now() ) // 今日
								const itemDate = new Date( item.date )
								if( itemDate >= dateStart && itemDate <= dateEnd ) {
									return cards[ item.index ]
								}
							} ).filter( item => item !== undefined )
						} else if( query[ 0 ] === "" ) { // e.g) ~ 2018/07/01
							matchCards = dateSet.map( ( item ) => {
								const dateStart = new Date( 0 ) // 1970-01-01T00:00:00.000Z
								const dateEnd = new Date( query[ 1 ] )
								const itemDate = new Date( item.date )
								if( itemDate >= dateStart && itemDate <= dateEnd ) {
									return cards[ item.index ]
								}
							} ).filter( item => item !== undefined )
						} else { // e.g) 2018/04/01 ~ 2018/07/01
							matchCards = dateSet.map( ( item ) => {
								const dateStart = new Date( query[ 0 ] )
								const dateEnd = new Date( query[ 1 ] )
								const itemDate = new Date( item.date )
								if( itemDate >= dateStart && itemDate <= dateEnd ) {
									return cards[ item.index ]
								}
							} ).filter( item => item !== undefined )
						}

						resolve( matchCards );
					}
				)
			} )
		} )
	)
	return queries
}

/**
 * Query Promiseを解決し、intersectをとる
 *
 * @param queries
 *
 * @return Cards
 */
const resolveQuery = function( queries ) {
	return Promise.all( queries )
	.then( ( res ) => {
		debugger;
		console.log( 'successfully search product' );
		return intersectCards( res )
	} )
	.catch( function( errorMsg ) {
		console.error( errorMsg );
	} );
}

/**
 * カードの配列の交差（intersection）をとる
 * すべての配列に属しているカードのみを抽出する
 * すべての検索に引っかかったカードのみを抽出する
 *
 * @param {[Cards]} cardsArray
 */
const intersectCards = function( cardsArray ) {
	// 最初のカード配列から順次に交差を取っていき、まとめていく
	return cardsArray.reduce( ( acc, cards, i ) => {
		// intersectをとるために次のカード配列のidだけの配列を作成しておく todo: (intersect関数などがデフォでないの?)
		const cardsIds = cards.map( card => card.id )

		// カードが次のカード配列にも含まれているかどうか
		return acc.filter( card => cardsIds.includes( card.id ) )
	} )
}

/**
 * Searchボタンをクリックした時のイベント処理
 *
 */
window.search_product.addEventListener( 'submit', function( event ) {
	event.preventDefault();
	t.list( 'name' ).then( list => {
		searchProduct(
			[ window.search_by_date_start_input.value, window.search_by_date_end_input.value ],
			window.search_by_word_input.value,
			list.name, 20
		);
	} )

	// t.set( 'card', 'shared', 'estimate', window.parts_category_selector.value )
	// .then( function() {
	// addParts( '新しい素材', window.parts_category_selector.value );
	// } );
} );


/**
 * OrderMetaボードにProductカードのクローンを作成
 *
 * @param name
 * @param units
 * @param idCardSource
 * @param idList
 */
const addOrderMeta = function( name, units, idCardSource, idList ) {
	// 商品カードをOrderMetaに複製
	Trello.post( '/cards', {
		name          : name,
		idList        : idList, //指定されたidListへ
		idCardSource  : idCardSource, // 複製する商品カード
		keepFromSource: 'all'
	} )
	.then( function( newOrderMeta ) {
		console.log( 'successfully create a order-meta' );

		// カスタムフィールド登録
		Trello.get( `/boards/${TrelloBoards[ env ].OrderMeta.id}/customFields` )
		.then( function( customFields ) {
			const unitsCustomFieldId = customFields[ 0 ].id;
			debugger;

			// 数量
			Trello.put( `/card/${newOrderMeta.id}/customField/${unitsCustomFieldId}/item`, {
				value: { number: units }
			} )
			.then( res => console.log( res ) )

			debugger;

			// 注文カードに注文メタカードをアタッチする
			t.attach( {
				name: '- OrderMeta -', // optional
				url : newOrderMeta.url // required
			} )
			// OrderMeta登録の場合は１回のポップアップで複数個を登録することもあるため、１回ごとに閉じなくていい。
			// t.closePopup(); // これをcallbackでやらないとcallbackの内容が出力される前に終わってしまって、msgが取得できない
		} )
		.catch( function( errorMsg ) {
			console.error( errorMsg );
		} );
	} )
	.catch( function( errorMsg ) {
		console.error( errorMsg );
		// t.closePopup();
	} );
}

/**
 * OrderMeta追加ボタンの発火検知
 *
 * 動的に生成されるボタンにイベントをアタッチするために、第２引数を使っている。
 */
$( document ).on( "submit", ".add-ordermeta-form", function(event) {
	event.preventDefault();
	let productUnits = $(this).children('input[name="product_units_input"]').first().val()
	// 文字列で数値を渡されても一応受領可能にする todo: なぜかうまく動かない
	if ( typeof(productUnits) !== 'number') {
		productUnits.replace( /[０-９]/g, function( s ) {
			return String.fromCharCode( s.charCodeAt( 0 ) - 65248 );
		} );
		productUnits = parseInt(productUnits)
	}
	const productId = $( this ).children('.js-add-ordermeta').data( 'product-id' );

	// OrderMetaボードにProductカードのクローンを作成
	addOrderMeta( '', productUnits, productId, orderMetaContext.list.id )
	// var html = '<button type="button" class="add-btn">ボタン' + (num + 1) + '</button>';
	// $(".btn-area").append(html);
} );

/**
 * 検索クエリの初期化
 */
$( document ).on( "click", ".js-clear-search-query", function() {
	window.search_by_date_start_input.value = ""
	window.search_by_date_end_input.value = ""
	window.search_by_word_input.value = ""
} );


// ポップアップが表示された時に、格納されたデータから選択されいるシャツの種類を復元する処理
t.render( function() {
	// Productのリストの情報を取得しておく
	Trello.get( `/boards/${TrelloBoards[ env ].Product.id}/lists` ).then( ( productLists ) => {
		t.list( 'name' ).then( ( orderList ) => {
			const matchList = productLists.find( ( productList ) => {
				// 現在開いているカードのリストと同じ名前のOrderMetaのリストを探す。なければundefined。
				return productList.name === orderList.name
			} )
			debugger;

			// マッチするリストがなければ、新たに作成。
			// （だが、商品カードが一つも登録されていないことは自明なので検索にカードが引っかかることはない）
			if( matchList === undefined ) {
				Trello.post( '/lists', {
					name   : orderList.name,
					idBoard: TrelloBoards[ env ].Product.id,
					pos    : 'bottom' // 右に追加していく
				} )
				.then( ( newList ) => {
					productContext.list.id = newList.id
					productContext.list.name = newList.name
				} )
			} else { // マッチするリストがあれば
				productContext.list.id = matchList.id
				productContext.list.name = matchList.name
			}
		} )
	} )
	// Productカスタムフィールド情報を取得しておく
	Trello.get( `/boards/${TrelloBoards[ env ].Product.id}/customFields` )
	.then( ( customFields ) => {
		// 各カスタムフィールドの対応するidを取得
		for( const contextCf in productContext.customFields ) {
			const matchCustomField = customFields.find( ( cf ) => {
				return contextCf === cf.name
			} )
			// "作成日": "5b145a370e4ab3b0d82c7425",
			productContext.customFields[ contextCf ] = matchCustomField.id
		}

	} )

	// OrderMetaのリストの情報を取得しておく
	Trello.get( `/boards/${TrelloBoards[ env ].OrderMeta.id}/lists` )
	.then( ( orderMetaLists ) => {
		t.list( 'name' ).then( ( orderList ) => {
			const matchList = orderMetaLists.find( ( orderMetaList ) => {
				// 現在開いているカードのリストと同じ名前のOrderMetaのリストを探す。なければundefined。
				return orderMetaList.name === orderList.name
			} )
			debugger;

			// マッチするリストがなければ、新たに作成。
			// （だが、商品カードが一つも登録されていないことは自明なので検索にカードが引っかかることはない）
			if( matchList === undefined ) {
				Trello.post( '/lists', {
					name   : orderList.name,
					idBoard: TrelloBoards[ env ].OrderMeta.id,
					pos    : 'bottom' // 右に追加していく
				} )
				.then( ( newList ) => {
					orderMetaContext.list.id = newList.id
					orderMetaContext.list.name = newList.name
				} )
			} else { // マッチするリストがあれば
				orderMetaContext.list.id = matchList.id
				orderMetaContext.list.name = matchList.name
			}
		} )
	} )
	// OrderMetaカスタムフィールド情報を取得しておく
	Trello.get( `/boards/${TrelloBoards[ env ].OrderMeta.id}/customFields` )
	.then( ( customFields ) => {

		// 各カスタムフィールドの対応するidを取得
		for( const contextCf in orderMetaContext.customFields ) {
			const matchCustomField = customFields.find( ( cf ) => {
				return contextCf === cf.name
			} )
			// "作成日": "5b145a370e4ab3b0d82c7425",
			orderMetaContext.customFields[ contextCf ] = matchCustomField.id
		}
	} )


	// 初期検索結果を表示（未フィルター）
	t.list( 'name' ).then( list => {
		searchProduct(
			[ window.search_by_date_start_input.value, window.search_by_date_end_input.value ],
			window.search_by_word_input.value,
			list.name,
			20
		);
	} )

	// return t.sizeTo( '#search_product' ).done();
	// return t.sizeTo( '#search_product' ).done();
	// return t.get( 'card', 'shared', 'estimate' )
	// // データを取得できたら、表示に反映する
	// .then( function( estimate ) {
	// 	window.parts_category_selector.value = estimate;
	// } )
	// //
	// .then( function() {
	// 	t.sizeTo( '#parts_category' ).done();
	// } );
} );
