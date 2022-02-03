const baseURL = "http://friendidex.xyz/api/";
const ext = ".php";

class User {
    constructor(
        uid,
        firstName,
        lastName,
        password,
        dateCreated,
        dateLastUpdated
    ) {
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.dateCreated = dateCreated;
        this.dateLastUpdated = dateLastUpdated;
    }
}

// handler: function to call once response made
// request: string
// params: Object
// Returns json response, or error
function doRequest(handle, request, params) {
    // make request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", baseURL + request + ext);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (xhr.responseText == "") return null;
            // call handler function
            handle(JSON.parse(xhr.responseText));
        };
        xhr.send(JSON.stringify(params));
    } catch (e) {
        console.log("error:" + e);
        return e;
    }
}

// id: number
function setCookie(id) {
    const mins = 20;
    const date = new Date(Date.now() + mins * 60 * 1000);
    document.cookie = `id=${id};expires=${date.toUTCString()}`;
}

function getID() {
    if (document.cookie.length == 0) {
        return new Error("getID error: cookie doesn't exist");
    }
    const id = document.cookie.split(";")[0].split("=")[1];
    if (!document.cookie || !id) {
        return new Error("getID error: invalid cookie");
    }

    return id;
}

function logout() {
    document.cookie = `id=0;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    window.location.href = "index.html";
}

//! --------------------- API ENDPOINTS ---------------------

// returns: error
function deleteUser(uid, password) {
    const params = {
        password: password,
        uid: uid,
    };

    const resp = doRequest("DeleteUser", params);
    if (!resp) {
        return new Error(resp);
    }

    setCookie(0);
    return null;
}

// returns: User Object
function getUser(uid) {
    const params = {
        uid: uid,
    };

    const resp = doRequest("GetUser", params);
    if (!resp) {
        return new Error(resp);
    }

    return new User(
        uid,
        resp.firstName,
        resp.lastName,
        resp.password,
        resp.dateCreated,
        resp.dateLastUpdated
    );
}

// Returns: contact id (cid)
function createContact(uid, firstName, lastName, email, phone) {
    const params = {
        uid: uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
    };

    const resp = doRequest("CreateContact", params);
    if (!resp) {
        return new Error(resp);
    }

    return resp.cid;
}

// Returns: error
function updateContact(uid, cid, firstName, lastName, email, phone, color) {
    const params = {
        uid: uid,
        cid: cid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        color: color,
    };

    const resp = doRequest("UpdateContact", params);
    if (!resp) {
        return new Error(resp);
    }

    return null;
}

// Returns: error
function deleteContact(uid, cid) {
    const params = {
        uid: uid,
        cid: cid,
    };

    const resp = doRequest("DeleteContact", params);
    if (!resp) {
        return new Error(resp);
    }

    return null;
}

// Returns: ContactStub[]
function searchContacts(uid, query) {
    const params = {
        uid: uid,
        query: query,
    };

    const resp = doRequest("UpdateContact", params);
    if (!resp) {
        return new Error(resp);
    }

    return null;
}

// Returns: Contact
function getContact(uid, cid) {
    const params = {
        uid: uid,
        cid: cid,
    };

    const resp = doRequest("GetContact", params);
    if (!resp) {
        return new Error(resp);
    }

    return null;
}
