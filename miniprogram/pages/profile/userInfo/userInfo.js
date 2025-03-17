
const CloudFunctionUtils = require('../../../utils/cloudFunctionUtils');
Page({
  data: {
    avatarUrl: '/assets/default-avatar.png',
    nickName: ''
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    console.log(userInfo);
    if (userInfo.avatarUrl) {
      this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName || ''
      })
    }
  },

  onChooseAvatar(e) {
      console.log(e);
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl
    })
    this.updateUserInfo()
  },

  onInputChange(e) {
    this.updateUserInfo()
  },

  async updateUserInfo() {
    // 验证头像和昵称
    if (this.data.avatarUrl === '/assets/default-avatar.png') {
      wx.showToast({
        title: '请选择头像',
        icon: 'none'
      });
      return;
    }
    if (!this.data.nickName.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    const userInfo = {
      avatarUrl: this.data.avatarUrl,
      nickName: this.data.nickName
    }
    wx.setStorageSync('userInfo', userInfo)

    // 调用云函数更新用户信息
    const result = await CloudFunctionUtils.callFunction('userInfo', {
      action: 'updateInfo',
      data: userInfo
    });

    if (CloudFunctionUtils.isCallSuccess(result)) {
      wx.setStorageSync('isLoggedIn', true);
      wx.showToast({
        title: '信息更新成功',
        icon: 'success'
      });
      // 返回到个人中心页面
      wx.navigateBack();
    } else {
      console.error('用户信息更新失败', result.message);
      wx.showToast({
        title: '信息更新失败',
        icon: 'none'
      });
    }
  }
})