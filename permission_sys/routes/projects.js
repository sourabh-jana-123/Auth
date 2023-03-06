const express = require('express')
const { authUser } = require('../basicAuth')

const router = express.Router()
const { projects } = require('../data')
const { canViewProject, scopProjects, canDeleteProject } = require('../permissions/project')

router.get('/', authUser, (req, res) => {
    res.json(scopProjects(req.user, projects))
})

router.get('/:projectId', setProject, authUser, authGetProject, (req, res) => {
    res.json(req.project)
})

router.delete('/:projectId', setProject, authUser, authDeleteProject, (req, res) => {
    res.json('Project Deleted')
})

function setProject(req, res, next) {
    const projectId = parseInt(req.params.projectId)
    req.project = projects.find(project => project.id === projectId)

    if(req.project == null) {
        res.status(404)
        return res.send('Project not found')
    }
    next()
}

function authGetProject(req, res, next) {
    if(!canViewProject(req.user, req.project)) {
        res.status(401)
        return res.send('Not allowed')
    }
    next()
}

function authDeleteProject(req, res, next) {
    if(!canDeleteProject(req.user, req.project)) {
        res.status(401)
        return res.send('Not allowed')
    }
    next()
}
module.exports = router