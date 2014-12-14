var app = app || {};

app.data = (function () {
	function Data (baseUrl, ajaxRequester) {
		this.users = new Users(baseUrl, ajaxRequester);
		this.products = new Products(baseUrl, ajaxRequester);
	}

	var cradentials = (function () {
	    var headers = {
	        'X-Parse-Application-Id': 'X4I8pk7Q90fO8Bw9Y4Le1JmfKgCSX7VN63C9J6LU',
	        'X-Parse-REST-API-Key': 'pq5BIPpCZ7vTqDpZIMj9tnZjN0VP6UpCXdbGHLJx',
	        'X-Parse-Session-Token': getSessionToken()
	}

		function getSessionToken() {
			sessionStorage.getItem('sessionToken');
		}

		function setSessionToken(sessionToken) {
			sessionStorage.setItem('sessionToken', sessionToken);
		}

		function getUsername() {
			sessionStorage.getItem('username');
		}

		function setUsername(sessionToken) {
			sessionStorage.setItem('username', sessionToken);
		}

		function getUserId() {
		    sessionStorage.getItem('userId');
		}

		function setUserId(userId) {
		    sessionStorage.setItem('userId', userId);
		}
		
		function getHeaders() {
			return headers;
		}

		return {
			getSessionToken: getSessionToken,
			setSessionToken: setSessionToken,
			getUsername: getUsername,
			setUsername: setUsername,
			getUserId: getUserId,
			setUserId: setUserId,
			getHeaders: getHeaders
		}
	}());

	var Users = (function () {
		function Users(baseUrl, ajaxRequester) {
			this._serviceUrl = baseUrl;
			this._ajaxRequester = ajaxRequester;
			this._headers = cradentials.getHeaders();
		}

		Users.prototype.login = function (username, password) {
			var url = this._serviceUrl + 'login?username=' + username + '&password=' + password;
			return this._ajaxRequester.get(url, this._headers)
				.then(function (data) {
			        //alert(JSON.stringify(data)); //todo delete this
				    cradentials.setSessionToken(data.sessionToken);
				    cradentials.setUsername(data.username);
				    cradentials.setUserId(data.objectId);

				    return data;
				});
		}

		Users.prototype.register = function (username, password) {
			var user =  {
				username: username,
				password: password
			};
			var url = this._serviceUrl + 'users';
			return this._ajaxRequester.post(url, user, this._headers)
				.then(function (data) {
					cradentials.setSessionToken(data.sessionToken);
					return data;
				});
		} 

		return Users;
	}());

	var Products = (function () {
		function Products(baseUrl, ajaxRequester) {
			this._serviceUrl = baseUrl + 'classes/Product';
			this._ajaxRequester = ajaxRequester;
			this._headers = cradentials.getHeaders();
		}

		Products.prototype.getAll = function () {
			return this._ajaxRequester.get(this._serviceUrl, this._headers);
		}

		Products.prototype.getById = function (objectId) {     
			return this._ajaxRequester.get(this._serviceUrl + '/' + objectId, this._headers);
		}

		Products.prototype.add = function (product) {
			return this._ajaxRequester.post(this._serviceUrl, product, this._headers);
		}

		Products.prototype.delete = function (objectId) {
			var url = this._serviceUrl + '/' + objectId;
			return this._ajaxRequester.delete(url, this._headers);
		}

		return Products;
	}());

	return {
		get: function (baseUrl, ajaxRequester) {
			return new Data(baseUrl, ajaxRequester);
		}
	}
}());