export default class Model {
    constructor() {
        this.data = [];
    }
    
    addReview(feedback) {
        let time = new Date(),
            review; 

        feedback.date = this.formatDate(time);
        
        // Отработает в случае если отзыв для текущего адреса уже существует
        for (let i=0; i<this.data.length; i++) {
            if (this.data[i].adress === feedback.adress) {
                feedback.review_id = this.data[i].id;
                this.data[i].feedbacks.push(feedback);

                return this.data[i]
            }
        }

        // Отработает в случае если отзыва по текущему адресу пока нет. Создаем
        feedback.review_id = time.getTime();
        review = {
            id: time.getTime(),
            coords: feedback.coords,
            adress: feedback.adress,
            feedbacks: [feedback]
        }

        this.data.push(review);

        return review;
    }
    
    formatDate(date) {
        let day = date.getDate(),
            month = date.getMonth(),
            year = date.getFullYear(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();
      
        return  `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
    }

    getReviewById(id) {
        for (let i=0; i< this.data.length; i++) {
            if (this.data[i].id == id) {
                return this.data[i];
            }
        }
    }
}