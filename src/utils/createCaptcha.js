/**
 * 生成指定位数的随机字符串
 * @param {*} num 验证码个数 
 * @param {*} letters 验证码字符串原料
 */
export default function(num = 6, letters = 'QWERTYUIOPLKJHGFDSAZXCVBNM1234567890') {
    let tpl = ''
    let captcha = []

    try {
        // [...Array(num)] 中的 ... 是扩展运算符，我们可以用它展开一个数组或对象。 num 指定展开的元素个数
        // map()方法返回一个新数组，数组中的元素为原始数组元素调用函数处理的后值
        // Math.random() 产生 0~1之间的随机小数 Math.floor向下取整
        captcha = [...Array(num)].map(() => letters[Math.floor(Math.random() * letters.length)])
    } catch (e) {}

    //遍历数组
    captcha.forEach(item => {
        tpl += `<span class="flex1 hcenter">${item}</span>`
    })
    // 连成一串字符串
    captcha = captcha.join('')
    // 返回一个对象
    return {
        tpl,
        captcha
    }
}