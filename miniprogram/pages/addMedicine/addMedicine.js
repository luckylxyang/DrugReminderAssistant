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
    this.setData({
      time: e.detail.value
    });
  },

  /**
   * 删除当前时间
   */
  deleteTime: function() {
    this.setData({
      time: '08:00'
    });
  },

  /**
   * 添加服药时间
   */
  addMedicineTime: function() {
    const medicineTimes = this.data.medicineTimes;
    medicineTimes.push(this.data.time);
    
    this.setData({
      medicineTimes: medicineTimes,
      time: '08:00' // 重置时间选择器
    });
    
    wx.showToast({
      title: '添加成功',
      icon: 'success'
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
  confirmAdd: function() {
    // 表单验证
    if (!this.data.medicineName) {
      wx.showToast({
        title: '请输入药品名称',
        icon: 'none'
      });
      return;
    }
    
    // 构建药品数据对象
    const medicineData = {
      name: this.data.medicineName,
      dosage: `${this.data.dosageTypes[this.data.dosageTypeIndex]}`,
      manufacturer: this.data.manufacturer,
      instructions: this.data.instructions,
      frequency: this.data.frequency,
      times: this.data.medicineTimes.length > 0 ? this.data.medicineTimes : [this.data.time],
      mealOption: this.data.mealOption,
      notifications: {
        app: this.data.appNotification,
        sms: this.data.smsNotification,
        phone: this.data.phoneNotification
      }
    };
    
    console.log('添加药品数据:', medicineData);
    
    // 这里应该将数据保存到数据库或本地存储
    // 示例中仅显示提示
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