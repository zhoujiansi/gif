var touchScale = function(seletor ,canvas) {
    var startX, endX, scale=1, x1, x2, y1, y2, imgLeft, imgTop, imgWidth, imgHeight, one = false,
    $touch = $(seletor),
    $canvas= canvas,
    maxScale=4.0,
    minScale=0.1,
    lastScale=1,
    lastChaX=0,
    lastChaY=0,
    originalWidth = $touch.width(),
    originalHeight = $touch.height(),
    baseScale = parseFloat(originalWidth / originalHeight),
    imgData = [];
    // bgTop = parseInt($(bg).css('top'));
    function siteData(name) {
        imgLeft = parseInt(name.css('left'));
        imgTop = parseInt(name.css('top'));
        imgWidth = name.width();
        imgHeight = name.height();
    }
    //移动逻辑处理
    function canvasmove(){
        var _chaX=(x2 - x1)/canvascj.scale+canvascj.lastX;
        var _chaY=(y2 - y1)/canvascj.scale+canvascj.lastY;
        lastChaX=(x2 - x1);
        lastChaY=(y2 - y1);
        // _chaX=_chaX/2;
        // _chaY=_chaY/2;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.scale(scale,scale);
        // ctx.save();
        // ctx.translate(_chaX,_chaY);
        // ctx.setTransform(1, 0, 1, 0, _chaX, _chaY)
        // console.log(realwidth,realheight)
        ctx.drawImage(picImg, _chaX, _chaY, imgStatus.showWidth, imgStatus.showHeight);
        // ctx.restore();
        
        // ctx.stroke(); 
        // ctx.restore();
        // console.log(x1,x2,y1,y2,_chaX,_chaY)
    }
    //缩放逻辑处理
    function canvasscale(){
        // scale=scale*canvascj.scale;
        if(canvascj.scale >= maxScale){
            return false;
            // scale = maxScale;
        }
        if(canvascj.scale <= minScale){
            return false;
            // scale = minScale;
        }
        // let realx=canvascj.lastX*scale;
        // let realy=canvascj.lastY*scale;
        console.log("scale is:",scale);
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.save();
        // ctx.scale(imgStatus.scale, imgStatus.scale);
        ctx.scale(scale,scale);
        ctx.drawImage(picImg, canvascj.lastX==null?0:canvascj.lastX, canvascj.lastY==null?0:canvascj.lastY, imgStatus.showWidth, imgStatus.showHeight);
        // ctx.restore();

    }
    // $(seletor).parent().
    $(document).on('touchstart touchmove touchend', $(seletor), function(event) {
        console.log("touchstart")
        var $me = $(seletor),
        touch1 = event.originalEvent.targetTouches[0],
        // 第一根手指touch事件
        touch2 = event.originalEvent.targetTouches[1],
        // 第二根手指touch事件
        fingers = event.originalEvent.touches.length; // 屏幕上手指数量
        // 手指放到屏幕上的时候，还没有进行其他操作
        if (event.type == 'touchstart') {
            // scale=canvascj.scale;
            if (fingers == 2) {
                // alert(fingers);
                // 缩放图片的时候X坐标起始值
                startX = Math.abs(touch1.pageX - touch2.pageX);
                one = false;
            } else if (fingers == 1) {
                x1 = touch1.pageX;
                y1 = touch1.pageY;
                one = true;
            }
            let _t=event.target.classList[0];
            if(flag==1 && _t.indexOf("icon") < 0){
                event.preventDefault();//禁止默认事件
            }
            // siteData($me);
        }
        // 手指在屏幕上滑动
        else if (event.type == 'touchmove') {
            if (fingers == 2) {
                // 缩放图片的时候X坐标滑动变化值
                endX = Math.abs(touch1.pageX - touch2.pageX);
                scale = endX / startX;
                canvascj.scale=scale*canvascj.scale;//计算真实比例
                if(canvascj.scale>= maxScale || canvascj.scale<=minScale){
                    scale =  lastScale;
                    return false;
                }
                lastScale=scale
                startX = endX;
                canvasscale();
            } else if (fingers == 1) {
                x2 = touch1.pageX;
                y2 = touch1.pageY;
                // scale=scale+0.01;
                if (one) {
                    canvasmove();
                    // canvasscale();
                }
            }
            let _t=event.target.classList[0];
            if(flag==1 && _t.indexOf("icon") < 0){
                event.preventDefault();//禁止默认事件
            }
        }
        //手指移开屏幕
        else if (event.type == 'touchend') {
            // alert(fingers)
            // if(minScale<=scale<=maxScale){
            //     //记录目前缩放比例（相对原图，未变形）
            //     // canvascj.scale=scale*canvascj.scale;
            // }
            // if (fingers == 1) {
                // console.log("##",scale,canvascj.scale)
                // canvascj.scale=scale*canvascj.scale;
                // alert(scale + typeof(scale))
            // } else if (fingers==0) {
                // var _chaX=(x2 - x1);//canvascj.scale;
                // var _chaY=(y2 - y1);//canvascj.scale;
                canvascj.lastX+=lastChaX/canvascj.scale;
                canvascj.lastY+=lastChaY/canvascj.scale;
                //canvascj.lastX 真实距离(缩放比例为1的情况下的像素值)
                // alert(lastChaX+canvascj.scale);
            // }
            console.log(canvascj.scale)
            x2=x1=y2=y1=0;
            lastChaX=lastChaY=0;
            let _t=event.target.classList[0];
            if(flag==1 && _t.indexOf("icon") < 0){
                event.preventDefault();//禁止默认事件
            }
            // var ctx = canvas.getContext("2d");
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ctx.restore();
            // 手指移开后保存图片的宽
            // originalWidth = $touch.width(),
            // siteData($me);
            // imgData = [[imgLeft, imgTop - bgTop, imgWidth, imgHeight], [0, 0, 640, 640]];
        }
    });
    var getData = function() {
        return imgData;
    };
    return {
        imgData: getData
    }
};