const Job = require("../models/Job")

const getJobs = async (req,res) => {

    const jobs = await Job.find()

    console.log(jobs);

    res.send('get all jobs')

}

const getJob = async (req,res) => {

    res.send('get job')
    
}

const createJob = async (req,res) => {

    res.send('create job')
    
}

const updateJob = async (req,res) => {

    res.send('update job')
    
}

const deleteJob = async (req,res) => {

    res.send('delete job')
    
}



module.exports = {getJobs, getJob, createJob, updateJob, deleteJob }