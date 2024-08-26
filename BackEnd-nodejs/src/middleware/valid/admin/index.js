/**
 * 账户管理模块校验
 */

const { PhoneReg, PwdReg } = require("@/utils");

/**
 * 校验登录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一步函数
 * @returns {Void}
 */
const VaLogin = (req, res, next) => {
  // POST接收参数
  $api.PostArg(req).then(({ account, password }) => {
    // 判断手机号和密码是否符合相应格式
    if (!account || !password) {
      $api.ReturnJson(res, { msg: "手机号或密码格式错误" });
    } else {
      req.validData = $api.SaveValidData(req.validData, { account, password }); // 保存校验对象
      next(); // 校验通过
    }
  });
};
/**
 * 校验注册
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一步函数
 * @returns {Void}
 */
const VaRegister = (req, res, next) => {
  // POST接收参数
  $api.PostArg(req).then(({ name, account, password, phone, power }) => {
    req.validData = $api.SaveValidData(req.validData, { name, account, password, phone, power }); // 保存校验对象
    next(); // 校验通过
  });
};

module.exports = {
  VaLogin, // 校验登录
  VaRegister // 校验注册
};
