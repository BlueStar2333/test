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
		const { form_id, written_account, startDate, endDate, state, user_id, power } = data;
		let sql = 'SELECT * FROM fill_in WHERE form_id = ? '
		let sqlData = [form_id]
		let start,end
		if(!power) { // power为0
			sql += 'AND written_account = ? '
			sqlData.push(written_account)
		} 
		if(startDate !== '' || endDate !== '') {
			sql += 'AND date BETWEEN ? AND ? '
			start = global.$api.convertToTimeZone(startDate, 8)
			end = global.$api.convertToTimeZone(endDate, 8)
			sqlData.push(start, end)
		}
		if (state) {
			sql += 'AND state = ? '
			sqlData.push(state)
		} 
		if (user_id !== '') {
			sql += 'AND user_id = ? '
			sqlData.push(user_id)
		}
		sql += 'ORDER BY date DESC'
		pool.query(sql, sqlData, (error, result) => {
			if (error) throw error;
			pool.query('SELECT DISTINCT user_id FROM fill_in WHERE form_id = ? AND written_account = ?', [form_id, written_account], (errorId, resultIds) => {
				if (errorId) throw errorId;
				$api.ReturnJson(res, { code: YES, msg: "查询成功", data: { result,resultIds } });
			});
		});
	})
};

function checkAll(old_ct, new_ct, verify_correct) {
	const old_content = JSON.parse(old_ct)
	const new_content = JSON.parse(new_ct)
	const resultData = {
		verify_correct: verify_correct,
		state: 1
	}
	old_content.forEach((itemOne, indexOne) => {
	  if (itemOne.type === 20) {
		if(old_content[indexOne].content.length === new_content[indexOne].content.length) {
			itemOne.content.forEach((itemTwo, indexTwo) => {
				itemTwo.forEach((itemThree, indexThree) => {
					if(old_content[indexOne].content[indexTwo][indexThree].toString() === new_content[indexOne].content[indexTwo][indexThree].toString()) {
						resultData.verify_correct[indexOne][indexTwo][indexThree] = true
					} else {
						resultData.verify_correct[indexOne][indexTwo][indexThree] = false
					}
				})
			})
		} else {
			resultData.verify_correct[indexOne] = false
		}
	  } else {
		if(old_content[indexOne].content.toString() === new_content[indexOne].content.toString()) {
			resultData.verify_correct[indexOne] = true
		} else {
			resultData.verify_correct[indexOne] = false
		}
	  }
	})
	resultData.state = verify_correct.toString().includes('false') ? 3 : 2
	return resultData
}
const addData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { form_id, form_name, written_by, written_account, user_id, content, verify, verify_correct } = data;
		const date = new Date()
		let correct = JSON.stringify(verify_correct)
		let state = 1
		let verify_id = 0
		let checkData = null
		pool.query('SELECT * FROM fill_in WHERE verify = ?', [verify], (error, result) => {
			console.log(verify,result,5546)
			if (error) throw error;
			let sql = "INSERT INTO fill_in(form_id, form_name, written_by, written_account, user_id, date, state, content, verify, verify_correct, verify_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
			if(result.length === 2) {
				console.log(99999)
				$api.ReturnJson(res, { code: 0, msg: "已存在两条相同数据，请录入其他数据" });
				return
			} else if(result.length === 1) {
				verify_id = result[0].verify_id
				checkData = checkAll( result[0].content, content, verify_correct) // 校验所有值
				console.log(checkData,7777)
				state = checkData.state
				correct = JSON.stringify(checkData.verify_correct)
				// 确保两条数据校验值一致
				pool.query("UPDATE fill_in SET state=?, verify_correct=? WHERE id=?", [state, correct, verify_id, result[0].id], (error, result) => {
					if (error) throw error;
				});
			}
			console.log(636363)
			pool.query(sql, [form_id, form_name, written_by, written_account, user_id, date, state, content, verify, correct, verify_id], (error, result) => {
				if (error) throw error;
				if(verify_id === 0) {
					pool.query("UPDATE fill_in SET verify_id=? WHERE id=?", [result.insertId, result.insertId], (error, result) => {
						if (error) throw error;
					});
				}
				// 判断是否查询到信息
				$api.ReturnJson(res, { code: 1, msg: "新增成功" });
			});
		});
	})
};
const editData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { id, content, user_id, verify, oldVerify, verify_correct } = data;
		const date = new Date()
		let correct = JSON.stringify(verify_correct)
		let state = 1
		let checkData = null
		let sql = "UPDATE fill_in SET content=?, user_id=?, date=?, verify=?, verify_correct=?, state=? WHERE id=?";
		pool.query('SELECT * FROM fill_in WHERE id = ?', [id], (error, result) => {
			if (error) throw error;
			if(verify === oldVerify) {

			} else if(verify !== oldVerify) {

			}
			pool.query('SELECT * FROM fill_in WHERE verify = ? AND id != ?', [oldVerify, id], (error, resultT) => {
				if (error) throw error;
				pool.query('SELECT * FROM fill_in WHERE verify = ? AND id != ?', [verify, id], (error, resultX) => {
					if (error) throw error;
					if(resultX.length === 2) {
						$api.ReturnJson(res, { code: 0, msg: "已存在两条相同数据，请录入其他数据" });
						return
					} else if(resultX.length === 1) {
						$api.ReturnJson(res, { code: 0, msg: "已存在两条相同数据，请录入其他数据" });
						return
					}
				})
				if(resultT.length === 1) {
					checkData = checkAll( resultT.content, result.content, verify_correct) // 校验所有值
					console.log(checkData,7777)
					correct = JSON.stringify(checkData.verify_correct)
					state = checkData.state
					verify_correct = checkData.verify_correct
					if(oldVerify === verify) {
						// 确保两条数据校验值一致
						pool.query("UPDATE fill_in SET verify_correct=?, state=? WHERE id=?", [correct, state, resultT[0].id], (error, result2) => {
							if (error) throw error;
						});
					}
				}
				pool.query(sql, [content, user_id, date, verify, correct, state, id], (error, result2) => {
				  if (error) throw error;
				  $api.ReturnJson(res, {
					code: 1,
					msg: "修改成功",
					data: null
				  });
				});
			})
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
