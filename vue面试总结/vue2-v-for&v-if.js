/**
 * 
 * 2020/1/23
 * 1.v-if 和 v-for的优先级谁更高？
 *    
 *    answer: v-for
 *    why: 源码中 src\compiler\codegen\index.js，第64行可以看到，在编译过程中，先是执行处理v-for的
 * 渲染逻辑，每个v-for中都会包含有v-if的内容，在控制台可以输出组件的render函数，可以看到【_l函数】内
 * 部包含了v-if对应的变量做为判断来执行渲染列表的函数
 * 
 * 2. 如何优化以上情况
 *    
 *    answer: 将v-if提出写到 v-for的外部，将v-for包起来。
 *    why: 先去执行if, 再去执行for, 减少了render函数的执行，提升了效率
 * 
 * 
 * 3. 特殊情况如何优化：data列表中有 控制该listItem是否展示的开关
 * 
 *    answer: 可以使用 computed 属性，过滤出需要展示的listItem,再去for循环渲染
 *    why: 减少了render函数的执行， 提高了性能。
 */