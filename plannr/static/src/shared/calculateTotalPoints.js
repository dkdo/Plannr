export function calculateTotalPoints(hours, taken, given) {
    var hours_points = hours * 10;
    var taken_points = taken * 30;
    var given_points = given * 30;

    return hours_points + taken_points - given_points
}
