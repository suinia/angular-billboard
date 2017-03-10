# 大气候看板
> 使用angular(v1.4) + angular-ui-router + oclazyload + webpack


## 启动
* 下载项目后，如果没有node环境需要安装node
* 本地全局安装webpack-dev-server 
	```
	sudo npm install -g webpack-dev-server 
	```
	
* 下载依赖： ```npm install ```
* 启动： ```npm start ``` 默认端口是：9039， 可在webpack.config中配置

## webpack + angular构建单页面应用
* 项目场景：基于地图的数据展示，在PC上, 电视, 室内大屏上显示；
* 地图的显示基于[leaflet.js](http://leafletjs.com)这个框架;
* 使用webpack的``` require.ensure ``` 与 ```ocLazyLoad```根据路由进行分模块打包与异步加载
 