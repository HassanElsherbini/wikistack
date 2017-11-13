const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.get('/', function(req, res, next) {
  Page.findAll()
  .then((pages) => {
    res.render('index', {pages});
    //res.json(pages);
  })
  .catch(next);
});

router.post('/', function(req, res, next) {

  // let page = Page.build({
  //   title: req.body.title,
  //   content: req.body.content,
  //   status: req.body.status,
  //   urlTitle: req.body.title,
  // });

  // page.save()
  // .then(function(page){
  //   res.redirect(page.route);
  // }).catch(next);

  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  })
  .then(function (values) {

    var user = values[0];

    var page = Page.build({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      urlTitle: req.body.title,
    });

    return page.save().then(function (page) {
      return page.setAuthor(user);
    });

  })
  .then(function (page) {
    res.redirect(page.route);
  })
  .catch(next);
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next){

  // let pageName = req.params.urlTitle;
  // console.log(pageName);
  // Page.findOne({
  //   where: {
  //     urlTitle: pageName
  //   }
  // })
  // .then(foundPage => {
  //   let pageInfo = {
  //     title: foundPage.title,
  //     content: foundPage.content
  //   };
  //   res.render('wikipage', pageInfo);
  // })
  // .catch(next);
  Page.findOne({
    where: {
        urlTitle: req.params.urlTitle
    },
    include: [
        {model: User, as: 'author'}
    ]
  })
  .then(function (page) {
    // page instance will have a .author property
    // as a filled in user object ({ name, email })
    if (page === null) {
        res.status(404).send();
    } else {
        res.render('wikipage', {
            page: page
        });
    }
  })
  .catch(next);

});

module.exports = router;
