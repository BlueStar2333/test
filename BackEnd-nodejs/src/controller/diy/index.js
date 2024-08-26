/**
 * diy表单模块控制器
 */
const { pool, YES } =require("@/utils");
/**
 * 
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */

const CoSaveDiyForm = (req, res) => {
  const { creator, table_name, description, content } = req.validData; // 验证后数据
  let sql = "INSERT INTO forn_list(creator, table_name, description, content, creat_date) VALUES (?,?,?,?,?)";
  pool.query(sql, [creator, table_name, description, content, new Date()], (error, result2) => {
    if (error) throw error;
    $api.ReturnJson(res, {
      code: 1,
      msg: "添加成功",
      data: null
    });
  });
};

const CoEditDiyForm = (req, res) => {
  const { id, creator, table_name, description, content } = req.validData; // 验证后数据
  sql = "UPDATE forn_list SET creator=?, table_name=?, description=?, content=?, creat_date=? WHERE id=?";
  pool.query(sql, [creator, table_name, description, content, new Date(), id], (error, result2) => {
    if (error) throw error;
    $api.ReturnJson(res, {
      code: 1,
      msg: "修改成功",
      data: null
    });
  });
};

const CoChangeState = (req, res) => {
  $api.PostArg(req).then(({ id, state }) => {
    pool.query("UPDATE forn_list SET filled=? WHERE id=?", [1, id], (error, result2) => {
      if (error) throw error;
    });
    sql = "UPDATE forn_list SET state=? WHERE id=?";
    pool.query(sql, [state, id], (error, result2) => {
      if (error) throw error;
      $api.ReturnJson(res, {
        code: 1,
        msg: "修改成功",
        data: null
      });
    });
});
};

const CoDeleteDiyForm = (req, res) => {
  $api.PostArg(req).then(({ id }) => {
    sql = "DELETE FROM forn_list WHERE id=?";
    pool.query(sql, [id], (error, result2) => {
      if (error) throw error;
      $api.ReturnJson(res, {
        code: 1,
        msg: "删除成功",
        data: null
      });
    });
});
};


const CoCarousel = (req, res) => {
  let sql = "SELECT * FROM forn_list";
  pool.query(sql, (error, result) => {
    if (error) throw error;
    $api.ReturnJson(res, { code: YES, msg: "查询成功", data: { list: result } });
  });
};
module.exports = {
  CoCarousel,
  CoSaveDiyForm,
  CoEditDiyForm,
  CoChangeState,
  CoDeleteDiyForm // 
};
