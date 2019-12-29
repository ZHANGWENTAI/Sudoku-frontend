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
    
    postanswer(uid, authentication, pid, ifpass) {
        const data = new URLSearchParams();
        data.append("uid", uid);
        data.append("authentication", authentication);
        data.append("pid", pid);
        data.append("ifpass", ifpass);

        return fetch(this.BASE_URL + "/pass", {
            method: "POST",
            body: data,
            headers: {
                "Accept": "application/json"
            }
        })
    }
}

export default PuzzleAPI;