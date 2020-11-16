(function () {
    const game = new Phaser.Game({
        type: Phaser.WEBGL,
        parent: "game_canvas",
        width: 100,
        height: 100,
        pixelArt: true,
        antialias: false,
        antialiasGL: false,
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            fullscreenTarget: "game_cont",
        },
        scene: [dungeonz.Boot, dungeonz.Game]
    });

    game.scene.start("Boot");

    // Check if the game should be run in dev mode by checking if it is localhost.
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
        console.log("* Running in dev mode.");
        window.devMode = true;
    }
    else {
        console.log("* Running in prod mode.");
        window.devMode = false;
    }
})();