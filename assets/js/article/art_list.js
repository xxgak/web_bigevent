$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
     // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        // console.log('oooppp');
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = dt.getMonth() + 1
        m = padZero(m)
        var d = dt.getDate()
        d = padZero(d)

        var hh = dt.getHours()
        hh = padZero(hh)
        var mm = dt.getMinutes()
        mm = padZero(mm)
        var ss = dt.getSeconds()
        ss = padZero(ss)

        return y + '-' + m + '-' +  d + ' ' +  hh  + ':' +  mm  + ':' +  ss
    }
    
    function padZero(n) {
        return n > 9 ? n : '0' + n
    } 


    var q = {
        pagenum: 1,//页码
        pagesize: 2,//每页显示几条数据
        cate_id: '',//文章的类型
        state: '',//文章的状态
    }

    initTable()
    initCate()
    // 获取文章列表并渲染的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                console.log(res);
                // 如果获取文章列表成功，就使用模板引擎和数据，把内容给渲染出来
                var htmlStr = template('tpl-table', res)
                // console.log(htmlStr)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章列表的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            data: q,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章类别失败')
                }
                // console.log(res);
                // 如果获取文章列表成功，就使用模板引擎和数据，把内容给渲染出来
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                // 记住，想要改变表单区域的ui结构，一定记得调用layui.form.render()
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        // 阻止其默认提交行为
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    // 定义 渲染分页的方法
    function renderPage(total) {
        // console.log(total)
        layui.use('laypage', function(){ 
            //执行一个laypage实例
            laypage.render({
              elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号(分页器的容器)
              count: total, //数据总数，从服务端得到
              limit: q.pagesize,//每页显示几条数据
              curr: q.pagenum, //当前页码
              layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
              limits: [2,3,4,5],
              //分页发生切换的时候发生jump回调
              jump: function(obj, first) {
                // console.log(obj.curr)
                // first !== true说明是靠点击页面来触发jump回调函数的
                // 通过obj.limit，拿到最新的条目数 
                q.pagesize = obj.limit
                q.pagenum = obj.curr
                if(first !== true) {
                    // 每次刷新q的值，都要调用一下initTable方法，重新渲染一下表格
                    initTable()
                }
               
              }  
            })
        })
    }

    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // console.log('li')
        var id = $(this).attr('data-id')
        // console.log(id)
        var len = $('.btn-delete').length
        // 询问用户是否删除文章
        layer.confirm('是否要删除这篇文章?', {icon: 3, title:'提示'}, function(index){
            //do something 
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除文章成功')
                    if(len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }  
                    initTable()
                } 
            })
            layer.close(index)
        })
    })
    
})