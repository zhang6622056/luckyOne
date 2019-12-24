!(function(){
    'use strict';

    var file_num = 43;
    var photo_row = 6;
    var photo_col = 10;
    var photo_num = photo_row * photo_col;
    var gallery = $('#gallery');
    var photos = [];
    var fadeSpeed = 2000;

    //- 空格事件开关
    var clickSwitch = true;
    //- 动画步骤 1- 奖项显示前 2- 奖项显示中
    var animationStep = 1;

    //- bgmArray
    var bgmArr = ["audio/Fingerbang.mp3","audio/bgm.mp3"];



    var player = $("#bgm")[0];
    player.src = bgmArr.pop();         //每次读数组最后一个元素
    player.addEventListener('ended', playEndedHandler, false);
    player.loop = false;//禁止循环，否则无法触发ended事件





    //- 中奖人数组
    var lucker = [];

    //- 当前抽奖下标
    localStorage.clear();
    var awardIndex = localStorage.getItem("awardIndex");
    //- 当前抽奖的奖项对象
    var currentAward;


    if (undefined == awardIndex){  awardIndex = 0; }


    //- 开始按钮控制  true start, false stop
    var startOrStop = true;

    //- 已中奖的人
    var choosed = JSON.parse(localStorage.getItem('choosed')) || {};



    function playEndedHandler(){
        player.src = bgmArr.pop();
        player.play();
        console.log(arr.length);
        !arr.length && myAudio.removeEventListener('ended',playEndedHandler,false);//只有一个元素时解除绑定
    }

    //- 高奖池
    var makeSureArr = new Array();
    for (var i = 0 ; i < member.length; i++){
        if(i < 43){
            makeSureArr.push(member[i]);
        }
    }



    for (var i=1; i<=photo_num; i++){
        photos.push('photo/'+Math.ceil(Math.random()*file_num)+'.jpg');
    }

    var loadedIndex = 1;


    //- 显示奖项，并开始抽奖
    function displayAwards(){
        clickSwitch = false;

        currentAward = awards[awardIndex];

        var awardTitle = currentAward.level+":"+currentAward.name+" X"+currentAward.quantity
        $('#awardTitle').html(awardTitle);
        $('#awardImage').attr('src',currentAward.image);



        if (animationStep == 1){
            //- 开始bgm
            player.play();
            player.volume = 1.0;

            $('#gallery').fadeOut(fadeSpeed,function(){
                $("#awardCell").fadeIn(fadeSpeed,function(){
                });
            });
            animationStep = 2;
            clickSwitch = true;
            return;
        }else if (animationStep == 2) {
            $("#awardCell").fadeOut(fadeSpeed,function(){
                $('#gallery').fadeIn(fadeSpeed,function(){

                    //- 动画步骤控制
                    animationStep = 1;

                    //- 点击开关
                    clickSwitch = true;

                    //- 事件切换
                    startOrStop = false;
                    startLoopPeople();
                });
            })
        }
        

        // $('#gallery').fadeOut(fadeSpeed,function(){
        //     $("#awardCell").fadeIn(fadeSpeed,function(){
        //         //- 当继续执行的时候，将该step 置成第一步
        //         animationStep = 1;
        //
        //         $("#awardCell").fadeOut(fadeSpeed,function(){
        //             $('#gallery').fadeIn(fadeSpeed,function(){
        //                 clickSwitch = true;
        //                 startLoopPeople();
        //             });
        //         })
        //     });
        // });
    }



    //- 开始loop 抽奖人的效果
    function startLoopPeople(){
        $('#gallery li.focus').removeClass('focus hover');
        $(this).data('action','stop').html('Stop');

        //- 设置focus随机，也就是中奖，每100ms一次
        timer_big = setInterval(function(){
            //- undo
        },100);

        //- 切换src，每1s切换一次
        timer_small = setInterval(function(){
            $('#gallery li:eq('+Math.ceil(Math.random()*photo_num)+') img').attr('src','photo/'+Math.ceil(Math.random()*file_num)+'.jpg');
        },1);
    }


    //- 判定index是否在nowLucker中，如果在则重新随机位置
    function indexNotIn(index,nowLucker){
        for (var i in nowLucker){
            if (nowLucker[i] == index || Math.abs(nowLucker[i] - index) == 10 || Math.abs(nowLucker[i] - index) == 11 || Math.abs(nowLucker[i] - index) == 9 || Math.abs(nowLucker[i] - index) == 1){
                return true;
            }
        }
        return false;
    }




    //- 中奖人唯一表示
    var getKey = function(item){
        return item.name + '-' + item.photo;
    };

    //- 优先级匹配
    var searchIndex = function(item){
        for (var i in makeSureArr){
            if (getKey(item) == getKey(makeSureArr[i])){
                return true
            }
        }
        return false;
    }









    $.each(photos, function(index, photo){
        var img = document.createElement('img');
        var link = document.createElement('a');
        var li = document.createElement('li');

        link.href = 'javascript:;';
        link.appendChild(img);
        li.appendChild(link);

        gallery[0].appendChild(li);

        img.onload = function(e){
            img.onload = null;
            setTimeout( function(){
                $(li).addClass('loaded');
            }, 10*loadedIndex++);
        };

        img.src = photo;
    });

    var timer_big, timer_small;
    var timer_small_slow = setInterval(function(){
        $('#gallery li:eq('+Math.ceil(Math.random()*photo_num)+')')
            .addClass('animated bounce')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this)
                    .removeClass('animated bounce')
                    .find('img')
                    .attr('src','photo/'+Math.ceil(Math.random()*file_num)+'.jpg')

            });
    },100);


    //- 设置空格事件
    $(document).keypress(function(event){
        if(event.which == 13 || event.which == 32) {
            $('#action').click();
        }
    });



    //- 设置抽奖开始结束事件
    $('#action').click(function(){
        console.log(choosed);



        //- 点击开关。效果过渡的时候关闭响应
        if (!clickSwitch){ return; }



        if (timer_small_slow){
            clearInterval(timer_small_slow);
        }
        if (startOrStop){ //- 开始抽奖
            if (awardIndex == awards.length){
                alert('奖已抽完！');
                return;
            }
            

            //- 显示奖项
            displayAwards();
        }else{          //- 结束抽奖
            startOrStop = true;


            //- 算法，算中奖人
            var ret = member
                .filter(function(m, index){ //- 过滤已中奖的人
                    m.index = index;
                    return !choosed[getKey(m)];
                })
                .map(function(m){
                    var scoperandom = 0;
                    // if (currentAward.quantity < 5){
                    if (true){
                        if (searchIndex(m)){
                            scoperandom = 1;
                        }
                    }

                    return Object.assign({
                        score: Math.random()-scoperandom
                    }, m);
                })
                .sort(function(a, b){           //- 按照分数排名
                    return a.score - b.score;
                })
                .slice(0, currentAward.quantity)                //- 截取排名后前n位
                .map(function(m){
                    choosed[getKey(m)] = currentAward.name;         //- 扩展中奖人json
                    return m.photo;
                });



            if (ret.length == 0){
                alert('奖池中人员已全部抽完!');
            }
            //- ret 中奖人图片名以逗号分割
            console.log(ret);
            localStorage.setItem('choosed', JSON.stringify(choosed));





            //- 展示中奖效果
            var nowLucker = new Array();
            for (var i in ret){

                //- 随机中奖位置
                var index;
                do {
                    index = Math.ceil(Math.random()*file_num);
                }while(indexNotIn(index,nowLucker))
                nowLucker.push(index);

                $('#gallery li:eq('+index+')')
                    .addClass('focus')
                    .addClass('hover')
                    .find('img')
                    .attr('src','photo/'+ret[i]+'.jpg')
            }








            //- TODO  从奖池中移除中奖人






            //- 保存中奖人至localStorage
            // var luckerInMemberIndex = index - 1;
            // var luckerObj = member[luckerInMemberIndex];
            // console.log(luckerObj)
            // localStorage.setItem(new Date().toDateString(),luckerObj);


            //- 清理抽奖时的效果
            clearInterval(timer_big);
            clearInterval(timer_small);


            
            awardIndex++;

            player.volume = 0.3;
        }
    });
})();






