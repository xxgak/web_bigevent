$(function() {
    var layer = layui.layer
    var form = layui.form
    // 获取文章分类的列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res)
                // 使用模板引擎里的template方法来处理res.data
                var htmlStr = template('tpl-table', res)
                $('.layui-table tbody').html(htmlStr)
            }  
        })
    }

    var index = null
    $('#btnAddCate').on('click', function() {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        // console.log('ok')
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('新增类别失败')
                }
                // 新增分类成功的话，就调用函数重新渲染一下文章列表 
                initArtCateList()
                // 并且提示用户新增类别成功
                layer.msg('新增类别成功')
                layer.close(index)
            }
        })
    })

    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // console.log('ok')  
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        // console.log(id)
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res)
                // $('[name=name]').val(res.data.name)
                layui.form.val('form-edit', res.data)    
            }
        })
    })

    // 因为indexEdit表单是动态渲染出来的，所以要通过代理的方式为其绑定事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新错误')
                }
                // 如果更新成功，就调用函数重新加载一下列表内容
                initArtCateList()
                // 并且提示用户新增类别成功
                layer.msg('更新类别成功')
                layer.close(indexEdit)
            }
        })
    })

    // 通过代理的方式为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        // console.log('lk')
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    // 如果请求成功，就调用函数重新加载表格内容
                    initArtCateList()
                    // 并且提示用户删除类别成功
                    layer.msg('更新类别成功')
                }
            }) 
            
            layer.close(index);
        })
    })
})