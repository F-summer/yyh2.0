// components/sort/sort.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal, changedPath) {
        if (newVal) {
          this.showB();
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    sortList: ["时间降序", "时间升序", "助力人数降序", "助力人数升序"],
    showC: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    sort: function(e) {
      let sortText = {
        text: e.target.dataset.sort,
        index: e.target.dataset.index
      };

      this.triggerEvent('sortStyle', sortText);
      this.setData({
        show: false,
        showC: false
      })
    },
    close: function() {
      this.setData({
        show: false,
        showC: false
      })
    },
    showB: function() {
      var that = this;
      setTimeout(function() {
        that.setData({
          showC: true
        });

      }, 10)
    }

  }
})