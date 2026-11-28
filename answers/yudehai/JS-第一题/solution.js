/**
 * @param {string} text
 * @return {string}
 */
function dele(text,start,nums){
  let a = text.slice(0,start);
  let b = text.slice(start+nums,text.length+1);
  let c = a+b;
  return c;
}
// console.log(dele("abcddd",1,2))
// console.log(dele("abc#d",2,2))
function processInput(text) {
  // 在这里编写你的答案
  for(let i = 0 ;i<=text.length;i++){
  if(text[0]=="#"){
    text=dele(text,0,1)
  }
}
for (let i = 0;i<text.length;i++){

    if(text[i]== "#"){
      text = dele(text,i-1,2);
      if(text.length<=2){return text}
      i=i-2;
    }
   

  }
  return text
}
console.log(processInput("abc#d")); // 预期输出："abd"
console.log(processInput("ab##c")); // 预期输出："c"
console.log(processInput("##a#")); // 预期输出：""
console.log(processInput("")); // 预期输出：""
