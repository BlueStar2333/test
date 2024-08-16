
/* *********自定义表单各类型数据**********
* uniqueName：唯一名称
* label： 标签，标题
* content： 预置内容
* isNecessary： 是否必须
* 单行文本 type=0；多行文本 type=1；单选框 type=2；多选框 type=3；日期选择：type=4；科室选择：type=20
* */
const inputData = [{
  type: 0,
  uniqueName: '',
  label: '单行输入框',
  content: '',
  isNecessary: false
}, {
  type: 1,
  uniqueName: '',
  label: '多行输入框',
  content: '',
  isNecessary: false
}, {
  type: 2,
  uniqueName: '',
  label: '单选框',
  select: '',
  content: ['选项1', '选项2'],
  isNecessary: false
}, {
  type: 3,
  uniqueName: '',
  label: '多选框',
  select: [],
  content: ['选项1', '选项12', '选项3'],
  isNecessary: false
}, {
  type: 4,
  uniqueName: '',
  label: '日期选择',
  content: '',
  isNecessary: false
}, {
  type: 5,
  uniqueName: '',
  label: '数量选择',
  content: '',
  isNecessary: false
}, {
  type: 20,
  uniqueName: '',
  label: '科室选择',
  content: '',
  isNecessary: false
}]

export default inputData
