/**
 * 表单填写模块控制器
 */
const { pool, YES } = require("@/utils");


function formatDate(date) {
	date = new Date(date)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0') // 月份是从0开始的
	const day = String(date.getDate()).padStart(2, '0')
	// const hours = String(date.getHours()).padStart(2, '0')
	// const minutes = String(date.getMinutes()).padStart(2, '0')

	return `${year}-${month}-${day}`
}


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
		const { form_id, written_account, startDate, endDate, state, user_id, power, n, limit, searchUsers } = data;
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
		if (searchUsers.length !== 0) {
			sql += 'AND written_account IN (?) '
			sqlData.push(searchUsers)
		}
		sql += 'ORDER BY date DESC '
		if (n) {
			let page = (n-1)*limit
			sql += 'LIMIT ? OFFSET ? '
			sqlData.push(limit)
			sqlData.push(page)
		}
		pool.query(sql, sqlData, (error, result) => { // 分页查询数据
			if (error) throw error;
			pool.query(sql.replace('*', 'COUNT(*) AS length').replace(`LIMIT ? OFFSET ? `, ''), sqlData, (errorLen, resultLen) => { // 查询表总长度
				if (errorLen) throw errorLen;
				pool.query('SELECT DISTINCT user_id FROM fill_in WHERE form_id = ? ' + str, [form_id, written_account], (errorId, resultIds) => {
					if (errorId) throw errorId;
					$api.ReturnJson(res, { code: YES, msg: "查询成功", data: { result, resultIds, resultLen: resultLen[0] } });
				});
			});
		});
	})
};

const getNumData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { form_id } = data;
		let sql = `SELECT   
						written_by,  
						SUM(CASE WHEN state = 1 THEN 1 ELSE 0 END) AS await_count,  
						SUM(CASE WHEN state = 2 THEN 1 ELSE 0 END) AS correct_count,  
						SUM(CASE WHEN state = 3 THEN 1 ELSE 0 END) AS mistake_count,  
						SUM(CASE WHEN state = 4 THEN 1 ELSE 0 END) AS uncompleted_count,
						COUNT(*) AS total
					FROM   
						fill_in  
					WHERE   
						form_id = ?
					GROUP BY   
						written_by;`
		pool.query(sql, [form_id], (error, result) => {
			if (error) throw error;
			$api.ReturnJson(res, { code: YES, msg: "查询成功", data: { result } });
		});
	})
};

const getGraphicData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { form_id, startDate, endDate, fields } = data;
		// 请求填写人员
		pool.query('SELECT DISTINCT written_by FROM fill_in WHERE form_id = ?;', [form_id], (error, resultA) => {
			if (error) throw error;
			const data = {}
			// 存值，后面按下标字符串
			const resultMap = ['','await_count','correct_count','mistake_count','uncompleted_count','total']
			resultA.forEach(item => {
				data[item.written_by] = { 
					"written_by": item.written_by ,
					"await_count": 0,
					"correct_count": 0,
					"mistake_count": 0,
					"uncompleted_count": 0,
					"total": 0
				}
			})
			
			const sqlData = [form_id]
			let sql = `SELECT   
							written_by, verify, state
						FROM   
							fill_in  
						WHERE   
							form_id = ?`
			
			if(startDate !== '' || endDate !== '') {
				sql += ' AND date BETWEEN ? AND ? '
				start = global.$api.convertToTimeZone(startDate, 8)
				end = global.$api.convertToTimeZone(endDate, 8)
				sqlData.push(start, end)
			}
			// 请求填写数据
			pool.query(sql, sqlData, (error, resultB) => {
				if (error) throw error;
				// console.log(resultB,resultB.length,999)
				// 存值方式为 '唯一键'：state
				const DataMap = new Map(); 
				// 把需要的校验项取出来，去重
				resultB.forEach(item => {
					let str = item.written_by
					const arr = form_id === 18 ? item.verify.slice(1).split('-') : item.verify.slice(1).split('-*');
					fields.forEach(Idx => {
						str = str + '-' + arr[Idx]
					})
					if (DataMap.has(str)) {
						// 聚合去重状态优先级为4，3，1，2
						if (item.state === 4) {
							DataMap.set(str, 4)
						}
						if (item.state === 3 && DataMap.get(str) !== 4) {
							DataMap.set(str, 3)
						}
						if (item.state === 2 && DataMap.get(str) !== 4 && DataMap.get(str) !== 3 && DataMap.get(str) !== 1) {
							DataMap.set(str, 2)
						}
						if (item.state === 1 && DataMap.get(str) !== 4 && DataMap.get(str) !== 3) {
							DataMap.set(str, 1)
						}
					} else {
						DataMap.set(str, item.state)
					}
				})
				// 聚合去重后计算结果
				DataMap.forEach((value, key, map) => {
					const personnel = form_id === 18 ? key.split('-')[0] : key.split('-*')[0]
					data[personnel][resultMap[value]] ++
					data[personnel]['total'] ++
				});
				// 使用 Object.values() 获取所有值，并将其转换为数组
				const resultArray = Object.values(data);
				
				$api.ReturnJson(res, { code: YES, msg: "查询成功", data: resultArray });
			});
		});

	})
};




const getBrokenLineData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { form_id, startDate, endDate, fields } = data;
		// 请求填写人员
		pool.query('SELECT DISTINCT written_by FROM fill_in WHERE form_id = ?;', [form_id], (error, resultA) => {
			if (error) throw error;
			const peoples = []
			// 存值，后面按下标字符串
			const resultMap = ['','await_count','correct_count','mistake_count','uncompleted_count','total']
			resultA.forEach(item => {
				peoples.push(item.written_by)
				// [0,0,0,item.written_by,'']
			})
			
			const dates = []
			const sqlData = [form_id]
			let sql = `SELECT   
							written_by, verify, state, date
						FROM   
							fill_in  
						WHERE   
							form_id = ?`
			
			if(startDate !== '' || endDate !== '') {
				sql += ' AND date BETWEEN ? AND ? '
				start = global.$api.convertToTimeZone(startDate, 8)
				end = global.$api.convertToTimeZone(endDate, 8)
				sqlData.push(start, end)
			}
			// 请求填写数据
			pool.query(sql, sqlData, (error, resultB) => {
				if (error) throw error;
				// console.log(resultB,resultB[999],formatDate(resultB[999].date),999)
				// 存值方式为 '唯一键'：state
				const DataMap = new Map(); 
				// 把需要的校验项取出来，去重
				resultB.forEach(item => {
					const fDate = formatDate(item.date)
					let str = item.written_by
					const arr = form_id === 18 ? item.verify.slice(1).split('-') : item.verify.slice(1).split('-*');
					fields.forEach(Idx => {
						str = str + '-' + arr[Idx]
					})
					if (!DataMap.has(str)) {
						DataMap.set(str, fDate)
					}
					if (dates.indexOf(fDate) === -1) {
						dates.push(fDate)
					}
				})
				// console.log(dates,5556)
				const resultArray = []
				const totalMap = new Map(); 
				// 循环编辑计算存储总量 '人名+日期'：'数量'
				DataMap.forEach((value, key, map) => {
					str = form_id === 18 ? key.split('-')[0] + value : key.split('-*')[0] + value
					if (totalMap.has(str)) {
						const num = totalMap.get(str) + 1
						totalMap.set(str, num)
					} else {
						totalMap.set(str, 1)
					}
				});
				// 得到最后数据数据
				dates.forEach(itemD => {
					peoples.forEach(itemP => {
						let total = 0
						if(totalMap.has(itemP + itemD)) {
							total = totalMap.get(itemP + itemD)
						}
						resultArray.push([total,85.3,256663,itemP.slice(2),Number(itemD.slice(5,7) + itemD.slice(8))])
					})
				})
				peoples.forEach((itemP, index) => {
					peoples[index] = itemP.slice(2)
				})
				$api.ReturnJson(res, { code: YES, msg: "查询成功", data: { peoples, resultArray } });
			});
		});

	})
};

const addData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { form_id, form_name, written_by, written_account, user_id_req, content, verify_req, verify_correct_req } = data;
		const reqContent = Buffer.from(content, 'base64').toString('utf8')
		const verify = Buffer.from(verify_req, 'base64').toString('utf8')
		const user_id = Buffer.from(user_id_req, 'base64').toString('utf8')
		const date = new Date()
		let verify_correct = JSON.stringify(verify_correct_req)
		let correct = JSON.stringify(verify_correct_req)
		let state = 1
		let checkData = null
		// 上线后开放此代码，测试关闭
		pool.query('SELECT * FROM fill_in WHERE written_account = ? AND verify=?', [written_account, verify], (error, result) => {
			if (error) throw error;
			if(result.length === 1) {
				$api.ReturnJson(res, { code: 0, msg: "你已录入过此数据，请录入其他数据" });
				return
			}
			pool.query('SELECT * FROM fill_in WHERE verify = ?', [verify], (error, result) => {
				if (error) throw error;
				let sql = "INSERT INTO fill_in(form_id, form_name, written_by, written_account, user_id, date, state, content, verify, verify_correct) VALUES (?,?,?,?,?,?,?,?,?,?)";
				if(result.length === 2) {
					$api.ReturnJson(res, { code: 0, msg: "已存在两条相同数据，请录入其他数据" });
					return
				} else if(result.length === 1) {
					checkData = checkAll( result[0].content, reqContent, JSON.parse(verify_correct)) // 校验所有值
					state = checkData.state
					correct = JSON.stringify(checkData.verify_correct)
					// 确保两条数据校验值一致
					pool.query("UPDATE fill_in SET state=?, verify_correct=? WHERE id=?", [state, correct, result[0].id], (error, result) => {
						if (error) throw error;
					});
				}
				pool.query(sql, [form_id, form_name, written_by, written_account, user_id, date, state, reqContent, verify, correct], (error, result) => {
					if (error) throw error;
					// 判断是否查询到信息
					$api.ReturnJson(res, { code: 1, msg: "新增成功" });
				});
			});
		})
	})
};
const editData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { id, content, user_id_req, verify_req, oldVerify, verify_correct_req, written_account } = data;
		const reqContent = Buffer.from(content, 'base64').toString('utf8')
		const verify = Buffer.from(verify_req, 'base64').toString('utf8')
		const user_id = Buffer.from(user_id_req, 'base64').toString('utf8')
		// console.log(content,456)
		// console.log(reqContent,456325)
		// console.log(a)
		let verify_correct = JSON.stringify(verify_correct_req)
		let correct = JSON.stringify(verify_correct_req)
		let state = 1
		let checkData = null
		let sql = "UPDATE fill_in SET content=?, user_id=?, verify=?, verify_correct=?, state=? WHERE id=?";
		// 上线后开放此代码，测试关闭
		pool.query('SELECT * FROM fill_in WHERE written_account = ? AND verify=? AND id != ?', [written_account, verify, id], (error, result) => {
			if (error) throw error;
			if(result.length === 1) {
				$api.ReturnJson(res, { code: 0, msg: "你已录入过此数据，请录入其他数据" });
				return
			}
			pool.query('SELECT * FROM fill_in WHERE id = ?', [id], (error, result) => {
				if (error) throw error;
				if(verify === oldVerify) { // 校验项的值不变
					pool.query('SELECT * FROM fill_in WHERE verify = ? AND id != ?', [verify, id], (error, resultT) => {
						if (error) throw error;
						if(resultT.length === 1) {
							checkData = checkAll( resultT[0].content, reqContent, JSON.parse(verify_correct)) // 校验所有值
							correct = JSON.stringify(checkData.verify_correct)
							state = checkData.state
							// 确保两条数据校验值一致
							pool.query("UPDATE fill_in SET verify_correct=?, state=? WHERE id=?", [correct, state, resultT[0].id], (error, resultTW) => {
								if (error) throw error;
							});
						}
						pool.query(sql, [reqContent, user_id, verify, correct, state, id], (error, result2) => {
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
								checkData = checkAll( resultTW[0].content, reqContent, JSON.parse(verify_correct)) // 校验所有值
								correct = JSON.stringify(checkData.verify_correct)
								state = checkData.state
								// 确保两条数据校验值一致
								pool.query("UPDATE fill_in SET verify_correct=?, state=? WHERE id=?", [correct, state, resultTW[0].id], (error, res) => {
									if (error) throw error;
								});
							}
							pool.query(sql, [reqContent, user_id, verify, correct, state, id], (error, result2) => {
							  if (error) throw error;
							  $api.ReturnJson(res, { code: 1, msg: "修改成功", data: null });
							});
						})
					})
				}
			});
		})
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
	getNumData,
	getGraphicData,
	getBrokenLineData,
	deleteData,
	addData,
	editData
};
