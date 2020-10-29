import cookie from 'js-cookie';

export const setCookie = (key,value) =>{
    if(window !=='undefined'){
        cookie.set(key,value,{
            expires: 1
        })
    }
}

export const deleteCookie = key => {
    if(window !=='undefined')
    {
        cookie.remove(key,{expires:1})
    }
}

export const getCookie = key => {
    if(window !== 'undefined'){
        return cookie.get(key)
    }
}

export const setLocalStorage = (key,value) => {
    if(window !== 'undefined'){
        localStorage.setItem(key, JSON.stringify(value))
    }
}
 
export const removeLocalStorage = key => {
    if(window!=='undefined'){
        localStorage.removeItem(key)
    }
}

export const authenticate = (response,next) =>{
    setCookie('token',response.data.token)
    setLocalStorage('user',response.data.user)
    next()
}

export const signout = next => {
    deleteCookie('token')
    removeLocalStorage('user')
}

export const isAuthenticated =() =>{
    if(window !== 'undefined'){
        const checkCookie = getCookie('token')
        if(checkCookie){
            if(localStorage.getItem('user')){
                return JSON.parse(localStorage.getItem('user'))
            }
        }
    }
}
