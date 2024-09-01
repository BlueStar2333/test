/**
 * 填写表单模块
 */
const authToken = global.$api.authToken
const { BaseUrl } = require("./config"); // 模块配置
const { router } = require("@/utils"); // 工具类
const { inquireByData, getNumData, deleteData, addData, editData  } = require("@/controller/form-in"); // 控制器

router.post(BaseUrl + "inquireByData", authToken, inquireByData); // 查询数据
router.post(BaseUrl + "getNumData", authToken, getNumData); // 获取统计数据
router.post(BaseUrl + "deleteData", authToken, deleteData); //删除数据
router.post(BaseUrl + "addData", authToken, addData); //添加数据
router.post(BaseUrl + "editData", authToken, editData); //修改数据


