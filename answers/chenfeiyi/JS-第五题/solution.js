/**
 * 为每个点找到距离最近的中心。
 *
 * @param {number[][]} points 存放 m 个点的数组。二维散点写作 [x, y]，
 *   points[i][0] 是第 i 个点的横坐标，points[i][1] 是它的纵坐标。
 *   照片实验中，每个点是一个像素，写作 [R, G, B]
 *    此时points[i][0]是第i个像素点的R,points[i][1]是第i个像素点的G,points[i][2]是第i个坐标的B。
 * @param {number[][]} centers 存放 K 个中心的数组。
 * @returns {number[]} 长度为 m 的数组。第 i 项是 points[i] 最近的中心在
 *   centers 中的编号，从 0 开始。距离相同时，取较小的编号。
 *
 * @example
 * findClosestCentroids([[1, 2], [3, 4], [9, 8]], [[1, 2], [9, 8]])
 * 中心 0 是 [1, 2]，中心 1 是 [9, 8]。把横、纵坐标的差分别平方，相加后开平方，就得到距离。
 *   点 [1, 2]：到中心 0 的距离为 0，到中心 1 为 √(8² + 6²) = 10，选中心 0。
 *   点 [3, 4]：到中心 0 为 √(2² + 2²) ≈ 2.83，到中心 1 为 √(6² + 4²) ≈ 7.21，选中心 0。
 *   点 [9, 8]：到中心 0 为 10，到中心 1 为 0，选中心 1。
 * 按点的输入顺序记录所选中心的编号，返回 [0, 0, 1]。
 * 写代码时可以直接比较平方和。例如第二个点的两个平方和是 8 和 52，开平方后大小顺序相同。
 *
 * @example
 * // 图片示例：一行三个像素，从左到右读出各自的红、绿、蓝通道值。
 * const pixels = [[23, 34, 40], [77, 26, 40], [80, 30, 40]];
 * const palette = [[20, 30, 40], [80, 30, 40]];
 * findClosestCentroids(pixels, palette)
 * 中心 0 和中心 1 分别是 palette 中的第一种和第二种颜色。用三个通道一起计算颜色距离：
 *   左边像素：到中心 0 为 √(3² + 4² + 0²) = 5，到中心 1 为 √(57² + 4² + 0²) ≈ 57.14，选 0。
 *   中间像素：到中心 0 为 √(57² + 4² + 0²) ≈ 57.14，到中心 1 为 √(3² + 4² + 0²) = 5，选 1。
 *   右边像素：到中心 0 为 √(60² + 0² + 0²) = 60，到中心 1 为 0，选 1。
 * 返回 [0, 1, 1]。重画时，左边像素用 palette[0] 的颜色，中间和右边像素都用 palette[1]。
 */
function findClosestCentroids(points, centers) {
  //注意points会有两种格式，一种是数据点有x和y坐标，一种是像素点有R、G、B值，设计函数时应该采取可以同时使两种格式的points都能够使用的形式。
  //数据点还是像素点，当使用points[i][j]时，i表示第i个点，他们的区别是j的取值，数据点只能取0或1（分别对应x坐标和y坐标），像素点可以取0或1或2（分别对应R、G、B的值）
  //你需要干的事情：1、计算每个point与每个center间的距离。2、根据距离判断每个point应该归属于哪个center。3、返回一个数组。我们假定它名为label，label[i]表示第i个点归属于的center编号，例如label[i]的值为2，表示第i个点归属于2号的中心点
  //start here
  //2元
  if (points[0].length === 2) {
    const newArray = [];
    for (let i = 0; i < points.length; i++) {
      let a = points[i][0];
      let b = points[i][1];
      let min = 100000;
      let mem;
      for (let k = 0; k < centers.length; k++) {
        let x = centers[k][0];
        let y = centers[k][1];
        let result = (x - a) ** 2 + (y - b) ** 2;
        if (min > result) {
          mem = k;
          min = result;
        }
      }
      newArray.push(mem);
    }
    return newArray;
  }
  //3元
  if (points[0].length === 3) {
    const newArray = [];
    for (let i = 0; i < points.length; i++) {
      let a = points[i][0];
      let b = points[i][1];
      let c = points[i][2];
      let min = 100000;
      let mem;
      for (let k = 0; k < centers.length; k++) {
        let x = centers[k][0];
        let y = centers[k][1];
        let z = centers[k][2];
        let result = (x - a) ** 2 + (y - b) ** 2 + (z - c) ** 2;
        if (min > result) {
          mem = k;
          min = result;
        }
      }
      newArray.push(mem);
    }
    return newArray;
  }
}
//console.log(findClosestCentroids([[0, 0], [2, 0], [4, 1], [4, 2]], [[0, 0], [4, 0], [9, 9]]))

/**
 * 根据已有分组，计算每组的新中心。
 *
 * @param {number[][]} points 存放 点的数组，每个点是 [x, y] 或 [R, G, B]。
 * @param {number[]} labels 长度与 points相同 的数组，由 findClosestCentroids 返回。
 *   labels[i] 表示 点 points[i] 的所归属的组号。例如 labels[i] 为 0，表示第i个点归属于 0号中心点。
 * @param {number[][]} centers 按组号排列的旧中心点数组，centers[j] 是第 j 个旧中心点。
 * @returns {number[][]} 按相同组号排列的 新中心数组。每个坐标取组内所有point的相应坐标的平均值
 *  如果某组没有点，就保留它的旧中心。
 *
 * @example
 * computeCentroids([[1, 2], [3, 4], [9, 8]], [0, 0, 1], [[1, 2], [9, 8]])
 * // 应返回 [[2, 3], [9, 8]]：第 0 组取两个点的中点，第 1 组只有一个点。
 */
function computeCentroids(points, labels, centers) {
  //你需要干的事情：1、计算同组的point的中心点。2、更新中心点
  //依旧需要注意point和center的维度可以是二维的数据点，也可以是三维的像素点
  //start code here
  if (points[0].length === 2) {
    let sumx = [];
    let sumy = [];
    let count = [];
    let result = [];
    //
    for (let i = 0; i < labels.length; i++) {
      let a = points[i][0];
      let b = points[i][1];
      sumx[labels[i]] += a;
      sumy[labels[i]] += b;
      count[labels[i]]++;
    }
    for (let j = 0; j < centers.length; j++) {
      if (count[j] != 0) {
        let arrx = sumx[j] / count[j];
        let arry = sumy[j] / count[j];
        result[j][0] = arrx;
        result[j][1] = arry;
      }
      else {
        result[j][0] = centers[j][0];
        result[j][1] = centers[j][1];
      }
    }
    return result;
  }



  //end code here
}
console.log(computeCentroids([[0, 0], [2, 0], [4, 1], [4, 2]], [0, 0, 1, 1], [[0, 0], [4, 0], [9, 9]]))