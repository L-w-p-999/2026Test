/**
 * @param {number[]} nums
 * @return {number}
 */
function countSuspiciousSegments(nums) {
  // 在这里编写你的答案
  let count=0;


  for(let i =0 ;i<nums.length;i++){
    if (nums[i]==1) {
      
      if(nums[i-1]==0 && nums[i+1]==0){
        count=count+4;
      }
      if((nums[i-1]===1&&nums[i+1]===0)||(nums[i-1]===0&&nums[i+1]===1)){
        count=count+2;
      }
      if(nums[i-1]===1&&nums[i+1]===1){
        count=count+1;
      }
      if(nums[i-1]===0&&nums[i+1]==undefined){
        count=count+2;
      }
      if(nums[i-1]==undefined&&nums[i+1]==1){
        count=count+1
      }
      if(nums[i-1]===1&&nums[i+1]==undefined){
        count=count+1;
      }
      if(nums[i-1]==undefined&&nums[i+1]==0){
        count=count+2;
      }
    }
  }
  return count;
  }


console.log(countSuspiciousSegments([0, 1, 0, 1])); // 预期输出：6
console.log(countSuspiciousSegments([0, 0])); // 预期输出：0
console.log(countSuspiciousSegments([1, 1])); // 预期输出：2
console.log(countSuspiciousSegments([])); // 预期输出：0
// console.log(countSuspiciousSegments([1,0,1,0]))
