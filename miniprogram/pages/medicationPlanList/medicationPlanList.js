// pages/medicationPlanList/medicationPlanList.js
Page({
    data: {
        currentStatus: 'all',
        searchKeyword: '',
        medicationPlans: [],
        page: 1,
        pageSize: 10,
        isLoading: false,
        noMore: false,
        isRefreshing: false
    },

    onLoad: function () {
        this.loadMedicationPlans()
    },

    // 切换状态标签
    switchStatus: function (e) {
        const status = e.currentTarget.dataset.status
        this.setData({
            currentStatus: status,
            medicationPlans: [],
            page: 1,
            noMore: false
        }, () => {
            this.loadMedicationPlans()
        })
    },

    // 搜索药品
    onSearch: function (e) {
        const keyword = e.detail.value
        this.setData({
            searchKeyword: keyword,
            medicationPlans: [],
            page: 1,
            noMore: false
        }, () => {
            this.loadMedicationPlans()
        })
    },

    // 加载药品计划列表
    loadMedicationPlans: async function () {
        if (this.data.isLoading || this.data.noMore) return

        this.setData({
            isLoading: true
        })

        try {
            let res = await wx.cloud.callFunction({
                name: 'medicationPlan',
                data: {
                    action: 'list',
                    data: {
                        status: this.data.currentStatus === 'all' ? undefined : this.data.currentStatus,
                        page: this.data.page,
                        pageSize: this.data.pageSize,
                        keyword: this.data.searchKeyword
                    }
                }
            })
            console.log("", res);
            if (!res.result.success) {
                wx.showToast({
                    title: '加载失败',
                    icon: 'error'
                })
                return
            }
            let list = res.result.data.list
            let total = res.result.data.total
            // 处理状态文本
            const plans = list.map(plan => ({
                ...plan,
                statusText: this.getStatusText(plan.status)
            }))

            this.setData({
                medicationPlans: [...this.data.medicationPlans, ...plans],
                noMore: this.data.medicationPlans.length + plans.length >= total,
                page: this.data.page + 1
            })
        } catch (err) {
            console.log(err);
            wx.showToast({
                title: '加载失败',
                icon: 'error'
            })
        } finally {
            this.setData({
                isLoading: false,
                isRefreshing: false
            })
        }
    },

    // 获取状态文本
    getStatusText: function (status) {
        const statusMap = {
            'ongoing': '进行中',
            'stopped': '已停用',
            'expired': '已过期'
        }
        return statusMap[status] || '未知'
    },

    // 查看详情
    viewDetail: function (e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/medicationPlanDetail/medicationPlanDetail?id=${id}`
        })
    },

    // 加载更多
    loadMore: function () {
        if (!this.data.isLoading && !this.data.noMore) {
            this.loadMedicationPlans()
        }
    },

    // 下拉刷新
    onRefresh: function () {
        this.setData({
            medicationPlans: [],
            page: 1,
            noMore: false,
            isRefreshing: true
        }, () => {
            this.loadMedicationPlans()
        })
    }
})