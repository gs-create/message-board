const db = require('../models/index');

exports.index = (req, res) => {
    if (!req.user) {
        return res.redirect('/signin');
    }

    const options = {
        include: [{
                model: db.reply
            },
            {
                model: db.user
            }
        ],
        order: [
            [
                db.reply,
                'created_at',
                'asc'
            ]
        ]
    };
    db.message.findAll(options).then((results) => {
        res.render('messages/index', { messages: results, currentUser: req.user });
    });
}

exports.new = (req, res) => {
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    res.render('messages/new', { currentUser: req.user });
}

exports.create = (req, res) => {
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    const params = {
        user_id: req.user.id,
        content: req.body.content
    };
    db.message.create(params).then((results) => {
        res.redirect('/messages');
    });
}

exports.show = (req, res) => {
    const options = {
        include: [{
            model: db.reply
        }],
        order: [
            [
                db.reply,
                'created_at',
                'asc'
            ]
        ]
    };
    db.message.findByPk(req.params.id, options).then((results) => {
        res.render('messages/show', { message: results });
    });
}

exports.edit = (req, res) => {
    db.message.findByPk(req.params.id).then((results) => {
        res.render('messages/edit', { message: results });
    });
}

exports.update = (req, res) => {
    const params = {
        content: req.body.content
    };
    const options = {
        where: {
            id: req.params.id
        }
    };
    db.message.update(params, options).then((results) => {
        res.redirect('/messages');
    });
}

exports.delete = (req, res) => {
    const options = {
        where: {
            id: req.params.id
        }
    };
    db.message.destroy(options).then((results) => {
        res.redirect('/messages');
    });
}


function formatDate(dateTime) {
    const year = dateTime.getFullYear();
    const month = dateTime.getMonthe() + 1;
    const date = dateTime.getDate();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();

    const newDateTime = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
    return newDateTime;
}