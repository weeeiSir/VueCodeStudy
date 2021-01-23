

function reactive(data) {
  if(!isObject(data)){
    return data
  }
  return new Proxy(data, {
    get(target, key) {
      console.log(`获取${key}值`)
      const res = Reflect.get(target, key)
      track(target, key)
      return isObject(res) ? reactive(res) : res
    },
    set(target, key, value) {
      console.log(`设置${key}值`)
      const res = Reflect.set(target, key, value)
      trigger(target, key)
      return res
    },
    deleteProperty(target, key) {
      console.log(`删除${key}值`)
      return Reflect.deleteProperty(target, key)
    }
  })
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

// 临时存储响应式函数
const effectStack = []
// 存放响应式函数和⽬标、键之间的映射关系
const targetMap = new WeakMap()

function effect(fn, options = {}) {
  // 创建reactiveEffect
  const e = createReactiveEffect(fn, options)
  // 执⾏⼀次触发依赖收集
  e()
  return e
}

function createReactiveEffect(fn, options) {
  // 封装⼀个⾼阶函数，除了执⾏fn，还要将⾃⼰放⼊effectStack为依赖收集做准备
  const effect = function reactiveEffect(...args) {
    if (!effectStack.includes(effect)) {
      try {
        // 1.effect⼊栈
        effectStack.push(effect)
        // 2.执⾏fn
        return fn(...args)
      } finally {
        // 3.effect出栈
        effectStack.pop()
      }
    }
  }
  return effect
}

function track(target, key) {
  // 获取响应式函数
  const effect = effectStack[effectStack.length - 1]
  if (effect) {
    // 获取target映射关系map，不存在则创建
    let depMap = targetMap.get(target)
    if (!depMap) {
      depMap = new Map()
      targetMap.set(target, depMap)
    }
    // 获取key对应依赖集合，不存在则创建
    let deps = depMap.get(key)
    if (!deps) {
      deps = new Set()
      depMap.set(key, deps)
    }

    // 将响应函数添加到依赖集合
    // 结合视图验证⼀ 下
    deps.add(effect)
  }
}

function trigger(target, key) {
  // 获取target对应依赖map
  const depMap = targetMap.get(target)
  if (!depMap) {
    return
  }
  // 获取key对应集合
  const deps = depMap.get(key)
  if (deps) {
    // 执⾏所有响应函数
    deps.forEach(dep => dep())
  }
}