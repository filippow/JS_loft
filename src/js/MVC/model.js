export default class Model {
    constructor(vk) {
        this.leftFriends = [];
        this.rightFriends = [];
        this.vk = vk;
    }

    getFriends(callback) {
        this.vk.auth(callback);
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

    compareFriends(fromServer) {
        let rightStorage = this.getStorage().right,
            index;
    
        for (let i=0; i< rightStorage.length; i++) {
            if (fromServer.some((el) => el.id == rightStorage[i].id )) {
                index = this.getIndexById(rightStorage[i].id, fromServer);
                fromServer.splice(index, 1);
            } else {
                rightStorage.splice(i, 1);
                i--;
            }
        }

        this.setFriendsList(fromServer, rightStorage);

        return [fromServer, rightStorage]
    }

    setFriendsList(left, right = []) {
        this.leftFriends = left;
        this.rightFriends = right;
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

    getIndexById(id, target) {
        let array = this.leftFriendsContain(id) ? this.leftFriends : this.rightFriends,
            index;

        if (target) {
            array = target;
        }
        
        array.forEach((el, i) => {
            if (el.id == id) {
                index = i;
            }
        })

        return index
    }
}