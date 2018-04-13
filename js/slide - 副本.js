var interval;
// var type="是";
var flag=0;//禁用微信下拉标志
var selectVal="对襟"; //默认选项
var delayTime=150;//GIF 图片延迟时间 毫秒
var picImg;
var path="";
var saveFlag=0;
var tempPath="";
var canvascj={
    "scale":1,
    "lastX":0,
    "lastY":0
};
var imgStatus={
    "width":0,
    "height":0,
    "showWidth":0,
    "showHeight":0,
    "scale":1
};

$(document).ready(function () {
    // init();
    // var audio = $("#media")[0];
    // if(audio==null) return;
    // audio.play();
    // var obj = document.getElementById('audio_btn');
    // var obj1 = document.getElementById('yinfu');
    // $("#yinfu").click(function () {
    //     var audio = $("#media")[0];
    //     if (audio !== null) {
    //         if (audio.paused) {
    //             toggleClass(obj, "play_yinfu");
    //             toggleClass(obj1, "off");
    //             audio.play(); //audio.play();// 这个就是播放  
    //         } else {
    //             toggleClass(obj, "play_yinfu");
    //             toggleClass(obj1, "off");
    //             audio.pause(); // 这个就是暂停
    //         }
    //     }
    // });

});
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}
function toggleClass(obj, cls) {
    if (hasClass(obj, cls)) {
        removeClass(obj, cls);
    } else {
        addClass(obj, cls);
    }
}

function init (imgBase64){
    // alert("init");
    flag=1;
    var _wid=innerWidth;
    var _heg=innerHeight;
    var _canvas = $("<canvas class='canvas' id='canvascj' width='"+_wid+"' height='"+_heg+"' ></canvas>");
    $(".pagecj").append(_canvas);
    draw(0,_wid,imgBase64);
    var seletor=$("#cjbg");
    var canvas=document.getElementById("canvascj");
    touchScale(seletor,canvas);
}
function selectFileImage(fileObj) {
    var img_file = fileObj.files['0'];  
    if (img_file == null) {
        return false;
    }
    $(".loading").show();
    var imgBase64="";
    var type = "." + img_file.name.split(".")[1];
    var maxsize =1 * 1024 * 1024;//1MB
    //图片方向角
    var Orientation = null;
    var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式  
    if (!rFilter.test(img_file.type)) {  
        //showMyTips("请选择jpeg、png格式的图片", false);  
        return;  
    }
    //获取照片方向角属性，用户旋转控制  
    EXIF.getData(img_file, function() {  
        // alert(EXIF.pretty(this));  
        EXIF.getAllTags(this);   
        // alert(EXIF.getTag(this, 'Orientation'));   
        Orientation = EXIF.getTag(this, 'Orientation');  
    });  
    
    var reader = new FileReader();
    reader.onload = function(e) {
        var image = new Image();  
        image.src = e.target.result;
        var imageurl = e.target.result;

        //对图片进行压缩处理
        // image.src = imageurl;
        image.onload = function() {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext('2d');

            var w = image.naturalWidth,
            h = image.naturalHeight,
            ViewWidth, ViewHeight, scale = Math.max(w / $(window).width(), h / $(window).height());
            
            ViewWidth=w;ViewHeight=h;
            if (imageurl.length > maxsize) {
                if (scale > 1) {
                    ViewWidth = w / 4;
                    ViewHeight = h / 4;
                } else {
                    ViewWidth = w;
                    ViewHeight = h;
                }
            }
            canvas.width = ViewWidth;  
            canvas.height = ViewHeight;  

            ctx.drawImage(this, 0, 0, ViewWidth, ViewHeight);
            if (navigator.userAgent.match(/iphone/i)) {  
                // alert('iphone'+ Orientation); 
                if(Orientation != "" && Orientation != 1){  
                    //alert('旋转处理');  
                    if(Orientation==6){
                        // alert('需要顺时针（向左）90度旋转'+Orientation);  
                        rotateImg(this,'left',canvas);    
                    } 
                }  
            }
            var imgtype="image/jpeg";
            if(type==".png"){
                imgtype="image/png";
            }
            var data = canvas.toDataURL(imgtype);
            // data = data.split(',')[1];
            imgBase64 = data;
            // $("#source").attr("src",imgBase64);
            // alert(imgBase64);
            console.log({
                type: type,
                imgBase64: imgBase64
            });
            $(".loading").hide();
            init(imgBase64);//初始化下一步的图片
        };
    }
    reader.readAsDataURL(img_file);
};

function draw(start, width,imgBase64) {
    // var start=10; //起始位置 x轴坐标
    // var width=200; //宽度
    console.log("width", width);
    var canvas = document.getElementById("canvascj");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        let wd = canvas.width,
        hg = canvas.height;
        //放大画布，然后通过css 缩放，提高画布精度，防止出现锯齿 需要裁剪的话不能使用
        // if (window.devicePixelRatio) { //设备上物理像素   该方案处理画布锯齿问题
        //     canvas.style.width = wd + "px";
        //     canvas.style.height = hg + "px";
        //     canvas.height = hg * window.devicePixelRatio;
        //     canvas.width = wd * window.devicePixelRatio;
        //     ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        // }
        // console.log("###src:",$("#source").attr("src"));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        picImg = new Image();
        picImg.src = imgBase64; //$("#source").attr("src");
        // alert($("#source").attr("src"));
        alert("picImg.onload"+picImg.src.length);
        picImg.onload = function(e){
            // console.log(e);
            alert("###"+e.path[0].width);
            imgStatus.width=e.path[0].width;
            imgStatus.height=e.path[0].height;
            imgStatus.showWidth=width;
            imgStatus.showHeight=width/imgStatus.width*imgStatus.height;
            imgStatus.scale=width/imgStatus.width;
            ctx.drawImage(picImg,0,0,imgStatus.showWidth,imgStatus.showHeight);
            $(".page2").hide();//
            $(".pagecj").show();//
        }
    }
}
//选择完毕 重要
$(".icon_btn1").click(function(){
    if(saveFlag==1){
        return false;
    }
    $(".saveTips").show()
    saveFlag=1;
    //经过计算得出，镂空部分的大小是400(宽度) * 522(高度)
    //在640*1008的设计大小下
    let _width=$(".page").width();
    let _wid=_width*400/640;
    let _heg=_wid*522/400;
    let bili=_width/640;//缩放比例
    let _chaX=bili*117;//需要截图的(左上角)起点距离左上角的X轴距离
    let _chaY=bili*202;//需要截图的(左上角)起点距离左上角的Y轴距离
    if($("#canvaspian").length==0){
        var _canvas = $("<canvas class='canvaspian hide' id='canvaspian' width='"+_wid+"' height='"+_heg+"' ></canvas>");
        $(".pagecj").append(_canvas);
    }
    // var _tempcanvas=$("#canvaspian");
    var _tempcanvas=document.getElementById("canvaspian");
    var canvas = document.getElementById("canvascj");
    if (_tempcanvas.getContext) {
        var ctx = _tempcanvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvas,_chaX,_chaY, _wid, _heg,0,0, _wid, _heg);
        console.log(canvascj.lastX+_chaX, +_chaY, _wid, _heg);
        var data = _tempcanvas.toDataURL("image/jpeg");
        $("#pian").attr("src",data);
        // $("#result").attr("src",data);
        canvas2Gif();
    }
});
//跳转到最后一页的处理
function lastProgram(){
    saveFlag=0;
    $(".saveTips").hide();
    flag=0;//不禁止默认事件，放开默认事件
    let _wid3=$(".page").width();
    let _height=_wid3*(475/640)*(509/475);
    $(".page3 .content").css("height",_height);
    $(".pagecj").hide();
    $(".page3").show();
}
//画布转Gif图片
function canvas2Gif() {
    var gif = new GIF({
        workers: 4,
        workerScript: './js/gif.worker.js',
        width: 800,
        height: 680,
        background: '#ffffff',//原透明色替换为白色
        transparent: 'blue',//把图片中的白色替换为gif的透明色
        repeat:0,   // -1 不重复 0 重复
        quality: 10
    });
    //合成图片成功后
    gif.on('finished', function(blob) {
        blobToImage(blob,function(dataurl){
            lastProgram();//处理完毕
            // $("bady").append(dataurl)
        });
    });
    var obj= selectVal=="对襟"?"1":selectVal=="旗袍"?"2":selectVal=="马褂"?"3":"1";
    var canvas = document.getElementById("gifcanvas");
    if (canvas.getContext) {
        // var ctx = canvas.getContext("2d");
        path="./gif/"+obj+"/";
        try{
            dogif (canvas, gif);
        }
        catch(err){
            saveFlag=0;
            $(".saveTips").hide();
            alert(err.message+";请刷新后重试！")
        }
    }
}
function dogif (canvas, gif) {
    var ctx = canvas.getContext("2d");
    tempPath=path+"1.png";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let Pimg =new Image();
    Pimg.src = $("#pian").attr("src");
    Pimg.onload = function(e){
        ctx.drawImage(Pimg,330,275,150,190);
        var img1 = new Image();
        img1.src = tempPath;
        img1.onload = function(e){
            ctx.drawImage(img1,0,0,canvas.width,canvas.height);
            gif.addFrame(canvas, {
                copy: true,delay:delayTime
            });
            // console.log("渲染图片")
            // //渲染图片
            // gif.render();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            tempPath=path+"2.png";
            let Pimg =new Image();
            Pimg.src = $("#pian").attr("src");
            Pimg.onload = function(e){
                ctx.drawImage(Pimg,330,275,150,190);
                var img2 = new Image();
                img2.src = tempPath;
                img2.onload = function(e){
                    console.log("img on load! ",tempPath," addFrame");
                    ctx.drawImage(img2,0,0,canvas.width,canvas.height);
                    gif.addFrame(canvas, {
                        copy: true,delay:delayTime
                    });

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    tempPath=path+"3.png";
                    let Pimg =new Image();
                    Pimg.src = $("#pian").attr("src");
                    Pimg.onload = function(e){
                        ctx.drawImage(Pimg,330,275,150,190);
                        var img3 = new Image();
                        img3.src = tempPath;
                        img3.onload = function(e){
                            console.log("img on load! ",tempPath," addFrame");
                            ctx.drawImage(img3,0,0,canvas.width,canvas.height);
                            gif.addFrame(canvas, {
                                copy: true,delay:delayTime
                            });

                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            tempPath=path+"4.png";
                            let Pimg =new Image();
                            Pimg.src = $("#pian").attr("src");
                            Pimg.onload = function(e){
                                ctx.drawImage(Pimg,330,275,150,190);
                                var img4 = new Image();
                                img4.src = tempPath;
                                img4.onload = function(e){
                                    console.log("img on load! ",tempPath," addFrame");
                                    ctx.drawImage(img4,0,0,canvas.width,canvas.height);
                                    gif.addFrame(canvas, {
                                        copy: true,delay:delayTime
                                    });

                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                    tempPath=path+"5.png";
                                    let Pimg =new Image();
                                    Pimg.src = $("#pian").attr("src");
                                    Pimg.onload = function(e){
                                        ctx.drawImage(Pimg,330,275,150,190);
                                        var img5 = new Image();
                                        img5.src = tempPath;
                                        img5.onload = function(e){
                                            console.log("img on load! ",tempPath," addFrame");
                                            ctx.drawImage(img5,0,0,canvas.width,canvas.height);
                                            gif.addFrame(canvas, {
                                                copy: true,delay:delayTime
                                            });

                                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                                            tempPath=path+"6.png";
                                            let Pimg =new Image();
                                            Pimg.src = $("#pian").attr("src");
                                            Pimg.onload = function(e){
                                                ctx.drawImage(Pimg,330,275,150,190);
                                                var img6 = new Image();
                                                img6.src = tempPath;
                                                img6.onload = function(e){
                                                    console.log("img on load! ",tempPath," addFrame");
                                                    ctx.drawImage(img6,0,0,canvas.width,canvas.height);
                                                    gif.addFrame(canvas, {
                                                        copy: true,delay:delayTime
                                                    });

                                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                    tempPath=path+"7.png";
                                                    let Pimg =new Image();
                                                    Pimg.src = $("#pian").attr("src");
                                                    Pimg.onload = function(e){
                                                        ctx.drawImage(Pimg,330,275,150,190);
                                                        var img7 = new Image();
                                                        img7.src = tempPath;
                                                        img7.onload = function(e){
                                                            console.log("img on load! ",tempPath," addFrame");
                                                            ctx.drawImage(img7,0,0,canvas.width,canvas.height);
                                                            gif.addFrame(canvas, {
                                                                copy: true,delay:delayTime
                                                            });
                                                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                            tempPath=path+"8.png";
                                                            let Pimg =new Image();
                                                            Pimg.src = $("#pian").attr("src");
                                                            Pimg.onload = function(e){
                                                                ctx.drawImage(Pimg,330,275,150,190);
                                                                var img8 = new Image();
                                                                img8.src = tempPath;
                                                                img8.onload = function(e){
                                                                    console.log("img on load! ",tempPath," addFrame");
                                                                    ctx.drawImage(img8,0,0,canvas.width,canvas.height);
                                                                    gif.addFrame(canvas, {
                                                                        copy: true,delay:delayTime
                                                                    });

                                                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                                    tempPath=path+"9.png";
                                                                    let Pimg =new Image();
                                                                    Pimg.src = $("#pian").attr("src");
                                                                    Pimg.onload = function(e){
                                                                        ctx.drawImage(Pimg,330,275,150,190);
                                                                        var img9 = new Image();
                                                                        img9.src = tempPath;
                                                                        img9.onload = function(e){
                                                                            console.log("img on load! ",tempPath," addFrame");
                                                                            ctx.drawImage(img9,0,0,canvas.width,canvas.height);
                                                                            gif.addFrame(canvas, {
                                                                                copy: true,delay:delayTime
                                                                            });

                                                                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                                            tempPath=path+"10.png";
                                                                            let Pimg =new Image();
                                                                            Pimg.src = $("#pian").attr("src");
                                                                            Pimg.onload = function(e){
                                                                                ctx.drawImage(Pimg,330,275,150,190);
                                                                                var img10 = new Image();
                                                                                img10.src = tempPath;
                                                                                img10.onload = function(e){
                                                                                    console.log("img on load! ",tempPath," addFrame");
                                                                                    ctx.drawImage(img10,0,0,canvas.width,canvas.height);
                                                                                    gif.addFrame(canvas, {
                                                                                        copy: true,delay:delayTime
                                                                                    });

                                                                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                                                    tempPath=path+"11.png";
                                                                                    let Pimg =new Image();
                                                                                    Pimg.src = $("#pian").attr("src");
                                                                                    Pimg.onload = function(e){
                                                                                        ctx.drawImage(Pimg,330,275,150,190);
                                                                                        var img11 = new Image();
                                                                                        img11.src = tempPath;
                                                                                        img11.onload = function(e){
                                                                                            console.log("img on load! ",tempPath," addFrame");
                                                                                            ctx.drawImage(img11,0,0,canvas.width,canvas.height);
                                                                                            gif.addFrame(canvas, {
                                                                                                copy: true,delay:delayTime
                                                                                            });
                                                                                            
                                                                                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                                                            tempPath=path+"12.png";
                                                                                            let Pimg =new Image();
                                                                                            Pimg.src = $("#pian").attr("src");
                                                                                            Pimg.onload = function(e){
                                                                                                ctx.drawImage(Pimg,330,275,150,190);
                                                                                                var img12 = new Image();
                                                                                                img12.src = tempPath;
                                                                                                img12.onload = function(e){
                                                                                                    console.log("img on load! ",tempPath," addFrame");
                                                                                                    ctx.drawImage(img12,0,0,canvas.width,canvas.height);
                                                                                                    gif.addFrame(canvas, {
                                                                                                        copy: true,delay:delayTime
                                                                                                    });
                                                                                                    console.log("渲染图片")
                                                                                                    //渲染图片
                                                                                                    gif.render();
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // return i;
}
// File/Blob对象转DataURL
function fileOrBlobToDataURL(obj, cb){
    var a = new FileReader();
    a.readAsDataURL(obj);
    a.onload = function (e){
        cb(e.target.result);
    };
}
    // Blob转image
function blobToImage(blob, cb){
    fileOrBlobToDataURL(blob, function (dataurl){
        // var img = new Image();
        var img = document.getElementById('result');
        img.src = dataurl;
        cb(img);
    });
}
//对图片旋转处理 added by zjs  
function rotateImg(img, direction,canvas) {    
        //alert(img);  
        //最小与最大旋转方向，图片旋转4次后回到原方向    
        var min_step = 0;    
        var max_step = 3;    
        //var img = document.getElementById(pid);    
        if (img == null)return;    
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错    
        var height = img.height;    
        var width = img.width;    
        //var step = img.getAttribute('step');    
        var step = 2;    
        if (step == null) {    
            step = min_step;    
        }    
        if (direction == 'right') {    
            step++;    
            //旋转到原位置，即超过最大值    
            step > max_step && (step = min_step);    
        } else {    
            step--;    
            step < min_step && (step = max_step);    
        }    
        //img.setAttribute('step', step);    
        /*var canvas = document.getElementById('pic_' + pid);   
        if (canvas == null) {   
            img.style.display = 'none';   
            canvas = document.createElement('canvas');   
            canvas.setAttribute('id', 'pic_' + pid);   
            img.parentNode.appendChild(canvas);   
        }  */  
        //旋转角度以弧度值为参数    
        var degree = step * 90 * Math.PI / 180;    
        var ctx = canvas.getContext('2d');    
        switch (step) {    
            case 0:    
                canvas.width = width;    
                canvas.height = height;    
                ctx.drawImage(img, 0, 0);    
                break;    
            case 1:    
                canvas.width = height;    
                canvas.height = width;    
                ctx.rotate(degree);    
                ctx.drawImage(img, 0, -height);    
                break;    
            case 2:    
                canvas.width = width;    
                canvas.height = height;    
                ctx.rotate(degree);    
                ctx.drawImage(img, -width, -height);    
                break;    
            case 3:    
                canvas.width = height;    
                canvas.height = width;    
                ctx.rotate(degree);    
                ctx.drawImage(img, -width, 0);    
                break;    
        }    
}
//跳转到第二页
$(".pg0_01").click(function(){
    // console.log("ttt");
    let _wid=$(".page").width();
    let _height=_wid*(541/640)*(706/541);
    $(".page1 .content").css("height",_height);
    $(".page0").hide();//
    $(".page1").show();//
});
$(".pg1_03").click(function(){
    selectVal="旗袍";
    headchange();
});
$(".pg1_02").click(function(){
    selectVal="对襟";
    headchange();
});
$(".pg1_01").click(function(){
    selectVal="马褂";
    headchange();
});


function headchange(){
    console.log(selectVal);
    if(selectVal=="马褂"){
        $("#cjbg").attr("src","images/pgcj_01.png");
        $(".pg1_03").hide();
        $(".pg1_02").hide();
        $(".pg1_01").removeClass("c1").addClass("c1");
    }
    else if(selectVal=="对襟"){
        $("#cjbg").attr("src","images/pgcj_03.png");
        $(".pg1_03").hide();
        $(".pg1_01").hide();
        $(".pg1_02").css("left",1.9+"rem");
    }
    else if(selectVal=="旗袍"){
        $("#cjbg").attr("src","images/pgcj_02.png");
        $(".pg1_02").hide();
        $(".pg1_01").hide();
        $(".pg1_03").removeClass("c2").addClass("c2");
    }
    $(".btn_next").show();
}
//选好了，2秒后进入下一页
$(".pg1_04").click(function(){
    setTimeout(function(){
        let _wid=$(".page").width();
        let _height=_wid*(541/640)*(709/541);
        $(".page2 .content").css("height",_height);
        $(".page1").hide();//
        $(".page2").show();//
    },300);
});
//重新选择
$(".pg1_05").click(function(){
    selectVal="对襟";
    $(".pg1_01").removeClass("c1").show();
    $(".pg1_02").show();
    $(".pg1_03").removeClass("c2").show();
    $(".btn_next").hide();
});
//返回选择图片
$(".icon_btn2").click(function(){
    $(".page2").show();//
    $(".pagecj").hide();//
    flag=0;
});
