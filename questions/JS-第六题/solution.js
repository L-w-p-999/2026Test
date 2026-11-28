
/**
 * @param {string} question - 用户提的问题
 * @param {Function} llm - 模拟大模型函数：(messages) => response
 * @param {Object} tools - 工具箱对象：{ [工具名]: (args) => result }
 * @param {number} [maxSteps=5] - 最大循环步数，默认 5（防死循环/防破产）
 * @returns {string} 返回 AI 的最终回答，或超过最大步数时的终止提示
 */
function runAgent(question, llm, tools, maxSteps = 5) {
  // 在这里写下你的代码，成为 AI 大王吧！
  let messages = [{ role: 'user', content: question }];
  messages.push({ role: 'assistant', toolName: res.toolName, args: res.args })
}
