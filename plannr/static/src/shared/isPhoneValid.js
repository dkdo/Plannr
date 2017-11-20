export function isPhoneValid(inputtxt) {
    var phonenum = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
    if (inputtxt.match(phonenum)) {
        return true;
    }
    else {
        return false;
    }
}
