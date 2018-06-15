/**
 * 
 * @param {object} el 指令绑定的元素 用来操作dom
 * @param {string} title 绑定的标题参数  
 */
function showTitle(el, title) {
    const popover = getPopover()
    const popoverStyle = popover.style
  
    if (title === undefined) {
      popoverStyle.display = 'none'
    } else {
      //返回元素的大小及其相对于视窗的位置集合
      const elRect = el.getBoundingClientRect()
      //获取元素的CSS值
      const elComputedStyle = window.getComputedStyle(el, null)
      const rightOffset = parseInt(elComputedStyle.getPropertyValue('padding-right')) || 0
      const topOffset = parseInt(elComputedStyle.getPropertyValue('padding-top')) || 0
  
      popoverStyle.visibility = 'hidden'
      popoverStyle.display = 'block'
      popover.querySelector('.popover-content').textContent = title
      popoverStyle.left = elRect.left - popover.offsetWidth / 2 + (el.offsetWidth - rightOffset) / 2 + 'px'
      popoverStyle.top = elRect.top - popover.offsetHeight + topOffset + 'px'
      popoverStyle.display = 'block'
      popoverStyle.visibility = 'visible'
    }
  }
  
  /**
   *  创建或者返回一个popover提示框
   */
  function getPopover() {
    let popover = document.querySelector('.title-popover')
  
    if (!popover) {
      const tpl = `
        <div class="popover title-popover top fade in" style="position:fixed;">
          <div class="arrow"></div>
          <div class="popover-content"></div>
        </div>
      `
      //直接将字符串转换为文档碎片
      const fragment = document.createRange().createContextualFragment(tpl)
  
      document.body.appendChild(fragment)
      popover = document.querySelector('.title-popover')
    }
  
    return popover
  }
  
  export default {
    bind(el, binding, vnode) {
      //使用const声明一个只读的常量,其值需要监听的事件类型
      const events = ['mouseenter', 'mouseleave', 'click']
      //声明一个处理器，以根据不同的时间内类型传不同的参数
      const handler = (event) => {
        if (event.type === 'mouseenter') {
          //显示一个提示框
          showTitle(el, binding.value)
        } else {
          //隐藏一个提示框
          showTitle()
        }
      }
      
      //在el元素上添加事件监听
      events.forEach((event) => {
        el.addEventListener(event, handler, false)
      })
      
      //在el元素上增加一个属性
      el.destroy = () => {
        //移除 el 元素上的事件监听
        events.forEach((event) => {
          el.removeEventListener(event, handler, false)
        })
        //移除 el 元素上的 destory方法
        el.destroy = null
      }
    },
    unbind(el) {
      // 移除事件监听 和 数据绑定
      el.destroy()
    }
  }