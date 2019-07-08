'use strict'

const response = require('./response');
const connection = require('./connect');

exports.welcome = function (req, res) {
    response.ok('welcome!', res)
}

exports.getAllNotes = function (req, res,next) {
    let category          = req.query.category_id != undefined && req.query.category_id != ""? req.query.category_id : "";
    let categoryStatement = req.query.category_id != undefined && req.query.category_id != ""?" category_id ="+req.query.category_id+" and " : "";
    let limit             = req.query.limit != undefined && req.query.limit != "" ? req.query.limit : 10;
    let sort              = req.query.sort != undefined && req.query.sort != "" ? req.query.sort : "DESC";
    let page              = req.query.page != undefined && req.query.page != "" ? req.query.page : 1 ;
    let byId              = req.query.page == undefined || req.query.page == "" || req.query.page == 1 ?  0: (req.query.page - 1) * limit;
    let search            = req.query.search != undefined  && req.query.search != "" ? req.query.search :"";
    let whereQuery        = req.query.search != undefined ? " where "+categoryStatement+" title LIKE \"%" + req.query.search + "%\" " : "";
    let sortLimitQuery    = " ORDER BY created_at " + sort + " LIMIT " + byId + ", " + limit;
    
    connection.query(
        "SELECT * FROM v_notes " + whereQuery+sortLimitQuery,
        function (error, rows, field) {
            if (error) {
                throw error;
            } else {                
                connection.query(
                    "SELECT count(*) as rows_total FROM v_notes " + whereQuery,
                    function (error, result, field) {
                            res.resultTotal = result[0].rows_total;
                            res.limit       = limit;
                            res.sort        = sort;
                            res.page        = page;
                            res.category    = category;
                            res.search      = search;
                            res.pageTotal   = Math.ceil(result[0].rows_total/limit);
                            response.getNotesOk(rows, res);
                    }
                )
            }
        }
    )
}

exports.getNote = function (req, res) {
    let id = req.params.id;
    connection.query(
        'SELECT * FROM v_notes where id=?',
        [id],
        function (error, rows) {
            if (error) {
                throw error;
            } else {
                response.ok(rows, res);
            }
        }
    )
}

exports.insertNote = function (req, res) {
    let title       = req.body.title;
    let note        = req.body.note;
    let categoryId  = req.body.category_id;
    var date        = new Date();
    var created_at  = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

    connection.query(
        'INSERT INTO notes SET title=?, note=?, created_at=?, category_id=?',
        [title, note, created_at, categoryId],
        function (error, results,  fields) {
            if (error) {
                throw error;
            } else {
                let id = results.insertId
                connection.query(
                    "SELECT * FROM v_notes where id = ?",
                    [id],
                    function (error, rows, field) {
                            return res.send({
                            error: false,
                            value: rows,
                            message: 'Note has been created',
                        });
                    }
                )
            }
        }
    );
}

exports.updateNote = function (req, res) {
    let id          = req.params.id;
    let title       = req.body.title;
    let note        = req.body.note;
    let category_id = req.body.category_id;
    var date        = new Date();
    var updated_at  = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

    connection.query(
        'UPDATE notes SET title=?, note=?, category_id=? ,updated_at=?  WHERE id=?',
        [title, note, category_id, updated_at, id],
        function (error, results, field) {
            if (error) {
                throw error;
            } else {
                connection.query(
                    "SELECT * FROM v_notes where id = ?",
                    [id],
                    function (error, rows, field) {
                        return res.send({
                            error: false,
                            value: rows,
                            message: 'Note has been updated',
                        });
                    }
                )
            }
        }
    );
}

exports.deleteNote = function (req, res) {
    let id  = req.params.id;
    connection.query(
        'DELETE FROM notes where id=?',
        [id],
        function (error, rows, field) {
            if (error) {
                throw error;
            } else {
                return res.send({
                    error: false,
                    value: rows,
                    id: id,
                    message: 'Note has been deleted',
                });
            }
        }
    )
}



exports.getAllCategories = function (req, res) {
    connection.query(
        'SELECT * FROM categories',
        function (error, rows, field) {
            if (error) {
                throw error;
            } else {
                response.ok(rows, res);
            }
        }
    )
}

exports.insertCategory = function (req, res) {
    let name        = req.body.name;
    let image_url   =  req.body.image_url ? req.body.image_url : "";

    connection.query(
        'INSERT INTO categories SET name=?, image_url=?',
        [name, image_url],
        function (error, rows, field) {
            if (error) {
                throw error;
            } else {
                let id = rows.insertId
                connection.query(
                    "SELECT * FROM categories where id = ?",
                    [id],
                    function (error, rows, field) {
                            return res.send({
                            error: false,
                            value: rows,
                            message: 'Category has been created',
                        });
                    }
                )
            }
        }
    );
}

exports.updateCategory = function (req, res) {
    let id      = req.params.id;
    let name    = req.body.name;

    connection.query(
        'UPDATE categories SET name=? WHERE id=?',
        [name, id],
        function (error, rows, field) {
            if (error) {
                throw error;
            } else {
                return res.send({
                    error: false,
                    data: rows,
                    message: 'Category has been updated',
                });
            }
        }
    );
}

exports.deleteCategory = function (req, res) {
    let id = req.params.id;
    connection.query(
        'DELETE FROM categories where id=?',
        [id],
        function (error, rows, field) {
            if (error) {
                throw error;
            } else {
                return res.send({
                    error: false,
                    data: rows,
                    id:id,
                    message: 'Category has been deleted',
                });
            }
        }
    )
}