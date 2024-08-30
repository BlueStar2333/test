/**
 * 日志模块控制器
 */
const { pool, YES } = require("@/utils");
/**
 * 日志列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */


const searchByData = (req, res) => {
	$api.PostArg(req).then(data => {
		const { user, startDate, endDate } = data;
		let sql,start,end
		if(startDate === '' || endDate === '') {
			sql = "SELECT * FROM logs WHERE user LIKE ? ORDER BY controls_date DESC"
		} else {
			start = global.$api.convertToTimeZone(startDate, 8)
			end = global.$api.convertToTimeZone(endDate, 8)
			sql = "SELECT * FROM logs WHERE user LIKE ? AND controls_date BETWEEN ? AND ? ORDER BY controls_date DESC"
		}
		pool.query(sql, ['%' + user + '%', start, end], (error, result) => {
			if (error) throw error;
			$api.ReturnJson(res, { code: YES, msg: "查询成功", data: result });
		});
	})
};



module.exports = {
	searchByData,
};
