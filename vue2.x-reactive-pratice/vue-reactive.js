/**
 * 思路：
 * 1.实现数据响应式
 * 2.模板编译
 */


// 数据响应式
function defineReactive(obj, key, value) {
  
  observe(value) // 递归监听 value 嵌套对象 eg: obj.xxx = {}
  Object.defineProperty(obj, key, {
    get () {
      console.log('get', key)
      return value
    },
    set (v) {
      if (v !== value) {
        console.log('set', key)
        observe(v) // 递归监听， eg: 赋值时直接用{} 替换了原来的值 原值： obj.a = 123,赋值 obj.a = {b: 123}
        value = v
      }
    }
  })
}

// 遍历监听data中的所有数据
function observe(obj) {
  if(typeof obj !== 'object' || typeof(obj) == null){
    return obj
  }
  new Observer(obj)
}

// 用户给data设置新的属性和值
function set(obj, key, value) {
  Object.defineProperty(obj, key, {
    get () {
      console.log('get', key)
      return value
    },
    set (v) {
      if (v !== value) {
        console.log('set', key)
        value = v
      }
    }
  })
}

// 代理
function proxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(v) {
        vm.$data[key] = v
      }
    })
  })
}

/**
 * 思路：
 * 1. 保存数据选项
 * 2. 数据响应式
 * 3. 代理options.data到 vue实例上，易用性
 * 
 */
class WVue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    observe(this.$options.data)
    // 代理
    proxy(this)
  }

}

// 判断数据类型，针对不同类型数据做 数据响应式拦截
class Observer{
  constructor(data) {
    // 保存选项
    this.$data = data
    if(data instanceof Array) {
      // 数组
    } else {
      this.walk(data)
    }


  }

  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}