

function randomNumber(digits) {
    var min = getMin(digits);
    var max = getMax(digits);

    return Math.floor(Math.random()* (max-min+1) + min);
}

function getMin(digits) {
    var result='1';

    if (digits>1) {
        result+='0'.repeat(digits-1);
    }

    return parseInt(result);
}

function getMax(digits) {
    var result='9';

    if (digits>1) {
        result+='9'.repeat(digits-1);
    }

    return parseInt(result);
}

module.exports.getRandomNumber=randomNumber;