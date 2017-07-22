



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
				  _axSTO = _private.evaluateSTO,
				  _listeners = [],
				  _fn = {};
				  
			var _instance;



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

						_extend() && _initialize();
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
					},


					/**
					 * Отправляет сообщение
					 * @param {string, array} channel - название канала или список каналов
					 * @param {all} message - содержимое сообщения
					 */
					
					send: function (channel, message)
					{
						if (!channel || (!_isString(channel) && !_isArray(channel))) return;
						_w.postMessage({ channel: channel, message: message }, '*');
					},


					/**
					 * Добавляет слушателя в рассылку
					 * @param {string} channel - название канала
					 * @param {function, string, array} listener - функция обратного вызова
					 * @param {boolean} once - отработает один раз и удалиться из списка слушателей
					 *
					 * listener value:
					 * function - функция обратного вызова
					 * string - вызывает OnMove в конкретном виджете (имя виджета)
					 * array - вызывает OnMove в конкретных виджетах (список имен) или вызывает функцию
					 */
					
					listen: function (channel, listener, once)
					{
						if (!_isArray(listener) && !_isFunction(listener) && !_isString(listener)) return;
						_listeners.push({ channel: channel, listener: listener, once: once });
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
				
				const _initialize = function ()
				{
					var bundle = [], imports = [], init = [], i;

					_w.addEventListener("message", _listener);

					_a('*').each(function(element, elementId)
					{
						if (element.label) {
							element.label.match('ax.bundle.') && bundle.push(element);
							element.label.match('ax.import.') && imports.push(element);
							element.label.match('ax.init.') && init.push(element);
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

					_a('@ax.ready').moveBy(0, 0, {});

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


				/**
				 * Обработчик post message
				 */
				
				const _listener = function (event)
				{
					var source = event.source,
						data = event.data,
						channel = data.channel,
						message = data.message,
						index = 0;

					for (index; index < _listeners.length; index++)
					{
						if (!_listeners[index]) continue;

						if (_isChannelMatch(_listeners[index].channel, channel))
						{
							var l = _listeners[index].listener;

							if (_isString(l)) {
								_axure('@' + l).moveBy(0, 0, {});
							}

							if (_isFunction(l)) {
								l.call(_window, channel, message);
							}

							if (_isArray(l))
							{
								for (var i = 0; i < l.length; i++)
								{
									if (_isString(l[i])) {
										_axure('@' + l[i]).moveBy(0, 0, {});
									}

									if (_isFunction(l[i])) {
										l[i].call(_window, channel, message);
									}
								}
							}

							if (_listeners[index].once) {
								delete _listeners[index];
							}
						}
					}

					if (_window.parent !== source)
					{
						_window.parent.postMessage(data, '*');
					}

					if (_frames.length > 0) 
					{
						for (index = 0; index < _frames.length; index++) {
							if (_frames[index] !== event.source) {
								_frames[index].postMessage(data, '*');
							}
						}
					}
				};


				/**
				 * Осуществляет поиск и сравнение каналов
				 * @param  {string, array}  a - канал или список каналов на которые подписан слушатель
				 * @param  {string, array}  b - канал или список каналов для которых предназначено сообщение
				 * @return {Boolean} вовращает результат сравнения
				 */
				
				const _isChannelMatch = function (a, b)
				{
					if (a == b) return true;

					if (_isArray(a))
					{
						for (var i = 0; i < a.length; i++)
						{
							if (_isArray(b))
							{
								for (var j = 0; j < b.length; j++)
								{
									if (a[i] == b[j]) return true;
								}
							} 

							else {
								if (a[i] == b) return true;
							}
						}
					} 

					else {

						if (_isArray(b))
						{
							for (var i = 0; i < b.length; i++)
							{
								if (b[i] == a) return true;
							}
						}
					}

					return false;
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




