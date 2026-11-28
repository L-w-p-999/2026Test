/**
 * 按顺序处理库存操作，返回最终库存和失败操作的下标
 * @param {{ id: number, name: string, stock: number }[]} goods
 * @param {{ id: number, type: string, quantity: number }[]} operations
 * @return {{ goods: { id: number, name: string, stock: number }[], failed: number[] }}
 */
function processStock(goods, operations) {
  // 在这里编写你的答案
  const failed = [];
    for (let i = 0; i < operations.length; i++) {
      let target = 0;
      for (let k = 0; k < goods.length; k++) {
        if (goods[k].id === operations[i].id) {
          target = 1
        }
      }
      if (target) {
        for (let p = 0; p < goods.length; p++) {
          if (goods[p].id === operations[i].id) {
            if (operations[i].type === "in") {
              goods[p].stock += operations[i].quantity
            };
            if (operations[i].type === "out") {
              let num = goods[p].stock - operations[i].quantity;
              if (num < 0) { failed.push(i); continue };
              goods[p].stock -= operations[i].quantity

            };
          }
        }
      }

      else failed.push(i);
    }

    return { goods, failed }
}

// 示例 1：正常入库、出库，以及库存不足和商品不存在
const goods = [
  { id: 1, name: "苹果", stock: 5 },
  { id: 2, name: "香蕉", stock: 3 }
];

const operations = [
  { id: 1, type: "out", quantity: 2 },
  { id: 2, type: "out", quantity: 4 },
  { id: 1, type: "in", quantity: 3 },
  { id: 3, type: "in", quantity: 2 }
];

console.log(processStock(goods, operations));
/* 预期输出：
{
  goods: [
    { id: 1, name: "苹果", stock: 6 },
    { id: 2, name: "香蕉", stock: 3 }
  ],
  failed: [1, 3]
}
*/

// 示例 2：失败不影响后续操作，允许恰好清空库存
console.log(processStock(
  [{ id: 1, name: "苹果", stock: 0 }],
  [
    { id: 1, type: "out", quantity: 1 },
    { id: 1, type: "in", quantity: 2 },
    { id: 1, type: "out", quantity: 2 }
  ]
));
// 预期输出：{ goods: [{ id: 1, name: "苹果", stock: 0 }], failed: [0] }

// 示例 3：没有操作
console.log(processStock([{ id: 1, name: "苹果", stock: 5 }], []));
// 预期输出：{ goods: [{ id: 1, name: "苹果", stock: 5 }], failed: [] }

// 示例 4：空库存表和空操作列表
console.log(processStock([], [{ id: 1, type: "in", quantity: 2 }]));
// 预期输出：{ goods: [], failed: [0] }
console.log(processStock([], []));
// 预期输出：{ goods: [], failed: [] }
