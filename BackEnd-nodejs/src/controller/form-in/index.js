/**
 * 图文模块控制器
 */
const { pool, YES } = require("@/utils");
/**
 * 文章列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */


const inquireByData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { form_id, written_account, startDate, endDate, power } = data;
		let str = power ? '' : 'AND written_account = ? '
		let sql,start,end,sqlData = [form_id]
		if(startDate === '' || endDate === '') {
			sql = "SELECT * FROM fill_in WHERE form_id = ? " + str
			sqlData.push(written_account)
		} else {
			start = global.$api.convertToTimeZone(startDate, 8)
			end = global.$api.convertToTimeZone(endDate, 8)
			sql = "SELECT * FROM fill_in WHERE form_id = ? AND date BETWEEN ? AND ?" + str
			sqlData.push(start, end)
		}
		pool.query(sql, sqlData, (error, result) => {
			if (error) throw error;
			$api.ReturnJson(res, { code: YES, msg: "查询成功", data: result });
		});
	})
};

const deleteData = (req, res) => {
  $api.PostArg(req).then(({ id }) => {
    sql = "DELETE FROM fill_in WHERE id=?";
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
const addData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { form_id, form_name, written_by, written_account, content } = data;
		const date = new Date()
		const state = 1
		let sql = "INSERT INTO fill_in(form_id, form_name, written_by, written_account, date, state, content) VALUES (?,?,?,?,?,?,?)";
		pool.query(sql, [form_id, form_name, written_by, written_account, date, state, content], (error, result) => {
			if (error) throw error;
			// 判断是否查询到信息
			$api.ReturnJson(res, { code: 1, msg: "新增成功" });
		});
	})
};
const editData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { id, content } = data;
		const date = new Date()
		const state = 1
		sql = "UPDATE fill_in SET content=?, date=?, state=? WHERE id=?";
		pool.query(sql, [content, date, state, id], (error, result2) => {
		  if (error) throw error;
		  $api.ReturnJson(res, {
			code: 1,
			msg: "修改成功",
			data: null
		  });
		});
	})
};















const CoArticleList = (req, res) => {
	let sql = "SELECT * FROM article";
	pool.query(sql, Object.values(req.validData), (error, result) => {
		if (error) throw error;
		// 判断查询到数据是否为空
		if (result.length !== 0) {
			// 转化时间
			result.forEach(elem => {
				elem.createTime = $api.Format(elem.createTime);
			});
		}
		$api.ReturnJson(res, {
			code: YES,
			msg: "查询成功",
			data: {
				list: result
			}
		});
	});
};
/**
 * 文章详情
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */
const CoArticleDetails = (req, res) => {
	$api.PostArg(req).then(data => {
		const {
			id
		} = data;
		let sql = "SELECT * FROM article WHERE id=?";
		pool.query(sql, [id], (error, result) => {
			if (error) throw error;
			// 判断是否查询到信息
			if (result.length === 0) {
				$api.ReturnJson(res, {
					msg: "查询失败"
				});
			} else {
				// 转化时间
				result.forEach(elem => {
					elem.createTime = $api.Format(elem.createTime);
				});
				$api.ReturnJson(res, {
					code: YES,
					msg: "查询成功",
					data: result[0]
				});
			}
		});
	})
};



module.exports = {
	inquireByData,
	deleteData,
	addData,
	editData,
	


	CoArticleList, // 文章列表
	CoArticleDetails, // 文章详情
};
