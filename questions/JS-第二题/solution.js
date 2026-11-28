/**
 * @param {number[]} nums
 * @return {number}
 */
function countSuspiciousSegments(nums) {
  // 在这里编写你的答案
  var a = 0;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === 1) {
        a++;
        for (let p = i - 1; p >= 0; p--) {
          if (nums[p] === 0) {
            a++;
          }
          else break;
        }
        for (let p = i + 1; p < nums.length; p++) {
          if (nums[p] === 0) {
            a += 2;
          }
          else break;
        }
      }
    }
    return a;
}

console.log(countSuspiciousSegments([0, 1, 0, 1])); // 预期输出：6
console.log(countSuspiciousSegments([0, 0])); // 预期输出：0
console.log(countSuspiciousSegments([1, 1])); // 预期输出：2
console.log(countSuspiciousSegments([])); // 预期输出：0
