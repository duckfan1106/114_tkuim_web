function guessNumber() {
    let target = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    let guess;

    do {
        guess = parseInt(prompt("請猜一個 1 到 100 的數字："));
        attempts++;
        if (guess > target) {
            alert("再小一點ㄅ！");
        } else if (guess < target) {
            alert("再大一點ㄅ！");
        } else {
            alert("恭喜你！猜對了！ 挖嗚嗚嗚嗚嗚嗚屋");
            document.getElementById("result").innerText = "你總共猜了 " + attempts + " 次。";
        }
    } while (guess !== target);
}
