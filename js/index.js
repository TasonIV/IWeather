$(function () {

    // 获取城市天气
    function getWeather(city) {
        // 获取实况天气
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/now',
            data: {
                location: city,
                key: 'e59a15143a574c0a80f985eedea83dd8'
            },
            success: function (result) {
                // 如果城市不存在
                if (result.HeWeather6[0].status !== 'ok') {
                    $('.location').text('未知城市')
                    alert("抱歉! 此城市暂未收录~")
                    return;
                }
                // 存在，渲染样式
                $('.weather-status').text(result.HeWeather6[0].now.cond_txt); // 晴
                $('.wind-status').text(result.HeWeather6[0].now.wind_dir); // 风向
                $('.tmp').text(result.HeWeather6[0].now.tmp + '°'); // 温度

                // 当前时间：获取、格式初始化
                var currentDate = new Date(result.HeWeather6[0].update.loc);
                $('.day').text('周' + days[currentDate.getDay()]);
                var m = currentDate.getMonth() + 1;
                var d = currentDate.getDate();
                $('.date').text((m >= 10 ? m : '0' + m) + '/' + (d >= 10 ? d : '0' + d))

                //获取24小时天气
                getHours24Weather(city);

                //获取当前天气和未来9天天气
                getNineDayWeather(city);
            }
        })
    }
    //获取24小时天气
    function getHours24Weather(city) {
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/hourly',
            data: {
                location: city,
                key: 'e59a15143a574c0a80f985eedea83dd8'
            },
            success: function (res) {
                var currentHour24Weather = res.HeWeather6[0].hourly.slice(0, 24);

                for (var i = 0; i < currentHour24Weather.length; i++) {
                    // 从icons列表中匹配相应的图标
                    var $li = $(`<li>
                    <p>${currentHour24Weather[i].time.slice(-5)}</p>
                    <i class="iconfont ${icons[currentHour24Weather[i].cond_code].icon}"></i>
                    <span>${currentHour24Weather[i].tmp + '°'}</span>
                    </li>`)
                    $('.list').append($li)
                }
            }
        })
    }

    //获取当前天气和未来7天天气
    function getNineDayWeather(city) {
        $.ajax({
            type: "get",
            url: "https://api.heweather.net/s6/weather/forecast",
            data: {
                location: city,
                key: "e59a15143a574c0a80f985eedea83dd8"
            },
            success: function (r) {
                // 温度差
                var rd = r.HeWeather6[0].daily_forecast;
                $('.min-max-tmp').text(rd[0].tmp_min + '°~' + rd[0].tmp_max + '°');

                // 获取当前时间
                var hour = new Date(r.HeWeather6[0].update.loc).getHours()

                // 未来7天天气
                for (var i = 1; i < rd.length; i++) {
                    var $li = $(`<li>
                    <span>周${days[new Date(rd[i].date).getDay()]}</span>
                    <i class="iconfont ${hour >= rd[i].sr.substr(0, 2) && hour < rd[i].ss.substr(0, 2) ? icons[rd[i].cond_code_d].icon : icons[rd[i].cond_code_n].icon}"></i>
                    <span>${hour >= rd[i].sr.substr(0, 2) && hour < rd[i].ss.substr(0, 2) ? rd[i].cond_txt_d : rd[i].cond_txt_n}</span>
                    <span>${rd[i].tmp_min + '°~' + rd[i].tmp_max + '°'}</span>
                </li>`);
                    $('.fw').append($li);
                }

            }
        })
    }



    // 腾讯地图IP定位，返回当前城市
    $.ajax({
        type: 'get',
        url: 'https://apis.map.qq.com/ws/location/v1/ip',
        data: {
            key: 'YP5BZ-T2D36-T6ASM-ELYND-WHZVS-FKFTQ',
            output: 'jsonp'
        },
        dataType: 'jsonp',
        success: function (data) {
            console.log("地图定位api，当前城市数据data==>", data);
            $('.location').text(data.result.ad_info.city)
            // 调用方法，获取当前城市天气
            getWeather(data.result.ad_info.city)
        }
    })


    // 搜索城市功能
    $('.search').on('click', function () {
        // 获取输入的值
        var city = $('.inp').val().trim()
        // 判断输入城市是否为空
        if (city == "") {
            alert("城市不能为空哦*-*")
            return
        }
        // 清空24小时天气的li
        $('.list').empty()
        // 清空未来7天天气的li
        $('.fw').empty()
        // 获取搜索城市的天气
        getWeather(city);
        $('.location').text(city)
        $('.inp').val('')
    })

    // 列表页
    $('.header-left').on('click',function(e){
        $('.show').css("display","block")
        e.stopPropagation(); 
    })

    $('.weather').on("click",function(){
        $('.show').css("display",'none')
    })
    // 匹配是星期几
    var days = ['日', '一', '二', '三', '四', '五', '六']

    //配置图标
    var icons = {
        104: {
            title: '阴',
            icon: "icon-tianqi-yin"
        },
        101: {
            title: '多云',
            icon: "icon-tianqi-duoyun"
        },
        100: {
            title: '晴',
            icon: "icon-tianqi-qing"
        },
        300: {
            title: '阵雨',
            icon: "icon-tianqi-zhenyu"
        },
        301: {
            title: '阵雨',
            icon: "icon-tianqi-zhenyu"
        },
        302: {
            title: '雷阵雨',
            icon: "icon-tianqi-leizhenyu"
        },
        303: {
            title: '雷阵雨',
            icon: "icon-tianqi-leizhenyu"
        },
        305: {
            title: '小雨',
            icon: "icon-tianqi-xiaoyu"
        },
        306: {
            title: '中雨',
            icon: "icon-tianqi-zhongyu"
        },
        307: {
            title: '大雨',
            icon: "icon-tianqi-dayu"
        },
        310: {
            title: '暴雨',
            icon: "icon-tianqi-baoyu"
        },
        311: {
            title: '大暴雨',
            icon: "icon-tianqi-dabaoyu"
        },
        312: {
            title: '特大暴雨',
            icon: "icon-tianqi-tedabaoyu"
        },
        314: {
            title: '小雨转中雨',
            icon: "icon-tianqi-xiaoyuzhuanzhongyu"
        },
        315: {
            title: '中雨转大雨',
            icon: "icon-tianqi-zhongyuzhuandayu"
        },
        316: {
            title: '大雨转暴雨',
            icon: "icon-tianqi-dayuzhuanbaoyu"
        },
        317: {
            title: '大雨转特大暴雨',
            icon: "icon-tianqi-dayuzhuantedabaoyu"
        },
        399: {
            title: '雨',
            icon: "icon-tianqi-yu"
        },
        499: {
            title: '雪',
            icon: "icon-tianqi-xue"
        },
        501: {
            title: '雾',
            icon: "icon-tianqi-wu"
        }
    };
})