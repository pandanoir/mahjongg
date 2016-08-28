'use strict';
if (!emptyTile) {
    var {Hand, bambooSuits, characterSuits, circleSuits, honorTiles, emptyTile} = require('./tiles.js');
}
const yakuInfo = [
    ['断么九', 'isTanyao|isTanyaochu', 'isAllSimples'],
    ['一盃口', 'isIpeiko', 'isOneSetOfIdenticalSequences'],
    ['役牌', 'isYakuhai', 'isHonorTiles'],
    ['三色同順', 'isSanshoku|isSanshokudojun', 'isThreeColourStraight'],
    ['一気通貫', 'isIttsu|isIkkitsukan', 'isStraight'],
    ['混全帯么九', 'isHonchantaiyaochu|isChanta', 'isTerminalOrHonorInEachSet'],
    ['七対子', 'isTitoitsu', 'isSevenPairs'],
    ['対々和', 'isToitoi|isToitoiho', 'isAllTripletHand'],
    ['三暗刻', 'isSananko', 'isThreeClosedTriplets'],
    ['混老頭', 'isHonroto|isHonro', 'isAllTerminalsAndHonors'],
    ['三色同刻', 'isSanshokudoko', 'isThreeColourTriplets'],
    ['三槓子', 'isSankantsu', 'isThreeKans'],
    ['小三元', 'isShosangen', 'isLittleThreeDragons'],
    ['混一色', 'isHonitsu|isHoniso', 'isHalfFlush'],
    ['純全帯么九', 'isJunchan|isJunchantaiyaochu', 'isTerminalInEachSet'],
    ['二盃口', 'isRyanpeiko', 'isTwoSetOfIdenticalSequences'],
    ['清一色', 'isTinitsu|isTiniso', 'isFlush'],
    ['国士無双', 'isKokushi|isKokushimuso', 'isThirteenOrphans'],
    ['四暗刻', 'isSuanko', 'isFourConcealedTriplets'],
    ['大三元', 'isDaisangen', 'isBigThreeDragons'],
    ['字一色', 'isTsuiso', 'isAllHonors'],
    ['小四喜', 'isShosushi|isShaosushi', 'isLittleFourWinds'],
    ['大四喜', 'isDaisushi|isTasushi', 'isBigFourWinds'],
    ['緑一色', 'isRyuiso', 'isAllGreen'],
    ['清老頭', 'isChinroto', 'isAllTerminals'],
    ['四槓子', 'isSukantsu', 'isFourKans'],
    ['九蓮宝燈', 'isChurenpoto', 'isNineGates']
];
const translateToJapanese = new Map(
    yakuInfo
        .map(item => item[1].split('|')
            .map(jap => [jap, item[2]])
        ) // [[['isTanyao', 'isAllSimples'], ['isTanyaochu', ...]], [['isIpeiko', ...]], ...]
        .reduce((a, b) => a.concat(b), [])
);
const translateToChineseCharacter = new Map(yakuInfo.map(item => [item[2], item[0]]));
const translateFromChineseCharacter = new Map(yakuInfo.map(item => [item[0], item[2]]));
let yakumans = [
    '国士無双',
    '四暗刻',
    '大三元',
    '字一色',
    '小四喜',
    '大四喜',
    '緑一色',
    '清老頭',
    '四槓子',
    '九蓮宝燈',
];
let notYakumans = yakuInfo.map(item => item[0]).filter(item => !yakumans.includes(item));

yakumans = yakumans.map(character => translateFromChineseCharacter.get(character));
notYakumans = notYakumans.map(character => translateFromChineseCharacter.get(character));

const higherYaku = [
    ['二盃口', '一盃口'],
    ['清一色', '混一色'],
    ['純全帯么九', '混全帯么九'],
    ['混老頭', '混全帯么九']
].map(item => item.map(character => translateFromChineseCharacter.get(character)));

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
            pattern(tiles.slice(3)).map(item => [{type: 'pong', tiles: tiles.slice(0, 3)}].concat(item))// pong means '刻子'
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
                ).map(item => [{type: 'chow', tiles: [tiles[0], tiles[i], tiles[j]]}].concat(item))
            );
        }
    }

    return res;
}
function isThreeColour(firstTiles) {
    if (firstTiles.length < 3) return false;
    if (firstTiles.length === 3) {
        if (firstTiles.map(item => item.kind).sort().join(' ') === 'bamboo character circle') {
            // each tiles is different kind.
            if (/([1-9])\1\1/.test(firstTiles.map(item => item.string).join(''))) {
                // all tile's number is same.
                return true;
            }
        }
    } else {
        // firstTiles.length === 4
        for (let i = 0, _i = firstTiles.length; i < _i; i++) {
            let _firstTiles = firstTiles.slice(0, i).concat(firstTiles.slice(i + 1));
            if (_firstTiles.map(item => item.kind).sort().join(' ') === 'bamboo character circle') {
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
    for (let i = 0, _i = res.length; i < _i; i++) {
        for (const [higher, lower] of higherYaku) {
            if (res[i][higher]) res[i][lower] = false;
        }
        for (const yakuman of yakumans) {
            if (res[i][yakuman]) {
                for (const notYakuman of notYakumans) res[i][notYakuman] = false;
                break;
            }
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
    const suitsPattern = /(\+)?(イー|リャン|サン|スー|ウー|ロー|チー|パー|キュー|\d)(ピン|ソー|マン|ワン|[psm])(R?) ?/g;
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
        ['キュー', 9],
        ['1', 1],
        ['2', 2],
        ['3', 3],
        ['4', 4],
        ['5', 5],
        ['6', 6],
        ['7', 7],
        ['8', 8],
        ['9', 9]
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

        if (kind === 'ソー' || kind === 's') tile = bambooSuits[num];
        if (kind === 'マン' || kind === 'ワン' || kind === 'm') tile = characterSuits[num];
        if (kind === 'ピン' || kind === 'p') tile = circleSuits[num];

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
    ['isAllSimples', hand => {
        // 断么九
        // hand is one of the values which getValidHands() returns.
        return hand.every(set => set.tiles.every(tile => !tile.isYaochu()));
    }],
    ['isOneSetOfIdenticalSequences', hand => {
        // 一盃口
        if (isConcealed(hand) === false) return false;
        const firstTiles = [];
        for (const set of hand) {
            if (set.type === 'chow') {
                for (const firstTile of firstTiles) {
                    if (firstTile.equals(set.tiles[0])) return true;
                }
                firstTiles.push(set.tiles[0]);
            }
        }
        return false;
    }],
    ['isHonorTiles', hand => {
        // 役牌
        const honor = ['白', '發', '中'];
        for (const set of hand) {
            if (set.type === 'pong' || set.type === 'calledPong') {
                if (honor.includes(set.tiles[0].string)) {
                    return true;
                }
            }
        }
        return false;
    }],
    ['isThreeColourStraight', hand => {
        // 三色同順
        const firstTiles = [];
        for (const set of hand) {
            if (set.type === 'chow' || set.type === 'calledChow') firstTiles.push(set.tiles[0]);
        }
        return isThreeColour(firstTiles);
    }],
    ['isStraight', hand => {
        // 一気通貫
        const firstTiles = [];
        for (const set of hand) {
            if (set.type === 'chow' || set.type === 'calledChow') firstTiles.push(set.tiles[0]);
        }
        if (firstTiles.length < 3) return false;
        if (firstTiles.length === 3) {
            if (!(firstTiles[0].kind === firstTiles[1].kind && firstTiles[1].kind === firstTiles[2].kind)) {
                return false;
            }
            if (firstTiles[0].string === '1' && firstTiles[1].string === '4' && firstTiles[2].string === '7') return true;
            return false;
        } else if (firstTiles.length === 4) {
            if (!(firstTiles[0].kind === firstTiles[1].kind && firstTiles[1].kind === firstTiles[2].kind) &&
                !(firstTiles[1].kind === firstTiles[2].kind && firstTiles[2].kind === firstTiles[3].kind)) {
                return false;
            }
            if (firstTiles[0].string === '1' && firstTiles[1].string === '4' && firstTiles[2].string === '7' ||
                firstTiles[1].string === '1' && firstTiles[2].string === '4' && firstTiles[3].string === '7') return true;
            return false;
        }
    }],
    ['isTerminalOrHonorInEachSet', hand => {
        // 混全帯么九
        const yaochu = '19東南西北白發中'.split('');
        return hand.every(set => set.tiles.some(tile => yaochu.includes(tile.string)));
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
    ['isAllTripletHand', hand => {
        // 対々和
        return hand.every(set => ['eye', 'pong', 'calledPong', 'concealedKong', 'meldedKong'].includes(set.type));
    }],
    ['isThreeClosedTriplets', hand => {
        // 三暗刻
        return hand.filter(set => set.type === 'pong' || set.type === 'concealedKong').length === 3;
    }],
    ['isAllTerminalsAndHonors', hand => {
        // 混老頭
        return hand.every(set => set.tiles.every(tile => tile.isYaochu()));
    }],
    ['isThreeColourTriplets', hand => {
        // 三色同刻
        const firstTiles = [];
        for (const set of hand) {
            if (set.type === 'pong' || set.type === 'calledPong') firstTiles.push(set.tiles[0]);
        }
        return isThreeColour(firstTiles);
    }],
    ['isThreeKans', hand => {
        // 三槓子
        return hand.filter(set => set.type === 'concealedKong' || set.type === 'meldedKong').length === 3;
    }],
    ['isLittleThreeDragons', hand => {
        // 小三元
        const dragons = ['白', '發', '中'];
        return dragons.includes(hand.filter(set => set.type === 'eye')[0].tiles[0]) &&
            hand.filter(set => ['pong', 'calledPong', 'concealedKong', 'meldedKong'].includes(set.type) && dragons.includes(set.tiles[0]));
    }],
    ['isHalfFlush', hand => {
        // 混一色
        let numberSuit = null;
        return hand.every(set => set.tiles.every(tile => {
            if (['wind', 'dragon'].includes(tile.kind)) return true;
            if (numberSuit === null) numberSuit = tile.kind;
            return tile.kind === numberSuit;
        }));
    }],
    ['isTerminalInEachSet', hand => {
        // 純全帯么九
        return hand.every(set => set.tiles.some(tile => tile.string === '1' || tile.string === '9'));
    }],
    ['isTwoSetOfIdenticalSequences', hand => {
        // 二盃口
        if (isConcealed(hand) === false) return false;
        const firstTiles = hand.filter(set => set.type === 'chow').map(set => set.tiles[0]);
        return firstTiles.length === 4 && firstTiles[0].equals(firstTiles[1]) && firstTiles[2].equals(firstTiles[3]);
    }],
    ['isFlush', hand => {
        // 清一色
        const numberSuit = ['bamboo', 'character', 'circle'];
        if (!numberSuit.includes(hand[0].tiles[0].kind)) return false;
        return hand.every(set => set.tiles.every(tile => tile.kind === hand[0].tiles[0].kind));
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
    }],
    ['isFourConcealedTriplets', hand => {
        // 四暗刻
        return hand.filter(set => set.type === 'pong' || set.type === 'concealedKong').length === 4;
    }],
    ['isBigThreeDragons', hand => {
        // 大三元
        return hand.filter(set => ['pong', 'calledPong'].includes(set.type) && ['白', '發', '中'].includes(set.tiles[0].string)).length === 3;
    }],
    ['isAllHonors', hand => {
        // 字一色
        return hand.every(set => set.tiles.every(tile => ['wind', 'dragon'].includes(tile.kind)));
    }],
    ['isLittleFourWinds', hand => {
        // 小四喜
        return hand.filter(set => set.type === 'eye')[0].kind === 'wind' &&
            hand.filter(set => ['pong', 'calledPong', 'concealedKong', 'meldedKong'].includes(set.type) && set.tiles[0].kind === 'wind').length === 3;
    }],
    ['isBigFourWinds', hand => {
        // 大四喜
        return hand.filter(set => ['pong', 'calledPong', 'concealedKong', 'meldedKong'].includes(set.type) && set.tiles[0].kind === 'wind').length === 4;
    }],
    ['isAllGreen', hand => {
        // 緑一色
        return hand.every(set => set.tiles.every(tile => ['2', '3', '4', '6', '8'].includes(tile.string) && tile.kind === 'bamboo' || tile.string === '發'));
    }],
    ['isAllTerminals', hand => {
        // 清老頭
        return hand.every(set => set.tiles.every(tile => tile.string === '1' || tile.string === '9'));
    }],
    ['isFourKans', hand => {
        // 四槓子
        return hand.filter(set => ['concealedKong', 'meldedKong'].includes(set.type)).length === 4;
    }],
    ['isNineGates', hand => {
        // 九蓮宝燈
        if (isConcealed(hand) === false) return false;
        const numberSuit = ['bamboo', 'character', 'circle'];
        if (!numberSuit.includes(hand[0].tiles[0].kind) ||
            !hand.every(set => set.tiles.every(tile => tile.kind === hand[0].tiles[0].kind))) return false;
        return /^\d$/.test(
            hand.map(set => set.tiles.map(tile => tile.string))
                .reduce((a, b) => a.concat(b), [])
                .sort()
                .join('')
                .replace('111', '')
                .replace('2', '')
                .replace('3', '')
                .replace('4', '')
                .replace('5', '')
                .replace('6', '')
                .replace('7', '')
                .replace('8', '')
                .replace('999', '')
        );
    }],
]);
// console.log(Object.keys(judgeFunctions));
if (module) {
    module.exports = {
        getYaku: getYaku,
        getValidHands: getValidHands,
        translateToChineseCharacter: translateToChineseCharacter,
        createHandFromString: createHandFromString
    };
}