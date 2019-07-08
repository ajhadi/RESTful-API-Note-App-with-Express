'use strict'

module.exports = function (app) {
    const controller = require('./controller');

    //WELCOME
    app.get('/', controller.welcome);

    //NOTES
    app.get('/notes', controller.getAllNotes);
    app.get('/notes/:id', controller.getNote);
    app.post('/notes', controller.insertNote);
    app.patch('/notes/:id', controller.updateNote);
    app.delete('/notes/:id', controller.deleteNote);
 
    //CATEGORIES
    app.get('/categories', controller.getAllCategories);
    app.post('/categories', controller.insertCategory);
    app.patch('/categories/:id', controller.updateCategory);
    app.delete('/categories/:id', controller.deleteCategory);
}