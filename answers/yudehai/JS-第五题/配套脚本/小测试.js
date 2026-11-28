"use strict";

// 直接给第二个函数提供分组，这样可以单独检查它。
const examples = [
  {
    title: "二维散点与等距点",
    call: "findClosestCentroids",
    inputs: {points: [[4, 0], [2, 0], [0, 0], [1, 3]], centers: [[0, 0], [4, 0], [1, 4]]},
    expected: [1, 0, 0, 2],
    hint: "[2, 0] 到中心 0 和 1 一样远，取较小编号 0。"
  },
  {
    title: "比较 RGB 的三个通道",
    call: "findClosestCentroids",
    inputs: {points: [[20, 20, 230], [20, 20, 12]], centers: [[20, 20, 10], [20, 20, 240]]},
    expected: [1, 0],
    hint: "两个中心的红、绿通道相同，要用蓝色通道区分。"
  },
  {
    title: "按组号分别求坐标平均值",
    call: "computeCentroids",
    inputs: {points: [[4, 6], [-1, 0], [7, 2], [1, 4]], labels: [1, 0, 1, 0], centers: [[0, 0], [4, 6]]},
    expected: [[0, 2], [5.5, 4]],
    hint: "第 1 组的两个横坐标是 4 和 7，平均值是 5.5。返回时先写第 0 组。"
  },
  {
    title: "RGB 均值与空组",
    call: "computeCentroids",
    inputs: {points: [[10, 40, 51], [30, 60, 60]], labels: [1, 1], centers: [[90, 80, 70], [0, 0, 0]]},
    expected: [[90, 80, 70], [20, 50, 55.5]],
    hint: "第 0 组没有像素，保留旧中心。第 1 组分别求 R、G、B 的平均值。"
  }
];

function matchesExample(actual, expected) {
  if (Array.isArray(expected)) {
    return Array.isArray(actual) && actual.length === expected.length &&
      expected.every((item, index) => matchesExample(actual[index], item));
  }
  return Number.isFinite(actual) && Math.abs(actual - expected) <= 1e-8;
}

const testList = document.querySelector("#examples");
const summary = document.querySelector("#testSummary");
const allResults = new Map();

function addText(parent, tag, content, className) {
  const node = document.createElement(tag);
  node.textContent = content;
  if (className) node.className = className;
  parent.append(node);
  return node;
}

function runExample(example, row) {
  const actualCell = row.querySelector(".actual");
  const status = row.querySelector(".result-label");
  const hint = row.querySelector(".hint");
  let passed = false;
  try {
    // 每次运行都用新的输入，包括嵌套数组。
    const {points, centers, labels} = JSON.parse(JSON.stringify(example.inputs));
    const actual = example.call === "findClosestCentroids"
      ? findClosestCentroids(points, centers)
      : computeCentroids(points, labels, centers);
    passed = matchesExample(actual, example.expected);
    actualCell.textContent = actual === undefined ? "undefined（没有返回值）" :
      JSON.stringify(actual, (key, value) =>
        typeof value === "number" && !Number.isFinite(value) ? String(value) : value);
  } catch (error) {
    actualCell.textContent = "运行出错：" + String(error);
  }
  status.textContent = passed ? "通过" : "未通过";
  status.className = "result-label " + (passed ? "pass" : "fail");
  hint.hidden = passed;
  allResults.set(example, passed);
  const successes = [...allResults.values()].filter(Boolean).length;
  summary.textContent = "已运行 " + allResults.size + "/4，通过 " + successes + "/4。";
  return passed;
}

for (const example of examples) {
  const row = document.createElement("article");
  row.className = "example";
  const heading = document.createElement("header");
  row.append(heading);
  addText(heading, "h3", example.title);
  const button = addText(heading, "button", "运行此例");
  button.type = "button";
  button.setAttribute("aria-label", "运行：" + example.title);
  addText(row, "code", example.call + "(" + Object.keys(example.inputs).join(", ") + ")", "signature");
  const inputs = Object.entries(example.inputs).map(([key, value]) => key + " = " + JSON.stringify(value));
  addText(row, "pre", inputs.join("\n"), "inputs");
  const output = addText(row, "dl", "");
  addText(output, "dt", "预期输出");
  addText(output, "dd", JSON.stringify(example.expected));
  addText(output, "dt", "实际输出");
  addText(output, "dd", "待运行", "actual");
  const status = addText(row, "span", "", "result-label");
  status.setAttribute("role", "status");
  addText(row, "p", example.hint, "hint").hidden = true;
  button.onclick = () => runExample(example, row);
  testList.append(row);
}

function runAllExamples() {
  const results = examples.map((example, index) => runExample(example, testList.children[index]));
  return results.every(Boolean);
}
document.querySelector("#runAll").onclick = runAllExamples;
