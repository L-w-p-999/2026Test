
/**
 * @param {string} question - 用户提的问题
 * @param {Function} llm - 模拟大模型函数：(messages) => response
 * @param {Object} tools - 工具箱对象：{ [工具名]: (args) => result }
 * @param {number} [maxSteps=5] - 最大循环步数，默认 5（防死循环/防破产）
 * @returns {string} 返回 AI 的最终回答，或超过最大步数时的终止提示
 */
function runAgent(question, llm, tools, maxSteps = 5) {
  // 在这里写下你的代码，成为 AI 大王吧！
  let messages = [];
  let i = 0, step = 0;
  messages[i] = question;
  i++;
  if (step < maxSteps) {
    let result = llm(messages);
    step += 1;
    rellm(result);
  }
  else {
    return "超过最大步数"
  }
}
let rellm = function (result) {
  if (result.type === 'final') {
    return result.content;
  }
  else {
    messages[i] = llm(messages);
    i++
    messages[i] = tools[result.toolName](result.args);
    i++;
    rellm(result);
  }
}
// 简单的断言工具
function runTest(name, actual, expected) {
  const passed = actual === expected;
  console.log(`${passed ? '✅ PASS' : '❌ FAIL'} - ${name}`);
  if (!passed) {
    console.log(`   期望: ${JSON.stringify(expected)}`);
    console.log(`   实际: ${JSON.stringify(actual)}`);
  }
}

// 公共工具箱
const tools = {
  getCanteenMenu: ({ floor }) => {
    const menus = { 1: '红烧肉、番茄炒蛋', 2: '黄焖鸡、麻辣香锅' };
    return menus[floor] || '该楼层未营业';
  },
  getPrice: ({ item }) => {
    const prices = { 奶茶: 15, 炸鸡: 28 };
    return prices[item] ?? 0;
  },
  calcSum: ({ a, b }) => a + b,
};

// ==========================================
// 用例 1：不需要调工具，第一轮直接回答
// ==========================================
{
  let receivedMessages = null;
  const mockLlm = (messages) => {
    receivedMessages = messages;
    return { type: 'final', content: '1 + 1 = 2' };
  };

  const res = runAgent('1加1等于几？', mockLlm, tools);
  runTest('用例 1：直接返回最终答案', res, '1 + 1 = 2');
  runTest(
    '用例 1：初始 messages 格式正确',
    JSON.stringify(receivedMessages),
    JSON.stringify([{ role: 'user', content: '1加1等于几？' }])
  );
}

// ==========================================
// 用例 2：单次工具调用（顺带校验 messages 拼接格式）
// ==========================================
{
  let step = 0;
  let secondTurnMessages = null;

  const mockLlm = (messages) => {
    step++;
    if (step === 1) {
      return { type: 'tool_call', toolName: 'getCanteenMenu', args: { floor: 2 } };
    }
    // 拷贝一份，验证第 2 轮收到的历史记录
    secondTurnMessages = JSON.parse(JSON.stringify(messages));
    const lastMsg = messages[messages.length - 1];
    return { type: 'final', content: `二楼今天吃：${lastMsg.result}` };
  };

  const res = runAgent('今天食堂二楼吃啥？', mockLlm, tools);
  runTest('用例 2：单次工具调用', res, '二楼今天吃：黄焖鸡、麻辣香锅');
  runTest(
    '用例 2：messages 追加格式正确',
    JSON.stringify(secondTurnMessages),
    JSON.stringify([
      { role: 'user', content: '今天食堂二楼吃啥？' },
      { role: 'assistant', toolName: 'getCanteenMenu', args: { floor: 2 } },
      { role: 'tool', toolName: 'getCanteenMenu', result: '黄焖鸡、麻辣香锅' },
    ])
  );
}

// ==========================================
// 用例 3：多步工具调用（查价格 -> 查价格 -> 求和 -> 回答）
// ==========================================
{
  let step = 0;
  const mockLlm = (messages) => {
    step++;
    if (step === 1) return { type: 'tool_call', toolName: 'getPrice', args: { item: '奶茶' } };
    if (step === 2) return { type: 'tool_call', toolName: 'getPrice', args: { item: '炸鸡' } };
    if (step === 3) {
      const p1 = messages[2].result;
      const p2 = messages[4].result;
      return { type: 'tool_call', toolName: 'calcSum', args: { a: p1, b: p2 } };
    }
    const total = messages[messages.length - 1].result;
    return { type: 'final', content: `这顿外卖一共 ${total} 元` };
  };

  const res = runAgent('帮我算算奶茶和炸鸡一共多少钱？', mockLlm, tools);
  runTest('用例 3：多步链式工具调用', res, '这顿外卖一共 43 元');
}

// ==========================================
// 用例 4：刚好在第 maxSteps 步返回 final（边界值测试）
// ==========================================
{
  let step = 0;
  const mockLlm = () => {
    step++;
    if (step < 3) {
      return { type: 'tool_call', toolName: 'getCanteenMenu', args: { floor: 1 } };
    }
    return { type: 'final', content: '压哨完成！' };
  };

  const res = runAgent('测试压哨成功', mockLlm, tools, 3);
  runTest('用例 4：刚好在第 maxSteps 步完成不应终止', res, '压哨完成！');
}

// ==========================================
// 用例 5：超过 maxSteps 死循环（防破产机制）
// ==========================================
{
  let callCount = 0;
  const mockLlm = () => {
    callCount++;
    return { type: 'tool_call', toolName: 'getCanteenMenu', args: { floor: 1 } };
  };

  const res = runAgent('无限循环吧！', mockLlm, tools, 3);
  runTest('用例 5：超步数返回终止提示', res, '超过最大步数，任务终止');
  runTest('用例 5：llm 调用次数不超过 maxSteps', callCount, 3);
}

// ==========================================
// 用例 6：AI 幻觉，调用不存在的工具（加分项）
// ==========================================
{
  let step = 0;
  let errorToolMsg = null;

  const mockLlm = (messages) => {
    step++;
    if (step === 1) {
      return { type: 'tool_call', toolName: 'doMathHomework', args: { chapter: 3 } };
    }
    errorToolMsg = messages[messages.length - 1];
    if (errorToolMsg.result === 'Error: 工具不存在') {
      return { type: 'final', content: '抱歉，我没有写高数作业的工具，请自己写吧！' };
    }
    return { type: 'final', content: '未收到预期的错误提示' };
  };

  const res = runAgent('帮我写高数作业', mockLlm, tools);
  runTest(
    '用例 6：工具不存在时不崩溃并交由 llm 处理',
    res,
    '抱歉，我没有写高数作业的工具，请自己写吧！'
  );
  runTest(
    '用例 6：错误信息正确写入 messages',
    JSON.stringify(errorToolMsg),
    JSON.stringify({
      role: 'tool',
      toolName: 'doMathHomework',
      result: 'Error: 工具不存在',
    })
  );
}
