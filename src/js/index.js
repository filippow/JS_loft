import '../css/main.scss';
import Model from './MVC/model';
import View from './MVC/view';
import Controller from './MVC/controller';

import DragAndDrop from './modules/dragAndDrop';
import apiVK from './modules/vkApi';

let vk = new apiVK();
let model = new Model(vk);
let controller = new Controller();
let view = new View(model, controller, DragAndDrop);

controller.init(view, model);
