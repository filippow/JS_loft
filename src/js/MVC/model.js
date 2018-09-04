export default class Model {
    constructor() {
        this.leftFriends = [];
        this.rightFriends = [];
    }

    setStorage() {
        window.localStorage.setItem('left', JSON.stringify({ left: this.leftFriends }));
        window.localStorage.setItem('right', JSON.stringify({ right: this.rightFriends }));
    }
    
    getStorage() {
        return {
            left: JSON.parse(window.localStorage.getItem('left')).left,
            right: JSON.parse(window.localStorage.getItem('right')).right
        }
    }

    transfer(id) {
        let index = this.getIndexById(id);

        if (this.leftFriendsContain(id)) {
            this.rightFriends.push(...this.leftFriends.splice(index, 1));
            this.rightFriends[this.rightFriends.length-1].cross = true;
        } else {
            this.leftFriends.push(...this.rightFriends.splice(index, 1))
            this.leftFriends[this.leftFriends.length-1].cross = false;
        }
    }

    leftFriendsContain(id) {
        return this.leftFriends.some(el => {
            return el.id == id
        })
    }

    getIndexById(id) {
        let array = this.leftFriendsContain(id) ? this.leftFriends : this.rightFriends,
            index;

        array.forEach((el, i) => {
            if (el.id == id) {
                index = i;
            }
        })

        return index
    }
}