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
const CoUserList = (req, res) => {
  $api.PostArg(req).then(data => {
    const { name, getPower, form_id } = data;
    let sqlData = ['%' + name + '%']
    let sql = "SELECT * FROM user WHERE name LIKE ? ORDER BY power DESC";
    if(getPower === 0) {
      sql  = "SELECT * FROM user WHERE name LIKE ? AND power=0";
    }
    if(form_id) {
      sql = 'SELECT DISTINCT written_by,written_account FROM fill_in WHERE form_id = ?'
      sqlData = [form_id]
    }
    pool.query(sql, sqlData, (error, result) => {
      if (error) throw error;
      // 判断是否查询到信息
      $api.ReturnJson(res, { code: YES, msg: "查询成功", data: { list: result } });
      });
	})
};
/**
 * 修改用户信息(昵称、头像、性别、签名)
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */
const CoEditInfo = (req, res) => {
  const { name, account, password, phone, power } = req.validData; // 接收验证参数
  const roles = power ? "admin" : "['自定义表单','表单列表','表单填写']"
  sql = "UPDATE user SET name=?, password=?, phone=?, power=?, roles=?, create_date=? WHERE account=?";
  pool.query(sql, [name, password, phone, power, roles, new Date(), account], (error, result) => {
    if (error) throw error;
    pool.query("SELECT * FROM user WHERE phone=? AND account!=?", [phone, account], (errorT, resultT) => {
      if (errorT) throw errorT;
      if(resultT.length > 0) {
        $api.ReturnJson(res, { code: 0, msg: "修改失败, 该手机号被其他用户使用" });
      } else {
        pool.query("SELECT * FROM user WHERE account=?", [account], (errorF, resultF) => {
          if (errorF) throw errorF;
          $api.ReturnJson(res, { code: YES, msg: "修改成功", data: resultF[0] });
        })
      }
    })
  });
};
const CoDeleteUser = (req, res) => {
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


module.exports = {
  CoUserList, // 查询用户列表
  CoDeleteUser, // 删除用户
  CoEditInfo, // 修改用户信息
};
