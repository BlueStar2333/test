/**
 * 账户管理模块验证
 */

/**
 * 验证修改用户信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一步函数
 * @returns {Void}
 */
const VaEditUserInfo = (req, res, next) => {
  $api.PostArg(req).then(data => {
    const {  name, account, password, phone, power } = data; // 接收参数
    req.validData = $api.SaveValidData(req.validData, { name, account, password, phone, power }); // 保存验证对象
    next(); // 验证通过
  });
};


module.exports = {
  VaEditUserInfo, // 验证修改用户信息验证
};
