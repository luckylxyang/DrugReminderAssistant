// pages/profile/profile.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: '陈明远',
      phoneNumber: '138****5678',
      avatarUrl: '/imgs/default-avatar.png'
    },
    elderlyMode: false,
    reminderEnabled: true
  },

  /**
   * 打开设置页面
   */
  openSettings: function() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none'
    });
  },

  /**
   * 切换适老化模式
   */
  toggleElderlyMode: function(e) {
    this.setData({
      elderlyMode: e.detail.value
    });
    
    // 这里可以添加适老化模式的具体实现逻辑
    wx.showToast({
      title: e.detail.value ? '已开启适老化模式' : '已关闭适老化模式',
      icon: 'none'
    });
  },

  /**
   * 切换提醒设置
   */
  toggleReminder: function(e) {
    this.setData({
      reminderEnabled: e.detail.value
    });
    
    wx.showToast({
      title: e.detail.value ? '已开启提醒' : '已关闭提醒',
      icon: 'none'
    });
  },

  /**
   * 导航到增值服务页面
   */
  navigateToSubscription: function() {
    wx.showToast({
      title: '增值服务功能开发中',
      icon: 'none'
    });
  },

  /**
   * 导航到订单管理页面
   */
  navigateToOrders: function() {
    wx.showToast({
      title: '订单管理功能开发中',
      icon: 'none'
    });
  },

  /**
   * 导航到问题反馈页面
   */
  navigateToFeedback: function() {
    wx.showToast({
      title: '问题反馈功能开发中',
      icon: 'none'
    });
  },

  /**
   * 导航到关于我们页面
   */
  navigateToAbout: function() {
    wx.showToast({
      title: '关于我们功能开发中',
      icon: 'none'
    });
  },

  /**
   * 退出登录
   */
  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 这里可以添加退出登录的具体实现逻辑
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            success: () => {
              // 可以跳转到登录页面
              // wx.redirectTo({
              //   url: '/pages/login/login',
              // });
            }
          });
        }
      }
    });
  },

  /**
   * 切换底部标签页
   */
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    
    // 根据不同的标签页跳转到对应的页面
    switch(tab) {
      case 'home':
        wx.redirectTo({
          url: '/pages/home/home'
        });
        break;
      case 'medicine':
        wx.showToast({
          title: '用药页面开发中',
          icon: 'none'
        });
        break;
      case 'calendar':
        wx.showToast({
          title: '日程页面开发中',
          icon: 'none'
        });
        break;
      case 'profile':
        // 当前页面，不做跳转
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 可以在这里获取用户信息
    // 例如从缓存中获取用户信息或者调用接口获取
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