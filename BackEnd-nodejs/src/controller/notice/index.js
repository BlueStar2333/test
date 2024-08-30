/**
 * 用户模块控制器
 */
const { pool, YES } = require("@/utils");
/**
 * 用户信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */
// 查询公告列表
const CoNoticeList = (req, res) => {
  let sql = "SELECT * FROM notice ORDER BY date DESC";
  pool.query(sql, (error, result) => {
    if (error) throw error;
    // 判断是否查询到信息
    $api.ReturnJson(res, { code: YES, msg: "查询成功", data: { list: result } });
  });
};

const CoDeleteNotice = (req, res) => {
  $api.PostArg(req).then(({ id }) => {
	  let sql = "DELETE FROM notice WHERE id=?";
    pool.query(sql, [id], (error, result) => {
      if (error) throw error;
      $api.ReturnJson(res, { code: YES, msg: "删除成功" });
    });
	})
};



const CoPublishNotice = (req, res) => {
  $api.PostArg(req).then(({ publisher, publisher_account, details }) => {
    const date = new Date()
    let sql = "INSERT INTO notice(publisher,publisher_account,details,date) VALUES (?,?,?,?)";
    pool.query(sql, [publisher, publisher_account, details, date], (error, result) => {
      if (error) throw error;
      $api.ReturnJson(res, { code: YES, msg: "发布成功", data: result[0] });
    });
	})
};


module.exports = {
  CoNoticeList, // 查询公告列表
  CoDeleteNotice, // 删除用户
  CoPublishNotice, // 用户信息
};
