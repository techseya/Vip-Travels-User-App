const objectToStringList = (obj)=>{
   const keysObject = Object.keys(obj).filter(key => obj[key])
   return keysObject.join(',');
}

export default objectToStringList;