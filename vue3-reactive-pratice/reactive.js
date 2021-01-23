
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

// const data = {
//   foo: 1,
//   bar: {
//     a: 1
//   }
// }

// const state = reactive(data)
// state.bar.a = 2

const effectStack = []

// 依赖收集
function effect(fn) {
  const e = createReactiveEffect(fn)
  e()
  return e
}

function createReactiveEffect(fn){
  const effect = function createEffect(){
    if(!effectStack.includes(effect)){
      try {
        console.log(1)
        effectStack.push(effect)
        return fn()
      } finally {
        console.log(2)
        effectStack.pop()
      }
    }
  }
  return effect
}

// 存储响应函数的映射关系
const targetMap = new WeakMap()

// 建立依赖收集映射关系
function track(target, key) {
  const effect = effectStack[effectStack.length - 1]
  if(!effect){
    console.log(target, key)
  }
  if(effect){
    let depMap = targetMap.get(target)
    if(!depMap){
      depMap = new Map()
      targetMap.set(target, depMap)
    }
  
    let deps = depMap.get(key)
    if(!deps){
      deps = new Set()
      depMap.set(key, deps)
    }
    deps.add(effect)
  }
}

// 根据依赖映射关系，找到对应的响应函数
function trigger(target, key) {
  if(!targetMap.has(target)){
    return
  }
  const depMap = targetMap.get(target)
  const deps = depMap.get(key)
  if(deps){
    deps.forEach(dep => dep());
  }
}

