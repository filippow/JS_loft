/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', filterCookies);

function filterCookies(event) {
    let value = event.target.value;

    for (let i=0; i< listTable.children.length; i++) {
        let row = listTable.children[i];

        if (row.children[0].textContent.indexOf(value)>-1 || row.children[1].textContent.indexOf(value)>-1) {
            row.style.display = '';
        } else {
            row.style.display = 'none'
        }
    }
}

let cookies = [];

addButton.addEventListener('click', () => {
    let name = addNameInput.value,
        value = addValueInput.value, 
        id = Math.floor(Math.random()*new Date().getTime().toString());
       
    if (nameMatch(name, value)) {

    }
    document.cookie = `${name}=${value}`;
    cookies.push({
        name: name,
        value: value,
        id: id
    });
   
    listTable.appendChild(createRow(name, value, id));
  
});



function nameMatch(name) {
    return cookies.some( el => {
        el.name === name
    })
}

let createRow = function(name, value, id) {
    let tr = document.createElement('tr'),
        tdName = document.createElement('td'),  
        tdValue = document.createElement('td'),
        tdDelete = document.createElement('td'),
        buttonDelete = document.createElement('button');

    buttonDelete.textContent = 'Del';
    tdDelete.appendChild(buttonDelete);
    tdName.textContent = name;
    tdValue.textContent = value;

    buttonDelete.addEventListener('click', deleteCookieAndRow);

    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(tdDelete);
    tr.id = id;

    return tr;
}

function getRow(id) {
    return document.getElementById(id)
}

function deleteCookieAndRow(id) {

    if (id.target) {
        id = id.target.parentNode.parentNode.id;
    }

    cookies.forEach( (el, i) => {
  
        if (el.id == id) {
            let tr = getRow(el.id);

            listTable.removeChild(tr);

            document.cookie = `${el.name}=${el.value}; expires=${new Date(0).toUTCString()};`;
            cookies.splice(i, 1);

        }
    })
}