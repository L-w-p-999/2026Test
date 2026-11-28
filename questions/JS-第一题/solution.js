/**
 * @param {string} text
 * @return {string}
 */
function processInput(text) {
   let result = [];

   for(let i = 0;i<text.length;i++){
    let p = text[i];
    if(p=="#"){
      if(result.length>0){
        result.pop();
      }
    }else{
      result.push(text[i]);
    }
   }
      return result
}

console.log(processInput("abc#d")); // 预期输出："abd"
console.log(processInput("ab##c")); // 预期输出："c"
console.log(processInput("##a#")); // 预期输出：""
console.log(processInput("")); // 预期输出：""
