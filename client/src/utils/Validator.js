import {isValidUsername} from "6pp"

export const UsernameValidator = (username)=>{
    console.log(username);
    if(!isValidUsername(username)){ 
        return { isValid:false, errorMesssage:"UserName Invalid" }
    } 
}