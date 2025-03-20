// pages/home/home.js
const CloudFunctionUtils = require('../../utils/cloudFunctionUtils');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoggedIn: false, // 添加登录状态标志
    userInfo: {
      nickName: '',
      phoneNumber: '',
      avatarUrl: '/imgs/default-avatar.png'
    },
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
   * 处理登录/注册点击
   */
  handleLogin: async function() {
    // 先调用云函数获取用户信息
    const result = await CloudFunctionUtils.callFunction('userInfo', {
      action: 'getInfo'
    });

    if (CloudFunctionUtils.isCallSuccess(result) && result.data) {
      // 有用户记录，直接更新本地存储并登录
      const userInfo = result.data;
      this.setData({
        isLoggedIn: true,
        userInfo: {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          phoneNumber: userInfo.phoneNumber || ''
        }
      });
      
      // 保存用户信息到本地存储
      wx.setStorageSync('userInfo', userInfo);
      wx.setStorageSync('isLoggedIn', true);
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
    } else {
      // 无用户记录，跳转到信息输入页面
      wx.navigateTo({
        url: '/pages/profile/userInfo/userInfo'
      });
    }
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

    // 从本地存储获取登录状态和用户信息
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false;
    const userInfo = wx.getStorageSync('userInfo') || {
      nickName: '',
      phoneNumber: '',
      avatarUrl: '/imgs/default-avatar.png'
    };

    this.setData({
      isLoggedIn: isLoggedIn,
      userInfo: userInfo
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
  onShow: async function () {
    // 检查登录状态并更新
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false;
    const userInfo = wx.getStorageSync('userInfo') || {
      nickName: '',
      phoneNumber: '',
      avatarUrl: '/imgs/default-avatar.png'
    };

    // 如果登录状态发生变化，更新页面数据
    if (isLoggedIn !== this.data.isLoggedIn || 
        JSON.stringify(userInfo) !== JSON.stringify(this.data.userInfo)) {
      this.setData({
        isLoggedIn: isLoggedIn,
        userInfo: userInfo
      });

      // 如果已登录，刷新药物提醒数据
      if (isLoggedIn) {
        // TODO: 调用相关云函数获取最新的药物提醒数据
        // 示例：更新药物列表
        // const result = await CloudFunctionUtils.callFunction('drugPlan', {
        //   action: 'getList'
        // });
        // if (CloudFunctionUtils.isCallSuccess(result)) {
        //   this.setData({
        //     medicines: result.data.medicines || [],
        //     schedules: result.data.schedules || []
        //   });
        // }
      }
    }
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