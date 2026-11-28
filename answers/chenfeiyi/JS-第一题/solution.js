/**
 * @param {string} text
 * @return {string}
 */
function processInput(text) {
  // 在这里编写你的答案
  let newText = [];
  let k = 0;
  for (i = 0; i < text.length; i++) {
    while (text[i] == "#" && i != 0) {
      k--;
      i++;
    }
    newText[k] = text[i];
    k++;
  }
  return toString(newText);
}

console.log(processInput("abc#d")); // 预期输出："abd"
console.log(processInput("ab##c")); // 预期输出："c"
console.log(processInput("##a#")); // 预期输出：""
console.log(processInput("")); // 预期输出：""
