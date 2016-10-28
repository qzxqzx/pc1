/**
 * Created by Administrator on 2016/8/19.
 */
(function () {
    //获取元素：
    var oBox=document.getElementById('box1');
    var oBoxInner=oBox.getElementsByTagName('div')[0];
    var aDiv=oBoxInner.getElementsByTagName('div');
    var aImg=oBoxInner.getElementsByTagName('img');
    var oUl=oBox.getElementsByTagName('ul')[0];
    var aLi=oUl.getElementsByTagName('li');
    var oBtnL=oBox.getElementsByTagName('a')[0];
    var oBtnR=oBox.getElementsByTagName('a')[1];
    var data=null;
    var timer=null;
    var step=0;
    //1 获取并解析数据
    getData();
    function getData(){
        var xml=new XMLHttpRequest();
        xml.open('get','json/data.txt',false);
        xml.onreadystatechange= function () {
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    }
    console.log(data);
   //2 绑定数据
    bind();
    function bind(){
        var strDiv='';
        var strLi='';
        for(var i=0;i<data.length;i++){
            strDiv+='<div><img realImg="'+data[i].imgSrc+'" alt=""/></div>';
            strLi+=i===0?'<li class="show"></li>':'<li></li>';
        }
        strDiv+='<div><img realImg="'+data[0].imgSrc+'" alt=""/></div>';
        oBoxInner.innerHTML+=strDiv;
        oBoxInner.style.width= aDiv.length*aDiv[0].offsetWidth+'px';
        oUl.innerHTML+=strLi
    }
    //3.图片延迟加载
    setTimeout(lazyImg,10);
    function lazyImg(){
        for(var i=0;i<aImg.length;i++){
            (function (index) {
                var tmpImg=new Image;
                tmpImg.src=aImg[index].getAttribute('realImg');
                tmpImg.onload=function(){
                aImg[index].src=this.src;
                   tmpImg=null;
                }
            })(i);
        }
    }
    //4 自动轮播
   timer=setInterval(autoMove,2000);
    function autoMove(){
        if(step>=aDiv.length-1){
            step=0;
            utils.css(oBoxInner,'left',0);
        }
        step++;
        animate(oBoxInner,{left:-step*1226});
        bandTip();
    }
    //5 焦点自动播放
    function bandTip(){
        var tmpStep=step>=aDiv.length-1?0:step;
        for(var i=0;i<aLi.length;i++){
            aLi[i].className=i===tmpStep?'show':null
        }
    }
    //6鼠标移入停止 移出继续
    oBox.onmouseover= function () {
        clearInterval(timer);
        utils.css(oBtnL,'display','block');
        utils.css(oBtnR,'display','block');
    };
    oBox.onmouseout=function(){
        timer=setInterval(autoMove,2000);
        utils.css(oBtnL,'display','none');
        utils.css(oBtnR,'display','none');
    };
   // 7、点击焦点手动切换
    handleChange();
    function handleChange(){
        for(var i=0;i<aLi.length;i++){
            aLi[i].index=i;
            aLi[i].onclick= function () {
                step=this.index;
                animate(oBoxInner,{left:-step*1226});
                bandTip();
            }
        }
    }
   // 8.点击左右按钮手动切换
    oBtnR.onclick= autoMove;
    oBtnL.onclick= function () {
        if(step<=0){
            step=aDiv.length-1;
            utils.css(oBoxInner,'left',-step*1226)
        }
        step--;
        animate(oBoxInner,{left:-step*1226});
        bandTip();
    }
})();