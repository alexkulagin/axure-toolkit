


/*
 ╔═════════════════════════════════════════════════════════════════╗
 ║       _                  ____            _       _              ║
 ║      | | __ ___   ____ _/ ___|  ___ _ __(_)_ __ | |_   • 2.2.1  ║
 ║   _  | |/ _` \ \ / / _` \___ \ / __| '__| | '_ \| __|           ║
 ║  | |_| | (_| |\ V / (_| |___) | (__| |  | | |_) | |_            ║
 ║   \___/ \__,_| \_/ \__,_|____/ \___|_|  |_| .__/ \__|           ║
 ║      _                           _____    |_|    _ _    _ _     ║
 ║     / \   __  ___   _ _ __ ___  |_   _|__   ___ | | | _(_) |_   ║
 ║    / _ \  \ \/ / | | | '__/ _ \   | |/ _ \ / _ \| | |/ / | __|  ║
 ║   / ___ \  >  <| |_| | | |  __/   | | (_) | (_) | |   <| | |_   ║
 ║  /_/   \_\/_/\_\\__,_|_|  \___|   |_|\___/ \___/|_|_|\_\_|\__|  ║
 ║                                                                 ║
 ╚═════════════════════════════════════════════════════════════════╝
*/




!(function ()
{
	'use strict';

	const _w = window,
		  _d = document,
		  _v = '2.2.1';




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
				  _$ = _w.jQuery,
				  _private = _a.internal(function (ax) { return ax }),
				  _axSTO = _private.evaluateSTO,
				  _parent = _w.parent,
				  _frames = _w.frames,
				  _broadcastListeners = [],
				  _fn = {},
				  _instance = {},
				  _utils = {};




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
					_w.$w = this.widget;
					_w.$f = this.find;

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
					},


					/**
					 * Находит виджеты с учетом вложения
					 * @param  {string} path — путь к виджету ('group_a/group_b/group_c/widgetName')
					 * @return {object} — возвращает найденные виджеты
					 *
					 * Примеры:
					 * $m.find('groupA/name') — виджеты name из группы groupA
					 * $m.find('groupA/groupB/name') — виджеты name из вложенной группы groupA -> groupB
					 * $m.find('groupA/panelName/stateName/name') — виджеты name из состояния stateName динамической панели
					 */
					
					find: function (path)
					{
						return _findWidgets(path);
					},


					/**
					 * Возвращает объект виджета по названию
					 * @param  {[type]} name — название виджета
					 * @return {object} объект виджета
					 */
					
					widget: function (name)
					{
						return _a('@'+name);
					},


					panel: function (path)
					{
						return new PanelController(this.find(path));
					}

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
			//╠──╢  FINDING                      ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				/**
				 * Находит виджеты в представлении (dynamic panel or repeater) и возвращает идентификаторы
				 * @param {object} target - объект поиска
				 * @param {[string, array]} name - название виджета или список названий
				 * @param {[number, array]} childId - индекс или список индексов потомков (dynamic panel or repeater)
				 * @return {array} - возвращает список идентификаторов
				 */
				
				const _findIDinRows = function (target, name, childId)
				{
					if (!name)  return null;

					var view = [],
						ids = [],
						$object = target.$(),
						query = _getFindInRowsQuery(name),
						finded;

					const each = function (f, v) {
						$.each(f, function( index, value ) {
							v.push(value);
						});
					};


					if (childId == undefined)
					{
						finded = $object.find(query);
						each(finded, view);
					} 

					else 
					{
						if (_isArray(childId))
						{
							for (var i = 0; i < childId.length; i++)
							{
								finded = $('#' + childId[i]).find(query);

								each(finded, view);
							}
						}

						if (_isString(childId))
						{
							finded = $('#' + childId).find(query);

							each(finded, view);
						}
					}

					for (var v in view) {
						ids[v] = view[v].id;
					}

					return ids;
				};


				/**
				 * Формирует запрос для функции _findIDinRows
				 * @param  {[number, array]} name - имя виджета
				 * @return {string} - возвращает подготовленный запрос
				 */
				
				const _getFindInRowsQuery = function (name)
				{
					var query = '', i = 0, l;

					if (_isArray(name) && name.length > 0)
					{
						l = name.length;

						for (i; i < l; i++) {
							query += '[data-label="' + name[i] + '"],'
						}
					} else {
						query = '[data-label="' + name + '"]'
					}

					return query;
				};


				/**
				 * Находит виджеты с учетом вложения
				 * @param  {string} path — путь к виджету
				 * @return {object} — возвращает найденные виджеты
				 */
				
				const _findWidgets = function (path)
				{
					var query = _getFindWidgetsQuery(path),
						list = [],
						finded;

					const each = function (f, v) {
						$.each(f, function( index, value ) {
							v.push(value.id);
						});
					};

					finded = $(query);

					each(finded, list);

					return $axure(function (element, elementId)
					{
						for (var n = 0; n < list.length; n++) {
							if (list[n] == elementId) {
								return true;
							}
						};

						return false;
					});

				};


				/**
				 * Формирует запрос для функции _findWidgets
				 * @param  {string} path — путь к виджету
				 * @return {string} — возвращает запрос для поиска
				 */
				
				const _getFindWidgetsQuery = function (path)
				{
					var name = path.split('/'),
						query = '';

					for (var i = 0; i < name.length; i++)
					{
						query += '[data-label="' + name[i] + '"] ';
					}

					return query;
				};




			//┐
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  PANEL CONTROLLER             ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				const PanelController = function (widgets)
				{
					var list = this.list = [],
						controller;

					widgets.each(function(el, id)
					{
						if (el.type == 'dynamicPanel')
						{
							
							if (!_instance[id]) {
								controller = _instance[id] = new PanelExtension(el, id);
							} else {
								controller = _instance[id];
							}

							list.push(controller);
						}
					});

					return (list.length != 0) ? this : null;
				};



				//┐
				//│  ┌─────────────────────────────────────────┐
				//╠──┤  PUBLIC PANEL CONTROLLER METHODS        │
				//│  └─────────────────────────────────────────┘
				//┘

					PanelController.prototype = 
					{	
						
						/**
						 * Меняет состояние панели или возвращает объект текущего состояния
						 * @param  {[number, string]} state — индекс состояния или лейбл
						 * @param  {object} options — анимация перехода
						 * @return {object} — возвращает объект текущего состояния
						 */
						
						state: function (state, options)
						{
							var list = this.list,
								first,
								controller;

							if (state == undefined)
							{
								controller = list[0];
								return (controller) ? controller.state() : null;
							}

							for (var i = 0; i < list.length; i++)
							{
								controller = list[i];
								controller.state(state, options);
							}
						},


						/**
						 * Возвращает по названию виджеты из конкретных состояний динамической панели
						 * @param {[string, array]} name - имя виджета или список имен
						 * @param {[number, array]} state - индекс/состояние или список индексов/состояний
						 * @return {object} - возвращает объект виджета
						 */
						
						find: function (name, state)
						{
							var list = this.list,
								ids = [],
								controller;

							for (var i = 0; i < list.length; i++)
							{
								controller = list[i];
								ids = ids.concat(controller.getWidgetIDs(name, state));
							}

							return $axure(function (element, elementId)
							{
								for (var i = 0; i < ids.length; i++) {
									if (ids[i] == elementId) {
										return true;
									}
								};

								return false;
							});
						}
					};



				//┐
				//│  ┌─────────────────────────────────────────┐
				//╠──┤  PANEL EXTENSION                        │
				//│  └─────────────────────────────────────────┘
				//┘

					/**
					 * Расширение для управления динамическими панелями
					 * @param {object} widget - объект виджета
					 * @param {object} el - скрытый элемент виджета
					 * @param {string} id - идентификатор HTML представления
					 */
					
					function PanelExtension (el, id)
					{
						var _ = {};
						
						_.target = _a('#' + id);
						_.el = el;
						_.id = id;
						_.states = _getPanelStates(id);

						this.private = _;
						this.options = {};
					};



				//┐
				//│  ┌─────────────────────────────────────────┐
				//╠──┤  PUBLIC PANEL EXTENSION METHODS         │
				//│  └─────────────────────────────────────────┘
				//┘

					PanelExtension.prototype = 
					{
						/**
						 * Меняет состояние панели или возвращает объект текущего состояния
						 * @param  {[number, string]} state — индекс состояния или лейбл
						 * @param  {object} options — анимация перехода
						 * @return {object} — возвращает объект текущего состояния
						 */
						
						state: function (state, options)
						{
							var _ = this.private,
								states = _.states,
								currentState,
								nextState,
								stateID;

							if (!options) {
								options = this.options;
							}

							// идентификатор текущего состояния
							stateID = _private.visibility.GetPanelState(_.id);

							for (var index in states)
							{
								// текущее состояние
								if (states[index].id == stateID) {
									currentState = states[index];
								}

								// следующее состояние
								if (state)
								{
									if (_isNumber(state) && state == states[index].index) {
										nextState = states[index];
									}

									if (_isString(state) && state == states[index].label) {
										nextState = states[index];
									}
								}
							}

							if (!currentState) return;

							// возвращает текущее состояние динамической панели
							if (!state)
							{
								return currentState;
							}

							// осуществляет переход к следующему состоянию
							if (nextState && nextState.index != currentState.index) {
								_.target.SetPanelState(nextState.index, options);
							}
						},


						/**
						 * Возвращает идентификаторы виджетов из конкретных состояний динамической панели
						 * @param {[string, array]} name - имя виджета или список имен
						 * @param {[number, array]} state - индекс/состояние или список индексов/состояний
						 * @return {array} - возвращает список идентификаторов
						 */
						
						getWidgetIDs: function (name, state)
						{
							var _ = this.private,
								states = _.states;

							if (states.length == 0) return null;
							
							if (state) {
								state = _getPanelStateId(states, state);
							} else {
								state = undefined;
							}

							return _findIDinRows(_.target, name, state);
						}
					};



				//┐
				//│  ┌─────────────────────────────────────────┐
				//╠──┤  PRIVATE PANEL EXTENSION METHODS        │
				//│  └─────────────────────────────────────────┘
				//┘

					/**
					 * Находит все состояния динамической панели
					 * @param  {string} id — идентификатор панели
					 * @return {array} — возвращает список состояний
					 */
					
					const _getPanelStates = function (id)
					{
						var $states = _$('#' + id).children();
						var states = [];
						
						for (var i = 0; i < $states.length; i++)
						{
							states.push({
								id: $states[i].id,
								index: i + 1,
								label: $states[i].dataset.label,
								$state: $states[i]
							});
						}

						return states;
					};


					/**
					 * Возвращает список идентификаторов состояний панели
					 * @param {array} states — список состояний
					 * @param  {[string, number, array]} state — индекс/лейбл состояния
					 * @return {array} — возвращает null или список идентификаторов
					 */
					
					const _getPanelStateId = function (states, state)
					{
						var total = states.length, 
							i, n, s, list;

						if (_isArray(state)) 
						{
							list = [];

							for (n = 0; n < state.length; n++)
							{
								s = state[n];

								for (i = 0; i < total; i++)
								{
									if ((_isString(s) && states[i].label == s) || (_isNumber(s) && states[i].index == s)) {
										list.push(states[i].id);
									}
								}
							}

							if (list.length > 0) return list;
						}

						else {
							for (i = 0; i < total; i++)
							{
								if ((_isString(state) && states[i].label == state) || (_isNumber(state) && states[i].index == state)) {
									return states[i].id;
								}
							}
						}

						return undefined;

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