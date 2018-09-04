export default class Controller {
    constructor(apiVK) {
        this.apiVK = apiVK;
    }

    init(view, model) {
        this.version = '5.8'
        this.view = view;
        this.model = model;

        this.apiVK.auth(this.initListsFromVKapi.bind(this));
    }

    setStorage() {
        this.model.setStorage();
    }

    initListsFromVKapi(fromServer) {
        if (fromServer) {
            this.initFriendsList(fromServer);
        } else {
            this.initFriendsList(this.model.getStorage().left, this.model.getStorage().right);
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
        this.model.leftFriends = left;
          
        if (right) {
            this.view.render(right, this.view.rightContainer);
            this.model.rightFriends = right
        }
    }
}