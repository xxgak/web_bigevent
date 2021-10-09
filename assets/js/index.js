// 入口函数
$(function() {
    // 调用函数获取用户基本信息
    getUserInfo()
    // 退出功能的实现
    const layer = layui.layer
    $('#btnLogout').on('click ', function() {
        layer.confirm('您确定要退出吗?', {icon: 3, title:'提示'}, function(index){
            // 清空本地的token
            localStorage.removeItem('token')
            // 跳转到登陆页面
            location.href = './login.html'
            layer.close(index)
        })
    })
})

// 获取用户信息的函数
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // 根据接口文档提示：发起这个请求必须写请求头，里面的Authorization值，是一个token字符串
       /*  headers: {
            // 这里需要传一个token字符串(从本地浏览器空间取出token字符串)
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function(res) {
            if(res.status !== 0) {
                return layui.layer.msg('获取基本信息失败')
            }
            // 如果获取用户基本信息成功，就使用这些基本信息渲染用户头像（调用函数渲染头像）
            renderAvatar(res.data)
        },
        /* complete: function(res) {
            console.log('ok')
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 清空本地浏览器的token字符串
                localStorage.removeItem('token')
                // 强制跳转到登陆页面
                location.href = './login.html'
            }
        } */
    })
}

//渲染用户头像的函数
function renderAvatar(user) {
    var name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染头像
    if(user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img')
        .attr('src', user.user_pic)
        .show()
        $('.text-avatar')
        .hide()
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
} 

