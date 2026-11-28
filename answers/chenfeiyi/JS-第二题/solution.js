/**
 * @param {number[]} nums
 * @return {number}
 */
function countSuspiciousSegments(nums) {
  // 在这里编写你的答案
  let conut = 0;
  let flag = 0;
  for (let k = 0; k < nums.length; k++) {
    if (nums[k] === 1) {
      let j = 1;
      conut++;
      if (flag == 1) {
        conut++;
      }
      while (nums[k + j] === 0) {
        conut++;
        j++;
        if (flag === 1) {
          conut++;
        }
      }

    }
    flag = 0;
    if (nums[k] === 0) {
      flag = 1;
    }
  }

  return conut;
}

console.log(countSuspiciousSegments([0, 1, 0, 1])); // 预期输出：6
console.log(countSuspiciousSegments([0, 0])); // 预期输出：0
console.log(countSuspiciousSegments([1, 1])); // 预期输出：2
console.log(countSuspiciousSegments([])); // 预期输出：0
