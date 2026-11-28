# JS-第三题：按顺序处理库存操作

仓库有一份商品库存表 `goods`，同时收到一批库存操作 `operations`。请按操作出现的顺序依次处理，返回最终库存和失败操作的下标。

请在 `solution.js` 中实现函数 `processStock(goods, operations)`。

## 处理规则

1. 按商品 `id` 匹配库存表中的商品。
2. `type` 为 `"in"` 表示入库，增加对应商品的库存。
3. `type` 为 `"out"` 表示出库，减少对应商品的库存。库存恰好等于出库数量时，允许出库，库存变为 `0`。
4. 商品不存在或出库时库存不足，当前操作失败，不改变库存，也不新增商品。
5. 操作失败不影响后续操作；后续操作以此前成功操作处理后的库存为准。
6. 失败操作的下标从 `0` 开始，按操作出现的顺序返回。
7. 不修改传入的两个数组及其中的对象，返回的商品保持库存表的原顺序，商品 `id` 和名称保持不变。

## 输入约定

- `goods` 中的商品 `id` 为整数且不重复，`name` 为字符串，`stock` 为非负整数。
- `operations` 中的 `id` 为整数，`type` 只可能是 `"in"` 或 `"out"`，`quantity` 为正整数。
- 两个数组都允许为空，不需要处理其他异常输入。

## 返回格式

```js
{
  goods: [],  // 处理后的商品库存表
  failed: []  // 失败操作的下标
}
```

## 示例 1

```js
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

processStock(goods, operations);
// 返回：
// {
//   goods: [
//     { id: 1, name: "苹果", stock: 6 },
//     { id: 2, name: "香蕉", stock: 3 }
//   ],
//   failed: [1, 3]
// }
```

**解释：** 苹果先出库 `2` 个，再入库 `3` 个，最终库存为 `6`；香蕉库存不足，出库失败；编号为 `3` 的商品不存在，入库失败。

## 示例 2

```js
processStock(
  [{ id: 1, name: "苹果", stock: 0 }],
  [
    { id: 1, type: "out", quantity: 1 },
    { id: 1, type: "in", quantity: 2 },
    { id: 1, type: "out", quantity: 2 }
  ]
);
// 返回：
// {
//   goods: [{ id: 1, name: "苹果", stock: 0 }],
//   failed: [0]
// }
```

**解释：** 第一次出库因库存不足而失败，但不影响后续入库。入库后恰好可以完成最后一次出库。

## 示例 3

```js
processStock([{ id: 1, name: "苹果", stock: 5 }], []);
// 返回：
// {
//   goods: [{ id: 1, name: "苹果", stock: 5 }],
//   failed: []
// }
```

**解释：** 没有操作，返回库存内容不变的新商品库存表。

## 示例 4

```js
processStock([], [{ id: 1, type: "in", quantity: 2 }]);
// 返回：{ goods: [], failed: [0] }

processStock([], []);
// 返回：{ goods: [], failed: [] }
```

**解释：** 库存表为空时，任何商品操作都会因商品不存在而失败；两个数组都为空时，返回两个空数组。
