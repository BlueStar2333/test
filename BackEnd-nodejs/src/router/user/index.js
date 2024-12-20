/**
 * 用户模块
 */
const authToken = global.$api.authToken
const { BaseUrl } = require("./config"); // 模块配置
const { router } = require("@/utils"); // 工具类
const { VaEditUserInfo } = require("@/middleware/valid/user"); // 校验
const { CoUserList, CoEditInfo, CoDeleteUser} = require("@/controller/user"); // 控制器

router.post(BaseUrl + "userList", authToken, CoUserList); // 查询用户列表
router.post(BaseUrl + "editInfo", authToken, [VaEditUserInfo], CoEditInfo); // 修改用户信息
router.post(BaseUrl + "deleteUser", authToken, CoDeleteUser); // 删除用户
