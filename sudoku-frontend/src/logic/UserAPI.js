const UserAPI = {
    BASE_URL: "http://localhost:8080/user",

    login(username, authentication) {
        const data = new URLSearchParams();
        data.append("username", username)
        data.append("authentication", authentication)
        return fetch(this.BASE_URL + "/check", {
            method: "POST",
            body: data,
            headers: {
                "Accept": "application/json"
            }
        });
    },

    signup(username, authentication) {
        const data = new URLSearchParams();
        data.append("username", username)
        data.append("authentication", authentication)
        data.append("type", 1)
        return fetch(this.BASE_URL + "/create", {
            method: "POST",
            body: data,
            headers: {
                "Accept": "application/json"
            }
        });
    }
}

export default UserAPI;