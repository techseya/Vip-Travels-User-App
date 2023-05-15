export const validate = (rules,data)=>{
    const rulesLength = rules.length;
    for(let x = 0 ; x < rulesLength ; x++){
        const ruleData = rules[x].split(':');
        switch (ruleData[1]){
            case 'is_empty':
            if(data[ruleData[0]] == '' || data[ruleData[0]] == null ){
                return `${ruleData[0]} is empty`
            }
            break;
        }
    }
    return true;      
}