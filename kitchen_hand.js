var winHeight = 800;
var winWidth = 600;

Crafty.init(winHeight, winWidth);
Crafty.background('lightgray');

var trayTile = {"height":12,
				"width":12,
				"data":[1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 4, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3],
				"x":0,
				"y":0,
				"tileheight":32,
				"tilewidth":32,
				"tiles":[	"sprTrayHG",
							"sprTrayHD",
							"sprTrayBD",
							"sprTrayBG",
							"sprTrayH",
							"sprTrayD",
							"sprTrayB",
							"sprTrayG",
							"sprTrayFill"
						]		
				};
				
var gastroFieldTile = {"height":1,
				"width":12,
				"data":[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
				"x":0,
				"y":320,
				"tileheight":32,
				"tilewidth":32,
				"tiles":[	"sprTrayHG",
							"sprTrayHD",
							"sprTrayBD",
							"sprTrayBG",
							"sprTrayH",
							"sprTrayD",
							"sprTrayB",
							"sprTrayG",
							"sprTrayFill"
						]		
				};

function drawTileset(data) {
	//draws a tileset with a JSON format
	var posData = 0;
	for (var y = data.y; y < (data.y+(data.height * data.tileheight)); y += data.tileheight) {
		for (var x = data.x; x < (data.x+(data.width * data.tilewidth)); x += data.tilewidth) {
			// console.log(data.tiles[data.data[posData]-1], x, y);
			Crafty.e("2D, Canvas, "+data.tiles[data.data[posData]-1])
				.attr({ x: x, y: y });
			posData++;
		}
	}
}

Crafty.audio.add("broken", "assets/broken.mp3"); // http://www.freesound.org/people/tezzza/sounds/21613/

Crafty.sprite(128, "assets/plate.png", {sprPlate:[0,0]});
Crafty.sprite(96, "assets/bowl.png", {sprBowl:[0,0]});
Crafty.sprite(128, "assets/plate_dirty.png", {sprPlateDirty:[0,0]});
Crafty.sprite(96, "assets/bowl_dirty.png", {sprBowlDirty:[0,0]});
Crafty.sprite("assets/plate_in_tray.png", {sprPlateInTray:[0,0,126,23]});
Crafty.sprite("assets/bowl_in_tray.png", {sprBowlInTray:[0,0,90,28]});
Crafty.sprite(32, "assets/tray.png", {
										sprTrayHG:[0,0],
										sprTrayHD:[1,0],
										sprTrayBD:[2,0],
										sprTrayBG:[3,0],
										sprTrayH:[4,0],
										sprTrayD:[5,0],
										sprTrayB:[6,0],
										sprTrayG:[7,0],
										sprTrayFill:[8,0]
									});
									
									
									
Crafty.sprite("assets/gastro.png", {sprGastro:[0,0,96,32]});
Crafty.sprite("assets/pad.png", {sprPad:[0,0,96,32]});

									
var trayContent = new Array(),
	platesArray = new Array();

// Scene where we load the tray
Crafty.scene("TrayLoad", function () {

	Crafty.c("plateSpawn", {
		init: function() {},
		pos: function(xPlate, yPlate) {
			var nbPlatesText = Crafty.e("2D, DOM, Text").attr({ x: xPlate, y: yPlate }).text(nbPlatesGlobal);
			var obj = Crafty.e("2D, Canvas, Mouse, sprPlateDirty")
				.attr({ x: xPlate, y: yPlate, z:1 })
				.bind('MouseDown', function (e) {
					// on MouseDown we create a new instance of the plate
					if (nbPlatesGlobal > 0) {
						nbPlatesGlobal--;
						nbPlatesText.text(nbPlatesGlobal);
						var posMouse = Crafty.DOM.translate(e.x, e.y);
						var safeX = 0, safeY = 0, firstDrag = true,
							origMouseX = 63, origMouseY = 0;
						var curPlate = Crafty.e("2D, Canvas, Mouse, Draggable, sprPlateInTray, Collision")
							.attr({ x: (posMouse.x-origMouseX), y: (posMouse.y-origMouseY), z:2, type:"plate" })
							.startDrag()
							.bind('Dragging', function (e) {
								var m = Crafty.DOM.translate(e.x, e.y);
								if (!this.hit('sprPlateInTray') && !this.hit('sprBowlInTray')) {
									safeX = (Math.round(m.x/32)*32)-origMouseX; safeY = (Math.round(m.y/32)*32)-origMouseY;
									this.attr({ x: (Math.round(m.x/32)*32)-origMouseX, y: (Math.round(m.y/32)*32)-origMouseY });
								} else {
									this.attr({ x: safeX, y: safeY });
								}
							})
							.bind('StopDrag', function (e) {
								if (firstDrag) {
									firstDrag = !firstDrag;
								}
								if (this.within(0,0,384,384)) {
									console.log("OK, on est dedans");
								} else {
									console.log("Y'a de la casse !");
									Crafty.audio.play("broken");
									this.destroy();
								}
							})
							// .collision([0,45], [45,0], [85,0], [128,45], [128,85], [85,128], [45,128], [0,85])
							.collision([0,0], [126,0], [126,23], [0,23])
						;
						platesArray.push(curPlate[0]);
					} else {
						console.log("Plus de plats !");
					}
				});
		},
	});

	Crafty.c("bowlSpawn", {
		init: function() {},
		pos: function(xBowl,yBowl) {
			var nbBowlsText = Crafty.e("2D, DOM, Text").attr({ x: xBowl, y: yBowl }).text(nbBowlsGlobal);
			var obj = Crafty.e("2D, Canvas, Mouse, sprBowlDirty")
				.attr({ x: xBowl, y: yBowl, z:1 })
				.bind('MouseDown', function (e) {
					if (nbBowlsGlobal > 0) {
						nbBowlsGlobal--;
						nbBowlsText.text(nbBowlsGlobal);
						var posMouse = Crafty.DOM.translate(e.x, e.y);
						var safeX = 0, safeY = 0, firstDrag = true,
							origMouseX = 45, origMouseY = 0;
						var curBowl = Crafty.e("2D, Canvas, Mouse, Draggable, sprBowlInTray, Collision")
							.attr({ x: (posMouse.x-origMouseX), y: (posMouse.y-origMouseY), z:2, type:"bowl" })
							.startDrag()
							.bind('Dragging', function (e) {
								var m = Crafty.DOM.translate(e.x, e.y);
								if (!this.hit('sprPlateInTray') && !this.hit('sprBowlInTray')) {
									safeX = (Math.round(m.x/32)*32)-origMouseX; safeY = (Math.round(m.y/32)*32)-origMouseY;
									this.attr({ x: (Math.round(m.x/32)*32)-origMouseX, y: (Math.round(m.y/32)*32)-origMouseY });
								} else {
									this.attr({ x: safeX, y: safeY });
								}
							})
							.bind('StopDrag', function (e) {
								if (firstDrag) {
									firstDrag = !firstDrag;
								}
								if (this.within(0,0,384,384)) {
									console.log("OK, on est dedans");
								} else {
									console.log("Y'a de la casse !");
									Crafty.audio.play("broken");
									this.destroy();
								}
							})
							// .collision([0,30], [30,0], [65,0], [96,30], [96,65], [65,96], [30,96], [0,65])
							.collision([0,0], [90,0], [90,28], [0,28])
						;
						platesArray.push(curBowl[0]);
					} else {
						console.log("Fini pour les bols");
					}
				});
		},
	});

	var nbPlatesGlobal = 4,
		nbBowlsGlobal = 4;

	Crafty.e("Mouse, HTML")
		.attr({x:520, y:20, w:100, h:100})
		.bind("Click", function (e) {
			// console.log(platesArray);
			platesArray.forEach(function (e) {
				if (typeof (Crafty(e).type) !== 'undefined') {
					var jsonObj = {
						"type": Crafty(e).type,
						"x": Crafty(e).x,
						"y": Crafty(e).y};
					console.log(jsonObj);
					trayContent.push(jsonObj);
				}
			});
			Crafty.scene("TrayUnload");
		})
		.replace("<button>Wash tray</button>");

	Crafty.e("plateSpawn").pos(450, 50);
	Crafty.e("bowlSpawn").pos(450, 250);
		
	drawTileset(trayTile);
});

// Scene where we unload the tray
Crafty.scene("TrayUnload", function () {

	Crafty.c("plateInTray", {
		init: function() {},
		pos: function(xPlate, yPlate) {
			var obj = Crafty.e("2D, Canvas, Mouse, sprPlateInTray")
				.attr({ x: xPlate, y: yPlate, z:1 })
				.bind('MouseDown', function (e) {
					this.destroy();
					var m = Crafty.DOM.translate(e.x, e.y);
					Crafty.e("2D, Canvas, Mouse, Draggable, sprPlate, Collision")
						.attr({ x: m.x - 64, y: m.y - 64, z:2 })
						.startDrag()
						.bind('MouseUp', function(e) {
							Crafty.audio.play("broken");
							this.destroy();
						})
						.onHit('sprPlate', function (e) {
							this.destroy();
							nbPlatesGlobal++;
							nbPlatesText.text(nbPlatesGlobal);
						})
						// .collision([0,45], [45,0], [85,0], [128,45], [128,85], [85,128], [45,128], [0,85])
						.collision([55,55], [75,55], [75,75], [55,75])
					;
				});
		},
	});
	
	Crafty.c("plateGoal", {
		init: function() {},
		pos: function(xPlate, yPlate) {
			var obj = Crafty.e("2D, Canvas, Mouse, sprPlate, Collision")
				.attr({ x: xPlate, y: yPlate, z:1 })
				.collision([55,55], [75,55], [75,75], [55,75])
			;
		},
	});

	Crafty.c("bowlInTray", {
		init: function() {},
		pos: function(xBowl, yBowl) {
			var obj = Crafty.e("2D, Canvas, Mouse, sprBowlInTray")
				.attr({ x: xBowl, y: yBowl, z:1 })
				.bind('MouseDown', function (e) {
					this.destroy();
					var m = Crafty.DOM.translate(e.x, e.y);
					Crafty.e("2D, Canvas, Mouse, Draggable, sprBowl, Collision")
						.attr({ x: m.x - 48, y: m.y - 48, z:2 })
						.startDrag()
						.bind('MouseUp', function(e) {
							Crafty.audio.play("broken");
							this.destroy();
						})
						.onHit('sprBowl', function (e) {
							this.destroy();
							nbBowlsGlobal++;
							nbBowlsText.text(nbBowlsGlobal);
						})
						// .collision([0,45], [45,0], [85,0], [128,45], [128,85], [85,128], [45,128], [0,85])
						.collision([40,40], [55,40], [55,55], [40,55])
					;
				});
		},
	});

	Crafty.c("bowlGoal", {
		init: function() {},
		pos: function(xBowl,yBowl) {
			var obj = Crafty.e("2D, Canvas, Mouse, sprBowl, Collision")
				.attr({ x: xBowl, y: yBowl, z:1 })
				.collision([40,40], [55,40], [55,55], [40,55])
			;
		},
	});

	var nbPlatesGlobal = 0,
		nbBowlsGlobal = 0;

	Crafty.e("Mouse, HTML")
		.attr({x:520, y:20, w:100, h:30})
		.bind("Click", function (e) {
			trayContent = [];
			Crafty.scene("TrayLoad");
		})
		.replace("<button>Load tray</button>");

	drawTileset(trayTile);
	
	trayContent.forEach(function (e) {
		switch (e.type) {
			case "plate":
				Crafty.e("plateInTray")
					.pos(e.x, e.y);
				break;
			case "bowl":
				Crafty.e("bowlInTray")
					.pos(e.x, e.y);
				break;
		}
	});
	
	var nbPlatesText = Crafty.e("2D, DOM, Text").attr({ x: 450, y: 50 }).text(nbPlatesGlobal);
	var nbBowlsText = Crafty.e("2D, DOM, Text").attr({ x: 450, y: 250 }).text(nbBowlsGlobal);
	Crafty.e("plateGoal").pos(450, 50);
	Crafty.e("bowlGoal").pos(450, 250);
});

Crafty.scene("GastroSort", function () {
	var bottomArray = new Array();
	for (var i = 0; i < 4; i++) {
		bottomArray[i] = new Array();
	}

	function redrawGastro(pos) {
		// we redraw the column at position pos
		// function called when there's been a modification in that column
		console.log(bottomArray[pos]);
		bottomArray[pos].shift();
		console.log(bottomArray[pos]);
		for (var i=0; i < bottomArray[pos].length; i++) {
			var oldY = Crafty(bottomArray[pos][i]).y;
			Crafty(bottomArray[pos][i]).attr({ x:Crafty(bottomArray[pos][i]).x, y:oldY+32 });
		}
	}
	
	Crafty.c("gastro", {
		_colorsArray: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
		init: function () {
			/* var xGastro, yGastro = 0;
			var stopMovement = false;
			var posGastroArray = Crafty.math.randomInt(0,3);
			xGastro = posGastroArray*96;
			Crafty.e("2D, Canvas, Tint, Collision, sprGastro")
				.attr({ x: xGastro, y: yGastro })
				.tint(Crafty.math.randomElementOfArray(this._colorsArray), 0.5)
				.bind('MoveGastro', function(e) {
					// when the event is triggered, we move the gastro
					if (!stopMovement) {
						if ((yGastro+32) < gastroFieldTile.y) {
							yGastro += 32;
							this.attr({ x: this.x, y: yGastro });
							if (this.hit("sprGastro")) {
								yGastro -= 32;
								this.attr({ x: this.x, y: yGastro });
								stopMovement = true;
								bottomArray[posGastroArray][((gastroFieldTile.y/gastroFieldTile.tileheight) - (yGastro/32) - 1)] = this[0];
								// console.log((gastroFieldTile.y/gastroFieldTile.tileheight) - (yGastro/32) - 1);
								// console.log(bottomArray);
							}
						} else {
							this.attr({ x: this.x, y: (gastroFieldTile.y - 32) });
							stopMovement = true;
							bottomArray[posGastroArray][0] = this[0];
							// console.log(posGastroArray, bottomArray[posGastroArray][0]);
							// console.log(bottomArray);
						}
					}
				})
			; */
		},
		gastro: function (xGastro, yGastro, color) { // color is a number between 0 and 3
			var setPosition = false; // position not set by default
			if (typeof xGastro == 'undefined') {
				var posGastroArray = Crafty.math.randomInt(0,3);
				var xGastro = posGastroArray*96;
			} else {
				var posGastroArray = Math.round(xGastro/96);
				setPosition = true; //we set the position, so we don't wnt to update this gastro movement
			}
			
			if (typeof yGastro == 'undefined') 
				var yGastro = 0;
			
			if (typeof color == 'undefined')
				var color = Crafty.math.randomInt(0,3);

			// this.currentColor = color;
			// console.log("in", this.currentColor);
				
			var stopMovement = false;
			Crafty.e("2D, Canvas, Tint, Collision, sprGastro")
				.attr({ x: xGastro, y: yGastro, currentColor: color })
				.tint(this._colorsArray[color], 0.5)
				.bind('MoveGastro', function(e) {
					// when the event is triggered, we move the gastro
					// we do nothing when the position was manually set
					if (!stopMovement && !setPosition) {
						if ((yGastro+32) < gastroFieldTile.y) {
							yGastro += 32;
							this.attr({ x: this.x, y: yGastro });
							if (this.hit("sprGastro")) {
								yGastro -= 32;
								this.attr({ x: this.x, y: yGastro });
								stopMovement = true;
								bottomArray[posGastroArray][((gastroFieldTile.y/gastroFieldTile.tileheight) - (yGastro/32) - 1)] = this[0];
							}
						} else {
							this.attr({ x: this.x, y: (gastroFieldTile.y - 32) });
							stopMovement = true;
							bottomArray[posGastroArray][0] = this[0];
						}
					}
				})
			;
		}
	});
	
	Crafty.c("pad", {
		init: function () {
			var isKeyDown = false;
			var padLoadId = -1; // the ID of the gastro on our pad
			Crafty.e("2D, Canvas, sprPad")
				.attr({ x:0, y:(gastroFieldTile.y + gastroFieldTile.tileheight) })
				.bind('KeyDown', function(e) {
					if (!isKeyDown) {
						if(e.key == Crafty.keys['LEFT_ARROW']) {
							if (this.x - 96 >= 0) {
								this.x -= 96;
								if (padLoadId != -1)
									Crafty(padLoadId).
										attr({x:this.x, y:(this.y-32) });
							}
							isKeyDown = true;
						} else if (e.key == Crafty.keys['RIGHT_ARROW']) {
							if (this.x + 96 <= (96*3)) {
								this.x += 96;
								if (padLoadId != -1)
									Crafty(padLoadId).
										attr({x:this.x, y:(this.y-32) });
							}
							isKeyDown = true;
						} else if (e.key == Crafty.keys['J']) {
							if (padLoadId != -1) {
								// we unload the gastro and empty the pad
								if (Crafty(padLoadId).currentColor == Math.round(this.x/96)) {
									// if we unload on the right color
									var n = Crafty(gastroCounter[Math.round(this.x/96)][0]).text();
									n++;
									Crafty(gastroCounter[Math.round(this.x/96)][0]).text(n);
								}
								Crafty(padLoadId).destroy();
								padLoadId = -1;
								this.y -= 32;
								isKeyDown = true;
							} else if (typeof bottomArray[Math.round(this.x/96)][0] != "undefined") {
								// empty pad, so we load the gastro
								padLoadId = bottomArray[Math.round(this.x/96)][0];
								this.y += 32;
								Crafty(padLoadId).
									attr({x:this.x, y:(this.y-32) });
								bottomArray[Math.round(this.x/96)][0] = -1;
								redrawGastro(Math.round(this.x/96));
								isKeyDown = true;
							}
						}
					}
				})
				.bind('KeyUp', function(e) {
					isKeyDown = false;
				})
			;
		}
	});
	
	// let's create a new event
	Crafty.addEvent(this, window.document, "MoveGastro", null);
	
	drawTileset(gastroFieldTile);
	Crafty.e("pad");
	var gastroCounter = new Array();
	for (var i=0; i<4; i++) {
		gastroCounter[i] = Crafty.e("2D, Text, DOM")
			.attr({ x:(i*96)+48, y:448 })
			.text(0);
			
		Crafty.e("gastro")
			.gastro((i*96),448,i);
	}
	
	// we trigger that new event every X ms, this orders to all the gastro to move at the same time
	// window.setInterval(function () {Crafty.trigger("MoveGastro");}, 500);
	// we add a new gastro every second
	// window.setInterval(function () {Crafty.e("gastro").gastro();}, 1000);
});

Crafty.scene("GastroSort");