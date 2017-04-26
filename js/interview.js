/**
 * Created by Administrator on 2017-4-25.
 */
var get_verification=$("#get_verification");
var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
//验证码点击事件
function verification_click() {
    get_verification.click(function () {
        if(!myreg.test($("#phone_nm").val()))
        {
            $(".reminder").css({"display":"block"})
        };
        if(myreg.test($("#phone_nm").val()))
        {
            // 倒计时
            $("#get_verification").css({"display":"none"});
            $(".count_down").css({"display":"block"});
            var count_down=3;
            var in_count_down=setInterval(function () {
                $(".count_down").text(count_down);
                count_down--;
                if(count_down==-1){
                    $(".count_down").css({"display":"none"});
                    $("#get_verification").css({"display":"block"});
                    clearInterval(in_count_down);
                    $(".count_down").text("");
                    verification_click();
                }
            },1000);
            $(".reminder").css({"display":"none"})
        }
    });
}
verification_click();
