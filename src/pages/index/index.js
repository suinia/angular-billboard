require('../../js/libs/leaflet/index'); //地图leaflet库
require('../../js/libs/leaflet/leaflet.css')
require('../../js/libs/angular-leaflet/index'); //地图leaflet指令
require('../../js/libs/highcharts/highcharts-ng'); //highcharts指令
require('./index.css');

var $ = require('jquery');
var mod = angular.module('index', ['leaflet-directive', 'highcharts-ng']);

mod.controller('indexController', ['$scope', '$http', '$localStorage', 'tokenHttp', function($scope, $http, $localStorage, tokenHttp) {
	Highcharts.setOptions({ //配置highchart语言
		lang: {
			loading: '加载中...'
		}
	});
	
	var locationKeys = ['nation', 'province', 'city', 'county', 'area'],
		userInfo = $localStorage.userInfo || {},
		boardLocation = userInfo.board_location || {},
		currentLocation = {};
	angular.forEach(locationKeys, function(item){ //获取用户当前区域ID与级别
		if(boardLocation[item]){
			currentLocation = {
				zoom: item,
				item: boardLocation[item]
			}
		}
	});
	
	var vmMap = {}, vmChart;
	$scope.vmMap = vmMap;
	//初始化地图
	angular.extend(vmMap, {
		center: { //初始中心点与地图级别
			lat: 0,
			lng: 0,
			zoom: 2
		},
		defaults: {
			dragging: false, //禁止拖动
			zoomControl: false, //去掉缩放控制按钮
			zoomAnimation: false, //去除动画
			scrollWheelZoom: false, //关闭滚轮缩放
			doubleClickZoom: false, //关闭双击缩放
			fadeAnimation: false, //去除动画
			attributionControl: false, //隐藏leaflet logo
		},
		markers: {},
		layers: {
			baselayers: {},
			overlays: {}
		},
		getMapZoomByRegion: function(zoom){
			var mapZoom = {
				nation: 2,
				province: 6,
				city: 8,
				county: 9,
				area: 11
			};
			return mapZoom[zoom] || 0;
		},
		update: function(params){//更新地图显示
			var zoom = vmMap.getMapZoomByRegion(params.currentLocation.zoom);
			vmMap.center = {
				lat: Number(params.gps_y),
				lng: Number(params.gps_x),
				zoom: zoom
			}
			vmMap.redrawLayer();
			vmMap.redrawMarker(params.aeList);
		},
		redrawLayer: function(){ //重画地图线条
			var allAreaJson = require('../../js/gps/0.json');
			angular.extend(vmMap.layers.baselayers, { //根据json给地图勾勒线条
				maplayer: {
					name: 'airag map',
					type: 'geoJSONShape',
					data: allAreaJson,
					visible: true,
					layerParams: {
						showOnSelector: false,
					},
					layerOptions: {
						style: {
							color: '#0c4856',
							fillColor: 'transparent',
							weight: 2
						}
					}
				}
			});
			var deivceArea = {"type":"FeatureCollection","features":[]};
			deivceArea.features = allAreaJson.features.filter(function(item){
				return item.id == '360729';
			});
			angular.extend(vmMap.layers.overlays, { //获取当前设备所在地区给地图勾勒高亮线条
				arealayer: {
					name: 'airag area',
					type: 'geoJSONShape',
					data: deivceArea,
					visible: true,
					layerParams: {
						showOnSelector: false,
					},
					layerOptions: {
						style: {
							color: '#1e90ff',
							fillColor: 'transparent',
							weight: 2,
							opacity: 1,
						}
					}
				}
			});
		},
		redrawMarker: function(aeList){ //重画地图农眼
			var markers=[];
			angular.forEach(function(item){
				markers.push({
				 	lat: item.gps_y,
		        		lng: item.gps_x,
		        		icon: createWaveIcon(item.count)
				});
			});
			angular.extend(vmMap.markers, angular.copy(markers));
		}
	});
	
	//定义图表view-module
	vmChart = $scope.vmChart = {
		chartColors: { //图表样式值
			crop: ['#f89e9c', '#d76261', '#e4524e', '#d43a38', '#bc3335', 
	        			 '#a52d32', '#8d262f', '#76202c', '#5e1a28', '#471325'],
			trace: ['#c23531', '#91c7ae', '#d66866', '#27517f', '#61a0a8', 
	        			 '#d48265', '#c4d02f', '#4876a9', '#ddaf5f', '#6bc2bd'],
			data: ['#32fe8d', '#2de582', '#28cb76', '#23b26b', '#1e9860', 
	        			 '#197f55', '#0f4d3e', '#2b908f', '#0b3835', '#07262d']
		},
		barConfig: { //饼状图初始化配置
			title: {
	      		text: ''
		    },
			options: {
				exporting: false,
				chart: {
					type: 'pie',
		            backgroundColor: 'none',
		       	 	spacing: [20, 10, 10, 20],
				},
			    credits: {
			      enabled: false
			    },
				legend: {
	            		enabled: false,
				},
				noData: {
					style: {
						opacity: 1,
						backgroundColor: 'transparent',
						textAlign: 'center'
					}
				},
				loading: {
					showDuration: 1000,
					labelStyle: {
						color: '#32c2fe',
						fontSize: '0.2rem'
					},
					style: {
						opacity: 1,
						backgroundColor: 'transparent',
						textAlign: 'center'
					}
				},
				plotOptions: {
		            pie: {
		                allowPointSelect: true,
		                cursor: 'pointer',
		                dataLabels: {
		                		distance: 10,
		                    enabled: true,
		                    connectorPadding: 2,
		                    format: '<b>{point.name}</b>:{point.percentage:.0f} %',
		                    style: {
	                    			fontSize: '0.15rem',
		                        	color: '#32c2fe',
		                        	textOutline: 'none'
		                    }
		                }
		            }
		        }
			},
			loading: true,
			series: []
		},
		cropConfig: {},
		traceConfig: {},
		dataConfig: {
			title: { text: '' },
			loading: true,
		    options: {
				exporting: false,
				chart: {
					type: 'bar',
		            backgroundColor: 'none',
		       	 	spacing: [0, 0, 0, 0],
				},
		        plotOptions: {
		            bar: {
		                dataLabels: {
		                    enabled: true
		                }
		            }
		        },
			    credits: {
			      enabled: false
			    },
				legend: {
	            		enabled: false,
				},
				noData: {
					style: {
						opacity: 1,
						backgroundColor: 'transparent',
						textAlign: 'center'
					}
				},
				loading: {
					showDuration: 1000,
					labelStyle: {
						color: '#32c2fe',
						fontSize: '0.2rem'
					},
					style: {
						opacity: 1,
						backgroundColor: 'transparent',
						textAlign: 'center'
					}
				},
				xAxis: {
		            title: { text: null },
		            lineColor: '#32c2fe',
					tickWidth: 0,
		            labels: {
			            	style: {
			            		color: '#32c2fe'
			            	}
		            }
		       },
		       yAxis: {
		       		title: {
		                text: null
		           	},
		            gridLineColor: '#32c2fe',
		            labels: {
			            	style: {
			            		color: '#32c2fe'
			            	}
		            }
		       }
			}
		}
	}
	//配置作物&溯源图表
	angular.extend(vmChart.cropConfig, vmChart.barConfig);
	angular.extend(vmChart.traceConfig, vmChart.barConfig);
	
	//获取环境上传总数后更新数据模型 - allUploadCnt
	$scope.getAllUploadData = function(currentLocation){
		$scope.allUploadCnt = null;
		tokenHttp({
			url: '/ae/board/all_data_upload',
			params: {
				region_id: currentLocation.item.region_id,
				region_level: currentLocation.zoom,
				user_id: userInfo.user_id
			}
		}).then(function(res){
			$scope.allUploadCnt = res || 0; 
		});
	};
	//获取作物数据(前十)更新数据模型 - vmChart.cropConfig
	$scope.getCropData = function(currentLocation){
		angular.extend(vmChart.cropConfig, {
			loading: true,
			noData: null
		});
		tokenHttp({
			url: '/ae/board/crop',
			params: {
				region_id: currentLocation.item.region_id,
				region_level: currentLocation.zoom,
				user_id: userInfo.user_id
			}
		}).then(function(res){
			var chartData = []; //组装成图表需要格式[{name:'xxx', y: 10}, ...]
			if(res && res.length>0){
				angular.forEach(res, function(item, index){
					chartData.push({
						name: item.id,
						y: item.count
					});
				});
			}
			//渲染图表
			renderChart('pie', vmChart.cropConfig, chartData);
		});
	}
	//获取溯源扫描数据(前十)更新数据模型 - vmChart.traceConfig
	$scope.getTraceData = function(currentLocation){
		angular.extend(vmChart.traceConfig, {
			loading: true,
			noData: null
		});
		tokenHttp({
			url: '/ae/board/qrcode',
			params: {
				region_id: currentLocation.item.region_id,
				region_level: currentLocation.zoom,
				user_id: userInfo.user_id
			}
		}).then(function(res){
			var chartData = [];
			if(res && res.length>0){
				angular.forEach(res, function(item, index){
					chartData.push({
						name: item.id,
						y: item.count
					})
				});
			}
			//设置溯源图表数据
			renderChart('pie', vmChart.traceConfig, chartData);
		});
	}
	//获取数据上传(前十)更新数据模型 - vmChart.dataConfig
	$scope.getUploadData = function(currentLocation){
		angular.extend(vmChart.dataConfig, {
			loading: true,
			noData: null
		});
		tokenHttp({
			url: '/ae/board/region_data_upload',
			params: {
				region_id: currentLocation.item.region_id,
				region_level: currentLocation.zoom,
				user_id: userInfo.user_id
			}
		}).then(function(res){
			var chartData = {x:[], y:[]};
			if(res && res.length>0){
				angular.forEach(res, function(item, index){
					chartData.x.push(item.id);
					chartData.y.push(item.count);
				});
			}
			renderChart('bar', vmChart.dataConfig, chartData)
		});
	}
	//获取实时气象数据
	$scope.weatherData = [{},{},{},{},{},{},{},{}];
	$scope.getLastWeatherData = function(currentLocation){
		if($scope.getLastWeatherId){
			clearTimeout($scope.getLastWeatherId);
			$scope.getLastWeatherId = null;
		}
		var index = 0;
		getLastWeather();
		function getLastWeather(){
			tokenHttp({
				url: '/ae/board/latest_weather_soil',
				params: {
					region_id: currentLocation.item.region_id,
					region_level: currentLocation.zoom,
					user_id: userInfo.user_id
				}
			}).then(function(res){
				var res =[{
					ae_id:"19370203",
					air_hum:82.9,
					air_pressure:1016.4,
					air_tem:12.2,
					collect_time:"16-12-26-19-11",
					gps_x:"23.26138571666667",
					gps_y:"111.49579001666667",
					gpsx_real:"23.26139633333333",
					gpsy_real:"111.49580816666666",
					light_intensity:0,
					rainfall:0,
					wind_direction:315,
					wind_direction_desc:"西北",
					wind_scale:"1",
					wind_speed:0.8
				}]
				if(res && res.length>0){
					index ++;
					res[0].index = index;
					$scope.weatherData.shift();
					$scope.weatherData.push(res[0]);
				}
				$scope.getLastWeatherId = setTimeout(getLastWeather, 2000);
			});
		};
	}
	//获取农眼位置分布
	$scope.getAEPosition = function(currentLocation){
		tokenHttp({
			url: '/ae/board/position',
			params: {
				region_id: currentLocation.item.region_id,
				region_level: currentLocation.zoom,
				user_id: userInfo.user_id
			}
		}).then(function(res){
			var gps_x = res && res[0].gps_x || 0,
				gps_y = res && res[0].gps_y || 0;
			vmMap.update({
				gps_x: gps_x,
				gps_y: gps_y,
				currentLocation: currentLocation,
				aeList: res
			});
		});
	}
	
	//获取当前级别下所有模块的数据
	$scope.getModuleData = function(currentLocation) {
		//环境上传总数模块
		$scope.getAllUploadData(currentLocation);
		//作物图表模块
		$scope.getCropData(currentLocation);
		//溯源图表模块
		$scope.getTraceData(currentLocation);
		//数据上传模块
		$scope.getUploadData(currentLocation);
		//实时气象
		//$scope.getLastWeatherData(currentLocation)
		//获取当前级别设备分布位置
		$scope.getAEPosition(currentLocation);
	}
	$scope.getModuleData(currentLocation);
	
	//渲染图表
	function renderChart(type, config, data){
		switch (type){
			case 'pie':
				if(data.length <= 0){
					angular.extend(config, {
						noData: '暂无数据'
					});
				}else{
					angular.extend(config, {
						loading: false,
						series: [{
							borderWidth: 0,
				            name: '总数',
				            colorByPoint: true,
				            colors: vmChart.chartColors.crop,
				            data: data
				        }]
					});
				}
				break;
			case 'bar':
				if(data.length <= 0){
					angular.extend(config, {
						noData: '暂无数据'
					});
				}else{
					vmChart.dataConfig.loading = false;
					vmChart.dataConfig.options.xAxis.categories = data.x;
					vmChart.dataConfig.series = [{
			            name: '总数',
			            color: 'red',
			            borderWidth: 0,
			            colors: vmChart.chartColors.data,
			            colorByPoint: true,
			            dataLabels: {
			            		style: {
			            			color: '#32c2fe',
			            			textOutline: 0,
			            		}
			            },
			            data: data.y
			        	}];
				}
				break;
		}
	}
	/*
	 * 根据数量生成光圈动画效果
	 * 1-20台：20次/分钟
	 * 21-50台：40次/分钟
	 * 51-100台：60次/分钟
	 * 101-300台：90次/分钟
	 * 301台以上：120次/分钟
	 */
	function createWaveIcon(cnt){
		var delay, time = 3 ;
		if(cnt > 20) { time = 1.5; }
		if(cnt > 50) { time = 1; }
		if(cnt > 100) { time = 0.66; }
		if(cnt > 300) { time = 0.5; }
		delay = time/2;
		
		var animationStyle = 'animation-duration:'+ time +'s; -webkit-animation-duration:'+ time +'s;',
			animationNextStyle = animationStyle+'animation-delay:'+delay+'s; -webkit-animation-delay:'+delay+'s;',
			html = '<div class="leaflet-wave"><span class="leaflet-wave__inner" style="'+animationStyle+'"></span><span class="leaflet-wave__inner--next" style="'+animationNextStyle+'"></span></div>';
		
		return {
			type: 'div',
	        iconSize: [100, 100],
	        html: html
		}
	}
	//获取地图级别根据当前用户的地区级别
	function getMapZoomByRegion(region){
		var mapZoom = {
			nation: 2,
			province: 6,
			city: 8,
			county: 9,
			area: 11
		};
		return mapZoom[region] || 0;
	}
}]);

module.exports = mod