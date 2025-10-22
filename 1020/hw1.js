function CTemperature() {
    let input = prompt("請輸入溫度和單位（例如：100C 或 212F）：");
    if (input) {
        let value = parseFloat(input);
        let unit = input.slice(-1).toUpperCase();
        let result;

        if (unit === 'C') {
            result = (value * 9 / 5) + 32;
            alert(value + "°C 等於 " + result.toFixed(2) + "°F");
        } else if (unit === 'F') {
            result = (value - 32) * 5 / 9;
            alert(value + "°F 等於 " + result.toFixed(2) + "°C");
        } else {
            alert("請輸入有效的單位（C 或 F）！");
        }
    }
}
