var canvas;
var tshirts = new Array(); //prototype: [{style:'x',color:'white',front:'a',back:'b',price:{tshirt:'12.95',frontPrint:'4.99',backPrint:'4.99',total:'22.47'}}]
var a;
var b;
var line1;
var line2;
var line3;
var line4;


var valueSelect = $("#tshirttype").val();
var backSelect = $('#tshirttype option:selected').attr('data-back');
$("#tshirttype").change(function () {
	valueSelect = $(this).val();
	backSelect = $('#tshirttype option:selected').attr('data-back');

	console.log('front : '+valueSelect);
	console.log('back : '+ backSelect);
});

$(document).ready(function () {
	//setup front side canvas 
	canvas = new fabric.Canvas('tcanvas', {
		hoverCursor: 'pointer',
		selection: true,
		selectionBorderColor: 'blue'
	});
	canvas.on({
		'object:moving': function (e) {
			e.target.opacity = 0.5;
		},
		'object:modified': function (e) {
			e.target.opacity = 1;
		},
		'object:selected': onObjectSelected,
		'selection:cleared': onSelectedCleared
	});
	// piggyback on `canvas.findTarget`, to fire "object:over" and "object:out" events
	canvas.findTarget = (function (originalFn) {
		return function () {
			var target = originalFn.apply(this, arguments);
			if (target) {
				if (this._hoveredTarget !== target) {
					canvas.fire('object:over', {
						target: target
					});
					if (this._hoveredTarget) {
						canvas.fire('object:out', {
							target: this._hoveredTarget
						});
					}
					this._hoveredTarget = target;
				}
			} else if (this._hoveredTarget) {
				canvas.fire('object:out', {
					target: this._hoveredTarget
				});
				this._hoveredTarget = null;
			}
			return target;
		};
	})(canvas.findTarget);

	canvas.on('object:over', function (e) {
		//e.target.setFill('red');
		//canvas.renderAll();
	});

	canvas.on('object:out', function (e) {
		//e.target.setFill('green');
		//canvas.renderAll();
	});

	document.getElementById('add-text').onclick = function () {
		var text = $("#text-string").val();
		var textSample = new fabric.Text(text, {
			left: fabric.util.getRandomInt(0, 200),
			top: fabric.util.getRandomInt(0, 400),
			fontFamily: 'helvetica',
			angle: 0,
			fill: '#000000',
			scaleX: 0.5,
			scaleY: 0.5,
			fontWeight: '',
			hasRotatingPoint: true
		});
		canvas.add(textSample);
		canvas.item(canvas.item.length - 1).hasRotatingPoint = true;
		$("#texteditor").css('display', 'block');
		$("#imageeditor").css('display', 'block');
	};
	$("#text-string").keyup(function () {
		var activeObject = canvas.getActiveObject();
		if (activeObject && activeObject.type === 'text') {
			activeObject.text = this.value;
			canvas.renderAll();
		}
	});
	$(".img-polaroid").click(function (e) {
		var el = e.target;
		/*temp code*/
		var offset = 50;
		var left = fabric.util.getRandomInt(0 + offset, 200 - offset);
		var top = fabric.util.getRandomInt(0 + offset, 400 - offset);
		var angle = fabric.util.getRandomInt(-20, 40);
		var width = fabric.util.getRandomInt(30, 50);
		var opacity = (function (min, max) {
			return Math.random() * (max - min) + min;
		})(0.5, 1);

		fabric.Image.fromURL(el.src, function (image) {
			image.set({
				left: left,
				top: top,
				angle: 0,
				padding: 10,
				cornersize: 10,
				hasRotatingPoint: true
			});
			//image.scale(getRandomNum(0.1, 0.25)).setCoords();
			canvas.add(image);
		});
	});
	document.getElementById('remove-selected').onclick = function () {
		var activeObject = canvas.getActiveObject(),
			activeGroup = canvas.getActiveGroup();
		if (activeObject) {
			canvas.remove(activeObject);
			$("#text-string").val("");
		} else if (activeGroup) {
			var objectsInGroup = activeGroup.getObjects();
			canvas.discardActiveGroup();
			objectsInGroup.forEach(function (object) {
				canvas.remove(object);
			});
		}
	};
	document.getElementById('bring-to-front').onclick = function () {
		var activeObject = canvas.getActiveObject(),
			activeGroup = canvas.getActiveGroup();
		if (activeObject) {
			activeObject.bringToFront();
		} else if (activeGroup) {
			var objectsInGroup = activeGroup.getObjects();
			canvas.discardActiveGroup();
			objectsInGroup.forEach(function (object) {
				object.bringToFront();
			});
		}
	};
	document.getElementById('send-to-back').onclick = function () {
		var activeObject = canvas.getActiveObject(),
			activeGroup = canvas.getActiveGroup();
		if (activeObject) {
			activeObject.sendToBack();
		} else if (activeGroup) {
			var objectsInGroup = activeGroup.getObjects();
			canvas.discardActiveGroup();
			objectsInGroup.forEach(function (object) {
				object.sendToBack();
			});
		}
	};
	$("#text-bold").click(function () {
		var activeObject = canvas.getActiveObject();
		if (activeObject && activeObject.type === 'text') {
			activeObject.fontWeight = (activeObject.fontWeight == 'bold' ? '' : 'bold');
			canvas.renderAll();
		}
	});
	$("#text-italic").click(function () {
		var activeObject = canvas.getActiveObject();
		if (activeObject && activeObject.type === 'text') {
			activeObject.fontStyle = (activeObject.fontStyle == 'italic' ? '' : 'italic');
			canvas.renderAll();
		}
	});
	$("#text-strike").click(function () {
		var activeObject = canvas.getActiveObject();
		if (activeObject && activeObject.type === 'text') {
			activeObject.textDecoration = (activeObject.textDecoration == 'line-through' ? '' : 'line-through');
			canvas.renderAll();
		}
	});
	$("#text-underline").click(function () {
		var activeObject = canvas.getActiveObject();
		if (activeObject && activeObject.type === 'text') {
			activeObject.textDecoration = (activeObject.textDecoration == 'underline' ? '' : 'underline');
			canvas.renderAll();
		}
	});
	$("#text-left").click(function () {
		var activeObject = canvas.getActiveObject();
		if (activeObject && activeObject.type === 'text') {
			activeObject.textAlign = 'left';
			canvas.renderAll();
		}
	});
	$("#text-center").click(function () {
		var activeObject = canvas.getActiveObject();
		if (activeObject && activeObject.type === 'text') {
			activeObject.textAlign = 'center';
			canvas.renderAll();
		}
	});
	$("#text-right").click(function () {
		var activeObject = canvas.getActiveObject();
		if (activeObject && activeObject.type === 'text') {
			activeObject.textAlign = 'right';
			canvas.renderAll();
		}
	});
	$("#font-family").change(function () {
		var activeObject = canvas.getActiveObject();
		if (activeObject && activeObject.type === 'text') {
			activeObject.fontFamily = this.value;
			canvas.renderAll();
		}
	});
	// $('#text-bgcolor').miniColors({
	// 	change: function (hex, rgb) {
	// 		var activeObject = canvas.getActiveObject();
	// 		if (activeObject && activeObject.type === 'text') {
	// 			activeObject.backgroundColor = this.value;
	// 			canvas.renderAll();
	// 		}
	// 	},
	// 	open: function (hex, rgb) {
	// 		//
	// 	},
	// 	close: function (hex, rgb) {
	// 		//
	// 	}
	// });

	// $('#text-fontcolor').miniColors({
	// 	change: function (hex, rgb) {
	// 		var activeObject = canvas.getActiveObject();
	// 		if (activeObject && activeObject.type === 'text') {
	// 			activeObject.fill = this.value;
	// 			canvas.renderAll();
	// 		}
	// 	},
	// 	open: function (hex, rgb) {
	// 		//
	// 	},
	// 	close: function (hex, rgb) {
	// 		//
	// 	}
	// });

	const pickr = Pickr.create({
		el: '#text-fontcolor',
		theme: 'classic', // or 'monolith', or 'nano'
	
		swatches: [
			'rgba(244, 67, 54, 1)',
			'rgba(233, 30, 99, 0.95)',
			'rgba(156, 39, 176, 0.9)',
			'rgba(103, 58, 183, 0.85)',
			'rgba(63, 81, 181, 0.8)',
			'rgba(33, 150, 243, 0.75)',
			'rgba(3, 169, 244, 0.7)',
			'rgba(0, 188, 212, 0.7)',
			'rgba(0, 150, 136, 0.75)',
			'rgba(76, 175, 80, 0.8)',
			'rgba(139, 195, 74, 0.85)',
			'rgba(205, 220, 57, 0.9)',
			'rgba(255, 235, 59, 0.95)',
			'rgba(255, 193, 7, 1)'
		],
	
		components: {
	
			// Main components
			preview: true,
			opacity: true,
			hue: true,
	
			// Input / output Options
			interaction: {
				hex: true,
				rgba: true,
				hsla: true,
				hsva: true,
				cmyk: true,
				input: true,
				clear: true,
				save: true
			}
		}
	});

	pickr.on('init', instance => {
		console.log('init', instance);
	}).on('hide', instance => {
		console.log('hide', instance);
	}).on('show', (color, instance) => {
		console.log('show', color, instance);
	}).on('save', (color, instance) => {
		console.log('save', color, instance);
	}).on('clear', instance => {
		console.log('clear', instance);
	}).on('change', (color, instance) => {
		console.log(color);
	}).on('changestop', instance => {
		console.log('changestop', instance);
	}).on('cancel', instance => {
		console.log('cancel', instance);
	}).on('swatchselect', (color, instance) => {
		console.log('swatchselect', color, instance);
	});

	// $('#text-strokecolor').miniColors({
	// 	change: function (hex, rgb) {
	// 		var activeObject = canvas.getActiveObject();
	// 		if (activeObject && activeObject.type === 'text') {
	// 			activeObject.strokeStyle = this.value;
	// 			canvas.renderAll();
	// 		}
	// 	},
	// 	open: function (hex, rgb) {
	// 		//
	// 	},
	// 	close: function (hex, rgb) {
	// 		//
	// 	}
	// });

	//canvas.add(new fabric.fabric.Object({hasBorders:true,hasControls:false,hasRotatingPoint:false,selectable:false,type:'rect'}));
	$("#drawingArea").hover(
		function () {
			canvas.add(line1);
			canvas.add(line2);
			canvas.add(line3);
			canvas.add(line4);
			canvas.renderAll();
		},
		function () {
			canvas.remove(line1);
			canvas.remove(line2);
			canvas.remove(line3);
			canvas.remove(line4);
			canvas.renderAll();
		}
	);

	$('.color-preview').click(function () {
		var color = $(this).css("background-color");
		document.getElementById("shirtDiv").style.backgroundColor = color;
	});


	$('#flipback').click(
		function () {
			if ($(this).attr("data-original-title") == "back") {
				$(this).attr('data-original-title', 'front');
				$("#tshirtFacing").attr("src", backSelect);
				a = JSON.stringify(canvas);
				canvas.clear();
				try {
					var json = JSON.parse(b);
					canvas.loadFromJSON(b);
				} catch (e) {}

			} else {
				$(this).attr('data-original-title', 'back');
				$("#tshirtFacing").attr("src", valueSelect);
				b = JSON.stringify(canvas);
				canvas.clear();
				try {
					var json = JSON.parse(a);
					canvas.loadFromJSON(a);
				} catch (e) {}
			}

		

			canvas.renderAll();
			setTimeout(function () {
				canvas.calcOffset();
			}, 200);
		});
	// $(".clearfix button,a").tooltip();
	line1 = new fabric.Line([0, 0, 200, 0], {
		"stroke": "#C50304",
		"strokeWidth": 1,
		hasBorders: false,
		hasControls: false,
		hasRotatingPoint: false,
		selectable: false
	});
	line2 = new fabric.Line([199, 0, 200, 399], {
		"stroke": "#000000",
		"strokeWidth": 1,
		hasBorders: false,
		hasControls: false,
		hasRotatingPoint: false,
		selectable: false
	});
	line3 = new fabric.Line([0, 0, 0, 400], {
		"stroke": "#000000",
		"strokeWidth": 1,
		hasBorders: false,
		hasControls: false,
		hasRotatingPoint: false,
		selectable: false
	});
	line4 = new fabric.Line([0, 400, 200, 399], {
		"stroke": "#000000",
		"strokeWidth": 1,
		hasBorders: false,
		hasControls: false,
		hasRotatingPoint: false,
		selectable: false
	});
}); //doc ready


function getRandomNum(min, max) {
	return Math.random() * (max - min) + min;
}

function onObjectSelected(e) {
	var selectedObject = e.target;
	$("#text-string").val("");
	selectedObject.hasRotatingPoint = true
	if (selectedObject && selectedObject.type === 'text') {
		//display text editor	    	
		$("#texteditor").css('display', 'block');
		$("#text-string").val(selectedObject.getText());
		// $('#text-fontcolor').miniColors('value', selectedObject.fill);
		// $('#text-strokecolor').miniColors('value', selectedObject.strokeStyle);
		$("#imageeditor").css('display', 'block');
	} else if (selectedObject && selectedObject.type === 'image') {
		//display image editor
		$("#texteditor").css('display', 'none');
		$("#imageeditor").css('display', 'block');
	}
}

function onSelectedCleared(e) {
	$("#texteditor").css('display', 'none');
	$("#text-string").val("");
	$("#imageeditor").css('display', 'none');
}

function setFont(font) {
	var activeObject = canvas.getActiveObject();
	if (activeObject && activeObject.type === 'text') {
		activeObject.fontFamily = font;
		canvas.renderAll();
	}
}

function removeWhite() {
	var activeObject = canvas.getActiveObject();
	if (activeObject && activeObject.type === 'image') {
		activeObject.filters[2] = new fabric.Image.filters.RemoveWhite({
			hreshold: 100,
			distance: 10
		}); //0-255, 0-255
		activeObject.applyFilters(canvas.renderAll.bind(canvas));
	}
}