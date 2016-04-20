$(document).ready(function () {

    //alert('1');
    //debugger;

    if ($("div").find('input:text').hasClass('DatePicker')) {
        $('.DatePicker').datetimepicker({
            timepicker: false,
            format: 'm/d/Y'
        });
    }
    //debugger;
});