/// <reference path="../jquery-1.10.2.intellisense.js" />
/// <reference path="../jquery-1.10.2.min.js" />
//$(document).ready(function () {



//}); 

bindUserlistForFilter();


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
    $('#RecordEdit').attr('href', "/Customers/Edit/" + (this.id));
    $('#RecordDetail').attr('href', "/Customers/Details/" + (this.id));
    //$('#RecordDelete').attr('href', "/Customers/Delete/" + (this.id));
     
});

$(document).on("click", "#RecordDelete", function () {

    var ids = "";
    debugger;
    $("#gridBody").find(':checkbox').each(function () {
        debugger;
        if ($(this).prop('checked')) {

            ids = ids + $(this).parent('td').parent('tr').attr('id') + ",";
        }
        else {

        }


    }); // each end block

    if (ids.length >= 2) {
        $.ajax({
            type: "POST",
            url: "/Customers/DeleteMultipleCustomers",
            data: JSON.stringify({ Ids: ids }),
            dataType: "json",
            contentType: "application/Json",
            success: function (data) {
                debugger;

                if (data == "1") {
                    alert("Leads has been deleted successfully!!");
                    location.href = "/Customers/Index";
                }
                else { alert("Please refresh the page again.") }



                //Testing
                console.log("Successfully bind fresh data to GRID");
            },
            error: function (error)
            { debugger; }
        });
    }
    else { alert("Please select any row!"); }



});

$(document).on("click", "#btnSearch", function () {
    ReBindGrid();
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
        else {

        }


    }); // each end block

    if (ids.length >= 2) {
        $("#btnPopUp").trigger('click');



        $.ajax({
            type: "POST", url: "/Users/UserListForDropdown", data: {}, contentType: "application/Json",
            success: function (data) {

                debugger;
                //drpUserList

                var items = "";

                $.each(data, function (index, item) {
                    items += "<option value=" + item.LoginId + ">" + item.Username + "</option>";
                });


                //for (var i = 0; i < data.length; i++) {

                //    htmlContent += "<option value='" + data[i].LoginId + "'> " + data[i].Username + " </option>";
                //}
                $("#drpUserList").empty();
                $("#drpUserList").append("<option value='-1'>--Select Employee--</option>");
                $("#drpUserList").append(items);
                console.log("Successfully bind fresh data to GRID");
            }
        });
    }
    else { alert("Please select any row!"); }

});



$(document).on("click", "#btnproceed", function () {
    var ids = "";
    debugger;

    try {


        $("#gridBody tr").find('td:first').find(':checkbox').each(function () {
            debugger;
            if ($(this).prop('checked')) {
                //alert('check h ');
                ids = ids + $(this).parent('td').parent('tr').attr('id') + ",";
            }
            else {

            }


        }); // each end block

        if (ids.length >= 2) {
            debugger;

            $.ajax({
                //type: "POST", url: "/Customers/AssignedToXEmployees", data: { ids: ids, LoginId: $("#drpUserList :selected").val() }, dataType: "json", contentType: "application/Json", async: true,
                type: "POST", url: "/Customers/AssignedToXEmployees", data: JSON.stringify({ Ids: ids, LoginId: $("#drpUserList :selected").val() }), dataType: "json", contentType: "application/Json",
                success: function (data) {


                    console.log("Successfully bind fresh data to GRID");

                    window.location.href = "/Customers/Index";
                },
                error: function (a, b, c) {
                    debugger;
                }
            });


        }
        else { alert("Please select any row!"); }

    } catch (e) {

        debugger;
    }
});







//function ReBindGrid() {
//    debugger;
//    if ($("#searchFromGrid").val().trim().length > 0) {
//        //$("#gridBody").html("");
//        ajaxCallGet("/Customers/Index", "{'searchString':'" + $("#searchFromGrid").val() + "', }");
//        //,'sortOrder':'Date','currentFilter':'','page':'1'
//    }
//}

//function ajaxCallGet(url, parameter) {
//    //JSON.stringify(parameter)
//    $.ajax({ type: "GET", url: url, data: { searchString: $("#searchFromGrid").val() }, contentType: "application/Json", success: function () { console.log("Successfully bind fresh data to GRID"); } });
//}




function ReBindGrid() {
    debugger;
    //if ($("#searchFromGrid").val().trim().length > 0) {
   // $("#gridBody").html("");

    ajaxCallGet("/Customers/Index", "{searchString:'" + $("#searchFromGrid").val() + "'}");
    //,'sortOrder':'Date','currentFilter':'','page':'1'
    //}
}

function ajaxCallGet(url, parameter) {
    //JSON.stringify(parameter)
   // alert('vijay');
    debugger;
    $.ajax({ type: "GET", url: url, data: { DetailForUserID: parseInt($("#drpUserListFilter").val()), searchString: $("#searchFromGrid").val(), CustomerType: $("#txtCustomerType :selected").val() }, contentType: "application/Json", success: function () { console.log("Successfully bind fresh data to GRID"); } });
}



function bindUserlistForFilter() {

    $.ajax({
        type: "POST", url: "/Users/UserListForDropdown", data: {}, contentType: "application/Json",
        success: function (data) {

            debugger;
            //drpUserList

            var items = "";

            $.each(data, function (index, item) {
                items += "<option value=" + item.LoginId + ">" + item.Username + "</option>";
            });


            //for (var i = 0; i < data.length; i++) {

            //    htmlContent += "<option value='" + data[i].LoginId + "'> " + data[i].Username + " </option>";
            //}
            $("#drpUserListFilter").empty();
            $("#drpUserListFilter").append("<option value='0'>--All Employees--</option>");
            $("#drpUserListFilter").append("<option value='-1' selected='selected'>Mine</option>");
            $("#drpUserListFilter").append(items);
            console.log("Successfully bind fresh data to GRID");
        }
    });
}