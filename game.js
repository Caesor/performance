import './js/libs/weapp-adapter'

import Test from './js/main'

const info = wx.getSystemInfoSync();
const test = new Test({
    num: 500,
    canvas,
    width: info.screenWidth,
    height: info.screenHeight,
    // visible: false
});

test.start();

setTimeout(()=> {
    test.stop();
}, 3000)