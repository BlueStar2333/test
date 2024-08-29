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
// 查询用户列表
const CoNoticeList = (req, res) => {
  $api.PostArg(req).then(data => {
    const { name, getPower } = data;
	let sql = "SELECT * FROM user WHERE name LIKE ? ORDER BY power DESC";
  console.log(getPower,45)
  if(getPower === 0) {
    sql  = "SELECT * FROM user WHERE name LIKE ? AND power=0";
  }
	pool.query(sql, ['%' + name + '%'], (error, result) => {
		if (error) throw error;
		// 判断是否查询到信息
    $api.ReturnJson(res, { code: YES, msg: "查询成功", data: { list: result } });
		});
	})
};

const CoDeleteNotice = (req, res) => {
  $api.PostArg(req).then(({ account }) => {
	let sql = "DELETE FROM user WHERE account=?";
    pool.query(sql, [account], (error, result) => {
      if (error) throw error;
        // 查询新增用户的账号id
        sql2 = "SELECT * FROM user WHERE account=?";
        pool.query(sql2, [account], (error, result2) => {
          if (error) throw error;
          // 判断是否查询到信息
          if (result2.length === 1) {
            $api.ReturnJson(res, { code:0,msg: "删除失败" });
          } else {
            $api.ReturnJson(res, { code: YES, msg: "删除成功" });
          }
        });
    });
	})
};



const CoPublishNotice = (req, res) => {
  $api.PostArg(req).then(data => {
    const { account } = data;
	let sql = "SELECT * FROM user WHERE account=?";
	pool.query(sql, [account], (error, result) => {
		if (error) throw error;
		// 判断是否查询到信息
		result.length === 0 ? $api.ReturnJson(res, { msg: "查询失败" }) : $api.ReturnJson(res, { code: YES, msg: "查询成功", data: result[0] });
		});
	})
};


module.exports = {
  CoNoticeList, // 查询公告列表
  CoDeleteNotice, // 删除用户
  CoPublishNotice, // 用户信息
};
