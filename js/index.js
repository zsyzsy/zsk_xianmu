/**
 * Created by Administrator on 2017/1/9.
 */
//加载首页
    function init_load_bg(){
        //加载背景
        $(".bg").load('bg_particle.html',function(){
                //点击切换页面2
                $(".play_game").click(function(){
                    //加载首页之后的页面
                    $(".pt-page-2").load('warcraft.html',function(){
                        //随机切换
                        page_switch("pt-page-1","pt-page-2");

                    });
                });
        });
    }
    init_load_bg();

