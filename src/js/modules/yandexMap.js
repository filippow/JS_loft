export default class yandexMap{
    
    async initMap() {
        return new Promise (resolve => ymaps.ready(resolve)).then( resp => {         
                this.map = new ymaps.Map("map", {
                    center: [55.76, 37.64],
                    zoom: 14,
                    controls: []
                });
             
                this.clusterer = new ymaps.Clusterer({
                    preset: 'islands#invertedVioletClusterIcons',
                    clusterDisableClickZoom: true,
                    openBalloonOnClick: true,
                    clusterBalloonContentLayout: 'cluster#balloonCarousel',
                });
               
                this.map.geoObjects.add(this.clusterer);
    
             return this.map    
        })
    }

    async getAdress(event) {
        let coords = event.get('coords');
        let adress = await ymaps.geocode(coords);
        
        adress = adress.geoObjects.get(0).properties.get('text');  
             
        return {
            coords,
            adress
        }
    }

    addGeoObject(feedback, callback, content) {
        let myPlacemark = new ymaps.Placemark(feedback.coords, {
            clusterCaption: feedback.target_place,
            balloonContent: content,
            review_id: feedback.review_id 
        },{
            preset: 'islands#violetIcon',
            openBalloonOnClick: false
        });

        myPlacemark.events.add('click', callback);
        this.clusterer.add(myPlacemark);
    }
}