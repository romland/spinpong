class Interpolations {
}
Interpolations.linear = (x) => x;
Interpolations.smooth = (x) => x * x * (3 - 2 * x);
Interpolations.smooth2 = (x) => Interpolations.smooth(Interpolations.smooth(x));
Interpolations.smoother = (a) => a * a * a * (a * (a * 6 - 15) + 10);
Interpolations.fade = Interpolations.smoother;
Interpolations.pow2out = (x) => Math.pow(x - 1, 2) * (-1) + 1;
export default Interpolations;
;
//# sourceMappingURL=Interpolations.js.map