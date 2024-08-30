/**
 * 表单填写模块控制器
 */
const { pool, YES } = require("@/utils");


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


/**
 * 填写列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */


const inquireByData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { form_id, written_account, startDate, endDate, state, user_id, power } = data;
		let sql = 'SELECT * FROM fill_in WHERE form_id = ? '
		let sqlData = [form_id]
		let start,end,str = ''
		if(!power) { // power为0
			sql += 'AND written_account = ? '
			str += 'AND written_account = ?'
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
			pool.query('SELECT DISTINCT user_id FROM fill_in WHERE form_id = ? ' + str, [form_id, written_account], (errorId, resultIds) => {
				if (errorId) throw errorId;
				$api.ReturnJson(res, { code: YES, msg: "查询成功", data: { result,resultIds } });
			});
		});
	})
};

const addData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { form_id, form_name, written_by, written_account, user_id, content, verify, verify_correct_req } = data;
		const date = new Date()
		let verify_correct = JSON.stringify(verify_correct_req)
		let correct = JSON.stringify(verify_correct_req)
		let state = 1
		let checkData = null
		// 上线后开放此代码，测试关闭
		// pool.query('SELECT * FROM fill_in WHERE written_account = ? AND verify=?', [written_account, verify], (error, result) => {
		// 	if (error) throw error;
		// 	if(result.length === 1) {
		// 		$api.ReturnJson(res, { code: 0, msg: "你已录入过此数据，请录入其他数据" });
		// 		return
		// 	}
		// })
		pool.query('SELECT * FROM fill_in WHERE verify = ?', [verify], (error, result) => {
			if (error) throw error;
			let sql = "INSERT INTO fill_in(form_id, form_name, written_by, written_account, user_id, date, state, content, verify, verify_correct) VALUES (?,?,?,?,?,?,?,?,?,?)";
			if(result.length === 2) {
				$api.ReturnJson(res, { code: 0, msg: "已存在两条相同数据，请录入其他数据" });
				return
			} else if(result.length === 1) {
				checkData = checkAll( result[0].content, content, JSON.parse(verify_correct)) // 校验所有值
				state = checkData.state
				correct = JSON.stringify(checkData.verify_correct)
				// 确保两条数据校验值一致
				pool.query("UPDATE fill_in SET state=?, verify_correct=? WHERE id=?", [state, correct, result[0].id], (error, result) => {
					if (error) throw error;
				});
			}
			pool.query(sql, [form_id, form_name, written_by, written_account, user_id, date, state, content, verify, correct], (error, result) => {
				if (error) throw error;
				// 判断是否查询到信息
				$api.ReturnJson(res, { code: 1, msg: "新增成功" });
			});
		});
	})
};
const editData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { id, content, user_id, verify, oldVerify, verify_correct_req, written_account } = data;
		let verify_correct = JSON.stringify(verify_correct_req)
		let correct = JSON.stringify(verify_correct_req)
		let state = 1
		let checkData = null
		let sql = "UPDATE fill_in SET content=?, user_id=?, verify=?, verify_correct=?, state=? WHERE id=?";
		// 上线后开放此代码，测试关闭
		// pool.query('SELECT * FROM fill_in WHERE written_account = ? AND verify=?', [written_account, verify], (error, result) => {
		// 	if (error) throw error;
		// 	if(result.length === 1) {
		// 		$api.ReturnJson(res, { code: 0, msg: "你已录入过此数据，请录入其他数据" });
		// 		return
		// 	}
		// })
		pool.query('SELECT * FROM fill_in WHERE id = ?', [id], (error, result) => {
			if (error) throw error;
			if(verify === oldVerify) { // 校验项的值不变
				pool.query('SELECT * FROM fill_in WHERE verify = ? AND id != ?', [verify, id], (error, resultT) => {
					if (error) throw error;
					if(resultT.length === 1) {
						checkData = checkAll( resultT[0].content, content, JSON.parse(verify_correct)) // 校验所有值
						correct = JSON.stringify(checkData.verify_correct)
						state = checkData.state
						// 确保两条数据校验值一致
						pool.query("UPDATE fill_in SET verify_correct=?, state=? WHERE id=?", [correct, state, resultT[0].id], (error, resultTW) => {
							if (error) throw error;
						});
					}
					pool.query(sql, [content, user_id, verify, correct, state, id], (error, result2) => {
					  if (error) throw error;
					  $api.ReturnJson(res, { code: 1, msg: "修改成功", data: null });
					});
				})
			} else if(verify !== oldVerify) { // 校验项的值改变
				pool.query('SELECT * FROM fill_in WHERE verify = ? AND id != ?', [oldVerify, id], (error, resultT) => {
					if (error) throw error;
					pool.query('SELECT * FROM fill_in WHERE verify = ? AND id != ?', [verify, id], (error, resultTW) => {
						if (error) throw error;
						if(resultT.length === 2 || resultTW.length === 2) {
							$api.ReturnJson(res, { code: 0, msg: "已存在两条相同数据，请录入其他数据" });
							return
						} else if(resultT.length === 1) {
							correct = verify_correct
							// 确保两条数据校验值一致
							pool.query("UPDATE fill_in SET verify_correct=?, state=? WHERE id=?", [verify_correct, 1, resultT[0].id], (error, resultTW) => {
								if (error) throw error;
							});
						}
						if(resultTW.length === 1) {
							checkData = checkAll( resultTW[0].content, content, JSON.parse(verify_correct)) // 校验所有值
							correct = JSON.stringify(checkData.verify_correct)
							state = checkData.state
							// 确保两条数据校验值一致
							pool.query("UPDATE fill_in SET verify_correct=?, state=? WHERE id=?", [correct, state, resultTW[0].id], (error, res) => {
								if (error) throw error;
							});
						}
						pool.query(sql, [content, user_id, verify, correct, state, id], (error, result2) => {
						  if (error) throw error;
						  $api.ReturnJson(res, { code: 1, msg: "修改成功", data: null });
						});
					})
				})
			}
		});
	})
};
const deleteData = (req, res) => {
	$api.PostArg(req).then(({ id, verify }) => {
		sql = "DELETE FROM fill_in WHERE id=?";
		pool.query('SELECT * FROM fill_in WHERE verify=? AND id != ?', [verify, id], (error, result) => {
			if (error) throw error;
			if(result.length === 1) {
				pool.query("UPDATE fill_in SET state=? WHERE id=?", [1, result[0].id], (error, res) => {
					if (error) throw error;
				});
			}
			pool.query(sql, [id], (error, result2) => {
				if (error) throw error;
				$api.ReturnJson(res, { code: 1, msg: "删除成功", data: null });
			});
			
		})
	});
};



module.exports = {
	inquireByData,
	deleteData,
	addData,
	editData
};
