var oUl=document.getElementById('selectOption'),
    aLis=utils.getChildren(oUl),
    oDiv=document.getElementById('dp-content'),
    aUl=utils.getChildren(oDiv);
function changeTab(n){
    for(var i=0;i<aLis.length;i++){
        aLis[i].className=null;
        aUl[i].style.display='none';
    }
        aLis[n].className='tab-active';
        aUl[n].style.display='block';
}

    for(var i=0;i<aLis.length;i++){
        aLis[i].index=i;
        aLis[i].onmouseover= function () {
            changeTab(this.index);
        }
    }



