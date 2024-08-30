/**
 * 自定义表单模块控制器
 */
const { pool, YES } =require("@/utils");
/**
 * 
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */

const CoSaveDiyForm = (req, res) => {
  const { creator, table_name, description, content, check_number } = req.validData; // 验证后数据
  let sql = "INSERT INTO form_list(creator, table_name, description, content, check_number, creat_date) VALUES (?,?,?,?,?,?)";
  pool.query(sql, [creator, table_name, description, content, check_number, new Date()], (error, result2) => {
    if (error) throw error;
    $api.ReturnJson(res, {
      code: 1,
      msg: "添加成功",
      data: null
    });
  });
};

const CoEditDiyForm = (req, res) => {
  const { id, creator, table_name, description, content, check_number } = req.validData; // 验证后数据
  sql = "UPDATE form_list SET creator=?, table_name=?, description=?, content=?, check_number=?, creat_date=? WHERE id=?";
  pool.query(sql, [creator, table_name, description, content, check_number, new Date(), id], (error, result2) => {
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
    sql = "UPDATE form_list SET state=? WHERE id=?";
    pool.query(sql, [state, id], (error, result) => {
      if (error) throw error;
      pool.query("UPDATE form_list SET filled=? WHERE id=?", [1, id], (error, result2) => {  // filled置1，开放过不能编辑
        if (error) throw error;
      });
      let sqlT
      if(state === 1) {
        sqlT = "UPDATE fill_in SET state = 1 WHERE form_id = ? AND state = 4"
      } else {
        sqlT = "UPDATE fill_in SET state = 4 WHERE form_id = ? AND state = 1"
      }
      pool.query(sqlT, [id], (error, result2) => {
        if (error) throw error;
      })
      $api.ReturnJson(res, {
        code: 1,
        msg: "修改成功",
        data: null
      });
    });
});
};

const CoChangePermissions = (req, res) => {
  $api.PostArg(req).then(({ id, permissions }) => {
    sql = "UPDATE form_list SET permissions=? WHERE id=?";
    pool.query(sql, [permissions, id], (error, result2) => {
      if (error) throw error;
      $api.ReturnJson(res, {
        code: 1,
        msg: "成功",
        data: null
      });
    });
});
};

const CoDeleteDiyForm = (req, res) => {
  $api.PostArg(req).then(({ id }) => {
    sql = "DELETE FROM form_list WHERE id=?";
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
  $api.PostArg(req).then(({ account }) => {
    let sql,sqlDESC,sqlData = []
    if(account) {
      sql = "SELECT * FROM form_list WHERE permissions LIKE ?";
      sqlDESC = "SELECT * FROM form_list WHERE permissions LIKE ? ORDER BY state DESC";
      sqlData.push('%' + account + '%')
    } else {
      sql = "SELECT * FROM form_list";
      sqlDESC = "SELECT * FROM form_list ORDER BY state DESC";
    }
    pool.query(sql, sqlData, (error, result) => {
      if (error) throw error;
      pool.query(sqlDESC, sqlData, (error, resultD) => {
        if (error) throw error;
        $api.ReturnJson(res, { code: YES, msg: "查询成功", data: { list: result, resultD } });
      });
    });
  });
};
module.exports = {
  CoCarousel,
  CoSaveDiyForm,
  CoEditDiyForm,
  CoChangeState,
  CoDeleteDiyForm,
  CoChangePermissions // 
};
