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
							"sprTrayHColl",
							"sprTrayDColl",
							"sprTrayBColl",
							"sprTrayGColl",
							"sprTrayFill"
						]		
				};

function drawTileset(data) {
	//draws a tileset with a JSON format
	var posData = 0;
	for (var y = data.y; y < (data.height * data.tileheight); y += data.tileheight) {
		for (var x = data.x; x < (data.width * data.tilewidth); x += data.tilewidth) {
			// console.log(x,y,data.tiles[data.data[posData]-1]);
			if (data.tiles[data.data[posData]-1] == "sprTrayHColl" ||
				data.tiles[data.data[posData]-1] == "sprTrayDColl" ||
				data.tiles[data.data[posData]-1] == "sprTrayBColl" ||
				data.tiles[data.data[posData]-1] == "sprTrayGColl") {
				Crafty.e(data.tiles[data.data[posData]-1])
					.pos(x,y);
			} else {
				Crafty.e("2D, Canvas, "+data.tiles[data.data[posData]-1])
					.attr({ x: x, y: y });
			}
			posData++;
		}
		// console.log("n");
	}
}

Crafty.audio.add("broken", "assets/broken.mp3");

Crafty.sprite(128, "assets/plate.png", {sprPlate:[0,0]});
Crafty.sprite(96, "assets/bowl.png", {sprBowl:[0,0]});
Crafty.sprite("assets/plate_in_tray.png", {sprPlateInTray:[0,0,128,32]});
Crafty.sprite(1, "assets/bowl_in_tray.png", {sprBowlInTray:[0,0]});
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

var MovingSprite;
var MoveSprite = false;


Crafty.c("sprTrayHColl", {
	init: function() {},
	pos: function(locX,locY) {		
		var o = Crafty.e("2D, Canvas, sprTrayH, Collision")
			.attr({ x: locX, y: locY })
			.collision([0,0], [32,0], [32,6], [0,6]);
	}
});

Crafty.c("sprTrayDColl", {
	init: function() {},
	pos: function(locX,locY) {		
		var o = Crafty.e("2D, Canvas, sprTrayD, Collision")
			.attr({ x: locX, y: locY })
			.collision([26,0], [32,0], [32,32], [26,32]);
	}
});

Crafty.c("sprTrayBColl", {
	init: function() {},
	pos: function(locX,locY) {		
		var o = Crafty.e("2D, Canvas, sprTrayB, Collision")
			.attr({ x: locX, y: locY })
			.collision([0,26], [32,26], [32,32], [0,32]);
	}
});

Crafty.c("sprTrayGColl", {
	init: function() {},
	pos: function(locX,locY) {		
		var o = Crafty.e("2D, Canvas, sprTrayG, Collision")
			.attr({ x: locX, y: locY })
			.collision([0,0], [6,0], [6,32], [0,32]);
	}
});

Crafty.c("plateSpawn", {
	init: function() {},
	pos: function(xPlate, yPlate) {
		var nbPlatesText = Crafty.e("2D, DOM, Text").attr({ x: xPlate, y: yPlate }).text(nbPlatesGlobal);
		var obj = Crafty.e("2D, Canvas, Mouse, sprPlate")
			.attr({ x: xPlate, y: yPlate, z:1 })
			.bind('MouseDown', function (e) {
				if (nbPlatesGlobal > 0) {
					nbPlatesGlobal--;
					nbPlatesText.text(nbPlatesGlobal);
					var posMouse = Crafty.DOM.translate(e.x, e.y);
					var safeX = 0, safeY = 0, firstDrag = true;
					var spawnedPlate = Crafty.e("2D, Canvas, Mouse, Draggable, sprPlate, Collision")
						.attr({ x: (posMouse.x-64), y: (posMouse.y-64), z:2 })
						.startDrag()
						.bind('Dragging', function (e) {
							if(firstDrag) {
								if (!this.hit('sprTrayG') && !this.hit('sprTrayH') && !this.hit('sprPlate') && !this.hit('sprBowl')) {
									safeX = this.x; safeY = this.y;
								} else {
									// console.log("reset");
									this.attr({ x: safeX, y: safeY });
								}
							} else {
								if (!this.hit('sprTrayG') && !this.hit('sprTrayH') && !this.hit('sprTrayB') && !this.hit('sprTrayD') && !this.hit('sprPlate') && !this.hit('sprBowl')) {
									safeX = this.x; safeY = this.y;
								} else {
									// console.log("reset");
									this.attr({ x: safeX, y: safeY });
								}
							}
								// console.log("Drag",this.x, this.y);
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
						.collision([0,0], [128,0], [128,32], [0,32])
					;
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
		var obj = Crafty.e("2D, Canvas, Mouse, sprBowl")
			.attr({ x: xBowl, y: yBowl, z:1 })
			.bind('MouseDown', function (e) {
				if (nbBowlsGlobal > 0) {
					nbBowlsGlobal--;
					nbBowlsText.text(nbBowlsGlobal);
					var posMouse = Crafty.DOM.translate(e.x, e.y);
					var safeX = 0, safeY = 0, firstDrag = true;
					var spawnedBowl = Crafty.e("2D, Canvas, Mouse, Draggable, sprBowl, Collision")
						.attr({ x: (posMouse.x-48), y: (posMouse.y-48), z:2 })
						.startDrag()
						.bind('Dragging', function (e) {
							if(firstDrag) {
								if (!this.hit('sprTrayG') && !this.hit('sprTrayH') && !this.hit('sprBowl') && !this.hit('sprPlate')) {
									safeX = this.x; safeY = this.y;
								} else {
									// console.log("reset");
									this.attr({ x: safeX, y: safeY });
								}
							} else {
								if (!this.hit('sprTrayG') && !this.hit('sprTrayH') && !this.hit('sprTrayB') && !this.hit('sprTrayD') && !this.hit('sprBowl') && !this.hit('sprPlate')) {
									safeX = this.x; safeY = this.y;
								} else {
									// console.log("reset");
									this.attr({ x: safeX, y: safeY });
								}
							}
								// console.log("Drag",this.x, this.y);
						})
						.bind('StopDrag', function (e) {
							if (firstDrag) {
								firstDrag = !firstDrag;
								if (this.within(0,0,384,384)) {
									console.log("OK, on est dedans");
								} else {
									console.log("Y'a de la casse !");
									Crafty.audio.play("broken");
									this.destroy();
								}
							}
						})
						// .collision([0,30], [30,0], [65,0], [96,30], [96,65], [65,96], [30,96], [0,65])
						.collision([0,0], [96,0], [96,32], [0,32])
					;
				} else {
					console.log("Fini pour les bols");
				}
			});
	},
});

var nbPlatesGlobal = 4,
	nbBowlsGlobal = 4;


Crafty.e("plateSpawn").pos(450, 50);
Crafty.e("bowlSpawn").pos(450, 250);
	
drawTileset(trayTile);