//- bgmArray
var bgmArr = ["audio/bgm.mp3","audio/dididiudiu.mp3","audio/Fingerbang.mp3"];


//- 当前下标
var bgmIndex = 0;


var player = $("#bgm")[0];
player.src = bgmArr[bgmIndex];         //每次读数组最后一个元素
player.addEventListener('ended', playEndedHandler, false);
player.loop = false;//禁止循环，否则无法触发ended事件



//- 音乐handler
function playEndedHandler(){
    bgmIndex++;
    if (bgmIndex == bgmArr.length){
        bgmIndex = 0;
    }


    player.src = bgmArr[bgmIndex];
    player.play();
    !arr.length && myAudio.removeEventListener('ended',playEndedHandler,false);//只有一个元素时解除绑定
}


