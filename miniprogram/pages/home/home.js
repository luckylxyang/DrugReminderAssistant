// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '2024 年 1 月 15 日',
    weekday: '星期一',
    hasImportantMedicine: true,
    importantMedicineMessage: '您有一个重要药物待服用',
    medicines: [
      {
        name: '阿司匹林肠溶片',
        dosage: '100mg 1片',
        isUrgent: true,
        remainingTime: 15,
        timeUnit: '分钟'
      },
      {
        name: '格列吡嗪片',
        dosage: '5mg 1片',
        isUrgent: false,
        remainingTime: 45,
        timeUnit: '分钟'
      }
    ],
    schedules: [
      {
        time: '07:30',
        name: '阿司匹林肠溶片',
        dosage: '100mg 1片',
        frequency: '每天 1 次',
        isActive: true
      },
      {
        time: '08:00',
        name: '格列吡嗪片',
        dosage: '5mg 1片',
        frequency: '每天 1 次',
        isActive: false
      }
    ],
    activeTimeSlot: 'morning' // 'morning', 'noon', 'evening'
  },

  /**
   * 切换时间段
   */
  switchTimeSlot: function(e) {
    const timeSlot = e.currentTarget.dataset.slot;
    this.setData({
      activeTimeSlot: timeSlot
    });
  },

  /**
   * 立即服用药物
   */
  takeMedicine: function(e) {
    const index = e.currentTarget.dataset.index;
    const medicines = this.data.medicines;
    
    // 在实际应用中，这里应该有更多的逻辑处理，比如记录服药时间等
    wx.showToast({
      title: `已服用${medicines[index].name}`,
      icon: 'success'
    });
    
    // 从列表中移除该药物（示例）
    medicines.splice(index, 1);
    this.setData({
      medicines: medicines
    });
  },

  /**
   * 跳转到添加药物页面
   */
  navigateToAddMedicine: function() {
    wx.navigateTo({
      url: '/pages/addMedicine/addMedicine'
    });
  },

  /**
   * 跳转到个人中心页面
   */
  navigateToProfile: function() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前日期和星期
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdays[now.getDay()];
    
    this.setData({
      date: `${year} 年 ${month} 月 ${day} 日`,
      weekday: `星期${weekday}`
    });
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