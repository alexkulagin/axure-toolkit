



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


		// TOOLKIT UTILS
		
		const _isArray = Array.isArray || function(obj)
		{
			return toString.call(obj) === '[object Array]';
		};


		const _isString = function (str)
		{
			return typeof str === 'string' || str instanceof String;
		};


		const _isFunction = function (func)
		{
			return typeof func == 'function' || false;
		};


		const _isNumber = function (n)
		{
			return !isNaN(parseFloat(n)) && isFinite(n);
		};


		/**
		 * Находит виджеты в HTML представлении
		 * @param {object} target - объект поиска
		 * @param {[string, array]} name - название виджета или список названий
		 * @param {[number, array]} childId - индекс или список индексов потомков
		 * @return {array} - возвращает объект виджета или null
		 */
		
		const _findWidget = function (target, name, childId)
		{
			if (!name)  return null;

			var view = [],
				list = [],
				$object = target.$(),
				query = _getWidgetStringQuery(name),
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
				list[v] = view[v].id;
			}

			if (list.length == 0) return null;

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
		 * Формирует запрос для функции findWidgetID
		 * @param  {[number, array]} name - имя виджета
		 * @return {string} - возвращает подготовленный запрос
		 */
		
		const _getWidgetStringQuery = function (name)
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
		 * Форматирует байты в килобайты, мегабайты и т.д.
		 * @param  {number} bytes - кол-во байт
		 * @return {string} - возвращает отформатированное значение:
		 * 
		 * 1000 —			// 1 KB
		 * 10000 —			// 10 KB
		 * 100000 —			// 100 KB
		 * 1000000 —		// 1 MB
		 * 10000000 —		// 10 MB
		 * 100000000 —		// 100 MB
		 * 1000000000 —		// 1 GB
		 * 10000000000 —	// 10 GB
		 * 10000000000 —	// 10 GB
		 * 100000000000 —	// 100 GB
		 * 1000000000000 —	// 1 TB
		 * 1500000000000 —	// 1.5 TB
		 */
		
		const _formatBytes = function (bytes, decimals)
		{
			if (bytes == 0) return '0 Bytes';

			var k = 1000,
				dm = decimals || 2,
				sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
				i = Math.floor(Math.log(bytes) / Math.log(k));

			return '' + (parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]);
		};




		// AXURE TOOLKIT
		
		var _init_ = undefined;

		!(function ()
		{
			'use strict';

			const _w = window,
				  _a = _w.$axure,
				  _private = _a.internal(function (ax) { return ax }),
				  _axSTO = _private.evaluateSTO,
				  _parent = _w.parent,
				  _frames = _w.frames,
				  _listeners = [],
				  _fn = {};



			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  AXURE TOOLKIT                          │
			//│  └─────────────────────────────────────────┘
			//┘

				function AxureToolkit ()
				{
					this.version = '1.6';
					this.name = 'ax.toolkit';

					_w.$a = _a.query;
					_w.$d = {};
					_w.$m = this;
					_w.addEventListener("message", _listener);

					_init_ = _initialize;

					_extend();
				};



			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  PUBLIC TOOLKIT METHODS                 │
			//│  └─────────────────────────────────────────┘
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
						_listeners.push({ channel: channel, listener: listener, once: once });
					},

					/**
					 * Объект для хранения созданных экземпляров
					 */
					
					instance: {}
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
				 * 
				 * • находит и запускает сценарии
				 * • оповещает о готовности виджеты
				 */
				
				const _initialize = function ()
				{
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

					console.log('Axure toolkit initialized and ready!');

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

							if (_listeners[index].once) {
								delete _listeners[index];
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




		// DYNAMIC PANEL EXTENSION
		
		!(function ()
		{
			'use strict';

			const _w = window,
				  _a = _w.$axure,
				  _$ = _w.jQuery,
				  _private = _a.internal(function (ax) { return ax });



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
				
				function PanelExtension (widget, el, id)
				{
					var _ = this.private;
					
					_.target = widget;
					_.el = el;
					_.id = id;
					_.states = _getPanelStates(id);
				};


			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  PUBLIC PANEL METHODS                   │
			//│  └─────────────────────────────────────────┘
			//┘

				PanelExtension.prototype = 
				{	
					private: {},
					options: {},

					
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
					 * Возвращает найденный по имени виджет из конкретного состояния динамической панели
					 * @param {[string, array]} name - имя виджета или список имен
					 * @param {[number, array]} state - индекс/состояние или список индексов/состояний
					 * @return {object} - возвращает объект виджета
					 */
					
					getWidget: function (name, state)
					{
						var _ = this.private,
							states = _.states;

						if (states.length == 0) return null;
						
						if (state) {
							state = _getPanelStateId(states, state);
						} else {
							state = undefined;
						}

						return _findWidget(_.target, name, state);
					}

				};



			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  PRIVATE PANEL METHODS                  │
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
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  EXTEND                                 │
			//│  └─────────────────────────────────────────┘
			//┘

				_w.$m.addExtension('getPanelController', function()
				{
					var widget = this,
						single = widget.getElementIds().length == 1,
						instance = _w.$m.instance,
						controller;

					if (single)
					{
						this.each(function(el, id)
						{
							if (el.type == 'dynamicPanel')
							{
								if (!instance[id]) {
									controller = instance[id] = new PanelExtension(widget, el, id);
								} else {
									controller = instance[id];
								}
							}
						});
					} 

					return controller || null;
				});

		})();




		// REPEATER EXTENSION
		
		!(function ()
		{
			'use strict';

			const _w = window,
				  _a = _w.$axure,
				  _$ = _w.jQuery,
				  _private = _a.internal(function (ax) { return ax });


			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  REPEATER EXTENSION                     │
			//│  └─────────────────────────────────────────┘
			//┘

				/**
				 * Расширение для управления репитерами
				 * @param {object} widget - объект виджета
				 * @param {object} el - скрытый элемент виджета
				 * @param {string} id - идентификатор HTML представления
				 */
				
				function RepeaterExtension (widget, el, id)
				{
					var _ = this.private;
					
					_.target = widget;
					_.el = el;
					_.id = id;
					
					_.rows = _.el.data;

					this.model = _private.deepCopy(_.rows);

					// состояние фильтра
					this.filtered = false;
					this.filters = [];
				};


			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  PUBLIC REPEATER METHODS                │
			//│  └─────────────────────────────────────────┘
			//┘

				RepeaterExtension.prototype = 
				{	
					private: {},

					
					/**
					 * Обновляет представление репитера
					 * После внесения каких-либо изменений в модель репитера, метод применяет изменения 
					 * и инициирует обновление HTML представления.
					 */
					
					render: function ()
					{
						var _ = this.private,
							model = this.filtered ? _applyFilters(this.filters, this.model) : this.model;

						_clearRepeaterData(_.id);
						_addRepeaterData(_.id, model);
						_refreshRepeater(_.id);
					},

					
					/**
					 * Удаляет все строки репитера
					 * @return {object} - возвращает обратно экземпляр репитера
					 */
					
					clear: function ()
					{
						this.model = [];

						return this;
					},


					/**
					 * Восстанавливает первоначальные данные репитера
					 * @return {object} - возвращает обратно экземпляр репитера
					 */
					
					recover: function ()
					{
						this.model = _private.deepCopy(this.private.rows);
						return this;
					},

					
					/**
					 * Находит и возвращает строки по условию
					 * @param {[object, number, array]} filter - условия для удаления
					 * @param {boolean} exclude - режим исключения
					 * @param {boolean} visible - возвращает только отображаемые строки
					 * @return {array} - возвращает список найденых строк
					 *
					 * С пустым фильтром возвращает все строки
					 */
					
					get: function (filter, exclude, visible)
					{
						var model = visible && this.filtered ? _applyFilters(this.filters, this.model) : this.model,
							result = !filter ? model : _getRows(model, filter, exclude);
						return result;
					},

					
					/**
					 * Находит и возвращает скопированные строки по условию
					 * @param {[object, number, array]} filter - условия для удаления
					 * @param {boolean} exclude - режим исключения
					 * @param {boolean} visible - возвращает только отображаемые строки
					 * @return {array} - возвращает список скопированных строк
					 *
					 * С пустым фильтром копирует и возвращает все строки
					 */
					
					copy: function (filter, exclude, visible)
					{
						var result = this.get(filter, exclude, visible);
						return _private.deepCopy(result);
					},

					
					/**
					 * Обновляет ячейки в строках по условию
					 * @param {object} cells - объект с данными для обновления
					 * @param {[object, number, array]} filter - условие
					 * @param {boolean} exclude - режим исключения
					 * @return {object} - возвращает обратно экземпляр репитера
					 *
					 * filter:
					 * - object - объект с условиями
					 * - number - индекс строки
					 * - array - список индексов
					 */
					
					update: function (cells, filter, exclude)
					{
						var row, model, l, i = 0;

						// наличие cells обязательное условие
						if (!cells) return this;

						// если фильтр не задан, то обновляет все строки
						model = !filter ? this.model : _getRows(this.model, filter, exclude);

						// нечего обновлять
						if (model.length < 1) return this;
						
						l = model.length,
						i = 0;

						for (i; i < l; i++)
						{
							row = model[i];

							for (var prop in cells)
							{
								if (row.hasOwnProperty(prop)) {
									row[prop].text = cells[prop];
								}
							}
						}

						return this;
					},


					/**
					 * Удаляет строки из репитера по условию
					 * @param {[object, number, array]} filter - условия для удаления
					 * @param {boolean} exclude - режим исключения
					 * @return {object} - возвращает обратно экземпляр репитера
					 *
					 * filter:
					 * - object - объект с условиями
					 * - number - индекс строки
					 * - array - список индексов
					 */
					
					remove: function (filter, exclude)
					{
						var exclude = exclude || false;
						this.model = !filter ? this.model : _getRows(this.model, filter, !exclude);

						return this;
					},


					/**
					 * Применяет новый список строк
					 * @param {array} model - список строк
					 * @return {object} - возвращает обратно экземпляр репитера
					 */
					
					applyRows: function (model)
					{
						this.model = model;

						return this;
					},


					/**
					 * Вставляет строки после указанного индекса
					 * @param {number} index - индекс строки
					 * @param {array} model - добавляемые строки
					 * @return {object} - возвращает обратно экземпляр репитера
					 */
					
					insertAfter: function (index, model)
					{
						var result = [],
							list = this.model,
							l = list.length;

						if (!model || !_isArray(model) || model.length == 0) return this;

						if (l == 0) {
							this.model = model;
							return this;
						} 

						index = index - 1;
						index = (index < 0) ? 0 : index;
						index = (index > l) ? l - 1 : index;

						for (var i = 0; i < l; i++)
						{
							if (index == i)
							{
								result.push(list[i]);

								for (var n = 0; n < model.length; n++)
								{
									result.push(model[n]);
								}

							} 

							else result.push(list[i]);
						}

						this.model = result;

						return this;
					},


					/**
					 * Вставляет строки перед указанным индексом
					 * @param {number} index - индекс строки
					 * @param {array} model - добавляемые строки
					 * @return {object} - возвращает обратно экземпляр репитера
					 */
					
					insertBefore: function (index, model)
					{
						var result = [],
							list = this.model,
							l = list.length;

						if (!model || !_isArray(model) || model.length == 0) return this;

						if (l == 0) {
							this.model = model;
							return this;
						} 

						index = index - 1;
						index = (index < 0) ? 0 : index;
						index = (index > l) ? l - 1 : index;

						for (var i = 0; i < l; i++)
						{
							if (index == i)
							{
								for (var n = 0; n < model.length; n++)
								{
									result.push(model[n]);
								}

								result.push(list[i]);
							} 

							else result.push(list[i]);
						}

						this.model = result;

						return this;
					},

					
					/**
					 * Добавляет строки в конец списка
					 * @param {array} model - список строк
					 * @return {object} - возвращает экземпляр репитера
					 */
					
					append: function (model)
					{
						if (!model || !_isArray(model) || model.length == 0) return this;
						this.model = this.model.concat(model);

						return this;
					},


					/**
					 * Добавляет список строк в начало
					 * @param {array} model - список строк
					 * @return {object} - возвращает экземпляр репитера
					 */
					
					preppend: function (model)
					{
						if (!model || !_isArray(model) || model.length == 0) return this;
						this.model = model.concat(this.model);

						return this;
					},


					/**
					 * Применяет новый фильтр
					 * @param {object} filter - объект фильтра
					 * @param {boolean} exclude - режим исключения (возвращает выборку или исключает ее из списка)
					 * @return {object} - возвращает обратно экземпляр репитера
					 *
					 * Чтобы фильтр начал действовать после добавления нужно вызвать метод render.
					 * Можно применять несколько фильтров одновременно (фильтры накладываются во время отрисовки). 
					 */
					
					applyFilter: function (filter, exclude)
					{
						if (!filter) return this;

						this.filters.push({ filter: filter, exclude: exclude || false });

						if (!this.filtered) {
							this.filtered = true;
						}

						return this;
					},


					/**
					 * Сбрасывает все фильтры
					 * @return {object} - возвращает обратно экземпляр репитера
					 */
					
					clearFilters: function ()
					{
						this.filters = [];
						this.filtered = false;

						return this;
					},


					/**
					 * Возвращает признак наличия колонки в репитере
					 * @param  {string} col - название колонки
					 * @return {boolean} - возвращает true или false
					 */
					
					hasColumn: function (col)
					{
						var columns = this.private.el.dataProps;

						for (var i = 0; i < columns.length; i++)
						{
							if (columns[i] == col) {
								return true;
							}
						}

						return false;
					},


					/**
					 * Возвращает массив значений из конкретной колонки
					 * @param  {string} col - название колонки
					 * @param {boolean} visible - возвращает только отображаемые строки
					 * @return {array} - возвращает массив значений
					 */
					
					getColumn: function (col, visible)
					{
						var columns = [],
							model = visible && this.filtered ? _applyFilters(this.filters, this.model) : this.model,
							row;

						for (var i = 0; i < model.length; i++)
						{
							row = model[i];
							row.hasOwnProperty(col) && columns.push(row[col].text);
						}

						return columns;
					},


					/**
					 * Суммирует числовые значения из колонок и возвращает результат
					 * @param  {string} col - название колонки
					 * @param {boolean} visible - суммирует только отображаемые строки
					 * @return {number} - возвращает сумму значений
					 */
					
					getSum: function (col, visible)
					{
						var columns = this.getColumn(col, visible),
							sum = 0, value;

						for (var i = 0; i < columns.length; i++)
						{
							value = columns[i];

							if (_isNumber(value)) {
								sum += Number(value);
							}
						}

						return sum;
					},


					/**
					 * Кол-во строк в репитере
					 * @param {boolean} visible - учитывает только отображаемые строки
					 * @return {number} - возвращает кол-во строк в репитере
					 */
					
					getLength: function (visible)
					{
						var model = visible && this.filtered ? _applyFilters(this.filters, this.model) : this.model;
						return model.length;
					},

					
					/**
					 * Возвращает найденный по имени виджет из конкретной строки репитера
					 * @param {[string, array]} name - имя виджета или список имен
					 * @param {[number, array]} rows - индекс или список индексов строк репитера
					 * @return {object} - возвращает объект виджета
					 */
					
					getWidget: function (name, rows)
					{
						var _ = this.private,
							model = this.model;

						if (model.length == 0) return null;

						if (rows) {
							rows = _getRowsId(_.id, rows);
						} else {
							rows = undefined;
						}

						return _findWidget(this.private.target, name, rows);
					}

				};



			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  PRIVATE REPEATER METHODS               │
			//│  └─────────────────────────────────────────┘
			//┘

				/**
				 * Возвращает идентификаторы строк репитера
				 * @param {number} id - идентификатор HTML представления репитера
				 * @param {[number, array]} rows - индекс или список индексов строк репитера
				 * @return {array} - возвращает идентификатор или список идентификаторов
				 */
				
				const _getRowsId = function (id, rows)
				{
					var children = _$('#' + id).children(),
						list, index, i;

					if (_isNumber(rows) && rows > 0 || rows <= children.length) {
						return children[rows].id;
					}

					if (_isArray(rows) && rows.length > 0)
					{
						list = [];

						for (i = 0; i < rows.length; i++)
						{
							index = rows[i];

							if (_isNumber(index) && index > 0 || index <= children.length) {
								list.push(children[index].id);
							}
						}

						if (list.length > 0) return list;
					}

					return undefined;
				};


				/**
				 * Фильтрует входящий список строк 
				 * @param  {array} model - список строк
				 * @param  {object} filter - фильтр
				 * @param  {boolean} exclude - режим исключения
				 * @return {array} - возвращает отфильтрованные строки
				 */
				
				const _filter = function (model, filter, exclude)
				{
					if (!filter || !filter.condition) return [];

					var condition = filter.condition,
					
						mode = filter.any || false,
						exclude = exclude || false,

						all, any, text, flag, cp,

						result = _$.grep(model, function( n, i )
						{
							any = exclude ? true : false;
							all = exclude ? false : true;

							for (var prop in condition)
							{
								if (n.hasOwnProperty(prop)) 
								{
									flag = false;
									text = n[prop].text;
									cp = condition[prop];

									// multi condition
									if (_isArray(cp))
									{
										for (var c in cp)
										{
											if (text == cp[c]) {
												flag = true;
											}
										}
									} 

									// single condition
									else 
									{
										if (text == cp) {
											flag = true;
										}
									}

									if (flag) {
										any = exclude ? false : true;
									} else {
										all = exclude ? true : false;
									}
								}
							}

							return !mode ? all : any;
						});

					return result;
				};


				/**
				 * Применяет список фильтров
				 * @param  {array} filters - список фильтров
				 * @param  {array} model - список строк
				 * @return {array} - возвращает отфильтрованный список
				 */
				
				const _applyFilters = function (filters, model)
				{
					var f, i = 0;

					for (i; i < filters.length; i++)
					{
						f = filters[i];
						model = _filter(model, f.filter, f.exclude);
					}

					return model;
				};


				/**
				 * Возвращает найденные с условием строки репитера
				 * @param  {array} model - список строк
				 * @param {[object, number, array]} filter - условия поиска
				 * @param {boolean} exclude - режим исключения
				 * @return {object} - возвращает отфильтрованные строки
				 *
				 * filter:
				 * - object - объект с условиями
				 * - number - индекс строки
				 * - array - список индексов
				 */
				
				const _getRows = function (model, filter, exclude)
				{
					var exclude = exclude || false,
						result, f;

					// если фильтр число
					if (_isNumber(filter))
					{		
						result = [];

						filter -= 1;

						for (var index in model)
						{
							if ((exclude && index != filter) || (!exclude && index == filter))
							{
								result.push(model[index]);
							}
						}

						return result;
					}

					// если фильтр массив чисел
					if (_isArray(filter))
					{
						if (filter.length < 1) return [];

						result = [];

						for (var index in model)
						{
							f = false;

							for (var i in filter)
							{
								if (index == filter[i] - 1)
								{
									f = true;
								}
							}

							if ((exclude && !f) || (!exclude && f))
							{
								result.push(model[index]);
							}
						}

						return result;
					}

					// если фильтр объект условий
					return _filter(model, filter, exclude);
				};



			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  PRIVATE AXURE REPEATER METHODS         │
			//│  └─────────────────────────────────────────┘
			//┘

				const _getRepeaterRows = _private.repeater.getAllItemIds;
				const _refreshRepeater = _private.repeater.refreshRepeater;
				const _addEditItems = _private.repeater.addEditItems;
				const _deleteItems = _private.repeater.deleteItems;
				const _addItem = _private.repeater.addItem;



			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  PRIVATE AXURE EX REPEATER METHODS      │
			//│  └─────────────────────────────────────────┘
			//┘

				const _getRepeater = function (repeaterId) 
				{
					var repeater;
					
					_a(function(obj) {
						return obj.type == 'repeater';
					}).each(function(obj, id) {
						if (id == repeaterId) {
							repeater = obj;
						}
					});

					return repeater;
				};

				const _clearRepeaterData = function(repeaterId)
				{
					var ids = _getRepeaterRows(repeaterId);
					_addEditItems(repeaterId, ids);
					_deleteItems(repeaterId, {}, 'marked', undefined);
				};


				const _addRepeaterData = function(repeaterId, rows)
				{
					var event = {
						targetElement: undefined,
						srcElement: undefined
					};

					var repeater = _getRepeater(repeaterId);
					var columns = repeater.dataProps;

					for (var i = 0, il = rows.length; i < il; i++)
					{
						var source = rows[i];
						var target = {};

						for (var j = 0, jl = columns.length; j < jl; j++)
						{
							var column = columns[j];
							var item = source[column];

							if (item === undefined) {
								item = {type: 'text', text: ''};
							} 

							else {
								item = _private.deepCopy(item);
							}

							target[column] = item;
						} 

						_addItem(repeaterId, target, event);
					}
				};



			//┐
			//│  ┌─────────────────────────────────────────┐
			//╠──┤  EXTEND                                 │
			//│  └─────────────────────────────────────────┘
			//┘

				_w.$m.addExtension('getRepeaterController', function()
				{
					var widget = this,
						single = widget.getElementIds().length == 1,
						instance = _w.$m.instance,
						controller;

					if (single)
					{
						this.each(function(el, id)
						{
							if (el.type == 'repeater')
							{
								if (!instance[id]) {
									controller = instance[id] = new RepeaterExtension(widget, el, id);
								} else {
									controller = instance[id];
								}
							}
						});
					} 

					return controller || null;
				});

		})();


		_init_ && _init_();
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
		 * и после отработки события "OnPageLoad" ("OnPageLoad" — событие из прототипа,
		 * которое срабатывает сразу после загрузки страницы целиком)
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

	})();



