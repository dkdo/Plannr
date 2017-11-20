export function isManager(callback) {
    $.ajax({
        type: 'GET',
        url: '/profil/isManager/',
        datatype: 'json',
        cache: false,
        success: function(data){
            callback(data);
        }.bind(this)
    })
}