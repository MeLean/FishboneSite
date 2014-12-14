var app = app || {};

(function () {
	var baseUrl = 'https://api.parse.com/1/'
	var ajaxRequester = app.ajaxRequester.get();
	var data = app.data.get(baseUrl, ajaxRequester);
	var controller = app.controller.get(data);
	controller.attachEventHandlers();

	app.router = Sammy(function () {
	    var selector = '#main';
		this.get('#/', function () {
		    controller.loadHome(selector);		    
		});

		this.get('#/login', function () {
		    controller.loadLogin(selector);
		});

		this.get('#/register', function () {
		    controller.loadRegister(selector);
		});

		this.get('#/products', function () {
		    controller.loadProducts(selector);
		});

		this.get('#/add-product', function () {
		    controller.loadAddProduct(selector);		
		});

		this.get('#/wellcome-user', function () {
		    controller.loadWellcomeUser(selector);		   
		});

		this.get('#/logout', function () {
		    controller.logout(selector);
		});

		this.get('#/delete-product', function () {
		    controller.loadDeleteProduct(selector);
		});

		this.get('#/edit-product', function () {
		    controller.loadEditProduct(selector);
		});
	});

	app.router.run('#/');
                         
}())