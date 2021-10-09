// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  if(options.url.indexOf('/my') !== -1) {
    // 当请求的url中包含/my的时候，再加上请求头
    options.headers = {
      // 这里需要传一个token字符串(从本地浏览器空间取出token字符串)
      Authorization: localStorage.getItem('token') || ''
    }
  }

  options. complete = function(res) {
    // console.log('ok')
    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        // 清空本地浏览器的token字符串
        localStorage.removeItem('token')
        // 强制跳转到登陆页面
        location.href = './login.html'
    }
  }
})
