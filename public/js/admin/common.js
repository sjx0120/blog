//获取输入至并将数组转换为对象
function serializeToJson(form){
    var result = {};
    //获取表单中用户输入的内容
    //[{name:"username",value:"用户输入的内容"}]
        var list = form.serializeArray();
        list.forEach(function(item){
            result[item.name] = item.value; 
        });
        return result;
       
    //serializeArray(),获取所有input的value
}