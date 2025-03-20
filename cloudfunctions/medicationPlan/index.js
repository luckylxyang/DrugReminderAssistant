// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const medicationPlanCollection = db.collection('drug_plan')

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data } = event

  switch (action) {
    case 'add':
      return await addPlan(data)
    case 'delete':
      return await deletePlan(data)
    case 'update':
      return await updatePlan(data)
    case 'get':
      return await getPlan(data)
    case 'list':
      return await listPlans(data)
    default:
      return {
        success: false,
        message: '未知的操作类型'
      }
  }
}

// 发送订阅消息
async function sendSubscribeMessage(openid, data) {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: openid,
      templateId: "2TlgpFRE8JLU9JQ34fTG6GzyRPcvjhYPyYa-FafvgjU",
      page: 'pages/home/home',
      data: {
        thing2: { value: data.drug_name }, // 药品名称
        time3: { value: `${new Date().toLocaleDateString()} ${data.times[0]}` }, // 服药时间
        thing4: { value: `${data.drug_dosage}${data.drug_dosage_unit}` }, // 服药剂量
        thing5: { value: data.drug_remark || '无' }, // 服药说明
        thing1: "用药时间到了" // 服药说明
      }
    });
    return result;
  } catch (err) {
    console.error('发送订阅消息失败:', err);
    return null;
  }
}

// 添加药品计划
async function addPlan(data) {
  try {
    const {
        OPENID,
        APPID,
        UNIONID,
        ENV,
      } = cloud.getWXContext()
    // console.log("id", OPENID, UNIONID);
    const result = await medicationPlanCollection.add({
      data: {
        ...data,
        create_user_id: OPENID,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    // 如果用户订阅了提醒，发送订阅消息
    if (data.subscribed && data.templateId) {
      await sendSubscribeMessage(OPENID, data);
    }

    return {
      success: true,
      data: result,
      message: '添加成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 删除药品计划
async function deletePlan({ _id }) {
  try {
    const result = await medicationPlanCollection.doc(_id).remove()
    return {
      success: true,
      data: result,
      message: '删除成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 更新药品计划
async function updatePlan({ _id, ...data }) {
  try {
    const result = await medicationPlanCollection.doc(_id).update({
      data: {
        ...data,
        updateTime: db.serverDate()
      }
    })
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

// 获取单个药品计划
async function getPlan({ _id }) {
  try {
    const result = await medicationPlanCollection.doc(_id).get()
    return {
      success: true,
      data: result.data,
      message: '获取成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 获取药品计划列表
async function listPlans({ status, keyword, page = 1, pageSize = 10 }) {
  try {
    let query = medicationPlanCollection
    let where = {}
    // 构建查询条件
    // if (userId) {
    //   query = query.where({
    //     userId: userId
    //   })
    // }
    if (status !== undefined) {
        where["status"] = status
    }
    if (keyword !== ""){
        where["keyword"] = keyword
    }
    console.log(where);
    query = query.where(where)
    // 获取总数
    const countResult = await query.count()
    
    // 分页查询
    const result = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('createTime', 'desc')
      .get()

    return {
      success: true,
      data: {
        list: result.data,
        total: countResult.total,
        page,
        pageSize
      },
      message: '获取成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}