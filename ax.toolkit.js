



//┐
//│  ╔═══════════════════════════════╗
//│  ║                               ║
//╠──╢  JS TOOLKIT                   ║
//│  ║                               ║
//│  ╚═══════════════════════════════╝
//┘

	window.toolkitActivation = function ()
	{
		if (!window.$axure || !window.jQuery) return;

		!(function ()
		{
			'use strict';

			const _w = window,
				  _a = _w.$axure,
				  _private = _a.internal(function (ax) { return ax }),
				  _axSTO = _private.evaluateSTO;
				  
			var _instance, _fn;



			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  AXURE TOOLKIT                          │
			//│  └─────────────────────────────────────────┘
			//┘

				function AxureToolkit ()
				{
					if (!_instance) 
					{
						this.version = '1.0';
						this.name = 'axure.toolkit';

						_w.$m = _instance = this;

						_extend() && _initialize('@toolkit.ready');
					}
				};



			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  PUBLIC TOOLKIT METHODS                 │
			//│  └─────────────────────────────────────────┘
			//┘

				AxureToolkit.prototype = 
				{
					/**
					 * Добавляет новую функцию для вызова из выражений Axure RP
					 * @param {string} name - имя функции по которому она будет вызываться
					 * @param {function} func - функция для выражения
					 */
					
					addExpression: function (name, func)
					{
						_fn[name] = func;
					}
				};



			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  PRIVATE TOOLKIT METHODS                │
			//│  └─────────────────────────────────────────┘
			//┘

				/**
				 * Регистрация функций-расширений
				 */
				
				const _extend = function ()
				{
					_private.evaluateSTO = _sto;
					_private.public.fn.run = _run;

					return true;
				}


				/**
				 * Инициализация расширения
				 * - находит и запускает сценарии
				 * - оповещает о готовности виджеты
				 */
				
				const _initialize = function (initializer)
				{
					var bundle = [], imports = [], init = [], i;

					_a('*').each(function(element, elementId)
					{
						if (element.label) {
							element.label.match('bundle.') && bundle.push(element);
							element.label.match('import.') && imports.push(element);
							element.label.match('init.') && init.push(element);
						}
					});

					if (imports.length > 0) 
					{
						for (i = 0; i < imports.length; i++)
						{
							_a('@' + imports[i].label).run().$().remove();
						}
					}

					if (bundle.length > 0)
					{
						for (i = 0; i < bundle.length; i++)
						{
							_a('@' + bundle[i].label).$().remove();
						}
					}

					console.log('Axure extensions initialized and ready!');

					_a(initializer).moveBy(0, 0, {});

					if (init.length > 0) 
					{
						for (i = 0; i < init.length; i++)
						{
							_a('@' + init[i].label).moveBy(0, 0, {});
						}
					}
				};

				
				/**
				 * Добавляет возможность выполнения сценария внутри виджета
				 */
				
				const _run = function ()
				{
					var elementIds = this.getElementIds();

					for (var i = 0; i < elementIds.length; i++)
					{
						var script = _a('#' + elementIds[i]);

						try { _w.eval(script.text()) } 
						catch (error) {
							console.error('Exception:\n' + error + '\n\nTrace:\n' + error.stack);
						}
					}

					return this;
				};


				/**
				 * Переопределяет функцию _private.evaluateSTO для внедрения пользовательских функций в выражения
				 * @param {object} sto - объект sto
				 * @param {object} scope - область видимости
				 * @param {object} eventInfo - соержимое вызывающего события
				 */
				
				const _sto  = function (sto, scope, eventInfo)
				{
					if ((sto.sto !== 'fCall') || (sto.func !== 'trim') || (sto.arguments.length === 0)) {
						return _axSTO.apply(null, arguments);
					}

					var thisObj = _axSTO(sto.thisSTO, scope, eventInfo);
					
					if (sto.thisSTO.computedType != 'string') {
						thisObj = thisObj.toString();
					}

					var fn = _fn[thisObj.trim()];

					if (!fn || typeof (fn) !== 'function')
					{
						console.error('Error:\nMethod "' + thisObj + '" not found!');
					} 

					else {
						var args = [];

						for (var i = 0; i < sto.arguments.length; i++) {
							args.push(_axSTO(sto.arguments[i], scope, eventInfo));
						}

						if (false) return fn.apply({scope: scope, eventInfo: eventInfo}, args);
						
						try {
							return fn.apply({scope: scope, eventInfo: eventInfo}, args);
						} catch (error) {
							console.error('Exception:\n' + error + '\n\nTrace:\n' + error.stack);
						}
					}

					return '';
				};



			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  STARTUP                                │
			//│  └─────────────────────────────────────────┘
			//┘

				new AxureToolkit();
		})();
	};




//┐
//│  ╔═══════════════════════════════╗
//│  ║                               ║
//╠──╢  JS INITIALIZER               ║
//│  ║                               ║
//│  ╚═══════════════════════════════╝
//┘

	
	
	!(function ()
	{
		'use strict';

		const _w = window, 
			  _o = _w.open;


		/**
		 * Переопределяет поведение window.open для активации возможности запуска сценариев
		 * с помощью действия "Open Link in New Window/Tab". Для активации сценарий должен 
		 * начинаться с "javascript:" и заканчиваться "void 0;"
		 */
		
		_w.open = function (url)
		{
			if ((url.substring(0, 11) !== 'javascript:')) {
				return _o.apply(null, arguments);
			}

			var script = url.substring(11).trim();

			/** ..можно перехватить и модифицировать script **/

			try { eval(script) } 
			catch (error) {
				return console.error('Exception:\n' + error);
			}
		};


		/**
		 * "DOMContentLoaded" и "onload" предоставляют возможность вызова функции до
		 *  и после отработки события "OnPageLoad" ("OnPageLoad" — события из прототипа
		 *  срабатывает сразу после загрузки страницы целиком)
		 */
		
		_w.onload = _afterPageOnLoad;
		document.addEventListener("DOMContentLoaded", _beforePageOnLoad);


		const _beforePageOnLoad = function ()
		{
			_fix() && _w.toolkitActivation();
			// console.log( 'Before OnPageLoad' );
		};

		const _afterPageOnLoad =  function ()
		{
			// console.log( 'After OnPageLoad' );
		};


		/**
		 * Исправляет баги Axure API
		 * 
		 * • getGlobalVariable
		 * • value
		 */
		
		const _fix = function ()
		{
			var _private = _w.$axure.internal(function (ax) { return ax });

			_private.public.getGlobalVariable = _private.getGlobalVariable = function(name) {
				return _private.globalVariableProvider.getVariableValue(name);
			};

			_private.public.fn.value = function()
			{
				if (arguments[0] == undefined)
				{
					var firstId = this.getElementIds()[0];

					if(!firstId) return undefined;

					var widgetType = _private.getTypeFromElementId(firstId);

					if (_private.public.fn.IsComboBox(widgetType) || _private.public.fn.IsListBox(widgetType)) {
						return $('#' + firstId + ' :selected').text();
					} else if (_private.public.fn.IsCheckBox(widgetType) || _private.public.fn.IsRadioButton(widgetType)) {
						return $('#' + firstId + '_input').is(':checked');
					} else if (_private.public.fn.IsTextBox(widgetType)) {
						return $('#' + firstId + '_input').val();
					} else {
						return this.jQuery().first().val();
					}
				} else {
					var elementIds = this.getElementIds();

					for(var i = 0; i < elementIds.length; i++)
					{
						var widgetType = _private.getTypeFromElementId(elementIds[i]);

						var elementIdQuery = $('#' + elementIds[i]);

						if (_private.public.fn.IsCheckBox(widgetType) || _private.public.fn.IsRadioButton(widgetType))
						{
							if(arguments[0] == true) {
								elementIdQuery.attr('checked', true);
							} else if(arguments[0] == false) {
								elementIdQuery.removeAttr('checked');
							}
						} else if (_private.public.fn.IsTextBox(widgetType)) {
							
							$('#' + elementIdQuery[0].id + '_input').val(arguments[0]);

						} else {
							elementIdQuery.val(arguments[0]);
						}
					}

					return this;
				}
			};

			return true;
		};

	})();




