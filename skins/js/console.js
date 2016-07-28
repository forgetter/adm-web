var webPath = 'https://dev.imaicloud.com/adm/';
$(function(){
    $('[data-toggle=confirmation]').confirmation({ container: 'body', btnOkClass: 'btn btn-sm btn-success', btnCancelClass: 'btn btn-sm btn-danger'});
    //获取cookie中用户上下文
    var userCtx = getCookie('imaicloud_payload');
    userCtx = '{name:"anna"}';
    if (userCtx!= null && userCtx!="") {
    	var jsonUserCtx = eval('('+userCtx+')');
        $('#navUserName').html(jsonUserCtx.name);
	loadUserInfo4Etcd();
	$('#btnApply').click(function(){
	    applyApiKey();
	});
	loadApiKeys();
    }
});

function getCookie(c_name) {  
  if (document.cookie.length>0) {  
    c_start=document.cookie.indexOf(c_name + "=");  
    if (c_start!=-1) {   
      c_start=c_start + c_name.length+1 ;  
      c_end=document.cookie.indexOf(";",c_start);  
      if (c_end==-1) c_end=document.cookie.length;  
      return unescape(document.cookie.substring(c_start, c_end));  
    }   
  }  
  return "";  
}

//查询用户信息：用户名称、绑定二级域名、github账号
function loadUserInfo4Etcd(){
    var url = webPath + '/console/getUserInfo4Etcd';
    $.ajax({
        url : url,
        data: {user_id: $('#navUserName').html()},
        error: function(e, h, r) {
            toastr['warning'](e, '查询用户信息失败');
        },
        success: function(data) {
        	if (data != '[]') {
                var json = eval(data);
                if (json.length == 0) {
                    $('#linkGithub').html('无');
                } else {
                    var subdomain = json[0].SUBDOMAIN, github = json[0].GITHUB;
                    $('#subdomain').html(subdomain);
                    $('#linkGithub').html(github);
                    $('#linkGithub').attr('data-value',github);
                }
        	} else{
                $('#linkGithub').html('无');
        	}
        }
    });
}


function changeSubdomainInput(obj) {
    var preV = $(obj).attr("data-value");
    var input = '<input type="text" class="form-control input_vhost" id="iptSubdomain" onblur="saveSubdomain(this)" pre-value="'+preV+'" maxlength="20" value="'+preV+'">';
    $(obj).parent().append(input);
    $('input', $(obj).parent()).focus();
    $(obj).remove();
}
function changeInput(obj) {
    var preV = $(obj).attr("data-value");
    var input = '<input type="text" class="form-control input_vhost" id="iptGithub" onblur="saveGithub(this)" pre-value="'+preV+'" maxlength="20" value="'+preV+'">';
    $(obj).parent().append(input);
    $('input', $(obj).parent()).focus();
    $(obj).remove();
}

/**
 * 保存二级域名
 * @param obj
 */
function saveSubdomain(obj){
    var subdomain = $(obj).val();
    if (subdomain == null || subdomain==''){
        toastr['warning'](null, '二级域名不能为空');
        return ;
    }
    if (!subdomain.match(/^[A-Za-z0-9-]{3,}$/g)) {
        toastr['warning'](null, '请输入不小于3位的英文字母、数字或-');
        return;
    }
    var url = webPath + '/console/saveSubdomain';
    $.ajax({
        url : url,
        data: {subdomain: subdomain.toLocaleLowerCase(), user_id: $('#navUserName').html()},
        error: function(e, h, r) {
            toastr['warning'](e, '保存二级域名失败');
        },
        success: function(data) {
            var json = eval(data);
            if (json.code != '000') {
                toastr['warning'](null, json.message);
            } else {
                toastr['success'](null, '保存二级域名成功');
                var a = '<label>'+$(obj).val()+'</label>';
                $(obj).parent().append(a);
                $(obj).remove();
                $('#linkGithub').html('imaidev');
            }
        }
        
    });
}

/**
 * 更新Github账号
 * @param obj
 */
function saveGithub(obj){
    var a = '<a onclick="changeInput(this)" data-value="'+$(obj).val()+'">'+$(obj).val()+'</a>';
    var github_new = $(obj).val();
    if (github_new == null || github_new==''){
        var pre = $(obj).attr('pre-value');
        $(obj).parent().append(a);
        $('a', $(obj).parent()).attr('data-value',pre);
        $('a', $(obj).parent()).html(pre);
        $(obj).remove();
        return;
    }
    var preV = $(obj).attr('pre-value');
    if (preV == github_new) {
        $(obj).parent().append(a);
        $(obj).remove();
        return;
    }
    var url = webPath + '/console/updateGithub';
    $.ajax({
        url : url,
        data: {github_new: $(obj).val(), user_id: $('#navUserName').html()},
        error: function(e, h, r) {
            toastr['warning'](e, '更新github账号失败');
        },
        success: function(data) {
            var json = eval(data);
            if (json.code != '000') {
                toastr['warning'](null, json.message);
            } else {
                toastr['success'](null, '更新github账号成功');
                $(obj).parent().append(a);
                $(obj).remove();
            }
        }
    });
}


/**
 * 查询租户所在域名有效API Key
 */
function loadApiKeys(){
    $tbl = $('#tblApiKeys tbody');
    $tbl.html('');
    var url = webPath + '/console/queryApiKeyList';
    $.ajax({
        url : url,
        data: {user_id: $('#navUserName').html()},
        error: function(e, h, r) {
            toastr['warning'](e, '查询有效API Keys出错');
        },
        success: function(data) {
            var json = eval(data), len = json.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var tr = '<tr>'
                                + '<td>' + (i+1) + '</td>'
                                + '<td title="'+json[i].KEY_ID+'">' + json[i].KEY_ID + '</td>'
                                + '<td title="'+json[i].KEY+'">' + json[i].KEY + '</td>'
                                +'</tr>';
                    $tbl.append(tr);
                }
            }
        }
    });
}

/**
 * 申请新的API Key
 */
function applyApiKey(){
    var url = webPath + '/console/applyApiKey';
    $.ajax({
        url : url,
        data: {user_id: $('#navUserName').html()},
        error: function(e, h, r) {
            toastr['warning'](e, '申请新API Key出错');
        },
        success: function(data) {
            var json = eval(data);
            if (json.length >0) {
                $('#new_id').html(json[0].KEY_ID);
                $('#new_secret').html(json[0].KEY_SECRET);
                $('#apikeySuccess').css('display','block');
                loadApiKeys();
            } else {
                toastr['warning'](null, '申请新API Key失败');
            }
        }
    });
}
function closeModal(obj){
	if ($(obj).hasClass('model')) {
		$(obj).css('display', 'none');
	} else {
		$(obj).parents('.modal').css('display', 'none');
	}
}
