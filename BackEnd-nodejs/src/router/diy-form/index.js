/**
 * 首页模块
 */
const { BaseUrl } = require("./config"); // 模块配置
const { router } = require("@/utils"); // 工具类
const { VaSaveDiyForm, VaEditDiyForm } = require("@/middleware/valid/diy"); // 校验
const { CoCarousel, CoSaveDiyForm, CoEditDiyForm, CoChangeState, CoDeleteDiyForm } = require("@/controller/diy"); // 控制器

router.post(BaseUrl + "saveDiyForm", [VaSaveDiyForm], CoSaveDiyForm); // 登录
router.post(BaseUrl + "editDiyForm", [VaEditDiyForm], CoEditDiyForm); // 登录
router.post(BaseUrl + "changeState", CoChangeState); // 登录
router.post(BaseUrl + "deleteDiyForm", CoDeleteDiyForm); // 登录
router.get(BaseUrl + "diyList", CoCarousel); // 轮播图
