const LEVELS = [
    {
        name : "Hi!",
        paddle : {
            // TODO: max-paddle-speed ... more?
        },
        ball : {
            velocity : {
                x: 4,
                y: 4,
            },
            spin : 0.4,
        },
        brickSet : {
            x : 240,
            y : 150,
            bricks : "1 1     1\n" +
                     "1 1 111 1\n" +
                     "111  1   \n" +
                     "1 1  1  1\n" +
                     "1 1 111 1"
        },
        powerUps : [
            { x : 200, y :  60, name : "faster-ball" },
            { x : 300, y : 400, name : "bigger-paddle" },
            { x : 200, y : 300, name : "slower-ball" },
        ],
    }
];

export default LEVELS;