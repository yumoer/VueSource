function Observer(data) {
  // c-5 保存数据对象
  this.data = data;
  // c-6 走起(开始)
  this.walk(data);
}

Observer.prototype = {
  // c-7
  walk: function (data) {
    var me = this;
    // c-8 遍历data中外层的所有属性
    Object.keys(data).forEach(function (key) {
      // c-9 对指定的属性进行数据劫持
      me.defineReactive(data, key, data[key])
    });
  },
  // c-10
  defineReactive: function (data, key, val) {
    // c-11 为当前属性创建一个对应的dep对象
    var dep = new Dep();
    // c-12 通过!间接递归调用实现对所有层次属性的劫持
    var childObj = observe(val);
    // c-13 给data重新定义指定名称的属性(使用属性描述符)
    Object.defineProperty(data, key, {
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      // c-14 当读取data中当前属性值时调用
      get: function () {
        // c-15 如果对应的watcher存在
        if (Dep.target) {
          // c-16 建立dep与watcher之间的关系
          dep.depend();
        }
        // c-25 返回属性值
        return val;
      },
      // c-26 当data中当前属性值发生了改变
      set: function (newVal) {
        if (newVal === val) {
          return;
        }
        // c-27 保存最新的值
        val = newVal;
        // c-28新的值是object的话，进行监听
        childObj = observe(newVal);
        // c-29 通知dep
        dep.notify();
      }
    });
  }
};
// c-2 判断value必须为对象
function observe(value, vm) {
  // c-3 value不是对象进入
  if (!value || typeof value !== 'object') {
    //返回
    return;
  }

  // c-4 创建监视器对象
  return new Observer(value);
};


var uid = 0;

function Dep() {
  this.id = uid++;
  // 用来保存所有相关watcher数组容器
  this.subs = [];
}

Dep.prototype = {
  // c-22
  addSub: function (sub) {
    this.subs.push(sub);
  },
  // c-17
  depend: function () {
    // c-18
    Dep.target.addDep(this);
  },

  removeSub: function (sub) {
    var index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  },

  notify: function () {
    // c-30 遍历所有相关的watcher, 去更新
    this.subs.forEach(function (sub) {
      // c-31
      sub.update();
    });
  }
};

Dep.target = null;