'use strict'

exports.ok = function (rows, res) {
    const data = {
        status  : 200,
        value   : rows,
    }
    res.json(data);
    res.end();
};

exports.getNotesOk = function (rows, res) {
    const data = {
        status      : 200,
        total       : res.resultTotal,
        sort        : res.sort,
        search      : res.search,
        page        : parseInt(res.page),
        pageTotal   : res.pageTotal, 
        limit       : parseInt(res.limit),
        category    : res.category,
        value       : rows,
    }
    res.json(data);
    res.end();
};