const express = require('express');
const userController = require('../controllers/userController')
const projectController = require('../controllers/projectController')
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const multerMiddleware = require('../middlewares/multerMiddleware');

const router = new express.Router()

//register - post
router.post('/register',userController.registerController)

//login - post
router.post('/login',userController.loginController)

//add-project - post
router.post('/add-project',jwtMiddleware,multerMiddleware.single('projectImage'),projectController. addProjectController)

//home project - get
router.get('/home-projects',projectController.getHomeProjectsController)

//user-project - get
router.get('/user-projects',jwtMiddleware,projectController.getUserProjectsController)

//all-project - get
router.get('/all-projects',jwtMiddleware,projectController.getAllProjectsController)



module.exports = router