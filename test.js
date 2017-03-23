const Mahjongg = require('./dist/mahjongg.js');

const [s1, s2, s3, s4, s5, s6, s7, s8, s9] = Mahjongg.bambooSuits;
const [m1, m2, m3, m4, m5, m6, m7, m8, m9] = Mahjongg.characterSuits;
const [p1, p2, p3, p4, p5, p6, p7, p8, p9] = Mahjongg.circleSuits;
const [east, south, west, north, haku, hatsu, chun] = Mahjongg.honorTiles;
const {EAST, NORTH, WEST, SOUTH, Table} = Mahjongg;

const Hand = Mahjongg.Hand;

const testHands = [
    [s1, s1, s1, s3, s3, s3, m5, m5, m5, p3, p4, p5, p9, p9],
    [m2, m2, m5, m5, m5, s6, s7, s8, p2, p3, p4, p7, p7, p7],
    [m3, m3, m4, m4, m5, m5, p2, p2, p3, p3, p4, s9, s9, p4],
    [m1, m1, m4, m5, m6, m6, m7, m8, east, east, east, hatsu, hatsu, hatsu],
    [m1, m2, m3, m4, m5, m6, m7, m8, m9, hatsu, hatsu, hatsu, north, north],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m1],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m2],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m3],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m4],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m5],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m6],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m7],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m8],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m9],
    [s3, s3, s3, s1, s1, s1, m5, m5, m5, p7, p7, p7, p9, p9],
    [m1, m1, m1, m2, m2, m2, m3, m3, m3, s7, s8, s9, p9, p9],
    [m6, m7, m8, s6, s7, s8, p6, p7, p8, p6, p7, p8, south, south],
].map(item => new Hand(item));

testHands.push(Mahjongg.createHandFromString('5m 5m 8m 8m 8m 西 西 [pong: 2s +2s 2s] [pong: 1m +1m 1m] 5m'));

testHands.forEach(testHand => {
    console.log(showYaku(testHand));
});

function showYaku(hand) {
    const yakus = Mahjongg.getYaku(hand);
    const res = [];
    for (let i = 0, _i = yakus.length; i < _i; i++) {
        res.push([]);
        for (const [key, value] of Mahjongg.translateToChineseCharacter) {
            if (yakus[i][key]) res[i].push(value);
        }
    }
    return res;
}
const table = new Table([
    // EAST
    p7,s8,p3,haku,m7,north,p6,s9,haku,s2,north,p9,s9,hatsu,p6,m3,p3,
    p9,p8,p1,p8,s9,hatsu,m1,s2,p2,s4,s1,west,m5,s3,m4,east,p1,
    // NORTH
    west,s5,chun,p5,m2,p9,p9,m5,east,m3,m8,p2,s1,s8,p7,east,p6,
    m6,p4,north,m1,p3,p5,chun,m8,s6,m3,p6,s2,s5,m6,m5,p1,p7,
    // WEST
    s4,west,m4,m7,m6,p3,m2,s3,s1,s5,s1,m6,chun,m5,p7,p8,s4,
    s7,m8,p4,m9,s7,m2,east,s7,p5,south,p2,s4,s2,south,s6,south,m2,
    // SOUTH
    west,s3,haku,s6,m9,s6,p4,m7,m8,m4,m1,s8,north,hatsu,south,hatsu,s9,
    p5,m9,s8,m3,p4,chun,m9,m4,p1,p8,p2,m7,s7,m1,s3,haku, s5
]);
table.start(4);
console.log(table.getWall(NORTH).map(item => item.toString()));