export  const isAdmin =(userInfo)=>{
    if(userInfo.user_type === "Admin" ||userInfo.user_type ==="SysAdm"){
        return true
    }
    return false

}