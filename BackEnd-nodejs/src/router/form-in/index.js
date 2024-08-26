/**
 * 图文模块
 */
const { BaseUrl } = require("./config"); // 模块配置
const { router } = require("@/utils"); // 工具类
const { inquireByData, deleteData, addData, editData, CoArticleList, CoArticleDetails  } = require("@/controller/form-in"); // 控制器

router.post(BaseUrl + "inquireByData", inquireByData); // 查询数据
router.post(BaseUrl + "deleteData", deleteData); //删除数据
router.post(BaseUrl + "addData", addData); //添加数据
router.post(BaseUrl + "editData", editData); //修改数据


