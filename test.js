
// 遊戲設定
var games = {
    power: { name: "威力彩", areas: [{ count: 6, max: 38, canRepeat: false }, { count: 1, max: 8, canRepeat: false }] },
    lotto: { name: "大樂透", areas: [{ count: 6, max: 49, canRepeat: false }, { count: 1, max: 49, canRepeat: true }] },
    "539": { name: "今彩539", areas: [{ count: 5, max: 39, canRepeat: false }] }
};

// 期數要分遊戲存
var rounds = {
    "威力彩": 1,
    "大樂透": 1,
    "今彩539": 1
};

var records = [];   // 所有開獎紀錄
var filterGame = 'all'; // 預設顯示全部

// 產生隨機號碼，回傳排序前、排序後的陣列（while(1)老師寫法）
function getRandomNumbers(count, max, canRepeat) {
    var numbers = [];
    while (numbers.length < count) {
        while (1) {
            var num = Math.floor(Math.random() * max) + 1;
            if (canRepeat || numbers.indexOf(num) === -1) {
                numbers.push(num);
                break;
            }
        }
    }
    var before = [];
    for (var i = 0; i < numbers.length; i++) {
        if (numbers[i] < 10) {
            before.push("0" + numbers[i]);
        } else {
            before.push(numbers[i].toString());
        }
    }
    var sorted = [];
    for (var i = 0; i < numbers.length; i++) {
        sorted.push(numbers[i]);
    }
    sorted.sort(function (a, b) { return a - b; });
    var after = [];
    for (var i = 0; i < sorted.length; i++) {
        if (sorted[i] < 10) {
            after.push("0" + sorted[i]);
        } else {
            after.push(sorted[i].toString());
        }
    }
    return { before: before, after: after };
}

// 切換分頁（麵包屑）
function setFilter(gameName) {
    filterGame = gameName;
    var btns = document.getElementsByClassName('crumb');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
        if (btns[i].innerText === gameName || (gameName === "all" && btns[i].innerText === "全部")) {
            btns[i].classList.add('active');
        }
    }
    renderTable();
}

// 顯示所有開獎紀錄（根據分頁）
function renderTable() {
    var tbody = document.getElementById("historyTable").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    for (var i = 0; i < records.length; i++) {
        var r = records[i];
        if (filterGame !== 'all' && r.gameName !== filterGame) continue;
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>第" + r.round + "期</td>"
            + "<td>" + r.gameName + "</td>"
            + "<td>" + r.sortBefore + "</td>"
            + "<td>" + r.sortAfter + "</td>"
            + "<td>" + r.secNo + "</td>";
        tbody.appendChild(tr);
    }
}

// 模擬一次開獎
function playGame(gameKey) {
    document.getElementById("soundBtn").currentTime = 0;
    document.getElementById("soundBtn").play();
    var game = games[gameKey];
    if (!game) return;
    var gameName = game.name;

    var sortBefore = "-", sortAfter = "-", secNo = "-";
    var text = "<b>" + gameName + " 開獎結果：</b><br><hr>";

    // 第1區
    var main = game.areas[0];
    var mainNums = getRandomNumbers(main.count, main.max, main.canRepeat);
    sortBefore = mainNums.before.join(", ");
    sortAfter = mainNums.after.join(", ");
    text += "排序前（第1區）：" + sortBefore + "<br>";
    text += "排序後（第1區）：" + sortAfter + "<br>";

    // 第2區（有的遊戲才產生）
    if (game.areas.length > 1) {
        var sec = game.areas[1];
        var secNums = getRandomNumbers(sec.count, sec.max, sec.canRepeat);
        secNo = secNums.before.join(", ");
        text += "第二區號碼：" + secNo + "<br>";
    } else {
        text += "第二區號碼：-<br>";
    }

    document.getElementById("result").innerHTML = text;

    // 加進歷史紀錄，期數用 rounds[gameName]
    records.push({
        round: rounds[gameName],
        gameName: gameName,
        sortBefore: sortBefore,
        sortAfter: sortAfter,
        secNo: secNo
    });
    // 只增加這個遊戲的期數
    rounds[gameName]++;

    renderTable();
}

// 清空所有紀錄和期數
function clearHistory() {
    document.getElementById("soundClear").currentTime = 0;
    document.getElementById("soundClear").play();
    if (confirm("確定要清空紀錄嗎？")) {
        records = [];
        rounds["威力彩"] = 1;
        rounds["大樂透"] = 1;
        rounds["今彩539"] = 1;
        renderTable();
    }
}

// TOP按鈕功能
window.onscroll = function() {
    var btn = document.getElementById("topBtn");
    if (!btn) return;
    if (document.body.scrollTop > 120 || document.documentElement.scrollTop > 120) {
        btn.classList.add("show");
    } else {
        btn.classList.remove("show");
    }
};

document.getElementById("topBtn").onclick = function() {
    window.scrollTo({top:0, behavior:'smooth'});
};

