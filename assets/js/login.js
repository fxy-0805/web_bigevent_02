$(function() {
    // 点击去注册的账号链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide().siblings('.reg-box').show()
    })
    // 点击去登录的账号链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide().siblings('.login-box').show()
    })
    // 从layui中获取form和layer对象
    var form = layui.form
    var layer = layui.layer
    // console.log(form); // 包含了required、phone、email、url、number、date、identity
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫pwd的校验你规则
        pwd:[ 
            // 正则匹配
            /^[\S]{6,16}$/,
            // 匹配不符时的提示文字
            '密码必须6到16位，且不能出现空格'],
        repwd:function(value) {
            // 通过形参value拿到的是确认密码框中的内容
            // 还需要拿到确认密码框中的内容 var pwd
            // 选择器必须带空格，选择的是后代中的input， name数字那个值为password的那一个标签
            var pwd = $('.reg-box input[name=password]').val()
            // 然后进行等于的判断
            if(pwd !== value) {
                // 如果判断失败，则return一个提示消息即可
                return '两次密码不一致！'
            }
        }
    })
    // 为注册按钮绑定submit提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 发送ajax的post请求
        $.ajax({
            method:'POST',
            url:'/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(), 
                password: $('.reg-box [name=password]').val()
            }, 
            success:function(res) {
            // 返回状态判断
            if(res.status !== 0) {
                return layer.msg(res.message)
            }
            // 提交成功后处理代码
            layer.msg('注册成功，请登录！')
            // 模拟点击行为
            $('#link_login').click()
            // 重置form表单
            $('#form_reg')[0].reset()
        }
    })
    })
    // 为登录按钮绑定submit提交事件
    $('#form_login').submit(function(e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            method:'POST',
            url:'/api/login',
            // 快速获取表单中的数据
            data:$(this).serialize(),
            success:function(res) {
                // 校验返回状态
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提示信息，保存token，跳转页面
                layer.msg('恭喜您，登陆成功！')
                // 保存token，未来的接口要使用token
                // 将登录成功的字符串token，保存到localStorage中
                var token = localStorage.setItem('token', res.token)
                // 跳转到后台主页面
                location.href = '/index.html'
            }
        })
    })
})