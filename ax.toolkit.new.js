


!(function ()
{
	'use strict';

	const _w = window,
		  _d = document,
		  _v = '2.0.0';




	//┐
	//│  ╔═══════════════════════════════╗
	//│  ║                               ║
	//╠──╢  JS TOOLKIT                   ║
	//│  ║                               ║
	//│  ╚═══════════════════════════════╝
	//┘	
	
		const _createToolkit = function (_w, _d, _v, _o)
		{
			if (!_w.$axure || !_w.jQuery) return null;


			const _a = _w.$axure,
				  _private = _a.internal(function (ax) { return ax }),
				  _axSTO = _private.evaluateSTO,
				  _parent = _w.parent,
				  _frames = _w.frames,
				  _listeners = [],
				  _fn = {},
				  _utils = {};




			//┐
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  AXURE TOOLKIT TODO           ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				/**
				 *	• Добавить описание bug fixes
				 */




			//┐
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  AXURE TOOLKIT                ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				const AxureToolkit = function ()
				{
					this.version = _v;
					this.name = 'ax.toolkit';

					_w.$a = _a.query;
					_w.$u = _utils;
					_w.$d = {};
					_w.$m = this;

					_w.addEventListener('message', _broadcastHandler);

					
					_applyFixes();
					_applyExtends();
					_applyExternals();

					_initialize();


					console.log('Axure Toolkit', 'v' + _v, 'initialized and ready!');
				};




			//┐
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  TOOLKIT PUBLIC METHODS       ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				AxureToolkit.prototype = 
				{
					/**
					 * Добавляет новую функцию, которая будет вызываться из объекта виджета
					 * @param {string} name - имя по которому будет вызываться функция
					 * @param {function} func - функция объекта
					 */
					
					addExtension: function (name, func)
					{
						_private.public.fn[name] = func;
					},


					/**
					 * Добавляет новую функцию, которая будет вызываться из выражения прототипа
					 * @param {string} name - имя по которому будет вызываться функция
					 * @param {function} func - функция выражения
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
						_broadcastListeners.push({ channel: channel, listener: listener, once: once });
					}

				};




			//┐
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  TOOLKIT EVENT BROADCASTING   ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				/**
				 * Поддержка широковещательных сообщений в прототипе
				 * 
				 * Обработчик post message
				 */
				
				const _broadcastHandler = function (event)
				{
					var source = event.source,
						data = event.data,
						channel = data.channel,
						message = data.message,
						index = 0,
						item;

					for (index; index < _broadcastListeners.length; index++)
					{
						item = _broadcastListeners[index];

						if (!item) continue;

						if (item.channel === '*' || _isChannelMatch(item.channel, channel))
						{
							var l = item.listener;

							if (_isString(l)) {
								_a('@' + l).moveBy(0, 0, {});
							}

							if (_isFunction(l)) {
								l.call(_w, channel, message);
							}

							if (_isArray(l))
							{
								for (var i = 0; i < l.length; i++)
								{
									if (_isString(l[i])) {
										_a('@' + l[i]).moveBy(0, 0, {});
									}

									if (_isFunction(l[i])) {
										l[i].call(_w, channel, message);
									}
								}
							}

							if (item.once) {
								delete _broadcastListeners[index];
							}
						}
					}

					if (_parent !== source)
					{
						_parent.postMessage(data, '*');
					}

					if (_frames.length > 0) 
					{
						for (index = 0; index < _frames.length; index++) {
							if (_frames[index] !== source) {
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
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  TOOLKIT EXTENDS              ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				/**
				 * Регистрация функций-расширений
				 */
				
				const _applyExtends = function ()
				{
					_private.evaluateSTO = _sto;
					_private.public.fn.run = _run;

					return true;
				};

				
				/**
				 * Добавляет возможность выполнения сценария внутри 
				 * виджета с типом "vectorShape"
				 */
				
				const _run = function ()
				{
					this.each(function (element, elementId)
					{
						if (element.type === 'vectorShape')
						{
							var script = _a('#' + elementId).text();

							if (script !== '')
							{
								try { _w.eval(script) } 
								catch (error) {
									console.error('Exception:\n' + error + '\n\nTrace:\n' + error.stack);
								}
							}
						}
					});

					return this;
				};


				/**
				 * Переопределяет функцию _private.evaluateSTO для внедрения пользовательских функций в выражения
				 * @param {object} sto - объект sto
				 * @param {object} scope - область видимости
				 * @param {object} eventInfo - содержимое вызывающего события
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
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  TOOLKIT EXTERNALS            ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				/**
				 * Внедрение внешних библиотек
				 */
				
				const _applyExternals = function ()
				{
					//

					return true;
				};




			//┐
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  TOOLKIT UTILITIES            ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				const _isArray = _utils.isArray = Array.isArray || function(obj)
				{
					return toString.call(obj) === '[object Array]';
				};


				const _isString = _utils.isString = function (str)
				{
					return typeof str === 'string' || str instanceof String;
				};


				const _isFunction = _utils.isFunction = function (func)
				{
					return typeof func == 'function' || false;
				};


				const _isNumber = _utils.isNumber = function (n)
				{
					return !isNaN(parseFloat(n)) && isFinite(n);
				};




			//┐
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  AXURE 8 API FIXES            ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				/**
				 * Исправляет баги Axure 8 API
				 * 
				 *	• getGlobalVariable
				 *	• value
				 */
		
				const _applyFixes = function ()
				{
					// поведение getGlobalVariable
					_private.public.getGlobalVariable = _private.getGlobalVariable = function(name) {
						return _private.globalVariableProvider.getVariableValue(name);
					};

					// поведение value
					_private.public.fn.value = function ()
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
									if (arguments[0] == true) {
										elementIdQuery.attr('checked', true);
									} else if (arguments[0] == false) {
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

					// поведение text
					_private.public.fn.text = function ()
					{
						if (arguments[0] == undefined) {
							var firstId = this.getElementIds()[0];

							if (!firstId) { return undefined; }

							return getWidgetText(firstId);
						} 

						else {
							var a = '' + arguments[0],
								elementIds = this.getElementIds();

							for(var index = 0; index < elementIds.length; index++) {
								var currentItem = elementIds[index];

								var widgetType = _private.getTypeFromElementId(currentItem);

								if(_private.public.fn.IsTextBox(widgetType) || _private.public.fn.IsTextArea(widgetType)) { //For non rtf
									SetWidgetFormText(currentItem, a);
								} else {
									var idRtf = '#' + currentItem;
									if($(idRtf).length == 0) idRtf = '#u' + (Number(currentItem.substring(1)) + 1);

									if($(idRtf).length != 0) {
										//If the richtext div already has some text in it,
										//preserve only the first style and get rid of the rest
										//If no pre-existing p-span tags, don't do anything
										if($(idRtf).find('p').find('span').length > 0) {
											$(idRtf).find('p:not(:first)').remove();
											$(idRtf).find('p').find('span:not(:first)').remove();

											//Replace new-lines with NEWLINE token, then html encode the string,
											//finally replace NEWLINE token with linebreak
											var textWithLineBreaks = a.replace(/\n/g, '--NEWLINE--');
											var textHtml = $('<div/>').text(textWithLineBreaks).html();
											$(idRtf).find('span').html(textHtml.replace(/--NEWLINE--/g, '<br>'));
										}
									}
								}
							}

							return this;
						}
					};

					var getWidgetText = function(id)
					{
						var idQuery = $jobj(id);
						var inputQuery = $jobj(_private.INPUT(id));
						if (inputQuery.length) idQuery = inputQuery;

						if (idQuery.is('input') && (_private.public.fn.IsCheckBox(idQuery.attr('type')) || idQuery.attr('type') == 'radio')) {
							idQuery = idQuery.parent().find('label').find('div');
						}

						if (idQuery.is('div')) {
							var $rtfObj = idQuery.hasClass('text') ? idQuery : idQuery.find('.text');
							if ($rtfObj.length == 0) return undefined;

							var textOut = '';
							$rtfObj.children('p').each(function(index) {
								if (index != 0) textOut += '\n';

								//Replace line breaks (set in SetWidgetRichText) with newlines and nbsp's with regular spaces.
								var htmlContent = $(this).html().replace(/<br[^>]*>/ig, '\n').replace(/&nbsp;/ig, ' ');
								textOut += $(htmlContent).text();
							});

							return textOut;
							
						} else {
							var val = idQuery.val();
							return val == undefined ? '' : val;
						}
					};

					return true;
				};




			//┐
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  TOOLKIT INITIALIZATION       ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				/**
				 * Инициализация расширения
				 * 
				 *	• Находит специальные виджеты (ax.bundle и ax.import) 
				 *	  и импортирует из них сценарии. После импорта удаляет 
				 *	  все контейнеры из DOM.
				 *	• Находит виджет ax.ready и прожигает в нем OnMove
				 *	• Находит виджеты ax.init и прожигает в них OnMove
				 */
				
				const _initialize = function ()
				{
					console.log('Axure Toolkit initialization...');

					var bundle = [], imports = [], init = [], i;

					_a('*').each(function(element, elementId)
					{
						if (element.label) {
							element.label.match('ax.bundle') && bundle.push(element);
							element.label.match('ax.import') && imports.push(element);
							element.label.match('ax.init') && init.push(element);
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

					_a('@ax.ready').moveBy(0, 0, {});

					if (init.length > 0) 
					{
						for (i = 0; i < init.length; i++)
						{
							_a('@' + init[i].label).moveBy(0, 0, {});
						}
					}
				};


				const _beforeOnLoad = function ()
				{
					console.log('before OnPageLoad...');
					_a('@ax.before').moveBy(0, 0, {});
				};


				const _afterOnLoad = function ()
				{
					console.log('after OnPageLoad...');
					_a('@ax.after').moveBy(0, 0, {});
				};




			//┐
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  TOOLKIT INITIALIZER          ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				const ToolkitInitializer = function ()
				{
					new AxureToolkit();

					// виджеты из прототипа доступны во время 
					// вызова событий beforeOnLoad и afterOnLoad
					
					this.beforeOnLoad = _beforeOnLoad;
					this.afterOnLoad = _afterOnLoad;
				};


				return new ToolkitInitializer();

		};




	//┐
	//│  ╔═══════════════════════════════╗
	//│  ║                               ║
	//╠──╢  ACTIVATOR                    ║
	//│  ║                               ║
	//│  ╚═══════════════════════════════╝
	//┘	
	
		!(function (_w, _d)
		{
			var _open = _w.open;


			/**
			 * Переопределяет поведение window.open для активации возможности запуска сценариев
			 * с помощью действия "Open Link in New Window/Tab". Для активации сценарий должен 
			 * начинаться с "javascript:" и заканчиваться "void 0;"
			 */
			
			_w.open = function (url)
			{
				if ((url.substring(0, 11) !== 'javascript:')) {
					return _open.apply(null, arguments);
				}

				var script = url.substring(11).trim();

				/** ..можно перехватить и модифицировать script **/

				try { eval(script) } 
				catch (error) {
					return console.error('Exception:\n' + error);
				}
			};


			/**
			 * Инициализатор Axure Toolkit
			 */

			var _initializer = null;


			/**
			 * Обработчики событий "DOMContentLoaded" и "onload"
			 */

			var _beforePageOnLoad = function ()
			{
				_initializer = _createToolkit(_w, _d, _v, _open);
				_initializer && _initializer.beforeOnLoad();
			};

			var _afterPageOnLoad =  function ()
			{
				_initializer && _initializer.afterOnLoad();
				_initializer = null;
				_open = null;
			};


			/**
			 * "DOMContentLoaded" и "onload" предоставляют возможность вызова функции до
			 * и после отработки события "OnPageLoad" ("OnPageLoad" — событие из прототипа,
			 * которое срабатывает сразу после загрузки страницы целиком)
			 */
			
			_w.onload = _afterPageOnLoad;
			_d.addEventListener('DOMContentLoaded', _beforePageOnLoad);


		})(_w, _d);




})();