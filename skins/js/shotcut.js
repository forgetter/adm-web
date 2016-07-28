(function(){
    window.ADM_SHOTCUT = function(config){
        function initDom(){
             var contaienr = $("#admShotcut");
             if(contaienr.size() == 0){
                throw "没有定义包装div";
             }
			var div = '<div class="portlet"> <div class="portlet-title"><div class="pull-right" style="width:100%;text-align:right;"> <a href="https://dev.imaicloud.com/adm-web/" target="_adm" style="cursor:pointer;">ADM控制台>></a> </div> </div> </div>';
             document.getElementById('admShotcut').appendChild(div);
        }
        return {
            init:function(){
		initDom();
            }
        }
    };
})();
window.ADM_SHOTCUT.init = function(options){
    new window.ADM_SHOTCUT(options).init();
}
