$(function() {
    var form =  layui.form
    var layer = layui.layer
    // 在fomr.verify里书写表单的验证规则
    form.verify({
        nickname: function(value) {
            if(value.length > 6) {
                return '昵称必须子啊1~6个字符之间'
            }
        }
    })  
    initUserInfo()
    // 获取用户初始化信息的方法
    function initUserInfo () {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // 通过form.val()可以快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    $('#btnReset').on('click', function(e) {
        // 阻止重置按钮的默认重置行为
        e.preventDefault()
        // 使用initUserInfo()方法，获取并填写用户的基本信息
        initUserInfo() 
    })

    // 表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0) {
                    return layer.msg('更新信息失败')
                }
                layer.msg('更新信息成功')
                // 调用一下父页面里面的方法：getUserInfo()
                window.parent.getUserInfo()
            }
        })
    })

})