processID = () => {
  let id = localStorage.getItem("id");
  //判断本地是否有id
  if(id){
    return id;
  }
  //生成随机id
  const _id = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });

  //发出一个请求,查看服务器上是否有此id
  // axios.get('http://www.baidu.com').then(function (response) {
  //   if(!response.code == 200){
  //     processID();
  //     return;
  //   }
  // })

  //存储id
  localStorage.setItem('id',_id)
  return _id;
}

//获取滚动条width
function getScrollbarWidth() {
  var scrollDiv = document.createElement("div");
  scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}

function watermark(settings) {
  //默认设置
  var defaultSettings = {
    watermark_txt: "",
    watermark_x: 10, //水印起始位置x轴坐标
    watermark_y: 50, //水印起始位置Y轴坐标
    watermark_rows: 20, //水印行数
    watermark_cols: 20, //水印列数
    watermark_x_space: 100, //水印x轴间隔
    watermark_y_space: 100, //水印y轴间隔
    watermark_color: "#000000", //水印字体颜色
    watermark_alpha: 0.15, //水印透明度
    watermark_fontsize: "15px", //水印字体大小
    watermark_font: "微软雅黑", //水印字体
    watermark_width: 200, //水印宽度
    watermark_height: 65, //水印长度
    watermark_angle: 35 //水印倾斜度数
  };
  //采用配置项替换默认值，作用类似jquery.extend
  if (arguments.length === 1 && typeof arguments[0] === "object") {
    var src = arguments[0] || {};
    for (key in src) {
      if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key])
        continue;
      else if (src[key]) defaultSettings[key] = src[key];
    }
  }

  var oTemp = document.createDocumentFragment();

  //获取页面最大宽度
  var page_width = Math.max(
    document.body.scrollWidth,
    document.body.clientWidth
  );

  function hasScrollbar() {
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
  }

  //判断是否有滚动条的方法
  if(hasScrollbar()){
    //减去滚动条width
    let num = getScrollbarWidth() || page_width * 0.015;
    var page_width = page_width - num;
  }
  //获取页面最大长度
  var page_height = Math.max(
    document.body.scrollHeight,
    document.body.clientHeight
  );

  //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
  if (
    defaultSettings.watermark_cols == 0 ||
    parseInt(
      defaultSettings.watermark_x +
        defaultSettings.watermark_width * defaultSettings.watermark_cols +
        defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)
    ) > page_width
  ) {
    defaultSettings.watermark_cols = parseInt(
      (page_width -
        defaultSettings.watermark_x +
        defaultSettings.watermark_x_space) /
        (defaultSettings.watermark_width + defaultSettings.watermark_x_space)
    );
    defaultSettings.watermark_x_space = parseInt(
      (page_width -
        defaultSettings.watermark_x -
        defaultSettings.watermark_width * defaultSettings.watermark_cols) /
        (defaultSettings.watermark_cols - 1)
    );
  }
  //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
  if (
    defaultSettings.watermark_rows == 0 ||
    parseInt(
      defaultSettings.watermark_y +
        defaultSettings.watermark_height * defaultSettings.watermark_rows +
        defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)
    ) > page_height
  ) {
    defaultSettings.watermark_rows = parseInt(
      (defaultSettings.watermark_y_space +
        page_height -
        defaultSettings.watermark_y) /
        (defaultSettings.watermark_height + defaultSettings.watermark_y_space)
    );
    defaultSettings.watermark_y_space = parseInt(
      (page_height -
        defaultSettings.watermark_y -
        defaultSettings.watermark_height * defaultSettings.watermark_rows) /
        (defaultSettings.watermark_rows - 1)
    );
  }
  var x;
  var y;
  for (var i = 0; i < defaultSettings.watermark_rows; i++) {
    y =
      defaultSettings.watermark_y +
      (defaultSettings.watermark_y_space + defaultSettings.watermark_height) *
        i;
    for (var j = 0; j < defaultSettings.watermark_cols; j++) {
      x =
        defaultSettings.watermark_x +
        (defaultSettings.watermark_width + defaultSettings.watermark_x_space) *
          j;

      var mask_div = document.createElement("div");
      mask_div.id = "mask_div" + i + j;
      mask_div.appendChild(
        document.createTextNode(defaultSettings.watermark_txt)
      );
      //设置水印div倾斜显示
      mask_div.style.webkitTransform =
        "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.MozTransform =
        "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.msTransform =
        "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.OTransform =
        "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.transform =
        "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.visibility = "";
      mask_div.style.position = "absolute";
      mask_div.style.left = x + "px";
      mask_div.style.top = y + "px";
      mask_div.style.overflow = "hidden";
      mask_div.style.zIndex = "9999";
      mask_div.style.opacity = defaultSettings.watermark_alpha;
      mask_div.style.fontSize = defaultSettings.watermark_fontsize;
      mask_div.style.fontFamily = defaultSettings.watermark_font;
      mask_div.style.color = defaultSettings.watermark_color;
      mask_div.style.textAlign = "center";
      mask_div.style.width = defaultSettings.watermark_width + "px";
      mask_div.style.height = defaultSettings.watermark_height + "px";
      mask_div.style.display = "block";
      mask_div.style.pointerEvents = "none";
      oTemp.appendChild(mask_div);
    }
  }
  document.body.appendChild(oTemp);
}
window.onload = function() {
  //onload时触发水印绘制
  let { cip = "", cid = "", cname = "" } = returnCitySN;
  if(!cname){
    return false;
  }
  let _id = processID();
  watermark({ watermark_txt: cip + "\n" + cid + "\n" + cname + "\n" + _id });
};  