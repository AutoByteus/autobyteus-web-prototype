import type { TranslationCatalog } from '../../runtime/types';

// agent-definition-reconnect-ui: 重新连接其智能体文件夹已被重命名或删除的运行。
const reconnectMessages = {
  'reconnect.action': '重新连接',
  'reconnect.actionAria': '将 {{name}} 重新连接到智能体',
  'reconnect.notice.title': '智能体 {{id}} 已不存在',
  'reconnect.done.title': '已重新连接到 {{agent}}',
  'reconnect.done.instructions': '指令从新会话起生效',
  'reconnect.done.dismiss': '关闭',
  'reconnect.card.title': '智能体 {{id}} 已不存在',
  'reconnect.card.resolved': '{{id}} 已重新连接到 {{agent}}',
  'reconnect.dialog.title': '重新连接到智能体',
  'reconnect.dialog.search': '搜索智能体',
  'reconnect.dialog.listAria': '智能体',
  'reconnect.dialog.noMatch': '没有与“{{query}}”匹配的智能体。',
  'reconnect.dialog.similar': '名称相近',
  'reconnect.dialog.all': '全部智能体',
  'reconnect.dialog.teamLocal': '{{team}} 的团队内智能体',
  'reconnect.dialog.cancel': '取消',
  'reconnect.dialog.confirm': '重新连接',
  'reconnect.dialog.reconnecting': '正在重新连接…',
  'reconnect.dialog.busy': '{{name}} 正在运行。请先停止它，再重新连接。',
  'reconnect.dialog.failed': '无法重新连接：{{reason}}',
  'reconnect.settings.missingRun': '智能体 {{id}} 已不存在',
  'reconnect.settings.missingMember': '{{name}}：智能体已不存在',
  'reconnect.settings.reconnectedRun': '已重新连接到 {{agent}}',
  'reconnect.settings.reconnectedMember': '{{name}} 已重新连接到 {{agent}}',
  'reconnect.settings.instructions': '· 指令从新会话起生效',
  'reconnect.member.missing': '智能体缺失',
  'reconnect.tree.missing': '智能体 {{id}} 已不存在',
  'reconnect.done.instructionsTitle': '{{runtime}} 保留本会话的指令。工具和技能立即生效。',
  'reconnect.dialog.context': '替换 {{id}}。历史和会话保持不变。',
  'reconnect.dialog.contextMember': '{{name}} · 替换 {{id}}。历史和会话保持不变。',
} as const satisfies TranslationCatalog;

export default reconnectMessages;
