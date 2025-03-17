/**
 * 云函数调用工具类
 */

const DEFAULT_TIMEOUT = 10000; // 默认超时时间 10s
const MAX_RETRY_TIMES = 2; // 最大重试次数

class CloudFunctionUtils {
  /**
   * 调用云函数
   * @param {string} name - 云函数名称
   * @param {Object} data - 传递给云函数的参数
   * @param {Object} options - 配置选项
   * @param {number} options.timeout - 超时时间（毫秒）
   * @param {number} options.retryTimes - 重试次数
   * @returns {Promise} 返回Promise对象
   */
  static async callFunction(name, data = {}, options = {}) {
    const timeout = options.timeout || DEFAULT_TIMEOUT;
    const retryTimes = options.retryTimes || MAX_RETRY_TIMES;
    let currentRetry = 0;

    const callWithTimeout = () => {
      return new Promise((resolve, reject) => {
        // 创建超时计时器
        const timeoutId = setTimeout(() => {
          reject(new Error(`云函数 ${name} 调用超时`));
        }, timeout);

        wx.cloud
          .callFunction({
            name,
            data
          })
          .then(res => {
            clearTimeout(timeoutId);
            console.log(res);
            if (res.result && res.result.success) {
              resolve(res.result);
            } else {
              reject(new Error(res.result?.message || '云函数调用失败'));
            }
          })
          .catch(error => {
            clearTimeout(timeoutId);
            reject(error);
          });
      });
    };

    // 重试机制
    const retry = async () => {
      try {
        return await callWithTimeout();
      } catch (error) {
        if (currentRetry < retryTimes) {
          currentRetry++;
          console.warn(`云函数 ${name} 调用失败，第 ${currentRetry} 次重试`);
          return retry();
        }
        throw error;
      }
    };

    try {
      const result = await retry();
      return {
        success: true,
        data: result.data,
        message: result.message || '调用成功'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || '调用失败'
      };
    }
  }

  /**
   * 判断云函数调用是否成功
   * @param {Object} result - 云函数调用结果
   * @returns {boolean} 是否成功
   */
  static isCallSuccess(result) {
    return result && result.success === true;
  }
}

module.exports = CloudFunctionUtils;