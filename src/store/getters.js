const getters = {

    token: state => state.user.token,
    roles: state => state.user.roles,
    userRoles: state => state.user.userRoles,
    user: state => state.user.user,
}
export default getters
