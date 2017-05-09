/**
 * umenu.js
 * javascript support for UMenu extension
 * - gridview context-menu (bottom-menu is a style)
 * - gridview footer input form  
 */

console.log('umenu.js v1.0.3');

jQuery.fn.extend({
	// disables a button/menu item with style and click
	disable: function() {
		this.addClass('disabled');
		this.first().data('saved-click', this.get(0).onclick);
		this.get(0).onclick = null;
	},
	enable: function() {
		this.removeClass('disabled');
		this.get(0).onclick = this.data('saved-click');
	}
});

$(function() {
	// Disabled menu items
	$('li.disabled a, dt.disabled a, a.disabled').each(function() {
		$(this).click(function() {return false;});
	});
	
	// Drop-down menu
	$('ul.dropdown').each(function() {
		var $submenu = $(this);
		console.log('submenu: ',$submenu);
		$submenu.closest('li').hover(
			function(){
				console.log('hover: ',$submenu);
				if(!$(this).hasClass('disabled')) $submenu.show();
			}, 
			function(){$submenu.hide()}
		);
	});
	
	// Updates context-menu 'group' items on selection change
	var $grid = $('.grid.context-menu');
	$('input[name="selection_all"], input[name="selection[]"]', $grid).change(function(){
		var keys = $grid.yiiGridView('getSelectedRows');
		var $groupitems = $grid.parent().parent().find('.context-menu li.group');
		if(keys.length) $groupitems.show(); else $groupitems.hide();
	});
	
	// Group action on group button
	$('.context-menu li.group .menuitem').click(function() {
		console.log('group action');
		
		var keys = $grid.yiiGridView('getSelectedRows');
		var $form = $('form', $(this).closest('.context-menu').parent().parent().parent());
		
		console.log('keys: '+keys + ' form:', $form);
		$form.get(0).action = $form.get(0).action = $(this).data('action');	
		$form.submit();
	});
	
	// Open input row (gridview footer)
	$('.footer-form-show').click(function() {
		console.log('show footer form');
		var $button = $(this);
		$('form .table tfoot tr.input-add', $button.closest('.context-menu').parent().parent()).first().removeClass('hidden');
		// Enable all inputs in footer-form 
		
		$button.disable();
	});
	
	// Close input row (gridview footer)
	$('.footer-form-close').click(function() {
		$(this).closest('tr').addClass('hidden');
		var $button = $('.footer-form-show', $(this).closest('form').parent());
		$button.enable();
		// Disable all inputs to ensure to pass validation on footer-form 

	});
});