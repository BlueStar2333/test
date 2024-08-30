/**
 * 自定义表单模块验证
 */

/**
 * 
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一步函数
 * @returns {Void}
 */
const VaSaveDiyForm = (req, res, next) => {
  // POST接收参数
  $api.PostArg(req).then(({ creator, table_name, description, content, check_number }) => {
      req.validData = $api.SaveValidData(req.validData, { creator, table_name, description, content, check_number }); // 保存校验对象
      next(); // 校验通过
  });
};
const VaEditDiyForm = (req, res, next) => {
  // POST接收参数
  $api.PostArg(req).then(({ id, creator, table_name, description, content, check_number }) => {
      req.validData = $api.SaveValidData(req.validData, { id, creator, table_name, description, content, check_number }); // 保存校验对象
      next(); // 校验通过
  });
};
module.exports = {
  VaSaveDiyForm,
  VaEditDiyForm
};
