/// <reference path="../jquery-1.10.2.intellisense.js" />
/// <reference path="../jquery-1.10.2.min.js" />
//$(document).ready(function () {



//}); 
$("#gridBody").find('tr').hover(function () {
    $(this).addClass('onFoucsIn');
}, function () {
    $(this).removeClass('onFoucsIn');
});

$(document).on("click", "#gridBody tr", function (e) {
    $("#gridBody").find('tr').each(function () {
        $(this).removeClass('onTableTrClicked');
    });
    $(this).addClass('onTableTrClicked');

    console.log('vk');
    $('#RecordEdit').attr('href', "/Potentials/Edit/" + (this.id));
    $('#RecordDetail').attr('href', "/Potentials/Details/" + (this.id));
    $('#RecordDelete').attr('href', "/Potentials/Delete/" + (this.id));

});

$(document).on("click", "#RecordEdit,#RecordDetail,#RecordDelete", function () {

    if ($(this).attr("href") == "#") {
        alert("Please select any row!");
        return false;
    }
});

$(document).on("click", "#AssignedTo", function () {
    var ids = "";
    //debugger;
    $("#gridBody").find(':checkbox').each(function () {
        //debugger;
        if ($(this).prop('checked')) {
            //alert('check h ');
            ids = ids + $(this).parent('td').parent('tr').attr('id') + ",";
        }
        else { }

    }); // each end block

    if (ids.length >= 2) {
        $("#btnPopUp").trigger('click');

        $.ajax({
            type: "POST", url: "/Users/UserListForDropdown", data: {}, contentType: "application/Json",
            success: function (data) {

                var items = "";

                $.each(data, function (index, item) {
                    items += "<option value=" + item.Username + ">" + item.Username + "</option>";
                });

                $("#drpUserList").empty();
                $("#drpUserList").append("<option value='-1'>--Select Employee--</option>");
                $("#drpUserList").append(items);
                console.log("Successfully bind fresh data to GRID");
            }
        });
    }
    else { alert("Please select any row!"); }

});




function ReBindGrid() {
    debugger;
    if ($("#searchFromGrid").val().trim().length > 0) {
        //$("#gridBody").html("");
        ajaxCallGet("/Potentials/Index", "{'searchString':'" + $("#searchFromGrid").val() + "'}");
        //,'sortOrder':'Date','currentFilter':'','page':'1'
    }
}

function ajaxCallGet(url, parameter) {
    //JSON.stringify(parameter)
    $.ajax({ type: "GET", url: url, data: { searchString: $("#searchFromGrid").val() }, contentType: "application/Json", success: function () { console.log("Successfully bind fresh data to GRID"); } });
}