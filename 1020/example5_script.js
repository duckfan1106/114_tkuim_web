// example5_script.js
// 以巢狀 for 產生指定範圍的乘法表

// 取得使用者輸入的範圍
var start = prompt('請輸入乘法表的起始數字（例如 2）：');
var end = prompt('請輸入乘法表的結束數字（例如 5）：');


// 將輸入轉換為整數
var startNum = parseInt(start, 10);
var endNum = parseInt(end, 10);
var output = '';

if (isNaN(startNum) || isNaN(endNum) || startNum < 1 || endNum < 1 || startNum > endNum) {
  output = '請輸入有效的範圍！';
} else {
  for (var i = startNum; i <= endNum; i++) {
    for (var j = 1; j <= 9; j++) {
      output += i + ' x ' + j + ' = ' + (i * j) + '\t';
    }
    output += '\n';
  }
}

document.getElementById('result').textContent = output;
