import config from '../config';
//Common Functions
function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

let utility = {
    parseToInt: (number) => {
        return parseInt(number);
    },
    FormatToISO8601: (date) => {    
        let currDate = new Date();    
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(currDate.getHours()) +
            ':' + pad(currDate.getMinutes()) +
            ':' + pad(currDate.getSeconds()) +
            '.' + (currDate.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
            'Z';
    },
    getuniqueId : function(){
        return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
    },
    getDbFormatColumn: function(type,value){
        let formattedValue;
        switch (type) {
            case "N":
                formattedValue = { "N": value };
                break;

            case "S":
                formattedValue = { "S": value };
                break;

            default:
                break;
        }
    },
    getDashboardTypeAmount : (typeTransaction,amount) => {        
        let type;
        switch (typeTransaction) {
            case 1:
            type =  amount;
                break;          
            case 2:
            type =  -amount;
                break;
            case 3:
            type =  amount;
                break;
            case 4:
            type =  -amount;
                break;
            case 5:
            type = amount;
            default:
            type = 0;
                break;
        }        
        return type;
    }
}

export default utility;
