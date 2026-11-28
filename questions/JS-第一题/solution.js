/**
 * @param {string} text
 * @return {string}
 */
function processInput(text) {
  // 在这里编写你的答案
  let arr = [], p = 0, str = "";
    for (let i = 0; i < text.length - 1; i++) {
      if (text[i + 1] != "#" && text[i] != "#") {
        arr[p] = text[i]
        p++;
      }
      if (text[text.length - 1] != "#") {
        arr[p] = text[text.length - 1]
      }
      if (text[i] == "#") {
        continue
      }
    }
    for (let i of arr) str += i;
    return str;
  
}

console.log(processInput("abc#d")); // 预期输出："abd"
console.log(processInput("ab##c")); // 预期输出："c"
console.log(processInput("##a#")); // 预期输出：""
console.log(processInput("")); // 预期输出：""
