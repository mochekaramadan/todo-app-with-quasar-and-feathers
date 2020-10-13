export default {
    getters: {
        isAuthenticated: state => {
            return state.isAuth; // code to check if authenticated
        }
    }
}