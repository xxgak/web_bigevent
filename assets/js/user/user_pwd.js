$(function() {
    var form = layui.form
    var layer = layui.layer
    // 使用form.verify方法自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'] ,
        samePwd: function(value) {
            if(value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function(value) {
            if(value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            } 
        }
    })

    // 为表单绑定提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('密码更新失败')
                }
                layer.msg('密码更新成功')
                // 用[0],将jquery对象，转成dom对象(然后用reset方法重置表单)
                $('.layui-form')[0].reset()
            }
        })
    })
})