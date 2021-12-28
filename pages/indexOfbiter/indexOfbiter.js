// pages/indexOfbiter/indexOfbiter.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // name:'',
    // connect:'',
    curlatitude: '',
    curlongitude: '',
    markers: [],
    markersNum:0,
    index:'',
    controlSlider:16,
    hasAccepted:false,
    seecheckOfbitter:false,
    finish:false,
    nandu:['简单','中等','困难','超困难'],
    waittingBitten:{
      name:''
    }
    // orders:[]
  },
  changeInput:function(e){
console.log(e);
if(e.target.dataset.type=="name"){
  // this.data.name=e.detail.value
  app.bitter.name=e.detail.value
  console.log( this.data.name);
}else{
  app.bitter.connect=e.detail.value
  // this.data.connect=e.detail.value
  console.log( this.data.connect);
}
  },
  pickerChange:function(e){
console.log(e);
this.setData({
  index:e.detail.value
})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  printOrders:function(){
    //遍历order表
    var i
    for(i=0;i<app.orders.length;i++){
        //将当前order渲染到map上
        var order={
          id:1+i,
          longitude:app.orders[i].longitude,
          latitude:app.orders[i].latitude,
          title:app.orders[i].name,
          iconPath:'../../images/定位 (1).png',
          width:30,
          height:30
        }
        this.data.markers.push(order);
        console.log("当前添加接单:"+order.id);
    }
    this.setData({
      markers:this.data.markers
    })
    
  },
  submitBtn:function(){
    console.log('当前被打人的名字:'+this.data.waittingBitten.name);
    console.log("触发交单");
    this.setData({
      finish:false,
      hasAccepted:false
    })
    app.hasAccepted=false
    app.finish=true;
    //将orders数组中的被打人删除
    for(var i=0;i<app.orders.length;i++){
      //判断是否为被打完人
      if(app.orders[i].name==this.data.waittingBitten.name){
         app.orders.splice(i,1)
      }
    }
    console.log('当前orders数组:');
    console.log(app.orders);
    for(var i=0;i<this.data.markers.length;i++){
      //判断是否为被打完人
      if(this.data.markers[i].title==this.data.waittingBitten.name){
        this.data.markers.splice(i,1)
      }
    }
    this.setData({
      markers:this.data.markers
    })
  },
  acceptCheck:function(){
    app.bitter.cover="../../images/人-打架 (1).png"
    app.hasAccepted=true;
    app.searching=false;
    //遍历orders数组
    for(var i=0;i<app.orders.length;i++){
     //判断当前元素是否为被接单项
     //是
     if(this.data.waittingBitten.name==app.orders[i].name){
       app.orders[i].selected=true
     }
     console.log("遍历完一次");
    }
    this.setData({
      seecheckOfbitter:false,
      hasAccepted:true
    })
  },
  cleanCheck:function(){
  this.setData({
  seecheckOfbitter:false
  })
  },
  clickmarker: function (e) {
    this.setData({
      seecheckOfbitter:true
   })
console.log("单击标记点后:");
console.log(e);
//判断数组找出对应的人
for(var i=0;i<app.orders.length;i++){
  //判断当前用户是否为对应的人
  if(e.detail.markerId==i+1){
    this.setData({
      'waittingBitten.name':app.orders[i].name,
    })
  }
}
 console.log("找到");
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //遍历app.orders数组
    for(var i=0;i<app.orders.length;i++){
      if(app.orders[i].selected==true){
        this.setData({
          'waittingBitten.name':app.orders[i].name
        })
      }
    }
    this.setData({
      hasAccepted:app.hasAccepted
    })
    console.log(this.data.seecheckOfbitter);
    console.log("接收全局seecheck参数"+app.seecheck);
    console.log(app.orders);
    wx.startLocationUpdateBackground({
      success: (res) => {
        console.log("开启后台定位",res);
      },
      fail:(res)=>{
        console.log("开启定位失败",res);
      }
    })
    this.getUserLocation()
    // 将等待被打的人的位置渲染在地图上
    this.printOrders()
  },
  getUserLocation:function(){
    wx.onLocationChange((res)=>{
         console.log("位置已改变:"+res.latitude);
         //判断是否存在我的位置点
        //不存在
        if(this.data.markersNum==0){
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
        }else{
          console.log("修改我的位置");
          //存在
          this.data.markers[0].latitude=res.latitude
          this.data.markers[0].longitude=res.longitude
        }
        if(this.data.markersNum<=1){
              this.setData({
          curlatitude:res.latitude,
          curlongitude:res.longitude,
          markers:this.data.markers
        })
        }else{
          this.setData({
            // curlatitude:res.latitude,
            // curlongitude:res.longitude,
            markers:this.data.markers
          })
        }
        console.log("当前位置:("+res.latitude+","+res.longitude+")")
    })
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