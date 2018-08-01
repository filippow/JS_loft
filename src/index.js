/* ДЗ 2 - работа с массивами и объеектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (let i=0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    let newArr = [];

    for (let i=0; i < array.length; i++) {
        newArr.push(fn(array[i], i, array))
    }
    // Вместо цикла можно использовать forEach

    return newArr;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    let accum = array[0];

    for (let i=0; i < array.length; i++) {
        if (i===0 && initial) {
            accum = fn(initial, array[i], i, array);
        } else if (i > 0) {
            accum = fn(accum, array[i], i, array)
        }
    }

    return accum;
}
/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    let arr = [];

    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push(prop.toUpperCase());
        }
    }

    return arr;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from = 0, to) {
    let arr = [], 
        len = array.length;

    // to != 'number' в случае если to = undefined или null
    if (typeof to != 'number' || to > len) {
        to = len;
    } 

    if (to < 0) {
        to = len+to;
    }

    if (from < 0) {
        if (from+len < 0) {
            from = 0;
        } else {
            from = len + from;
        }
    }

    for (let i = from; i < to ; i++) {
        arr.push(array[i]);
    }

    return arr;
}
/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    return new Proxy(obj, {
        set(target, prop, value) {
            target[prop] = value*value;

            return true;
        }
    });
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
