// pages/addMedicine/addMedicine.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    medicineName: '',
    dosage: "",
    dosageTypes: ['片', '毫克', '毫升', '克', '粒', '袋', '支'],
    dosageTypeIndex: 0,
    manufacturer: '',
    instructions: '',
    frequency: 'daily', // 'daily', 'weekly', 'custom'
    time: '08:00',
    medicineTimes: [], // 存储多个服药时间
    mealOption: 'before', // 'before', 'after', 'sleep'
    appNotification: true,
    smsNotification: false,
    phoneNotification: false
  },

  /**
   * 输入药品名称
   */
  inputMedicineName: function(e) {
    this.setData({
      medicineName: e.detail.value
    });
  },

  
  /**
   * 输入剂量
   */
  inputMedicineDosage: function(e) {
    this.setData({
      dosage: e.detail.value
    });
  },

  /**
   * 选择剂量类型
   */
  dosageTypeChange: function(e) {
    this.setData({
      dosageTypeIndex: e.detail.value
    });
  },

  /**
   * 输入生产商
   */
  inputManufacturer: function(e) {
    this.setData({
      manufacturer: e.detail.value
    });
  },

  /**
   * 输入用药说明
   */
  inputInstructions: function(e) {
    this.setData({
      instructions: e.detail.value
    });
  },

  /**
   * 选择用药频率
   */
  selectFrequency: function(e) {
    const frequency = e.currentTarget.dataset.frequency;
    this.setData({
      frequency: frequency
    });
  },

  /**
   * 时间选择器变化
   */
  timeChange: function(e) {
    const index = e.currentTarget.dataset.index;
    const medicineTimes = this.data.medicineTimes;
    medicineTimes[index] = e.detail.value;
    
    this.setData({
      medicineTimes: medicineTimes
    });
  },

  /**
   * 删除指定时间
   */
  deleteTime: function(e) {
    const index = e.currentTarget.dataset.index;
    const medicineTimes = this.data.medicineTimes;
    medicineTimes.splice(index, 1);
    
    this.setData({
      medicineTimes: medicineTimes
    });
  },

  /**
   * 添加服药时间
   */
  addMedicineTime: function() {
    const medicineTimes = this.data.medicineTimes;
    medicineTimes.push('08:00');
    
    this.setData({
      medicineTimes: medicineTimes,
      time: '08:00' // 重置时间选择器
    });
  },

  /**
   * 选择服药时间选项
   */
  selectMealOption: function(e) {
    const option = e.currentTarget.dataset.option;
    this.setData({
      mealOption: option
    });
  },

  /**
   * 切换应用内推送
   */
  toggleAppNotification: function(e) {
    this.setData({
      appNotification: e.detail.value
    });
  },

  /**
   * 切换短信提醒
   */
  toggleSmsNotification: function(e) {
    this.setData({
      smsNotification: e.detail.value
    });
  },

  /**
   * 切换电话提醒
   */
  togglePhoneNotification: function(e) {
    this.setData({
      phoneNotification: e.detail.value
    });
  },

  /**
   * 设置紧急联系人
   */
  setupEmergencyContact: function() {
    // 跳转到紧急联系人设置页面
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 保存草稿
   */
  saveDraft: function() {
    // 保存当前表单数据为草稿
    wx.showToast({
      title: '已保存草稿',
      icon: 'success'
    });
  },

  /**
   * 确认添加药品
   */
  confirmAdd: async function() {
    // 表单验证
    if (!this.data.medicineName) {
      wx.showToast({
        title: '请输入药品名称',
        icon: 'none'
      });
      return;
    }

    // 请求订阅消息权限
    const tmplIds = ['2TlgpFRE8JLU9JQ34fTG6GzyRPcvjhYPyYa-FafvgjU']; // 替换为您的模板ID
    try {
      const res = await wx.requestSubscribeMessage({
        tmplIds: tmplIds
      });
      
      // 用户同意了订阅，记录订阅状态
      if (res[tmplIds[0]] === 'accept') {
        console.log('用户同意订阅消息');
      } else {
        console.log('用户拒绝订阅消息');
      }
    } catch (err) {
      console.error('订阅消息请求失败:', err);
    }
    
    // 构建药品数据对象
    const medicineData = {
      drug_name: this.data.medicineName,
      create_type: "normal",
      drug_dosage: this.data.dosage,
      drug_dosage_unit: `${this.data.dosageTypes[this.data.dosageTypeIndex]}`,
      drug_producer: this.data.manufacturer,
      drug_remark: this.data.instructions,
      frequency: this.data.frequency,
      times: this.data.medicineTimes.length > 0 ? this.data.medicineTimes : [this.data.time],
      mealOption: this.data.mealOption,
      notifications: {
        app: this.data.appNotification,
        sms: this.data.smsNotification,
        phone: this.data.phoneNotification
      },
      status: 'ongoing',
      createTime: new Date(),
      create_user_id: getApp().globalData.userId || ''
    };
    
    wx.showLoading({
      title: '保存中...'
    });

    // 调用云函数添加药品计划
    wx.cloud.callFunction({
      name: 'medicationPlan',
      data: {
        action: 'add',
        data: {
          ...medicineData,
          subscribed: true, // 添加订阅状态
          templateId: '2TlgpFRE8JLU9JQ34fTG6GzyRPcvjhYPyYa-FafvgjU' // 添加模板ID
        }
      }
    }).then(res => {
      wx.hideLoading();
      if (res.result && res.result.success) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          success: () => {
            // 延迟返回上一页
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          }
        });
      } else {
        wx.showToast({
          title: '添加失败',
          icon: 'error'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '添加失败',
        icon: 'error'
      });
      console.error('添加药品计划失败:', err);
    });
  },

  /**
   * 返回上一页
   */
  goBack: function() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果是编辑模式，可以从options中获取药品ID并加载数据
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})