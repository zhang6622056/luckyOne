!(function(){
    'use strict';

    var file_num = 134;
    var photo_row = 6;
    var photo_col = 10;
    var photo_num = (photo_row * photo_col);
    var gallery = $('#gallery');
    var photos = [];
    var fadeSpeed = 10;



    //- 空格事件开关
    var clickSwitch = true;
    //- 动画步骤 1- 奖项显示前 2- 奖项显示中
    var animationStep = 1;


    //- 排除一部分人
    var lowIndexArray = [3,4,13,21,80,91,93,99,113,131,132,133,134];




    //- 中奖人数组
    var lucker = [];

    //- 当前抽奖下标
    var awardIndex = localStorage.getItem("awardIndex");
    //- 当前抽奖的奖项对象
    var currentAward;


    if (undefined == awardIndex){  awardIndex = 0; }

    //- 开始按钮控制  true start, false stop
    var startOrStop = true;

    //- 已中奖的人
    var choosed = JSON.parse(localStorage.getItem('choosed')) || {};



    //- 获取随机位置
    function getRandomImagePosition(){
        return Math.ceil(Math.random()*photo_num)-1;
    }


    //- 高奖池
    var makeSureArr = new Array();
    for (var i = 0 ; i < member.length; i++){
        if(i < 65){
            makeSureArr.push(member[i]);
        }
    }





    for (var i=1; i<=photo_num; i++){
        photos.push(Math.ceil(Math.random()*file_num));
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
    }



    //- 开始loop 抽奖人的效果
    function startLoopPeople(){
        $('#gallery li.focus').removeClass('focus hover');
        $(this).data('action','stop').html('Stop');

        //- 设置focus随机，也就是中奖，每100ms一次
        timer_big = setInterval(function(){
            //- undo
        },100);

        //- 切换src，每1ms切换一次
        timer_small = setInterval(function(){
            var loopIndex = Math.ceil(Math.random()*file_num);

            //- 替换新图片
            var imgObj = $('#gallery li:eq('+getRandomImagePosition()+') img');
            var alt = $(imgObj).attr('alt');
            $(imgObj).attr('src','photo/'+loopIndex+'.jpg').attr('alt',loopIndex);
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








    //- 初始化html内容
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

        img.src = 'photo/'+photo+'.jpg';
        $(img).attr('alt',photo).addClass('pics'+photo);
    });





    var timer_big, timer_small;
    var timer_small_slow = setInterval(function(){
        $('#gallery li:eq('+Math.ceil(Math.random()*photo_num)+')')
            .addClass('animated bounce')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                //- 获取当前的被替换的图片对象
                var imgObj = $(this)
                    .removeClass('animated bounce')
                    .find('img');

                //- 生成随机员工照片
                var imgstr = Math.ceil(Math.random()*file_num);
                $(imgObj).attr('src','photo/'+imgstr+'.jpg').attr('alt',imgstr).addClass('pics'+imgstr);
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
        //- 点击开关。效果过渡的时候关闭响应
        if (!clickSwitch){ return; }

        if (timer_small_slow){ clearInterval(timer_small_slow); }


        if (startOrStop){ //- 开始抽奖
            if (awardIndex == awards.length){
                alert('奖已抽完！');
                player.pause();
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
                    var readyChoose = !choosed[getKey(m)]
                    return readyChoose;
                })
                .map(function(m){
                    var scoperandom = 0;
                    if (currentAward.level == '三等奖'
                            || currentAward.level == '二等奖'
                            || currentAward.level == '一等奖'
                            || currentAward.level == '特等奖') {
                        if (searchIndex(m)) {
                            scoperandom = 1;
                        }
                    }

                    //- low array
                    if (lowIndexArray.indexOf(parseInt(m.photo)) != -1){
                        console.log(m.name);
                        scoperandom = -2;
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

            if (ret.length == 0){  alert('奖池中人员已全部抽完!'); }

            //- 保存中奖人结果
            localStorage.setItem('choosed', JSON.stringify(choosed));



            //- 首先清理抽奖人的效果，否则中奖人会被覆盖
            clearInterval(timer_big);
            clearInterval(timer_small);



            //- 将中奖展示后置100ms，防止时间冲突，篡改。
            setTimeout(function(){

                var excludeArr = new Array();

                //- 首先去重屏幕上重复的照片
                removeRepeat(excludeArr);

                //- 然后去重与中奖结果重复的照片
                removeRepeatWithLucker(ret,excludeArr);

                //- 展示中奖效果
                var nowLuckerPosition = new Array();

                for (var i in ret){

                    //- 随机中奖位置
                    var index;
                    do {
                        index = Math.ceil(Math.random()*photo_num);
                        if (index == 60){ index = 60-1; }


                    }while(indexNotIn(index,nowLuckerPosition))
                    nowLuckerPosition.push(index);

                    //- 中奖人照片id
                    var luckerId = ret[i];

                    //- 变更位置样式
                    var liObj = $('#gallery li:eq('+index+')')
                        .addClass('focus')
                        .addClass('hover');
                    var imgObj = $(liObj).find('img');

                    $(imgObj).attr('src','photo/'+luckerId+'.jpg').attr('alt',luckerId);
                }

                awardIndex++;
                player.volume = 0.3;

                //- 设置当前抽奖下标，当抽奖完成
                localStorage.setItem("awardIndex",awardIndex);
            },100)
        }
    });











































    //- 抽奖之前去重
    function removeRepeat(excludeArr){
        //- 获取所有的li下的img元素
        var imgsFromHtml = $('li img');


        $(imgsFromHtml).each(function(){
            var alt = $(this).attr('alt');

            //- 挨个去重
            replaceRepeatElement(alt,excludeArr,1);
            excludeArr.push(alt);
        });
    }





    /**
     *
     * 功能描述
     * @author Nero
     * @date 2020-01-05
     * alt 本次要唯一的量
     * excludeArr 本次随机要排除的数组
     * threasholdValue 至少有几个
     * @return
     */
    function replaceRepeatElement(alt,excludeArr,threasholdValue){
        var elementTotal = new Array();
        var imgsFromHtml = $('li img');


        $(imgsFromHtml).each(function(){
            if (alt == $(this).attr('alt')){
                elementTotal.push(this);
            }
        })



        //- 有重复记录,替换为新的。
        if (elementTotal.length > threasholdValue){
            $(elementTotal).each(function(){
                var index;
                do{
                    index = Math.ceil(Math.random()*file_num);
                }while(isInRepeat(index,excludeArr));

                $(this).attr('src','photo/'+index+'.jpg').attr('alt',index);
            });
        }
    }





    /**
     *
     * true 表示是重复的下标，false表示不重复
     * @author Nero
     * @date 2020-01-05
     *
     * @return
     */
    function isInRepeat(photoIndex,excludeArr){
        var imgsFromHtml = $('li img');

        $(imgsFromHtml).each(function(){
            if (photoIndex == $(this).attr('alt')){
                return true;
            }
        })


        if (undefined != excludeArr){
            for (var i in excludeArr){
                if (photoIndex == excludeArr[i]){
                    return true;
                }
            }
        }

        return false;
    }




//- 去重与中奖结果重复的照片
    function removeRepeatWithLucker(luckers,excludeArr){
        for (var i in luckers){
            excludeArr.push(luckers[i]);
        }

        $.each(luckers,function(index,item){
            replaceRepeatElement(item,excludeArr,0);
        })
    }
})();






