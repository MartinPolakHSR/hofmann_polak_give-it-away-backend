//const express = require('express');
//const router = express.Router();
//const articleController = require('../controller/articleController.js');

// router.get("/", articleController.getArticles);
// router.post("/", articleController.saveArticle);
// router.get("/:id/", articleController.getArticle);
// router.delete("/:id/", articleController.deleteArticle);

//module.exports = router;


const express = require('express');
const articleRoutes = express.Router();

// Require Article model in our routes module
const Article = require('../models/Article');

// Defined store route
articleRoutes.route('/add').post(function (req, res) {
    var article = new Article(req.body);
    article.save()
        .then(item => {
        res.status(200).json({'article': 'Article added successfully'});
})
.catch(err => {
        res.status(400).send("unable to save to database");
});
});

// Defined get data(index or listing) route
articleRoutes.route('/').get(function (req, res) {
    Article.find(function (err, article){
        if(err){
            console.log(err);
        }
        else {
            res.json(article);
        }
    });
});

// Defined edit route
articleRoutes.route('/edit/:id').get(function (req, res) {
    var id = req.params.id;
    Article.findById(id, function (err, item){
        res.json(item);
    });
});

//  Defined update route
articleRoutes.route('/update/:id').post(function (req, res) {
    Article.findById(req.params.id, function(err, article) {
        if (!article)
            return next(new Error('Could not load Document'));
        else {
            article.name = req.body.name;
            article.description = req.body.description;

            article.save().then(item => {
                res.json('Update complete');
        })
        .catch(err => {
                res.status(400).send("unable to update the database");
        });
        }
    });
});

// Defined delete | remove | destroy route
articleRoutes.route('/delete/:id').get(function (req, res) {
    Article.findByIdAndRemove({_id: req.params.id}, function(err, article){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = articleRoutes;