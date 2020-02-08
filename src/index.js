import MicroModal from 'micromodal';

const GoogleMap = new Vue({
  el: '#app',
  data: {
    loadingMask: true, // loading effect
    api: 'https://script.google.com/macros/s/AKfycbycicX5-NDjA6FEbwfauuUSi4NSN4RXbEGSkqPMc3G9JDNA40s/exec', // google apps script src
    map: null,
    responseData: [], // 回來的資料
    heatmapData: [], // heat map data
    tabType: 'confirmed', // 數據列表的 active
    translate: [
      {
        "Anhui": "安徽省"
      }, {
        "Beijing": "北京市"
      }, {
        "Chongqing": "重慶市"
      }, {
        "Fujian": "福建省"
      }, {
        "Gansu": "甘肅省"
      }, {
        "Guangdong": "廣東省"
      }, {
        "Guangxi": "廣西壯族自治區"
      }, {
        "Guizhou": "貴州省"
      }, {
        "Hainan": "海南省"
      }, {
        "Hebei": "河北省"
      }, {
        "Heilongjiang": "黑龍江省"
      }, {
        "Henan": "河南省"
      }, {
        "Hubei": "湖北省"
      }, {
        "Hunan": "湖南省"
      }, {
        "Inner Mongolia": "內蒙古自治區"
      }, {
        "Jiangsu": "江蘇省"
      }, {
        "Jiangxi": "江西省"
      }, {
        "Jilin": "吉林省"
      }, {
        "Liaoning": "遼寧省"
      }, {
        "Ningxia": "寧夏回族自治區"
      }, {
        "Qinghai": "青海省"
      }, {
        "Shaanxi": "陝西省"
      }, {
        "Shandong": "山東省"
      }, {
        "Shanghai": "上海市"
      }, {
        "Shanxi": "山西省"
      }, {
        "Sichuan": "四川省"
      }, {
        "Tianjin": "天津市"
      }, {
        "Tibet": "西藏自治區"
      }, {
        "Xinjiang": "新疆維吾爾自治區"
      }, {
        "Yunnan": "雲南省"
      }, {
        "Zhejiang": "浙江省"
      }, {
        "Thailand": "泰國"
      }, {
        "Japan": "日本"
      }, {
        "South Korea": "南韓"
      }, {
        "Taiwan": "台灣"
      }, {
        "Washington": "華盛頓"
      }, {
        "Illinois": "伊利諾伊州"
      }, {
        "California": "加利福尼亞"
      }, {
        "Arizona": "亞利桑那州"
      }, {
        "Macau": "澳門"
      }, {
        "Hong Kong": "香港"
      }, {
        "Singapore": "新加坡"
      }, {
        "Vietnam": "越南"
      }, {
        "France": "法國"
      }, {
        "Nepal": "尼泊爾"
      }, {
        "Malaysia": "馬來西亞"
      }, {
        "Ontario": "安大略"
      }, {
        "British Columbia": "英屬哥倫比亞"
      }, {
        "New South Wales": "新南威爾斯州"
      }, {
        "Victoria": "維多利亞"
      }, {
        "Queensland": "昆士蘭州"
      }, {
        "Cambodia": "柬埔寨"
      }, {
        "Sri Lanka": "斯里蘭卡"
      }, {
        "Germany": "德國"
      }, {
        "Finland": "芬蘭"
      }, {
        "United Arab Emirates": "阿拉伯聯合大公國"
      }, {
        "Philippines": "菲律賓"
      }, {
        "India": "印度"
      }, {
        "Italy": "義大利"
      }, {
        "UK": "英國"
      }, {
        "Russia": "俄羅斯"
      }, {
        "Sweden": "瑞典"
      }, {
        "Spain": "西班牙"
      }, {
        "South Australia": "南澳洲"
      }, {
        "Boston, MA": "波士頓"
      }, {
        "Belgium": "比利時"
      }, {
        "Madison, WI": "麥迪遜"
      }, {
        "Cruise Ship": "遊輪"
      }, {
        "Chicago, IL": "芝加哥"
      }, {
        "Toronto, ON": "多倫多"
      }, {
        "Santa Clara, CA": "聖塔克拉拉"
      }, {
        "San Benito, CA": "聖貝尼托縣"
      }, {
        "Seattle, WA": "西雅圖"
      }, {
        "Tempe, AZ": "坦佩"
      }, {
        "Orange, CA": "橙市"
      }, {
        "Los Angeles, CA": "洛杉磯"
      }, {
        "London, ON": "倫敦"
      }
    ]   
  },
  methods: {
    // Google Maps API
    initMap() {
      fetch(this.api)
        .then(res => res.json())
        .then(res => {

          const _this = this;

          // 預設顯示的中心點
          const center = {
            lat: 30.97564,
            lng: 112.2707
          };
          
          this.map = new google.maps.Map(document.getElementById('map'), {
            center: center,
            zoom: 5,
            mapTypeId: 'roadmap',
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            styles: [
              { elementType: 'geometry', stylers: [{color: '#263238'}] },
              { elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}] },
              { elementType: 'labels.text.fill', stylers: [{color: '#FFD54F'}] },
              {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{color: '#746855'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{color: '#746855'}]
              },
              {
                featureType: 'administrative.locality',
                elementType: 'geometry.stroke',
                stylers: [{color: '#746855'}]
              },
              {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{color: '#BCAAA4'}]
              },
              {
                featureType: 'administrative.neighborhood',
                elementType: 'geometry',
                stylers: [{visibility: 'off'}]
              },
              {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{visibility: 'off'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{visibility: 'off'}]
              },
              {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{visibility: 'off'}]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#37474F'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#515c6d'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#263238'}]
              }
            ]
          });

          let keys = Object.keys(res);

          // 城市、國家名翻中文
          function translateCh(name) {
            let result = '';
            Array.prototype.forEach.call(_this.translate, trans => {
              let compareName = Object.keys(trans)[0];
              if(compareName === name) {
                return result = trans[compareName];
              }
            });
            if(result != '') {
              return result;
            } else {
              return name
            }
          }

          // 處理每個資料
          let tempArr = []; // 最後要排序用的
          Array.prototype.forEach.call(keys, key => {

            let dataFormat = {};
            dataFormat.id = res[key].id;
            dataFormat.state = translateCh(key);
            dataFormat.lat = res[key].lat;
            dataFormat.lng = res[key].lng;
            dataFormat.confirmed = res[key].confirmed;
            dataFormat.recovered = res[key].recovered;
            dataFormat.death = res[key].death;
            tempArr.push(dataFormat);

            // 經緯度
            let latlng = new google.maps.LatLng(dataFormat.lat, dataFormat.lng);

            // 放maker
            let marker = new google.maps.Marker({
              position: latlng,
              map: this.map
            });

            // info window
            let infowindow = new google.maps.InfoWindow({
              content: `
                <h6>${dataFormat.state}</h6>
                <p>確診：${dataFormat.confirmed}</p>
                <p>康復：${dataFormat.recovered}</p>
                <p>死亡：${dataFormat.death}</p>
              `,
            });

            dataFormat.openInfoWindow = () => {
              infowindow.open(this.map, marker);
            }
            

            // 監聽 marker click 事件
            marker.addListener('click', e => {
              infowindow.open(this.map, marker);
              // console.log(_this.api + '?target=' + dataFormat.id)
              // fetch(_this.api + '?target=' + dataFormat.id, {
              //   method: 'POST',
              //   redirect: 'follow'
              // }).then(res => res.json())
              //   .then(data => {
              //     console.log(data)
              //     this.openChartModal(data)
              //   })
            });

            // 熱圖的 data
            let coData = {
              location: latlng,
              weight: dataFormat.confirmed
            };

            // 湖北數目太大，減一萬才能畫熱圖
            if(key === 'Hubei') {
              coData.weight = dataFormat.confirmed - 10000
            }

            this.heatmapData.push(coData);

          });

          // responseData 存排序過的 
          this.responseData = tempArr.sort((a, b) => {
            return a.confirmed > b.confirmed ? -1 : 1;
          });

          // 生成 heat map
          let heatmap = new google.maps.visualization.HeatmapLayer({
            data: this.heatmapData,
            dissipating: true,
            radius: 40
          });

          // 把 heat map 放上地圖
          heatmap.setMap(this.map);

          // 移除loading
          this.loadingMask = false;

      });
    },
    // 數據列表要呈現哪一組資料
    showCount(confirmed, recovered, death) {
      if(this.tabType === 'confirmed') {
        return confirmed;
      }
      if(this.tabType === 'recovered') {
        return recovered;
      }
      if(this.tabType === 'death') {
        return death;
      }
    },
    // 開啟 chart modal
    openChartModal(data) {
      // 整理資料：前五筆是資訊、後面的是數據
      MicroModal.show('chart-model');
    },
    // 移動地圖中心
    moveMapCenter(lat, lng, el) {
      let latLng = new google.maps.LatLng(lat, lng);
      this.map.panTo(latLng);
      el.openInfoWindow();
    }
  },
  created() {
    const script = document.createElement("script");
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBG9pWjn7gWHoqsNqTrU2EpWfZkyTlh6_I&libraries=visualization';
    document.head.appendChild(script);
    script.onload = this.initMap;
    MicroModal.init(); // chart modal
  },
});