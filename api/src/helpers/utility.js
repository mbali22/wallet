//Common Functions
function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

const utility = {
    parseToInt: (number) => {
        return parseInt(number);
    },
    FormatToISO8601: (date) => {
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
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
    }
}

export default utility ;
