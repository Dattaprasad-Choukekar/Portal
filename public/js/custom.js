/**
 * Custom JS
 */
$(document).ready(function(){
    value = $("#activeNavbar").val();
    $("#" + value).addClass("active");
});