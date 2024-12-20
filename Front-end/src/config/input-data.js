
/* *********自定义表单各类型数据**********
* uniqueName：唯一名称
* label： 标签，标题
* content： 预置内容
* max 最大个数
* min 最小个数
* isNecessary： 是否必须
* checkValue 是否校验值
* 单行文本 type=0；多行文本 type=1；单选框 type=2；多选框 type=3；日期选择：type=4；科室选择：type=20
* */
const inputData = [{
  type: 0,
  uniqueName: '',
  label: '单行输入框',
  max: 10,
  min: 0,
  regularError: false, // 正则验证正确与否
  regularRule: '', // 正则校验规则
  regularTips: '', // 正则校验提示
  content: '',
  isNecessary: false,
  checkValue: false
}, {
  type: 1,
  uniqueName: '',
  label: '多行输入框',
  max: 10,
  min: 0,
  content: '',
  regularError: false, // 正则验证正确与否
  regularRule: '', // 正则校验规则
  regularTips: '', // 正则校验提示
  isNecessary: false,
  checkValue: false
}, {
  type: 2,
  uniqueName: '',
  label: '单选框',
  select: ['选项1', '选项2'],
  content: '',
  isNecessary: false,
  checkValue: false
}, {
  type: 3,
  uniqueName: '',
  label: '多选框',
  select: ['选项1', '选项12', '选项3'],
  content: [],
  isNecessary: false,
  checkValue: false
}, {
  type: 4,
  uniqueName: '',
  label: '日期选择',
  content: '',
  dateType: 'date',
  isNecessary: false,
  checkValue: false
}, {
  type: 5,
  uniqueName: '',
  label: '数量选择',
  max: 10,
  min: 0,
  content: '',
  isNecessary: false,
  checkValue: false
}, {
  type: 6,
  uniqueName: '',
  label: '滑动条',
  max: 1000,
  min: 0,
  content: 0,
  checkValue: false
}, {
  type: 7,
  uniqueName: '',
  label: '带建议框',
  suggestion: '',
  content: '',
  regularError: false, // 验证正确与否
  regularTips: '只能选择建议内容', // 校验提示
  isNecessary: false,
  checkValue: false
}, {
  type: 20,
  uniqueName: '',
  label: '自增表格',
  header: ['列1', '列2'], // 表头名称
  headerLabel: ['列1', '列2'], // 用于设置v-for循环数据
  content: [['', '']], // 表每列值
  regularError: [[false, false]], // 正则验证正确与否
  bodyForm: [{
    type: 0,
    uniqueName: '',
    label: '单行输入框',
    max: 10,
    min: 0,
    regularRule: '', // 正则校验规则
    regularTips: '', // 正则校验提示
    suggestion: '',
    content: ''
  }, {
    type: 0,
    uniqueName: '',
    label: '单行输入框',
    max: 10,
    min: 0,
    regularRule: '', // 正则校验规则
    regularTips: '', // 正则校验提示
    suggestion: '',
    content: ''
  }] // 表每列内容
}]

export default inputData
