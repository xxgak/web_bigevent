$(function() {
    var layer = layui.layer
    var form = layui.form
    // 定义一个加载文章分类的方法
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章类别失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render() 
            }
        })
    }

     // 1. 初始化图片裁剪器
     var $image = $('#image')
     
     // 2. 裁剪选项
     var options = {
       aspectRatio: 400 / 280,
       preview: '.img-preview'
     }
     
     // 3. 初始化裁剪区域
     $image.cropper(options)

     $('#btnChooseImage').on('click', function() {
         $('#coverFile').click()
     })

     $('#coverFile').on('change', function(e) {
         var files = e.target.files
         if(files.length === 0) {
            return 
         }
        var file = e.target.files[0]
        //  根据文件创立相对应的url地址
        var newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)       
    })

    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state='草稿'
    })

    $('#form-pud').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 根据form对象new一个FormData对象
        var fd = new FormData($(this)[0])
         // 向fd对象中追加一个属性和属性值
        fd.append('state', art_state)

        // 将裁剪后的图片，输出为文件
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob)
           /*  fd.forEach(function(v,k) {
                console.log(k,v);
            }) */
            // 得到最后一个参数之后，立刻调用函数发起请求
            publishArticle(fd)
        })
    }) 
    
    // 声明一个发表文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 这里需要注意下，如果向服务器提交的是FormData格式的数据，一定要有以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('文章发布失败')
                }
                console.log('222');
                layer.msg('文章发布成功')
                location.href = './art_list.html'
            }
        })
    } 
   


})