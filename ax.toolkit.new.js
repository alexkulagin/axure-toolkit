


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

					/*_applyFix();
					_applyExtends();
					_applyExternals();*/

					_initialize();

					console.log('Axure Toolkit', 'v' + _v, 'initialized and ready!');
				};




			//┐
			//│  ╔═══════════════════════════════╗
			//│  ║                               ║
			//╠──╢  TOOLKIT EVENT BROADCASTING   ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				/**
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
			//╠──╢  TOOLKIT INITIALIZATION       ║
			//│  ║                               ║
			//│  ╚═══════════════════════════════╝
			//┘	
	
				const _initialize = function ()
				{
					console.log('Axure Toolkit initialization...');
				};


				const _beforeOnLoad = function ()
				{
					console.log('before OnPageLoad');
				};


				const _afterOnLoad = function ()
				{
					console.log('after OnPageLoad!!!');
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