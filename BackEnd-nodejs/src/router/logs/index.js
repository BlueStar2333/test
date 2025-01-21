/**
 * 日志模块
 */
const authToken = global.$api.authToken
const { BaseUrl } = require("./config"); // 模块配置
const { router } = require("@/utils"); // 工具类
const {  } = require("@/middleware/valid/logs"); // 校验
const { searchByData, sysTest  } = require("@/controller/logs"); // 控制器

router.post(BaseUrl + "searchByData", authToken, searchByData); // 查询数据
router.post(BaseUrl + "sysTest", sysTest); // 测试接口，仅用于调试测试


