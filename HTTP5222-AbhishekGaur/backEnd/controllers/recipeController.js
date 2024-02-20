require("../models/database");
const { Link } = require("react-router-dom");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

/**
 * GET : '/'
 * Homepage
 */




exports.homepage = async(req, res) => {
    try {

        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        // we're sorting with "negative id" so we can access the latest recipes

        const indian = await Recipe.find({ 'category' : 'Indian'}).limit(limitNumber);
        const italian = await Recipe.find({ 'category' : 'Italian'}).limit(limitNumber);
        const chinese = await Recipe.find({ 'category' : 'Chinese'}).limit(limitNumber);

        const food = { latest, indian, italian, chinese };

        res.render('index', { title : "Cook Here | Home", categories, food});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}


/**
 * GET : '/categories'
 * Categories
 */




exports.exploreCategories = async(req, res) => {
    try {

        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber)


        res.render('categories', { title : "Cook Here | Categories", categories});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}


/**
 * GET : '/recipe/:id'
 * Recipe
 */




exports.exploreRecipe = async(req, res) => {
    try {
        let recipeId = req.params.id;

        const recipe = await Recipe.findById(recipeId);

        res.render('recipe', { title : "Cook Here | Recipe", recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}




/**
 * GET : '/categories/:id'
 * Categories By ID
 */




exports.exploreCategoriesByID = async(req, res) => {
    try {

        let categoryId = req.params.id;

        const limitNumber = 20;
        const categoryById = await Recipe.find({ 'category': categoryId}).limit(limitNumber)


        res.render('categories', { title : "Cook Here | Categories", categoryById});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}

/**
 * POST : '/search'
 * Search
 */



exports.searchRecipe = async(req, res) => {

    //searchTerm

    try {
        let searchTerm = req.body.searchTerm;

        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive : true } });
        res.render('search', { title: 'Cooking Blog | Search', recipe});
      
    } catch (error) {
        
    }

    
}


/**
 * GET : '/explore-latest'
 * Explore Latest
 */




exports.exploreLatest = async(req, res) => {
    try {
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber)

        res.render('explore-latest', { title : "Cook Here | Discover Latest", recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}


/**
 * GET : '/random-recipe'
 * Random Recipe
 */




exports.randomRecipe = async(req, res) => {
    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
  
        res.render('random-recipe', { title : "Cook Here | Random Recipe", recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}


/**
 * GET : '/submit-recipe'
 * Submit Recipe
 */




exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');


    res.render('submit-recipe', { title : "Cook Here | Submit Recipe", infoErrorsObj, infoSubmitObj});
}

/**
 * POST : '/submit-recipe'
 * Submit Recipe
 */




exports.submitRecipeOnPost = async(req, res) => {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
        console.log('No files where uploaded.')
    }else{
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;

        uploadPath = require('path').resolve('./') + '/public/img' + newImageName;

        imageUploadFile.mv(uploadPath, function(err){
            if(err){return res.status(500).send(err);}
        })
    }

    try {

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });

        await newRecipe.save();

        req.flash('infoSubmit', 'Recipe has been added.')
        res.redirect('/submit-recipe');
    } catch (error) {
        req.flash('infoErrors', error)
        res.redirect('/submit-recipe');
    }

    
}



