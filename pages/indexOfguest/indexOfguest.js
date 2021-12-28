const app=getApp()
// pages/indexOfguest/indexOfguest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    finish:false,
    bitting:false,
    waittingbitten:null,
    curlatitude: '',
    curlongitude: '',
    //地图标记点
    markers: [],
    markersNum: 0,
    index: 1,
    funcArr: [
      { content: '顺手打' },
      { content: '专业打' },
      { content: '拼拼打' },
    ],
    searching: false,
    hasSearch: false,
    noWrite: true,
    addressList: [
      { name: '冯伟杰', latitude: 23.26093, longitude: 113.8101 },
      { name: '谢泽弘', latitude: 23.26190, longitude: 113.8101 },
      { name: '张澄', latitude: 23.26190, longitude: 113.8140 },
      { name: '麦舜尧', latitude: 23.26145, longitude: 113.8120 },
      { name: '曾俞富', latitude: 23.26170, longitude: 113.8111 },
      // {name:'华商职业学院',latitude:23.2617576,longitude:113.7723759}
    ],
    bitter: {
      cover: '../../images/登录用户.png',
      name: '冯伟杰',
      connect: '19867383325'
    },
    controlSlider: 16,
    seeCheck: ''
    // ImgOfbitter:'../../images/委屈 (白).png'
  },
  changeControl: function (e) {
    console.log(e);
    this.setData({
      controlSlider: e.detail.value
    })
    console.log(this.data.controlSlider);
  },
  changeregion: function (e) {
    console.log("视野更改");
    console.log(e);
  },
  startSearching: function (e) {
    this.data.waittingbitten.selected=false;
    this.data.waittingbitten.price=null;
    app.orders.push(this.data.waittingbitten);
    //将waittingbitten加入全局变量
    console.log(app.orders);
    console.log("查看check");
    app.seecheck=true;
    app.searching=true;
    this.setData({
      seeCheck:app.seecheck,
      searching:app.searching
    })
  },
  finish:function(){
    this.cleanScreen()
    this.setData({
      finish:false
    })
    app.finish=false
  },
  cleanScreen: function (e) {
    //获取当前缩放值
    console.log(e); 
    app.seecheck=false
     this.setData({
     seeCheck:app.seecheck,
     finish:true
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUserLocation: function () {
    wx.onLocationChange((res) => {
      console.log("位置已改变:" + res.latitude);
      //判断是否存在我的位置点
      //不存在
      if (this.data.markersNum == 0) {
        //将我的位置推入数组
        this.data.markers.push({
          id: 0,
          longitude: res.longitude,
          latitude: res.latitude,
          title: '我的位置',
          iconPath: '../../images/我的位置2.png',
          zindex: 100,
          width: 30,
          height: 30
        })
        this.data.markersNum++
        console.log("创建我的位置");
      } else {
        console.log("修改我的位置");
        //存在
        this.data.markers[0].latitude = res.latitude
        this.data.markers[0].longitude = res.longitude
      }
      if (this.data.markersNum <= 1) {
        this.setData({
          curlatitude: res.latitude,
          curlongitude: res.longitude,
          markers: this.data.markers
        })
      } else {
        this.setData({
          // curlatitude:res.latitude,
          // curlongitude:res.longitude,
          markers: this.data.markers
        })
      }
      console.log("当前位置:(" + res.latitude + "," + res.longitude + ")")
    })
  },
  writeInmap: function (person) {
    var person = {
      id: this.data.markersNum++,
      longitude: person.longitude,
      latitude: person.latitude,
      title: person.name,
      iconPath: '../../images/定位.png',
      zindex: 100,
      width: 30,
      height: 30
    }
    //  console.log("添加成功");
    this.data.markers.push(person)
    console.log(this.data.markers);
    this.setData({
      curlatitude: person.latitude,
      curlongitude: person.longitude,
      markers: this.data.markers,
      hasSearch: true
    })
  },
  changeinput: function (e) {
    console.log("查找用户" + e.detail.value);
    var bitten = e.detail.value
    //查找当前地址库中是否存在地址
    //遍历地址表
    var po
    for (po = 0; po < this.data.addressList.length; po++) {
      //判断当前地址表用户是否为被打用户
      //是
      if (this.data.addressList[po].name == bitten) {
        bitten = this.data.addressList[po]
        // 将当前bitter加入waittingbitten数组
        this.data.waittingbitten=bitten;
        break
      }
    }
    //判断是否查找成功
    //成功
    if (po < this.data.addressList.length) {
      console.log("查找成功");
      //判断是否有被打人坐标
      //有
      if (this.data.markersNum == 2) {
        this.data.markers.pop()
        this.data.markersNum--
      }
      //将被打用户渲染到地图上
      this.writeInmap(bitten)
    } else {
      console.log("查找失败");
    }
  },
  onReady: function () {
    this.setData({
      finish:app.finish,
      searching:app.searching,
      seeCheck:app.seecheck,
      'bitter.cover':app.bitter.cover,
      'bitter.name':app.bitter.name,
      'bitter.connect':app.bitter.connect
    })
    //判断是否为空
    //否
    if(this.data.bitter.name!=''){
         this.setData({
           bitting:true
         })
    }
    console.log("接收全局seecheck参数"+app.seecheck);
    wx.startLocationUpdateBackground({
      success: (res) => {
        console.log("开启后台定位", res);
      },
      fail: (res) => {
        console.log("开启定位失败", res);
      }
    })
    this.getUserLocation()
    //
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})