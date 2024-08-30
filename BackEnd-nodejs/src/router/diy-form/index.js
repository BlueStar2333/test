/**
 * 自定义表单模块
 */
const authToken = global.$api.authToken
const { BaseUrl } = require("./config"); // 模块配置
const { router } = require("@/utils"); // 工具类
const { VaSaveDiyForm, VaEditDiyForm } = require("@/middleware/valid/diy"); // 校验
const { CoCarousel, CoSaveDiyForm, CoEditDiyForm, CoChangeState, CoDeleteDiyForm, CoChangePermissions } = require("@/controller/diy"); // 控制器

router.post(BaseUrl + "diyList", authToken, CoCarousel); // 获取自定义表单列表
router.post(BaseUrl + "saveDiyForm", authToken, [VaSaveDiyForm], CoSaveDiyForm); // 保存自定义表单
router.post(BaseUrl + "editDiyForm", authToken, [VaEditDiyForm], CoEditDiyForm); // 编辑自定义表单
router.post(BaseUrl + "changeState", authToken, CoChangeState); // 改变状态，关闭开启
router.post(BaseUrl + "deleteDiyForm", authToken, CoDeleteDiyForm); // 删除自定义表单
router.post(BaseUrl + "changePermissions", authToken, CoChangePermissions); // 设置填写权限自定义表单
