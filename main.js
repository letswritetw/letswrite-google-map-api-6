
const GoogleMap = new Vue({
  el: '#app',
  data: {
    loadingMask: true, // loading effect
    api: 'https://script.google.com/macros/s/AKfycbycicX5-NDjA6FEbwfauuUSi4NSN4RXbEGSkqPMc3G9JDNA40s/exec', // google apps script src
    map: null,
    responeData: [], // 回來的資料
    heatmapData: [] // heat map data
  },
  methods: {
    initMap() {
      fetch(this.api)
        .then(res => res.json())
        .then(res => {

          // 預設顯示的中心點
          const center = {
            lat: 30.97564,
            lng: 112.2707
          };

          this.responeData = res;

          this.map = new google.maps.Map(document.getElementById('map'), {
            center: center,
            zoom: 5,
            mapTypeId: 'roadmap',
            zoomControl: false,
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

          // 處理每個資料
          Array.prototype.forEach.call(keys, key => {

            let obj = res[key];

            // 經緯度
            let latlng = new google.maps.LatLng(obj.lat, obj.lng);

            // 放maker
            let marker = new google.maps.Marker({
              position: latlng,
              map: this.map
            });

            // info window
            let infowindow = new google.maps.InfoWindow({
              content: `
                <h6>${key}</h6>
                <p>確診：${obj.confirmed}</p>
                <p>康復：${obj.recovered}</p>
                <p>死亡：${obj.death}</p>
              `,
            });

            // 監聽 marker click 事件
            marker.addListener('click', e => {
              infowindow.open(this.map, marker);
            });

            // 熱圖的 data
            let coData = {
              location: latlng,
              weight: obj.confirmed
            };

            // 湖北數目太大，減一萬才能畫熱圖
            if(key === 'Hubei') {
              coData.weight = obj.confirmed - 10000
            }

            this.heatmapData.push(coData);

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
    }
  },
  created() {
    const script = document.createElement("script");
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBG9pWjn7gWHoqsNqTrU2EpWfZkyTlh6_I&libraries=visualization';
    document.head.appendChild(script);
    script.onload = this.initMap;
  },
});