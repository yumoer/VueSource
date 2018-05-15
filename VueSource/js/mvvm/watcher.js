function Watcher(vm, exp, cb) {
    this.cb = cb; // 用于更新节点的回调函数
    this.vm = vm;
    this.exp = exp; // 表达式
    // c-24
    this.depIds = {};  // 保存相关dep的对象容器, 属性名是dep的id
    // c- 2.5
    this.value = this.get(); // 表达式所对应的值
}

Watcher.prototype = {

    update: function() {
        //c-32
        this.run();
    },
    run: function() {
        // c-33 得到最新的值
        var value = this.get();
        // c-34 得老的值
        var oldVal = this.value;
        // c-35 如果不相同
        if (value !== oldVal) {
            // c-36 保存最新的值
            this.value = value;
            // c-37 调用用于更新节点的回调函数
            this.cb.call(this.vm, value, oldVal);
        }
    },
    // c-19
    addDep: function(dep) {
        // c-20 判断关系是否已经建立过, 只有没有建立过才进入
        if (!this.depIds.hasOwnProperty(dep.id)) {
            // c-21 将当前watcher添加到dep中-->建立从dep到watcher的关系
            dep.addSub(this);
            // c-23 将dep添加到watcher中-->建立从watcher到dep的关系
            this.depIds[dep.id] = dep;
        }
    },
    // c-2.6
    get: function() {
        // c-2.7 给dep指定当前watcher为其target
        Dep.target = this;
        // c-2.8 得到当前表达式所对应的属性值(内部会导致get调用, 从而建立dep与watcher之间的关系)
        var value = this.getVMVal();
        // c-2.9 去掉dep中关联的当前watcher
        Dep.target = null;
        // c-3.0
        return value;
    },

    getVMVal: function() {
        var exp = this.exp.split('.');
        var val = this.vm._data;
        exp.forEach(function(k) {
            val = val[k];
        });
        return val;
    }
};