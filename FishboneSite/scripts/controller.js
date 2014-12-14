var app = app || {};

app.controller = (function () {
	function BaseController(data) {
		this._data = data;
	}

	BaseController.prototype.loadHome = function (selector) {
	    $(selector).load('./templates/home.html');
	}

	BaseController.prototype.logout = function (selector) {
	    sessionStorage.clear();
	    $(selector).load('./templates/home.html');
	}
    

	BaseController.prototype.loadLogin = function (selector) {
		$(selector).load('./templates/login.html');
	}

	BaseController.prototype.loadRegister = function (selector) {
		$(selector).load('./templates/register.html');
	}


	BaseController.prototype.loadWellcomeUser = function (selector) {
	    $(selector).load('./templates/wellcomeUser.html');	    	   
	}

	BaseController.prototype.loadAddProduct = function (selector) {
	    $(selector).load('./templates/addProduct.html');
	}

	BaseController.prototype.loadEditProduct= function (selector) {
	    $(selector).load('./templates/editProduct.html');
	}

	BaseController.prototype.loadDeleteProduct = function (selector) {
	    $(selector).load('./templates/deleteProduct.html');
	}

	BaseController.prototype.loadProducts = function (selector) {
	    this._data.products.getAll()
	        .then(function(data) {
	        $.get('templates/products.html', function (template) {
	            var output = Mustache.render(template, data);
	            $(selector).html(output);	            
	        });
	    });
	}

	BaseController.prototype.attachEventHandlers = function () {
	    var selector = '#main';
	    var productSelector = '#product-info';
		attachLoginHandler.call(this, selector);	
		attachRegisterHandler.call(this, selector);
		attachAddProductHandler.call(this, selector);
		attachDeleteProductHandler.call(this, selector);
		attachitemClickHendler.call(this, productSelector);
	}

	var attachitemClickHendler = function (selector) {
	    var _this = this;
	    $(selector).on('click', '.button', function () {
	        sessionStorage[currentObject] = $(this);
	    });
	}

	var attachLoginHandler = function (selector) {
		var _this = this;
		$(selector).on('click', '#login-button', function () {
			var username = $('#username').val();
			var password = $('#password').val();
			_this._data.users.login(username, password)
				.then(function (data) {
				    console.log('login success\n' + JSON.stringify(data));
				    window.history.replaceState('Wellcome', 'Wellcome', '#/wellcome-user');
				    location.reload();
			    },
				function (error) {
				    errorNotification('Could not connect whit data!');
				    console.log(error);
				});
		});
	}

	var attachRegisterHandler = function (selector) {
		var _this = this;
		$(selector).on('click', '#register-button', function () {
			var username = $('#username').val();
			var password = $('#password').val();
			var confirmPassword = $('#confirm-password').val();
			if (password === confirmPassword) {
			    _this._data.users.register(username, password)
				.then(function (data) {
				    window.history.replaceState('Wellcome', 'Wellcome', '#/wellcome-user');
				    location.reload();
				    infoNotification('Reistration succsessuful');
				},
				function (error) {
				    errorNotification('Could not connect whit data!');
				    console.log(error);
				});
			} else {
			    errorNotification('Password does not match!');
			}
		});
	}

	var attachAddProductHandler = function (selector) {
		var _this = this;
		$(selector).on('click', '#add-product-button', function (ev) {
		    var name = $('#name').val();
		    var category = $('#category').val();
		    var price = $('#price').val();
			var userId = sessionStorage.getItem('userId');  
			var productData = {
			    name: name,
			    category: category,
			    price: price,
                // modify the accsess if you need
				ACL: { "*": { "read": true} }
			}
			productData.ACL[userId] = { "read": true, "write": true };		    
		    _this._data.products.add(productData)
				.then(function (data) {									    
					window.history.replaceState('Products', 'Products', '#/products');
					infoNotification('Product added successfully!');		
				}, function (error) {
				    errorNotification('Adding falied!');
					console.log(error);
				});
		}); 

		function getBookmark(objectId) {
			_this._data.bookmarks.getById(objectId)
				.then(function (bookmark) {
					console.log(bookmark);
				}, function (error) {
					console.log(error);
				});
		}
	}

	var attachDeleteProductHandler = function (selector) {
		var _this = this;
		$(selector).on('click', '.delete', function (ev) {		// atach new delete 	 
		    var objectId = $(this).parent().attr("id");
		    var execute = function (objectId) {
		        _this._data.products.delete(objectId)
                    .then(function (data) {
                        $(ev.target).parent().remove();
                        //location.reload();
                    },
                    function (error) {
                        console.log(error);
                    });
		    };

		    confirmNotification('Do you want to delete this product?', execute)
		});
	}

	var errorNotification = function (msg) {
	    noty({
	        text: msg,
	        type: 'error',
	        layout: 'topCenter',
	        timeout: 5000
	    });
	}

	var infoNotification = function (msg) {
	    noty({
	        text: msg,
	        type: 'info',
	        layout: 'topCenter',
	        timeout: 5000
	    });
	}

	var confirmNotification = function(msg, execute) {
	noty(
        {
            text: msg,
            type: 'confirm',
            layout: 'topCenter',
            buttons: [
            {   
                text: "Yes",
                onClick: function ($noty) {
                    execute();
                    $noty.close();
                }
            },
            {
                text: "Cancel",
                onClick: function ($noty) {
                    $noty.close();
                }
            }
            ]
        });
	}

	return {
		get: function (data) {
			return new BaseController(data);
		}
	}
}())