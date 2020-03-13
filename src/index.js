const GoogleMap = new Vue({
  el: '#app',
  data: {
    loadingMask: true, // loading effect
    api: 'https://script.google.com/macros/s/AKfycbxC425IS9ntTUJ2k1rLzyDhKmj4R5wnyTS4JFaUnysctbQ1mXAO/exec', // google apps script src
    map: null,
    responseData: [], // 回來的資料
    heatmapData: [], // heat map data
    tabType: 'confirmed', // 數據列表的 active
    // 圖表資訊
    chart: {
      state: '',
      confirmed: 0,
      recovered: 0,
      death: 0
    },
    chartCanvas: null, // 最後生成的圖表
    toast: false, // 圖表是否打開
    toastLoading: true,// 圖表是否在讀取中
    translates: []
  },
  methods: {
    // 翻譯表
    getTranslate() {
      return new Promise((resolve, reject) => {
        fetch('https://spreadsheets.google.com/feeds/list/1gTzmvV0QG3t6_KOwvI9uNeUB9sNo3TjTQYRATpJ9jeE/1/public/values?alt=json')
          .then(res => res.json())
          .then(res => {
            this.translates = res.feed.entry;
            resolve();
          })
      })
    },
    // Google Maps API
    initMap() {
      fetch(this.api)
        .then(res => res.json())
        .then(res => {

          const _this = this;

          // 預設顯示的中心點
          const center = {
            lat: 43,
            lng: 12
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

          // 城市、國家名翻中文
          function translateCh(name) {
            let result = '';
            Array.prototype.forEach.call(_this.translates, trans => {
              let compareName = trans.gsx$city.$t;
              if(compareName == name) {
                return result = trans.gsx$translate.$t;
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
          const confirmed = res.confirmed;
          const recovered = res.recovered;
          const death = res.death;
          for(let i = 0, len = confirmed.length; i < len; i++) {
            let len = Object.keys(confirmed[0]).length - 1;
            let state = confirmed[i]['Province/State'].replace('--', ', ') || confirmed[i]['Country/Region'].replace('--', ', ');
            let dataFormat = {};
            dataFormat.id = i;
            dataFormat.stateEN = state;
            dataFormat.stateCH = translateCh(state);
            dataFormat.lat = confirmed[i]['Lat'];
            dataFormat.lng = confirmed[i]['Long'];
            dataFormat.confirmed = Number(confirmed[i][Object.keys(confirmed[0])[len]]) || 0;
            dataFormat.recovered = Number(recovered[i][Object.keys(recovered[0])[len]]) || 0;
            dataFormat.death = Number(death[i][Object.keys(death[0])[len]]) || 0;
            tempArr.push(dataFormat);

            // 寫所有的 state 進 google sheet
            // $.post('https://docs.google.com/forms/u/0/d/e/1FAIpQLSd7nyjeIieHqUEXRx77-tz8inx1S-IYmdPolTJRuMy6bBCb_Q/formResponse', {
            //   'entry.247938000': state
            // });

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
                <h6>${dataFormat.stateCH}</h6>
                <p>確診：${dataFormat.confirmed}</p>
                <p>康復：${dataFormat.recovered}</p>
                <p>死亡：${dataFormat.death}</p>
                <button
                  type="button"
                  id="info-btn-${dataFormat.id}"
                  class="btn btn-secondary btn-sm m-1 mt-2 for-mobile-up">
                  <small>開啟圖表</small> 
                </button>
              `,
            });

            // 由外部打開 infowindow 的 method
            dataFormat.openInfoWindow = () => {
              infowindow.open(this.map, marker);
            }

            // 按下開啟圖表
            infowindow.addListener('domready', e => {
              let btn = document.getElementById(`info-btn-${dataFormat.id}`);
              btn.addEventListener('click', e => {
                this.openChartModal({
                  state: `${dataFormat.stateCH} ${dataFormat.stateEn}`,
                  count: {
                    confirmed: dataFormat.confirmed,
                    recovered: dataFormat.recovered,
                    death: dataFormat.death,
                  },
                  data: {
                    confirmed: res.confirmed[i],
                    recovered: res.recovered[i],
                    death: res.death[i]
                  }
                })
              })
            });
            

            // 監聽 marker click 事件
            marker.addListener('click', e => {
              infowindow.open(this.map, marker);

              // 避免重疊地圖bug
              if(_this.chartCanvas !== null) {
                _this.destroyChart();
              }
            });

            // 熱圖的 data
            let coData = {
              location: latlng,
              weight: dataFormat.confirmed
            };

            // 湖北數目太大，縮小成跟大家差不多的數量才能畫熱圖
            if(confirmed[i]['Province/State'] === 'Hubei') {
              coData.weight = dataFormat.confirmed * 0.15
            }

            this.heatmapData.push(coData);

          }

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

      // 避免重疊地圖bug
      if(this.chartCanvas !== null) {
        this.destroyChart();
      }

      this.toast = true;
      this.toastLoading = true;

      // 整理資料：前四筆是資訊、後面的是數據
      this.chart.state = data.state;
      this.chart.confirmed = data.count.confirmed;
      this.chart.recovered = data.count.recovered;
      this.chart.death = data.count.death;

      // 建 labels
      let confirmedKeys = Object.keys(data.data.confirmed);
      confirmedKeys = confirmedKeys.slice(4, confirmedKeys.length);

      let recoveredKeys = Object.keys(data.data.recovered);
      recoveredKeys = recoveredKeys.slice(4, recoveredKeys.length);

      let deathKeys = Object.keys(data.data.death);
      deathKeys = deathKeys.slice(4, deathKeys.length);
      
      let labels = [];
      Array.prototype.forEach.call(confirmedKeys, key => {
        labels.push(key.split('/20')[0]);
      });

      // 整理數據
      let confirmedData = [], recoveredData = [], deathData = [];
      Array.prototype.forEach.call(confirmedKeys, key => {
        let confirmedValue = Number(data.data.confirmed[key]) || 0;
        confirmedData.push(confirmedValue);
      });
      Array.prototype.forEach.call(recoveredKeys, key => {
        let recoveredValue = Number(data.data.recovered[key]) || 0;
        recoveredData.push(recoveredValue);
      });
      Array.prototype.forEach.call(deathKeys, key => {
        let deathValue = Number(data.data.death[key]) || 0;
        deathData.push(deathValue);
      });
      
      let confirmedItem = {
        label: '確診',
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
        data: confirmedData,
        fill: false
      };
      let recoveredItem = {
        label: '康復',
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        data: recoveredData,
        fill: false
      };
      let deathItem = {
        label: '死亡',
        backgroundColor: '#f44336',
        borderColor: '#f44336',
        data: deathData,
        fill: false
      }

      var config = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [confirmedItem, recoveredItem, deathItem]
        },
        options: {
          responsive: true,
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: '日期'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: '人數'
              }
            }]
          }
        }
      };

      let ctx = document.getElementById('data-chart').getContext('2d');
      this.chartCanvas = new Chart(ctx, config);

      this.toastLoading = false;
    },
    // 刪除chart.js
    destroyChart() {
      this.toast = false;
      this.chartCanvas.destroy();
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
    script.onload = () => {
      this.getTranslate().then(() => this.initMap());
    };
  }
});