exports.includesAll = function (string, words) {
    let index = 0;
    words.forEach(function (word) {
        if (string.toLowerCase().includes(word.toLowerCase()))
            index++;
    });
    return (words.length === index);
}