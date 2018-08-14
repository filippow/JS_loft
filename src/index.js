/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
    return new Promise( function(resolve) {
        setTimeout(function() {
            resolve()
        }, seconds * 1000)
    })
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {
    return new Promise( function( resolve, reject) {
        var xhr = new XMLHttpRequest(),
            towns = [],
            compareFunc = function(a, b) {
                a = a.name.toLowerCase();
                b = b.name.toLowerCase();

                if (a > b) {
                    return 1;
                } else if (a < b) {
                    return -1;
                } 
            
                return 0;
            }

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);

        xhr.send();

        xhr.onreadystatechange = function() {
            if (this.readyState != 4) {
                return
            }

            if (xhr.status != 200) {
                reject();
            } else {
                towns = JSON.parse(xhr.responseText).sort(compareFunc);
                resolve(towns); 
            }
        }
    })
}

export {
    delayPromise,
    loadAndSortTowns
};
