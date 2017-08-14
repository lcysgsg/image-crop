function $(id) {
  return document.getElementById(id)
}
var cArea = $('cArea'); // 图片容器
var clipImg = $('clipImg'); // 裁剪层
var drag = $('drag'); // 拖拽区域
var previewImg = $('previewImg'); //预览图
var cAreaH = cArea.offsetHeight; // 图片显示区的高度
var cAreaW = cArea.offsetWidth; // 图片显示区的宽度
var cAreaTop = getPosition(cArea).Y; //图片容器距离浏览器上边界距离
var cAreaLeft = getPosition(cArea).X; //图片容器距离浏览器左边界距离
var mousePosition, mouseStartX, mouseStartY, dragLeft, dragTop, dragMaxH, dragMaxW // 定义按下鼠标时产生的变量

drag.addEventListener('mousedown', startDrag, false); // 给拖拽区添加鼠标按下事件

function startDrag(e) {
  e.preventDefault();
  mouseStartX = e.clientX; // 刚按下鼠标时 鼠标相对浏览器边界的 X 坐标
  mouseStartY = e.clientY; // 刚按下鼠标时 鼠标相对浏览器边界的 Y 坐标
  dragLeft = drag.offsetLeft; // 刚按下鼠标时 裁剪区的距离图片显示区 左 边界距离
  dragTop = drag.offsetTop; // 刚按下鼠标时 裁剪区的距离图片显示区 上 边界距离
  dragMaxH = cAreaH - drag.offsetHeight; // 垂直最大范围
  dragMaxW = cAreaW - drag.offsetWidth; // 水平最大范围
  mousePosition = e.target.id; // 判断按下位置
  document.addEventListener('mousemove', dragging, false);
  document.addEventListener('mouseup', clearDragEvent, false);
}

// 鼠标松开时释放事件
function clearDragEvent(e) {
  document.removeEventListener('mousemove', dragging, false);
  document.removeEventListener('mouseup', clearDragEvent, false)
}

// 整体拖拽
function dragMove(e) {
  var moveX = e.clientX - mouseStartX; // 拖拽中 鼠标坐标变化值
  var moveY = e.clientY - mouseStartY; // 拖拽中 鼠标坐标变化值
  var destinationX = Math.min((moveX + dragLeft), dragMaxW); // 限制拖动的最大范围，避免超出右和下边界
  var destinationY = Math.min((moveY + dragTop), dragMaxH); // 限制拖动的最大范围，避免超出右和下边界
  drag.style.left = destinationX < 0 ? 0 : destinationX + 'px'; // 限制最小范围，避免超出上和左边界
  drag.style.top = destinationY < 0 ? 0 : destinationY + 'px'; // 限制最小范围，避免超出上和左边界
  setClip();
}

// 鼠标移动
function dragging(e) {
  e.stopPropagation();
  window.getSelection().removeAllRanges(); // 避免图片被中			
  switch (mousePosition) {
    case 'drag':
      dragMove(e);
      break;
    case 'cUp':
      upDownMove(e, 'up');
      break;
    case 'cDown':
      upDownMove(e, 'down');
      break;
    case 'cLeft':
      leftRightMove(e, 'left');
      break;
    case 'cRight':
      leftRightMove(e, 'right');
      break;
    case 'cLeftUp':
      leftRightMove(e, 'left');
      upDownMove(e, 'up');
      break;
    case 'cRightUp':
      leftRightMove(e, 'right');
      upDownMove(e, 'up');
      break;
    case 'cLeftDown':
      leftRightMove(e, 'left');
      upDownMove(e, 'down');
      break;
    case 'cRightDown':
      leftRightMove(e, 'right');
      upDownMove(e, 'down');
      break;
    default:
      break;
  }
}

// 控制裁剪显示区域和拖拽区同步
function setClip() {
  var clipTop = drag.offsetTop;
  var clipLeft = drag.offsetLeft;
  var clipRight = drag.offsetWidth + drag.offsetLeft;
  var clipBottom = drag.offsetHeight + drag.offsetTop;
  clipImg.style.clip = 'rect(' + clipTop + 'px ' + clipRight + 'px ' + clipBottom + 'px ' + clipLeft + 'px)';
  setPreview({
    top: clipTop,
    right: clipRight,
    bottom: clipBottom,
    left: clipLeft
  })
}

// 上下方向的边框拖动
function upDownMove(e, str) {
  var changeHeight
  var draggingY = e.clientY;
  if (draggingY < cAreaTop) draggingY = cAreaTop;
  if (draggingY > cAreaTop + cAreaH) draggingY = cAreaTop + cAreaH;
  var dragY = getPosition(drag).Y;
  if (str === 'up') {
    changeHeight = dragY - draggingY;
    drag.style.top = drag.offsetTop - dragY + draggingY + 'px';
  } else if (str === 'down') {
    changeHeight = draggingY - drag.offsetHeight - dragY;
  }
  drag.style.height = drag.offsetHeight + changeHeight + 'px';
  setClip();
}

// 水平方向的边框拖动
function leftRightMove(e, str) {
  var changeWidth
  var draggingX = e.clientX;
  if (draggingX < cAreaLeft) draggingX = cAreaLeft;
  if (draggingX > cAreaLeft + cAreaW) draggingX = cAreaLeft + cAreaW;
  var dragX = getPosition(drag).X;
  if (str === 'left') {
    changeWidth = dragX - draggingX;
    drag.style.left = drag.offsetLeft - changeWidth + 'px';
  } else if (str === 'right') {
    changeWidth = draggingX - drag.offsetWidth - dragX;
  }
  drag.style.width = drag.offsetWidth + changeWidth + 'px';
  setClip();
}

// 获取元素距离浏览器边界坐标
function getPosition(elem) {
  var elemX = elem.offsetLeft;
  var elemY = elem.offsetTop;
  while (elem = elem.offsetParent) {
    elemX += elem.offsetLeft;
    elemY += elem.offsetTop
  }
  return {
    X: elemX,
    Y: elemY
  }
}

// 控制预览区显示
function setPreview(clip) {
  previewImg.style.top = -clip.top + 'px';
  previewImg.style.left = -clip.left + 'px';
  previewImg.style.clip = 'rect(' + clip.top + 'px ' + clip.right + 'px ' + clip.bottom + 'px ' + clip.left + 'px)';
}
