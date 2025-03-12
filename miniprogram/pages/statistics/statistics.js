Page({
  data: {
    period: 'week',
    adherenceRate: 92,
    adherenceChange: 3,
    medicationCount: 2,
    medicationCountChange: -1,
    hasAlert: true,
    alertMessage: '连续3天未按时服用降压药，建议及时就医咨询。',
    medicationRecords: [
      {
        id: 1,
        drugName: '阿司匹林',
        dosage: '100mg',
        time: '08:00',
        status: 'completed',
        statusText: '已服用'
      },
      {
        id: 2,
        drugName: '硝苯地平',
        dosage: '10mg',
        time: '12:00',
        status: 'missed',
        statusText: '未按时服用'
      },
      {
        id: 3,
        drugName: '维生素D',
        dosage: '',
        time: '20:00',
        status: 'missed',
        statusText: '未服用'
      }
    ]
  },

  onLoad: function() {
    this.loadStatisticsData()
    this.drawTimeDistributionChart()
  },

  // 切换周期
  switchPeriod: function(e) {
    const period = e.currentTarget.dataset.period
    this.setData({ period }, () => {
      this.loadStatisticsData()
      this.drawTimeDistributionChart()
    })
  },

  // 加载统计数据
  loadStatisticsData: async function() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'statistics',
        data: {
          action: 'getStatistics',
          period: this.data.period
        }
      })

      if (res.result.success) {
        this.setData({
          adherenceRate: res.result.data.adherenceRate,
          adherenceChange: res.result.data.adherenceChange,
          medicationCount: res.result.data.medicationCount,
          medicationCountChange: res.result.data.medicationCountChange,
          medicationRecords: res.result.data.recentRecords,
          hasAlert: res.result.data.hasAlert,
          alertMessage: res.result.data.alertMessage
        })
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'error'
        })
      }
    } catch (err) {
      console.error('加载统计数据失败:', err)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    }
  },

  // 绘制时间分布图表
  drawTimeDistributionChart: function() {
    const ctx = wx.createCanvasContext('timeDistributionChart')
    // 这里添加图表绘制逻辑
    // 可以使用微信小程序的Canvas API绘制折线图
    // 或者引入第三方图表库如echarts-for-wechat
    ctx.draw()
  },

  // 处理异常提醒
  handleAlert: function() {
    wx.navigateTo({
      url: '/pages/medicationPlanDetail/medicationPlanDetail'
    })
  },

  // 生成报告
  generateReport: function() {
    // 实现报告生成逻辑
    wx.showLoading({
      title: '生成中...'
    })
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '报告已生成',
        icon: 'success'
      })
    }, 1500)
  },

  // 分享给家人
  shareStatistics: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onShareAppMessage: function() {
    return {
      title: '我的用药统计报告',
      path: '/pages/statistics/statistics'
    }
  }
})