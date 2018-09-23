const caller = async function() {
	const getProductPromise = getProduct();
	const getOrderPromise = getOrder();

	console.log( getProductPromise )
	console.log( getOrderPromise )
	const product = await resolve( [ getProductPromise, getOrderPromise ] );
	console.log( 'in caller,', product )

}

const getProduct = function() {
	const subPromise = new Promise( ( resolve, reject ) => {
		setTimeout( () => {
			resolve( 'subpromise' )
		}, 1000 )
	} )

	return new Promise( ( resolve, reject ) => {
		setTimeout( () => {
			let msg = 'product';
			// プロミスを生成しているなかで、他のプロミスを解決する
			Promise.all( [ subPromise ] )
			.then( ( subPromise ) => {
				msg = `${msg} ${subPromise}`

				setTimeout( () => {
					resolve( msg ) // こいつが正常に帰ってくれれれば良い
				}, 1000 )
			} )
		}, 1000 )
	} )
}
const getOrder = function() {
	return new Promise( ( resolve, reject ) => {
		setTimeout( () => {
			resolve( 'order' )
		}, 1000 )
	} )
}

const resolve = function( promise ) {
	return Promise.all( promise )
	.then( ( [ product, order ] ) => {
		console.log( 'in resolve, ', product );
		console.log( 'in resolve, ', order );

		return 'hoge'
	} )
	.catch( ( err ) => {
		console.error( err )
	} )
}


caller()