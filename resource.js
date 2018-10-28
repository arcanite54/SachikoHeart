var res = {
    img_sachiko: "./res/sachiko.png",
    img_heart1: "./res/heart1.png",
    img_heart3: "./res/heart3.png",
    //img_enemy: "./res/enemy.png",
    img_enemy_ghost: "./res/enemy_ghost.png",
    img_enemy_ball: "./res/enemy_ball.png",
    img_enemy_mush: "./res/enemy_mush.png",
    img_enemy_flower: "./res/enemy_flower.png",
    img_title: "./res/title.png",
    img_back: "./res/back.png",
    img_warn1: "./res/warning.png",
    img_warn2: "./res/warning2.png",
    img_effectCircle: "./res/effectCircle.png",
    img_retry: "./res/retry.png",
    bgm_title: "./music/game_maoudamashii_7_event43.ogg",
    bgm_main: "./music/game_maoudamashii_7_event42.ogg",
    se_heart1: "./music/se_maoudamashii_system47.ogg",
    se_heart3: "./music/se_maoudamashii_system46.ogg",
    se_damage: "./music/se_maoudamashii_battle18.ogg",
    se_warn: "./music/se_maoudamashii_system37.ogg"


};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}