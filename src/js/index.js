import '../css/main.scss';
import Model from './MVC/model.js';
import View from './MVC/view.js';
import Controller from './MVC/controller.js';
import yandexMap from './modules/yandexMap.js';

let map = new yandexMap();
let model = new Model();
let view = new View();
let controller = new Controller(model, view, map);
