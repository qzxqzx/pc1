/**
 * Created by Administrator on 2016/8/18.
 */
var utils = (function () {
    //在一定范围内通过class名获取一组元素
    var flag = 'getComputedStyle'in window;
    return {
        getByClass: function getByClass(strClass, parent) {
            parent || (parent = document);
            if (flag) {
                return Array.prototype.slice.call(parent.getElementsByClassName(strClass));
            }
            var aryClass = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
            var nodeList = parent.getElementsByTagName('*');
            var ary = [];
            for (var i = 0; i < nodeList.length; i++) {
                var curEle = nodeList[i];
                var bOk = true;
                for (var j = 0; j < aryClass.length; j++) {
                    var reg = new RegExp('\\b' + aryClass[j] + '\\b');
                    if (!reg.test(curEle.className)) {
                        bOk = false;
                        break;
                    }
                }
                if (bOk) {
                    ary.push(curEle);
                }
            }
            return ary;
        },
        hasClass: function (curEle, cName) {
            var reg = new RegExp('\\b' + cName + '\\b');
            return reg.test(curEle.className);
        },
        addClass: function (curEle, strClass) {
            var aryClass = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
            for (var i = 0; i < aryClass.length; i++) {
                if (!this.hasClass(curEle, aryClass[i])) {
                    curEle.className += ' ' + aryClass[i];
                }
            }
        },
        removeClass: function (curEle, strClass) {
            var aryClass = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
            for (var i = 0; i < aryClass.length; i++) {
                if (this.hasClass(curEle, aryClass[i])) {
                    var reg = new RegExp('\\b' + aryClass[i] + '\\b');
                    curEle.className = curEle.className.replace(reg, ' ').replace(/(^ +)|( +$)/g, '').replace(/\s+/g, ' ');
                }
            }
        },
        getCss: function (curEle, attr) {
            var val = null;
            var reg = null;
            if (flag) {
                val = getComputedStyle(curEle, false)[attr];
            } else {
                if (attr === 'opacity') {
                    val = curEle.currentStyle.filter;
                    reg = /^alpha\(opacity[=:](\d+)\)$/i;
                    return reg.test(val) ? reg.exec(val)[1] / 100 : 1;
                }
                val = curEle.currentStyle[attr];
            }
            reg = /^([+-])?(\d|([1-9]\d+(\.\d+)?))(px|pt|rem|em)$/i;
            return reg.test(val) ? parseFloat(val) : val;
        },
        setCss: function (curEle, attr, value) {
            if (attr === 'float') {
                curEle.style.cssFloat = value;
                curEle.style.styleFloat = value;
                return;
            }
            if (attr === 'opacity') {
                curEle.style.opacity = value;
                curEle.style.filter = 'alpha(opacity=' + (value * 100) + ')';
                return;
            }
            var reg = /^(width|height|top|bottom|left|right|(margin|top(top|bottom|left|right)?))$/i;
            if (reg.test(attr)) {
                if (!(value === 'auto' || value.toString().indexOf('%') !== -1)) {
                    value = parseFloat(value) + 'px';
                }
            }
            curEle.style[attr] = value;
        },
        setGroupCss: function (curEle, opt) {
            if (opt.toString() !== '[object Object]')return;
            for (var attr in opt) {
                this.setCss(curEle, attr, opt[attr]);
            }
        },
        css: function (curEle) {
            var arg2 = arguments[1];
            if (typeof arg2 === 'string') {
                var arg3 = arguments[2];
                if (arg3 === undefined) {
                    return this.getCss(curEle, arg2);
                } else {
                    this.setCss(curEle, arg2, arg3);
                }
            }
            if (arg2.toString() === '[object Object]') {
                this.setGroupCss(curEle, arg2);
            }
        },
        offset: function (curEle) {
            var l = curEle.offsetLeft;
            var t = curEle.offsetTop;
            var par = curEle.offsetParent;
            while (par) {
                if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
                    l += par.clientLeft;
                    t += par.clientTop;
                }
                l += par.offsetLeft;
                t += par.offsetTop;
                par = par.offsetParent;
            }
            return {left: l, top: t};
        },
        win: function (attr, value) {
            if (value === undefined) {
                return document.documentElement[attr] || document.body[attr];
            }
            document.documentElement[attr] = document.body[attr] = value;
        },
        makeArray: function (arg) {
            var ary = [];
            try {
                ary = Array.prototype.slice.call(arg);
            } catch (e) {
                for (var i = 0; i < arg.length; i++) {
                    ary.push(arg[i]);
                }
            }
            return ary;
        },
        jsonParse: function (str) {
            return 'JSON'in window ? JSON.parse(str) : eval('(' + str + ')');
        },
        rnd: function (n, m) {
            n = Number(n);
            m = Number(m);
            if (isNaN(n) || isNaN(m)) {
                return Math.random();
            }
            if (n > m) {
                var tmp = m;
                m = n;
                n = tmp;
            }
            return Math.round(Math.random() * (m - n) + n);
        },
        getChildren: function (curEle, tagname) {
            var nodeList = curEle.childNodes;
            var ary = [];
            for (var i = 0; i < nodeList.length; i++) {
                var cur = nodeList[i];
                if (cur.nodeType === 1) {
                    if (tagname !== undefined) {
                        if (curEle.tagName.toLowerCase() === tagname.toLowerCase()) {
                            ary.push(cur);
                        }
                    } else {
                        ary.push(cur);
                    }
                }
            }
            return ary;
        },
        prev: function (curEle) {
            if (flag) {
                return curEle.previousElementSibling;
            }
            var pre = curEle.previousSibling;
            while (pre && pre.nodeType !== 1) {
                pre = pre.previousSibling;
            }
            return prev;
        },
        prevAll: function (curEle) {
            var pre = this.prev(curEle);
            var ary = [];
            while (pre) {
                ary.push(pre);
                pre = this.prev(pre);
            }
            return ary;
        },
        next: function (curEle) {
            if (flag) {
                return curEle.nextElementSibling;
            }
            var nex = curEle.nextSibling;
            while (cur && cur.nodeType !== 1) {
                nex = nex.nextSibling;
            }
            return nex;
        },
        nextAll: function (curEle) {
            var nex = this.next(curEle);
            var ary = [];
            while (nex) {
                ary.push(nex);
                nex = this.next(nex);
            }
            return ary;
        },
        sibling: function (curEle) {
            var pre = this.prev(curEle);
            var nex = this.next(curEle);
            var ary = [];
            if (pre) {
                ary.push(pre);
            }
            if (nex) {
                ary.push(nex);
            }
            return ary;
        },
        siblings: function (curEle) {
            var aryPre = this.prevAll(curEle);
            var aryNex = this.nextAll(curEle);
            return aryPre.concat(aryNex);
        },
        firstChild: function (curEle) {
            var childs = this.getChildren(curEle);
            return childs[0];
        },
        lastChild: function (curEle) {
            var last = this.nextAll(curEle);
            return last[last.length - 1];
        },
        index: function (curEle) {
            return this.prevAll(curEle).length;
        },
        appendChild: function (parent,curEle ) {
            parent.appendChild(curEle);
        },
        prependChild: function (parent,curEle) {
            var first=this.firstChild(parent);
            if(first){
                parent.insertBefore(curEle,first);
            }else{
                parent.appendChild(curEle);
            }
        },
        insertBefore: function (newCurEle, oldCurEle) {
            oldCurEle.parentNode.insertBefore(newCurEle,oldCurEle);
        },
        insertAfter: function (newEle, oldEle) {
            var next =this.next(oldEle);
            if(next){
                oldEle.parentNode.insertBefore(newEle,next);
            }else{
                oldEle.parentNode.insertBefore(newEle,oldEle);
            }
        }


    }
})();
