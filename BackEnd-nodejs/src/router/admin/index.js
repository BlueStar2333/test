/**
 * 账户管理模块
 */
const authToken = global.$api.authToken
const { BaseUrl } = require("./config"); // 模块配置
const { router } = require("@/utils"); // 工具类
const { VaLogin, VaRegister } = require("@/middleware/valid/admin"); // 校验
const { CoLogin, CoRegister, refreshToken } = require("@/controller/admin"); // 控制器

router.post(BaseUrl + "login", [VaLogin], CoLogin); // 登录
router.post(BaseUrl + "register", [VaRegister], CoRegister); // 添加用户
router.post(BaseUrl + "refreshToken", authToken, refreshToken); // 刷新token
