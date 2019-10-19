const generator=require('../number_generator.js');

test ('return 3 digits random number',() => {
    testMultiple(3,100,999,100);
});

test ('return 4 digits random number',() => {
    testMultiple(4,1000,9999,100);
});

test ('return 5 digits random number',() => {
    testMultiple(5,10000,99999,100);
});

test ('return 6 digits random number',() => {
    testMultiple(6,100000,999999,100);
});

function testMultiple(digits,min,max,times) {
    for (var i=0;i<times;i++) {
        var result = generator.getRandomNumber(digits);
        expect(result).toBeGreaterThanOrEqual(min)
        expect(result).toBeLessThanOrEqual(max)
    }
}