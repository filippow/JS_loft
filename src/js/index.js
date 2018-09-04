import Model from './MVC/model.js';
import View from './MVC/view.js';
import Controller from './MVC/controller.js';

import DragAndDrop from './modules/dragAndDrop.js';
import apiVK from './modules/vkApi..js';

let vk = new apiVK();
let model = new Model();
let controller = new Controller(vk);
let view = new View(model, controller, DragAndDrop);

controller.init(view, model);
