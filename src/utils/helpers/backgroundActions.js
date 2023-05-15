import colors from "src/constants/colors";

export const sleep = time => new Promise(res=>setTimeout(()=>res(),time));

export const requestHireOption = (title,desc,toggle)=>{
    const option = {
        taskName: 'title',
        taskTitle: title,
        taskDesc: desc,
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: colors.GRAY,
        linkingURI: 'viptravels://hireRide',
        parameters: {
            toggle: toggle,
        },
    }
    return option
}