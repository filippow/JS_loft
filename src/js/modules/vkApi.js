export default class apiVK {
    constructor() {
        this.version = '5.8';
        this.apiID = 6672480;
    }

    auth(callbackFn) {
        this.login()
            .then( () => this.getMyFriends())
            .then( response => {
                if (response) {
                    callbackFn(response.response.items)
                }
            })
            .catch(err => {console.log(err)})
    }

    callApi(method, params) {
        params = params || {};
        params.v = this.version;

        return new Promise( (resolve, reject) => {
            VK.api(method, params, response => {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    resolve(response);
                }
            })
        })
    }

    login() {
        return new Promise( (resolve, reject) => {
            VK.init({
                apiId: this.apiID
            });

            VK.Auth.login(response => {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, 2);
        })  
    }
  
    getMyFriends() {
        return this.callApi('friends.get', { order: 'name', fields: ['photo_50'] });
    }
}