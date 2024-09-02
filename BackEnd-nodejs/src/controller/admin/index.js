/**
 * 账户管理模块控制器
 */
const { pool, YES } = require("@/utils");

/**
 * 登录
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */
const CoLogin = (req, res) => {
  const { account, password } = req.validData; // 验证后数据
  let sql = "SELECT * FROM user WHERE account=? AND password=?";
  pool.query(sql, [account, password], (error, result) => {
    if (error) throw error;
    // 判断是否查询到信息
    if(result.length === 0) {
      $api.ReturnJson(res, { code:0,msg: "账号或密码错误" })
    } else {
      let logSql = "INSERT INTO logs(user, account, controls, controls_date) VALUES (?,?,?,?)";
      pool.query(logSql, [result[0].name, result[0].account, '登录',new Date()], (error, result) => {
        if (error) throw error;
      });
      const token = global.$api.generateToken({ account: result[0].account, password: result[0].password})
      $api.ReturnJson(res, {
        code: 1,
        msg: "恭喜您登陆成功",
        data: { result,token }
      })
    }
  });
};
/**
 * 注册
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */
const CoRegister = (req, res) => {
  const { name, account, password, phone, power } = req.validData; // 验证后数据
  // 查询用户是否已存在
  let sql = "SELECT * FROM user WHERE account=? or name=?";
  pool.query(sql, [account,name], (error, result) => {
    if (error) throw error;
    // 判断是否查询到信息
    if (result.length === 0) {
      // 新增用户账号信息
      const roles = power ? "admin" : "['自定义表单','表单列表','表单填写','公告']"
      sql = "INSERT INTO user(name,account,password,phone,power,roles,create_date) VALUES (?,?,?,?,?,?,?)";
      pool.query(sql, [name, account, password, phone, power,roles, new Date()], (error, result2) => {
        if (error) throw error;
          // 查询新增用户的账号id
          sql = "SELECT * FROM user WHERE account=?";
          pool.query(sql, [account], (error, result3) => {
            if (error) throw error;
            // 判断是否查询到信息
            if (result3.length === 0) {
              $api.ReturnJson(res, { code:0,msg: "注册失败" });
            } else {
				      $api.ReturnJson(res, { code: YES, msg: "注册成功" });
            }
          });
      });
    } else {
      $api.ReturnJson(res, { code:0,msg: "账号或用户名已存在" });
    }
  });
};


const refreshToken = (req, res) => {
  token = req.headers['x-token']
  const newToken = global.$api.refreshT(token)
  $api.ReturnJson(res, { code:1,msg: "成功", data: { token: newToken } });
};
module.exports = {
  CoLogin, // 登录
  CoRegister, // 注册
  refreshToken
};
