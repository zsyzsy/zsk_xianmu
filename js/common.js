/**
 * Created by Administrator on 2017/2/14.
 */
//切换页面
function page_switch(current,next){
    $(".canvas").width($(window).width());
    $("."+current).attr("class","pt-page "+current+" pt-page-current");
    $("."+next).attr("class","pt-page "+next+" pt-page-ready");
    $("#pt-main").append($("."+next));
    var switcher_num=parseInt(Math.random()*68);
    nextPage(switcher_num)
}
