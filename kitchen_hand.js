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

function drawTileset(data) {
	//draws a tileset with a JSON format
	var posData = 0;
	for (var y = data.y; y < (data.height * data.tileheight); y += data.tileheight) {
		for (var x = data.x; x < (data.width * data.tilewidth); x += data.tilewidth) {
			// console.log(x,y,data.tiles[data.data[posData]-1]);
			Crafty.e("2D, Canvas, "+data.tiles[data.data[posData]-1])
				.attr({ x: x, y: y });
			posData++;
		}
		// console.log("n");
	}
}

Crafty.sprite(128, "assets/plate.png", {sprPlate:[0,0]});
Crafty.sprite(96, "assets/bowl.png", {sprBowl:[0,0]});
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

Crafty.c("plateSpawn", {
	init: function() {
		var obj = Crafty.e("2D, Canvas, Mouse, sprPlate")
			.attr({ x: 450, y: 50, z:1 })
			.bind('MouseDown', function (e) {
				var posMouse = Crafty.DOM.translate(e.x, e.y);
				var spawnedPlate = Crafty.e("2D, Canvas, Mouse, Draggable, sprPlate, Collision")
					.attr({ x: (posMouse.x-64), y: (posMouse.y-64), z:2 })
					.startDrag()
					.collision([0,45], [45,0], [85,0], [128,45], [128,85], [85,128], [45,128], [0,85])
					.onHit('sprTrayFill', function (e) {
						console.log("Hit");
					});
			});
	},
});

Crafty.c("bowlSpawn", {
	init: function() {
		var obj = Crafty.e("2D, Canvas, Mouse, sprBowl")
			.attr({ x: 450, y: 250, z:1 })
			.bind('MouseDown', function (e) {
				var posMouse = Crafty.DOM.translate(e.x, e.y);
				var safeX = 0, safeY = 0, firstDrag = true;
				var spawnedBowl = Crafty.e("2D, Canvas, Mouse, Draggable, sprBowl, Collision")
					.attr({ x: (posMouse.x-48), y: (posMouse.y-48), z:2 })
					.startDrag()
					.bind('Dragging', function (e) {
						if(firstDrag) {
							if (!this.hit('sprTrayG') && !this.hit('sprTrayH')) {
								safeX = this.x; safeY = this.y;
							} else {
								// console.log("reset");
								this.attr({ x: safeX, y: safeY });
							}
						} else {
							if (!this.hit('sprTrayG') && !this.hit('sprTrayH') && !this.hit('sprTrayB') && !this.hit('sprTrayD')) {
								safeX = this.x; safeY = this.y;
							} else {
								// console.log("reset");
								this.attr({ x: safeX, y: safeY });
							}
						}
							// console.log("Drag",this.x, this.y);
					})
					.bind('StopDrag', function (e) {
						if (firstDrag) firstDrag = !firstDrag;
					})
					.collision([0,30], [30,0], [65,0], [96,30], [96,65], [65,96], [30,96], [0,65]);
			});
	},
});

Crafty.e("plateSpawn");
Crafty.e("bowlSpawn");
	
drawTileset(trayTile);