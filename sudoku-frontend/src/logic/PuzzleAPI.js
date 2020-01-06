const PuzzleAPI = {
    BASE_URL: "http://localhost:8080/puzzle",

    pullnewproblem(pid, level) {        
        return fetch(this.BASE_URL + "/get", {
            method: "GET",
            headers: {
                "pid"   : pid,
                "level" : level
            }
        });
    },
    
    postsubmit(uid, authentication, pid, passed) {
        const data= new URLSearchParams()
        data.append("uid", uid)
        data.append("authentication", authentication)
        data.append("pid", pid)
        data.append("passed", passed)
        return fetch(this.BASE_URL + "/submit", {
            method: "POST",
            body: data,
            headers: {
                "Accept": "application/json"
            }
        })
    }
}

export default PuzzleAPI;