/**
 * 公告模块
 */
const authToken = global.$api.authToken
const { BaseUrl } = require("./config"); // 模块配置
const { router } = require("@/utils"); // 工具类
const { CoNoticeList, CoPublishNotice, CoDeleteNotice} = require("@/controller/notice"); // 控制器

router.post(BaseUrl + "noticeList", authToken, CoNoticeList); // 查询
router.post(BaseUrl + "publishNotice", authToken, CoPublishNotice); // 发布
router.post(BaseUrl + "deleteNotice", authToken, CoDeleteNotice); // 删除
