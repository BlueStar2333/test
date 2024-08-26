/**
 * 用户模块
 */
const { BaseUrl } = require("./config"); // 模块配置
const { router } = require("@/utils"); // 工具类
const { VaEditUserInfo } = require("@/middleware/valid/User"); // 校验
const { CoUserList, CoEditInfo, CoDeleteUser, CoUserInfo, CoFriendList, CoaddFriend, CotongyiAdd, CotiXing, CotiXingList} = require("@/controller/user"); // 控制器

router.post(BaseUrl + "userList", CoUserList); // 查询用户列表
router.post(BaseUrl + "editInfo", [VaEditUserInfo], CoEditInfo); // 修改用户信息(昵称、头像、性别、签名)
router.post(BaseUrl + "deleteUser", CoDeleteUser); // 删除好友



router.post(BaseUrl + "userInfo", CoUserInfo); // 用户信息
router.post(BaseUrl + "friendList", CoFriendList); // 好友信息

router.post(BaseUrl + "addFriend", CoaddFriend); // 添加好友
router.post(BaseUrl + "tongyiAdd", CotongyiAdd);// 同意添加

router.post(BaseUrl + "tiXing", CotiXing);// 发送提醒
router.post(BaseUrl + "tiXinglist", CotiXingList);// 提醒列表
