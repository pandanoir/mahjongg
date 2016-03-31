var tiles = require('./tiles.js');
var yaku = require('./yaku.js');

var bambooSuits = tiles.bambooSuits;
var circleSuits = tiles.circleSuits;
var characterSuits = tiles.characterSuits;
var honorTiles = tiles.honorTiles;
var Hand = tiles.Hand;

// console.log(yaku.isAllSimples(new Hand([
//     bambooSuits[2], bambooSuits[3], bambooSuits[4],
//     bambooSuits[3], bambooSuits[4], bambooSuits[5],
//     circleSuits[5], circleSuits[6], circleSuits[7],
//     characterSuits[6], characterSuits[7], characterSuits[8],
//     bambooSuits[6], bambooSuits[6]
// ])));
// console.log(!yaku.isAllSimples(new Hand([
//     bambooSuits[3], bambooSuits[3], bambooSuits[4],
//     bambooSuits[3], bambooSuits[4], bambooSuits[5],
//     circleSuits[5], circleSuits[6], circleSuits[7],
//     characterSuits[6], characterSuits[7], characterSuits[8],
//     bambooSuits[6], bambooSuits[6]
// ])));



// console.log(JSON.stringify(new Hand([
//     bambooSuits[2], bambooSuits[3], bambooSuits[4],
//     bambooSuits[2], bambooSuits[3], bambooSuits[4],
//     bambooSuits[2], bambooSuits[3], bambooSuits[4],
//     characterSuits[2], characterSuits[2], characterSuits[2],
//     bambooSuits[6], bambooSuits[6]
// ]).getPairs(), null, '  '));
