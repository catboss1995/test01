// google工程師說可以加看看
function makeMoneyRain() {
    var box = document.getElementById("moneyRain");
    if (!box) return; // 確認有 moneyRain 這個區塊

    setInterval(function() {
        var money = document.createElement("div");
        money.className = "money";
        // 隨機左右位置
        money.style.left = Math.random() * 100 + "vw";
        // 隨機動畫時間
        var duration = 3 + Math.random() * 2; // 3~5 秒
        money.style.animationDuration = duration + "s";
        box.appendChild(money);

        // 動畫結束自動移除
        setTimeout(function(){
            box.removeChild(money);
        }, duration * 1000);
    }, 300); // 每0.3秒一個
}

// 如果這檔案獨立，可以這樣自動啟動
window.addEventListener('DOMContentLoaded', function() {
    makeMoneyRain();
});
