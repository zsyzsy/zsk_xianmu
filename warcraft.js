(function () {
//获取各元素
    var background = document.getElementById("id_content");
    var start_back = document.getElementsByClassName("start_back")[0];
    var game_win = document.getElementsByClassName("game_win")[0];
    var btn_start = document.getElementById("id_btn_start");
    var myplane = document.getElementById("id_myplane");
    var real_score_elment=document.getElementsByClassName("real_score_span")[0];
    var real_score=0;
    var score_end=document.getElementsByClassName("score")[0];
    var game_good_bye= $(".game_good_bye");
    var game_win_title=document.getElementsByClassName("game_win_title")[0];
    var btn_explain=document.getElementsByClassName("btn_explain")[0];
    var game_explain=document.getElementsByClassName("game_explain")[0];
    var game_cheats=document.getElementsByClassName("game_cheats")[0];
    var btn_exit=document.getElementsByClassName("btn_exit")[0];
    var btn_exit_cheats=document.getElementsByClassName("btn_exit")[1];
    var btn_cheats=document.getElementsByClassName("btn_cheats")[0];
    var bg_height=$(".start_back").height();
    var game_again=document.getElementsByClassName("game_again")[0];
//初始设置
    var background_move_controller = 0,time_interval=-1,game_start;
    var myplane_left, myplane_top, move_control=10;
    var state_left=false,state_right=false,state_top=false,state_bottom=false;
    var mybullets_array=[],enemy_plane1s_array=[],enemy_plane2s_array=[],enemy_plane3s_array=[],enemy_plane4s_array=[];
    var enemy_plane1_bullets=[],enemy_plane2_bullets=[],enemy_plane3_bullets=[],enemy_plane4_bullets=[];
    var mybullet_strong,catapult= 0,boss_catapult=0;
    var myplane_ph= 1,myplane_unbeatable=false,myplane_status=true,myplane_explosive_times=0;
    var boss;
    var Pause= 0,score_animation=0;
    $(myplane).css({"top":(bg_height-80)});
//返回首页
    game_good_bye.click(function(){
        clearInterval(game_start);
        page_switch("pt-page-2","pt-page-1");
    });
//游戏说明
    btn_explain.onclick=function(){
        game_explain.style.display="block"
    };
//秘籍
    btn_cheats.onclick=function(){
        game_cheats.style.display="block";
    };
//退出秘籍
    btn_exit_cheats.onclick=function(){
        game_cheats.style.display="none"
    };
//退出说明
    btn_exit.onclick=function(){
        game_explain.style.display="none";
    };
//开始游戏
    btn_start.onclick = function () {
    start_back.style.display = "none";
    game_start=setInterval(move, 30);
//返回开始
        game_again.onclick=function(){
            clearInterval(game_start);
            $(".pt-page-2").load('warcraft.html',function(){

            });
        };
//键盘操作本方飞机移动
        document.onkeydown = function (event) {
            if(event.keyCode == 32){
                if(Pause==0){
                    clearInterval(game_start);
                    Pause=1;
                }
                else{
                    game_start=setInterval(move, 30);
                    Pause=0;
                }
            }
            if (event.keyCode == 37) {
                state_left=true;
            }
            if (event.keyCode == 39) {
                state_right=true;
            }
            if (event.keyCode == 38) {
                state_top=true;
            }
            if (event.keyCode == 40) {
                state_bottom=true;
            }
        };
        document.onkeyup = function (event)
        {
            switch ((event || window.event).keyCode)
            {
                case 37:
                    state_left = false;
                    break;
                case 39:
                    state_right = false;
                    break;
                case 38:
                    state_top = false;
                    break;
                case 40:
                    state_bottom = false;
                    break;
            }
        };
    };
    function move() {
//游戏结束弹框
        if(game_win.style.display=="block"){
            real_score_elment.parentNode.style.display="none";
            score_animation=score_animation+300;
            score_animation<real_score ?
            score_end.innerText=score_animation:
            score_end.innerText=real_score;
            if(!myplane_status){
                myplane.style.display="none";
            }
        }
//背景图片移动效果
        background_move_controller += 3;
        background.style.backgroundPosition = "0px" + " " + background_move_controller + "px";
//获取我方飞机位置
        myplane_left = parseInt(getComputedStyle(myplane, false).left);
        myplane_top =parseInt(getComputedStyle(myplane, false).top);
//飞机变形
        if(myplane_status){
            myplane_ph==3 ? myplane.style.backgroundImage="url('./img/my_2.png')": myplane.style.backgroundImage="url('./img/my_1.png')";
        }
//判断溢出
        if(myplane_status){
//向左移动
            if(state_left==true){
                if(myplane_left<=0){
                    myplane.style.left=0;
                }
                else{
                    myplane.style.left = parseInt(myplane_left) - move_control + "px";
                }
            }
//向右移动
            if(state_right==true){
                if(myplane_left>=400){
                    myplane.style.left=400;
                }
                else{
                    myplane.style.left = parseInt(myplane_left) + move_control + "px";
                }
            }
//向上移动
            if(state_top==true){
                if(myplane_top<=0){
                    myplane.style.top=0;
                }
                else{
                    myplane.style.top = parseInt(myplane_top) - move_control + "px";
                }
            }
//向下移动
            if(state_bottom==true){
                if(myplane_top>=(bg_height-80)){
                    myplane.style.top=(bg_height-80);
                }
                else{
                    myplane.style.top = parseInt(myplane_top) + move_control + "px";
                }
            }
        }

//时间控制
        time_interval++;
//创建子弹
        if(time_interval%7==0 && myplane_status==true){
            var mybullet = new Mybullet(40, 40,myplane_left + 50-20,myplane_top,myplane_ph);
//子弹放入数组
            mybullets_array.push(mybullet);
        }
//子弹群移动
        for (var i = 0; i < mybullets_array.length; i++)
        {
            if( mybullets_array[i].status==true){
                mybullets_array[i].move();
            }
        }
//判断视图底部删除子弹对象，避免内存消耗
        for (var i = 0; i < mybullets_array.length; i++)
        {
            if (parseInt(mybullets_array[i].bullet.style.top) < 0) {
                delete (mybullets_array[i].bullet).parentNode.removeChild(mybullets_array[i].bullet);
                mybullets_array.splice(i, 1);
                i--;
            }
        }
//敌机与boss出现
            enemy_plane(Enemy_plane1,40,enemy_plane1s_array,80,"./img/ep_1.png");
            enemy_plane(Enemy_plane2,70,enemy_plane2s_array,100,"./img/ep_2.png","./img/BossBullet.png",enemy_plane2_bullets,10);
            enemy_plane(Enemy_plane3,130,enemy_plane3s_array,120,"./img/ep_13.png","./img/BossBullet.png",enemy_plane3_bullets,15,2);
            enemy_plane(Enemy_plane4,300,enemy_plane4s_array,120,"./img/ep_15.png","./img/BossBullet.png",enemy_plane4_bullets,8);
            plane_boss();
//本方子弹加强
        if(time_interval%700==0 && time_interval>0){
            mybullet_strong=document.createElement("img");
            mybullet_strong.src="./img/addbullet.gif";
            mybullet_strong.style.position="absolute";
            mybullet_strong.style.width=30+"px";
            mybullet_strong.style.height=50+"px";
            mybullet_strong.style.left=parseInt(Math.random() * (500 - 30+1))+"px";
            mybullet_strong.style.top=-50+"px";
            //mybullet_strong.style.border="2px solid red";
            background.appendChild(mybullet_strong);
        }
//mybullet_strong动画
        if(mybullet_strong){
            mybullet_strong.style.top=parseInt(mybullet_strong.style.top)+4+"px";
            catapult ? mybullet_strong.style.left=parseInt(mybullet_strong.style.left)-8+"px" : mybullet_strong.style.left=parseInt(mybullet_strong.style.left)+8+"px";
        }
        if(mybullet_strong && parseInt(mybullet_strong.style.left)>470){
            catapult=1;
        }
        if(mybullet_strong && parseInt(mybullet_strong.style.left)<0){
            catapult=0
        }
        if(mybullet_strong && parseInt(mybullet_strong.style.top)>bg_height){
            delete (mybullet_strong).parentNode.removeChild(mybullet_strong);
            mybullet_strong=null;
        }
//mybullet_strong与本方飞机碰撞
        if(
            myplane_status && mybullet_strong &&
            (parseInt(myplane_left)<parseInt(mybullet_strong.style.left)+30) &&
            (parseInt(myplane_left)+100> parseInt(mybullet_strong.style.left)) &&
            (parseInt(myplane_top)+100*0.75 >parseInt(mybullet_strong.style.top)) &&
            (parseInt(myplane_top)+100*0.25 < parseInt(mybullet_strong.style.top)+50)
          ){
                delete (mybullet_strong).parentNode.removeChild(mybullet_strong);
                mybullet_strong=null;
                myplane_ph++;
                if(myplane_ph>=3)
                    {
                        myplane_ph=3
                    }
           }
    }
//本方飞机子弹构造函数
    function Mybullet(bullet_width,bullet_height,bullet_left,bullet_top,myplane_ph){
        this.bullet_width=bullet_width;
        this.bullet_height=bullet_height;
        this.bullet_left=bullet_left;
        this.bullet_top=bullet_top;
        this.bullet=null;
        this.status=true;
        this.bullet_padding_across=null;
        this.bullet_padding_vertical=0.25;
        this.explosive_times=0;
        this.mybullet_type=myplane_ph;
        if(this.mybullet_type==1){
            this.bullet_img="./img/myb_1.png";
            this.bullet_padding_across=0.3;
        }
        if(this.mybullet_type==2){
            this.bullet_img="./img/myb_2.png";
            this.bullet_padding_across=0.25;
        }
        if(this.mybullet_type>=3){
            this.bullet_img="./img/myb_3.png";
            this.bullet_padding_across=0;
            myplane_ph=3;
        }
        this.bullet_product=function(){
            this.bullet=document.createElement("img");
            this.bullet.src=this.bullet_img;
            this.bullet.style.position="absolute";
            this.bullet.style.width=this.bullet_width+"px";
            this.bullet.style.height=this.bullet_height+"px";
            this.bullet.style.left=this.bullet_left+"px";
            this.bullet.style.top=this.bullet_top+"px";
            this.bullet.style.zIndex="1000";
            //this.bullet.style.outline="1px solid dimgrey";
            background.appendChild(this.bullet);
        };
        this.bullet_product();
        this.move=function(){
            this.bullet.style.top=parseInt(this.bullet.style.top)-10+"px";//子弹向上移动开始
        }
    }
//敌方飞机
    function Enemy_plane1(enemy_plane_width,enemy_plane_src,enemy_plane_bullet_src,bullet_number){
        this.plane=document.createElement("img");
        this.plane.style.position="absolute";
        this.plane.src=enemy_plane_src;
        this.plane.style.width=enemy_plane_width+"px";
        this.plane.style.left=parseInt(Math.random() * (500 - enemy_plane_width+1))+"px";
        this.plane.style.top=-enemy_plane_width+"px";
        //this.plane.style.outline="1px solid dimgrey";
        this.plane.status=true;
        this.explosive_times=0;
        this.bullet=null;
        this.bullet_array=[];
        this.bullet_product_status=false;
        //this.bullet_speed=bullet_speed;
        this.bullet_product=function(){
            if(enemy_plane_bullet_src){
                this.bullet=document.createElement("img");
                this.bullet.style.position="absolute";
                this.bullet.src=enemy_plane_bullet_src;
                this.bullet.style.width=12+"px";
                this.bullet.style.height=12+"px";
                this.bullet.style.left=parseInt(this.plane.style.left)+enemy_plane_width*0.5-6+"px";
                this.bullet.style.top=parseInt(this.plane.style.top)+enemy_plane_width+"px";
                this.bullet.status=true;
                this.bullet.explosive_times=0;
                this.bullet.style.zIndex="1000";
                background.appendChild(this.bullet);
                this.bullet_array.push(this.bullet);
            }
            if(bullet_number==2){
                this.bullet=document.createElement("img");
                this.bullet.style.position="absolute";
                this.bullet.src=enemy_plane_bullet_src;
                this.bullet.style.width=12+"px";
                this.bullet.style.height=12+"px";
                this.bullet.status=true;
                this.bullet.explosive_times=0;
                this.bullet.style.zIndex="1000";
                this.bullet.style.left=parseInt(this.plane.style.left)+enemy_plane_width*0.5-6+"px";
                this.bullet.style.top=parseInt(this.plane.style.top)+enemy_plane_width*1.5+"px";
                background.appendChild(this.bullet);
                this.bullet_array.push(this.bullet);
            }
        };
        //this.bullet_move=function(){
        //    this.bullet.style.top=parseInt(this.bullet.style.top)+bullet_speed+"px";//敌机子弹向下移动开始
        //};
        background.appendChild(this.plane);
    }
    Enemy_plane1.prototype.move=function(){
        this.plane.style.top=parseInt(this.plane.style.top)+5+"px";//飞机向下移动开始
    };
    Enemy_plane1.prototype.name="Enemy_plane1";
    Enemy_plane1.prototype.ph=1;
    Enemy_plane1.prototype.score=10;
//敌方飞机2
    function Enemy_plane2(enemy_plane_width,enemy_plane_src,enemy_plane_bullet_src,bullet_number){
            Enemy_plane1.call(this,enemy_plane_width,enemy_plane_src,enemy_plane_bullet_src,bullet_number);
        }
    Enemy_plane2.prototype.move=function(){
        this.plane.style.top=parseInt(this.plane.style.top)+6+"px";//飞机向下移动开始
    };
    Enemy_plane2.prototype.name="Enemy_plane2";
    Enemy_plane2.prototype.ph=2;
    Enemy_plane2.prototype.score=50;

//敌方飞机3
    function Enemy_plane3(enemy_plane_width,enemy_plane_src,enemy_plane_bullet_src,bullet_number){
        Enemy_plane1.call(this,enemy_plane_width,enemy_plane_src,enemy_plane_bullet_src,bullet_number);
    }
    Enemy_plane3.prototype.move=function(){
        this.plane.style.top=parseInt(this.plane.style.top)+9+"px";//飞机向下移动开始
    };
    Enemy_plane3.prototype.name="Enemy_plane3";
    Enemy_plane3.prototype.ph=3;
    Enemy_plane3.prototype.score=100;

//敌方飞机4
    function Enemy_plane4(enemy_plane_width,enemy_plane_src,enemy_plane_bullet_src,bullet_number){
        Enemy_plane1.call(this,enemy_plane_width,enemy_plane_src,enemy_plane_bullet_src,bullet_number);
    }
    Enemy_plane4.prototype.move=function(){
        this.plane.style.top=parseInt(this.plane.style.top)+4+"px";//飞机向下移动开始
    };
    Enemy_plane4.prototype.name="Enemy_plane4";
    Enemy_plane4.prototype.ph=10;
    Enemy_plane4.prototype.score=200;
//敌方飞机设计函数
    function enemy_plane(Enemy_plane,frequency_time,enemy_planes_array,enemy_plane_width,enemy_plane_src,enemy_plane_bullet_src,enemy_plane_bullets,bullet_speed,bullet_number) {
//计算敌机机身
        var plane_padding_across,plane_padding_vertical;
        if (enemy_plane_width != 120) {
            plane_padding_across =0.17;
            plane_padding_vertical=0.26;
        }
        if (enemy_plane_width == 120) {
            plane_padding_across = 0.08;
            plane_padding_vertical=0.16;
        }
//创建敌机
        if (time_interval % frequency_time == 0 && time_interval > 0 && time_interval < 2000) {
            var enemy_plane = new Enemy_plane(enemy_plane_width, enemy_plane_src, enemy_plane_bullet_src, bullet_number);
//敌方飞机放入数组
            enemy_planes_array.push(enemy_plane);
        }
//敌方飞机移动
        for (var i = 0; i < enemy_planes_array.length; i++) {
            enemy_planes_array[i].move();
//创建敌机子弹
            if (enemy_planes_array[i].bullet_product_status == false && enemy_plane_bullets) {
                enemy_planes_array[i].bullet_product();
                for (var j = 0; j < enemy_planes_array[i].bullet_array.length; j++) {
                    enemy_plane_bullets.push(enemy_planes_array[i].bullet_array[j])
                }
                enemy_planes_array[i].bullet_product_status = true;
            }
        }
//敌机子弹群移动
        if (enemy_plane_bullets) {
            for (var i = 0; i < enemy_plane_bullets.length; i++) {
                enemy_plane_bullets[i].style.top = parseInt(enemy_plane_bullets[i].style.top) + bullet_speed + "px";
                if (parseInt(enemy_plane_bullets[i].style.top) > (bg_height-12) ){
                    delete (enemy_plane_bullets[i]).parentNode.removeChild(enemy_plane_bullets[i]);
                    enemy_plane_bullets.splice(i, 1);
                    i--;
                }
            }
        }
//判断删除敌方飞机对象，避免内存消耗
        for (var i = 0; i < enemy_planes_array.length; i++) {
//判断距离删除
            if (parseInt(enemy_planes_array[i].plane.style.top) >= (bg_height-80)) {
                delete (enemy_planes_array[i].plane).parentNode.removeChild(enemy_planes_array[i].plane);
                enemy_planes_array.splice(i, 1);
                i--;
            }
            if (i >= 0) {
//判断爆炸删除（延迟爆炸）
                if (enemy_planes_array[i].plane.status == false) {
                    enemy_planes_array[i].explosive_times++;
                    if (enemy_planes_array[i].explosive_times % 20 == 0) {
                        delete (enemy_planes_array[i].plane).parentNode.removeChild(enemy_planes_array[i].plane);
                        enemy_planes_array.splice(i, 1);
                        i--;
                    }
                }
            }
        }
//子弹与敌机碰撞之后双方爆炸
        for (var i = 0; i < mybullets_array.length; i++) {
            if (mybullets_array[i].status == false) {
                mybullets_array[i].explosive_times++;
                if (mybullets_array[i].explosive_times % 10 == 0) {
                    delete (mybullets_array[i].bullet).parentNode.removeChild(mybullets_array[i].bullet);
                    mybullets_array.splice(i, 1);
                    if (i == mybullets_array.length) {
                        break
                    }
                }
            }
            if (mybullets_array.length > 0) {
                for (var j = 0; j < enemy_planes_array.length; j++) {
                    if (
                        (parseInt(mybullets_array[i].bullet.style.left) + parseInt(40*mybullets_array[i].bullet_padding_across) < parseInt(enemy_planes_array[j].plane.style.left) + parseInt(enemy_plane_width*(1-plane_padding_across))) &&
                        (parseInt(mybullets_array[i].bullet.style.left) + parseInt(40*(1-mybullets_array[i].bullet_padding_across)) > parseInt(enemy_planes_array[j].plane.style.left) + parseInt(enemy_plane_width*plane_padding_across)) &&
                        (parseInt(mybullets_array[i].bullet.style.top)+40*mybullets_array[i].bullet_padding_vertical < parseInt(enemy_planes_array[j].plane.style.top) + parseInt(enemy_plane_width *(1-plane_padding_vertical))) &&
                        (parseInt(mybullets_array[i].bullet.style.top) + 40*(1-mybullets_array[i].bullet_padding_vertical ) > parseInt(enemy_planes_array[j].plane.style.top) + parseInt(enemy_plane_width * plane_padding_vertical)) &&
                        enemy_planes_array[j].plane.status == true &&
                        mybullets_array[i].status == true
                    ) {
                        mybullets_array[i].status = false;
                        mybullets_array[i].bullet.src = "./img/blow.gif";
                        real_score = real_score + enemy_planes_array[j].score;
                        real_score_elment.innerText = real_score;
                        enemy_planes_array[j].ph = enemy_planes_array[j].ph - mybullets_array[i].mybullet_type;
                        if (enemy_planes_array[j].plane.status == true && enemy_planes_array[j].ph <= 0) {
                            enemy_planes_array[j].plane.src = "./img/blow.gif";
                            enemy_planes_array[j].plane.status = false;
                        }
                        break;
                    }
                }
            }
        }
        if (myplane_status) {
//敌方飞机与本方飞机碰撞爆炸
            for (var i = 0; i < enemy_planes_array.length; i++) {
                if (
                    (parseInt(myplane_left) < parseInt(enemy_planes_array[i].plane.style.left) + parseInt(enemy_plane_width*(1-plane_padding_across))) &&
                    (parseInt(myplane_left) +100 > parseInt(enemy_planes_array[i].plane.style.left) + parseInt(enemy_plane_width*plane_padding_across)) &&
                    (parseInt(myplane_top)+100*0.24 < parseInt(enemy_planes_array[i].plane.style.top) + parseInt(enemy_plane_width *(1-plane_padding_vertical))) &&
                    (parseInt(myplane_top) + 100*(1-0.24) > parseInt(enemy_planes_array[i].plane.style.top) + parseInt(enemy_plane_width * plane_padding_vertical)) &&
                    enemy_planes_array[i].plane.status == true
                ) {
                    enemy_planes_array[i].plane.status = false;
                    enemy_planes_array[i].plane.src = "./img/blow.gif";
                    real_score = real_score + enemy_planes_array[i].score;
                    real_score_elment.innerText = real_score;
                    if (!myplane_unbeatable) {
                        myplane_ph--;
                        myplane_unbeatable = true;
                    }
                    if (myplane_ph <= 0) {
                        myplane.style.backgroundImage = "url('./img/blow.gif')";
                        //clearInterval(game_start);
                        game_win_title.innerText = "我失败了！";
                        myplane_status = false;
                        //score_end.innerText=real_score;
                    }
                    $('#id_myplane').addClass('animated flash');
                    $('#id_myplane').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                        $('#id_myplane').removeClass('animated flash');
                        myplane_unbeatable = false;
                    });
                }
            }
//敌方子弹与本方飞机碰撞判断
            if (enemy_plane_bullets) {
                for (var i = 0; i < enemy_plane_bullets.length; i++) {
                    if (
                        (parseInt(myplane_left) < parseInt(enemy_plane_bullets[i].style.left) + 12) &&
                        (parseInt(myplane_left) +100 > parseInt(enemy_plane_bullets[i].style.left) ) &&
                        (parseInt(myplane_top)+100*0.24 < parseInt(enemy_plane_bullets[i].style.top) + 12) &&
                        (parseInt(myplane_top) + 100*(1-0.24) > parseInt(enemy_plane_bullets[i].style.top) ) &&
                        enemy_plane_bullets[i].status == true
                    ) {
                        enemy_plane_bullets[i].status = false;
                        enemy_plane_bullets[i].src = "./img/blow.gif";
                        if (!myplane_unbeatable) {
                            myplane_ph--;
                            myplane_unbeatable = true;
                        }
                        if (myplane_ph <= 0) {
                            myplane.style.backgroundImage = "url('./img/blow.gif')";
                            //clearInterval(game_start);
                            game_win_title.innerText = "我失败了！";
                            myplane_status = false;
                            //score_end.innerText=real_score;
                        }
                        $('#id_myplane').addClass('animated flash');
                        $('#id_myplane').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            $('#id_myplane').removeClass('animated flash');
                            myplane_unbeatable = false;
                        });
                    }
                }
            }
        }
//敌方子弹与本方飞机碰撞后延迟爆炸
        for (var i = 0;enemy_plane_bullets && i < enemy_plane_bullets.length; i++) {
            if (enemy_plane_bullets[i].status == false) {
                enemy_plane_bullets[i].explosive_times++;
                if (enemy_plane_bullets[i].explosive_times % 5 == 0) {
                    delete (enemy_plane_bullets[i]).parentNode.removeChild(enemy_plane_bullets[i]);
                    enemy_plane_bullets.splice(i, 1);
                    if (i == enemy_plane_bullets.length) {
                        break
                    }
                }
            }
        }
    }
//BOSS构造函数
    function Boss(boss_src,boss_width,boss_height){
        this.plane=document.createElement("img");
        this.plane.style.position="absolute";
        this.plane.src=boss_src;
        this.plane.style.width=boss_width+"px";
        this.plane.style.height=boss_height+"px";
        this.plane.style.left=250-boss_width*0.5+"px";
        this.plane.style.top=-boss_height+"px";
        //this.plane.style.outline="2px solid red";
        this.ph=500;
        this.plane.status=true;
        this.plane.explosive_times=0;
        this.plane.score=3000;
        this.move=function(){
            this.plane.style.top=parseInt(this.plane.style.top)+5+"px";//boss向下移动开始
        };
        this.bullet_array=[];
        this.bullet_product=function(left){
            this.bullet=document.createElement("img");
            this.bullet.style.position="absolute";
            this.bullet.src="./img/epb_1.png";
            this.bullet.style.width=50+"px";
            this.bullet.style.height=50+"px";
            //this.bullet.style.border="2px solid red";
            left=="left"?
            this.bullet.style.left=parseInt(this.plane.style.left)+boss_width*(1/2)-50*0.5-2-46+"px":
            this.bullet.style.left=parseInt(this.plane.style.left)+boss_width*(1/2)-50*0.5-2+46+"px";
            this.bullet.style.top=parseInt(this.plane.style.top)+200-80+"px";
            this.bullet.status=true;
            this.bullet.speed="fast";
            this.bullet.explosive_times=0;
            this.bullet.padding_across=0.3;
            this.bullet.padding_vertical=0.15;
            background.appendChild(this.bullet);
            this.bullet_array.push(this.bullet)
        };
        this.bullet_product_two=function(){
            this.bullet_product("left");
            this.bullet_product("right");
        };
        this.bullet_product_one=function(direction,top,status){
            this.bullet=document.createElement("img");
            this.bullet.style.position="absolute";
            this.bullet.src="./img/BossBullet.png";
            this.bullet.style.width=18+"px";
            this.bullet.style.height=18+"px";
            //this.bullet.style.border="2px solid red";
            this.bullet.style.left=parseInt(this.plane.style.left)+boss_width*(1/2)-8+"px";
            top ? this.bullet.style.top=top + "px":
            this.bullet.style.top=parseInt(this.plane.style.top)+200-80+"px";
            this.bullet.status=true;
            this.bullet.explosive_times=0;
            this.bullet.direction=direction;
            this.bullet.fluctuate_status=status;
            this.bullet.padding_across=0;
            this.bullet.padding_vertical=0;
            background.appendChild(this.bullet);
            this.bullet_array.push(this.bullet)
        };
        this.bullet_move=function(){
            for(var i=0;i<this.bullet_array.length;i++){
                //bullet随机变幻
                if(Math.random() < 0.4 && parseInt(this.bullet_array[i].style.left)==(parseInt(this.plane.style.left)+boss_width*(1/2)-8) && this.bullet_array[i].fluctuate_status==true){
                    this.bullet_array[i].fluctuate_status=false;
                    var bullet_top=parseInt(this.bullet_array[i].style.top);
                    this.bullet_product_one("left" ,bullet_top ,false);
                    this.bullet_product_one("right",bullet_top,false);
                }
                if(this.bullet_array[i].speed=="fast"){
                    this.bullet_array[i].style.top=parseInt(this.bullet_array[i].style.top)+15+"px";//bullet向下移动开始
                }else{
                    this.bullet_array[i].style.top=parseInt(this.bullet_array[i].style.top)+8+"px";//bullet向下移动开始
                }
                if(this.bullet_array[i].direction=="left"){
                    this.bullet_array[i].style.left=parseInt(this.bullet_array[i].style.left)-5+"px";
                }
                if(this.bullet_array[i].direction=="right"){
                    this.bullet_array[i].style.left=parseInt(this.bullet_array[i].style.left)+5+"px";
                }
            }
        };
        background.appendChild(this.plane);
    }
//BOSS设计函数
    function plane_boss(){
        if(!boss && time_interval==2000){
            boss=new Boss("./img/ep_14.png",360,200)
        }
        if(boss) {
            if (parseInt(boss.plane.style.top) < 10) {
                boss.move();
            }
            //BOSS-bullet-product
            if (time_interval % 30 == 0 && parseInt(boss.plane.style.top) == 10 && boss.plane.status == true) {
                Math.random() < 0.3 ? boss.bullet_product_two() :
                    boss.bullet_product_one(null, null, true);
            }
            if (boss.bullet_array.length > 0) {
                boss.bullet_move();
            }
            //boss_bullet底部清空
            for (var i = 0; i < boss.bullet_array.length; i++) {
                if (parseInt(boss.bullet_array[i].style.top) > bg_height) {
                    delete (boss.bullet_array[i]).parentNode.removeChild(boss.bullet_array[i]);
                    boss.bullet_array.splice(i, 1);
                    i--;
                }
            }
            if(myplane_status) {
                //boss_bullet与本方飞机碰撞爆炸
                for (var i = 0; i < boss.bullet_array.length; i++) {
                    if (
                        (parseInt(myplane_left) <  parseInt(boss.bullet_array[i].style.left) + parseInt(parseInt(boss.bullet_array[i].style.width) *(1-boss.bullet_array[i].padding_across))) &&
                        (parseInt(myplane_left)+ 100> parseInt(boss.bullet_array[i].style.left) + parseInt(parseInt(boss.bullet_array[i].style.width)*boss.bullet_array[i].padding_across)) &&
                        (parseInt(myplane_top)+100*0.24 < parseInt(boss.bullet_array[i].style.top) + parseInt(parseInt(boss.bullet_array[i].style.width)*(1-boss.bullet_array[i].padding_vertical))) &&
                        (parseInt(myplane_top)  + 100*(1-0.24)> parseInt(boss.bullet_array[i].style.top) + parseInt(parseInt(boss.bullet_array[i].style.width)*boss.bullet_array[i].padding_vertical)) &&
                        boss.bullet_array[i].status == true
                    ) {
                        boss.bullet_array[i].status = false;
                        boss.bullet_array[i].src = "./img/blow.gif";
                        if (!myplane_unbeatable) {
                            myplane_ph--;
                            myplane_unbeatable = true;
                        }
                        if (myplane_ph <= 0) {
                            myplane.style.backgroundImage = "url('./img/blow.gif')";
                            //clearInterval(game_start);
                            game_win_title.innerText = "我失败了！";
                            //score_end.innerText=real_score;
                            myplane_status = false;
                        }
                        $('#id_myplane').addClass('animated flash');
                        $('#id_myplane').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            $('#id_myplane').removeClass('animated flash');
                            myplane_unbeatable = false;
                        });
                    }
                }
            }
                //boss_bullet与本方飞机碰撞后boss_bullet延迟爆炸
                for (var i = 0; i < boss.bullet_array.length; i++) {
                    if (boss.bullet_array[i].status == false) {
                        boss.bullet_array[i].explosive_times++;
                        if (boss.bullet_array[i].explosive_times % 5 == 0) {
                            delete ( boss.bullet_array[i]).parentNode.removeChild(boss.bullet_array[i]);
                            boss.bullet_array.splice(i, 1);
                            if (i == boss.bullet_array.length) {
                                break
                            }
                        }
                    }
                }
            //boss延迟爆炸
                if (boss.plane.status == false) {
                    boss.plane.explosive_times++;
                    if (boss.plane.explosive_times % 50 == 0) {
                        delete (boss.plane).parentNode.removeChild(boss.plane);
                        boss=null;
                        game_win.style.display="block"
                    }
                }
            //BOSS左右移动
            if (boss && parseInt(boss.plane.style.top) == 10) {
                boss_catapult ? boss.plane.style.left = parseInt(boss.plane.style.left) - 5 + "px" : boss.plane.style.left = parseInt(boss.plane.style.left) + 5 + "px";
            }
            if (boss && parseInt(boss.plane.style.left) > 140 + 70 && parseInt(boss.plane.style.top) == 10) {
                boss_catapult = 1;
            }
            if (boss && parseInt(boss.plane.style.left) < 0 - 70 && parseInt(boss.plane.style.top) == 10) {
                boss_catapult = 0
            }
            //子弹与boss碰撞之后双方爆炸
            for (var i = 0; i < mybullets_array.length; i++) {
                if (mybullets_array[i].status == false) {
                    mybullets_array[i].explosive_times++;
                    if (mybullets_array[i].explosive_times % 10 == 0) {
                        delete (mybullets_array[i].bullet).parentNode.removeChild(mybullets_array[i].bullet);
                        mybullets_array.splice(i, 1);
                        if (i == mybullets_array.length) {
                            break
                        }
                    }
                }
                if (mybullets_array.length > 0) {
                    if (boss &&
                        (parseInt(mybullets_array[i].bullet.style.left) + parseInt(40*mybullets_array[i].bullet_padding_across)  < parseInt(boss.plane.style.left) + parseInt(360 - 360*0.25)) &&
                        (parseInt(mybullets_array[i].bullet.style.left)+ parseInt(40*(1-mybullets_array[i].bullet_padding_across))> parseInt(boss.plane.style.left) + parseInt(360*0.25)) &&
                        (parseInt(mybullets_array[i].bullet.style.top)+40*mybullets_array[i].bullet_padding_vertical  < parseInt(boss.plane.style.top) + parseInt(200 - 200*0.28)) &&
                        (parseInt(mybullets_array[i].bullet.style.top)  + 40*(1-mybullets_array[i].bullet_padding_vertical )> parseInt(boss.plane.style.top) + parseInt(200*0.28)) &&
                        boss.plane.status == true &&
                        mybullets_array[i].status == true
                    ) {
                        mybullets_array[i].status = false;
                        mybullets_array[i].bullet.src = "./img/blow.gif";
                        boss.ph = boss.ph - mybullets_array[i].mybullet_type;
                        if (boss.plane.status == true && boss.ph <= 0) {
                            boss.plane.src = "./img/blow.gif";
                            boss.plane.status = false;
                            real_score=real_score+boss.plane.score;
                            real_score_elment.innerText=real_score;
                            for(var i=0;i<boss.bullet_array.length;i++){
                                boss.bullet_array[i].status = false;
                                boss.bullet_array[i].src = "./img/blow.gif";
                            }
                        }
                    }
                }
            }
            //boss与本方飞机碰撞爆炸
            if (
                myplane_status && boss &&
                (parseInt(myplane_left) < parseInt(boss.plane.style.left) + parseInt(360 - 360*0.25)) &&
                (parseInt(myplane_left)+ 100> parseInt(boss.plane.style.left) + parseInt(360*0.25)) &&
                (parseInt(myplane_top)+100*0.24 < parseInt(boss.plane.style.top) + parseInt(200 - 200*0.28)) &&
                (parseInt(myplane_top)  + 100*(1-0.24)> parseInt(boss.plane.style.top) + parseInt(200*0.28)) &&
                boss.plane.status == true
            ) {
                myplane.style.backgroundImage = "url('./img/blow.gif')";
                //clearInterval(game_start);
                game_win_title.innerText="我失败了！";
                myplane_status=false;
                //score_end.innerText=real_score;
            }
        }
        //游戏结束延迟弹框
        if (myplane_status == false) {
            myplane_explosive_times++;
            if (myplane_explosive_times % 30 == 0) {
                game_win.style.display="block"
            }
        }
    }
})();