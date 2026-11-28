/**
 * 按顺序处理库存操作，返回最终库存和失败操作的下标
 * @param {{ id: number, name: string, stock: number }[]} goods
 * @param {{ id: number, type: string, quantity: number }[]} operations
 * @return {{ goods: { id: number, name: string, stock: number }[], failed: number[] }}
 */
function processStock(goods, operations) {
  // 在这里编写你的答案
  const failed = [];
  let flag = 0;
  for (let i = 0; i < operations.length; i++) {
    let opId = operations[i].id;
    let optype = operations[i].type;
    let opQuantity = operations[i].quantity;
    for (let j = 0; j < goods.length; j++) {
      let goodsId = goods[j].id;
      if (goodsId === opId) {
        if (optype === "in") {
          goods[j].stock = goods[j].stock + opQuantity;
          flag = 1;
          break;
        }
        else {
          if (opQuantity > goods[j].stock) {
            failed.push(i);
            flag = 1;
            break;
          }
          else {
            goods[j].stock = goods[j].stock - opQuantity;
            flag = 1;
            break;
          }
        }
      }
    }
    if (flag === 0) {
      failed.push(i);
    }
    flag = 0;
  }
  return { "goods": goods, "failed": failed }
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
