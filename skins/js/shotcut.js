(function(){
    window.ADM_SHORTCUT = function(config){
        function initDom(){
             var contaienr = document.getElementById('admShortcut');
             if(!contaienr){
                throw "没有定义ID为admShortcut的包装div";
             }
			var div = '<div class="portlet"> <div class="portlet-title"><div class="pull-right" style="width:100%;text-align:right;"> <a href="https://dev.imaicloud.com/adm-web/" target="_adm" style="cursor:pointer;">ADM控制台>></a> </div> </div> </div>';
             contaienr.appendChild(div);
        }
        return {
            init:function(){
		initDom();
            }
        }
    };
    window.ADM_SHORTCUT.init = function(options){
	new window.ADM_SHORTCUT(options).init();
    }
})();
