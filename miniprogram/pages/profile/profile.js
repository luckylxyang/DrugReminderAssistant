// pages/profile/profile.js
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

  getUserInfo:function(e){
    console.log(e.detail.userInfo);
      let userInfo = e.detail.userInfo
      // 登录成功后更新状态
      this.setData({
        isLoggedIn: true,
        userInfo: {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          phoneNumber: '' // 手机号可以通过其他接口获取
        }
      });
      
      // 保存用户信息到本地存储
      wx.setStorageSync('userInfo', userInfo);
      wx.setStorageSync('isLoggedIn', true);
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
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
          // 清除登录状态和用户信息
          this.setData({
            isLoggedIn: false,
            userInfo: {
              nickName: '',
              phoneNumber: '',
              avatarUrl: '/imgs/default-avatar.png'
            }
          });
          
          // 清除本地存储的登录信息
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('isLoggedIn');
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 从本地存储获取登录状态和用户信息
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false;
    const userInfo = wx.getStorageSync('userInfo') || {
      nickName: '',
      phoneNumber: '',
      avatarUrl: '/imgs/default-avatar.png'
    };
    console.log(userInfo);
    // 更新页面状态
    this.setData({
      isLoggedIn,
      userInfo: {
        nickName: userInfo.nickName || '',
        phoneNumber: userInfo.phoneNumber || '',
        avatarUrl: userInfo.avatarUrl || '/imgs/default-avatar.png'
      }
    });
  },
})
const CloudFunctionUtils = require('../../utils/cloudFunctionUtils');