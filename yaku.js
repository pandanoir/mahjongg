'use strict';
function validYaku(hand, isSorted) {
    // only return the pattern which given hand can consist. each pattern has 4 melds(面子) and an eye(雀頭).
    if (isSorted !== true) hand = hand.sort();
    var pairs = hand.getPairs();
}
function isAllSimples(hand, isSorted) {
    // 断么九
    if (isSorted !== true) hand = hand.sort();
    if (!validYaku(hand, true)) return false;
    return hand.all(function(tile) {
        if (isNaN(tile.string)) {
            return false;
        }
        if (Number(tile.string) === 1 || Number(tile.string) === 9) {
            return false;
        }
        return true;
    });
}
function isNoPointsHand(hand, isSorted) {
    // 平和
    if (isSorted !== true) hand = hand.sort();
}
function isOneSetOfIdenticalSequences(hand, isSorted) {
    // 一盃口
    if (isSorted !== true) hand = hand.sort();
}
function isHonorTiles(hand, isSorted) {
    // 役牌
    if (isSorted !== true) hand = hand.sort();
}
function isThreeColourStraight(hand, isSorted) {
    // 三色同順
    if (isSorted !== true) hand = hand.sort();
}
function isThreeColourTriplets(hand, isSorted) {
    // 三色同刻
    if (isSorted !== true) hand = hand.sort();
}
module.exports = {
    isAllSimples: isAllSimples,
    isNoPointsHand: isNoPointsHand,
    isOneSetOfIdenticalSequences: isOneSetOfIdenticalSequences,
    isHonorTiles: isHonorTiles,
    isThreeColourStraight: isThreeColourStraight,
    isThreeColourTriplets: isThreeColourTriplets
};
