function isWithinRange(number, min, max) {
    return number >= min && number <= max;
}

function bounceInterpolation(x)
{
    for (let a = 0, b = 1; true; a += b, b /= 2) {
        if (x >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * x) / 4, 2) + Math.pow(b, 2);
        }
    }
}


export { isWithinRange as default, bounceInterpolation };
