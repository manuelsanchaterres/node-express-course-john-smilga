const { createCustomError } = require("../errors/custom_errors")
const { async_wrapper } = require("../middlewares")
// temporary tasks data array

const tasks = [
    
    {id:1, name: "task1", completed: true}, 
    {id:2, name: "task2", completed: false}, 
    {id:3, name: "task3", completed: false}, 
    {id:4, name: "task4", completed: true}, 
    {id:5, name: "task5", completed: false}

]
// Task model requested on controllers

const Task = require("../models/Task")

// tasks controllers

const getTasks = async_wrapper(async(req, res) => {

    const tasks = await Task.find({})
    res.status(200).json({success: true, data: tasks})

})


const getTask = async_wrapper (async(req, res, next) => {


    const {id: taskID} = req.params
    const task = await Task.findOne({_id: taskID})

    if (!task) {

        return next(createCustomError(`task with id ${taskID} was not found`, 404))

    }

    res.status(200).json({success: true, data: task})


})

const createTask = async_wrapper(async (req, res) => {

    const {name, completed} = req.body


    const task = await Task.create(req.body)

    res.status(201).json(task)

    

})

const updateTask = async_wrapper(async(req, res, next) => {

    const {name, completed} = req.body
    const {id} = req.params
    // const taskToEdit = await Task.updateOne({_id: id}, {name, completed})

    // this methods retrieves the update mongodb document as a result response

    // runValidators option check that new name updated value is not empty
    
    const editedTask = await Task.findOneAndUpdate({_id: id}, {name, completed}, {new: true, runValidators: true})

    if (!name) {

        return next(createCustomError(`please introduce new task name`, 404))

    }

    if (!editedTask) {

        return next(createCustomError(`task with id ${id} was not found`, 404))

    }


    res.status(200).json({success: true, data: editedTask})


})

const deleteTask = async_wrapper(async(req, res, next) => {



    const {id:taskID} = req.params
    const removedTask = await Task.findOneAndDelete({_id:taskID}, {new: true})

    if (!removedTask) {

        return next(createCustomError(`task with id ${taskID} was not found for removal`, 404))

    }

    res.status(200).json({deleted: true, data: removedTask})
    
        
})

// my versions

// const getTasks = (req, res) => {

//     if (tasks) {

//         return res.status(200).json({success: true, data: tasks})

//     }

//     res.status(400).json({success: false, data: "no tasks found"})


// }

// const getTask = async(req, res) => {

//     const {id} = req.params
//     const newtask = tasks.find((task) => task.id === parseInt(id))

//     if (!newtask) {

//         return res.status(400).json({success: false, data: `task with id ${id} was not found`})

//     }

//     res.status(200).json({success: true, data: newtask})


// }


// const createTask = (req, res) => {

//     const {id, name} = req.body

//     if (!name) {

//         return res.status(400).json({success: false, data: `please introduce a task name`})

//     }

//     const newtasks = [...tasks, {id, name, completed: false}]

//     res.status(200).json({success: true, data: {createdTask: {id, name, completed: false}, newtasks} })


// }

// const updateTask = (req, res) => {

//     const {name, completed} = req.body
//     const {id} = req.params
//     const taskToEdit = tasks.find((task) => task.id === parseInt(id))

//     if (!name) {

//         return res.status(400).json({success: false, data: `please introduce new task name`})

//     }

//     if (!taskToEdit) {

//         return res.status(400).json({success: false, data: `task with id ${id} was not found`})

//     }

//     const newTasks = tasks.map((task) => {

//         if (task.id === parseInt(id)) {

//             const newTask = {...task, name, completed}

//             return newTask

//         }

//         return task

//     })

//     const editedTask = newTasks.find((task) => task.id === parseInt(id))

//     res.status(200).json({success: true, data:{editedTask, newTasks} })


// }

// const deleteTask = (req, res) => {

//     const {id} = req.params
//     const taskToRemove = tasks.find((task) => task.id === parseInt(id))

//     if (!taskToRemove) {

//         return res.status(400).json({success: false, data: `task with id ${id} was not found for removal`})

//     }

//     const newTasks = tasks.filter((task) => task.id !== parseInt(id))


//     res.status(200).json({success: true, data: {deletedTask:taskToRemove, newTasks}})


// }








module.exports = {getTasks, createTask, getTask, updateTask, deleteTask}