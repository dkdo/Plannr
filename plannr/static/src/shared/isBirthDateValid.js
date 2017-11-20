export function isBirthDateValid(inputtxt) {
    var birth_date = /^([0-9]{4})\/([0-9]{2})\/([0-9]{2})$/;
    if (inputtxt.match(birth_date)) {
        return true;
    }
    else {
        return false;
    }
}
