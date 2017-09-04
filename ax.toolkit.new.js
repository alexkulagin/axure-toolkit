


!(function (win, doc)
{
	'use strict';

	const _w = win,
		  _d = doc,
		  _v = '2.0.0';




	//┐
	//│  ╔═══════════════════════════════╗
	//│  ║                               ║
	//╠──╢  JS TOOLKIT                   ║
	//│  ║                               ║
	//│  ╚═══════════════════════════════╝
	//┘	
	
		const _activation = function (open)
		{
			const _o = open;
			console.log('Axure Toolkit', 'v' + _v, 'initialized and ready!');
		};




	//┐
	//│  ╔═══════════════════════════════╗
	//│  ║                               ║
	//╠──╢  ACTIVATOR                    ║
	//│  ║                               ║
	//│  ╚═══════════════════════════════╝
	//┘	
	
		!(function (w, d, a)
		{
			const _w = w,
				  _d = d,
				  _o = _w.open,
				  _a = a;


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
			_d.addEventListener("DOMContentLoaded", _beforePageOnLoad);


			const _beforePageOnLoad = function ()
			{
				console.log('Before OnPageLoad');
				_a(_o);
			};

			const _afterPageOnLoad =  function ()
			{
				console.log('After OnPageLoad');
			};

		})(_w, _d, _activation);




})(window, document);