layui.define(['layer', 'form'], function(exports){
	var $ = layui.jquery;
	var layer = layui.layer;
	var form = layui.form;

	form.on('select(typeid)', function(data){
		if (data.value == 0) return;
		$.ajax({
			url: '/product/get/proudctlist',
			type: 'POST',
			dataType: 'json',
			data: {tid: data.value},
			beforeSend: function () {
			},
			success: function (result) {
				if (result.code == '1') {
					var html = "";
					var list = result.data.products;
					for (var i = 0, j = list.length; i < j; i++) {
						html += '<option value='+list[i].id+'>'+list[i].name+'</option>';
					}
					$('#productlist').html("<option value=\"0\">请选择</option>" + html);
					$('#price').val('');
					$('#qty').val('');
					$('#prodcut_description').html('');
					form.render('select');
				} else {
				}
			}

		});
	});

	form.on('select(productlist)', function(data){
		if (data.value == 0) return;
		$.ajax({
			url: '/product/get/proudctinfo',
			type: 'POST',
			dataType: 'json',
			data: {pid: data.value},
			beforeSend: function () {
			},
			success: function (result) {
				if (result.code == '1') {
					var product = result.data.product;
					$('#price').val(product.price);
					if(product.qty>0){
						$('#qty').val(product.qty);
						$("#buy").removeAttr("disabled"); 
					}else{
						if(product.stockcontrol>0){
							$('#qty').val("库存不足");
							$("#buy").attr("disabled","true"); 
						}else{
							$('#qty').val("不限量");
							$("#buy").removeAttr("disabled"); 
						}
					}
					$('#prodcut_description').html(product.description);
					form.render();
				} else {
					
				}
			}
		});

	});
	
	form.on('submit(buy)', function(data){
		data.field.csrf_token = TOKEN;
		var i = layer.load(2,{shade: [0.5,'#fff']});
		$.ajax({
			url: '/product/order/buy/',
			type: 'POST',
			dataType: 'json',
			data: data.field,
		})
		.done(function(res) {
			if (res.code == '1') {
				location.pathname = '/product/order/pay/'+res.data.orderid;
			} else {
				layer.msg(res.msg,{icon:2,time:5000});
			}
		})
		.fail(function() {
			layer.msg('服务器连接失败，请联系管理员',{icon:2,time:5000});
		})
		.always(function() {
			layer.close(i);
		});

		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
	
	exports('product',null)
});