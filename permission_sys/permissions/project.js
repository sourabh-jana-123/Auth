const { ROLE } = require('../data')

function canViewProject(user, project) {
    return (
        user.role === ROLE.ADMIN || project.userId === user.id
    )
}


function canDeleteProject(user, project) {
    return (
        user.id === project.userId
    )
}

function scopProjects(user, projects) {
    if (user.role === ROLE.ADMIN) return projects
    return projects.filter(project => project.id === user.id)
}

module.exports = {
    canViewProject,
    scopProjects,
    canDeleteProject
}