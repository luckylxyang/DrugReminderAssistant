// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const userCollection = db.collection('userInfo')

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()

  switch (action) {
    case 'getInfo':
      return await getUserInfo(wxContext)
    case 'updateInfo':
      return await updateUserInfo(data, wxContext)
    default:
      return {
        success: false,
        message: '未知的操作类型'
      }
  }
}

// 获取用户信息
async function getUserInfo(wxContext) {
  try {
    const { OPENID } = wxContext
    
    // 查询用户信息
    const userInfo = await userCollection.where({
      _openid: OPENID
    }).get()

    console.log(userInfo);
    return {
      success: true,
      data: userInfo.data[0],
      message: '获取成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 更新用户信息
async function updateUserInfo(data, wxContext) {
  try {
    const { OPENID } = wxContext
    const updateData = {
      ...data,
      updateTime: db.serverDate()
    }

    // 查询用户是否存在
    const user = await userCollection.where({
      _openid: OPENID
    }).get()

    let result
    if (user.data.length === 0) {
      // 用户不存在，创建新用户
      result = await userCollection.add({
        data: {
          _openid: OPENID,
          ...updateData,
          createTime: db.serverDate()
        }
      })
    } else {
      // 用户存在，更新信息
      result = await userCollection.where({
        _openid: OPENID
      }).update({
        data: updateData
      })
    }

    return {
      success: true,
      data: result,
      message: '更新成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}