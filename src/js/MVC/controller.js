export default class Controller {
    constructor(model, view, yandexMap) {
        this.model = model;
        this.view = view;
        this.yandexMap = yandexMap;
        this.frame = document.querySelector('.frame');
        this.temporaryAdress = {};

        yandexMap.initMap().then( map=> {
            map.events.add('click', this.onMapClick.bind(this));
            this.init();
        });

        document.querySelector('.close').addEventListener('click', this.onCloseButtonClick.bind(this));
        document.querySelector('.add_button').addEventListener('click', this.onAddButtonClick.bind(this));
        document.body.addEventListener('click', this.onReferenceClick.bind(this))
    }

    init() {
        if (localStorage.length > 0 && localStorage.getItem('data')) {
            let data = JSON.parse(localStorage.getItem('data')).data;

            this.model.data = data;

            for (let i=0; i<data.length; i++) {
                for (let j=0; j<data[i].feedbacks.length; j++) {
                    let feedback = data[i].feedbacks[j];

                    this.yandexMap.addGeoObject(
                        feedback, 
                        this.onPlacemarkClick.bind(this), 
                        this.view.getBaloonContent(feedback)
                    );
                }
            }
        }
    }

    async onMapClick(event) {
        let adress = await this.yandexMap.getAdress(event);
        
        this.temporaryAdress = adress;
        this.view.renderModal(adress);
    }

    onAddButtonClick() {
        let feedback = this.getFeedback(),
            review = this.model.addReview(feedback);

        this.view.renderModal(review);
        this.yandexMap.addGeoObject(
            feedback, 
            this.onPlacemarkClick.bind(this), 
            this.view.getBaloonContent(feedback)
        );
    }

    getFeedback() {
        let inputs = this.frame.querySelector('.form').children;

        return {
            name: inputs[0].value,
            target_place: inputs[1].value,
            impression: inputs[2].value,
            adress: this.temporaryAdress.adress,
            coords: this.temporaryAdress.coords.slice()
        };
    }

    onCloseButtonClick() {
        this.view.closeModal();
    }

    onReferenceClick({target}) {
        if (target.parentNode.classList.contains('menu-arrow')) {
            this.view.changeMenu(target);
        } else if (target.classList.contains('menu_button')){
            this.onStorageButtonsClick(target);
        } else if (target.dataset.link) {
            this.showModal(target.dataset.link)
        }
    }

    onPlacemarkClick(event) {
        this.showModal(event.get('target').properties.get('review_id'));
    }

    showModal(id) {
        if (id) {
            let review = this.model.getReviewById(id);
            this.view.renderModal(this.model.getReviewById(id));
        
            this.temporaryAdress = {
                adress: review.adress,
                coords: review.coords
            }
        }
    }
    
    onStorageButtonsClick(element) {
        if (element.classList.contains('menu_button-save')) {
            this.saveToLS();
        } else if (element.classList.contains('menu_button-delete')) {
            this.clearLS()
        }
    }

    saveToLS() {
        localStorage.setItem('data', JSON.stringify({data: this.model.data}));
    }

    clearLS() {
        localStorage.clear();
        this.model.data = [];
        this.yandexMap.clusterer.removeAll();
    }
}