function sanitize( e ) {
	return e.replace( /[&<>"'\/]/g, function( e ) {
		return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;" }[ e ]
	} )
}

function showTab( e, t ) {
	var n, o = "tab-" + e, i = $( ".dashboard-tabs .item" ), r = $( ".dashboard-tab-content" ).children( ".ui.tab" );
	i.each( function() {
		var e = $( this ).attr( "data-tab" ), i = $( this ).attr( "data-target-tab" ) || e;
		if( e != o ) {
			$( this ).removeClass( "active" );
			var a = $( this ).children( ".child-text" );
			a.length && (a.text( a.attr( "data-default" ) ), $( this ).removeClass( "child-active" )), i != n && r.filter( '.ui.tab[data-tab="' + i + '"]' ).removeClass( "active" ).filter( ":not(.hidden)" ).transition( "hide" )
		} else {
			var s = $( this ).closest( ".ui.dropdown" );
			s.length && (s.children( ".child-text" ).text( $( this ).text() ), s.hasClass( "child-active" ) || s.addClass( "child-active" ), s.find( ".menu" ).transition( "hide" )), $( this ).hasClass( "active" ) || $( this ).addClass( "active" ), t ? r.filter( '.ui.tab[data-tab="' + i + '"]' ).transition( "hide" ).transition( "slide down" ) : r.filter( '.ui.tab.hidden[data-tab="' + i + '"]' ).transition( "show" ), n = i
		}
	} )
}

function getCurrentTab() {
	return $( ".dashboard-tabs .item.active" ).attr( "data-tab" ).substr( "tab-".length )
}

function showStatus( e ) {
	clearStatus( e ), $( e ).transition( "fade down" )
}

function clearStatus( e ) {
	$( e ).parent().children( ".butler-status" ).transition( "hide" )
}

var Log = {};
if( function() {
		function e() {
			return "function" == typeof ga && (ga.apply( null, arguments ), !0)
		}

		function t() {
			var t = arguments[ 0 ] || "(null)", o = Array.apply( null, arguments );
			"object" == typeof t && ("function" == typeof t.stopPropagation && t.stopPropagation(), "function" == typeof t.preventDefault && t.preventDefault(), t.detail && (t = t.detail), t.promise && o.push( t.promise ), "object" == typeof t.reason && (t = t.reason));
			var i = this.type || "error_app", r = "object" == typeof t ? t.message || t.reason || "__unknown__" : t,
			    a = o.map( n ).join( ", " );
			return console.log( "ERROR", i, r ), a = a.replace( /token=[0-9a-fA-F]*/g, "token=<TOKEN>" ).replace( /"X-Butler-Trello-Token":\s*"[0-9a-fA-F]*"/g, '"X-Butler-Trello-Token": "<TOKEN>"' ).replace( /[0-9a-fA-F]{64}/g, "" ), !e( "send", "event", i, r, a )
		}

		function n( e, t ) {
			return "object" == typeof e && null !== e && (e = o( e )), JSON.stringify( e, void 0, t )
		}

		function o( e, t ) {
			if( !e || "object" != typeof e ) return e;
			if( t || (t = []), t.indexOf( e ) != -1 ) return "__circular__";
			t.push( e );
			var n = {};
			return Object.getOwnPropertyNames( e ).forEach( function( i ) {
				n[ i ] = o( e[ i ], t )
			} ), n
		}

		function i( t, n, o ) {
			e( "send", "event", t, n, o )
		}

		function r( t ) {
			e( "set", "page", document.location.pathname + "#" + t ), e( "send", "pageview" )
		}

		Log.logError = t, Log.logEvent = i, Log.logVirtualPageview = r, window.onerror = t.bind( { type: "error_onerror" } ), $( document ).ajaxError( t.bind( { type: "error_ajax" } ) ), window.addEventListener( "unhandledrejection", t.bind( { type: "error_unhandledrejection" } ) )
	}(), "undefined" == typeof Paho ) {
	Paho = {};
	try {
		"undefined" != typeof module && (module.exports = Paho), "undefined" == typeof window && (global.window = global), "undefined" == typeof WebSocket && (global.WebSocket = require( "ws" )), "undefined" == typeof localStorage && (global.localStorage = {
			store     : {},
			getItem   : function( e ) {
				return this.store[ e ]
			},
			setItem   : function( e, t ) {
				this.store[ e ] = t
			},
			removeItem: function( e ) {
				delete this.store[ e ]
			}
		})
	} catch( e ) {
	}
}
Paho.MQTT = function( e ) {
	function t( e, t ) {
		var n = t, o = e[ t ], r = o >> 4, a = o &= 15;
		t += 1;
		var s, c = 0, d = 1;
		do {
			if( t == e.length ) return [ null, n ];
			s = e[ t++ ], c += (127 & s) * d, d *= 128
		} while( 0 != (128 & s) );
		var f = t + c;
		if( f > e.length ) return [ null, n ];
		var p = new v( r );
		switch( r ) {
			case l.CONNACK:
				var h = e[ t++ ];
				1 & h && (p.sessionPresent = !0), p.returnCode = e[ t++ ];
				break;
			case l.PUBLISH:
				var m = a >> 1 & 3, g = i( e, t );
				t += 2;
				var b = u( e, t, g );
				t += g, m > 0 && (p.messageIdentifier = i( e, t ), t += 2);
				var w = new Paho.MQTT.Message( e.subarray( t, f ) );
				1 == (1 & a) && (w.retained = !0), 8 == (8 & a) && (w.duplicate = !0), w.qos = m, w.destinationName = b, p.payloadMessage = w;
				break;
			case l.PUBACK:
			case l.PUBREC:
			case l.PUBREL:
			case l.PUBCOMP:
			case l.UNSUBACK:
				p.messageIdentifier = i( e, t );
				break;
			case l.SUBACK:
				p.messageIdentifier = i( e, t ), t += 2, p.returnCode = e.subarray( t, f )
		}
		return [ p, f ]
	}

	function n( e, t, n ) {
		return t[ n++ ] = e >> 8, t[ n++ ] = e % 256, n
	}

	function o( e, t, o, i ) {
		return i = n( t, o, i ), s( e, o, i ), i + t
	}

	function i( e, t ) {
		return 256 * e[ t ] + e[ t + 1 ]
	}

	function r( e ) {
		var t = new Array( 1 ), n = 0;
		do {
			var o = e % 128;
			e >>= 7, e > 0 && (o |= 128), t[ n++ ] = o
		} while( e > 0 && n < 4 );
		return t
	}

	function a( e ) {
		for( var t = 0, n = 0; n < e.length; n++ ) {
			var o = e.charCodeAt( n );
			o > 2047 ? (55296 <= o && o <= 56319 && (n++, t++), t += 3) : o > 127 ? t += 2 : t++
		}
		return t
	}

	function s( e, t, n ) {
		for( var o = n, i = 0; i < e.length; i++ ) {
			var r = e.charCodeAt( i );
			if( 55296 <= r && r <= 56319 ) {
				var a = e.charCodeAt( ++i );
				if( isNaN( a ) ) throw new Error( m( p.MALFORMED_UNICODE, [ r, a ] ) );
				r = (r - 55296 << 10) + (a - 56320) + 65536
			}
			r <= 127 ? t[ o++ ] = r : r <= 2047 ? (t[ o++ ] = r >> 6 & 31 | 192, t[ o++ ] = 63 & r | 128) : r <= 65535 ? (t[ o++ ] = r >> 12 & 15 | 224, t[ o++ ] = r >> 6 & 63 | 128, t[ o++ ] = 63 & r | 128) : (t[ o++ ] = r >> 18 & 7 | 240, t[ o++ ] = r >> 12 & 63 | 128, t[ o++ ] = r >> 6 & 63 | 128, t[ o++ ] = 63 & r | 128)
		}
		return t
	}

	function u( e, t, n ) {
		for( var o, i = "", r = t; r < t + n; ) {
			var a = e[ r++ ];
			if( a < 128 ) o = a; else {
				var s = e[ r++ ] - 128;
				if( s < 0 ) throw new Error( m( p.MALFORMED_UTF, [ a.toString( 16 ), s.toString( 16 ), "" ] ) );
				if( a < 224 ) o = 64 * (a - 192) + s; else {
					var u = e[ r++ ] - 128;
					if( u < 0 ) throw new Error( m( p.MALFORMED_UTF, [ a.toString( 16 ), s.toString( 16 ), u.toString( 16 ) ] ) );
					if( a < 240 ) o = 4096 * (a - 224) + 64 * s + u; else {
						var c = e[ r++ ] - 128;
						if( c < 0 ) throw new Error( m( p.MALFORMED_UTF, [ a.toString( 16 ), s.toString( 16 ), u.toString( 16 ), c.toString( 16 ) ] ) );
						if( !(a < 248) ) throw new Error( m( p.MALFORMED_UTF, [ a.toString( 16 ), s.toString( 16 ), u.toString( 16 ), c.toString( 16 ) ] ) );
						o = 262144 * (a - 240) + 4096 * s + 64 * u + c
					}
				}
			}
			o > 65535 && (o -= 65536, i += String.fromCharCode( 55296 + (o >> 10) ), o = 56320 + (1023 & o)), i += String.fromCharCode( o )
		}
		return i
	}

	var c = "@VERSION@", l = {
		CONNECT    : 1,
		CONNACK    : 2,
		PUBLISH    : 3,
		PUBACK     : 4,
		PUBREC     : 5,
		PUBREL     : 6,
		PUBCOMP    : 7,
		SUBSCRIBE  : 8,
		SUBACK     : 9,
		UNSUBSCRIBE: 10,
		UNSUBACK   : 11,
		PINGREQ    : 12,
		PINGRESP   : 13,
		DISCONNECT : 14
	}, d  = function( e, t ) {
		for( var n in e ) if( e.hasOwnProperty( n ) ) {
			if( !t.hasOwnProperty( n ) ) {
				var o = "Unknown property, " + n + ". Valid properties are:";
				for( var n in t ) t.hasOwnProperty( n ) && (o = o + " " + n);
				throw new Error( o )
			}
			if( typeof e[ n ] !== t[ n ] ) throw new Error( m( p.INVALID_TYPE, [ typeof e[ n ], n ] ) )
		}
	}, f  = function( e, t ) {
		return function() {
			return e.apply( t, arguments )
		}
	}, p  = {
		OK                       : { code: 0, text: "AMQJSC0000I OK." },
		CONNECT_TIMEOUT          : { code: 1, text: "AMQJSC0001E Connect timed out." },
		SUBSCRIBE_TIMEOUT        : { code: 2, text: "AMQJS0002E Subscribe timed out." },
		UNSUBSCRIBE_TIMEOUT      : { code: 3, text: "AMQJS0003E Unsubscribe timed out." },
		PING_TIMEOUT             : { code: 4, text: "AMQJS0004E Ping timed out." },
		INTERNAL_ERROR           : { code: 5, text: "AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}" },
		CONNACK_RETURNCODE       : { code: 6, text: "AMQJS0006E Bad Connack return code:{0} {1}." },
		SOCKET_ERROR             : { code: 7, text: "AMQJS0007E Socket error:{0}." },
		SOCKET_CLOSE             : { code: 8, text: "AMQJS0008I Socket closed." },
		MALFORMED_UTF            : { code: 9, text: "AMQJS0009E Malformed UTF data:{0} {1} {2}." },
		UNSUPPORTED              : { code: 10, text: "AMQJS0010E {0} is not supported by this browser." },
		INVALID_STATE            : { code: 11, text: "AMQJS0011E Invalid state {0}." },
		INVALID_TYPE             : { code: 12, text: "AMQJS0012E Invalid type {0} for {1}." },
		INVALID_ARGUMENT         : { code: 13, text: "AMQJS0013E Invalid argument {0} for {1}." },
		UNSUPPORTED_OPERATION    : { code: 14, text: "AMQJS0014E Unsupported operation." },
		INVALID_STORED_DATA      : { code: 15, text: "AMQJS0015E Invalid data in local storage key={0} value={1}." },
		INVALID_MQTT_MESSAGE_TYPE: { code: 16, text: "AMQJS0016E Invalid MQTT message type {0}." },
		MALFORMED_UNICODE        : { code: 17, text: "AMQJS0017E Malformed Unicode string:{0} {1}." }
	}, h  = {
		0: "Connection Accepted",
		1: "Connection Refused: unacceptable protocol version",
		2: "Connection Refused: identifier rejected",
		3: "Connection Refused: server unavailable",
		4: "Connection Refused: bad user name or password",
		5: "Connection Refused: not authorized"
	}, m  = function( e, t ) {
		var n = e.text;
		if( t ) for( var o, i, r = 0; r < t.length; r++ ) if( o = "{" + r + "}", i = n.indexOf( o ), i > 0 ) {
			var a = n.substring( 0, i ), s = n.substring( i + o.length );
			n = a + t[ r ] + s
		}
		return n
	}, g  = [ 0, 6, 77, 81, 73, 115, 100, 112, 3 ], b = [ 0, 4, 77, 81, 84, 84, 4 ], v = function( e, t ) {
		this.type = e;
		for( var n in t ) t.hasOwnProperty( n ) && (this[ n ] = t[ n ])
	};
	v.prototype.encode = function() {
		var e = (15 & this.type) << 4, t = 0, i = new Array, s = 0;
		switch( void 0 != this.messageIdentifier && (t += 2), this.type ) {
			case l.CONNECT:
				switch( this.mqttVersion ) {
					case 3:
						t += g.length + 3;
						break;
					case 4:
						t += b.length + 3
				}
				if( t += a( this.clientId ) + 2, void 0 != this.willMessage ) {
					t += a( this.willMessage.destinationName ) + 2;
					var u = this.willMessage.payloadBytes;
					u instanceof Uint8Array || (u = new Uint8Array( d )), t += u.byteLength + 2
				}
				void 0 != this.userName && (t += a( this.userName ) + 2), void 0 != this.password && (t += a( this.password ) + 2);
				break;
			case l.SUBSCRIBE:
				e |= 2;
				for( var c = 0; c < this.topics.length; c++ ) i[ c ] = a( this.topics[ c ] ), t += i[ c ] + 2;
				t += this.requestedQos.length;
				break;
			case l.UNSUBSCRIBE:
				e |= 2;
				for( var c = 0; c < this.topics.length; c++ ) i[ c ] = a( this.topics[ c ] ), t += i[ c ] + 2;
				break;
			case l.PUBREL:
				e |= 2;
				break;
			case l.PUBLISH:
				this.payloadMessage.duplicate && (e |= 8), e = e |= this.payloadMessage.qos << 1, this.payloadMessage.retained && (e |= 1), s = a( this.payloadMessage.destinationName ), t += s + 2;
				var d = this.payloadMessage.payloadBytes;
				t += d.byteLength, d instanceof ArrayBuffer ? d = new Uint8Array( d ) : d instanceof Uint8Array || (d = new Uint8Array( d.buffer ));
				break;
			case l.DISCONNECT:
		}
		var f = r( t ), p = f.length + 1, h = new ArrayBuffer( t + p ), m = new Uint8Array( h );
		if( m[ 0 ] = e, m.set( f, 1 ), this.type == l.PUBLISH ) p = o( this.payloadMessage.destinationName, s, m, p ); else if( this.type == l.CONNECT ) {
			switch( this.mqttVersion ) {
				case 3:
					m.set( g, p ), p += g.length;
					break;
				case 4:
					m.set( b, p ), p += b.length
			}
			var v = 0;
			this.cleanSession && (v = 2), void 0 != this.willMessage && (v |= 4, v |= this.willMessage.qos << 3, this.willMessage.retained && (v |= 32)), void 0 != this.userName && (v |= 128), void 0 != this.password && (v |= 64), m[ p++ ] = v, p = n( this.keepAliveInterval, m, p )
		}
		switch( void 0 != this.messageIdentifier && (p = n( this.messageIdentifier, m, p )), this.type ) {
			case l.CONNECT:
				p = o( this.clientId, a( this.clientId ), m, p ), void 0 != this.willMessage && (p = o( this.willMessage.destinationName, a( this.willMessage.destinationName ), m, p ), p = n( u.byteLength, m, p ), m.set( u, p ), p += u.byteLength), void 0 != this.userName && (p = o( this.userName, a( this.userName ), m, p )), void 0 != this.password && (p = o( this.password, a( this.password ), m, p ));
				break;
			case l.PUBLISH:
				m.set( d, p );
				break;
			case l.SUBSCRIBE:
				for( var c = 0; c < this.topics.length; c++ ) p = o( this.topics[ c ], i[ c ], m, p ), m[ p++ ] = this.requestedQos[ c ];
				break;
			case l.UNSUBSCRIBE:
				for( var c = 0; c < this.topics.length; c++ ) p = o( this.topics[ c ], i[ c ], m, p )
		}
		return h
	};
	var w = function( e, t, n ) {
		this._client = e, this._window = t, this._keepAliveInterval = 1e3 * n, this.isReset = !1;
		var o = new v( l.PINGREQ ).encode(), i = function( e ) {
			return function() {
				return r.apply( e )
			}
		}, r  = function() {
			this.isReset ? (this.isReset = !1, this._client._trace( "Pinger.doPing", "send PINGREQ" ), this._client.socket.send( o ), this.timeout = this._window.setTimeout( i( this ), this._keepAliveInterval )) : (this._client._trace( "Pinger.doPing", "Timed out" ), this._client._disconnected( p.PING_TIMEOUT.code, m( p.PING_TIMEOUT ) ))
		};
		this.reset = function() {
			this.isReset = !0, this._window.clearTimeout( this.timeout ), this._keepAliveInterval > 0 && (this.timeout = setTimeout( i( this ), this._keepAliveInterval ))
		}, this.cancel = function() {
			this._window.clearTimeout( this.timeout )
		}
	}, _  = function( e, t, n, o, i ) {
		this._window = t, n || (n = 30);
		var r = function( e, t, n ) {
			return function() {
				return e.apply( t, n )
			}
		};
		this.timeout = setTimeout( r( o, e, i ), 1e3 * n ), this.cancel = function() {
			this._window.clearTimeout( this.timeout )
		}
	}, $  = function( t, n, o, i, r ) {
		if( !("WebSocket" in e && null !== e.WebSocket) ) throw new Error( m( p.UNSUPPORTED, [ "WebSocket" ] ) );
		if( !("localStorage" in e && null !== e.localStorage) ) throw new Error( m( p.UNSUPPORTED, [ "localStorage" ] ) );
		if( !("ArrayBuffer" in e && null !== e.ArrayBuffer) ) throw new Error( m( p.UNSUPPORTED, [ "ArrayBuffer" ] ) );
		this._trace( "Paho.MQTT.Client", t, n, o, i, r ), this.host = n, this.port = o, this.path = i, this.uri = t, this.clientId = r, this._localKey = n + ":" + o + ("/mqtt" != i ? ":" + i : "") + ":" + r + ":", this._msg_queue = [], this._sentMessages = {}, this._receivedMessages = {}, this._notify_msg_sent = {}, this._message_identifier = 1, this._sequence = 0;
		for( var a in localStorage ) 0 != a.indexOf( "Sent:" + this._localKey ) && 0 != a.indexOf( "Received:" + this._localKey ) || this.restore( a )
	};
	$.prototype.host, $.prototype.port, $.prototype.path, $.prototype.uri, $.prototype.clientId, $.prototype.socket, $.prototype.connected = !1, $.prototype.maxMessageIdentifier = 65536, $.prototype.connectOptions, $.prototype.hostIndex, $.prototype.onConnectionLost, $.prototype.onMessageDelivered, $.prototype.onMessageArrived, $.prototype.traceFunction, $.prototype._msg_queue = null, $.prototype._connectTimeout, $.prototype.sendPinger = null, $.prototype.receivePinger = null, $.prototype.receiveBuffer = null, $.prototype._traceBuffer = null, $.prototype._MAX_TRACE_ENTRIES = 100, $.prototype.connect = function( e ) {
		var t = this._traceMask( e, "password" );
		if( this._trace( "Client.connect", t, this.socket, this.connected ), this.connected ) throw new Error( m( p.INVALID_STATE, [ "already connected" ] ) );
		if( this.socket ) throw new Error( m( p.INVALID_STATE, [ "already connected" ] ) );
		this.connectOptions = e, e.uris ? (this.hostIndex = 0, this._doConnect( e.uris[ 0 ] )) : this._doConnect( this.uri )
	}, $.prototype.subscribe = function( e, t ) {
		if( this._trace( "Client.subscribe", e, t ), !this.connected ) throw new Error( m( p.INVALID_STATE, [ "not connected" ] ) );
		var n = new v( l.SUBSCRIBE );
		n.topics = [ e ], void 0 != t.qos ? n.requestedQos = [ t.qos ] : n.requestedQos = [ 0 ], t.onSuccess && (n.onSuccess = function( e ) {
			t.onSuccess( { invocationContext: t.invocationContext, grantedQos: e } )
		}), t.onFailure && (n.onFailure = function( e ) {
			t.onFailure( { invocationContext: t.invocationContext, errorCode: e } )
		}), t.timeout && (n.timeOut = new _( this, window, t.timeout, t.onFailure, [ {
			invocationContext: t.invocationContext,
			errorCode        : p.SUBSCRIBE_TIMEOUT.code,
			errorMessage     : m( p.SUBSCRIBE_TIMEOUT )
		} ] )), this._requires_ack( n ), this._schedule_message( n )
	}, $.prototype.unsubscribe = function( e, t ) {
		if( this._trace( "Client.unsubscribe", e, t ), !this.connected ) throw new Error( m( p.INVALID_STATE, [ "not connected" ] ) );
		var n = new v( l.UNSUBSCRIBE );
		n.topics = [ e ], t.onSuccess && (n.callback = function() {
			t.onSuccess( { invocationContext: t.invocationContext } )
		}), t.timeout && (n.timeOut = new _( this, window, t.timeout, t.onFailure, [ {
			invocationContext: t.invocationContext,
			errorCode        : p.UNSUBSCRIBE_TIMEOUT.code,
			errorMessage     : m( p.UNSUBSCRIBE_TIMEOUT )
		} ] )), this._requires_ack( n ), this._schedule_message( n )
	}, $.prototype.send = function( e ) {
		if( this._trace( "Client.send", e ), !this.connected ) throw new Error( m( p.INVALID_STATE, [ "not connected" ] ) );
		wireMessage = new v( l.PUBLISH ), wireMessage.payloadMessage = e, e.qos > 0 ? this._requires_ack( wireMessage ) : this.onMessageDelivered && (this._notify_msg_sent[ wireMessage ] = this.onMessageDelivered( wireMessage.payloadMessage )), this._schedule_message( wireMessage )
	}, $.prototype.disconnect = function() {
		if( this._trace( "Client.disconnect" ), !this.socket ) throw new Error( m( p.INVALID_STATE, [ "not connecting or connected" ] ) );
		wireMessage = new v( l.DISCONNECT ), this._notify_msg_sent[ wireMessage ] = f( this._disconnected, this ), this._schedule_message( wireMessage )
	}, $.prototype.getTraceLog = function() {
		if( null !== this._traceBuffer ) {
			this._trace( "Client.getTraceLog", new Date ), this._trace( "Client.getTraceLog in flight messages", this._sentMessages.length );
			for( var e in this._sentMessages ) this._trace( "_sentMessages ", e, this._sentMessages[ e ] );
			for( var e in this._receivedMessages ) this._trace( "_receivedMessages ", e, this._receivedMessages[ e ] );
			return this._traceBuffer
		}
	}, $.prototype.startTrace = function() {
		null === this._traceBuffer && (this._traceBuffer = []), this._trace( "Client.startTrace", new Date, c )
	}, $.prototype.stopTrace = function() {
		delete this._traceBuffer
	}, $.prototype._doConnect = function( e ) {
		if( this.connectOptions.useSSL ) {
			var t = e.split( ":" );
			t[ 0 ] = "wss", e = t.join( ":" )
		}
		this.connected = !1, this.connectOptions.mqttVersion < 4 ? this.socket = new WebSocket( e, [ "mqttv3.1" ] ) : this.socket = new WebSocket( e, [ "mqtt" ] ), this.socket.binaryType = "arraybuffer", this.socket.onopen = f( this._on_socket_open, this ), this.socket.onmessage = f( this._on_socket_message, this ), this.socket.onerror = f( this._on_socket_error, this ), this.socket.onclose = f( this._on_socket_close, this ), this.sendPinger = new w( this, window, this.connectOptions.keepAliveInterval ), this.receivePinger = new w( this, window, this.connectOptions.keepAliveInterval ), this._connectTimeout = new _( this, window, this.connectOptions.timeout, this._disconnected, [ p.CONNECT_TIMEOUT.code, m( p.CONNECT_TIMEOUT ) ] )
	}, $.prototype._schedule_message = function( e ) {
		this._msg_queue.push( e ), this.connected && this._process_queue()
	}, $.prototype.store = function( e, t ) {
		var n = { type: t.type, messageIdentifier: t.messageIdentifier, version: 1 };
		switch( t.type ) {
			case l.PUBLISH:
				t.pubRecReceived && (n.pubRecReceived = !0), n.payloadMessage = {};
				for( var o = "", i = t.payloadMessage.payloadBytes, r = 0; r < i.length; r++ ) i[ r ] <= 15 ? o = o + "0" + i[ r ].toString( 16 ) : o += i[ r ].toString( 16 );
				n.payloadMessage.payloadHex = o, n.payloadMessage.qos = t.payloadMessage.qos, n.payloadMessage.destinationName = t.payloadMessage.destinationName, t.payloadMessage.duplicate && (n.payloadMessage.duplicate = !0), t.payloadMessage.retained && (n.payloadMessage.retained = !0), 0 == e.indexOf( "Sent:" ) && (void 0 === t.sequence && (t.sequence = ++this._sequence), n.sequence = t.sequence);
				break;
			default:
				throw Error( m( p.INVALID_STORED_DATA, [ key, n ] ) )
		}
		localStorage.setItem( e + this._localKey + t.messageIdentifier, JSON.stringify( n ) )
	}, $.prototype.restore = function( e ) {
		var t = localStorage.getItem( e ), n = JSON.parse( t ), o = new v( n.type, n );
		switch( n.type ) {
			case l.PUBLISH:
				for( var i = n.payloadMessage.payloadHex, r = new ArrayBuffer( i.length / 2 ), a = new Uint8Array( r ), s = 0; i.length >= 2; ) {
					var u = parseInt( i.substring( 0, 2 ), 16 );
					i = i.substring( 2, i.length ), a[ s++ ] = u
				}
				var c = new Paho.MQTT.Message( a );
				c.qos = n.payloadMessage.qos, c.destinationName = n.payloadMessage.destinationName, n.payloadMessage.duplicate && (c.duplicate = !0), n.payloadMessage.retained && (c.retained = !0), o.payloadMessage = c;
				break;
			default:
				throw Error( m( p.INVALID_STORED_DATA, [ e, t ] ) )
		}
		0 == e.indexOf( "Sent:" + this._localKey ) ? (o.payloadMessage.duplicate = !0, this._sentMessages[ o.messageIdentifier ] = o) : 0 == e.indexOf( "Received:" + this._localKey ) && (this._receivedMessages[ o.messageIdentifier ] = o)
	}, $.prototype._process_queue = function() {
		for( var e = null, t = this._msg_queue.reverse(); e = t.pop(); ) this._socket_send( e ), this._notify_msg_sent[ e ] && (this._notify_msg_sent[ e ](), delete this._notify_msg_sent[ e ])
	}, $.prototype._requires_ack = function( e ) {
		var t = Object.keys( this._sentMessages ).length;
		if( t > this.maxMessageIdentifier ) throw Error( "Too many messages:" + t );
		for( ; void 0 !== this._sentMessages[ this._message_identifier ]; ) this._message_identifier++;
		e.messageIdentifier = this._message_identifier, this._sentMessages[ e.messageIdentifier ] = e, e.type === l.PUBLISH && this.store( "Sent:", e ), this._message_identifier === this.maxMessageIdentifier && (this._message_identifier = 1)
	}, $.prototype._on_socket_open = function() {
		var e = new v( l.CONNECT, this.connectOptions );
		e.clientId = this.clientId, this._socket_send( e )
	}, $.prototype._on_socket_message = function( e ) {
		this._trace( "Client._on_socket_message", e.data );
		for( var t = this._deframeMessages( e.data ), n = 0; n < t.length; n += 1 ) this._handleMessage( t[ n ] )
	}, $.prototype._deframeMessages = function( e ) {
		var n = new Uint8Array( e );
		if( this.receiveBuffer ) {
			var o = new Uint8Array( this.receiveBuffer.length + n.length );
			o.set( this.receiveBuffer ), o.set( n, this.receiveBuffer.length ), n = o, delete this.receiveBuffer
		}
		try {
			for( var i = 0, r = []; i < n.length; ) {
				var a = t( n, i ), s = a[ 0 ];
				if( i = a[ 1 ], null === s ) break;
				r.push( s )
			}
			i < n.length && (this.receiveBuffer = n.subarray( i ))
		} catch( e ) {
			return void this._disconnected( p.INTERNAL_ERROR.code, m( p.INTERNAL_ERROR, [ e.message, e.stack.toString() ] ) )
		}
		return r
	}, $.prototype._handleMessage = function( e ) {
		this._trace( "Client._handleMessage", e );
		try {
			switch( e.type ) {
				case l.CONNACK:
					if( this._connectTimeout.cancel(), this.connectOptions.cleanSession ) {
						for( var t in this._sentMessages ) {
							var n = this._sentMessages[ t ];
							localStorage.removeItem( "Sent:" + this._localKey + n.messageIdentifier )
						}
						this._sentMessages = {};
						for( var t in this._receivedMessages ) {
							var o = this._receivedMessages[ t ];
							localStorage.removeItem( "Received:" + this._localKey + o.messageIdentifier )
						}
						this._receivedMessages = {}
					}
					if( 0 !== e.returnCode ) {
						this._disconnected( p.CONNACK_RETURNCODE.code, m( p.CONNACK_RETURNCODE, [ e.returnCode, h[ e.returnCode ] ] ) );
						break
					}
					this.connected = !0, this.connectOptions.uris && (this.hostIndex = this.connectOptions.uris.length);
					var i = new Array;
					for( var r in this._sentMessages ) this._sentMessages.hasOwnProperty( r ) && i.push( this._sentMessages[ r ] );
					for( var i = i.sort( function( e, t ) {
						return e.sequence - t.sequence
					} ), a     = 0, s = i.length; a < s; a++ ) {
						var n = i[ a ];
						if( n.type == l.PUBLISH && n.pubRecReceived ) {
							var u = new v( l.PUBREL, { messageIdentifier: n.messageIdentifier } );
							this._schedule_message( u )
						} else this._schedule_message( n )
					}
					this.connectOptions.onSuccess && this.connectOptions.onSuccess( { invocationContext: this.connectOptions.invocationContext } ), this._process_queue();
					break;
				case l.PUBLISH:
					this._receivePublish( e );
					break;
				case l.PUBACK:
					var n = this._sentMessages[ e.messageIdentifier ];
					n && (delete this._sentMessages[ e.messageIdentifier ], localStorage.removeItem( "Sent:" + this._localKey + e.messageIdentifier ), this.onMessageDelivered && this.onMessageDelivered( n.payloadMessage ));
					break;
				case l.PUBREC:
					var n = this._sentMessages[ e.messageIdentifier ];
					if( n ) {
						n.pubRecReceived = !0;
						var u = new v( l.PUBREL, { messageIdentifier: e.messageIdentifier } );
						this.store( "Sent:", n ), this._schedule_message( u )
					}
					break;
				case l.PUBREL:
					var o = this._receivedMessages[ e.messageIdentifier ];
					localStorage.removeItem( "Received:" + this._localKey + e.messageIdentifier ), o && (this._receiveMessage( o ), delete this._receivedMessages[ e.messageIdentifier ]);
					var c = new v( l.PUBCOMP, { messageIdentifier: e.messageIdentifier } );
					this._schedule_message( c );
					break;
				case l.PUBCOMP:
					var n = this._sentMessages[ e.messageIdentifier ];
					delete this._sentMessages[ e.messageIdentifier ], localStorage.removeItem( "Sent:" + this._localKey + e.messageIdentifier ), this.onMessageDelivered && this.onMessageDelivered( n.payloadMessage );
					break;
				case l.SUBACK:
					var n = this._sentMessages[ e.messageIdentifier ];
					n && (n.timeOut && n.timeOut.cancel(), 128 === e.returnCode[ 0 ] ? n.onFailure && n.onFailure( e.returnCode ) : n.onSuccess && n.onSuccess( e.returnCode ), delete this._sentMessages[ e.messageIdentifier ]);
					break;
				case l.UNSUBACK:
					var n = this._sentMessages[ e.messageIdentifier ];
					n && (n.timeOut && n.timeOut.cancel(), n.callback && n.callback(), delete this._sentMessages[ e.messageIdentifier ]);
					break;
				case l.PINGRESP:
					this.sendPinger.reset();
					break;
				case l.DISCONNECT:
					this._disconnected( p.INVALID_MQTT_MESSAGE_TYPE.code, m( p.INVALID_MQTT_MESSAGE_TYPE, [ e.type ] ) );
					break;
				default:
					this._disconnected( p.INVALID_MQTT_MESSAGE_TYPE.code, m( p.INVALID_MQTT_MESSAGE_TYPE, [ e.type ] ) )
			}
		} catch( e ) {
			return void this._disconnected( p.INTERNAL_ERROR.code, m( p.INTERNAL_ERROR, [ e.message, e.stack.toString() ] ) )
		}
	}, $.prototype._on_socket_error = function( e ) {
		this._disconnected( p.SOCKET_ERROR.code, m( p.SOCKET_ERROR, [ e.data ] ) )
	}, $.prototype._on_socket_close = function() {
		this._disconnected( p.SOCKET_CLOSE.code, m( p.SOCKET_CLOSE ) )
	}, $.prototype._socket_send = function( e ) {
		if( 1 == e.type ) {
			var t = this._traceMask( e, "password" );
			this._trace( "Client._socket_send", t )
		} else this._trace( "Client._socket_send", e );
		this.socket.send( e.encode() ), this.sendPinger.reset()
	}, $.prototype._receivePublish = function( e ) {
		switch( e.payloadMessage.qos ) {
			case"undefined":
			case 0:
				this._receiveMessage( e );
				break;
			case 1:
				var t = new v( l.PUBACK, { messageIdentifier: e.messageIdentifier } );
				this._schedule_message( t ), this._receiveMessage( e );
				break;
			case 2:
				this._receivedMessages[ e.messageIdentifier ] = e, this.store( "Received:", e );
				var n = new v( l.PUBREC, { messageIdentifier: e.messageIdentifier } );
				this._schedule_message( n );
				break;
			default:
				throw Error( "Invaild qos=" + wireMmessage.payloadMessage.qos )
		}
	}, $.prototype._receiveMessage = function( e ) {
		this.onMessageArrived && this.onMessageArrived( e.payloadMessage )
	}, $.prototype._disconnected = function( e, t ) {
		this._trace( "Client._disconnected", e, t ), this.sendPinger.cancel(), this.receivePinger.cancel(), this._connectTimeout && this._connectTimeout.cancel(), this._msg_queue = [], this._notify_msg_sent = {}, this.socket && (this.socket.onopen = null, this.socket.onmessage = null, this.socket.onerror = null, this.socket.onclose = null, 1 === this.socket.readyState && this.socket.close(), delete this.socket), this.connectOptions.uris && this.hostIndex < this.connectOptions.uris.length - 1 ? (this.hostIndex++, this._doConnect( this.connectOptions.uris[ this.hostIndex ] )) : (void 0 === e && (e = p.OK.code, t = m( p.OK )), this.connected ? (this.connected = !1, this.onConnectionLost && this.onConnectionLost( {
			errorCode   : e,
			errorMessage: t
		} )) : 4 === this.connectOptions.mqttVersion && this.connectOptions.mqttVersionExplicit === !1 ? (this._trace( "Failed to connect V4, dropping back to V3" ), this.connectOptions.mqttVersion = 3, this.connectOptions.uris ? (this.hostIndex = 0, this._doConnect( this.connectOptions.uris[ 0 ] )) : this._doConnect( this.uri )) : this.connectOptions.onFailure && this.connectOptions.onFailure( {
			invocationContext: this.connectOptions.invocationContext,
			errorCode        : e,
			errorMessage     : t
		} ))
	}, $.prototype._trace = function() {
		if( this.traceFunction ) {
			for( var e in arguments ) "undefined" != typeof arguments[ e ] && (arguments[ e ] = JSON.stringify( arguments[ e ] ));
			var t = Array.prototype.slice.call( arguments ).join( "" );
			this.traceFunction( { severity: "Debug", message: t } )
		}
		if( null !== this._traceBuffer ) for( var e = 0, n = arguments.length; e < n; e++ ) this._traceBuffer.length == this._MAX_TRACE_ENTRIES && this._traceBuffer.shift(), 0 === e ? this._traceBuffer.push( arguments[ e ] ) : "undefined" == typeof arguments[ e ] ? this._traceBuffer.push( arguments[ e ] ) : this._traceBuffer.push( "  " + JSON.stringify( arguments[ e ] ) )
	}, $.prototype._traceMask = function( e, t ) {
		var n = {};
		for( var o in e ) e.hasOwnProperty( o ) && (o == t ? n[ o ] = "******" : n[ o ] = e[ o ]);
		return n
	};
	var y = function( e, t, n, o ) {
		var i;
		if( "string" != typeof e ) throw new Error( m( p.INVALID_TYPE, [ typeof e, "host" ] ) );
		if( 2 == arguments.length ) {
			o = t, i = e;
			var r = i.match( /^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/ );
			if( !r ) throw new Error( m( p.INVALID_ARGUMENT, [ e, "host" ] ) );
			e = r[ 4 ] || r[ 2 ], t = parseInt( r[ 7 ] ), n = r[ 8 ]
		} else {
			if( 3 == arguments.length && (o = n, n = "/mqtt"), "number" != typeof t || t < 0 ) throw new Error( m( p.INVALID_TYPE, [ typeof t, "port" ] ) );
			if( "string" != typeof n ) throw new Error( m( p.INVALID_TYPE, [ typeof n, "path" ] ) );
			var a = e.indexOf( ":" ) != -1 && "[" != e.slice( 0, 1 ) && "]" != e.slice( -1 );
			i = "ws://" + (a ? "[" + e + "]" : e) + ":" + t + n
		}
		for( var s = 0, u = 0; u < o.length; u++ ) {
			var c = o.charCodeAt( u );
			55296 <= c && c <= 56319 && u++, s++
		}
		if( "string" != typeof o || s > 65535 ) throw new Error( m( p.INVALID_ARGUMENT, [ o, "clientId" ] ) );
		var l = new $( i, e, t, n, o );
		this._getHost = function() {
			return e
		}, this._setHost = function() {
			throw new Error( m( p.UNSUPPORTED_OPERATION ) )
		}, this._getPort = function() {
			return t
		}, this._setPort = function() {
			throw new Error( m( p.UNSUPPORTED_OPERATION ) )
		}, this._getPath = function() {
			return n
		}, this._setPath = function() {
			throw new Error( m( p.UNSUPPORTED_OPERATION ) )
		}, this._getURI = function() {
			return i
		}, this._setURI = function() {
			throw new Error( m( p.UNSUPPORTED_OPERATION ) )
		}, this._getClientId = function() {
			return l.clientId
		}, this._setClientId = function() {
			throw new Error( m( p.UNSUPPORTED_OPERATION ) )
		}, this._getOnConnectionLost = function() {
			return l.onConnectionLost
		}, this._setOnConnectionLost = function( e ) {
			if( "function" != typeof e ) throw new Error( m( p.INVALID_TYPE, [ typeof e, "onConnectionLost" ] ) );
			l.onConnectionLost = e
		}, this._getOnMessageDelivered = function() {
			return l.onMessageDelivered
		}, this._setOnMessageDelivered = function( e ) {
			if( "function" != typeof e ) throw new Error( m( p.INVALID_TYPE, [ typeof e, "onMessageDelivered" ] ) );
			l.onMessageDelivered = e
		}, this._getOnMessageArrived = function() {
			return l.onMessageArrived
		}, this._setOnMessageArrived = function( e ) {
			if( "function" != typeof e ) throw new Error( m( p.INVALID_TYPE, [ typeof e, "onMessageArrived" ] ) );
			l.onMessageArrived = e
		}, this._getTrace = function() {
			return l.traceFunction
		}, this._setTrace = function( e ) {
			if( "function" != typeof e ) throw new Error( m( p.INVALID_TYPE, [ typeof e, "onTrace" ] ) );
			l.traceFunction = e
		}, this.connect = function( e ) {
			if( e = e || {}, d( e, {
					timeout            : "number",
					userName           : "string",
					password           : "string",
					willMessage        : "object",
					keepAliveInterval  : "number",
					cleanSession       : "boolean",
					useSSL             : "boolean",
					invocationContext  : "object",
					onSuccess          : "function",
					onFailure          : "function",
					hosts              : "object",
					ports              : "object",
					mqttVersion        : "number",
					mqttVersionExplicit: "boolean",
					uris               : "object"
				} ), void 0 === e.keepAliveInterval && (e.keepAliveInterval = 60), e.mqttVersion > 4 || e.mqttVersion < 3 ) throw new Error( m( p.INVALID_ARGUMENT, [ e.mqttVersion, "connectOptions.mqttVersion" ] ) );
			if( void 0 === e.mqttVersion ? (e.mqttVersionExplicit = !1, e.mqttVersion = 4) : e.mqttVersionExplicit = !0, void 0 !== e.password && void 0 === e.userName ) throw new Error( m( p.INVALID_ARGUMENT, [ e.password, "connectOptions.password" ] ) );
			if( e.willMessage ) {
				if( !(e.willMessage instanceof T) ) throw new Error( m( p.INVALID_TYPE, [ e.willMessage, "connectOptions.willMessage" ] ) );
				if( e.willMessage.stringPayload, "undefined" == typeof e.willMessage.destinationName ) throw new Error( m( p.INVALID_TYPE, [ typeof e.willMessage.destinationName, "connectOptions.willMessage.destinationName" ] ) )
			}
			if( "undefined" == typeof e.cleanSession && (e.cleanSession = !0), e.hosts ) {
				if( !(e.hosts instanceof Array) ) throw new Error( m( p.INVALID_ARGUMENT, [ e.hosts, "connectOptions.hosts" ] ) );
				if( e.hosts.length < 1 ) throw new Error( m( p.INVALID_ARGUMENT, [ e.hosts, "connectOptions.hosts" ] ) );
				for( var t = !1, o = 0; o < e.hosts.length; o++ ) {
					if( "string" != typeof e.hosts[ o ] ) throw new Error( m( p.INVALID_TYPE, [ typeof e.hosts[ o ], "connectOptions.hosts[" + o + "]" ] ) );
					if( /^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test( e.hosts[ o ] ) ) {
						if( 0 == o ) t = !0; else if( !t ) throw new Error( m( p.INVALID_ARGUMENT, [ e.hosts[ o ], "connectOptions.hosts[" + o + "]" ] ) )
					} else if( t ) throw new Error( m( p.INVALID_ARGUMENT, [ e.hosts[ o ], "connectOptions.hosts[" + o + "]" ] ) )
				}
				if( t ) e.uris = e.hosts; else {
					if( !e.ports ) throw new Error( m( p.INVALID_ARGUMENT, [ e.ports, "connectOptions.ports" ] ) );
					if( !(e.ports instanceof Array) ) throw new Error( m( p.INVALID_ARGUMENT, [ e.ports, "connectOptions.ports" ] ) );
					if( e.hosts.length != e.ports.length ) throw new Error( m( p.INVALID_ARGUMENT, [ e.ports, "connectOptions.ports" ] ) );
					e.uris = [];
					for( var o = 0; o < e.hosts.length; o++ ) {
						if( "number" != typeof e.ports[ o ] || e.ports[ o ] < 0 ) throw new Error( m( p.INVALID_TYPE, [ typeof e.ports[ o ], "connectOptions.ports[" + o + "]" ] ) );
						var r = e.hosts[ o ], a = e.ports[ o ], s = r.indexOf( ":" ) != -1;
						i = "ws://" + (s ? "[" + r + "]" : r) + ":" + a + n, e.uris.push( i )
					}
				}
			}
			l.connect( e )
		}, this.subscribe = function( e, t ) {
			if( "string" != typeof e ) throw new Error( "Invalid argument:" + e );
			if( t = t || {}, d( t, {
					qos              : "number",
					invocationContext: "object",
					onSuccess        : "function",
					onFailure        : "function",
					timeout          : "number"
				} ), t.timeout && !t.onFailure ) throw new Error( "subscribeOptions.timeout specified with no onFailure callback." );
			if( "undefined" != typeof t.qos && 0 !== t.qos && 1 !== t.qos && 2 !== t.qos ) throw new Error( m( p.INVALID_ARGUMENT, [ t.qos, "subscribeOptions.qos" ] ) );
			l.subscribe( e, t )
		}, this.unsubscribe = function( e, t ) {
			if( "string" != typeof e ) throw new Error( "Invalid argument:" + e );
			if( t = t || {}, d( t, {
					invocationContext: "object",
					onSuccess        : "function",
					onFailure        : "function",
					timeout          : "number"
				} ), t.timeout && !t.onFailure ) throw new Error( "unsubscribeOptions.timeout specified with no onFailure callback." );
			l.unsubscribe( e, t )
		}, this.send = function( e, t, n, o ) {
			var i;
			if( 0 == arguments.length ) throw new Error( "Invalid argument.length" );
			if( 1 == arguments.length ) {
				if( !(e instanceof T) && "string" != typeof e ) throw new Error( "Invalid argument:" + typeof e );
				if( i = e, "undefined" == typeof i.destinationName ) throw new Error( m( p.INVALID_ARGUMENT, [ i.destinationName, "Message.destinationName" ] ) );
				l.send( i )
			} else i = new T( t ), i.destinationName = e, arguments.length >= 3 && (i.qos = n), arguments.length >= 4 && (i.retained = o), l.send( i )
		}, this.disconnect = function() {
			l.disconnect()
		}, this.getTraceLog = function() {
			return l.getTraceLog()
		}, this.startTrace = function() {
			l.startTrace()
		}, this.stopTrace = function() {
			l.stopTrace()
		}, this.isConnected = function() {
			return l.connected
		}
	};
	y.prototype = {
		get host() {
			return this._getHost()
		}, set host( e ) {
			this._setHost( e )
		}, get port() {
			return this._getPort()
		}, set port( e ) {
			this._setPort( e )
		}, get path() {
			return this._getPath()
		}, set path( e ) {
			this._setPath( e )
		}, get clientId() {
			return this._getClientId()
		}, set clientId( e ) {
			this._setClientId( e )
		}, get onConnectionLost() {
			return this._getOnConnectionLost()
		}, set onConnectionLost( e ) {
			this._setOnConnectionLost( e )
		}, get onMessageDelivered() {
			return this._getOnMessageDelivered()
		}, set onMessageDelivered( e ) {
			this._setOnMessageDelivered( e )
		}, get onMessageArrived() {
			return this._getOnMessageArrived()
		}, set onMessageArrived( e ) {
			this._setOnMessageArrived( e )
		}, get trace() {
			return this._getTrace()
		}, set trace( e ) {
			this._setTrace( e )
		}
	};
	var T = function( e ) {
		var t;
		if( !("string" == typeof e || e instanceof ArrayBuffer || e instanceof Int8Array || e instanceof Uint8Array || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array) ) throw m( p.INVALID_ARGUMENT, [ e, "newPayload" ] );
		t = e, this._getPayloadString = function() {
			return "string" == typeof t ? t : u( t, 0, t.length )
		}, this._getPayloadBytes = function() {
			if( "string" == typeof t ) {
				var e = new ArrayBuffer( a( t ) ), n = new Uint8Array( e );
				return s( t, n, 0 ), n
			}
			return t
		};
		var n = void 0;
		this._getDestinationName = function() {
			return n
		}, this._setDestinationName = function( e ) {
			if( "string" != typeof e ) throw new Error( m( p.INVALID_ARGUMENT, [ e, "newDestinationName" ] ) );
			n = e
		};
		var o = 0;
		this._getQos = function() {
			return o
		}, this._setQos = function( e ) {
			if( 0 !== e && 1 !== e && 2 !== e ) throw new Error( "Invalid argument:" + e );
			o = e
		};
		var i = !1;
		this._getRetained = function() {
			return i
		}, this._setRetained = function( e ) {
			if( "boolean" != typeof e ) throw new Error( m( p.INVALID_ARGUMENT, [ e, "newRetained" ] ) );
			i = e
		};
		var r = !1;
		this._getDuplicate = function() {
			return r
		}, this._setDuplicate = function( e ) {
			r = e
		}
	};
	return T.prototype = {
		get payloadString() {
			return this._getPayloadString()
		}, get payloadBytes() {
			return this._getPayloadBytes()
		}, get destinationName() {
			return this._getDestinationName()
		}, set destinationName( e ) {
			this._setDestinationName( e )
		}, get qos() {
			return this._getQos()
		}, set qos( e ) {
			this._setQos( e )
		}, get retained() {
			return this._getRetained()
		}, set retained( e ) {
			this._setRetained( e )
		}, get duplicate() {
			return this._getDuplicate()
		}, set duplicate( e ) {
			this._setDuplicate( e )
		}
	}, { Client: y, Message: T }
}( window ), Array.prototype.find || Object.defineProperty( Array.prototype, "find", {
	value: function( e ) {
		if( null == this ) throw new TypeError( '"this" is null or not defined' );
		var t = Object( this ), n = t.length >>> 0;
		if( "function" != typeof e ) throw new TypeError( "predicate must be a function" );
		for( var o = arguments[ 1 ], i = 0; i < n; ) {
			var r = t[ i ];
			if( e.call( o, r, i, t ) ) return r;
			i++
		}
	}
} ), Array.prototype.findIndex || Object.defineProperty( Array.prototype, "findIndex", {
	value: function( e ) {
		if( null == this ) throw new TypeError( '"this" is null or not defined' );
		var t = Object( this ), n = t.length >>> 0;
		if( "function" != typeof e ) throw new TypeError( "predicate must be a function" );
		for( var o = arguments[ 1 ], i = 0; i < n; ) {
			var r = t[ i ];
			if( e.call( o, r, i, t ) ) return i;
			i++
		}
		return -1
	}
} );
var Markdown;
Markdown = "object" == typeof exports && "function" == typeof require ? exports : {}, function() {
	function e( e ) {
		return e
	}

	function t( e ) {
		return !1
	}

	function n() {
	}

	function o() {
	}

	n.prototype = {
		chain      : function( t, n ) {
			var o = this[ t ];
			if( !o ) throw new Error( "unknown hook " + t );
			o === e ? this[ t ] = n : this[ t ] = function( e ) {
				var t = Array.prototype.slice.call( arguments, 0 );
				return t[ 0 ] = o.apply( null, t ), n.apply( null, t )
			}
		}, set     : function( e, t ) {
			if( !this[ e ] ) throw new Error( "unknown hook " + e );
			this[ e ] = t
		}, addNoop : function( t ) {
			this[ t ] = e
		}, addFalse: function( e ) {
			this[ e ] = t
		}
	}, Markdown.HookCollection = n, o.prototype = {
		set   : function( e, t ) {
			this[ "s_" + e ] = t
		}, get: function( e ) {
			return this[ "s_" + e ]
		}
	}, Markdown.Converter = function( t ) {
		function i( e ) {
			return e = e.replace( /^[ ]{0,3}\[([^\[\]]+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?(?=\s|$)[ \t]*\n?[ \t]*((\n*)["(](.+?)[")][ \t]*)?(\n+)/gm, function( e, t, n, o, i, r, a ) {
				return t = t.toLowerCase(), L.set( t, C( n ) ), i ? o + a : (r && B.set( t, r.replace( /"/g, "&quot;" ) ), "")
			} )
		}

		function r( e ) {
			return e = e.replace( /^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm, s ), e = e.replace( /^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm, s ), e = e.replace( /\n[ ]{0,3}((<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g, s ), e = e.replace( /\n\n[ ]{0,3}(<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>[ \t]*(?=\n{2,}))/g, s ), e = e.replace( /(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g, s )
		}

		function a( e ) {
			return e = e.replace( /(^\n+|\n+$)/g, "" ), "\n\n~K" + (D.push( e ) - 1) + "K\n\n"
		}

		function s( e, t ) {
			return a( t )
		}

		function u( e, t, n ) {
			e = x.preBlockGamut( e, V ), e = g( e );
			var o = "<hr />\n";
			return e = e.replace( /^[ ]{0,2}( ?\*){3,}[ \t]*$/gm, o ), e = e.replace( /^[ ]{0,2}( ?-){3,}[ \t]*$/gm, o ), e = e.replace( /^[ ]{0,2}( ?_){3,}[ \t]*$/gm, o ), e = b( e ), e = w( e ), e = E( e ), e = x.postBlockGamut( e, V ), e = r( e ), e = k( e, t, n )
		}

		function c( e ) {
			return e = x.preSpanGamut( e ), e = _( e ), e = l( e ), e = S( e ), e = p( e ), e = d( e ), e = N( e ), e = e.replace( /~P/g, "://" ), e = C( e ), e = F( e ), e = e.replace( /  +\n/g, " <br>\n" ), e = x.postSpanGamut( e )
		}

		function l( e ) {
			var t = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>)/gi;
			return e = e.replace( t, function( e ) {
				var t = e.replace( /(.)<\/?code>(?=.)/g, "$1`" );
				return t = M( t, "!" == e.charAt( 1 ) ? "\\`*_/" : "\\`*_" )
			} )
		}

		function d( e ) {
			return e.indexOf( "[" ) === -1 ? e : (e = e.replace( /(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, f ), e = e.replace( /(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, f ), e = e.replace( /(\[([^\[\]]+)\])()()()()()/g, f ))
		}

		function f( e, t, n, o, i, r, a, s ) {
			void 0 == s && (s = "");
			var u = t, c = n.replace( /:\/\//g, "~P" ), l = o.toLowerCase(), d = i, f = s;
			if( "" == d ) if( "" == l && (l = c.toLowerCase().replace( / ?\n/g, " " )), d = "#" + l, void 0 != L.get( l ) ) d = L.get( l ), void 0 != B.get( l ) && (f = B.get( l )); else {
				if( !(u.search( /\(\s*\)$/m ) > -1) ) return u;
				d = ""
			}
			d = P( d );
			var p = '<a href="' + d + '"';
			return "" != f && (f = h( f ), f = M( f, "*_" ), p += ' title="' + f + '"'), p += ">" + c + "</a>"
		}

		function p( e ) {
			return e.indexOf( "![" ) === -1 ? e : (e = e.replace( /(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, m ), e = e.replace( /(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, m ))
		}

		function h( e ) {
			return e.replace( />/g, "&gt;" ).replace( /</g, "&lt;" ).replace( /"/g, "&quot;" ).replace( /'/g, "&#39;" )
		}

		function m( e, t, n, o, i, r, a, s ) {
			var u = t, c = n, l = o.toLowerCase(), d = i, f = s;
			if( f || (f = ""), "" == d ) {
				if( "" == l && (l = c.toLowerCase().replace( / ?\n/g, " " )), d = "#" + l, void 0 == L.get( l ) ) return u;
				d = L.get( l ), void 0 != B.get( l ) && (f = B.get( l ))
			}
			c = M( h( c ), "*_[]()" ), d = M( d, "*_" );
			var p = '<img src="' + d + '" alt="' + c + '"';
			return f = h( f ), f = M( f, "*_" ), p += ' title="' + f + '"', p += " />"
		}

		function g( e ) {
			return e = e.replace( /^(.+)[ \t]*\n=+[ \t]*\n+/gm, function( e, t ) {
				return "<h1>" + c( t ) + "</h1>\n\n"
			} ), e = e.replace( /^(.+)[ \t]*\n-+[ \t]*\n+/gm, function( e, t ) {
				return "<h2>" + c( t ) + "</h2>\n\n"
			} ), e = e.replace( /^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm, function( e, t, n ) {
				var o = t.length;
				return "<h" + o + ">" + c( n ) + "</h" + o + ">\n\n"
			} )
		}

		function b( e, t ) {
			e += "~0";
			var n = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
			return j ? e = e.replace( n, function( e, n, o ) {
				var i, r = n, a = o.search( /[*+-]/g ) > -1 ? "ul" : "ol";
				"ol" === a && (i = parseInt( o, 10 ));
				var s = v( r, a, t );
				s = s.replace( /\s+$/, "" );
				var u = "<" + a;
				return i && 1 !== i && (u += ' start="' + i + '"'), s = u + ">" + s + "</" + a + ">\n"
			} ) : (n = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g, e = e.replace( n, function( e, t, n, o ) {
				var i, r = t, a = n, s = o.search( /[*+-]/g ) > -1 ? "ul" : "ol";
				"ol" === s && (i = parseInt( o, 10 ));
				var u = v( a, s ), c = "<" + s;
				return i && 1 !== i && (c += ' start="' + i + '"'), u = r + c + ">\n" + u + "</" + s + ">\n"
			} )), e = e.replace( /~0/, "" )
		}

		function v( e, t, n ) {
			j++, e = e.replace( /\n{2,}$/, "\n" ), e += "~0";
			var o = G[ t ],
			    i = new RegExp( "(^[ \\t]*)(" + o + ")[ \\t]+([^\\r]+?(\\n+))(?=(~0|\\1(" + o + ")[ \\t]+))", "gm" ), r = !1;
			return e = e.replace( i, function( e, t, n, o ) {
				var i = o, a = /\n\n$/.test( i ), s = a || i.search( /\n{2,}/ ) > -1, c = s || r;
				return i = u( R( i ), !0, !c ), r = a, "<li>" + i + "</li>\n"
			} ), e = e.replace( /~0/g, "" ), j--, e
		}

		function w( e ) {
			return e += "~0", e = e.replace( /(?:\n\n|^\n?)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g, function( e, t, n ) {
				var o = t, i = n;
				return o = $( R( o ) ), o = I( o ), o = o.replace( /^\n+/g, "" ), o = o.replace( /\n+$/g, "" ), o = "<pre><code>" + o + "\n</code></pre>", "\n\n" + o + "\n\n" + i
			} ), e = e.replace( /~0/, "" )
		}

		function _( e ) {
			return e = e.replace( /(^|[^\\`])(`+)(?!`)([^\r]*?[^`])\2(?!`)/gm, function( e, t, n, o, i ) {
				var r = o;
				return r = r.replace( /^([ \t]*)/g, "" ), r = r.replace( /[ \t]*$/g, "" ), r = $( r ), r = r.replace( /:\/\//g, "~P" ), t + "<code>" + r + "</code>"
			} )
		}

		function $( e ) {
			return e = e.replace( /&/g, "&amp;" ), e = e.replace( /</g, "&lt;" ), e = e.replace( />/g, "&gt;" ), e = M( e, "*_{}[]\\", !1 )
		}

		function y( e ) {
			return e.indexOf( "*" ) === -1 && e.indexOf( "_" ) === -1 ? e : (e = q( e ), e = e.replace( /(^|[\W_])(?:(?!\1)|(?=^))(\*|_)\2(?=\S)([^\r]*?\S)\2\2(?!\2)(?=[\W_]|$)/g, "$1<strong>$3</strong>" ), e = e.replace( /(^|[\W_])(?:(?!\1)|(?=^))(\*|_)(?=\S)((?:(?!\2)[^\r])*?\S)\2(?!\2)(?=[\W_]|$)/g, "$1<em>$3</em>" ), z( e ))
		}

		function T( e ) {
			return e.indexOf( "*" ) === -1 && e.indexOf( "_" ) === -1 ? e : (e = q( e ), e = e.replace( /(?=[^\r][*_]|[*_])(^|(?=\W__|(?!\*)[\W_]\*\*|\w\*\*\w)[^\r])(\*\*|__)(?!\2)(?=\S)((?:|[^\r]*?(?!\2)[^\r])(?=\S_|\w|\S\*\*(?:[\W_]|$)).)(?=__(?:\W|$)|\*\*(?:[^*]|$))\2/g, "$1<strong>$3</strong>" ), e = e.replace( /(?=[^\r][*_]|[*_])(^|(?=\W_|(?!\*)(?:[\W_]\*|\D\*(?=\w)\D))[^\r])(\*|_)(?!\2\2\2)(?=\S)((?:(?!\2)[^\r])*?(?=[^\s_]_|(?=\w)\D\*\D|[^\s*]\*(?:[\W_]|$)).)(?=_(?:\W|$)|\*(?:[^*]|$))\2/g, "$1<em>$3</em>" ), z( e ))
		}

		function E( e ) {
			return e = e.replace( /((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm, function( e, t ) {
				var n = t;
				return n = n.replace( /^[ \t]*>[ \t]?/gm, "~0" ), n = n.replace( /~0/g, "" ), n = n.replace( /^[ \t]+$/gm, "" ), n = u( n ), n = n.replace( /(^|\n)/g, "$1  " ), n = n.replace( /(\s*<pre>[^\r]+?<\/pre>)/gm, function( e, t ) {
					var n = t;
					return n = n.replace( /^  /gm, "~0" ), n = n.replace( /~0/g, "" )
				} ), a( "<blockquote>\n" + n + "\n</blockquote>" )
			} )
		}

		function k( e, t, n ) {
			e = e.replace( /^\n+/g, "" ), e = e.replace( /\n+$/g, "" );
			for( var o = e.split( /\n{2,}/g ), i = [], r = /~K(\d+)K/, a = o.length, s = 0; s < a; s++ ) {
				var u = o[ s ];
				r.test( u ) ? i.push( u ) : /\S/.test( u ) && (u = c( u ), u = u.replace( /^([ \t]*)/g, n ? "" : "<p>" ), n || (u += "</p>"), i.push( u ))
			}
			if( !t ) {
				a = i.length;
				for( var s = 0; s < a; s++ ) for( var l = !0; l; ) l = !1, i[ s ] = i[ s ].replace( /~K(\d+)K/g, function( e, t ) {
					return l = !0, D[ t ]
				} )
			}
			return i.join( "\n\n" )
		}

		function C( e ) {
			return e = e.replace( /&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;" ), e = e.replace( /<(?![a-z\/?!]|~D)/gi, "&lt;" )
		}

		function S( e ) {
			return e = e.replace( /\\(\\)/g, U ), e = e.replace( /\\([`*_{}\[\]()>#+-.!])/g, U )
		}

		function A( e, t, n, o ) {
			if( t ) return e;
			if( ")" !== o.charAt( o.length - 1 ) ) return "<" + n + o + ">";
			for( var i = o.match( /[()]/g ), r = 0, a = 0; a < i.length; a++ ) "(" === i[ a ] ? r <= 0 ? r = 1 : r++ : r--;
			var s = "";
			if( r < 0 ) {
				var u = new RegExp( "\\){1," + -r + "}$" );
				o = o.replace( u, function( e ) {
					return s = e, ""
				} )
			}
			if( s ) {
				var c = o.charAt( o.length - 1 );
				W.test( c ) || (s = c + s, o = o.substr( 0, o.length - 1 ))
			}
			return "<" + n + o + ">" + s
		}

		function N( e ) {
			e = q( e ), e = e.replace( J, A ), e = z( e );
			var t = function( e, t ) {
				var n = P( t );
				return '<a href="' + n + '">' + x.plainLinkText( t ) + "</a>"
			};
			return e = e.replace( /<((https?|ftp):[^'">\s]+)>/gi, t )
		}

		function O( e ) {
			return e = e.replace( /~E(\d+)E/g, function( e, t ) {
				var n = parseInt( t );
				return String.fromCharCode( n )
			} )
		}

		function R( e ) {
			return e = e.replace( /^(\t|[ ]{1,4})/gm, "~0" ), e = e.replace( /~0/g, "" )
		}

		function I( e ) {
			if( !/\t/.test( e ) ) return e;
			var t, n = [ "    ", "   ", "  ", " " ], o = 0;
			return e.replace( /[\n\t]/g, function( e, i ) {
				return "\n" === e ? (o = i + 1, e) : (t = (i - o) % 4, o = i + 1, n[ t ])
			} )
		}

		function P( e ) {
			return e = h( e ), e = M( e, "*_:()[]" )
		}

		function M( e, t, n ) {
			var o = "([" + t.replace( /([\[\]\\])/g, "\\$1" ) + "])";
			n && (o = "\\\\" + o);
			var i = new RegExp( o, "g" );
			return e = e.replace( i, U )
		}

		function U( e, t ) {
			var n = t.charCodeAt( 0 );
			return "~E" + n + "E"
		}

		var x = this.hooks = new n;
		x.addNoop( "plainLinkText" ), x.addNoop( "preConversion" ), x.addNoop( "postNormalization" ), x.addNoop( "preBlockGamut" ), x.addNoop( "postBlockGamut" ), x.addNoop( "preSpanGamut" ), x.addNoop( "postSpanGamut" ), x.addNoop( "postConversion" );
		var L, B, D, j;
		t = t || {};
		var q = e, z = e;
		t.nonAsciiLetters && !function() {
			var e = /[Q\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376-\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0523\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0621-\u064a\u0660-\u0669\u066e-\u066f\u0671-\u06d3\u06d5\u06e5-\u06e6\u06ee-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07c0-\u07ea\u07f4-\u07f5\u07fa\u0904-\u0939\u093d\u0950\u0958-\u0961\u0966-\u096f\u0971-\u0972\u097b-\u097f\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc-\u09dd\u09df-\u09e1\u09e6-\u09f1\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0-\u0ae1\u0ae6-\u0aef\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b35-\u0b39\u0b3d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0be6-\u0bef\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58-\u0c59\u0c60-\u0c61\u0c66-\u0c6f\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3d\u0d60-\u0d61\u0d66-\u0d6f\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32-\u0e33\u0e40-\u0e46\u0e50-\u0e59\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eb0\u0eb2-\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f20-\u0f29\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8b\u1000-\u102a\u103f-\u1049\u1050-\u1055\u105a-\u105d\u1061\u1065-\u1066\u106e-\u1070\u1075-\u1081\u108e\u1090-\u1099\u10a0-\u10c5\u10d0-\u10fa\u10fc\u1100-\u1159\u115f-\u11a2\u11a8-\u11f9\u1200-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u1676\u1681-\u169a\u16a0-\u16ea\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u17e0-\u17e9\u1810-\u1819\u1820-\u1877\u1880-\u18a8\u18aa\u1900-\u191c\u1946-\u196d\u1970-\u1974\u1980-\u19a9\u19c1-\u19c7\u19d0-\u19d9\u1a00-\u1a16\u1b05-\u1b33\u1b45-\u1b4b\u1b50-\u1b59\u1b83-\u1ba0\u1bae-\u1bb9\u1c00-\u1c23\u1c40-\u1c49\u1c4d-\u1c7d\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u2054\u2071\u207f\u2090-\u2094\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2183-\u2184\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2c6f\u2c71-\u2c7d\u2c80-\u2ce4\u2d00-\u2d25\u2d30-\u2d65\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3006\u3031-\u3035\u303b-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31b7\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fc3\ua000-\ua48c\ua500-\ua60c\ua610-\ua62b\ua640-\ua65f\ua662-\ua66e\ua67f-\ua697\ua717-\ua71f\ua722-\ua788\ua78b-\ua78c\ua7fb-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8d0-\ua8d9\ua900-\ua925\ua930-\ua946\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa50-\uaa59\uac00-\ud7a3\uf900-\ufa2d\ufa30-\ufa6a\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe33-\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]/g,
			    t = "Q".charCodeAt( 0 ), n = "A".charCodeAt( 0 ), o = "Z".charCodeAt( 0 ), i = "a".charCodeAt( 0 ) - o - 1;
			q = function( r ) {
				return r.replace( e, function( e ) {
					for( var r, a = e.charCodeAt( 0 ), s = ""; a > 0; ) r = a % 51 + n, r >= t && r++, r > o && (r += i), s = String.fromCharCode( r ) + s, a = a / 51 | 0;
					return "Q" + s + "Q"
				} )
			}, z = function( e ) {
				return e.replace( /Q([A-PR-Za-z]{1,3})Q/g, function( e, r ) {
					for( var a, s = 0, u = 0; u < r.length; u++ ) a = r.charCodeAt( u ), a > o && (a -= i), a > t && a--, a -= n, s = 51 * s + a;
					return String.fromCharCode( s )
				} )
			}
		}();
		var F = t.asteriskIntraWordEmphasis ? T : y;
		this.makeHtml = function( e ) {
			if( L ) throw new Error( "Recursive call to converter.makeHtml" );
			return L = new o, B = new o, D = [], j = 0, e = x.preConversion( e ), e = e.replace( /~/g, "~T" ), e = e.replace( /\$/g, "~D" ), e = e.replace( /\r\n/g, "\n" ), e = e.replace( /\r/g, "\n" ), e = "\n\n" + e + "\n\n", e = I( e ), e = e.replace( /^[ \t]+$/gm, "" ), e = x.postNormalization( e ), e = r( e ), e = i( e ), e = u( e ), e = O( e ), e = e.replace( /~D/g, "$$" ), e = e.replace( /~T/g, "~" ), e = x.postConversion( e ), D = B = L = null, e
		};
		var V = function( e ) {
			    return u( e )
		    }, G = { ol: "\\d+[.]", ul: "[*+-]" }, Q = "[-A-Z0-9+&@#/%?=~_|[\\]()!:,.;]", K = "[-A-Z0-9+&@#/%=~_|[\\])]",
		    J = new RegExp( '(="|<)?\\b(https?|ftp)(://' + Q + "*" + K + ")(?=$|\\W)", "gi" ), W = new RegExp( K, "i" )
	}
}(), function() {
	function e( e ) {
		return e.replace( /<[^>]*>?/gi, t )
	}

	function t( e ) {
		if( e.match( r ) || e.match( a ) || e.match( s ) ) return e;
		var t = !1, n = e.replace( /^(<a href="|<img src=")([^"]*)/i, function( e, n, o ) {
			return n + o.replace( /[^-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]/g, function( e ) {
				return t = !0, "'" == e ? "%27" : encodeURIComponent( e )
			} )
		} );
		return t && (n.match( a ) || n.match( s )) ? n : ""
	}

	function n( e ) {
		if( "" == e ) return "";
		var t = /<\/?\w+[^>]*(\s|$|>)/g, n = e.toLowerCase().match( t ), o = (n || []).length;
		if( 0 == o ) return e;
		for( var i, r, a, s = "<p><img><br><li><hr>", u = [], c = [], l = !1, d = 0; d < o; d++ ) if( i = n[ d ].replace( /<\/?(\w+).*/, "$1" ), !(u[ d ] || s.search( "<" + i + ">" ) > -1) ) {
			if( r = n[ d ], a = -1, !/^<\//.test( r ) ) for( var f = d + 1; f < o; f++ ) if( !u[ f ] && n[ f ] == "</" + i + ">" ) {
				a = f;
				break
			}
			a == -1 ? l = c[ d ] = !0 : u[ a ] = !0
		}
		if( !l ) return e;
		var d = 0;
		return e = e.replace( t, function( e ) {
			var t = c[ d ] ? "" : e;
			return d++, t
		} )
	}

	var o, i;
	"object" == typeof exports && "function" == typeof require ? (o = exports, i = require( "./Markdown.Converter" ).Converter) : (o = window.Markdown, i = o.Converter), o.getSanitizingConverter = function() {
		var t = new i;
		return t.hooks.chain( "postConversion", e ), t.hooks.chain( "postConversion", n ), t
	};
	var r = /^(<\/?(b|blockquote|code|del|dd|dl|dt|em|h1|h2|h3|i|kbd|li|ol(?: start="\d+")?|p|pre|s|sup|sub|strong|strike|ul)>|<(br|hr)\s?\/?>)$/i,
	    a = /^(<a\shref="((https?|ftp):\/\/|\/)[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"(\stitle="[^"<>]+")?\s?>|<\/a>)$/i,
	    s = /^(<img\ssrc="(https?:\/\/|\/)[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"(\swidth="\d{1,3}")?(\sheight="\d{1,3}")?(\salt="[^"<>]*")?(\stitle="[^"<>]*")?\s?\/?>)$/i
}();
var markdownToHtml = function() {
	var e;
	return function( t ) {
		return e || (e = Markdown.getSanitizingConverter()), e.makeHtml( t || "" )
	}
}(), kApiEndpoint  = "https://api.butlerfortrello.com/", Builder = {};
!function() {
	function e( e ) {
		var t = $( e ).not( "[bld-dd]" );
		if( t.length ) {
			t.attr( "bld-dd", 1 );
			var n, o = {
				on         : "hover", onShow: function() {
					var e = $( this ).closest( ".ui.dropdown" ), t = e.find( ".text" ), o = t.innerWidth(),
					    i = t.text().trim().length, r = e.innerWidth() - o, a = e.find( ".menu" ), s = a.children( ".item" ),
					    u = 0;
					if( s.each( function( e, t ) {
							$( t ).text().length > u && (u = $( t ).text().length)
						} ), e.find( ".menu" ).css( "min-width", r + 1.33 * u * o / (i || 1) ), e.hasClass( "toggling" ) ) {
						var c = e.find( "select" )[ 0 ], l = c.options[ c.selectedIndex ];
						n = $( l ).attr( "data-toggle" )
					}
					return !0
				}, onChange: function( e, t, o ) {
					var i = $( this ).closest( ".ui.dropdown" );
					if( i.hasClass( "label-select" ) ) return i.dropdown( "set text", sanitize( e ) );
					if( i.hasClass( "toggling" ) ) {
						var r = i.find( "select" )[ 0 ], a = r.options[ o.index() ], s = $( a ).attr( "data-toggle" );
						s != n && (n && i.siblings( n ).transition( "toggle" ), s && i.siblings( s ).transition( "toggle" ), n = s)
					}
				}
			};
			t.find( ".ui.dropdown" ).dropdown( o ).filter( ".label-select" ).each( function() {
				var e = $( this ).dropdown( "get value" ) || $( this ).find( ".menu .item" ).first().attr( "data-value" );
				$( this ).dropdown( "set selected", e )
			} )
		}
	}

	function t( e ) {
		var t = $( e ).not( "[bld-if]" );
		if( t.length ) {
			t.attr( "bld-if", 1 );
			var n = new Date, o = n.getHours(), i = 15 * Math.ceil( n.getMinutes() / 15 );
			i >= 60 && (++o, i = 0);
			var r = 1 == Math.floor( o / 12 );
			o = o % 12 || 12;
			var a = t.find( "input" );
			a.filter( ".numeric-value" ).off( "blur" ).blur( function( e ) {
				if( !e.target.value.match( /^{.*}$/ ) ) {
					var t = parseInt( e.target.value ), n = $( e.target ).attr( "data-min-value" ) || 0,
					    o = $( e.target ).attr( "data-max-value" );
					void 0 === n && (n = 0), isNaN( t ) || t < n ? e.target.value = n : void 0 !== o && t > o && (e.target.value = o)
				}
			} ), a.filter( ".hour" ).val( o ).off( "blur" ).blur( function( e ) {
				var t = parseInt( e.target.value );
				isNaN( t ) || t < 1 ? e.target.value = 12 : t > 12 && (e.target.value = Math.min( t - 12, 11 ), $( e.target ).parent().siblings( ".dropdown" ).dropdown( "set selected", "pm" ))
			} ), a.filter( ".minutes" ).val( i ).off( "blur" ).blur( function( e ) {
				var t = parseInt( e.target.value );
				isNaN( t ) || t < 0 ? t = 0 : e.target.value > 59 && (t = 59), e.target.value = t > 9 ? t : "0" + t
			} ), t.find( ".dropdown.ampm" ).dropdown( "set selected", r ? "pm" : "am" ), a.filter( ".year" ).off( "blur" ).blur( function( e ) {
				var t = parseInt( e.target.value );
				return isNaN( t ) ? e.target.value = (new Date).getYear() + 1900 : void(t < 100 && (e.target.value = 2e3 + t))
			} )
		}
	}

	function n( e ) {
		var t = TrelloPowerUp.iframe(), n = $( e ).find( ".ui.input>input" ), r = $( n ).filter( '[name="list-name"]' );
		r.length && s().then( function( e ) {
			o( r, e )
		} );
		var a = $( n ).filter( '[name="board-name"]' );
		a.length && u().then( function( e ) {
			i( a, e )
		} );
		var c = $( n ).filter( '[name="username"]' ), f = $( n ).filter( '[name="field-name"]' ),
		    p = $( e ).find( ".dropdown.label-select" );
		(c.length || f.length) && t.board( "members", "customFields", "labels" ).then( function( t ) {
			t.members.forEach( function( e ) {
				e.username = sanitize( e.username ), e.fullName = sanitize( e.fullName )
			} ), c.addClass( "prompt" ).parent().addClass( "search" ).search( {
				source        : t.members,
				fields        : {
					title      : "username",
					description: "fullName"
				},
				searchFields  : [ "username", "fullName" ],
				searchFullText: !1,
				showNoResults : !1,
				minCharacters : 0,
				maxResults    : 20,
				onSearchQuery : l,
				onSelect      : function( e ) {
					d.bind( this )( e.username )
				}
			} ), $( e ).find( ".no-custom-fields" ).transition( t.customFields.length ? "hide" : "show" ), t.customFields.forEach( function( e ) {
				e.name = sanitize( e.name )
			} ), f.addClass( "prompt" ).parent().addClass( "search" ).each( function() {
				var e = t.customFields, n = $( this ).find( 'input[name="field-name"]' ).attr( "data-field-type" );
				n && (e = e.filter( function( e ) {
					return n.indexOf( e.type ) != -1
				} )), $( this ).search( {
					source        : e,
					fields        : { title: "name", description: "type" },
					searchFields  : [ "name" ],
					searchFullText: !1,
					showNoResults : !1,
					minCharacters : 0,
					maxResults    : 20,
					onSearchQuery : l,
					onSelect      : function( e ) {
						d.bind( this )( e.name );
						var t = $( this ).siblings().find( 'input[name="field-value"]' );
						t && (t.val( "" ), "list" == e.type ? t.addClass( "prompt" ).parent().addClass( "search" ).search( "clear cache" ).search( {
							source        : e.options.map( function( e ) {
								return { name: e.value.text }
							} ),
							fields        : { title: "name" },
							searchFields  : [ "name" ],
							searchFullText: !1,
							showNoResults : !1,
							minCharacters : 0,
							maxResults    : 20,
							onSearchQuery : l,
							onSelect      : function( e ) {
								d.bind( t )( e.name )
							}
						} ) : t.removeClass( "prompt" ).parent().removeClass( "search" ))
					}
				} )
			} );
			var n;
			p.find( ".menu" ).html( t.labels.map( function( e, t ) {
				var o = [];
				return e.color && o.push( e.color ), e.name && o.push( '"' + e.name + '"' ), o = o.join( " " ), t || (n = o), '<div class="item batch-label ' + (e.color || "colorless") + (t ? "" : " active selected") + '" data-value="' + sanitize( o ) + '">' + (e.name ? sanitize( e.name ) : "&nbsp;") + "</div>"
			} ) ), p.dropdown( "refresh" ).dropdown( "set selected", n )
		} )
	}

	function o( e, t, n ) {
		if( !t ) return s().then( function( t ) {
			t && o( e, t, n )
		} );
		var i = {};
		t = t.filter( function( e ) {
			return !i[ e.name ] && (i[ e.name ] = !0)
		} ).map( function( e ) {
			return { name: sanitize( e.name ) }
		} );
		var r = e.addClass( "prompt" ).parent().addClass( "search" ).search( "clear cache" ).search( "hide results" ).search( {
			source        : t,
			fields        : { title: "name" },
			searchFields  : [ "name" ],
			searchFullText: !1,
			showNoResults : !1,
			minCharacters : 0,
			maxResults    : 20,
			onSearchQuery : l,
			onSelect      : function( e ) {
				d.bind( this )( e.name )
			}
		} );
		r.each( function() {
			var e = $( this ).search( "get value" );
			e && (n && !i[ e ] ? $( this ).search( "set value", "" ) : d.bind( this )( e ))
		} )
	}

	function i( e, t, n ) {
		if( !t ) return u().then( function( t ) {
			t && i( e, t, n )
		} );
		var r = {};
		t = t.filter( function( e ) {
			return !r[ e.name ] && (r[ e.name ] = e)
		} ).map( function( e ) {
			return { name: sanitize( e.name ), lists: e.lists }
		} );
		var a = function( e ) {
			var t, n = $( e ).find( '[name="board-name"]' ),
			    o = $( e ).closest( ".phrase,.clause,.output-phrase" ).find( '[name="list-name"],[name="board-name"]' );
			return o.get().find( function( e, o, i ) {
				return e == n[ 0 ] && (t = $( i[ o - 1 ] ).filter( '[name="list-name"]' ), !0)
			} ), t
		}, c  = e.addClass( "prompt" ).parent().addClass( "search" ).search( {
			source        : t,
			fields        : { title: "name" },
			searchFields  : [ "name" ],
			searchFullText: !1,
			showNoResults : !1,
			minCharacters : 0,
			maxResults    : 20,
			onSearchQuery : l,
			onSelect      : function( e ) {
				d.bind( this )( e.name );
				var t = a( this );
				o( t, e.lists, !0 );
				var n = $( this );
				$( this ).closest( ".builder-optional" ).find( ".builder-close" ).on( "click", function() {
					n.search( "set value", "" ), s().then( function( e ) {
						o( t, e, !0 )
					} )
				} )
			}
		} );
		c.each( function() {
			var e = $( this ).search( "get value" );
			if( e && (d.bind( this )( e ), n) ) {
				var t = r[ e ];
				if( t ) {
					var i = a( this );
					i && o( i, t.lists )
				}
			}
		} )
	}

	function r( e, t, n ) {
		var o = t.map( function( e ) {
			var t = { record: e };
			return t[ n ] = sanitize( e[ n ] ), t
		} );
		e.parent().search( {
			source        : o,
			fields        : { title: n },
			searchFields  : [ n ],
			searchFullText: !1,
			showNoResults : !1,
			minCharacters : 0,
			maxResults    : 20,
			onSearchQuery : l,
			onSelect      : function( e ) {
				d.bind( this )( e.record[ n ] )
			}
		} ), c.bind( e.parent() )()
	}

	function a( e, t ) {
		return new TrelloPowerUp.Promise( function( n, o ) {
			if( b[ e ] ) return n( b[ e ] );
			var i = e + "__loading";
			b[ i ] || (b[ i ] = []), b[ i ].push( { resolve: n, reject: o } ), b[ i ].length > 1 || t( function( t ) {
				b[ e ] = t;
				var n = b[ i ];
				delete b[ i ], n.forEach( function( e ) {
					e.resolve( t )
				} )
			}, function( e ) {
				var t = b[ i ];
				delete b[ i ], t.forEach( function( t ) {
					t.reject( e )
				} )
			} )
		} )
	}

	function s() {
		return a( "lists", function( e, t ) {
			TrelloPowerUp.iframe().lists( "name" ).then( function( t ) {
				e( t )
			} ).catch( function( e ) {
				t( e )
			} )
		} )
	}

	function u() {
		return a( "boards", function( e, t ) {
			return "object" != typeof Trello ? t( "NO_TRELLO_API" ) : void Trello.get( "members/me/boards?filter=open&lists=open&limit=100", function( t ) {
				e( t )
			}, function( e ) {
				t( e )
			} )
		} )
	}

	function c() {
		var e = $( this ).search( "get value" );
		"string" == typeof e && d.bind( this )( e )
	}

	function l( e ) {
		var t = $( this ).data( "search-select" );
		return !t || (e != t ? ($( this ).data( "search-select", "" ), !0) : ($( this ).search( "search local", "" ), !1))
	}

	function d( e ) {
		$( this ).data( "search-select", sanitize( e ) )
	}

	function f( e ) {
		if( !e ) return null;
		switch( e.nodeType ) {
			case Node.TEXT_NODE:
				return e.nodeValue.replace( /^\s+/, " " ).replace( /\s+$/, " " ).replace( /^ ,/, "," );
			case Node.ELEMENT_NODE:
				var t = $( e );
				if( t.hasClass( "hidden" ) || t.hasClass( "popup" ) || t.hasClass( "builder-comment" ) || t.hasClass( "results" ) || "none" == t.css( "display" ) ) return null;
				if( t.hasClass( "button" ) ) {
					var n = t.find( ".default-value" );
					return n.length ? f( n[ 0 ] ) : null
				}
				if( "SCRIPT" == e.nodeName ) return null;
				if( "INPUT" == e.nodeName || "TEXTAREA" == e.nodeName ) {
					var o = t.prop( "value" ).trim();
					return t.hasClass( "optional" ) && !o ? null : (o || (o = t.prop( "placeholder" )), t.hasClass( "quoted-value" ) ? '"' + o.replace( /["â€œâ€]/g, '\\"' ).split( "\n" ).join( "\\n" ) + '"' : o)
				}
				if( t.hasClass( "dropdown" ) ) return $( t ).dropdown( "get value" ).trim();
				for( var i = [], r = 0; r < e.childNodes.length; ++r ) i.push( f( e.childNodes[ r ] ) );
				var a = i.filter( function( e ) {
					return !!e
				} ).map( function( e, t, n ) {
					return " " == e.slice( -1 ) && t < n.length - 1 && " ,".indexOf( n[ t + 1 ][ 0 ] ) != -1 ? e.slice( 0, -1 ) : e
				} ).join( "" ).trim();
				return t.hasClass( "new-phrase" ) ? "\n" + a : (t.hasClass( "clause" ) && "," != a[ 0 ] ? " " : "") + a;
			default:
				return null
		}
	}

	function p( e ) {
		if( !e ) return null;
		switch( e.nodeType ) {
			case Node.TEXT_NODE:
				return null;
			case Node.ELEMENT_NODE:
				var t = $( e );
				if( t.hasClass( "hidden" ) || t.hasClass( "popup" ) || t.hasClass( "builder-comment" ) || t.hasClass( "results" ) || "none" == t.css( "display" ) ) return null;
				if( t.hasClass( "button" ) ) {
					var n = t.find( ".default-value" );
					return n.length ? p( n[ 0 ] ) : null
				}
				if( "SCRIPT" == e.nodeName ) return null;
				if( "INPUT" == e.nodeName || "TEXTAREA" == e.nodeName ) {
					var o = t.attr( "schema" );
					if( !o ) throw new Error( "Schema missing from input node:\n" + JSON.stringify( e ) );
					var i = t.prop( "value" ).trim();
					return t.hasClass( "optional" ) && !i ? null : (i || (i = t.prop( "placeholder" )), o = o.replace( "_v_", i ).replace( "_q_", '"' + m( i ) + '"' ), h( o ))
				}
				if( t.hasClass( "dropdown" ) ) {
					var r = $( t ), i = r.dropdown( "get value" ), o = r.attr( "schema" );
					if( !o ) {
						var a = r.dropdown( "get item", i );
						o = a.attr( "schema" )
					}
					if( !o ) {
						var s = r.find( ".menu>.item" ).index( a ), u = $( r.find( "select option" )[ s ] );
						o = u.attr( "schema" )
					}
					return o ? (o = o.replace( "_v_", i ).replace( "_q_", '"' + m( i ) + '"' ), h( o )) : null
				}
				var o = $( t ).attr( "schema" );
				if( o ) return h( o );
				for( var o = {}, c = 0; c < e.childNodes.length; ++c ) g( o, p( e.childNodes[ c ] ) );
				return o;
			default:
				return null
		}
	}

	function h( e ) {
		try {
			return JSON.parse( e )
		} catch( t ) {
			throw console.log( "[ERROR] parsing JSON:", e ), t
		}
	}

	function m( e ) {
		return e.replace( /["â€œâ€]/g, '\\"' ).split( "\n" ).join( "\\n" )
	}

	function g( e, t ) {
		if( t ) {
			if( "object" != typeof e ) throw new Error( "mergeSchemas: Expected object:\ns=" + JSON.stringify( e ) );
			if( "object" != typeof t ) throw new Error( "mergeSchemas: Expected object\nt=" + JSON.stringify( t ) );
			Object.getOwnPropertyNames( t ).forEach( function( n ) {
				n in e ? g( e[ n ], t[ n ] ) : e[ n ] = t[ n ]
			} )
		}
	}

	Builder.setupDropdowns = e, Builder.setupInputFields = t, Builder.setupPowerUpAutoComplete = n, Builder.setupListNameAutoComplete = o, Builder.setupBoardNameAutoComplete = i, Builder.setupAutoComplete = r, Builder.collectPhrase = f, Builder.collectSchema = p;
	var b = {}
}();
var Auth = {};
!function() {
	function e( e, t, n ) {
		t = t || function() {
		}, n = n || TrelloPowerUp.iframe(), $( ".butler-status-registration-success" ).transition( "hide" );
		try {
			window.localStorage
		} catch( e ) {
			return t()
		}
		Trello.authorize( {
			interactive: !1, name: d, scope: { read: !0, write: !0, account: !0 }, success: function() {
				s( n, e, t )
			}, error   : function() {
				if( Trello.token() ) try {
					localStorage.clear()
				} catch( e ) {
				}
				a( n, function() {
					Trello.authorize( {
						interactive: !1,
						name       : d,
						scope      : { read: !0, write: !0, account: !0 },
						success    : e,
						error      : t
					} )
				}, t )
			}
		} )
	}

	function t( t, n ) {
		e( n, function() {
			o( t, n )
		} )
	}

	function n( e, t ) {
		try {
			localStorage.clear()
		} catch( e ) {
		}
		c(), o( e, t )
	}

	function o( e, t ) {
		$( ".ui.form.legal" ).form( { fields: { "accept-legal": "checked" } } ), $( "#butler-authorize-btn" ).off( "click" ).click( function() {
			$( ".ui.form.legal" ).form( "is valid" ) && i( e, t )
		} ).removeClass( "disabled" ), $( ".butler-alternate-auth" ).transition( "hide" ), clearStatus( "#butler-status-auth" ), showTab( "auth" ), navigator.appVersion.match( / Trello[\/].*Electron/ ) && $( ".butler-auth-trello-app" ).transition( "show" )
	}

	function i( e, t ) {
		try {
			window.localStorage
		} catch( e ) {
			return void showStatus( ".butler-status-local-storage-disabled" )
		}
		$( "#butler-authorize-btn" ).addClass( "disabled" ), $( ".butler-alternate-auth" ).transition( "show" ), showStatus( "#butler-status-auth" ), Trello.authorize( {
			interactive: !0,
			type       : "popup",
			name       : d,
			scope      : {
				read   : !0,
				write  : !0,
				account: !0
			},
			expiration : "never",
			persist    : !0,
			success    : function() {
				l( e, t )
			},
			error      : function() {
				c(), showStatus( "#butler-status-auth-error" ), $( "#butler-authorize-btn" ).removeClass( "disabled" )
			}
		} )
	}

	function r( e ) {
		try {
			localStorage.clear()
		} catch( e ) {
		}
		Trello.setToken(), TrelloPowerUp.iframe().set( "member", "private", "token", null ).then( e ).catch( e )
	}

	function a( e, t, n ) {
		return e ? void e.get( "member", "private", "token" ).then( function( e ) {
			return u( e ) ? ("undefined" != typeof Trello && Trello.setToken( e ), void t( e )) : n()
		} ).catch( function( e ) {
			"Invalid context, missing board" == e.message || Log.logError( e, "Context: getTokenFromPowerUp" ), n()
		} ) : n()
	}

	function s( e, t, n ) {
		return e && p ? void TrelloPowerUp.Promise.join( e.get( "member", "private", "token" ), new TrelloPowerUp.Promise( function( e, t ) {
			Trello.get( "members/me", e, t )
		} ) ).spread( function( o, i ) {
			if( e.getContext().member == i.id ) {
				p = !1;
				var a = Trello.token();
				return o == a ? t() : e.set( "member", "private", "token", a ).then( function() {
					t()
				} ).catch( function( e ) {
					console.log( "AUTH error saving token to Power-Up member storage:", e ), t()
				} )
			}
			r( n )
		} ).catch( function( e ) {
			console.log( "AUTH matchPowerUpUserId error:", e ), r( n )
		} ) : t()
	}

	function u( e ) {
		return "string" == typeof e && /^[0-9a-f]{64}$/.test( e )
	}

	function c() {
		var e = $( ".trello-script" ), t = e.attr( "src" );
		$( e ).remove(), $( "<script>" ).attr( "src", t ).attr( "class", "trello-script" ).appendTo( "head" )
	}

	function l( e, t ) {
		showStatus( "#butler-status-registering" ), $.ajax( kApiEndpoint + "auth", {
			type       : "POST",
			data       : JSON.stringify( {
				token : Trello.token(),
				source: f,
				tz    : moment.tz.guess(),
				apikey: "446cbc1d6532c596ddc610207ead5576"
			} ),
			contentType: "application/json"
		} ).done( function( n ) {
			if( $( "#butler-authorize-btn" ).removeClass( "disabled" ), n.success ) {
				if( showStatus( "#butler-status-registration-success" ), n.response.new_user && "powerup" != f ) return document.location = "signup.html";
				Plan.updatePlan( n.response ), showTab( e ), t()
			} else if( "INVALID_TOKEN" == n.error ) {
				try {
					localStorage.clear()
				} catch( e ) {
				}
				Trello.setToken(), showStatus( "#butler-status-invalid-token" )
			} else if( "MEMBER_NOT_CONFIRMED" == n.error ) {
				try {
					localStorage.clear()
				} catch( e ) {
				}
				Trello.setToken(), showStatus( "#butler-status-member-not-confirmed" )
			} else showStatus( "#butler-status-registration-error" )
		} ).fail( function( e ) {
			$( "#butler-authorize-btn" ).removeClass( "disabled" ), showStatus( "#butler-status-registration-error" )
		} )
	}

	var d = "Butler", f = "powerup", p = !0;
	Auth.authorizeSoft = e, Auth.authorize = t, Auth.reauthorize = n, Auth.showAuthTab = o, Auth.getTokenFromPowerUp = a, Auth.logOut = r
}();
var CommandLog = {};
!function() {
	function e( e, t ) {
		function n() {
			i.animate( { scrollTop: i.prop( "scrollHeight" ) }, 500 )
		}

		var o = $( "#powerup-command-log" ), i = o.find( ".content" ), r = o.find( ".loading.message" ),
		    a = o.find( ".more.button" ), s = o.find( ".no-more-entries" ), u = r.siblings( ".error.message" ),
		    c = o.find( ".command-log" ), l = t ? "&obo=" + t : "";
		c.empty(), o.modal( {
			detachable: !0, autofocus: !1, onHide: function() {
				c.empty()
			}
		} ).modal( "show" ), function t( i ) {
			r.show(), a.transition( "hide" ), s.transition( "hide" ), u.transition( "hide" ), o.find( ".no-more-entries" ).hide(), Auth.authorize( "board", function() {
				$.ajax( kApiEndpoint + "powerup-command-log/" + e.id + "?before=" + i + l, {
					type: "GET", headers: { "X-Butler-Trello-Token": Trello.token() }
				} ).done( function( e ) {
					r.hide(), e.success ? e.response.log.length ? (e.response.log.forEach( function( e ) {
						var t = e.output;
						"string" == typeof t && (t = [ { message: t, type: "MESSAGE" } ]);
						var n = (t || []).map( function( e ) {
							var t = '<div class="item">';
							switch( e.type ) {
								case"ERROR":
									t += '<i class="red warning circle icon"></i>';
									break;
								case"WARNING":
									t += '<i class="yellow warning circle icon"></i>';
									break;
								case"MESSAGE":
									t += '<i class="blue info circle icon"></i>'
							}
							return t += '<div class="content">' + markdownToHtml( e.message ) + "</div>", t += "</div>"
						} ).join( "" ) || '<div class="item"><i class="blue info circle icon"></i><div class="content">No details.</div></div>';
						c.append( '<tr><td><div class="ui list"><div class="item"><small>' + moment( e.t ).format( "LLLL" ) + "</small></div>" + n + "</div></td></tr>" ), i = e.t
					} ), c.find( ".content a" ).attr( "target", "_blank" ), a.transition( "show" ).off( "click" ).click( function() {
						n(), t( i )
					} )) : (a.transition( "hide" ), s.transition( "show" )) : (u.transition( "show" ), n(), o.find( ".retry-btn" ).off( "click" ).click( function() {
						return t( i ), !1
					} ))
				} ).fail( function( e ) {
					r.hide(), e.transition( "show" ), n()
				} )
			} )
		}( (new Date).toISOString() )
	}

	CommandLog.openCommandLog = e
}();
var CommandRunner = {
	init: function() {
		function e( e, o ) {
			c.join( u.board( "id", "name" ), u.card( "id" ).catch( function() {
				return {}
			} ), u.member( "id" ), CommandStorage.getCommandById( o ) ).spread( function( o, i, a, s ) {
				if( !s ) return $( "#butler-error-command-not-found" ).transition( "slide up" );
				delete s.b;
				var c = s.label ? '"' + s.label + '"' : $( ".butler-command-name" ).attr( "default-text" );
				$( ".butler-command-name" ).text( c ), $( ".butler-cancel-command" ).transition( "hide" ), $( "#butler-running-command" ).transition( "slide up" ), $.ajax( kApiEndpoint + "powerup-run-command", {
					type       : "POST",
					data       : JSON.stringify( {
						command   : s,
						board_data: { board_id: o.id, board_name: o.name, tz: moment.tz.guess(), context: navigator.userAgent },
						parameters: { card_id: i.id }
					} ),
					headers    : { "X-Butler-Trello-Token": e },
					contentType: "application/json"
				} ).done( function( o ) {
					if( o.response ) {
						if( o.response.async ) return t( o, e );
						$( ".butler-command-run-details-btn" ).transition( "show" ).off( "click" ).click( function() {
							n( o.response.messages ), $( ".butler-command-run-details-btn" ).transition( "hide" ), $( "#butler-command-run-details" ).transition( "show" ), u.sizeTo( "body" )
						} )
					} else $( ".butler-command-run-details-btn" ).transition( "hide" );
					r( o )
				} ).fail( function( e ) {
					$( "#butler-running-command" ).transition( "slide up" ), $( "#butler-error-running-command-network" ).transition( "slide up" )
				} )
			} )
		}

		function t( e, t ) {
			var i = e.response.messages, s = e.response.async;
			s.onConnectionSuccess = function( e ) {
				$.ajax( kApiEndpoint + "powerup-resume-command", {
					type       : "POST",
					data       : JSON.stringify( { job_id: s.job_id } ),
					headers    : { "X-Butler-Trello-Token": t },
					contentType: "application/json"
				} ).done( function( e ) {
					e.success ? (n( i ), $( "#butler-command-run-details" ).transition( "slide up" ), $( ".butler-command-run-details-btn" ).transition( "hide" ), u.sizeTo( "body" )) : a( e )
				} ).fail( function( e ) {
					$( "#butler-running-command" ).transition( "slide up" ), $( "#butler-error-running-command-network" ).transition( "slide up" )
				} )
			}, s.onConnectionFailure = function( e ) {
				$( "#butler-error-running-command-network" ).transition( "slide up" )
			};
			var c = !1;
			s.onConnectionLost = function( e, t ) {
				c || $( "#butler-error-running-command-network" ).transition( "slide up" )
			}, s.onMessageReceived = function( t, n, a ) {
				var s = JSON.parse( a );
				i.push( s ), o( s ), "END" == s.type && (c = !0, r( e ))
			}, MessageBroker.connect( s )
		}

		function n( e ) {
			var t = (e || []).map( i ) || '<div class="item"><i class="blue info circle icon"></i><div class="content">Command started.</div></div>';
			$( "#butler-command-run-details .list" ).html( t ).find( ".content a" ).attr( "target", "_blank" )
		}

		function o( e ) {
			var t = $( i( e ) );
			t.find( ".content a" ).attr( "target", "_blank" ), $( "#butler-command-run-details .list" ).append( t ), $( "#butler-command-run-details > .segment" ).animate( { scrollTop: t.offset().top }, 500 )
		}

		function i( e ) {
			var t = '<div class="item">';
			switch( e.type ) {
				case"ERROR":
					t += '<i class="red warning circle icon"></i>';
					break;
				case"WARNING":
					t += '<i class="yellow warning circle icon"></i>';
					break;
				case"MESSAGE":
				case"END":
					t += '<i class="blue info circle icon"></i>'
			}
			return t += '<div class="content">' + markdownToHtml( e.message ) + "</div>", t += "</div>"
		}

		function r( e ) {
			$( "#butler-running-command" ).transition( {
				animation: "slide up", onComplete: function() {
					if( e.success ) {
						var t = e.response.powerup_usage && e.response.powerup_usage.exceeded;
						t ? ($( "#butler-error-quota" ).transition( "slide up" ), $( ".butler-upgrade-link" ).off( "click" ).click( function() {
							return u.overlay( { url: "./powerup-account.html?tab=upgrade" } ), u.closeBoardBar().done(), !1
						} )) : (e.response.messages || []).some( function( e ) {
							return "ERROR" == e.type
						} ) ? $( "#butler-error-running-command" ).transition( "slide up" ) : (e.response.messages || []).some( function( e ) {
							return "WARNING" == e.type
						} ) ? $( "#butler-warning-running-command" ).transition( "slide up" ) : $( "#butler-success-running-command" ).transition( "slide up" ), t || setTimeout( function() {
							$( "#butler-command-run-details:visible" ).length || u.closeBoardBar().done()
						}, 5e3 )
					} else a( e )
				}
			} )
		}

		function a( e ) {
			switch( e.error ) {
				case"CANT_PARSE_COMMAND":
					$( "#butler-error-command-parse" ).transition( "slide up" );
					break;
				case"USER_NOT_FOUND":
					$( "#butler-error-user-not-found" ).transition( "slide up" );
					break;
				case"INVALID_TOKEN":
					try {
						localStorage.clear()
					} catch( e ) {
					}
					Trello.setToken(), s();
					break;
				case"BAD_REQUEST":
				case"INTERNAL_ERROR":
				default:
					$( "#butler-error-internal" ).transition( "slide up" )
			}
		}

		function s() {
			$( ".butler-error-auth-fix" ).off( "click" ).click( function() {
				return u.overlay( { url: "./powerup-dashboard.html?tab=auth" } ), u.closeBoardBar().done(), !1
			} ), $( "#butler-error-auth" ).transition( "slide up" )
		}

		var u = TrelloPowerUp.iframe(), c = TrelloPowerUp.Promise;
		CommandStorage.init();
		var l = (window.location.search.match( /cmd=([-_a-zA-Z0-9]*)/ ) || [])[ 1 ];
		Auth.authorizeSoft( function() {
			e( Trello.token(), l )
		}, s )
	}
}, LZString       = function() {
	function e( e, t ) {
		if( !i[ e ] ) {
			i[ e ] = {};
			for( var n = 0; n < e.length; n++ ) i[ e ][ e.charAt( n ) ] = n
		}
		return i[ e ][ t ]
	}

	var t = String.fromCharCode, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	    o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", i = {}, r = {
		    compressToBase64: function( e ) {
			    if( null == e ) return "";
			    var t = r._compress( e, 6, function( e ) {
				    return n.charAt( e )
			    } );
			    switch( t.length % 4 ) {
				    default:
				    case 0:
					    return t;
				    case 1:
					    return t + "===";
				    case 2:
					    return t + "==";
				    case 3:
					    return t + "="
			    }
		    }, decompressFromBase64: function( t ) {
			    return null == t ? "" : "" == t ? null : r._decompress( t.length, 32, function( o ) {
				    return e( n, t.charAt( o ) )
			    } )
		    }, compressToUTF16: function( e ) {
			    return null == e ? "" : r._compress( e, 15, function( e ) {
				    return t( e + 32 )
			    } ) + " "
		    }, decompressFromUTF16: function( e ) {
			    return null == e ? "" : "" == e ? null : r._decompress( e.length, 16384, function( t ) {
				    return e.charCodeAt( t ) - 32
			    } )
		    }, compressToUint8Array: function( e ) {
			    for( var t = r.compress( e ), n = new Uint8Array( 2 * t.length ), o = 0, i = t.length; i > o; o++ ) {
				    var a = t.charCodeAt( o );
				    n[ 2 * o ] = a >>> 8, n[ 2 * o + 1 ] = a % 256
			    }
			    return n
		    }, decompressFromUint8Array: function( e ) {
			    if( null === e || void 0 === e ) return r.decompress( e );
			    for( var n = new Array( e.length / 2 ), o = 0, i = n.length; i > o; o++ ) n[ o ] = 256 * e[ 2 * o ] + e[ 2 * o + 1 ];
			    var a = [];
			    return n.forEach( function( e ) {
				    a.push( t( e ) )
			    } ), r.decompress( a.join( "" ) )
		    }, compressToEncodedURIComponent: function( e ) {
			    return null == e ? "" : r._compress( e, 6, function( e ) {
				    return o.charAt( e )
			    } )
		    }, decompressFromEncodedURIComponent: function( t ) {
			    return null == t ? "" : "" == t ? null : (t = t.replace( / /g, "+" ), r._decompress( t.length, 32, function( n ) {
				    return e( o, t.charAt( n ) )
			    } ))
		    }, compress: function( e ) {
			    return r._compress( e, 16, function( e ) {
				    return t( e )
			    } )
		    }, _compress: function( e, t, n ) {
			    if( null == e ) return "";
			    var o, i, r, a = {}, s = {}, u = "", c = "", l = "", d = 2, f = 3, p = 2, h = [], m = 0, g = 0;
			    for( r = 0; r < e.length; r += 1 ) if( u = e.charAt( r ), Object.prototype.hasOwnProperty.call( a, u ) || (a[ u ] = f++, s[ u ] = !0), c = l + u, Object.prototype.hasOwnProperty.call( a, c ) ) l = c; else {
				    if( Object.prototype.hasOwnProperty.call( s, l ) ) {
					    if( l.charCodeAt( 0 ) < 256 ) {
						    for( o = 0; p > o; o++ ) m <<= 1, g == t - 1 ? (g = 0, h.push( n( m ) ), m = 0) : g++;
						    for( i = l.charCodeAt( 0 ), o = 0; 8 > o; o++ ) m = m << 1 | 1 & i, g == t - 1 ? (g = 0, h.push( n( m ) ), m = 0) : g++, i >>= 1
					    } else {
						    for( i = 1, o = 0; p > o; o++ ) m = m << 1 | i, g == t - 1 ? (g = 0, h.push( n( m ) ), m = 0) : g++, i = 0;
						    for( i = l.charCodeAt( 0 ), o = 0; 16 > o; o++ ) m = m << 1 | 1 & i, g == t - 1 ? (g = 0, h.push( n( m ) ), m = 0) : g++, i >>= 1
					    }
					    d--, 0 == d && (d = Math.pow( 2, p ), p++), delete s[ l ]
				    } else for( i = a[ l ], o = 0; p > o; o++ ) m = m << 1 | 1 & i, g == t - 1 ? (g = 0, h.push( n( m ) ), m = 0) : g++, i >>= 1;
				    d--, 0 == d && (d = Math.pow( 2, p ), p++), a[ c ] = f++, l = String( u )
			    }
			    if( "" !== l ) {
				    if( Object.prototype.hasOwnProperty.call( s, l ) ) {
					    if( l.charCodeAt( 0 ) < 256 ) {
						    for( o = 0; p > o; o++ ) m <<= 1, g == t - 1 ? (g = 0, h.push( n( m ) ), m = 0) : g++;
						    for( i = l.charCodeAt( 0 ), o = 0; 8 > o; o++ ) m = m << 1 | 1 & i, g == t - 1 ? (g = 0, h.push( n( m ) ), m = 0) : g++, i >>= 1
					    } else {
						    for( i = 1, o = 0; p > o; o++ ) m = m << 1 | i, g == t - 1 ? (g = 0, h.push( n( m ) ), m = 0) : g++, i = 0;
						    for( i = l.charCodeAt( 0 ), o = 0; 16 > o; o++ ) m = m << 1 | 1 & i, g == t - 1 ? (g = 0, h.push( n( m ) ), m = 0) : g++, i >>= 1
					    }
					    d--, 0 == d && (d = Math.pow( 2, p ), p++), delete s[ l ]
				    } else for( i = a[ l ], o = 0; p > o; o++ ) m = m << 1 | 1 & i, g == t - 1 ? (g = 0, h.push( n( m ) ), m = 0) : g++, i >>= 1;
				    d--, 0 == d && (d = Math.pow( 2, p ), p++)
			    }
			    for( i = 2, o = 0; p > o; o++ ) m = m << 1 | 1 & i, g == t - 1 ? (g = 0, h.push( n( m ) ), m = 0) : g++, i >>= 1;
			    for( ; ; ) {
				    if( m <<= 1, g == t - 1 ) {
					    h.push( n( m ) );
					    break
				    }
				    g++
			    }
			    return h.join( "" )
		    }, decompress: function( e ) {
			    return null == e ? "" : "" == e ? null : r._decompress( e.length, 32768, function( t ) {
				    return e.charCodeAt( t )
			    } )
		    }, _decompress: function( e, n, o ) {
			    var i, r, a, s, u, c, l, d, f = [], p = 4, h = 4, m = 3, g = "", b = [],
			        v = { val: o( 0 ), position: n, index: 1 };
			    for( r = 0; 3 > r; r += 1 ) f[ r ] = r;
			    for( s = 0, c = Math.pow( 2, 2 ), l = 1; l != c; ) u = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = o( v.index++ )), s |= (u > 0 ? 1 : 0) * l, l <<= 1;
			    switch( i = s ) {
				    case 0:
					    for( s = 0, c = Math.pow( 2, 8 ), l = 1; l != c; ) u = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = o( v.index++ )), s |= (u > 0 ? 1 : 0) * l, l <<= 1;
					    d = t( s );
					    break;
				    case 1:
					    for( s = 0, c = Math.pow( 2, 16 ), l = 1; l != c; ) u = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = o( v.index++ )), s |= (u > 0 ? 1 : 0) * l, l <<= 1;
					    d = t( s );
					    break;
				    case 2:
					    return ""
			    }
			    for( f[ 3 ] = d, a = d, b.push( d ); ; ) {
				    if( v.index > e ) return "";
				    for( s = 0, c = Math.pow( 2, m ), l = 1; l != c; ) u = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = o( v.index++ )), s |= (u > 0 ? 1 : 0) * l, l <<= 1;
				    switch( d = s ) {
					    case 0:
						    for( s = 0, c = Math.pow( 2, 8 ), l = 1; l != c; ) u = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = o( v.index++ )), s |= (u > 0 ? 1 : 0) * l, l <<= 1;
						    f[ h++ ] = t( s ), d = h - 1, p--;
						    break;
					    case 1:
						    for( s = 0, c = Math.pow( 2, 16 ), l = 1; l != c; ) u = v.val & v.position, v.position >>= 1, 0 == v.position && (v.position = n, v.val = o( v.index++ )), s |= (u > 0 ? 1 : 0) * l, l <<= 1;
						    f[ h++ ] = t( s ), d = h - 1, p--;
						    break;
					    case 2:
						    return b.join( "" )
				    }
				    if( 0 == p && (p = Math.pow( 2, m ), m++), f[ d ] ) g = f[ d ]; else {
					    if( d !== h ) return null;
					    g = a + a.charAt( 0 )
				    }
				    b.push( g ), f[ h++ ] = a + g.charAt( 0 ), p--, a = g, 0 == p && (p = Math.pow( 2, m ), m++)
			    }
		    }
	    };
	return r
}();
"function" == typeof define && define.amd ? define( function() {
	return LZString
} ) : "undefined" != typeof module && null != module && (module.exports = LZString);
var CommandStorage = {
	init: function( e ) {
		function t( e ) {
			switch( e ) {
				case"board-button":
				case"card-button":
					return !0;
				case"rule":
				case"schedule":
				case"on-date":
					return !1;
				default:
					throw new Error( "Unknown command type." )
			}
		}

		function n( e, t, n ) {
			return i( e, n ).then( function( e ) {
				return e.find( function( e ) {
					return e.id == t
				} )
			} )
		}

		function o( e, t ) {
			return a( t ).then( function( t ) {
				var n = t.find( function( t ) {
					return t.id == e
				} );
				return n ? n : c().then( function( t ) {
					return t.find( function( t ) {
						return t.id == e
					} )
				} )
			} )
		}

		function i( e, n ) {
			return (t( e ) ? a( n ) : c()).then( function( t ) {
				return t.filter( function( t ) {
					return t.type == e
				} )
			} )
		}

		function r( e ) {
			return S.join( a( e ), c() ).spread( function( e, t ) {
				return e.concat( t )
			} )
		}

		function a( t ) {
			return S.join( e.getAll(), e.member( "id" ) ).spread( function( e, n ) {
				var o = [], i = {};
				if( Object.keys( e || [] ).forEach( function( t ) {
						Object.keys( e[ t ] ).forEach( function( r ) {
							var a = e[ t ][ r ].commands;
							if( a ) {
								if( "string" == typeof a ) try {
									a = JSON.parse( LZString.decompressFromUTF16( a ) )
								} catch( e ) {
									return void Log.logError( e, "Context: getPupStorageCommands", "PARSE DECOMPRESSED DATA", a, t, r, n )
								}
								a && (a.forEach( function( e ) {
									e.is_own = e.uid == n.id, i[ e.id ] = e
								} ), o = o.concat( a ))
							}
						} )
					} ), t ) return o;
				var r;
				try {
					r = e.board.private.overrides
				} catch( e ) {
				}
				var a = !1;
				return Object.keys( r || {} ).forEach( function( e ) {
					var t = i[ e ];
					t ? Object.keys( r[ e ] ).forEach( function( n ) {
						t[ n ] = r[ e ][ n ]
					} ) : +new Date - r[ e ].ot > 7776e6 && (delete r[ e ], a = !0)
				} ), a ? y( r ).then( function() {
					return o
				} ) : o
			} )
		}

		function s( e, t ) {
			return e.forEach( function( e ) {
				e.is_own = !0, e.enabled = e.b.indexOf( t.id ) != -1
			} ), C = e
		}

		function u() {
			C = void 0
		}

		function c() {
			return C ? new S( function( e ) {
				e( C )
			} ) : S.join( E(), e.board( "id" ) ).spread( function( e, t ) {
				return new S( function( n, o ) {
					var i = k ? "?obo=" + k : "";
					$.ajax( kApiEndpoint + "powerup-commands" + i, {
						type   : "GET",
						headers: { "X-Butler-Trello-Token": e }
					} ).done( function( e ) {
						return e.success ? void n( s( e.response.commands, t ) ) : o( e.error || "NO_RESPONSE" )
					} ).fail( function( e ) {
						o( "NETWORK_ERROR" )
					} )
				} )
			} )
		}

		function l( e ) {
			return t( e.type ) ? d( e ) : f( e )
		}

		function d( t ) {
			return S.join( e.member( "id", "username" ), a( !0 ) ).spread( function( e, n ) {
				var o, i = +new Date;
				do o = e.id + "-" + ++i; while( n.some( function( e ) {
					return e.id == o
				} ) );
				return t.id = o, t.uid = e.id, t.username = e.username, t.t = i, n.push( t ), _( t.scope, t.shared, n ).then( function() {
					return t.is_own = !0, t
				} )
			} )
		}

		function f( t ) {
			return TrelloPowerUp.Promise.join( E(), e.board( "all" ) ).spread( function( e, n ) {
				return new S( function( o, i ) {
					$.ajax( kApiEndpoint + "powerup-commands", {
						type       : "POST",
						data       : JSON.stringify( {
							op    : "new",
							params: { command: t, board: n },
							obo   : k
						} ),
						contentType: "application/json",
						headers    : { "X-Butler-Trello-Token": e }
					} ).done( function( e ) {
						if( !e.success ) return i( e.error || "NO_RESPONSE" );
						s( e.response.commands, n );
						var t = e.response.commands.find( function( t ) {
							return t.id == e.response.cmd_id
						} );
						o( t )
					} ).fail( function( e ) {
						return i( "NETWORK_ERROR" )
					} )
				} )
			} )
		}

		function p( t, n ) {
			return S.join( a( !0 ), c(), e.member( "id", "username" ) ).spread( function( e, o, i ) {
				var r = e.findIndex( function( e ) {
					return e.id == t
				} );
				return r != -1 ? h( e[ r ], n ) : (r = o.findIndex( function( e ) {
					return e.id == t
				} ), r != -1 ? m( o[ r ], n ) : S.reject( new Error( "Command not found." ) ))
			} )
		}

		function h( t, n ) {
			var o = t.id;
			return e.get( "board", "private", "overrides" ).then( function( e ) {
				e || (e = {});
				var t = e[ o ];
				return t || (t = e[ o ] = {}), t.enabled = n, t.ot = +new Date, y( e )
			} )
		}

		function m( t, n ) {
			return TrelloPowerUp.Promise.join( E(), e.board( "all" ) ).spread( function( e, o ) {
				return new S( function( i, r ) {
					$.ajax( kApiEndpoint + "powerup-commands/" + t.id, {
						type       : "POST",
						data       : JSON.stringify( {
							op    : "enable",
							params: { enabled: n, board: o },
							obo   : k
						} ),
						contentType: "application/json",
						headers    : { "X-Butler-Trello-Token": e }
					} ).done( function( e ) {
						return e.success ? i( s( e.response.commands, o ) ) : r( e.error || "NO_RESPONSE" )
					} ).fail( function( e ) {
						return r( "NETWORK_ERROR" )
					} )
				} )
			} )
		}

		function g( e, t, n ) {
			return v( e, function( e ) {
				return Object.keys( t ).forEach( function( n ) {
					e[ n ] = t[ n ]
				} ), e
			}, n )
		}

		function b( e, t ) {
			return v( e, function( e ) {
				return null
			}, t )
		}

		function v( t, n, o ) {
			return S.join( a( !0 ), c(), e.member( "id", "username" ), e.board( "all" ) ).spread( function( e, i, r, a ) {
				var s = e.findIndex( function( e ) {
					return e.id == t
				} );
				return s != -1 ? w( e, s, r, n, o ) : (s = i.findIndex( function( e ) {
					return e.id == t
				} ), s != -1 ? T( i, s, r, a, n ) : S.reject( new Error( "Command not found." ) ))
			} )
		}

		function w( e, t, n, o, i ) {
			var r = e[ t ];
			if( r.uid != n.id && !i ) return S.reject( new Error( "Command not own." ) );
			var a = r.scope, s = r.shared, u = o( r );
			return u ? (u.uid = n.id, u.username = n.username, u.t = +new Date, e.splice( t, 1, u ), u.scope == a && u.shared == s ? _( a, s, e ).then( function() {
				return u
			} ) : _( r.scope, r.shared, e ).then( function() {
				return _( a, s, e )
			} ).then( function() {
				return u
			} )) : (e.splice( t, 1 ), _( a, s, e ).then( function() {
				return r
			} ))
		}

		function _( t, n, o ) {
			var i  = o.filter( function( e ) {
				return e.scope == t && e.shared == n
			} ), r = LZString.compressToUTF16( JSON.stringify( i ) );
			return e.set( t == CommandStorage.ScopeTeam ? "organization" : "board", n ? "shared" : "private", "commands", r ).then( function() {
				e.get( t == CommandStorage.ScopeTeam ? "organization" : "board", n ? "shared" : "private", "commands" ).then( function( e ) {
					try {
						e = JSON.parse( LZString.decompressFromUTF16( e ) )
					} catch( t ) {
						Log.logError( t, "Context: saveFilteredCommands", { in: JSON.stringify( o ), out: e } )
					}
				} )
			} )
		}

		function y( t ) {
			return e.set( "board", "private", "overrides", t )
		}

		function T( e, t, n, o, i ) {
			var r, a = e[ t ], u = i( a );
			return r = u ? JSON.stringify( {
				op    : "update",
				params: { command: u },
				obo   : k
			} ) : JSON.stringify( { op: "delete", obo: k } ), E().then( function( e ) {
				return new S( function( t, n ) {
					$.ajax( kApiEndpoint + "powerup-commands/" + a.id, {
						type       : "POST",
						data       : r,
						contentType: "application/json",
						headers    : { "X-Butler-Trello-Token": e }
					} ).done( function( e ) {
						return e.success ? t( s( e.response.commands, o ) ) : n( e.error || "NO_RESPONSE" )
					} ).fail( function( e ) {
						return n( "NETWORK_ERROR" )
					} )
				} )
			} )
		}

		function E() {
			return e.get( "member", "private", "token" )
		}

		CommandStorage.ScopeBoard = "board", CommandStorage.ScopeTeam = "team", CommandStorage.getCommand = n, CommandStorage.getCommandById = o, CommandStorage.getCommands = i, CommandStorage.getAllCommands = r, CommandStorage.getLocalCommands = a, CommandStorage.addCommand = l, CommandStorage.removeCommandId = b, CommandStorage.updateCommandId = g, CommandStorage.enableCommandId = p, CommandStorage.init = function( t ) {
			e = t || TrelloPowerUp.iframe()
		}, CommandStorage.setAdminOnBehalfOf = function( e ) {
			k = e || void 0, u()
		}, CommandStorage.getAdminOnBehalfOf = function() {
			return k
		};
		var k, C, e = e || TrelloPowerUp.iframe(), S = TrelloPowerUp.Promise
	}
}, MessageBroker   = {};
!function() {
	function e() {
		return r && r.isConnected()
	}

	function t() {
		return e() ? r.clientId : null
	}

	function n() {
		return e() ? r : null
	}

	function o( e ) {
		$.ajax( kApiEndpoint + "mqtt-session", {
			type       : "POST",
			data       : JSON.stringify( {} ),
			contentType: "application/json",
			headers    : { "X-Ludable-Auth-Token": e }
		} ).done( function( e ) {
			return e.success ? (params || (params = {}), params.url = e.response.url, params.client_id = e.response.client_id, void i( params )) : (params.onConnectionFailure || a)( e.error )
		} ).fail( function( e ) {
			(params.onConnectionFailure || a)( "NETWORK_ERROR" )
		} )
	}

	function i( e ) {
		r = null;
		var t = new Paho.MQTT.Client( e.url, e.client_id ), n = {
			useSSL      : !0, timeout: 3, mqttVersion: 4, onSuccess: function() {
				e.topic && t.subscribe( e.topic ), r = t, (e.onConnectionSuccess || a)( t )
			}, onFailure: function() {
				(e.onConnectionFailure || stuf_fn)( "MQTT_CONNECTION_FAILURE" )
			}
		};
		t.connect( n ), t.onConnectionLost = function() {
			r = null, e.onConnectionLost && e.onConnectionLost( t )
		}, t.onMessageArrived = function( n ) {
			e.onMessageReceived && e.onMessageReceived( t, n.destinationName, n.payloadString )
		}
	}

	MessageBroker.startSession = o, MessageBroker.connect = i, MessageBroker.isSessionActive = e, MessageBroker.getSessionId = t, MessageBroker.getSessionClient = n;
	var r, a = function() {
	}
}();
var ReleaseNotes = {};
!function() {
	var e = [ {
		date : "2018-07-28T00:00:00.000Z",
		until: "2018-08-06T23:59:59.999Z",
		notes: { en: "Archiving cards after a number of days. Better buttons. Action cascading.\n\nDiscover all the new features we've introduced in July in the [Butler Update Log](https://butlerfortrello.com/update-log.html)." }
	} ];
	ReleaseNotes.check = function( t ) {
		return t.get( "member", "private", "rn" ).then( function( n ) {
			var o = (new Date).toISOString();
			(!n || n < o) && (n = o);
			var i = e.filter( function( e ) {
				return e.until > n
			} );
			if( i.length ) {
				var r = $( ".powerup-release-notes" );
				if( r.length ) {
					var a = r.find( ".release-notes" );
					if( a.length ) {
						var s = "en", u = $( i.map( function( e ) {
							return "<p><u><b>" + moment( e.date ).format( "LL" ) + "</u></b><br>" + markdownToHtml( e.notes[ s ] || e.notes.en ) + "</p>"
						} ).join( "" ) );
						u.find( "a" ).attr( "target", "_blank" ), a.html( u )
					}
					r.find( ".close" ).off( "click" ).click( function() {
						$( r ).transition( "fade" ), n = i.reduce( function( e, t ) {
							return t.until > e ? t.until : e
						}, n ), t.set( "member", "private", "rn", n ).then( function() {
							t.set( "board", "private", "_", null )
						} )
					} ), r.transition( "show" )
				}
			}
			return i.length
		} )
	}, ReleaseNotes.clear = function( e ) {
		(e || TrelloPowerUp.iframe()).set( "member", "private", "rn", null )
	}
}();
var Suggestions = {};
!function() {
	function e( e ) {
		if( !Trello.token() ) return n( function( e, t ) {
			t( "NOT_AUTHENTICATED" )
		} );
		var t = TrelloPowerUp.iframe(), n = TrelloPowerUp.Promise, o = moment.tz.guess();
		return t.board( "id" ).then( function( t ) {
			return new n( function( n, i ) {
				$.ajax( kApiEndpoint + "powerup-suggest/" + t.id + "?tz=" + o + (e ? "&refresh=true" : ""), {
					type   : "GET",
					headers: { "X-Butler-Trello-Token": Trello.token() }
				} ).done( function( e ) {
					e.success ? n( e.response ) : i( e.error )
				} ).fail( function( e ) {
					i( "NETWORK_ERROR" )
				} )
			} )
		} )
	}

	function t( e ) {
		return o( e, "accept" )
	}

	function n( e ) {
		return o( e, "discard" )
	}

	function o( e, t ) {
		if( !Trello.token() ) return o( function( e, t ) {
			t( "NOT_AUTHENTICATED" )
		} );
		var n = TrelloPowerUp.iframe(), o = TrelloPowerUp.Promise;
		moment.tz.guess();
		return n.board( "id" ).then( function( n ) {
			return new o( function( o, i ) {
				$.ajax( kApiEndpoint + "powerup-suggest/" + n.id, {
					type       : "POST",
					data       : JSON.stringify( { suggestion: e, action: t } ),
					contentType: "application/json",
					headers    : { "X-Butler-Trello-Token": Trello.token() }
				} ).done( function( e ) {
					e.success ? o( e.response ) : i( e.error )
				} ).fail( function( e ) {
					i( "NETWORK_ERROR" )
				} )
			} )
		} )
	}

	Suggestions.getSuggestions = e, Suggestions.accept = t, Suggestions.discard = n
}();
var Plan = {};
!function() {
	function e( e ) {
		TrelloPowerUp.Promise;
		return e || (e = TrelloPowerUp.iframe()), e.get( "member", "private", "plan" ).catch( function( e ) {
			return null
		} )
	}

	function t() {
		var e = document.location.href.split( "/" ).slice( 3, -1 ).join( "/" );
		return e
	}

	function n() {
		return Trello.token() ? e().then( function( e ) {
			e ? c( e.plan_id, e.is_org, e.org_name ) : c(), $.ajax( kApiEndpoint + "plan?usage=true&powerup_usage=true&v=" + t(), {
				type   : "GET",
				headers: { "X-Butler-Trello-Token": Trello.token() }
			} ).done( function( e ) {
				e.success ? r( e.response ) : u()
			} ).fail( function( e ) {
			} )
		} ) : c()
	}

	function o( e, t ) {
		c( e.plan_id, e.is_org, e.org_name ), setTimeout( n, t )
	}

	function i( e ) {
		var n = +new Date, o = p + 3e5;
		n < o || (p = n, Auth.getTokenFromPowerUp( e, function( n ) {
			$.ajax( kApiEndpoint + "plan?usage=true&powerup_usage=true&v=" + t(), {
				type   : "GET",
				headers: { "X-Butler-Trello-Token": n }
			} ).done( function( t ) {
				if( !t.success ) return u( e );
				a( t.response, e );
				var n = t.response.powerup_usage, o = n.usage >= n.quota;
				ButlerPowerUp.setAttnStatus( e, "quota", o ), n = t.response.usage, o = n.usage >= n.quota, ButlerPowerUp.setAttnStatus( e, "quota-ops", o )
			} ).fail( function( e ) {
			} )
		}, function() {
		} ))
	}

	function r( e ) {
		var t = TrelloPowerUp.iframe();
		TrelloPowerUp.Promise;
		e.powerup_usage && l( e.powerup_usage ), e.usage && d( e.usage ), c( e.plan_id, e.is_org, e.org_name );
		var n = e.features;
		"object" == typeof n && ("string" == typeof n.show && $( n.show.split( "," ).map( function( e ) {
			return "." + e
		} ).join( "," ) ).transition( "show" ), "string" == typeof n.hide && $( n.hide.split( "," ).map( function( e ) {
			return "." + e
		} ).join( "," ) ).transition( "hide" )), s( e, t )
	}

	function a( e, t ) {
		e.hasOwnProperty( "no_ui" ) && t.get( "member", "private", "plan" ).then( function( n ) {
			n && n.no_ui === e.no_ui || s( e, t )
		} ).catch( function( n ) {
			s( e, t )
		} )
	}

	function s( e, t ) {
		var n = {
			user_id   : e.user_id,
			plan_id   : e.plan_id,
			is_org    : e.is_org,
			is_admin  : e.is_admin,
			org_name  : e.org_name,
			plan_start: e.plan_start
		};
		return e.hasOwnProperty( "no_ui" ) && (n.no_ui = e.no_ui), t.set( "member", "private", "plan", n )
	}

	function u( e ) {
		var t = e || TrelloPowerUp.iframe(), n = TrelloPowerUp.Promise;
		n.join( t.remove( "organization", "private", "plan" ), t.remove( "board", "private", "plan" ), t.remove( "member", "private", "plan" ) ).done();
		try {
			c()
		} catch( e ) {
		}
	}

	function c( e, t, n ) {
		e || (e = ""), e.match( /^ROYAL_TREATMENT/ ) ? ($( ".butler-bronze" ).transition( "hide" ), $( ".butler-silver" ).transition( "hide" ), $( ".butler-team" ).transition( "hide" ), $( ".butler-enterprise" ).transition( "hide" ), $( ".butler-gold" ).transition( "show" )) : e.match( /^SILVER_PLATTER/ ) ? ($( ".butler-bronze" ).transition( "hide" ), $( ".butler-gold" ).transition( "hide" ), $( ".butler-team" ).transition( "hide" ), $( ".butler-enterprise" ).transition( "hide" ), $( ".butler-silver" ).transition( "show" )) : e.match( /^TEAM/ ) ? ($( ".butler-bronze" ).transition( "hide" ), $( ".butler-silver" ).transition( "hide" ), $( ".butler-gold" ).transition( "hide" ), $( ".butler-enterprise" ).transition( "hide" ), $( ".butler-team" ).transition( "show" )) : e.match( /^ENTERPRISE/ ) ? ($( ".butler-bronze" ).transition( "hide" ), $( ".butler-silver" ).transition( "hide" ), $( ".butler-gold" ).transition( "hide" ), $( ".butler-team" ).transition( "hide" ), $( ".butler-enterprise" ).transition( "show" ), $( ".butler-enterprise-hide" ).transition( "hide" )) : ($( ".butler-silver" ).transition( "hide" ), $( ".butler-gold" ).transition( "hide" ), $( ".butler-team" ).transition( "hide" ), $( ".butler-enterprise" ).transition( "hide" ), $( ".butler-bronze" ).transition( "show" )), t ? ($( ".butler-org-name" ).text( n || "(unnamed)" ), $( ".butler-no-org" ).transition( "hide" ), $( ".butler-org" ).transition( "show" )) : ($( ".butler-org" ).transition( "hide" ), $( ".butler-no-org" ).transition( "show" ))
	}

	function l( e ) {
		$( ".powerup-usage" ).transition( "hide" ), $( ".powerup-nousage" ).transition( "hide" );
		var t = e.usage || 0;
		if( !t && !e.hasOwnProperty( "quota" ) ) return void $( ".powerup-nousage" ).transition( "slide down" );
		$( ".powerup-quota" ).text( e.quota ), $( ".powerup-used" ).text( t ), $( ".powerup-used-percent" ).text( Math.round( 100 * t / e.quota ) ), $( ".powerup-usage" ).transition( "slide down" );
		var n = e.usage >= e.quota;
		$( ".powerup-usage-quota-exceeded" ).transition( n ? "show" : "hide" ), ButlerPowerUp.setAttnStatus( TrelloPowerUp.iframe(), "quota", n )
	}

	function d( e ) {
		var t = e.usage || 0;
		$( ".ops-quota" ).text( e.quota ), $( ".ops-used" ).text( t ), $( ".ops-used-percent" ).text( Math.round( 100 * t / e.quota ) );
		var n = e.usage >= e.quota;
		$( ".powerup-usage-ops-quota-exceeded" ).transition( n ? "show" : "hide" ), ButlerPowerUp.setAttnStatus( TrelloPowerUp.iframe(), "quota-ops", n )
	}

	function f( e ) {
		return e && e.plan_id && e.plan_id.match( /^SILVER_PLATTER|^ROYAL_TREATMENT|^TEAM|^ENTERPRISE/ )
	}

	Plan.getUserPlanLocal = e, Plan.refreshUserPlan = n, Plan.delayedRefreshUserPlan = o, Plan.checkUserQuota = i, Plan.updatePlan = r, Plan.isPaid = f;
	var p = 0
}();
var Upgrade = {};
!function() {
	function e( e ) {
		var a;
		e && s( e.toUpperCase(), function( e, t ) {
			if( e ) switch( e ) {
				case"COUPON_NOT_FOUND":
				case"COUPON_EXPIRED":
					$( ".coupon-invalid" ).transition( "show" );
					break;
				default:
					$( ".coupon-network" ).transition( "show" )
			} else a = t, $( ".add-coupon" ).transition( "hide" ), $( ".coupon-description" ).transition( "show" ).html( "Special rate will be applied on the prices shown: <b>" + a.description + "</b>" )
		} ), $( ".add-coupon" ).off( "click" ).click( function( e ) {
			t( function( e ) {
				a = e
			} )
		} ), $( ".upgrade-silver" ).off( "click" ).click( function( e ) {
			var t = $( ".annual-billing:visible" ).length;
			return o( t ? "SILVER_PLATTER-ANNUAL" : "SILVER_PLATTER", a ), !1
		} ), $( ".upgrade-royal" ).off( "click" ).click( function( e ) {
			var t = $( ".annual-billing:visible" ).length;
			return o( t ? "ROYAL_TREATMENT-ANNUAL" : "ROYAL_TREATMENT", a ), !1
		} ), $( ".upgrade-royal-existing" ).off( "click" ).click( function( e ) {
			var t = $( ".annual-billing:visible" ).length;
			return r( t ? "ROYAL_TREATMENT-ANNUAL" : "ROYAL_TREATMENT", a ), !1
		} ), $( ".ui.form.team-upgrade-legal" ).form( { fields: { "accept-legal": "checked" } } ), $( ".upgrade-team-do-btn" ).off( "click" ).click( function( e ) {
			var t = $( ".annual-billing:visible" ).length, n = $( ".select-team" ).dropdown( "get value" );
			return $( ".ui.form.team-upgrade-legal" ).form( "is valid" ) && i( n, t ? "TEAM5-ANNUAL" : "TEAM5", a ), !1
		} ), $( ".upgrade-team-btn" ).off( "click" ).click( n ), $( ".upgrade-person-btn" ).off( "click" ).click( function( e ) {
			return $( ".upgrade-team" ).transition( "hide" ), $( ".upgrade-person" ).transition( "slide right" ), !1
		} ), $( ".monthly-billing.hidden" ).transition( "show" ), $( ".annual-billing:not(.hidden)" ).transition( "hide" ), $( ".switch-to-annual" ).click( function( e ) {
			return $( ".monthly-billing" ).transition( "hide" ), $( ".annual-billing" ).transition( "show" ), !1
		} ), $( ".switch-to-monthly" ).click( function( e ) {
			return $( ".annual-billing" ).transition( "hide" ), $( ".monthly-billing" ).transition( "show" ), !1
		} )
	}

	function t( e ) {
		var t = $( "#upgrade-add-coupon" ), n = t.find( ".rate-code" ), o = t.find( ".approve.button" );
		n.removeClass( "disabled loading" ), o.removeClass( "disabled" ), t.find( ".coupon-error" ).transition( "hide" ), t.modal( {
			onApprove: function() {
				var i = n.find( "input" ).val().toUpperCase();
				return n.addClass( "disabled loading" ), o.addClass( "disabled" ), t.find( ".coupon-error" ).transition( "hide" ), s( i, function( i, r ) {
					if( n.removeClass( "disabled loading" ), o.removeClass( "disabled" ), i ) switch( i ) {
						case"COUPON_NOT_FOUND":
						case"COUPON_EXPIRED":
							t.find( ".coupon-invalid" ).transition( "show" );
							break;
						default:
							t.find( ".coupon-network" ).transition( "show" )
					} else $( ".add-coupon" ).transition( "hide" ), $( ".coupon-description" ).transition( "show" ).html( "Special rate will be applied on the prices shown: <b>" + r.description + "</b>" ), t.modal( "hide" ), e( r )
				} ), !1
			}
		} ).modal( "show" )
	}

	function n() {
		$( ".upgrade-person" ).transition( "hide" ), $( ".upgrade-team" ).transition( "slide left" );
		var e = $( ".select-team" );
		e.dropdown( "clear" );
		var t = Trello.token();
		if( t ) return Trello.get( "members/me/organizations" ).then( function( t ) {
			var n = t.map( function( e ) {
				var t = e.memberships.filter( function( e ) {
					return !e.unconfirmed && !e.deactivated
				} ).length;
				return '<div class="item" data-value="' + e.id + '">' + sanitize( e.displayName ) + " (" + t + " users)</div>"
			} ).join( "\n" );
			if( e.find( ".menu" ).html( n ), e.dropdown( "refresh" ), t.length ) {
				e.dropdown( "set selected", t[ 0 ].id ), $( ".upgrade-team-do-btn" ).removeClass( "disabled" );
				var o;
				try {
					o = TrelloPowerUp.iframe()
				} catch( e ) {
				}
				o && o.board( "id" ).then( function( t ) {
					Trello.get( "boards/" + t.id + "?fields=idOrganization" ).then( function( t ) {
						e.dropdown( "set selected", t.idOrganization )
					} )
				} )
			} else $( ".upgrade-team-do-btn" ).addClass( "disabled" )
		} ), !1
	}

	function o( e, t ) {
		if( d = Trello.token(), !d ) throw new Error( "Not authenticated." );
		Trello.get( "members/me" ).then( function( n ) {
			a( e, t, function( o ) {
				var i = StripeCheckout.configure( {
					key           : "pk_live_gnj0jPQhTTJDW3lpFwaEKDJK",
					image         : "https://s3.amazonaws.com/stripe-uploads/acct_18SbEoBsUBNuoaXpmerchant-icon-1477317955687-butlerbot-round.png",
					name          : "Butler for Trello",
					locale        : "auto",
					zipCode       : !0,
					billingAddress: !0,
					email         : n.email
				} );
				window.addEventListener( "popstate", function() {
					i.close()
				} ), i.open( {
					description: o.plan.name,
					amount     : o.plan.amount,
					currency   : o.plan.currency,
					panelLabel : "Subscribe {{amount}}/" + o.plan.interval,
					token      : function( n, o ) {
						u( e, t, n, o )
					}
				} )
			} )
		} )
	}

	function i( e, t, n ) {
		if( d = Trello.token(), !d ) throw new Error( "Not authenticated." );
		Trello.get( "members/me" ).then( function( o ) {
			var i = StripeCheckout.configure( {
				key           : "pk_live_gnj0jPQhTTJDW3lpFwaEKDJK",
				image         : "https://s3.amazonaws.com/stripe-uploads/acct_18SbEoBsUBNuoaXpmerchant-icon-1477317955687-butlerbot-round.png",
				name          : "Butler for Trello",
				locale        : "auto",
				zipCode       : !0,
				billingAddress: !0,
				email         : o.email
			} );
			window.addEventListener( "popstate", function() {
				i.close()
			} ), i.open( {
				description: "Butler for Teams", token: function( o, i ) {
					u( t, n, o, i, e )
				}
			} )
		} )
	}

	function r( e, t ) {
		$( "#upgrade-confirm-modal" ).modal( {
			onApprove: function() {
				c( e, t )
			}
		} ).modal( "show" )
	}

	function a( e, t, n ) {
		var o = !!e.match( /^ROYAL_TREATMENT/ ), i = !!e.match( /-ANNUAL$/ ), r = {
			plan: {
				name    : o ? "Royal Treatment" : "Silver Platter Service",
				amount  : o ? i ? 22e3 : 2e3 : i ? 11e3 : 1e3,
				interval: i ? "year" : "month",
				currency: "usd"
			}
		};
		t && (t.percent_off && (r.plan.amount -= Math.round( r.plan.amount * t.percent_off / 100 )), t.amount_off && (r.plan.amount -= t.amount_off)), n( r )
	}

	function s( e, t ) {
		if( d = Trello.token(), !d ) return t( "USER_NOT_FOUND" );
		var n = "";
		$.ajax( kApiEndpoint + "stripe-coupon/" + e + n, {
			type   : "GET",
			headers: { "X-Butler-Trello-Token": d }
		} ).done( function( e ) {
			if( e.success ) {
				var n = e.response.coupon;
				n.percent_off && (n.description = n.percent_off + "% off"), n.amount_off && (n.description = "$" + n.amount_off / 100 + " off"), n.duration_in_months && (n.description += " for the first " + n.duration_in_months + " months"), t( null, n )
			} else t( e.error )
		} ).fail( function( e ) {
			t( "NETWORK_ERROR" )
		} )
	}

	function u( e, t, n, o, i ) {
		if( !d ) throw new Error( "Not authenticated." );
		var r = $( "#upgrade-modal" ).modal( { closable: !1 } ).modal( "show" ), a = r.find( ".ok.button" );
		a.addClass( "disabled" ), l( "#upgrade-status-charging" );
		var s = kApiEndpoint + "stripe",
		    u = { plan: e, coupon: t ? t.id : void 0, stripe_token: n, stripe_args: o, source: "powerup" };
		i && (u.team_id = i, s += "-team"), $.ajax( s, {
			type       : "POST",
			data       : JSON.stringify( u ),
			contentType: "application/json",
			headers    : { "X-Butler-Trello-Token": d }
		} ).done( function( e ) {
			if( e.success ) {
				l( "#upgrade-status-success" ), a.removeClass( "disabled" );
				try {
					Plan.delayedRefreshUserPlan( { plan_id: e.response.plan }, 6e4 )
				} catch( e ) {
				}
			} else switch( console.log( e.error ), a.removeClass( "disabled" ), e.error ) {
				case"PAYMENT_DECLINED":
					$( "#upgrade-decline-reason" ).text( e.info ), l( "#upgrade-status-payment-declined" );
					break;
				case"INTERNAL_ERROR":
				case"PAYMENT_ERROR":
				case"USER_NOT_FOUND":
					l( "#upgrade-status-payment-error" );
					break;
				case"PLAN_ALREADY_CURRENT":
					l( "#upgrade-status-plan-already-current" );
					break;
				case"MANUAL_PLAN_CHANGE":
					l( "#upgrade-status-manual-plan-change" );
					break;
				case"CANT_UPGRADE_ORG_USER":
					l( "#upgrade-status-cant-upgrade-org-user" );
					break;
				case"ORG_ALREADY_EXISTS":
					l( "#upgrade-status-org-already-upgraded" );
					break;
				case"UPGRADE_ERROR":
				default:
					l( "#upgrade-status-upgrade-error" )
			}
		} ).fail( function( e ) {
			a.removeClass( "disabled" ), $( "#upgrade-payment-btn" ).removeClass( "disabled" ), l( "#upgrade-status-payment-error" )
		} )
	}

	function c( e, t ) {
		if( d = Trello.token(), !d ) throw new Error( "Not authenticated." );
		var n = $( "#upgrade-modal" ).modal( { closable: !1 } ).modal( "show" ), o = n.find( ".ok.button" );
		o.addClass( "disabled" ), l( "#upgrade-status-charging" );
		var i = kApiEndpoint + "stripe-change", r = { plan: e, source: "powerup", coupon: t ? t.id : void 0 };
		$.ajax( i, {
			type       : "POST",
			data       : JSON.stringify( r ),
			contentType: "application/json",
			headers    : { "X-Butler-Trello-Token": d }
		} ).done( function( e ) {
			if( e.success ) {
				l( "#upgrade-status-success" ), o.removeClass( "disabled" );
				try {
					Plan.delayedRefreshUserPlan( {
						plan_id: e.response.plan
					}, 6e4 )
				} catch( e ) {
				}
			} else switch( console.log( e.error ), o.removeClass( "disabled" ), e.error ) {
				case"PAYMENT_DECLINED":
					$( "#upgrade-decline-reason" ).text( e.info ), l( "#upgrade-status-payment-declined" );
					break;
				case"INTERNAL_ERROR":
				case"PAYMENT_ERROR":
				case"USER_NOT_FOUND":
					l( "#upgrade-status-payment-error" );
					break;
				case"PLAN_ALREADY_CURRENT":
					l( "#upgrade-status-plan-already-current" );
					break;
				case"MANUAL_PLAN_CHANGE":
					l( "#upgrade-status-manual-plan-change" );
					break;
				case"CANT_UPGRADE_ORG_USER":
					l( "#upgrade-status-cant-upgrade-org-user" );
					break;
				case"ORG_ALREADY_EXISTS":
					l( "#upgrade-status-org-already-upgraded" );
					break;
				case"UPGRADE_ERROR":
				default:
					l( "#upgrade-status-upgrade-error" )
			}
		} ).fail( function( e ) {
			o.removeClass( "disabled" ), $( "#upgrade-payment-btn" ).removeClass( "disabled" ), l( "#upgrade-status-payment-error" )
		} )
	}

	function l( e ) {
		$( ".upgrade-status" ).transition( "hide" ), $( e ).transition( "fade down" )
	}

	Upgrade.init = e, Upgrade.upgrade = o, Upgrade.upgradeTeam = i, Upgrade.switchToTeam = n;
	var d
}();
var Dashboard = {};
!function() {
	function e() {
		CommandStorage.init(), ReleaseNotes.check( TrelloPowerUp.iframe() ), $( ".dashboard-tabs .ui.dropdown" ).dropdown( { on: "hover" } ), $( '.dashboard-tabs .item[data-tab="tab-card-buttons"]' ).click( function() {
			n( "card-button" )
		} ), $( '.dashboard-tabs .item[data-tab="tab-board-buttons"]' ).click( function() {
			n( "board-button" )
		} ), $( '.dashboard-tabs .item[data-tab="tab-rules"]' ).click( function() {
			n( "rule" )
		} ), $( '.dashboard-tabs .item[data-tab="tab-schedules"]' ).click( function() {
			n( "schedule" )
		} ), $( '.dashboard-tabs .item[data-tab="tab-on-dates"]' ).click( function() {
			n( "on-date" )
		} );
		var e = (window.location.search.match( /tab=([a-zA-Z]*)/ ) || [])[ 1 ];
		switch( e ) {
			case"auth":
				Auth.showAuthTab( "card-buttons", function() {
					n( "card-button" )
				} );
				break;
			case"rules":
				Auth.showAuthTab( "rules", function() {
					n( "rule" )
				} );
				break;
			case"schedule":
			case"schedules":
			case"scheduled":
				Auth.showAuthTab( "schedules", function() {
					n( "schedule" )
				} );
				break;
			case"on-dates":
			case"due-dates":
			case"duedates":
			case"dates":
				Auth.showAuthTab( "on-dates", function() {
					n( "on-dates" )
				} );
				break;
			default:
				Auth.authorizeSoft( function() {
					Plan.refreshUserPlan()
				} ), n( "card-button" )
		}
		a(), t()
	}

	function t() {
		$( ".help-popup" ).click( function() {
			return !1
		} ).each( function( e, t ) {
			var n = $( t ), o = n.attr( "data-popup-selector" ), i = o ? $( o ) : n.next( ".ui.popup" );
			n.popup( {
				on        : "click",
				popup     : i,
				target    : !!n.length && n,
				position  : "top center",
				lastResort: "bottom center",
				hoverable : !1
			} )
		} ), $( ".close-popup" ).off( "click" ).click( function( e ) {
			$( e.target ).closest( ".popup" ).popup( "hide all" )
		} ), Upgrade.init(), $( ".butler-account-details-btn" ).off( "click" ).click( function( e ) {
			return TrelloPowerUp.iframe().overlay( { url: "./powerup-account.html?tab=account" } ), !1
		} ), $( ".butler-usage-details-btn" ).off( "click" ).click( function( e ) {
			return TrelloPowerUp.iframe().overlay( { url: "./powerup-account.html?tab=usage" } ), !1
		} ), $( ".butler-upgrade-btn" ).off( "click" ).click( function( e ) {
			showTab( "upgrade", !0 )
		} ), $( ".command-list-filter .ui.dropdown" ).dropdown( {
			onChange: function( e, t, n ) {
				$( ".command-list-filter .command-search" ).transition( "search" == e ? "show" : "hide" ), "search" == e && $( this ).dropdown( "set text", "" ), V( !0 )
			}
		} ), $( ".command-list-filter .command-search" ).off( "input" ).on( "input", function() {
			V( !0 )
		} )
	}

	function n( e, t ) {
		showTab( e + "s" ), $( ".builder-batch-select,.builder-batch,.card-button,.board-button,.rule,.schedule,.on-date,.command-list-filter,.command-list" ).transition( "hide" ), $( "." + e ).transition( "show" ), Auth.authorizeSoft( function() {
			o(), k( e, t )
		}, function() {
			F(), i( function() {
				Auth.authorize( e + "s", function() {
					n( e, t )
				} )
			} )
		} )
	}

	function o() {
		$( ".command-section .new-command-btn" ).transition( "show" ), $( ".command-section .suggestions-btn" ).transition( "show" ), $( ".command-section .get-started-btn" ).transition( "hide" )
	}

	function i( e ) {
		$( ".command-section .new-command-btn" ).transition( "hide" ), $( ".command-section .suggestions-btn" ).transition( "hide" ), $( ".command-section .get-started-btn" ).off( "click" ).click( e ).transition( "show" )
	}

	function r( e ) {
		switch( e ) {
			case"rule":
			case"schedule":
			case"on-date":
				Y = !0;
				break;
			default:
				Y = !1
		}
		if( !X ) {
			X = !0, $( ".builder-start-hidden" ).transition( "hide" ), $( ".builder-tabs .item" ).tab( {
				onFirstLoad: function() {
					Builder.setupDropdowns( this )
				}
			} ), Builder.setupDropdowns( ".builder .ui.tab.active" ), Builder.setupDropdowns( ".builder.ui.popup" ), $( ".user-timezone" ).text( moment.tz.guess() ), $( ".builder.popup .clause.segment" ).prepend( '<div class="ui icon inverted blue right floated small button select-clause-btn" tabindex="0"><i class="plus icon"></i></div>' ), $( ".select-clause-btn" ).off( "click" ).click( _ ), $( ".builder-open:not(.builder-popup)" ).off( "click" ).click( function( e ) {
				T( e, ".builder-open", ".builder-optional" )
			} ), $( ".builder-close:not(.builder-popup)" ).off( "click" ).click( function( e ) {
				T( e, ".builder-optional", ".builder-open" )
			} ), $( ".builder-add-clause" ).off( "click" ).click( function( e ) {
				var t = $( e.target ).closest( ".builder-add-clause" ), n = t.siblings( ".multiple-clause:first" ),
				    o = n.clone( !1 );
				o.find( "input" ).val( "" ), Builder.setupDropdowns( o ), Builder.setupPowerUpAutoComplete( o ), o.find( ".builder-open-nested" ).click( function( e ) {
					T( e, ".builder-open-nested", ".builder-optional-nested" )
				} ), o.find( ".builder-delete" ).click( y ), o.insertBefore( t ).transition( "drop" )
			} ), $( ".builder-open.builder-popup" ).each( function( e, t ) {
				$( t ).popup( {
					on        : "click",
					inline    : !1,
					popup     : $( t ).attr( "data-popup-selector" ),
					target    : $( t ),
					position  : "bottom center",
					lastResort: "bottom center",
					hoverable : !1,
					onShow    : function() {
						var e = $( t ).parent( "span" );
						e.length ? $( e ).after( $( this ).detach() ) : $( t ).after( $( this ).detach() ), $( t ).siblings( ".prefix" ).transition( "show" )
					},
					onHidden  : function() {
						$( t ).siblings( ".builder-optional:visible" ).length || $( t ).siblings( ".prefix" ).transition( "scale down" )
					}
				} )
			} ), $( ".builder-close.builder-popup" ).off( "click" ).click( function( e ) {
				T( e, ".builder-optional", ".builder-open.builder-popup" )
			} ), $( ".close-popup" ).off( "click" ).click( function( e ) {
				$( e.target ).closest( ".popup" ).popup( "hide all" )
			} ), Builder.setupInputFields( ".builder" ), Builder.setupPowerUpAutoComplete( ".builder" ), $( "#builder-open-help" ).popup( {
				on        : "click",
				inline    : !1,
				popup     : $( ".builder-help" ),
				position  : "top right",
				lastResort: "top right",
				hoverable : !1
			} ), $( ".builder-example" ).click( function() {
				return !1
			} ).each( function( e, t ) {
				var n = $( t ).next( ".ui.popup" ), o = $( t ).children( "a" ).first();
				$( t ).popup( {
					on        : "click",
					popup     : n,
					target    : !!o.length && o,
					position  : "top center",
					lastResort: "top center",
					hoverable : !1
				} )
			} );
			var t = TrelloPowerUp.iframe();
			$( ".builder-advanced-toggle" ).checkbox( {
				onChecked     : function() {
					t.set( "member", "private", "advanced", !0 ), $( ".builder-basic" ).addClass( "hidden" ).hide(), $( ".builder-advanced" ).removeClass( "hidden" ).show()
				}, onUnchecked: function() {
					t.set( "member", "private", "advanced", !1 ), $( ".builder-basic" ).removeClass( "hidden" ).show(), $( ".builder-advanced" ).addClass( "hidden" ).hide()
				}
			} ), $( ".builder-basic" ).removeClass( "hidden" ).show(), $( ".builder-advanced" ).addClass( "hidden" ).hide(), $( ".builder-advanced-toggle" ).checkbox( "set unchecked" ), t.get( "member", "private", "advanced" ).then( function( e ) {
				e ? ($( ".builder-basic" ).addClass( "hidden" ).hide(), $( ".builder-advanced" ).removeClass( "hidden" ).show(), $( ".builder-advanced-toggle" ).checkbox( "set checked" )) : ($( ".builder-basic" ).removeClass( "hidden" ).show(), $( ".builder-advanced" ).addClass( "hidden" ).hide(), $( ".builder-advanced-toggle" ).checkbox( "set unchecked" ))
			} ), $( ".builder-show-more-content" ).hide(), $( ".builder-show-more" ).click( function() {
				return $( ".builder-show-more" ).hide(), $( ".builder-show-more-content" ).show(), !1
			} ), $( ".triggers .phrase" ).prepend( '<div class="ui icon inverted blue right floated button select-trigger-btn" tabindex="0"><i class="plus icon"></i></div>' ), $( ".actions .phrase" ).prepend( '<div class="ui icon inverted blue right floated button select-action-btn" tabindex="0"><i class="plus icon"></i></div>' ), $( ".select-trigger-btn" ).click( function( e ) {
				var t = $( e.target ).closest( ".phrase" ).find( 'input[type="text"]:not(.optional):visible' ).filter( function() {
					return !this.value
				} ).addClass( "error" ).off( "focus" ).focus( function() {
					$( this ).removeClass( "error" )
				} );
				if( !t.length ) {
					var n = $( e.target ).closest( ".phrase" ), o = Z( n[ 0 ] ).split( "\n" );
					o.slice( 1 ).forEach( function( e ) {
						d( e, !0 )
					} );
					var i = $( ".builder-wizard" ).offset().top;
					i < $( "html" ).scrollTop() && $( "html,body" ).animate( { scrollTop: i }, "slow" ), l( o[ 0 ] )
				}
			} ), $( ".select-action-btn" ).click( function( e ) {
				var t = $( e.target ).closest( ".phrase" ).find( 'input[type="text"]:not(.optional):visible' ).filter( function() {
					return !this.value
				} ).addClass( "error" ).off( "focus" ).focus( function() {
					$( this ).removeClass( "error" )
				} );
				if( !t.length ) {
					var n = $( e.target ).closest( ".phrase" ), o = Z( n[ 0 ] ), i = $( ".builder-wizard" ).offset().top;
					i < $( "html" ).scrollTop() && $( "html,body" ).animate( { scrollTop: i }, "slow" ), d( o ), $( ".select-action-btn" ).blur()
				}
			} )
		}
	}

	function a() {
		$( ".command-section .new-command-btn" ).click( function() {
			var e = getCurrentTab().replace( /s$/, "" );
			A( e, function( t, n ) {
				n ? $( ".butler-limit-warning" ).transition( "show" ).transition( "pulse" ) : s( e )
			} )
		} ), $( ".command-section .suggestions-btn" ).click( G ), $( ".ui.form.button-config" ).form( {
			fields: { "button-label": "empty" },
			on    : "blur"
		} ), $( ".button-icon-select" ).dropdown( {
			onChange: function( e, t, n ) {
				$( this ).find( ">i" ).replaceWith( $( t ) )
			}
		} )
	}

	function s( e, t, n, o ) {
		r( e ), n ? $( ".builder .cancel-btn, .builder-wizard .cancel-btn" ).off( "click" ).click( function() {
			q(), G()
		} ) : $( ".builder .cancel-btn, .builder-wizard .cancel-btn" ).off( "click" ).click( q );
		var i = $( ".builder-wizard:visible" ).length, a = function() {
			u( t, n, o ), i || $( ".builder-wizard" ).transition( {
				animation : "fade right",
				duration  : "0s",
				onComplete: function() {
				}
			} ), $( ".save-builder-output-btn" ).off( "click" ).click( function( n ) {
				o ? p( e ) : t && t.b && (t.b.length > 1 || 1 == t.b.length && !t.enabled) ? $( "#butler-confirm-edit-command" ).modal( {
					onApprove: function() {
						p( e, t )
					},
					onDeny   : function() {
						p( e )
					}
				} ).modal( "show" ) : p( e, t )
			} )
		};
		i ? a() : $( ".command-section" ).transition( { animation: "fade right", duration: "0.33s", onComplete: a } )
	}

	function u( e, t, n ) {
		if( $( ".ui.form.button-config" ).form( "clear" ), $( ".ui.form.button-config .button-enabled" ).prop( "checked", !0 ), $( ".phrase input.error" ).removeClass( "error" ), $( ".builder-output .list" ).empty(), $( ".first-action" ).transition( "show" ), $( ".another-action" ).transition( "hide" ), $( ".builder-output" ).transition( "hide" ), $( ".builder-output .output-btns" ).transition( "hide" ), e ) {
			var o = e.label;
			o && n && (o += " (copy)"), $( '.ui.form.button-config input[name="button-label"]' ).val( o ), $( ".ui.form.button-config .button-enabled" ).prop( "checked", e.enabled ), $( ".ui.form.button-config .button-close-card" ).prop( "checked", e.close );
			var i = $( ".ui.form.button-config .button-icon-select .menu i" ).removeClass( "selected" ).filter( '[data-image="' + e.image + '"]' ).addClass( "selected" );
			i.length && $( ".ui.form.button-config .button-icon-select > i" ).replaceWith( i.clone() )
		}
		var r = e ? m( e.cmd ) : t ? t.cmd : [];
		Y ? r.length ? (l( r.shift() ), c( !1, !0 )) : c( !0, !0 ) : c( !1, !1 ), r.forEach( d )
	}

	function c( e, t ) {
		e ? ($( ".builder.triggers" ).transition( "show" ), $( ".builder.actions" ).transition( "hide" )) : ($( ".builder.triggers" ).transition( "hide" ), $( ".builder.actions" ).transition( "show" )), t ? $( ".builder-output .output-trigger" ).transition( "show" ) : $( ".builder-output .output-trigger" ).transition( "hide" )
	}

	function l( e ) {
		var t = $( '<div class="item"><div class="right floated content"><div class="ui icon inverted blue button remove-trigger-btn" tabindex="0"><i class="trash icon"></i></div></div><div class="content output-phrase">' + sanitize( e ) + "</div></div>" );
		t.appendTo( $( ".builder-output .output-trigger .list" ) ), t.find( ".remove-trigger-btn" ).off( "click" ).click( b ), v()
	}

	function d( e, t ) {
		if( $( ".builder-output .output-actions .list .item" ).length >= 40 ) return void $( ".too-many-actions" ).transition( "show" );
		if( $( ".too-many-actions" ).transition( "hide" ), $( ".builder-output .output-actions .list .item.implicit-multiplier" ).length ) return void $( ".implicit-multiplier-stop" ).transition( "show" );
		$( ".implicit-multiplier-stop" ).transition( "hide" );
		var n = e.replace( /\\\"/g, "__QUOTE__" ).split( '"' ).map( function( e, t, n ) {
			    return e = sanitize( e.replace( /__QUOTE__/g, '"' ) ), t % 2 == 0 ? e : " list " == n[ t - 1 ].slice( -6 ) ? '<div class="ui search"><input class="quoted-value prompt" type="text" name="list-name" value="' + e + '" placeholder="' + e + '"></div>' : " board " == n[ t - 1 ].slice( -7 ) ? '<div class="ui search"><input class="quoted-value prompt" type="text" name="board-name" value="' + e + '" placeholder="' + e + '"></div>' : '<input class="quoted-value" type="text" value="' + e + '" placeholder="' + e + '">'
		    } ).join( "" ), o = e.match( /^copy each|move each/ ),
		    i = $( '<div class="item' + (t ? "" : " transition hidden") + (o ? " implicit-multiplier" : "") + '"><div class="right floated content"><div class="ui icon inverted blue button move-up-action-btn' + (o ? " disabled" : "") + '" tabindex="0"><i class="arrow up icon"></i></div><div class="ui icon inverted blue button remove-action-btn" tabindex="0"><i class="trash icon"></i></div></div><div class="content output-phrase">' + n + "</div></div>" );
		i.appendTo( $( ".builder-output .output-actions .list" ) ), t || i.transition( {
			animation : "fade down",
			duration  : $( ".builder-output .output-actions:visible" ).length ? "0.33s" : "0s",
			onComplete: v
		} ), i.find( ".remove-action-btn" ).off( "click" ).click( b ), i.find( ".move-up-action-btn" ).off( "click" ).click( g );
		var r = i.find( '[name="list-name"]' );
		r.length && Builder.setupListNameAutoComplete( r, null );
		var a = i.find( '[name="board-name"]' );
		a.length && Builder.setupBoardNameAutoComplete( a, null, !0 )
	}

	function f() {
		var e = [];
		return $( ".builder-output .output-phrase" ).each( function( t, n ) {
			e.push( Z( $( n )[ 0 ] ).trim() )
		} ), h( e, Y )
	}

	function p( e, t ) {
		var n;
		switch( e ) {
			case"card-button":
			case"board-button":
				n = !0
		}
		if( !n || $( ".ui.form.button-config" ).form( "is valid" ) ) {
			var o = f(), i = $( '.ui.form.button-config input[name="button-label"]' ).val(),
			    r = $( ".ui.form.button-config .button-icon-select > i" ).attr( "class" ),
			    a = $( ".ui.form.button-config .button-icon-select > i" ).attr( "data-image" ),
			    s = $( ".ui.form.button-config .button-enabled" ).prop( "checked" ),
			    u = $( ".ui.form.button-config .button-close-card" ).prop( "checked" ), c = $( ".cancel-btn" );
			c.addClass( "disabled" );
			var l = $( ".save-builder-output-btn" );
			l.addClass( "disabled" ), l.attr( "data-tooltip", "Saving..." );
			var d = l.find( "i" ), p = d.attr( "class" );
			d.attr( "class", "notched circle loading icon" );
			var h = function( e ) {
				setTimeout( function() {
					c.removeClass( "disabled" ), l.removeClass( "disabled" ), d.attr( "class", p ), e ? l.attr( "data-tooltip", "Error saving: " + ("object" == typeof e ? e.message : e) ).transition( "shake" ) : l.attr( "data-tooltip", null )
				}, 0 )
			};
			t ? R( t.id, t.type, i, r, a, o, s, u ).then( function() {
				h()
			} ).catch( h ) : O( e, i, r, a, o, s, u ).then( function() {
				h()
			} ).catch( h )
		}
	}

	function h( e, t ) {
		var n;
		return t ? (n = e[ 0 ] + ",\n", e = e.slice( 1 )) : n = "", e.length > 1 ? n + e.slice( 0, -1 ).join( ",\n" ) + (e[ e.length - 2 ].match( /^for each / ) ? ",\n" : ",\nand ") + e.slice( -1 )[ 0 ] : n + e.join()
	}

	function m( e ) {
		var t = "and ";
		return e.split( ",\n" ).map( function( e ) {
			return e.substr( 0, t.length ) == t ? e.substr( t.length ) : e
		} )
	}

	function g() {
		var e = this.closest( ".item" );
		$( e ).prev().detach().insertAfter( e )
	}

	function b( e ) {
		var t = $( e.target ).closest( ".item" );
		t.transition( {
			animation: "fade down", duration: "0.33s", onComplete: function() {
				t.remove(), v()
			}
		} ), $( ".too-many-actions" ).transition( "hide" ), $( ".implicit-multiplier-stop" ).transition( "hide" )
	}

	function v() {
		var e = $( ".builder-output .item" ).length;
		if( Y ) {
			var t = $( ".builder.triggers" ), n = $( ".builder.actions" );
			if( !$( ".builder-output .output-trigger .list" ).children().length ) return $( ".builder-output" ).transition( "hide" ), void n.transition( {
				animation : "fade down",
				duration  : "0.33s",
				onComplete: function() {
					t.transition( "fade down" )
				}
			} );
			--e, n.hasClass( "hidden" ) && ($( ".builder-output" ).transition( "show" ), t.transition( {
				animation : "fade down",
				duration  : "0.33s",
				onComplete: function() {
					n.transition( "fade down" )
				}
			} ))
		}
		var o = $( ".builder-output" ), i = $( ".builder-output .output-actions" ), r = $( ".builder-output .output-btns" );
		e ? ($( ".first-action" ).transition( "hide" ), $( ".another-action" ).transition( "show" ), o.hasClass( "hidden" ) ? (r.transition( "show" ), i.transition( "show" ), o.transition( "fade down" )) : i.hasClass( "hidden" ) ? (r.transition( "show" ), i.transition( "fade down" )) : r.hasClass( "hidden" ) && r.transition( "show" )) : ($( ".first-action" ).transition( "show" ), $( ".another-action" ).transition( "hide" ), i.transition( "hide" ), r.transition( "hide" ), Y || o.transition( "hide" ))
	}

	function w( e, t ) {
		for( var n, o = $( e.target ).closest( ".clause" ); (n = o.parent().closest( ".clause" )).length; ) o = n;
		var i, r = o.closest( ".ui.popup" ), a = r.prev( "span" ),
		    s = a.length ? a.children( ".builder-open.builder-popup" ) : r.siblings( ".builder-open.builder-popup" ),
		    u = s.siblings( ".builder-optional.clause:last" ), c = u.children( ".clause-value" );
		t && $( u ).hasClass( "multiple-clause" ) && (i = u.clone( !1 )), c.text( Z( o[ 0 ] ) ), u.hasClass( "hidden" ) && (Builder.setupDropdowns( u ), u.find( ".builder-delete" ).click( y ), u.hasClass( "multiple-clause" ) ? E( { target: s[ 0 ] }, ".builder-open.builder-popup", ".builder-optional.clause:last" ) : T( { target: s[ 0 ] }, ".builder-open.builder-popup", ".builder-optional.clause:last" )), i && i.insertAfter( u )
	}

	function _( e ) {
		w( e, !0 ), $( e.target ).closest( ".ui.popup" ).popup( "hide all" )
	}

	function y( e ) {
		var t = $( e.target ).closest( ".builder-optional" ),
		    n = 0 == t.siblings( ".builder-optional:visible" ).length ? t.add( t.siblings( ".prefix" ) ) : t;
		n.transition( {
			animation: "scale", duration: "0.25s", onComplete: function() {
				var e = $( this ).parent().closest( ".clause" );
				t.detach(), e.length && w( { target: e[ 0 ] } )
			}
		} )
	}

	function T( e, t, n ) {
		var o = $( e.target ).closest( t ), i = o.parent().children( n );
		o.addClass( "hidden" ).hide(), i.removeClass( "hidden" ).show()
	}

	function E( e, t, n ) {
		var o = $( e.target ).closest( t ).parent().children( n );
		o.transition( { animation: "drop", duration: "0.33s" } )
	}

	function k( e, t ) {
		$( ".command-list" ).empty(), $( ".command-list-filter" ).transition( "hide" ), $( ".command-list-error" ).transition( "hide" ), $( ".command-list-loading" ).transition( "show" ), $( ".create-command-buttons" ).transition( "hide" ), A( e, function( n, o, i ) {
			getCurrentTab() == e + "s" && ($( ".command-list-loading" ).transition( "hide" ), $( ".create-command-buttons" ).transition( "show" ), $( ".butler-limit-warning" ).transition( o ? "show" : "hide" ), i ? C( e ) : S(), n.forEach( function( e ) {
				L( e, !0, null, i )
			} ), q(), t && t())
		}, function( e ) {
			$( ".command-list-loading" ).transition( "hide" ), "NOT_AUTHORIZED" == e ? $( ".command-list-error.not-authorized" ).transition( "show" ) : $( ".command-list-error.error-loading" ).transition( "show" )
		} )
	}

	function C( e ) {
		var t = $( ".admin-ui .admin-member-select" );
		if( e.match( /button/ ) ) return CommandStorage.setAdminOnBehalfOf(), void t.dropdown( {
			onChange: function( e ) {
			}
		} ).dropdown( "clear" );
		var n = TrelloPowerUp.iframe();
		TrelloPowerUp.Promise.join( n.board( "members" ), n.member( "all" ) ).spread( function( n, o ) {
			var i = t.find( ".menu" );
			i.find( ">.item" ).remove(), i.append( '<div class="item" data-value="' + o.id + '"><span class="text">' + sanitize( o.fullName ) + '</span><span class="description"><small>@' + sanitize( o.username ) + "</small></span></div>" ), n.members.forEach( function( e ) {
				e.id != o.id && i.append( '<div class="item" data-value="' + e.id + '"><span class="text">' + sanitize( e.fullName ) + '</span><span class="description"><small>@' + sanitize( e.username ) + "</small></span></div>" )
			} ), t.dropdown( {
				onChange: function( t ) {
					t == o.id && (t = void 0), CommandStorage.getAdminOnBehalfOf() != t && (CommandStorage.setAdminOnBehalfOf( t ), k( e ))
				}
			} ), $( ".admin-ui" ).transition( "show" )
		} )
	}

	function S() {
		$( ".admin-ui" ).transition( "hide" )
	}

	function A( e, t, n ) {
		TrelloPowerUp.Promise.join( Plan.getUserPlanLocal(), CommandStorage.getCommands( e ) ).spread( function( e, n ) {
			n = N( n );
			var o = Plan.isPaid( e ), i = !o && n.filter( function( e ) {
				return e.is_own
			} ).length >= 1;
			t( n, i, (e || {}).is_admin )
		} ).catch( function( e ) {
			n && n( e )
		} )
	}

	function N( e ) {
		return e.sort( function( e, t ) {
			return e.label < t.label ? -1 : t.label < e.label ? 1 : 0
		} )
	}

	function O( e, t, n, o, i, r, a ) {
		var s = {
			label  : t,
			icon   : n,
			image  : o,
			cmd    : i,
			type   : e,
			shared : !1,
			scope  : CommandStorage.ScopeBoard,
			enabled: r,
			close  : a ? 1 : void 0
		};
		return new Promise( function( n, o ) {
			A( e, function( o, r ) {
				r ? (q(), $( ".butler-limit-warning" ).transition( "show" ).transition( "shake" ), n( !1 )) : n( CommandStorage.addCommand( s ).then( function( t ) {
					return s = t, CommandStorage.getCommands( e )
				} ).then( function( n ) {
					var o = N( n ).findIndex( function( e ) {
						return e.label > t
					} );
					return L( s, !1, o == -1 ? null : n[ o ].id ), q(), Log.logEvent( "engagement", "add_command_" + e, {
						type  : e,
						length: i.length
					} ), !0
				} ) )
			} )
		} )
	}

	function R( e, t, n, o, i, r, a, s ) {
		var u = { label: n, icon: o, image: i, cmd: r, enabled: a, close: s ? 1 : void 0 };
		return CommandStorage.updateCommandId( e, u ).then( function() {
			return CommandStorage.getCommands( t )
		} ).then( function( t ) {
			q(), N( t );
			var o  = t.findIndex( function( t ) {
				return t.id == e
			} ), i = t.splice( o, 1 )[ 0 ];
			$( "#" + e ).remove();
			var r = t.findIndex( function( e ) {
				return e.label > n
			} );
			L( i, !1, r == -1 ? null : t[ r ].id )
		} )
	}

	function I( e ) {
		var t = $( e.target ).closest( ".command" ), n = t.attr( "id" ), o = $( ".sharing-btns" );
		o.addClass( "disabled" ), CommandStorage.enableCommandId( n, e.target.checked ).then( function() {
			o.removeClass( "disabled" ), V( !0 )
		} ).catch( function( t ) {
			o.removeClass( "disabled" ), $( e.target ).closest( ".ui.checkbox" ).checkbox( "set " + (e.target.checked ? "unchecked" : "checked") ).attr( "data-tooltip", "Error saving." ).transition( "shake" )
		} )
	}

	function P( e ) {
		var t = $( e.target ).closest( ".command" ), n = t.attr( "id" ), o = $( ".sharing-btns" );
		o.addClass( "disabled" ), CommandStorage.updateCommandId( n, { shared: e.target.checked } ).then( function( e ) {
			o.removeClass( "disabled" ), D( e )
		} ).catch( function( t ) {
			o.removeClass( "disabled" ), $( e.target ).closest( ".ui.checkbox" ).checkbox( "set " + (e.target.checked ? "unchecked" : "checked") ).attr( "data-tooltip", "Error saving." ).transition( "shake" )
		} ), e.target.checked && Log.logEvent( "engagement", "share_button" )
	}

	function M( e ) {
		var t = $( e.target ).closest( ".command" ), n = t.attr( "id" ), o = $( ".sharing-btns" );
		o.addClass( "disabled" ), CommandStorage.updateCommandId( n, { scope: e.target.checked ? CommandStorage.ScopeTeam : CommandStorage.ScopeBoard } ).then( function( e ) {
			o.removeClass( "disabled" ), D( e )
		} ).catch( function( t ) {
			o.removeClass( "disabled" ), $( e.target ).closest( ".ui.checkbox" ).checkbox( "set " + (e.target.checked ? "unchecked" : "checked") ).attr( "data-tooltip", "Board is not in a team." ).transition( "shake" )
		} ), e.target.checked && Log.logEvent( "engagement", "team_scope_button" )
	}

	function U( e ) {
		A( e.type, function( t, n ) {
			return n ? $( ".butler-limit-warning" ).transition( "show" ).transition( "pulse" ) : (e = t.find( function( t ) {
				return t.id == e.id
			} ) || e, void s( e.type, e, null, !0 ))
		} )
	}

	function x( e, t ) {
		var n = $( e.target ).closest( ".command" ), o = n.attr( "id" );
		$( "#butler-confirm-remove-command" ).modal( {
			onApprove: function() {
				$( ".butler-limit-warning" ).transition( "hide" ), CommandStorage.removeCommandId( o, t ).then( function() {
					j( n )
				} ).catch( function( t ) {
					$( e.target ).closest( ".ui.button" ).attr( "data-tooltip", "Error saving." ).transition( "shake" )
				} )
			}
		} ).modal( "show" )
	}

	function L( e, t, n, o ) {
		if( e.type.indexOf( "button" ) != -1 ) return B( e, t, n, o );
		var i = $( '<table id="' + e.id + '" class="ui unstackable table transition hidden command"><thead><tr><th></th><th class="right aligned">' + ("schedule" == e.type ? '<div class="ui blue icon button run-command-btn" tabindex="0" alt="Run Now" data-tooltip="Run Now"><i class="rocket icon"></i></div>' : "") + '<div class="ui blue icon button edit-command-btn' + (e.is_own ? "" : " disabled") + '" tabindex="0" alt="Edit" data-tooltip="Edit"><i class="edit icon"></i></div><div class="ui blue icon button copy-command-btn" tabindex="0" alt="Duplicate" data-tooltip="Duplicate"><i class="copy icon"></i></div><div class="ui blue icon button remove-command-btn' + (e.is_own || o ? "" : " disabled") + '" tabindex="0" alt="Remove" data-tooltip="Remove"><i class="trash icon"></i></div><div class="ui blue icon button command-log-btn" tabindex="0" alt="Command Log" data-tooltip="Command Log"><i class="book icon"></i></div></th></tr></thead><tbody><tr><td class="modified-by"></td><td class="right aligned"><div class="ui checkbox sharing-btns" data-tooltip="Enable/disable on this board"><input type="checkbox" class="enable-command-tgl"' + (e.enabled ? " checked" : "") + '><label>Enabled</label></div><span class="sharing-btns-divider"></span><div class="ui checkbox sharing-btns" data-tooltip="This type of command is available on all your boards"><input type="checkbox" class="scope-command-tgl" checked disabled><label>All Boards</label></div><span class="sharing-btns-divider"></span><div class="ui checkbox sharing-btns" data-tooltip="This type of command cannot be shared"><input type="checkbox" class="share-command-tgl" disabled><label>Shared</label></div></td></tr><tr><td class="code-area" colspan="2">' + sanitize( e.cmd ) + "</td></tr></tbody></table>" );
		n ? i.insertBefore( $( "#" + n ) ) : i.appendTo( $( ".command-list" ) ), D( e ), i.transition( {
			animation : "fade down",
			duration  : t ? "0s" : "0.33s",
			onComplete: function() {
			}
		} ), i.find( ".edit-command-btn" ).click( function( t ) {
			CommandStorage.getCommand( e.type, e.id, !0 ).then( function( e ) {
				s( e.type, e )
			} )
		} ), i.find( ".copy-command-btn" ).click( function( t ) {
			U( e )
		} ), i.find( ".remove-command-btn" ).click( function( e ) {
			x( e, o )
		} ), i.find( ".enable-command-tgl" ).closest( ".ui.checkbox" ).checkbox( {
			onChange: function() {
				I( { target: this } )
			}
		} ), i.find( ".command-log-btn" ).click( function( t ) {
			CommandLog.openCommandLog( e, CommandStorage.getAdminOnBehalfOf() )
		} ), i.find( ".run-command-btn" ).click( function( t ) {
			TrelloPowerUp.iframe().boardBar( { height: 38, url: "./powerup-command-runner.html?cmd=" + e.id } )
		} )
	}

	function B( e, t, n, o ) {
		var i = $( '<table id="' + e.id + '" class="ui unstackable table transition hidden command"><thead><tr><th><button class="ui labeled icon button"><i class="' + e.icon + '"></i>' + sanitize( e.label || "" ) + '</button></th><th class="right aligned"><div class="ui blue icon button edit-command-btn' + (e.is_own ? "" : " disabled") + '" tabindex="0" alt="Edit" data-tooltip="Edit"><i class="edit icon"></i></div><div class="ui blue icon button copy-command-btn" tabindex="0" alt="Duplicate" data-tooltip="Duplicate"><i class="copy icon"></i></div><div class="ui blue icon button remove-command-btn' + (e.is_own || o ? "" : " disabled") + '" tabindex="0" alt="Remove" data-tooltip="Remove"><i class="trash icon"></i></div><div class="ui blue icon button command-log-btn" tabindex="0" alt="Command Log" data-tooltip="Command Log"><i class="book icon"></i></div></th></tr></thead><tbody><tr><td class="modified-by"></td><td class="right aligned"><div class="ui checkbox sharing-btns" data-tooltip="Enable/disable on this board"><input type="checkbox" class="enable-command-tgl"' + (e.enabled ? " checked" : "") + '><label>Enabled</label></div><span class="sharing-btns-divider"></span><div class="ui checkbox sharing-btns"' + (e.is_own ? ' data-tooltip="Make available in all boards on this team"' : "") + '><input type="checkbox" class="scope-command-tgl"' + (e.scope == CommandStorage.ScopeTeam ? " checked" : "") + (e.is_own ? "" : " disabled") + '><label>All Boards</label></div><span class="sharing-btns-divider"></span><div class="ui checkbox sharing-btns"' + (e.is_own ? ' data-tooltip="Share with team members"' : "") + '><input type="checkbox" class="share-command-tgl"' + (e.shared ? " checked" : "") + (e.is_own ? "" : " disabled") + '><label>Shared</label></div></td></tr><tr><td class="code-area" colspan="2">' + sanitize( e.cmd ) + "</td></tr></tbody></table>" );
		n ? i.insertBefore( $( "#" + n ) ) : i.appendTo( $( ".command-list" ) ), D( e ), i.transition( {
			animation : "fade down",
			duration  : t ? "0s" : "0.33s",
			onComplete: function() {
			}
		} ), i.find( ".edit-command-btn" ).click( function( t ) {
			CommandStorage.getCommand( e.type, e.id, !0 ).then( function( t ) {
				s( e.type, t )
			} )
		} ), i.find( ".copy-command-btn" ).click( function( t ) {
			U( e )
		} ), i.find( ".remove-command-btn" ).click( function( e ) {
			x( e, o )
		} ), i.find( ".enable-command-tgl" ).closest( ".ui.checkbox" ).checkbox( {
			onChange: function() {
				I( { target: this } )
			}
		} ), i.find( ".share-command-tgl" ).closest( ".ui.checkbox" ).checkbox( {
			onChange: function() {
				P( { target: this } )
			}
		} ), i.find( ".scope-command-tgl" ).closest( ".ui.checkbox" ).checkbox( {
			onChange: function() {
				M( { target: this } )
			}
		} ), i.find( ".command-log-btn" ).click( function( t ) {
			CommandLog.openCommandLog( e )
		} )
	}

	function D( e ) {
		var t = moment( Math.min( +new Date, e.t ) ).fromNow(), n = "Modified " + t;
		e.is_own || (n += ' <span data-tooltip="Owner of this shared command"> by @' + e.username + "</span>"), $( "#" + e.id + " .modified-by" ).html( n )
	}

	function j( e ) {
		e.transition( {
			animation: "fade down", duration: "0.33s", onComplete: function() {
				e.remove(), $( ".command-list" ).children().length || F( !0 )
			}
		} )
	}

	function q() {
		$( ".builder-wizard:visible" ).length ? $( ".builder-wizard" ).transition( {
			animation : "fade left",
			duration  : "0.33s",
			onComplete: z
		} ) : z()
	}

	function z() {
		$( ".command-list" ).children().length ? ($( ".empty-command-list,.admin-empty-command-list" ).transition( "hide" ), $( ".command-list,.command-list-filter" ).transition( "show" ), V()) : F(), $( ".command-section:visible" ).length || $( ".command-section" ).transition( {
			animation : "fade left",
			duration  : "0s",
			onComplete: function() {
			}
		} )
	}

	function F( e ) {
		$( ".command-list,.command-list-filter" ).transition( "hide" );
		var t = CommandStorage.getAdminOnBehalfOf() ? $( ".admin-empty-command-list" ) : $( ".empty-command-list" );
		e ? t.transition( { animation: "fade down", duration: "0.33s" } ) : t.transition( "show" )
	}

	function V( e ) {
		$( ".command-list > table" ).transition( "stop all" );
		var t;
		switch( $( ".command-list-filter .ui.dropdown" ).dropdown( "get value" ) ) {
			case"enabled":
				t = $( ".command-list > table" ).filter( function() {
					var e = $( this ).find( ".enable-command-tgl" )[ 0 ].checked, t = $( this ).filter( ":visible" ).length > 0;
					return e != t
				} );
				break;
			case"disabled":
				t = $( ".command-list > table" ).filter( function() {
					var e = $( this ).find( ".enable-command-tgl" )[ 0 ].checked, t = $( this ).filter( ":visible" ).length > 0;
					return e == t
				} );
				break;
			case"search":
				var n = $( ".command-list-filter .command-search input" ).val().toLowerCase();
				t = $( ".command-list > table" ).filter( function() {
					var e = $( this ).find( ".code-area" ).text().toLowerCase().indexOf( n ) != -1,
					    t = $( this ).filter( ":visible" ).length > 0;
					return e != t
				} );
				break;
			default:
				t = $( ".command-list > table" ).filter( function() {
					var e = !!$( this ).filter( ":visible" ).length;
					return !e
				} )
		}
		t.transition( e ? "scale" : "toggle" )
	}

	function G() {
		var e = getCurrentTab();
		$( ".close-suggestions-btn" ).off( "click" ).click( function() {
			showTab( e, !0 )
		} ), $( ".refresh-suggestions-btn" ).off( "click" ).click( function() {
			Q( !0 )
		} ), showTab( "suggestions", !0 ), Q( !1 )
	}

	function Q( e ) {
		$( ".suggestions-header" ).transition( "hide" ), $( ".suggestion-list" ).empty(), $( ".butler-no-suggestions" ).transition( "hide" ), $( ".butler-no-more-suggestions" ).transition( "hide" ), $( ".butler-refresh-wait" ).transition( "hide" ), $( ".discarded-suggestions" ).transition( "hide" ), $( ".more-suggestions" ).transition( "hide" ), $( ".butler-error-loading-suggestions" ).transition( "hide" ), $( ".butler-suggestions-loading" ).transition( "show" ), $( ".refresh-suggestions-btn" ).addClass( "disabled" ), TrelloPowerUp.Promise.join( Suggestions.getSuggestions( e ), CommandStorage.getAllCommands() ).spread( function( e, t ) {
			if( $( ".butler-suggestions-loading" ).transition( "hide" ), $( ".refresh-suggestions-btn" ).removeClass( "disabled" ), e.admin_suggestions && (e.suggestions = [].concat( e.admin_suggestions, e.suggestions ), delete e.admin_suggestions), e.suggestions.length ) {
				e.refresh_wait && ($( ".suggestions-refresh-wait" ).text( moment( e.refresh_wait ).fromNow( !0 ) ), $( ".butler-refresh-wait" ).transition( "slide down" ));
				var n = moment( e.first_action_date ), o = moment(), i = o.diff( n, "month" ), r = o.diff( n, "week" ),
				    a = o.diff( n, "day" ), s = i > 1 ? i + " months" : r > 1 ? r + " weeks" : a > 1 ? a + " days" : "day",
				    o = (new Date).toISOString(), u = e.date < o ? e.date : o;
				$( ".suggestions-date" ).text( moment( u ).fromNow() ), $( ".suggestions-action-count" ).text( e.action_count ), $( ".suggestions-since" ).text( s ), $( ".suggestions-header" ).transition( "show" );
				var c = {};
				t.forEach( function( e ) {
					c[ e.cmd ] = !0
				} );
				var l                 = e.suggestions.filter( function( e ) {
					var t = [ "rule", "schedule", "on-date" ].indexOf( e.type ) != -1, n = h( e.cmd, t );
					return !(n in c)
				} ).slice( 0, 20 ), d = 0, f = 0;
				l.forEach( function( e ) {
					"discard" == (e.user_action || {}).value ? K( e ) : d >= 5 ? (++f, K( e, !0 )) : (++d, K( e ))
				} ), d || $( ".butler-no-more-suggestions" ).transition( "slide down" ), f > 0 && ($( ".more-suggestions-count" ).text( f ), $( ".more-suggestions-btn" ).off( "click" ).click( function() {
					return $( ".more-suggestions" ).transition( "scale" ), $( ".hidden-suggestion" ).transition( "scale" ), !1
				} ), $( ".more-suggestions" ).transition( "show" )), H()
			} else $( ".butler-no-suggestions" ).transition( "slide down" )
		} ).catch( function( e ) {
			return "INVALID_TOKEN" == e || "USER_NOT_FOUND" == e ? Auth.reauthorize( "card-buttons", function() {
				n( "card-button" )
			} ) : ($( ".butler-suggestions-loading" ).transition( "hide" ), $( ".refresh-suggestions-btn" ).removeClass( "disabled" ), void $( ".butler-error-loading-suggestions" ).transition( "slide down" ))
		} ), Log.logEvent( "engagement", e ? "refresh_suggestions" : "load_suggestions" )
	}

	function K( e, t ) {
		var n, o;
		switch( e.type ) {
			case"rule":
				o = !0, n = "Rule";
				break;
			case"schedule":
				o = !0, n = "Scheduled (Calendar)";
				break;
			case"on-date":
				o = !0, n = "Scheduled (Due Date)";
				break;
			case"board":
				o = !1, n = "Board Button";
				break;
			default:
				o = !1, n = "Card Button"
		}
		var i = $( '<table class="ui unstackable table transition suggestion' + ("discard" == (e.user_action || {}).value ? " discarded-suggestion hidden" : t ? " hidden-suggestion hidden" : "") + '"><thead><tr><th><button class="ui labeled icon button"><i class="wizard icon"></i>' + n + '</button></th><th class="right aligned"><div class="ui blue icon button accept-suggestion-btn" tabindex="0" data-tooltip="Add"><i class="plus icon"></i></div><div class="ui blue icon button discard-suggestion-btn' + (e.admin ? " disabled" : "") + '" tabindex="0" data-tooltip="Discard"><i class="trash icon"></i></div></th></tr></thead><tbody><tr><td class="suggestion-reason" colspan="2">' + (e.admin ? "Recommended by a system administrator." : "Performed " + e.count + " times, most recently " + moment( e.until ).fromNow() + ".") + ("discard" == (e.user_action || {}).value ? " Discarded " + moment( e.user_action.date ).fromNow() + "." : "") + '</td></tr><tr><td class="code-area" colspan="2">' + sanitize( h( e.cmd, o ) ) + "</td></tr></tbody></table>" );
		i.appendTo( $( ".suggestion-list" ) ), i.find( ".accept-suggestion-btn" ).click( function() {
			J( e, i )
		} ), i.find( ".discard-suggestion-btn" ).click( function() {
			W( e, i )
		} )
	}

	function J( e, t ) {
		var o = t.find( ".accept-suggestion-btn" );
		o.addClass( "disabled" );
		var i = o.children( "i" ), r = i.attr( "class" );
		i.attr( "class", "notched circle loading icon" ), Suggestions.accept( e ).then( function() {
			t.transition( "scale" ), t.removeClass( "discarded-suggestion" ), i.attr( "class", r ), o.removeClass( "disabled" );
			var a = e.type || "card";
			switch( a ) {
				case"board":
				case"card":
					a += "-button"
			}
			n( a, function() {
				s( a, null, e )
			} )
		} ).catch( function() {
			i.attr( "class", "yellow warning sign icon" ), o.transition( "shake" ), o.attr( "data-tooltip", "Error contacting server. Press to retry." ), o.removeClass( "disabled" )
		} ), Log.logEvent( "engagement", "accept_suggestion", { utility: e.utility, admin: e.admin } )
	}

	function W( e, t ) {
		var n = t.find( ".discard-suggestion-btn" );
		n.addClass( "disabled" );
		var o = n.children( "i" ), i = o.attr( "class" );
		o.attr( "class", "notched circle loading icon" ), Suggestions.discard( e ).then( function() {
			t.transition( "scale" ), t.addClass( "discarded-suggestion" ), o.attr( "class", i ), n.removeClass( "disabled" ), H()
		} ).catch( function() {
			o.attr( "class", "yellow warning sign icon" ), n.transition( "shake" ), n.attr( "data-tooltip", "Error contacting server. Press to retry." ), n.removeClass( "disabled" )
		} ), Log.logEvent( "engagement", "discard_suggestion", { utility: e.utility, admin: e.admin } )
	}

	function H() {
		var e = $( ".discarded-suggestion" ).length;
		return e ? ($( ".discarded-suggestions-count" ).text( e ), $( ".discarded-suggestions-btn" ).off( "click" ).click( function() {
			return $( ".discarded-suggestions" ).transition( "scale" ), $( ".discarded-suggestion" ).transition( "scale" ), !1
		} ), void $( ".discarded-suggestions" ).transition( "show" )) : $( ".discarded-suggestions" ).transition( "hide" )
	}

	Dashboard.initPowerUpDashboard = e;
	var Y, X = !1, Z = Builder.collectPhrase
}();
var AccountDashboard = {};
!function() {
	function e() {
		$( '.dashboard-tabs .item[data-tab="tab-usage"]' ).click( function() {
			n()
		} ), $( '.dashboard-tabs .item[data-tab="tab-account"]' ).click( function() {
			i()
		} ), $( '.dashboard-tabs .item[data-tab="tab-upgrade"]' ).click( function() {
			showTab( "upgrade" )
		} );
		var e = (window.location.search.match( /tab=([a-zA-Z]*)/ ) || [])[ 1 ];
		switch( e ) {
			case"account":
				i();
				break;
			case"upgrade":
				showTab( "upgrade" );
				break;
			default:
				n()
		}
		t()
	}

	function t() {
		$( ".help-popup" ).click( function() {
			return !1
		} ).each( function( e, t ) {
			var n = $( t ), o = n.attr( "data-popup-selector" ), i = o ? $( o ) : n.next( ".ui.popup" );
			n.popup( {
				on        : "click",
				popup     : i,
				target    : !!n.length && n,
				position  : "top center",
				lastResort: "bottom center",
				hoverable : !1
			} )
		} ), $( ".close-popup" ).off( "click" ).click( function( e ) {
			$( e.target ).closest( ".popup" ).popup( "hide all" )
		} ), Upgrade.init(), $( ".butler-upgrade-btn" ).off( "click" ).click( function( e ) {
			showTab( "upgrade", !0 )
		} ), $( ".butler-logout-btn" ).off( "click" ).click( function( e ) {
			return Auth.logOut( function() {
				TrelloPowerUp.iframe().closeOverlay()
			} ), !1
		} )
	}

	function n() {
		showTab( "usage" ), Auth.authorize( "usage", function() {
			Plan.refreshUserPlan(), o( $( "#butler-powerup-log" ) )
		} )
	}

	function o( e ) {
		var t = $( e ).find( ".loading-log" ), n = $( e ).find( ".more.button" ), o = $( e ).find( ".no-more.button" ),
		    i = t.siblings( ".error-loading-log" );
		e.find( ".command-log" ).empty(), function r( a ) {
			t.transition( "show" ), n.transition( "hide" ), o.transition( "hide" ), i.transition( "hide" ), e.find( ".no-more-entries" ).hide(), Auth.authorize( "board", function() {
				$.ajax( kApiEndpoint + "powerup-user-log?before=" + a, {
					type   : "GET",
					headers: { "X-Butler-Trello-Token": Trello.token() }
				} ).done( function( s ) {
					if( t.transition( "hide" ), s.success ) if( s.response.log.length ) {
						var u = e.find( ".command-log" );
						s.response.log.forEach( function( e ) {
							var t = e.output;
							if( "string" != typeof t ) {
								var n = (t || []).map( function( e ) {
									var t = '<div class="item">';
									switch( e.type ) {
										case"ERROR":
											t += '<i class="red warning circle icon"></i>';
											break;
										case"WARNING":
											t += '<i class="yellow warning circle icon"></i>';
											break;
										case"MESSAGE":
											t += '<i class="blue info circle icon"></i>'
									}
									return t += '<div class="content">' + markdownToHtml( e.message ) + "</div>", t += "</div>"
								} ).join( "" ) || '<div class="item"><i class="blue info circle icon"></i><div class="content">No details.</div></div>';
								u.append( '<tr><td><div class="ui list"><div class="item"><small>' + moment( e.t ).format( "LLLL" ) + "</small></div>" + n + "</div></td></tr>" ), a = e.t
							}
						} ), u.find( ".content a" ).attr( "target", "_blank" ), n.transition( "show" ).off( "click" ).click( function() {
							r( a )
						} )
					} else n.transition( "hide" ), o.transition( "show" ); else i.transition( "show" ), $( e ).find( ".retry-btn" ).off( "click" ).click( function() {
						return r( a ), !1
					} )
				} ).fail( function( e ) {
					t.transition( "hide" ), e.transition( "show" )
				} )
			} )
		}( (new Date).toISOString() )
	}

	function i() {
		$( ".butler-payment,.butler-invoices,.butler-alt-account,.butler-account-loading-error" ).transition( "hide" ), $( ".butler-account-loading" ).transition( "show" ), showTab( "account" ), Auth.authorize( "account", function() {
			Plan.refreshUserPlan(), $.ajax( kApiEndpoint + "stripe-account" + s, {
				type   : "GET",
				headers: { "X-Butler-Trello-Token": Trello.token() }
			} ).done( function( e ) {
				$( ".butler-account-loading" ).transition( "hide" ), e.success ? e.response.org_account ? r( e.response.org_account, e.response.user_account ) : e.response.user_account && r( e.response.user_account ) : $( ".butler-account-loading-error" ).transition( "scale up" )
			} ).fail( function() {
				$( ".butler-account-loading" ).transition( "hide" ), $( ".butler-account-loading-error" ).transition( "scale up" )
			} )
		} )
	}

	function r( e, t ) {
		if( t ? $( ".butler-alt-account" ).transition( "show" ) : $( ".butler-alt-account" ).transition( "hide" ), e.managed_by ) return void Trello.get( "members/" + e.managed_by, function( e ) {
			$( ".butler-account-managed-by" ).text( e.fullName + " (@" + e.username + ")" ), $( ".butler-account-managed" ).transition( "scale up" )
		}, function( e ) {
			$( ".butler-account-loading-error" ).transition( "scale up" )
		} );
		e.cancel_at_period_end ? ($( ".butler-cancel-subscription" ).transition( "hide" ), $( ".butler-cancel-scheduled-date" ).text( moment( e.current_period_end ).format( "LLL" ) ), $( ".butler-cancel-scheduled" ).transition( "show" )) : ($( ".butler-cancel-subscription" ).transition( "show" ).off( "click" ).click( function() {
			a( e.customer_id )
		} ), $( ".butler-cancel-subscription-earlier" ).transition( moment( e.current_period_end ) > moment().add( 30, "d" ) ? "show" : "hide" ), $( ".butler-cancel-scheduled" ).transition( "hide" )), $( ".butler-payment-source" ).text( e.source ), $( ".butler-payment" ).transition( "scale up" );
		var n = (e.invoices || []).map( function( e ) {
			return '<div class="item"><a href="' + kApiEndpoint + "stripe-invoice/" + e.id + s + '" target="_blank">' + moment( e.date ).format( "LL" ) + "</a></div>"
		} ).join( "\n" );
		$( ".butler-invoice-menu" ).html( n ), e.upcoming_invoice ? ($( ".butler-upcoming-invoice-date" ).text( moment( e.upcoming_invoice.date ).format( "LL" ) ), $( ".butler-upcoming-invoice" ).transition( "show" )) : $( ".butler-upcoming-invoice" ).transition( "hide" ), $( ".butler-invoices" ).transition( "scale up" )
	}

	function a( e ) {
		var t = $( "#butler-cancel-subscription-modal" );
		t.find( ".status" ).transition( "hide" ), t.find( ".actions.button" ).removeClass( "disabled" ), t.modal( {
			onApprove: function() {
				return t.find( ".error.status" ).transition( "hide" ), t.find( ".sending.status" ).transition( "show" ), t.find( ".actions.button" ).addClass( "disabled" ), $.ajax( kApiEndpoint + "stripe-cancel" + s, {
					type       : "POST",
					headers    : { "X-Butler-Trello-Token": Trello.token() },
					data       : JSON.stringify( { customer_id: e } ),
					contentType: "application/json"
				} ).done( function( e ) {
					t.find( ".sending.status" ).transition( "hide" ), e.success ? (t.find( ".success.status" ).transition( "scale up" ), setTimeout( function() {
						t.modal( "hide" )
					}, 1e3 ), i()) : (t.find( ".error.status" ).transition( "scale up" ), t.find( ".actions.button" ).removeClass( "disabled" ))
				} ).fail( function() {
					t.find( ".sending.status" ).transition( "hide" ), t.find( ".error.status" ).transition( "show" ), t.find( ".actions.button" ).removeClass( "disabled" )
				} ), !1
			}
		} ), t.modal( "show" )
	}

	var s = "";
	Dashboard.initAccountDashboard = e
}();
var ButlerPowerUp = {};
!function() {
	function e( e, t, n ) {
		return e.get( "board", "private", "attn" ).then( function( o ) {
			o = (o || "").split( "," ).filter( function( e ) {
				return !!e
			} );
			var i = o.indexOf( t ) != -1;
			!!n != !!i && (n ? o.push( t ) : o = o.filter( function( e ) {
				return e != t
			} ), e.set( "board", "private", "attn", o.join( "," ) ))
		} ).catch( o.bind( "setAttnStatus" ) )
	}

	function t( e, t ) {
		return e.get( "board", "private", "attn" ).then( function( e ) {
			return e = (e || "").split( "," ).filter( function( e ) {
				return !!e
			} ), t ? e.indexOf( t ) != -1 : e.length
		} ).catch( o.bind( "getAttnStatus" ) )
	}

	function n( e ) {
		e.set( "board", "private", "attn", null ).catch( o.bind( "clearAttnStatus" ) )
	}

	function o( e ) {
		"Invalid context, missing board" == e.message || Log.logError( e, this )
	}

	function i( e, n ) {
		return s && s != n.context.board && e.closeOverlay().done(), s = n.context.board, CommandStorage.init( e ), Plan.checkUserQuota( e ), TrelloPowerUp.Promise.join( Plan.getUserPlanLocal( e ), CommandStorage.getLocalCommands(), t( e ), ReleaseNotes.check( e ) ).spread( function( e, t, o, i ) {
			var r = Plan.isPaid( e ),
			    a = [ {
				icon    : o ? "./img/butler-powerup-attn-btn.svg" : i ? "./img/butler-powerup-new-btn.svg" : "./img/butler-powerup-btn.svg",
				text    : "Butler",
				callback: function( e ) {
					e.overlay( { url: "./powerup-dashboard.html?board=" + n.context.board } )
				}
			} ];
			return e && e.no_ui && (a = []), a.concat( t.filter( function( e ) {
				return "board-button" == e.type && e.enabled
			} ).sort( function( e, t ) {
				return e.is_own ? t.is_own ? 0 : -1 : t.is_own ? 1 : 0
			} ).slice( 0, r ? 20 : 1 ).map( function( e ) {
				return {
					icon    : "https://butlerfortrello.com/assets/fa-5.1.1/icons/white/" + e.image + ".svg",
					text    : e.label,
					callback: function( t ) {
						t.boardBar( { height: 38, url: "./powerup-command-runner.html?cmd=" + e.id } )
					}
				}
			} ) )
		} ).catch( function( e ) {
			return o.bind( "getBoardButtons" )( e ), [ {
				icon    : "./img/butler-powerup-attn-btn.svg",
				text    : "Butler",
				callback: function( e ) {
					e.overlay( { url: "./powerup-dashboard.html?board=" + n.context.board } )
				}
			} ]
		} )
	}

	function r( e, t ) {
		return CommandStorage.init( e ), Plan.checkUserQuota( e ), TrelloPowerUp.Promise.join( Plan.getUserPlanLocal( e ), CommandStorage.getLocalCommands() ).spread( function( e, t ) {
			t = t.filter( function( e ) {
				return "card-button" == e.type && e.enabled
			} );
			var n = Plan.isPaid( e );
			return t.sort( function( e, t ) {
				return e.is_own ? t.is_own ? 0 : -1 : t.is_own ? 1 : 0
			} ).slice( 0, n ? 20 : 1 ).map( function( e ) {
				return {
					icon    : "https://butlerfortrello.com/assets/fa-5.1.1/icons/grey/" + e.image + ".svg",
					text    : e.label,
					callback: function( t ) {
						e.close && t.navigate( { url: "https://trello.com/b/" + t.getContext().board } ), t.boardBar( {
							height: 38,
							url   : "./powerup-command-runner.html?cmd=" + e.id
						} )
					}
				}
			} )
		} ).catch( function( e ) {
			return o.bind( "getCardButtons" )( e ), [ {
				icon    : "./img/butler-powerup-card-attn-btn.svg",
				text    : "Butler",
				callback: function( e ) {
					e.overlay( { url: "./powerup-dashboard.html?board=" + t.context.board } )
				}
			} ]
		} )
	}

	function a( e, t ) {
		return e.closePopup(), e.overlay( { url: "./powerup-account.html" } )
	}

	ButlerPowerUp.init = function() {
		return "undefined" == typeof TrelloPowerUp ? console.log( "[ERROR] TrelloPowerUp library not available." ) : void TrelloPowerUp.initialize( {
			"board-buttons": i,
			"card-buttons" : r,
			"show-settings": a
		} )
	}, ButlerPowerUp.setAttnStatus = e, ButlerPowerUp.getAttnStatus = t, ButlerPowerUp.clearAttnStatus = n;
	var s
}();