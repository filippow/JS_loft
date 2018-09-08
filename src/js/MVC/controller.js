export default class Controller {
    constructor(apiVK) {
        this.version = '5.8'
        this.apiVK = apiVK;
    }

    init(view, model) {
        this.view = view;
        this.model = model;

        this.model.getFriends(this.initListsFromVKapi.bind(this))
    }

    setStorage() {
        this.model.setStorage();
    }

    initListsFromVKapi(fromServer) {
        if (window.localStorage.getItem('left')) {
            this.initFriendsList(...this.model.compareFriends(fromServer));
        } else {
            this.model.setFriendsList(fromServer);
            this.initFriendsList(fromServer);
        }
    }

    onKeyUp(target) {
        let isContain = target.classList.contains('leftSearch'),
            friends = this.model[isContain ? 'leftFriends' : 'rightFriends'],
            container = this.view[isContain? 'leftContainer' : 'rightContainer'],
            value = target.value.toLowerCase(),
            newArr = [];

        friends.forEach(el => {
            if (el.first_name.toLowerCase().indexOf(value) > -1 || el.last_name.toLowerCase().indexOf(value) > -1) {
                newArr.push(el);
            }
        });

        this.view.render(newArr, container);
    }

    onFriendTransfer(target) {
        if (target.classList.contains('fas')) {
            this.model.transfer(target.closest('.friend').id);
            this.initFriendsList(this.model.leftFriends, this.model.rightFriends);
            this.changeIcon(target.closest('.friend').id);
        }
    }

    appendData(item) {
        this.model.transfer(item.id);
        this.controller.changeIcon(item.id);
    }

    changeIcon(id) {
        var elem = document.getElementById(id).querySelector('.fas');

        elem.classList = elem.closest('.rightBar_container') ? 'fas fa-times-circle' : 'fas fa-plus';
    }

    initFriendsList(left, right) {
        this.view.render(left, this.view.leftContainer);      
        
        if (right) {
            this.view.render(right, this.view.rightContainer);
        }
    }
}