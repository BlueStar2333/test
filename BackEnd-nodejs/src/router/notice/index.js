/**
 * 用户模块
 */
const { BaseUrl } = require("./config"); // 模块配置
const { router } = require("@/utils"); // 工具类
const { CoNoticeList, CoPublishNotice, CoDeleteNotice} = require("@/controller/notice"); // 控制器

router.post(BaseUrl + "noticeList", CoNoticeList); // 查询
router.post(BaseUrl + "publishNotice", CoPublishNotice); // 发布
router.post(BaseUrl + "deleteNotice", CoDeleteNotice); // 删除
