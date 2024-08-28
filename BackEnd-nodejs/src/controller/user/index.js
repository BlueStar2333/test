/**
 * 用户模块控制器
 */
const { pool, YES } = require("@/utils");
/**
 * 用户信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */
// 查询用户列表
const CoUserList = (req, res) => {
  $api.PostArg(req).then(data => {
    const { name, getPower } = data;
	let sql = "SELECT * FROM user WHERE name LIKE ? ORDER BY power DESC";
  console.log(getPower,45)
  if(getPower === 0) {
    sql  = "SELECT * FROM user WHERE name LIKE ? AND power=0";
  }
	pool.query(sql, ['%' + name + '%'], (error, result) => {
		if (error) throw error;
		// 判断是否查询到信息
    $api.ReturnJson(res, { code: YES, msg: "查询成功", data: { list: result } });
		});
	})
};
/**
 * 修改用户信息(昵称、头像、性别、签名)
 * @param {Object} req - 请求对象
 * @param {Object} res - 返回对象
 * @returns {Void}
 */
const CoEditInfo = (req, res) => {
  const { name, account, password, phone, power } = req.validData; // 接收验证参数
  const roles = power ? "admin" : "['自定义表单','表单列表','表单填写']"
  sql = "UPDATE user SET name=?, password=?, phone=?, power=?, roles=?, create_date=? WHERE account=?";
  pool.query(sql, [name, password, phone, power, roles, new Date(), account], (error, result) => {
    if (error) throw error;
    // 判断是否改变信息
    $api.ReturnJson(res, { code: YES, msg: "修改成功" });
  });
};
const CoDeleteUser = (req, res) => {
  $api.PostArg(req).then(({ account }) => {
	let sql = "DELETE FROM user WHERE account=?";
    pool.query(sql, [account], (error, result) => {
      if (error) throw error;
        // 查询新增用户的账号id
        sql2 = "SELECT * FROM user WHERE account=?";
        pool.query(sql2, [account], (error, result2) => {
          if (error) throw error;
          // 判断是否查询到信息
          if (result2.length === 1) {
            $api.ReturnJson(res, { code:0,msg: "删除失败" });
          } else {
            $api.ReturnJson(res, { code: YES, msg: "删除成功" });
          }
        });
    });
	})
};




const CoUserInfo = (req, res) => {
  $api.PostArg(req).then(data => {
    const { account } = data;
	let sql = "SELECT * FROM user WHERE account=?";
	pool.query(sql, [account], (error, result) => {
		if (error) throw error;
		// 判断是否查询到信息
		result.length === 0 ? $api.ReturnJson(res, { msg: "查询失败" }) : $api.ReturnJson(res, { code: YES, msg: "查询成功", data: result[0] });
		});
	})
};
// 好友列表
const CoFriendList = (req, res) => {
  $api.PostArg(req).then(data => {
    const { account,type } = data;
	let sql;
	if(type === 1){
		sql = "SELECT * FROM bind WHERE friend_account=? and is_no=0";
	} else {
		sql = "SELECT * FROM bind WHERE pre_account=? and is_no=1";
	}
	pool.query(sql, [account], (error, result) => {
		if (error) throw error;
		$api.ReturnJson(res, { code: YES, msg: "查询成功", data: result });
		});
	})
};

// 添加好友
const CoaddFriend = (req, res) => {
  $api.PostArg(req).then(data => {
    const { pre_account,friend_account,name,friend_name } = data;
	let sql = "SELECT * FROM bind WHERE pre_account=? and friend_account=?";
	pool.query(sql, [pre_account,friend_account], (error, result) => {
		if (error) throw error;
		if(result.length > 0 ){
			$api.ReturnJson(res, { code: 1, msg: "请勿重复添加", data: result });
		} else {
			let sqla = "INSERT INTO bind(pre_account,friend_account,description,name,friend_name,is_no) VALUES (?,?,?,?,?,0)";
			pool.query(sqla, [pre_account,friend_account,friend_name,name,friend_name], (error, result) => {
				if (error) throw error;
				$api.ReturnJson(res, { code: YES, msg: "发送成功", data: result });
			});
		}
		});
	})
};

const CotongyiAdd = (req, res) => {
  $api.PostArg(req).then(data => {
    const { pre_account,friend_account } = data;
	let sql = "UPDATE bind SET is_no=1 WHERE pre_account=? and friend_account=?";
	pool.query(sql, [pre_account,friend_account], (error, result) => {
		if (error) throw error;
		let sqla = "INSERT INTO bind(pre_account,friend_account,description,name,friend_name,is_no) VALUES (?,?,?,?,?,1)";
		pool.query(sqla, [friend_account,pre_account,pre_account,friend_account,pre_account], (error, result) => {
			if (error) throw error;
			$api.ReturnJson(res, { code: YES, msg: "已同意", data: result });
		});
		});
	})
};

const CotiXing = (req, res) => {
  $api.PostArg(req).then(data => {
    const { name,account } = data;
	let title = name + '发送的提醒消息';
	let date = CurentTime();
	let content = name+'向你发送少玩手机多看书的提醒,少玩手机多看书的提醒,少玩手机多看书的提醒,少玩手机多看书的提醒';
	let sql = "INSERT INTO notice(account,title,date,content) VALUES (?,?,?,?)";
	pool.query(sql, [account,title,date,content], (error, result) => {
		if (error) throw error;
		// 判断是否查询到信息
		result.length === 0 ? $api.ReturnJson(res, { msg: "查询失败" }) : $api.ReturnJson(res, { code: YES, msg: "查询成功", data: result });
		});
	})
};

const CotiXingList = (req, res) => {
  $api.PostArg(req).then(data => {
    const { account } = data;
	let sql = "SELECT * FROM notice WHERE account=?";
	pool.query(sql, [account], (error, result) => {
		if (error) throw error;
		// 判断是否查询到信息
		result.length === 0 ? $api.ReturnJson(res, { msg: "查询失败" }) : $api.ReturnJson(res, { code: YES, msg: "查询成功", data: result });
		});
	})
};

function CurentTime() {
        var now = new Date(); //获取时间
        var date_time = Array(); //定义数组
        var status = 0; //状态
        var clock;
        date_time.push(now.getFullYear()); //年
        date_time.push(now.getMonth() + 1); //月
        date_time.push(now.getDate()); //日
        date_time.push(now.getHours()); //时
        date_time.push(now.getMinutes()); //分
        date_time.push(now.getSeconds()); //秒
        do {
            if (status > 0 && status <= 2) {//处理月日
                if (date_time[status] < 10) {
                    clock += "0";
                }
                if (status < 2) {
                    str = '-';
                } else {
                    str = ' ';
                }
                clock += date_time[status] + str;
            } else if (status > 2 && status <= 5) {//处理时分秒
                if (date_time[status] < 10) {
                    clock += "0";
                }
                if (status < 5) {
                    str = ':';
                } else {
                    str = ' ';
                }
                clock += date_time[status] + str;
            } else {//处理年
                clock = date_time[status] + "-";
            }
            status++;
        } while (status <= 5);
        
        return clock;
    }


module.exports = {
  CoUserList, // 查询用户列表
  CoDeleteUser, // 删除用户
  CoUserInfo, // 用户信息
  CoFriendList, // 好友列表
  CoEditInfo, // 修改用户信息(昵称、头像、性别、签名)
  CoaddFriend, // 添加好友
  CotongyiAdd, // 同意添加
  CotiXingList, // 提醒列表
  CotiXing, //发送提醒
};
