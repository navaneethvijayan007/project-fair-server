const { json } = require('express');
const projects = require('../models/projectModel')


//add
exports.addProjectController = async(req,res)=>{
    console.log("Inside addProjectController ");
    const userId = req.userId
    console.log(userId);
    console.log(req.body);
    console.log(req.file);
    const {title,languages,overview,github,website} = req.body
    const projectImage = req.file.filename
    try{
        const existingProject = await projects.findOne({github})
        if(existingProject){
            res.status(406),json("project already exists....please upload another!!!")
        }else{
            const newProject = new projects({
                title,languages,overview,github,website,projectImage,userId
            })
            await newProject.save()
            res.status(200).json(newProject)
        }
    }catch(err){
        res.status(406).json(err)
    }
    
}

// get home projects
exports.getHomeProjectsController = async(req,res)=>{
    console.log("Inside getHomeProjectsController ")
    try{
        const allHomeProjects = await projects.find().limit(3)
        res.status(200).json(allHomeProjects)
    }catch(err){
        res.status(401).json(err)
    }
}

// get user projects
exports.getUserProjectsController = async(req,res)=>{
    console.log("Inside getUserProjectsController ")
    const userId = req.userId
    try{
        const allUserProjects = await projects.find({userId})
        res.status(200).json(allUserProjects)
    }catch(err){
        res.status(401).json(err)
    }
}

// get all projects
exports.getAllProjectsController = async(req,res)=>{
    console.log("Inside getAllProjectsController ")
    const searchKey = req.query.search
    const query = {
        languages :{
            $regex:searchKey,$options:"i"
        }
    }
    try{
        const allProjects = await projects.find(query)
        res.status(200).json(allProjects)
    }catch(err){
        res.status(401).json(err)
    }
}

//edit project
exports.editProjectController = async(req,res)=>{
    console.log("Inside editProjectController ")
    //get project id
    const {id} = req.params
    //req.body - contsns text data
    const{title,languages,overview,github,website,projectImage} = req.body
    //to getfile data
    const reUploadImageFileName = req.file?req.file.filename:projectImage
    ///to getuserid
    const userId = req.userId
    console.log(id,title,languages,overview,github,website,reUploadImageFileName,userId);
    try{
        const updateProject = await projects.findByIdAndUpdate({_id:id},{
            title,languages,overview,github,website,projectImage:reUploadImageFileName,userId
        },{new:true})
        await updateProject.save()
        res.status(200).json(updateProject)
    }catch(err){
        res.status(401).json(err)
    }
    
}

// remove project
exports.removeProjectController = async (req,res) => {
    console.log('Inside removeProjectController')
    
    // 1. get id of the project to be deleted from params
    const {id} = req.params
    // 2. delete project wuth given id from model 
    try {
        const removeProject = await projects.findByIdAndDelete({_id:id})
        res.status(200).json(removeProject)
    } catch(err) {
        res.status(401).json(err)
    }
}