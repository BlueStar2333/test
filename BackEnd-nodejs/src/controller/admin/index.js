/**
 * 账户管理模块控制器
 */
const { pool, YES } = require("@/utils");

// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
const Dysmsapi20170525 = require('@alicloud/dysmsapi20170525');
const OpenApi = require('@alicloud/openapi-client');
const Console = require('@alicloud/tea-console');
const Util = require('@alicloud/tea-util');
const Tea = require('@alicloud/tea-typescript');


// 生成一个6位数字的字符串
function generateVerificationCode(phone) {
  // 生成一个6位数字的字符串
  let code = Math.floor(100000 + Math.random() * 900000).toString();
  let sqls = "SELECT * FROM verification_codes WHERE phone_number = ?"
  let sql = ""
  pool.query(sqls, [phone], (error, result) => {
    if (error) throw error;
    if (result.length === 0) {
      sql = "INSERT INTO verification_codes (code, expires_at, phone_number) VALUES (?, ?, ?)"
    } else {
      sql = "UPDATE verification_codes SET code=?, expires_at=? WHERE phone_number=?";
    }
    pool.query(sql, [code, new Date(), phone], (errorT, resultT) => {
      if (errorT) throw errorT;
    })
  })
  return code;
}

const sendCode = (req, res) => {
  $api.PostArg(req).then(({ phone }) => { // 发送成功后存储验证码
    const code = generateVerificationCode(phone)
    Client.main({ phone, code }).then(resp => {
      $api.ReturnJson(res, {
        code: 1,
        msg: "发送成功",
        data: null
      });
    }).catch(err => {
      $api.ReturnJson(res, {
        code: 0,
        msg: "发送失败",
        data: null
      });
    });
  });
};

const submitup = (req, res) => {
  $api.PostArg(req).then(({ username, password }) => {
    sql = "SELECT * FROM user WHERE account = ? AND password = ?"
    pool.query(sql, [username, password], (error, result) => {
      if (error) throw error;
      if (result.length === 0) {
        $api.ReturnJson(res, {
          code: 0,
          msg: "账号或密码错误",
          data: null
        });
      } else {
        $api.ReturnJson(res, {
          code: 1,
          msg: "成功",
          data: { phone: result[0].phone }
        });
      }
    });
  });
};









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
  submitup,
  sendCode,
  CoLogin, // 登录
  CoRegister, // 注册
  refreshToken
};
