export default class View {
    constructor(model, controller, dgd) {
        this.model = model;
        this.controller = controller;
        this.leftContainer = document.querySelector('.leftBar_container');
        this.rightContainer = document.querySelector('.rightBar_container');
          
        dgd(this.leftContainer, this.rightContainer, this.controller.appendData.bind(this));
        this.addListeners();
    }

    addListeners() {
        document.querySelector('.leftSearch').addEventListener('keyup', this.onKeyup.bind(this));
        document.querySelector('.rightSearch').addEventListener('keyup', this.onKeyup.bind(this));
        document.querySelector('.save').addEventListener('click', this.onSaveInfo.bind(this));
        document.addEventListener('click', this.onFriendTransfer.bind(this));
    }

    onSaveInfo() {
        this.controller.setStorage();
    }

    onKeyup({ target }) {
        this.controller.onKeyUp(target);
    }

    onFriendTransfer({ target }) {
        this.controller.onFriendTransfer(target);
    }

    render(friends, container) {
        let Handlebars = Handlebars;
        
        container.innerHTML = Handlebars.compile(document.getElementById('friend').innerHTML)({ friends: friends })
    } 
}