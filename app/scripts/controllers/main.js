'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uiApp
 */
angular.module('uiApp').controller('MainCtrl', function($scope, $http) {
    $http.get('/mockdata/requestList.json').then(function(response) {
        var requestType = [];
        var listByType = {};
        var tabs = [];

        var per = response.data.d.results;

        angular.forEach(per, function(value, key) {
            var type = value.TYPE;
            if (!requestType.includes(type)) {
                requestType.push(type);
                listByType[type] = [];
                tabs.push({
                    "title": type
                });
                listByType[type].push(value);
            } else {
                listByType[type].push(value);
            }
        });
        $scope.requesttopContent = per[0];
        $scope.requestListLength = per.length;
        $scope.requestType = requestType;
        $scope.requestTabs = tabs;
        $scope.requestListByType = listByType;
        $scope.requestListTitle = "Transportation Request";
        $scope.requestQuantity = "Quantity";
        $scope.rType = "Request";
    });

    $http.get('/mockdata/contract.json').then(function(response) {
        var requestType = [];
        var listByType = {};
        var tabs = [];

        var per = response.data.d.results;

        angular.forEach(per, function(value, key) {
            var type = value.TYPE;
            if (!requestType.includes(type)) {
                requestType.push(type);
                listByType[type] = [];
                tabs.push({
                    "title": type
                });
                listByType[type].push(value);
            } else {
                listByType[type].push(value);
            }
        });
        $scope.contractTopContent = per[0];
        $scope.contractListLength = per.length;
        $scope.contractRequestType = requestType;
        $scope.contractTabs = tabs;
        $scope.contractListByType = listByType;
        $scope.contractListTitle = "Contracts";
        $scope.contractSignedDeal = "Signed Deal";
        $scope.cType = "Contract";
    });

    $http.get('/mockdata/table.json').then(function(response) {
      $scope.table = response.data.d.results;
    });

    $scope.onTabSelected = function(index) {
        var type = $scope.requestType[index];
        $scope.requestList = $scope.listByType[type];
    };

    $scope.onClosePanel = function() {
        window.location.reload();
    };

    $scope.onOpenPanel = function() {
        $scope.topContent = $scope.requesttopContent;
        $scope.listLength =  $scope.requestListLength;
        $scope.requestType = $scope.requestType;
        $scope.tabs = $scope.requestTabs;
        $scope.listByType = $scope.requestListByType;
        $scope.listTitle = $scope.requestListTitle;
        $scope.Quantity = $scope.requestQuantity;
        $scope.type = $scope.rType;
        $scope.firstColumWith = "col-md-7";

    	var leftContainer = angular.element("#leftContainer");
    	var rightContainer = angular.element("#rightContainer");
    	var openButton = angular.element("#openButton");
    	var closeButton = angular.element("#closeButton");
        var back = angular.element("#back");
        var contractChart = angular.element("#contractChart");
        contractChart.addClass("hide");
        back.removeClass("hide");
    	openButton.addClass("hide");
    	closeButton.addClass("hide");
    	leftContainer.removeClass("hide");
    	rightContainer.removeClass("col-md-12").addClass("col-md-9");
    };

    $scope.onOpenContractPanel = function() {
        $scope.topContent = $scope.contractTopContent;
        $scope.listLength =  $scope.contractListLength;
        $scope.requestType = $scope.contractRequestType;
        $scope.tabs = $scope.contractTabs;
        $scope.listByType = $scope.contractListByType;
        $scope.listTitle = $scope.contractListTitle;
        $scope.Quantity = $scope.contractSignedDeal;
        $scope.type = $scope.cType;
        $scope.hide= "hide";
        $scope.firstColumWith = "col-md-9";

        var leftContainer = angular.element("#leftContainer");
        var rightContainer = angular.element("#rightContainer");
        var openButton = angular.element("#openButton");
        var closeButton = angular.element("#closeButton");
        var back = angular.element("#back");
        var contractChart = angular.element("#contractChart");
        //contractChart.removeClass("hide");
        back.removeClass("hide");
        openButton.addClass("hide");
        closeButton.addClass("hide");
        leftContainer.removeClass("hide");
        rightContainer.removeClass("col-md-12").addClass("col-md-9");
    };

    $scope.model = {
        name: 'Tabs'
    };

    // =============================================================================
    // Charts
    // =============================================================================
    // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    // $scope.series = ['Series A', 'Series B'];
    // $scope.data = [
    //     [65, 59, 80, 81, 56, 55, 40],
    //     [28, 48, 40, 19, 86, 27, 90]
    //   ];
    //   $scope.onClick = function (points, evt) {
    //     console.log(points, evt);
    //   };
    //   $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    //   $scope.options = {
    //     scales: {
    //       yAxes: [
    //         {
    //           id: 'y-axis-1',
    //           type: 'linear',
    //           display: true,
    //           position: 'left'
    //         },
    //         {
    //           id: 'y-axis-2',
    //           type: 'linear',
    //           display: true,
    //           position: 'right'
    //         }
    //       ]
    //     }
    //   };

    angular.element(document).ready(function () {
        var map = new AMap.Map('mapContainer', {
            center: [107.861195,32.542248],
            // lang: "en",
            mapStyle: "amap://styles/blue",
            resizeEnable: true,
            zoom: 5
        });

        //overwrite the default popup dialog
        AMapUI.defineTpl("ui/overlay/SimpleInfoWindow/tpl/container.html", [], function() {
            return document.getElementById('my-infowin-tpl').innerHTML;
        });


        AMapUI.load(['ui/misc/PathSimplifier', 'lib/$', 'ui/overlay/SimpleMarker', 'ui/overlay/SimpleInfoWindow'], function(PathSimplifier, $, SimpleMarker, SimpleInfoWindow) {

            if (!PathSimplifier.supportCanvas) {
                alert('Not Support Canvas!');
                return;
            }

            var clickEventListener = map.on('click', function(e) {
                console.log("[" + e.lnglat.getLng() + ',' + e.lnglat.getLat() + "],");
            });

            $(".leasibleResources .containerId").click(function() {
              map.clearMap();
              if (window.pathSimplifierIns) {
                  window.pathSimplifierIns.clearPathNavigators();
              }

              if (window.availableLocaitonPathSimlifier) {
                  jQuery.each(window.availableLocaitonPathSimlifier, function(index, item) {
                      item.clearPathNavigators();
                  });
              }

              if (window.pickupPath) {
                window.pickupPath.clearPathNavigators();
              }

              if (window.returnPath) {
                window.returnPath.clearPathNavigators();
              }

              renderSeaPath();
              renderPickUpAndReturnLocation([117.828904,38.907276], [114.22697,22.541445], [119.986889,37.209594], [106.82848,25.001065], [110.213013,23.364668], [118.556462,37.151214]);
            });

            $(".itemLink").click(function() {
               if($scope.type == "Contract") {
                    var thirdRow = angular.element("#thirdRow");
                    thirdRow.addClass("hide");
                    var fourthRow = angular.element("#fourthRow");
                    fourthRow.addClass("hide");
                    var fifthRow = angular.element("#fifthRow");
                    fifthRow.removeClass("hide");
                    var sixthRow = angular.element("#sixthRow");
                    sixthRow.removeClass("hide");
                    var table = angular.element("#table");
                    table.addClass("hide");
                    var mapContainer = angular.element("#mapContainer");
                    mapContainer.addClass("hide");
                    var fullScreenButton  =angular.element("#fullScreenButton");
                    fullScreenButton.addClass("hide");
                    var contractChart = angular.element("#contractChart");
                    contractChart.removeClass("hide");
                    var itemLink = angular.element(".itemLink");
                    itemLink.addClass("hide");
               }
            });

            $scope.onRefreshContent = function(event, index, result) {
                var firstRow = angular.element("#firstRow");
                firstRow.addClass("hide");
                var secondRow = angular.element("#secondRow");
                secondRow.addClass("hide");
                $("#mapContainer").addClass("mapSmallHeight");

                //For request
                if($scope.type == "Request") {
                    var thirdRow = angular.element("#thirdRow");
                    thirdRow.removeClass("hide");
                    var fourthRow = angular.element("#fourthRow");
                    fourthRow.removeClass("hide");
                    var fithRow = angular.element("#fithRow");
                    fithRow.addClass("hide");
                    var sixthRow = angular.element("#sixthRow");
                    sixthRow.addClass("hide");
                }

                //For Contract
                if($scope.type == "Contract") {
                    var thirdRow = angular.element("#thirdRow");
                    thirdRow.addClass("hide");
                    var fourthRow = angular.element("#fourthRow");
                    fourthRow.addClass("hide");
                    var fifthRow = angular.element("#fifthRow");
                    fifthRow.removeClass("hide");
                    var sixthRow = angular.element("#sixthRow");
                    sixthRow.removeClass("hide");
                    var table = angular.element("#table");
                    table.addClass("hide");
                    var mapContainer = angular.element("#mapContainer");
                    mapContainer.removeClass("hide");
                    var fullScreenButton  =angular.element("#fullScreenButton");
                    fullScreenButton.addClass("hide");
                    var contractChart = angular.element("#contractChart");
                    contractChart.addClass("hide");
                    $("#mapContainer").removeClass("mapSmallHeight");
                    var itemLink = angular.element(".itemLink");
                    itemLink.removeClass("hide");


                    map.clearMap();
                    if (window.pathSimplifierIns) {
                        window.pathSimplifierIns.clearPathNavigators();
                    }

                    if (window.availableLocaitonPathSimlifier) {
                        jQuery.each(window.availableLocaitonPathSimlifier, function(index, item) {
                            item.clearPathNavigators();
                        });
                    }

                    if (window.pickupPath) {
                      window.pickupPath.clearPathNavigators();
                    }

                    if (window.returnPath) {
                      window.returnPath.clearPathNavigators();
                    }

                    new SimpleMarker({
                        // Point URL definition
                        iconStyle: {
                            src: '../../images/area.png',
                            style: {
                                width: '150px'
                            }
                        },

                        // Base point offset
                        offset: new AMap.Pixel(-85, -75),

                        map: map,

                        showPositionPoint: false,
                        position: [121.681995,29.626064],
                        zIndex: 100
                    });

                    new SimpleMarker({
                        // Point URL definition
                        iconStyle: {
                            src: '../../images/endpoint.gif',
                            style: {
                                width: '45px'
                            }
                        },

                        // Base point offset
                        offset: new AMap.Pixel(-25, -20),

                        map: map,
                        zoom: 5,

                        showPositionPoint: false,
                        position: [110.191376,20.046497],
                        zIndex: 100
                    });

                    new SimpleMarker({
                        // Point URL definition
                        iconStyle: {
                            src: '../../images/startpoint.gif',
                            style: {
                                width: '45px'
                            }
                        },

                        // Base point offset
                        offset: new AMap.Pixel(-25, -20),

                        map: map,
                         zoom: 5,

                        showPositionPoint: false,
                        position: [121.681995,29.626064],
                        zIndex: 100
                    });

                    renderPickUpAndReturnLocation([121.681995,29.626064], [110.191376,20.046497], [120.266326,36.428671], [116.734221,23.391027], [112.599639,22.385367], [120.370656,33.024075]);
                }

                // var listCotainer = angular.element("#requestCategoryList");
                // var list = listCotainer.children();
                // list.each(function(index){
                //     $(this).removeClass("active");
                // });
                // var currentTarget = event.currentTarget;
                // var source = angular.element(currentTarget);
                // source.addClass("active");

                $scope.selectedIndex = index;
                $scope.topContent = result;

                // For Request
                if($scope.type == "Request") {
                    angular.element("#table").removeClass("hide");

                    map.clearMap();

                    if (window.pathSimplifierIns) {
                        window.pathSimplifierIns.clearPathNavigators();
                    }

                    if (window.availableLocaitonPathSimlifier) {
                        jQuery.each(window.availableLocaitonPathSimlifier, function(index, item) {
                            item.clearPathNavigators();
                        });
                    }
                    renderSeaPath();
                    renderAvailableLocations();
                }
            };

            $scope.showDetail = function(contractId) {
                angular.element("#contractId").removeClass("hide");
            };

            $scope.showPopup = function(contractID) {
              var dialog = angular.element("#dialog");
              dialog.removeClass("hide");
            };

            $scope.onClosePopup = function() {
              var dialog = angular.element("#dialog");
              dialog.addClass("hide");
            };

            initialMapGeneralView();


            // Initial map general view
            function initialMapGeneralView() {
                 var generalStockList = [
                  {
                    "geo": [123.365597,41.662011]
                  },
                  {
                    "geo": [122.974751,39.659973]
                  },
                  {
                    "geo": [122.974751,39.659973]
                  },
                  {
                    "geo": [119.781302,39.99436]
                  },
                  {
                    "geo": [116.607627,38.594747]
                  },
                  {
                    "geo": [118.530234,37.617913]
                  },
                  {
                    "geo": [120.123252,37.330184]
                  },
                  {
                    "geo": [122.515525,37.212158]
                  },
                  {
                    "geo": [120.673941,36.360906]
                  },
                  {
                    "geo": [120.146489,33.763313]
                  },
                  {
                    "geo": [118.487554,32.400984]
                  },
                  {
                    "geo": [119.772954,31.88004]
                  },
                  {
                    "geo": [121.345372,31.937163]
                  },
                  {
                    "geo": [120.922399,31.343233]
                  },
                  {
                    "geo": [114.215245,31.268139]
                  },
                  {
                    "geo": [113.138585,29.734724]
                  },
                  {
                    "geo": [116.045591,29.887244]
                  },
                  {
                    "geo": [119.566709,26.336658]
                  },
                  {
                    "geo": [118.855345,25.82354]
                  },
                  {
                    "geo": [119.297544,25.533928]
                  },
                  {
                    "geo": [112.980406,24.38854]
                  },
                  {
                    "geo": [113.364927,22.767481]
                  },
                  {
                    "geo": [114.496519,23.192288]
                  },
                  {
                    "geo": [110.552427,21.464736]
                  },
                  {
                    "geo": [110.178892,24.298454]
                  },
                  {
                    "geo": [107.344419,22.868747]
                  },
                  {
                    "geo": [105.421812,30.818678]
                  },
                  {
                    "geo": [102.840025,29.756186]
                  },
                  {
                    "geo": [108.672219,34.824096]
                  },
                  {
                    "geo": [102.245217,37.152796]
                  },
                  {
                    "geo": [103.893166,30.818678]
                  },
                  {
                    "geo": [119.427834,34.589274]
                  },
                  {
                    "geo": [118.526955,34.208542]
                  },
                  {
                    "geo": [117.889748,33.148048]
                  },
                  {
                    "geo": [120.437912,30.714315]
                  },
                  {
                    "geo": [121.369676,30.132051]
                  },
                  {
                    "geo": [122.202649,30.076423]
                  }];

                jQuery.each(generalStockList, function(index, item) {
                    new SimpleMarker({
                        // Point URL definition
                        iconStyle: {
                            src: '../../images/stockingpoint.png',
                            style: {
                                width: '70px'
                            }
                        },

                        // Base point offset
                        offset: new AMap.Pixel(-35, -35),

                        map: map,
                        autoSetFitView: false,

                        showPositionPoint: false,
                        position: item.geo,
                        zIndex: 100,
                    });
                });
            }


            // Initial path
            function initialPathSimlifier() {
                // render path from start location to end location
                var emptyLineStyle = {
                    lineWidth: 0,
                    fillStyle: null,
                    strokeStyle: null,
                    borderStyle: null
                };

                var pathSimplifierIns = new PathSimplifier({
                    zIndex: 100,
                    autoSetFitView: false,
                    map: map,

                    getPath: function(pathData, pathIndex) {

                        return pathData.path;
                    },
                    getHoverTitle: function(pathData, pathIndex, pointIndex) {

                        return null;
                    },
                    renderOptions: {
                        pathLineStyle: emptyLineStyle,
                        pathLineSelectedStyle: emptyLineStyle,
                        pathLineHoverStyle: emptyLineStyle,
                        keyPointStyle: emptyLineStyle,
                        startPointStyle: emptyLineStyle,
                        endPointStyle: emptyLineStyle,
                        keyPointHoverStyle: emptyLineStyle,
                        keyPointOnSelectedPathLineStyle: emptyLineStyle
                    }
                });

                return pathSimplifierIns;
            }

            // render sea path
            function renderSeaPath() {
                window.pathSimplifierIns = initialPathSimlifier();
                window.pathSimplifierIns.setData([{
                    name: 'TEST',
                    path: [
                        [117.828904,38.907276],
                        [117.829591,38.907276],
                        [118.048468,38.898684],
                        [118.145972,38.893875],
                        [118.258582,38.889065],
                        [118.386298,38.881582],
                        [118.500281,38.873029],
                        [118.610831,38.865545],
                        [118.72756,38.855386],
                        [118.827124,38.84576],
                        [118.921195,38.837203],
                        [119.264517,38.796543],
                        [119.443045,38.775134],
                        [119.594107,38.751576],
                        [119.813834,38.717296],
                        [119.989615,38.685144],
                        [120.165396,38.648687],
                        [120.393362,38.599334],
                        [120.621329,38.541354],
                        [120.846549,38.481178],
                        [121.01821,38.429558],
                        [121.163779,38.382207],
                        [121.284628,38.340211],
                        [121.398612,38.299269],
                        [121.529074,38.249676],
                        [121.946555,38.068267],
                        [122.342062,37.86039],
                        [122.715598,37.625825],
                        [123.056174,37.355595],
                        [123.385764,37.023013],
                        [123.638449,36.74181],
                        [123.880148,36.380007],
                        [124.066916,36.007627],
                        [124.198752,35.642408],
                        [124.308615,35.239628],
                        [124.349814,34.999245],
                        [124.374533,34.834838],
                        [124.401999,34.638472],
                        [124.412985,34.423517],
                        [124.418478,34.160294],
                        [124.418478,33.980559],
                        [124.412985,33.85064],
                        [124.407492,33.70453],
                        [124.393759,33.551305],
                        [124.366293,33.310629],
                        [124.319602,33.009422],
                        [124.275656,32.776489],
                        [124.231711,32.58924],
                        [124.179526,32.376086],
                        [124.132834,32.183352],
                        [124.080649,32.008843],
                        [124.036704,31.864331],
                        [124.009238,31.780316],
                        [123.93508,31.553564],
                        [123.885642,31.415372],
                        [123.844443,31.302795],
                        [123.770285,31.10546],
                        [123.668662,30.855856],
                        [123.591757,30.676493],
                        [123.514853,30.50153],
                        [123.446188,30.359437],
                        [123.369284,30.183904],
                        [123.278647,29.998543],
                        [123.220969,29.889065],
                        [123.177023,29.805686],
                        [123.080893,29.61962],
                        [123.017722,29.507337],
                        [122.940817,29.359028],
                        [122.861166,29.227283],
                        [122.759543,29.040153],
                        [122.646933,28.862305],
                        [122.548056,28.701018],
                        [122.449179,28.537069],
                        [122.333823,28.358364],
                        [122.254172,28.244705],
                        [122.169028,28.113969],
                        [122.10311,28.012175],
                        [122.020712,27.898149],
                        [121.927329,27.769421],
                        [121.817465,27.616208],
                        [121.737814,27.509074],
                        [121.633444,27.365253],
                        [121.537314,27.238341],
                        [121.441184,27.113729],
                        [121.295615,26.932672],
                        [121.180258,26.790559],
                        [121.040183,26.623716],
                        [120.935812,26.498424],
                        [120.80947,26.358231],
                        [120.743552,26.279451],
                        [120.633688,26.15625],
                        [120.504599,26.013174],
                        [120.381003,25.88475],
                        [120.218955,25.711652],
                        [120.117331,25.610149],
                        [119.974509,25.466411],
                        [119.864645,25.3647],
                        [119.686118,25.188363],
                        [119.510336,25.024215],
                        [119.39498,24.919643],
                        [119.285117,24.827446],
                        [119.090109,24.662817],
                        [118.928061,24.527958],
                        [118.793478,24.415465],
                        [118.609457,24.27283],
                        [118.458395,24.157604],
                        [118.31008,24.049798],
                        [118.060141,23.876619],
                        [117.939291,23.796225],
                        [117.77999,23.688118],
                        [117.582236,23.567334],
                        [117.466879,23.501863],
                        [117.277365,23.393512],
                        [117.137289,23.312822],
                        [116.980734,23.234606],
                        [116.826926,23.156345],
                        [116.670371,23.085617],
                        [116.458884,22.994628],
                        [116.272116,22.918756],
                        [116.011191,22.827654],
                        [115.857382,22.771951],
                        [115.720053,22.731425],
                        [115.63528,22.713203],
                        [115.561122,22.693566],
                        [115.504818,22.680263],
                        [115.437526,22.663789],
                        [115.366115,22.647948],
                        [115.280284,22.630837],
                        [115.237026,22.62133],
                        [115.189647,22.61309],
                        [115.129909,22.602948],
                        [115.055751,22.591537],
                        [114.99258,22.582028],
                        [114.933528,22.573785],
                        [114.893016,22.569981],
                        [114.840145,22.563006],
                        [114.788646,22.557933],
                        [114.722728,22.553495],
                        [114.634838,22.546519],
                        [114.56274,22.542714],
                        [114.502315,22.541445],
                        [114.445324,22.539543],
                        [114.380092,22.540177],
                        [114.323787,22.539543],
                        [114.262676,22.540811],
                        [114.243106,22.54208],
                        [114.22697,22.541445]
                    ]
                }]);

                // function onload() {
                //     pathSimplifierIns.renderLater();
                // }

                // function onerror(e) {
                //     alert('Loading Failed！');
                // }

                var navg1 = window.pathSimplifierIns.createPathNavigator(0, {
                    loop: true,
                    speed: 4000000,
                    pathNavigatorStyle: {
                        "initRotateDegree": 359,
                        "width": 16,
                        "height": 17,
                        "autoRotate": true,
                        "lineJoin": "round",
                        "content": "defaultPathNavigator",
                        "fillStyle": "#5cbe81",
                        "strokeStyle": "#2ff97b",
                        "lineWidth": 1,
                        "pathLinePassedStyle": {
                            "lineWidth": 2,
                            "strokeStyle": "#5cbe81",
                            "borderWidth": 0,
                            "borderStyle": "#2ff97b",
                            "dirArrowStyle": true
                        }
                    }
                });

                navg1.start();


                var startPoint = new SimpleMarker({
                    // Point URL definition
                    iconStyle: {
                        src: '../../images/startpoint.gif',
                        style: {
                            width: '45px'
                        }
                    },

                    // Base point offset
                    offset: new AMap.Pixel(-25, -20),

                    map: map,

                    showPositionPoint: false,
                    position: [117.828904,38.907276],
                    zIndex: 100
                });


                var startPointBG = new SimpleMarker({
                    // Point URL definition
                    iconStyle: {
                        src: '../../images/area.png',
                        style: {
                            width: '150px'
                        }
                    },

                    // Base point offset
                    offset: new AMap.Pixel(-85, -75),

                    map: map,

                    showPositionPoint: false,
                    position: [117.828904,38.907276],
                    zIndex: 100
                });

                var endPoint = new SimpleMarker({
                    // Point URL definition
                    iconStyle: {
                        src: '../../images/endpoint.gif',
                        style: {
                            width: '45px'
                        }
                    },

                    // Base point offset
                    offset: new AMap.Pixel(-25, -20),

                    map: map,
                     zoom: 5,

                    showPositionPoint: false,
                    position: [114.22697,22.541445],
                    zIndex: 100
                });

                // var infoWindow = new SimpleInfoWindow({
                //     myCustomHeader: '',
                //     myCustomFooter: '',
                //     infoTitle: '',
                //     infoBody: '<div><p><em>5</em><span>Availiable</span></p><p>Liaoning</p></div>',

                //     offset: new AMap.Pixel(0, 0)
                // });

                // function openInfoWin() {
                //     infoWindow.open(map, startPoint.getPosition());
                // }

                //marker
                // AMap.event.addListener(startPoint, 'click', function() {
                //     openInfoWin();
                // });
            }

            // render available locations
            function renderAvailableLocations() {
                //render stock point
                var stockList = [
                  {
                    "geo": [121.000693,40.962368],
                    "availiableNumber": 3
                  },
                  {
                    "geo": [120.397325,37.608894],
                    "availiableNumber": 5
                  },
                  {
                    "geo": [122.451769,37.399721],
                    "availiableNumber": 4
                  },
                  {
                    "geo": [119.652827,34.330139],
                    "availiableNumber": 3
                  },
                  {
                    "geo": [121.333735,32.292094],
                    "availiableNumber": 4
                  },
                  {
                    "geo": [117.444575,31.966463],
                    "availiableNumber": 5
                  }
                ];

                window.availableLocaitonPath = [];
                window.availableLocaitonPathSimlifier = [];

                jQuery.each(stockList, function(index, item) {
                    new SimpleMarker({
                        // Point URL definition
                        iconStyle: {
                            src: '../../images/stockingpoint.png',
                            style: {
                                width: '70px'
                            }
                        },

                        // Base point offset
                        offset: new AMap.Pixel(-35, -35),

                        map: map,

                        showPositionPoint: false,
                        position: item.geo,
                        zIndex: 100,
                        label: {
                            content: item.availiableNumber,
                            offset: new AMap.Pixel(22, 48)
                        }
                    });

                    var tempPath = initialPathSimlifier();
                    tempPath.setData([{
                        name: 'TEST',
                        path: [
                            item.geo,
                            [117.828904,38.907276]
                        ]
                    }]);

                    window.availableLocaitonPathSimlifier.push(tempPath);

                    var tempNavg = tempPath.createPathNavigator(0, {
                        loop: true,
                        speed: 1000000,
                        pathNavigatorStyle: {
                            "initRotateDegree": 359,
                            "width": 16,
                            "height": 17,
                            "autoRotate": true,
                            "lineJoin": "round",
                            "content": "defaultPathNavigator",
                            "fillStyle": "#437ef5",
                            "strokeStyle": "#437ef5",
                            "lineWidth": 1,
                            "pathLinePassedStyle": {
                                "lineWidth": 1.6,
                                "strokeStyle": "#437ef5",
                                "borderWidth": 0,
                                "borderStyle": "#b0caff",
                                "dirArrowStyle": false
                            }
                        }
                    });

                    window.availableLocaitonPath.push(tempNavg);
                });

                jQuery.each(availableLocaitonPath, function(stockListIndex, stockListItem) {
                    stockListItem.start();
                });
            }


            // render pickup and return locaitons
            function renderPickUpAndReturnLocation(fromLoc, endLoc, pickLoc, returnLoc, trunkIconGeo1, trunkIconGeo2) {
              window.pickupPath = initialPathSimlifier();
              window.returnPath = initialPathSimlifier();

              new SimpleMarker({
                  // Point URL definition
                  iconStyle: {
                      src: '../../images/stockingpoint.png',
                      style: {
                          width: '70px'
                      }
                  },

                  // Base point offset
                  offset: new AMap.Pixel(-35, -35),

                  map: map,

                  showPositionPoint: false,
                  position: pickLoc,
                  zIndex: 100
              });

              new SimpleMarker({
                  // Point URL definition
                  iconStyle: {
                      src: '../../images/stockingpoint.png',
                      style: {
                          width: '70px'
                      }
                  },

                  // Base point offset
                  offset: new AMap.Pixel(-35, -35),

                  map: map,

                  showPositionPoint: false,
                  position: returnLoc,
                  zIndex: 100
              });

              new SimpleMarker({
                  // Point URL definition
                  iconStyle: {
                      src: '../../images/stockingpoint.png',
                      style: {
                          width: '70px'
                      }
                  },

                  // Base point offset
                  offset: new AMap.Pixel(-35, -35),

                  map: map,

                  showPositionPoint: false,
                  position: returnLoc,
                  zIndex: 100
              });

              new SimpleMarker({
                  // Point URL definition
                  iconStyle: {
                      src: '../../images/truck.png',
                      style: {
                          width: '36px'
                      }
                  },

                  // Base point offset
                  offset: new AMap.Pixel(-35, -35),

                  map: map,

                  showPositionPoint: false,
                  position: trunkIconGeo1,
                  zIndex: 100
              });

              new SimpleMarker({
                  // Point URL definition
                  iconStyle: {
                      src: '../../images/truck.png',
                      style: {
                          width: '36px'
                      }
                  },

                  // Base point offset
                  offset: new AMap.Pixel(-35, -35),

                  map: map,

                  showPositionPoint: false,
                  position: trunkIconGeo2,
                  zIndex: 100
              });

              AMap.service('AMap.Driving', function() {//callback
                  var driving= new AMap.Driving();

                  var path1 = [];

                  driving.search(pickLoc, fromLoc, function(status, result) {
                      var steps = result.routes[0].steps;
                      jQuery.each(steps, function(index, item) {
                          jQuery.each(item.path, function(i, data) {
                              path1.push([data.lng, data.lat]);
                          });
                      });

                      window.pickupPath.setData([{
                          name: 'TEST',
                          path: path1
                      }]);

                      var pickupPathTemp = window.pickupPath.createPathNavigator(0, {
                          loop: true,
                          speed: 1000000,
                          pathNavigatorStyle: {
                             "initRotateDegree": 359,
                              "width": 16,
                              "height": 17,
                              "autoRotate": true,
                              "lineJoin": "round",
                              "content": "defaultPathNavigator",
                              "fillStyle": "#437ef5",
                              "strokeStyle": "#437ef5",
                              "lineWidth": 1,
                              "pathLinePassedStyle": {
                                  "lineWidth": 1.6,
                                  "strokeStyle": "#437ef5",
                                  "borderWidth": 0,
                                  "borderStyle": "#b0caff",
                                  "dirArrowStyle": false
                              }
                            }
                      });
                      pickupPathTemp.start();
                  });

                  var path2 = [];

                  driving.search(endLoc, returnLoc, function(status, result) {
                      var steps = result.routes[0].steps;
                      jQuery.each(steps, function(index, item) {
                          jQuery.each(item.path, function(i, data) {
                              path2.push([data.lng, data.lat]);
                          });
                      });

                      window.returnPath.setData([{
                          name: 'TEST',
                          path: path2
                      }]);

                      var returnPathTemp = window.returnPath.createPathNavigator(0, {
                          loop: true,
                          speed: 1000000,
                          pathNavigatorStyle: {
                              "initRotateDegree": 359,
                              "width": 16,
                              "height": 17,
                              "autoRotate": true,
                              "lineJoin": "round",
                              "content": "defaultPathNavigator",
                              "fillStyle": "#437ef5",
                              "strokeStyle": "#437ef5",
                              "lineWidth": 1,
                              "pathLinePassedStyle": {
                                  "lineWidth": 1.6,
                                  "strokeStyle": "#437ef5",
                                  "borderWidth": 0,
                                  "borderStyle": "#b0caff",
                                  "dirArrowStyle": false
                              }
                            }
                      });
                      returnPathTemp.start();
                  });
              });
            }
        });
    });
});

angular.module('uiApp').controller('ModalDemoCtrl', function ($uibModal, $log, $document) {
  var $ctrl = this;

  $ctrl.animationsEnabled = true;

  $ctrl.open = function (size, parentSelector) {
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        items: function () {
          return $ctrl.items;
        }
      }
    });
  };

  $ctrl.openMultipleModals = function () {
    $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title-bottom',
      ariaDescribedBy: 'modal-body-bottom',
      templateUrl: 'stackedModal.html',
      controller: 'ModalComfirmCtrl',
      controllerAs: '$ctrl',
      size: 'sm'
    });
  };

  $ctrl.toggleAnimation = function () {
    $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
  };
});

angular.module('uiApp').controller('ModalInstanceCtrl', function ($uibModalInstance) {
  var $ctrl = this;

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

angular.module('uiApp').controller('ModalComfirmCtrl', function ($uibModalInstance) {
  var $ctrl = this;

  $ctrl.close = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $ctrl.sign = function () {
    $uibModalInstance.dismiss('cancel');
    var message = angular.element("#successfulMessage");
    message.removeClass("hide");
    setTimeout(function timer(){
      message.addClass("hide");
    }, 3000);
  };

  $ctrl.showSuccessMessage = function () {

  };
});

angular.module('uiApp').component('modalComponent', {
  templateUrl: 'myModalContent.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function () {
    var $ctrl = this;

    $ctrl.$onInit = function () {
    };

    $ctrl.cancel = function () {
      $ctrl.dismiss({$value: 'cancel'});
    };
  }
}).component('abc', {
  templateUrl: 'stackedModal.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function () {
    var $ctrl = this;

    $ctrl.$onInit = function () {
    };

    $ctrl.close = function () {
      $ctrl.dismiss({$value: 'cancel'});
    };

    $ctrl.sign = function () {
      $ctrl.dismiss({$value: 'cancel'});
    };
  }
});
