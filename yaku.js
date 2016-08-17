'use strict';
if (!emptyTile) {
    var emptyTile = require('./tiles.js').emptyTile;
}
function getValidHands(hand) {
    // only return the pattern which given hand can consist. each pattern has 4 melds(面子) and an eye(雀頭).
    if (hand.hand.length === 13) return [];
    let res = [];
    const pairs = getPairs(hand.hand);
    const calledGroup = hand.pong.map(item => {return {type: 'calledPong', tiles: item.tiles};})
        .concat(hand.chow.map(item => {return {type: 'calledChow', tiles: item.tiles};}))
        .concat(hand.meldedKong) // pattern doesn't return item whose type is meldedKong
        .concat(hand.concealedKong);

    for (const pair of pairs) {
        res = res.concat(
            pattern(pair[1]).map(item => item.concat(calledGroup).concat({type: 'eye', tiles: pair[0]}))
        );
    }
    return res;
}
function getPairs(tiles) {
    const res = [];
    for (let i = 0, _i = tiles.length, before = emptyTile; i < _i; i++) {
        if (before.equals(tiles[i])) {
            res.push([[tiles[i], tiles[i]], tiles.slice(0, i - 1).concat(tiles.slice(i + 1))]);
            while(i < _i && before.equals(tiles[i])) i++;
        }
        before = tiles[i];
    }
    return res;
}
function pattern(tiles) {
    let res = [];

    if (tiles.length === 0) return [[]];

    // pong
    if (tiles[0].equals(tiles[1]) && tiles[1].equals(tiles[2])) {
        res = res.concat(
            pattern(tiles.slice(3)).map(function(item) {
                // pong means '刻子'
                return [{type: 'pong', tiles: tiles.slice(0, 3)}].concat(item);
            })
        );
    }

    // chow
    if (tiles[0].kind === 'bamboo' || tiles[0].kind === 'character' || tiles[0].kind === 'circle') {
        let i = 0, _i = tiles.length, n = Number(tiles[0].string);
        while (i < _i && !(tiles[0].kind === tiles[i].kind && n + 1 === Number(tiles[i].string))) {
            i = i + 1 | 0;
        }
        let j = i + 1, _j = _i;
        while (j < _j && !(tiles[0].kind === tiles[j].kind && n + 2 === Number(tiles[j].string))) {
            j = j + 1 | 0;
        }
        if (i !== _i && j !== _j && i !== 0 && j !== 0) {
            res = res.concat(
                pattern(tiles.slice(1, i)
                    .concat(tiles.slice(i + 1, j))
                    .concat(tiles.slice(j + 1))
                ).map(function(item) {
                    return [{type: 'chow', tiles: [tiles[0], tiles[i], tiles[j]]}].concat(item);
                })
            );
        }
    }

    return res;
}
function isThreeColour(firstTiles) {
    if (firstTiles.length < 3) return false;
    if (firstTiles.length === 3) {
        if (firstTiles.map(function(item) {return item.type}).sort().join(' ') === 'bamboo character circle') {
            // each tiles is different kind.
            if (/([1-9])\1\1/.test(firstTiles.map(function(item) {return item.string}).join(''))) {
                // all tile's number is same.
                return true;
            }
        }
    } else {
        // firstTiles.length === 4
        for (let i = 0, _i = firstTiles.length; i < _i; i++) {
            let _firstTiles = firstTiles.slice(0, i).concat(firstTiles.slice(i + 1));
            if (_firstTiles.map(item => item.type).sort().join(' ') === 'bamboo character circle') {
                if (/([1-9])\1\1/.test(_firstTiles.map(item => item.string).join(''))) {
                    return true;
                }
            }
        }
    }
    return false;
}
function isConcealed(hands) {
    for (const hand of hands) {
        if (hand.type === 'calledChow' || hand.type === 'calledPong' || hand.type === 'meldedKong') {
            return false;
        }
    }
    return true;
}
function getYaku(hand) {
    if (judgeFunctions.get('isThirteenOrphans')(hand)) {
        const yakuList = createYakuList();
        yakuList.hand = hand;
        yakuList.isThirteenOrphans = true;
        yakuList.isKokushi = true;
        yakuList.isKokushimuso = true;
        return [yakuList];
    }
    hand = hand.sort();
    const hands = getValidHands(hand);
    const isSevenPairs = judgeFunctions.get('isSevenPairs')(hand);
    let res = [];
    const translateToJapanese = new Map([
        ['isTanyao', 'isAllSimples'],
        ['isTanyaochu', 'isAllSimples'],
        ['isIpeiko', 'isOneSetOfIdenticalSequences'],
        ['isRyanpeiko', 'isTwoSetOfIdenticalSequences'],
        ['isYakuhai', 'isHonorTiles'],
        ['isSanshoku', 'isThreeColourStraight'],
        ['isSanshokudojun', 'isThreeColourStraight'],
        ['isHonchantaiyaochu', 'isTerminalOrHonorInEachSet'],
        ['isChanta', 'isTerminalOrHonorInEachSet'],
        ['isIttsu', 'isStraight'],
        ['isIkkitsukan', 'isStraight'],
        ['isSanshokudoko', 'isThreeColourTriplets'],
        ['isSananko', 'isThreeClosedTriplets'],
        ['isTitoitsu', 'isSevenPairs'],
        ['isKokushi', 'isThirteenOrphans'],
        ['isKokushimuso', 'isThirteenOrphans']
    ]);
    const higherYaku = [
        ['isTwoSetOfIdenticalSequences', 'isOneSetOfIdenticalSequences'],
        ['is']
    ];

    if (isSevenPairs && hands.length === 0) {
        // seven pairs can be Ryanpeiko(two set of identical sequences)
        const yakuList = createYakuList();
        yakuList.hand = hand;
        yakuList.isSevenPairs = true;
        yakuList.isTitoitsu = true;
        return [yakuList];
    }
    for (const _hand of hands) {
        // hand cannot be seven pairs.
        const yakuList = createYakuList();
        yakuList.hand = _hand;
        for (const [key, value] of judgeFunctions) {
            if (key === 'isThirteenOrphans' || key === 'isSevenPairs') continue;
            if (value(_hand)) {
                yakuList[key] = true;
            }
        }
        res.push(yakuList);
    }
    for (let i = 0, _i = res.length; i < _i; i++) {
        for (const [key, value] of translateToJapanese) {
            res[i][key] = res[i][value];
        }
    }
    function createYakuList() {
        const yakuList = {hand: []};
        for (const judgeFunctionsKey of judgeFunctions.keys()) {
            yakuList[judgeFunctionsKey] = false;
        }
        for (const [key, value] of translateToJapanese) {
            yakuList[key] = false;
        }
        return yakuList;
    }
    return res;
}
function createHandFromString(string) {
    const hand = new Hand([]);
    const suitsPattern = /(\+)?(イー|リャン|サン|スー|ウー|ロー|チー|パー|キュー)(ピン|ソー|マン|ワン)(R?) ?/g;
    const honorPattern = /(\+)?([東南西北白發中]) ?/g;
    const numberDic = new Map([
        ['イー', 1],
        ['リャン', 2],
        ['サン', 3],
        ['スー', 4],
        ['ウー', 5],
        ['ロー', 6],
        ['チー', 7],
        ['パー', 8],
        ['キュー', 9]
    ]);

    string = string.replace(/\[(pong|chow|meldedKong|concealedKong):(.+?)\]/g, (_, type, tiles) => {
        const combination = {
            type: type,
            tiles: []
        };
        tiles = tiles.replace(suitsPattern, (_, isRotated, _num, kind, isDora) => {
            combination.tiles.push(createSuits(isRotated, _num, kind, isDora));
            return '';
        });
        tiles = tiles.replace(honorPattern, (_, isRotated, string) => {
            combination.tiles.push(createHonor(isRotated, string));
            return '';
        });
        hand[type].push(combination);
        return '';
    });

    string = string.replace(suitsPattern, (_, isRotated, _num, kind, isDora) => {
        hand.hand.push(createSuits(isRotated, _num, kind, isDora));
        return '';
    });
    string = string.replace(honorPattern, (_, isRotated, string) => {
        hand.hand.push(createHonor(isRotated, string));
        return '';
    });
    function createSuits(isRotated, _num, kind, isDora) {
        let tile;
        const num = numberDic.get(_num);

        if (kind === 'ソー') tile = bambooSuits[num];
        if (kind === 'マン' || kind === 'ワン') tile = characterSuits[num];
        if (kind === 'ピン') tile = circleSuits[num];

        if (isDora === 'R') tile = new Tile(tile.kind, tile.string, true);

        if (isRotated === '+') tile.isRotated = true;
        return tile;
    }
    function createHonor(isRotated, string) {
        const tile = honorTiles['東南西北白發中'.indexOf(string)];
        if (isRotated === '+') tile.isRotated = true;

        return tile;
    }
    return hand;
}
const judgeFunctions = new Map([
    ['isAllSimples', hands => {
        // 断么九
        // hand is one of the values which getValidHands() returns.
        const isSuit = /bamboo|c(?:haracter|ircle)/;
        for (const hand of hands) {
            for (const tile of hand.tiles) {
                if (!isSuit.test(tile.kind) || tile.string === '1' || tile.string === '9') {
                    return false;
                }
            }
        }
        return true;
    }],
    ['isNoPointsHand', hand => {
        // 平和
    }],
    ['isOneSetOfIdenticalSequences', hands => {
        // 一盃口
        if (isConcealed(hands) === false) return false;
        const firstTiles = [];
        for (const hand of hands) {
            if (hand.type === 'chow') {
                for (const firstTile of firstTiles) {
                    if (firstTile.equals(hand.tiles[0])) return true;
                }
                firstTiles.push(hand.tiles[0]);
            }
        }
        return false;
    }],
    ['isTwoSetOfIdenticalSequences', hands => {
        // 二盃口
        if (isConcealed(hands) === false) return false;
        const firstTiles = hands.filter(hand => hand.type === 'chow').map(hand => hand.tiles[0]);
        return firstTiles.length === 4 && firstTiles[0].equals(firstTiles[1]) && firstTiles[2].equals(firstTiles[3]);
    }],
    ['isHonorTiles', hands => {
        // 役牌
        const isHonor = /白發中/;
        for (const hand of hands) {
            if (hand.type === 'pong' || hand.type === 'calledPong') {
                if (isHonor.test(hand.tiles[0])) {
                    return true;
                }
            }
        }
        return false;
    }],
    ['isThreeColourStraight', hands => {
        // 三色同順
        const firstTiles = [];
        for (const hand of hands) {
            if (hand.type === 'chow' || hand.type === 'calledChow') firstTiles.push(hand.tiles[0]);
        }
        return isThreeColour(firstTiles);
    }],
    ['isTerminalOrHonorInEachSet', hands => {
        // 混全帯么九
        const isYaochu = /[19東南西北白發中]/;
        for (const hand of hands) {
            let hasYaochu = false;
            for (const tile of hand.tiles) {
                if (isYaochu.test(tile.string)) hasYaochu = true;
            }
            if (!hasYaochu) return false;
        }
        return true;
    }],
    ['isStraight', hands => {
        // 一気通貫
        const firstTiles = [];
        for (const hand of hands) {
            if (hand.type === 'chow' || hand.type === 'calledChow') firstTiles.push(hand.tiles[0]);
        }
        if (firstTiles.length < 3) return false;
        if (firstTiles.length === 3) {
            if (!(firstTiles[0].type === firstTiles[1].type && firstTiles[1].type === firstTiles[2].type)) {
                return false;
            }
            if (firstTiles[0].string === '1' && firstTiles[1].string === '4' && firstTiles[2].string === '7') return true;
            return false;
        } else if (firstTiles.length === 4) {
            if (!(firstTiles[0].type === firstTiles[1].type && firstTiles[1].type === firstTiles[2].type) &&
                !(firstTiles[1].type === firstTiles[2].type && firstTiles[2].type === firstTiles[3].type)) {
                return false;
            }
            if (firstTiles[0].string === '1' && firstTiles[1].string === '4' && firstTiles[2].string === '7' ||
                firstTiles[1].string === '1' && firstTiles[2].string === '4' && firstTiles[3].string === '7') return true;
            return false;
        }
    }],
    ['isThreeColourTriplets', hands => {
        // 三色同刻
        const firstTiles = [];
        for (const hand of hands) {
            if (hand.type === 'pong' || hand.type === 'calledPong') firstTiles.push(hand.tiles[0]);
        }
        return isThreeColour(firstTiles);
    }],
    ['isAllTripletHand', hands => {
        // 対々和
        return hands.every(hand => hand.type !== 'chow' && hand.type !== 'calledChow');
    }],
    ['isThreeClosedTriplets', hands => {
        // 三暗刻
        return hands.filter(hand => hand.type === 'pong' || hand.type === 'concealedKong').length === 3;
    }],
    ['isSevenPairs', hand => {
        // 七対子
        for (let i = 0; i < 7; i++) {
            if (!hand.hand[2 * i].equals(hand.hand[2 * i + 1])) {
                return false;
            }
        }
        return true;
    }],
    ['isThirteenOrphans', hand => {
        // 国士無双
        const orphans = [
                'イーソー', 'キューソー',
                'イーマン', 'キューマン',
                'イーピン', 'キューピン',
                '東', '南', '西', '北', '白', '發', '中'
            ];
        const _hands = hand.hand.map(item => item.toString());
        const counter = {};
        for (const _hand of _hands) {
            if (!counter[_hand]) counter[_hand] = 0;
            counter[_hand]++;
        }
        for (const orphan of orphans) {
            if (counter[orphan] !== 1 && counter[orphan] !== 2) return false;
        }
        return true;
    }]
]);
// console.log(Object.keys(judgeFunctions));
if (module) {
    module.exports = {
        getYaku: getYaku,
        getValidHands: getValidHands
    };
}