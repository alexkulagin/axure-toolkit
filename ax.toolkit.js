



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
			_fix();
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




