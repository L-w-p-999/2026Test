/**
 * @param {number[]} nums
 * @return {number}
 */
function countSuspiciousSegments(nums) {
    if (nums.length === 0|| !nums ) return 0;
    
   for(let i = 0; i < n; i++){
    var count = 0;
    var n = nums.length;
    for(let j = i;j < n;j++){
    let one = 0;
    if(nums[j]==1){
      one ++;
    }if(one == 1){
      count ++;
    }else if(one > 1){
      break;
    }
   }
  }
   return count;
}

console.log(countSuspiciousSegments([0, 1, 0, 1])); // 预期输出：6
console.log(countSuspiciousSegments([0, 0])); // 预期输出：0
console.log(countSuspiciousSegments([1, 1])); // 预期输出：2
console.log(countSuspiciousSegments([])); // 预期输出：0
