const letters = [
    null, null, null, null, null, null, null, null, null, null,
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
    " ", "a", "A", "b", "B", "c", "C", "d", "D", "e",
    "E", "f", "F", "g", "G", "h", "H", "i", "I", "j",
    "J", "k", "K", "l", "L", "m", "M", "n", "N", "o",
    "O", "p", "P", "q", "Q", "r", "R", "s", "S", "t",
    "T", "u", "U", "v", "V", "w", "W", "x", "X", "y",
    "Y", "z", "Z", "*", "/", ".", ",", "!", '"', "§",
    "$", "%", "_", "-", "(", "´", ")", "`", "?", "\n",
    "@", "#", "~", ";", ":", "+", "&", "|", "^", "'"
];

/**
 * Function to decode the input.
 * @param {string} inp - The encoded input.
 * @returns {string} - The decoded output.
 */
function decode(inp) {
    try {
        inp = String(inp);
    } catch (err) {
        throw new Error("InvalidDecodeInput");
    }
    let outp = "";
    for (let i = 0; i < Math.floor(inp.length / 2); i++) {
        const letter = letters[parseInt(`${inp[i*2]}${inp[(i*2)+1]}`)];
        outp += letter || "";
    }
    return outp;
}

/**
 * Function to encode the input.
 * @param {string} inp - The decoded input.
 * @returns {string} - The encoded output.
 */
function encode(inp) {
    inp = String(inp);
    let outp = "";
    for (let i = 0; i < inp.length; i++) {
        const index = letters.indexOf(inp[i]);
        outp += index !== -1 ? index : letters.indexOf(" ");
    }
    return outp;
}

/**
 * Function to replace a character in the encoding/decoding table.
 * @param {string} oldChar - The character to be replaced.
 * @param {string} newChar - The new character.
 */
function replaceChar(oldChar, newChar) {
    const index = letters.indexOf(oldChar);
    if (index !== -1) {
        letters[index] = newChar;
    }
}

module.exports = {
    decode,
    encode,
    replaceChar
};