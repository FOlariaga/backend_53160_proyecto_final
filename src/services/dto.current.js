class DTOCurrent {
    constructor(data) {
        this._id = data._id
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.age = data.age
        this.email = data.email            
        this.role = data.role
        this.status = data.status         
    }
}

export default DTOCurrent