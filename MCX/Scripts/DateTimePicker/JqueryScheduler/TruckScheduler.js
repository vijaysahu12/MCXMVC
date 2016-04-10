/*
	jQuery Document ready
*/
var ActionUrl = "";
(function ($) {
    /*
		store calendar dom into variable
	*/
    var companyId = $('#hdnCompanyId').val();
    if (companyId == 7) {
        ActionUrl = pageResolveUrl + "Common/GetWayBillingList";
        }
    else{
       ActionUrl = pageResolveUrl + "Common/GetJobOrderTrucksList";
    }
    var $truckScheduler = $('#truckScheduler');
    var Id = -1;
    var Trucks = [];
    var JobOrderTrucks = [];
    var AttendanceType = [];
    var Branches = [];
    var path = window.location.pathname;

    if (path.indexOf("AdminDashboard") > 0) {
        $.ajax({
            type: "POST",
            url: pageResolveUrl + "Common/GetAttendanceTypeList",
            data: {},
            dataType: "json",
            async: false,
            success: function (data) {
                if (data != null) {
                    AttendanceType = data;
                }
            },
            error: function (result) {
                //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
        });

        $.ajax({
            type: "POST",
            url: pageResolveUrl + "Branch/GetBranches",
            data: {},
            dataType: "json",
            async: false,
            success: function (data) {
                if (data != null) {
                    Branches = data;
                }
            },
            error: function (result) {
                //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
        });
    }

    $truckScheduler.weekCalendar(
	{
	    branches: Branches,
	    attendanceType: AttendanceType,
	    trucksData: Trucks,
	    jobOrderTrucksData: JobOrderTrucks,
        mapToCompanyId: companyId,
	    /*
			define slot between each hours,
			4 define 4 time slot,
			which indicate 15 minutes,
			2 define 2 times slot,
			which indicate 30 minutes,
			between each hours
		*/
	    timeslotsPerHour: 1,
	    /*
			[boolean | default: false]
			Whether the calendar will allow events to overlap.
			Events will be moved or resized if necessary
			if they are dragged or resized to a location
			that overlaps another calendar event.
		*/
	    allowCalEventOverlap: true,
	    /*
			[boolean | default: false]
			If true,
			events that overlap will be rendered separately without any overlap.
		*/
	    overlapEventsSeparate: true,
	    /*
			[integer | default: 0]
			Determines what day of the week to start on.
			0 = sunday, 1 = monday etc
		*/
	    firstDayOfWeek: 1,
	    /*
			[object | default:
			{start: 8, end: 18, limitDisplay: false}]
			An object that specifies which hours within the day to render as
		*/
	    businessHours: { start: 0, end: Trucks.length, limitDisplay: true },
	    /*
			[integer | default: 7]
			Determines how many days to show.
			Note that next/prev weekly navigation is still
			based on weeks rather than the number of days displaying
		*/
	    daysToShow: 7,
	    /*
			A function that can return a height in pixels for the calendar.
			If the height of the calendar is less than the space it takes to render it,
			the calendar will scroll within the timeslot
			region while the day column headers will remain fixed
		*/
	    height: function ($truckScheduler) {
	        return $(window).height() - $("h1").outerHeight() - 1 - 225;
	    },
	    /*
			Called prior to rendering an event.
			Allows modification of the eventElement
			or the ability to return a different element
		*/
	    eventRender: function (calEvent, $event) {
	        if (calEvent.end.getTime() < new Date().getTime()) {
	            $event.css("backgroundColor", "#aaa");
	            $event.find(".wc-time").css({
	                "backgroundColor": "#999",
	                "border": "1px solid #888"
	            });
	        }
	    },
	    /*
			Called on each event to determine whether
			it should be draggable or not.
			Default function returns true on all events.
		*/
	    draggable: function (calEvent, $event) {
	        return calEvent.readOnly != true;
	    },
	    /*
			Called on each event to determine whether
			it should be resizable or not.
			Default function returns true on all events.
		*/
	    resizable: function (calEvent, $event) {
	        return calEvent.readOnly != true;
	    },
	    /*
			Called on creation of a new calendar event
		*/
	    eventNew: function (calEvent, $event) {
	        /*
				we are creating dialog box,
				which will be shown when event is selected.
			*/

	        if (path.indexOf("AdminDashboard") > 0) {
	        }
	        else {
	            $truckScheduler.weekCalendar("removeUnsavedEvents");
	            //$("#divSuccess").html("Access denied! You cannot create a schedule in this mode.");
	            //ShowErrorMessageModel();
	            ShowNotificationAlert("Access denied! You cannot create a schedule in this mode.", "error");
	            $(".noty_message").fadeOut(5000);
	            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	            e.stopImmediatePropagation();
	            return false;
	        }

	        var $dialogContent = $("#eventEditTruckSchedulerContainer");
	        resetForm($dialogContent);
	        var startField = $dialogContent.find("input[name='start']");
	        var endField = $dialogContent.find("input[name='end']");
	        var titleField = $dialogContent.find("input[name='txtTitle']");
	        var bodyField = $dialogContent.find("textarea[name='txtBody']");
	        var userField = $dialogContent.find("select[name='ddlTruckTypeId']");
	        var attendanceField = $dialogContent.find("select[name='ddlAttendanceValue']");

	        $dialogContent.dialog(
			{
			    modal: true,
			    title: "Attendance Event",
			    close: function () {
			        $dialogContent.dialog("destroy");
			        $dialogContent.hide();
			        $('#truckScheduler').weekCalendar("removeUnsavedEvents");
			    },
			    buttons:
				{
				    save: function () {
				        calEvent.id = Id;
				        calEvent.end = new Date($dialogContent.find("input[name='start']").val());//startField.val();
				        calEvent.end = new Date($dialogContent.find("input[name='end']").val());//endField.val();
				        calEvent.txtTitle = titleField.val();
				        calEvent.txtBody = bodyField.val();
				        calEvent.ddlTruckTypeId = userField.val();
				        calEvent.ddlAttendanceValue = attendanceField.val();

				        if (calEvent.ddlTruckTypeId == "" || calEvent.ddlTruckTypeId == null) {
				            //$("#divSuccess").html("Please select Truck Type");
				            //ShowErrorMessageModel();
				            ShowNotificationAlert("Please select Truck Type", "alert");
				            $(".noty_message").fadeOut(5000);
				            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 4000);
				            return false;
				        }
				        if (calEvent.ddlAttendanceValue == "" || calEvent.ddlAttendanceValue == null) {
				            //$("#divSuccess").html("Please select Status");
				            //ShowErrorMessageModel();
				            ShowNotificationAlert("Please select Status", "alert");
				            $(".noty_message").fadeOut(5000);
				            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 4000);
				            return false;
				        }
				        if (/^[a-zA-Z0-9- ]*$/.test(calEvent.txtTitle) == false || /^[a-zA-Z0-9- ]*$/.test(calEvent.txtBody) == false) {
				            //$("#divSuccess").html("Oops! You have entered wrong text. Please provide a valid input in the fields.");
				            //ShowErrorMessageModel();
				            ShowNotificationAlert("Oops! You have entered wrong text. Please provide a valid input in the fields.", "error");
				            $(".noty_message").fadeOut(5000);
				            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
				            return false;
				        }

				        $.ajax({
				            type: "POST",
				            url: pageResolveUrl + "Common/SaveTruckTypeAttendance",
				            data: { attendanceId: 0, truckTypeId: userField.val(), attendanceTypeId: attendanceField.val(), subject: titleField.val(), attendanceComment: bodyField.val(), attendanceDate: $.datepicker.formatDate("M/dd/yy", new Date(calEvent.end)) },
				            dataType: "json",
				            success: function (data) {
				                if (data.Status > 0) {
				                    calEvent.id = data.Status;
				                    $truckScheduler.weekCalendar("removeUnsavedEvents");
				                    $truckScheduler.weekCalendar("updateEvent", calEvent);
				                    //$("#divSuccess").html("Information saved successfully.");
				                    //ShowMessageModel();
				                    ShowNotificationAlert("Information saved successfully.", "success");
				                    $(".noty_message").fadeOut(5000);
				                    setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
				                }
				            },
				            error: function (result) {
				                //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
				                //ShowErrorMessageModel();
				                ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
				                $(".noty_message").fadeOut(5000);
				                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
				            }
				        });

				        $dialogContent.dialog("close");
				    },
				    cancel: function () {
				        $dialogContent.dialog("close");
				    }
				}
			}).show();

	        startField.val(calEvent.end);
	        endField.val(calEvent.end);
	        $dialogContent.find(".dateHolder").text($truckScheduler.weekCalendar("newFormatDate", calEvent.end));
	        // setupStartAndEndTimeFields(startField, endField, calEvent, $truckScheduler.weekCalendar("getTimeslotTimes", calEvent.start));
	        setupStartAndEndTimeFields_New(userField, attendanceField, calEvent, $truckScheduler.weekCalendar("getTimeslotTimes", calEvent.end));

	        userField.val(calEvent.ddlTruckTypeId);
	        attendanceField.val(calEvent.ddlAttendanceValue);
	    },
	    /*
			Called on click of a calendar event
		*/
	    eventClick: function (calEvent, $event) {
	        if (calEvent.readOnly) {
	            return;
	        }
	        /*
            calling dialog box with events data filled in.
	    	*/	       
	        if (path.indexOf("AdminDashboard") > 0) {
	        }
	        else {
	            $truckScheduler.weekCalendar("removeUnsavedEvents");
	            //$("#divSuccess").html("Access denied! You cannot create a shcedule in this mode.");
	            //ShowErrorMessageModel();
	            ShowNotificationAlert("Access denied! You cannot create a shcedule in this mode.", "error");
	            $(".noty_message").fadeOut(5000);
	            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	            e.stopImmediatePropagation();
	            return false;
	        }

	        var $dialogContent = $("#eventEditTruckSchedulerContainer");
	        resetForm($dialogContent);
	        var startField = $dialogContent.find("input[name='start']");
	        var endField = $dialogContent.find("input[name='end']");
	        var titleField = $dialogContent.find("input[name='txtTitle']").val(calEvent.txtTitle);
	        var bodyField = $dialogContent.find("textarea[name='txtBody']");
	        bodyField.val(calEvent.txtBody);
	        var userField = $dialogContent.find("select[name='ddlTruckTypeId']");
	        var attendanceField = $dialogContent.find("select[name='ddlAttendanceValue']");
	        //$('#truckScheduler').multiselect.add(e);
	        $dialogContent.dialog(
	    	{                
	    	    modal: true,
	    	    title: "Edit - " + calEvent.txtTitle,
	    	    close: function () {
	    	        $dialogContent.dialog("destroy");
	    	        $dialogContent.hide();
	    	        $('#truckScheduler').weekCalendar("removeUnsavedEvents");
	    	    },
	    	    buttons:
	    		{
	    		    save: function () {
	    		        calEvent.end = new Date($dialogContent.find("input[name='start']").val());//startField.val();
	    		        calEvent.end = new Date($dialogContent.find("input[name='end']").val());//endField.val();
	    		        calEvent.txtTitle = titleField.val();
	    		        calEvent.txtBody = bodyField.val();
	    		        calEvent.ddlTruckTypeId = userField.val();
	    		        calEvent.ddlAttendanceValue = attendanceField.val();

	    		        if (calEvent.ddlTruckTypeId == "" || calEvent.ddlTruckTypeId == null) {
	    		            //$("#divSuccess").html("Please select Truck Type");
	    		            //ShowErrorMessageModel();
	    		            ShowNotificationAlert("Please select Truck Type", "alert");
	    		            $(".noty_message").fadeOut(5000);
	    		            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	    		            return false;
	    		        }
	    		        if (calEvent.ddlAttendanceValue == "" || calEvent.ddlAttendanceValue == null) {
	    		            //$("#divSuccess").html("Please select Status");
	    		            //ShowErrorMessageModel();
	    		            ShowNotificationAlert("Please select Status", "alert");
	    		            $(".noty_message").fadeOut(5000);
	    		            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	    		            return false;
	    		        }

	    		        $.ajax({
	    		            type: "POST",
	    		            url: pageResolveUrl + "Common/SaveTruckTypeAttendance",
	    		            data: { attendanceId: calEvent.id, truckTypeId: userField.val(), attendanceTypeId: attendanceField.val(), subject: titleField.val(), attendanceComment: bodyField.val(), attendanceDate: $.datepicker.formatDate("M/dd/yy", new Date(calEvent.end)) },
	    		            dataType: "json",
	    		            success: function (data) {
	    		                if (data.Status > 0) {
	    		                    calEvent.id = data.Status;
	    		                    $truckScheduler.weekCalendar("removeUnsavedEvents");
	    		                    $truckScheduler.weekCalendar("updateEvent", calEvent);
	    		                    //$("#divSuccess").html("Information updated successfully.");
	    		                    //ShowMessageModel();
	    		                    ShowNotificationAlert("Information updated successfully.", "success");
	    		                    $(".noty_message").fadeOut(5000);
	    		                    setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	    		                }
	    		            },
	    		            error: function (result) {
	    		                //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
	    		                //ShowErrorMessageModel();
	    		                ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
	    		                $(".noty_message").fadeOut(5000);
	    		                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	    		            }
	    		        });

	    		        $dialogContent.dialog("close");
	    		    },
	    		    "delete": function () {

	    		        $.ajax({
	    		            type: "POST",
	    		            url: pageResolveUrl + "Common/DeleteTruckTypeAttendance",
	    		            data: { attendanceId: calEvent.id },
	    		            dataType: "json",
	    		            success: function (data) {
	    		                if (data.Status > 0) {
	    		                    $truckScheduler.weekCalendar("removeEvent", calEvent.id);
	    		                    //$("#divSuccess").html("Information deleted successfully.");
	    		                    //ShowMessageModel();
	    		                    ShowNotificationAlert("Information deleted successfully.", "success");
	    		                    $(".noty_message").fadeOut(5000);
	    		                    setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	    		                }
	    		            },
	    		            error: function (result) {
	    		                //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
	    		                //ShowErrorMessageModel();
	    		                ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
	    		                $(".noty_message").fadeOut(5000);
	    		                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	    		            }
	    		        });

	    		        $dialogContent.dialog("close");
	    		    },
	    		    cancel: function () {
	    		        $dialogContent.dialog("close");
	    		    }
	    		}
	    	}).show();

	        startField.val(calEvent.end);
	        endField.val(calEvent.end);

	        $dialogContent.find(".dateHolder").text($truckScheduler.weekCalendar("newFormatDate", calEvent.end));
	        setupStartAndEndTimeFields_New(userField, attendanceField, calEvent, $truckScheduler.weekCalendar("getTimeslotTimes", calEvent.end));

	        userField.val(calEvent.ddlTruckTypeId);
	        attendanceField.val(calEvent.ddlAttendanceValue);

	        $(window).resize().resize(); //fixes a bug in modal overlay size ??
	    },

	    data: function (start, end, branchId, callback) {

	        callback(getEventData(start, end, branchId));
	    },

	    GetTrucks: function (branchId) {

	        if (branchId != -1) {
	            Trucks = [];
	            $.ajax({
	                type: "GET",
	                url: pageResolveUrl + "Common/GetTruckTypeList",
	                data: { branchId: branchId },
	                dataType: "json",
	                async: false,
	                success: function (data) {
	                    if (data != null) {
	                        Trucks = data;
	                    }
	                },
	                error: function (result) {
	                    //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
	                    //ShowErrorMessageModel();
	                    ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
	                    $(".noty_message").fadeOut(5000);
	                    setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	                }
	            });
	            return Trucks;
	        }
	    },

	    GetJobOrderTrucks: function (branchId, date) {
	        if (branchId != -1) {
	            JobOrderTrucks = [];
	            $.ajax({
	                type: "GET",
	                url: ActionUrl,
	                data: { dateTo: date, branchId: branchId },
	                dataType: "json",
	                async: false,
	                success: function (data) {
	                    if (data != null) {
	                        JobOrderTrucks = data;
	                    }
	                },
	                error: function (result) {
	                    //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
	                    //ShowErrorMessageModel();
	                    ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
	                    $(".noty_message").fadeOut(5000);
	                    setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	                }
	            });
	            return JobOrderTrucks;
	        }
	    }
	});

    function resetForm($dialogContent) {
        $dialogContent.find("input").val("");
        $dialogContent.find("textarea").val("");
    }

    /*
		* Sets up the start and end time fields in the calendar event
		* form for editing based on the calendar event being edited
    */
    function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes) {
        for (var i = 0; i < timeslotTimes.length; i++) {
            var startTime = timeslotTimes[i].start;
            var endTime = timeslotTimes[i].end;
            var startSelected = "";
            if (startTime.getTime() === calEvent.end.getTime()) {
                startSelected = "selected=\"selected\"";
            }
            var endSelected = "";
            if (endTime.getTime() === calEvent.end.getTime()) {
                endSelected = "selected=\"selected\"";
            }
            $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotTimes[i].startFormatted + "</option>");
            $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotTimes[i].endFormatted + "</option>");
        }

        $endTimeOptions = $endTimeField.find("option");
        $startTimeField.trigger("change");
    }
    
    function setupStartAndEndTimeFields_New($startTimeField, $endTimeField, calEvent, timeslotTimes) {
        $startTimeField.html('');
        $endTimeField.html('');
        $startTimeField.append("<option value=\"\">Select Truck</option>");
        $endTimeField.append("<option value=\"\">Select Status</option>");

        $.each(Trucks, function (i, values) {
            $startTimeField.append("<option value=\"" + values.TruckTypeId + "\">" + values.TruckTypeName + "</option>");
        });
        $.each(AttendanceType, function (i, values) {
            $endTimeField.append("<option value=\"" + values.AttendanceTypeId + "\">" + values.AttendanceType + "</option>");
        });
    }

    function getEventData(start, end, branchId) {
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        var response = [];
        if (branchId != -1) {
            $.ajax({
                type: "POST",
                url: pageResolveUrl + "Common/GetTruckTypeAttendance",
                data: { weekStartDate: $.datepicker.formatDate("M/dd/yy", new Date(start)), weekEndDate: $.datepicker.formatDate("M/dd/yy", new Date(end)), branchId: branchId },
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data != null) {
                        response = data;
                    }
                },
                error: function (result) {
                    //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
                    //ShowErrorMessageModel();
                    ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
                    $(".noty_message").fadeOut(5000);
                    setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
                }
            });
        }
        return response;
    }
})(jQuery);

/*! Function is used to open job details pop up */
function openJobDetailsPopUp(ctrl, ticket) {
    $.ajax({
        type: "GET",
        url: pageResolveUrl+'JobOrder/OpenJobDetailsPopUp',
        data: { ticketNo: ticket },
        dataType: "json",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            //data - response from server
            if (data != undefined && data != null) {
                $("#jobDetails").html(data);
                $("#jobDetails").dialog({
                    modal: true,
                    zIndex: 50,
                    autoOpen: false,
                    draggable: false,
                    title: "Job Order Details",
                    height: 450,
                    width: 1130,
                    closeOnEscape: false,
                    resizable: false,
                    scrollbar: true
                });
                $('#jobDetails').dialog("open");
            }
            else {
                //$("#divSuccess").html("Sorry! Details preview is not available at this moment.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Sorry! Details preview is not available at this moment.", "error");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //$("#divSuccess").html("Some error found! Please try again, We appriciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appriciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function openMasterBillingDetails(ctrl, bType, cId, tNo) {
    $.ajax({
        type: "GET",
        url: pageResolveUrl + "WayBilling/OpenMasterBillingPopUp",
        data: { customerId: cId, billingType: bType, transactionNo: tNo },
        dataType: "json",
        contentType: "application/json",
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (data, textStatus, jqXHR) {
            //data - response from server
            if (data != undefined && data != null) {
                $("#masterBillingPopUp").html(data);
                $("#masterBillingPopUp").dialog({
                    modal: true,
                    zIndex: 50,
                    autoOpen: false,
                    draggable: false,
                    title: "Master Billing",
                    height: 450,
                    width: 1200,
                    closeOnEscape: false,
                    resizable: false,
                    scrollbar: true
                });
                $('#masterBillingPopUp').dialog("open");
            }
            else {
                //$("#divSuccess").html("An error occurred while opening master billing pop up.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("An error occurred while opening master billing pop up.", "error");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //$("#divSuccess").html("Some error found! Please try again, We appriciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appriciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function exportToAccountingSoftware(ctrl, tNo) {
    $('#hdnTransactionNo').val(tNo);
    $("#ftpDetailsInputPopUp").dialog({
        zIndex: 50,
        autoOpen: false,
        draggable: true,
        title: "FTP Details Input Form",
        height: 290,
        width: 690,
        closeOnEscape: false,
        resizable: false,
        scrollbar: true
    });
    $('#ftpDetailsInputPopUp').dialog("open");
}

function exportToRemoteLocation() {
    $.ajax({
        type: "GET",
        url: pageResolveUrl + "WayBilling/ExportTransactionFile",
        data: {
            transactionNo: $('#hdnTransactionNo').val(),
            ftpUrl: $('#txtFtpUrl').val(),
            port: $('#txtPort').val(),
            relativePath: $('#txtRelativeDirPath').val(),
            userName: $('#txtUserName').val(),
            password: $('#txtPassword').val()
        },
        dataType: "json",
        contentType: "application/json",
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (data, textStatus, jqXHR) {
            //data - response from server
            if (data != undefined && data != null) {
               // alert(data);
                if (data == "0") {
                    $('#spnMessage').text("An error occured, while uploading file. Please try again.").css('display', 'inline').delay(3000).fadeOut();
                }
                if (data == "-1") {
                    $('#spnMessage').text("File has been uploaded succesffuly but An exception occured while updating record.").css('display', 'inline').delay(3000).fadeOut();
                }
                if (data == "11") {
                    $('#spnMessage').text("Sorry! You can not upload same file again.").css('display', 'inline').delay(3000).fadeOut();
                }
                else if (data == "200") {
                    $('#spnMessage').text("File has been uploaded to remote location successfully.").css('display', 'inline').delay(3000).fadeOut();
                    resetFtpInputFields();
                }
                else if (data == "226") {
                    $('#spnMessage').text("File transfer completed successfully.").css('display', 'inline').delay(3000).fadeOut();
                    resetFtpInputFields();
                }
                else if (data == "550") {
                    $('#spnMessage').text("Upload failed! File doesn't exist.").css('display', 'inline').delay(3000).fadeOut();
                }
                else {//Not logged in
                    $('#spnMessage').text("Authentication failed! Please check the credentials provided in request.").css('display', 'inline').delay(3000).fadeOut();
                }
            }
            else {
                $('#spnMessage').text("An error occurred while exporting transaction file to the remote server.").css('display', 'inline').delay(3000).fadeOut();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#spnMessage').text("Some error found! Please try again, We appriciate your patience.").css('display', 'inline').delay(3000).fadeOut();
        }
    });
}

function goToWayBillingList(ctrl, tNo) {
    validNavigation = true;
    $(location).attr('href', pageResolveUrl + 'WayBilling');
}

function resetFtpInputFields() {
    $('input[type=text]').each(function () {
        $(this).val('');
    });
}

/* Functions used to update the values of job Order in Pop-up */
function openEditJobDetailsPopUp(ctrl, id) {
    $("#flag").val('EditJobDetails');
    $.ajax({
        type: "POST",
        url: pageResolveUrl + "JobOrder/OpenEditJobDetailsPopUp",
        data: { jobOrderId: id },
        dataType: "json",
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (data, textStatus, jqXHR) {
            //debugger;
            var flag;
            if (data != undefined && data != null) {
                $("#editjobDetails").html(data);
                $("#editjobDetails").dialog({
                    modal: true,
                    zIndex: 57,
                    autoOpen: false,
                    draggable: false,
                    title: "Edit Job Order Details",
                    height: 400,
                    width: 1050,
                    closeOnEscape: false,
                    resizable: false,
                    scrollbar: true
                });

                $('#editjobDetails').dialog("open");
                UbindBranches();
                UbindDispatchers();
                UbindTruckTypes();
                UbindSwampers();
                UbindDrivers();
                UbindUnit();
                //alert($("#flag").val());
                flag = $("#flag").val();
                binddropdownPopup(id, flag);
            }
            else {
                //$("#divSuccess").html("Sorry! Details preview is not available at this moment.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Sorry! Details preview is not available at this moment.", "error");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //alert(45);
            //$("#divSuccess").html("Some error found! Please try again, We appriciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appriciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function openEditDepartureDetailsPopUp(ctrl, id) {
    $("#flag").val('EditDepartureDetails');
    $.ajax({
        type: "POST",
        url: pageResolveUrl + "JobOrder/openEditDepartureDetailsPopUp",
        data: { jobOrderId: id },
        dataType: "json",
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (data, textStatus, jqXHR) {
            //debugger;
            //alert($("#flag").val());
            //data - response from server
            var flag;
            if (data != undefined && data != null) {
                $("#editDepartureDetails").html(data);
                $("#editDepartureDetails").dialog({
                    modal: true,
                    zIndex: 57,
                    autoOpen: false,
                    draggable: false,
                    title: "Edit Job Order Departure Details",
                    height: 400,
                    width: 1050,
                    closeOnEscape: false,
                    resizable: false,
                    scrollbar: true
                });

                $('#editDepartureDetails').dialog("open");
                UbindCountry();
                UbindStates();
                //UbindCities();
                flag = $("#flag").val();
                bindDeparturedropdownPopup(id, flag);
            }
            else {
                //$("#divSuccess").html("Sorry! Details preview is not available at this moment.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Sorry! Details preview is not available at this moment.", "error");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //alert(45);
            //$("#divSuccess").html("Some error found! Please try again, We appriciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appriciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function openEditArrivalDetailsPopUp(ctrl, id) {
    $("#flag").val('EditArrivalDetails');
    $.ajax({
        type: "POST",
        url: pageResolveUrl + "JobOrder/openEditArrivalDetailsPopUp",
        data: { jobOrderId: id },
        dataType: "json",
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (data, textStatus, jqXHR) {
            //debugger;
            //data - response from server

            if (data != undefined && data != null) {
                $("#editArrivalDetails").html(data);
                $("#editArrivalDetails").dialog({
                    modal: true,
                    zIndex: 57,
                    autoOpen: false,
                    draggable: false,
                    title: "Edit Job Order Arrival Details",
                    height: 400,
                    width: 1050,
                    closeOnEscape: false,
                    resizable: false,
                    scrollbar: true
                });

                $('#editArrivalDetails').dialog("open");
                AbindCountry();
                AbindStates();
                //AbindCities();
                var flag = $("#flag").val();
                bindArrivaldropdownPopup(id, flag);
            }
            else {
                //$("#divSuccess").html("Sorry! Details preview is not available at this moment.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Sorry! Details preview is not available at this moment.", "error");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //alert(45);
            //$("#divSuccess").html("Some error found! Please try again, We appriciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appriciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function openEditLoadDetailsPopUp(ctrl, id) {
    $("#flag").val('EditLoadDetails');
    $.ajax({
        type: "POST",
        url: pageResolveUrl + "JobOrder/openEditLoadDetailsPopUp",
        data: { jobOrderId: id },
        dataType: "json",
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (data, textStatus, jqXHR) {
            //debugger;
            //data - response from server

            if (data != undefined && data != null) {
                $("#editLoadDetails").html(data);
                $("#editLoadDetails").dialog({
                    modal: true,
                    zIndex: 57,
                    autoOpen: false,
                    draggable: false,
                    title: "Edit Job Order Load Details",
                    height: 300,
                    width: 1050,
                    closeOnEscape: false,
                    resizable: false,
                    scrollbar: true
                });

                $('#editLoadDetails').dialog("open");
                flag = $("#flag").val();
                bindLoaddropdownPopup(id, flag);
            }
            else {
                //$("#divSuccess").html("Sorry! Details preview is not available at this moment.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Sorry! Details preview is not available at this moment.", "error");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //alert(45);
            //$("#divSuccess").html("Some error found! Please try again, We appriciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appriciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function openEditNotifiDetailsPopUp(ctrl, id) {
    $("#flag").val('EditNotifiDetails');
    $.ajax({
        type: "POST",
        url: pageResolveUrl + "JobOrder/openEditNotifiDetailsPopUp",
        data: { jobOrderId: id },
        dataType: "json",
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (data, textStatus, jqXHR) {
            //debugger;
            //data - response from server

            if (data != undefined && data != null) {
                $("#editNotifiDetails").html(data);
                $("#editNotifiDetails").dialog({
                    modal: true,
                    zIndex: 57,
                    autoOpen: false,
                    draggable: false,
                    title: "Edit Job Order Notification Details",
                    height: 400,
                    width: 1050,
                    closeOnEscape: false,
                    resizable: false,
                    scrollbar: true
                });

                $('#editNotifiDetails').dialog("open");
                //NbindTrailers()
                //NbindTrailers2()
                //NbindTrailers3();
                var flag = $("#flag").val();
                bindNotifidropdownPopup(id, flag);
            }
            else {
                //$("#divSuccess").html("Sorry! Details preview is not available at this moment.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Sorry! Details preview is not available at this moment.", "error");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //alert(45);
            //$("#divSuccess").html("Some error found! Please try again, We appriciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appriciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function binddropdownPopup(id, flag) {
    //alert(flag);
    $.ajax({
        type: "POST",
        url: pageResolveUrl + "JobOrder/GetJobOrderDetailsById",
        data: { jobOrderId: id, flag: flag },
        dataType: "json",
        async: false,
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (result) {
            // debugger;
            if (result != undefined && result != null) {
                //alert(result.TimeOnLocation);                
                $("#UBranchId").data("kendoDropDownList").value(result.BranchId);
                $("#UDispatcherId").data("kendoDropDownList").value(result.DispatcherId);
                $("#UDriverId").data("kendoDropDownList").value(result.DriverId);
                $("#USwamperId").data("kendoDropDownList").value(result.SwamperId);
                $("#UTypeOfTruckId").data("kendoDropDownList").value(result.TruckId);
                $("#UTruckNo").data("kendoDropDownList").value(result.TypeOfTruckId);
                $("#UJobOrderName").val(result.JobOrderName);
                $("#UTimeOnLocation").val(result.TimeOnLocation);
            }
        },
        error: function (result) {
            // debugger;
            //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function bindDeparturedropdownPopup(id, flag) {
    $.ajax({
        type: "POST",
        url: pageResolveUrl + "JobOrder/GetJobOrderDetailsById",
        data: { jobOrderId: id, flag: flag },
        dataType: "json",
        async: false,
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (result) {
           // debugger;
            if (result != undefined && result != null) {
                //alert(result.DepartureCityName);
                $("#UDepartureCountryId").data("kendoDropDownList").value(result.DepartureCountryId);
                $("#UDepartureStateId").data("kendoDropDownList").value(result.DepartureStateId);
                $("#UDepartureCity").val(result.DepartureCityName);
                $("#UDepartureCompanyName").val(result.DepartureCompanyName);
                $("#UDepartureContactName").val(result.DepartureContactName);
                $("#UDeparturePhone").val(result.DeparturePhone);
                $("#UDepartureAlternatePhone").val(result.DepartureAlternatePhone);
                $("#UDepartureAddress").val(result.DepartureAddress);
                $("#UDeparturePostalCode").val(result.DeparturePostalCode);
                $("#UDepartureRigNumber").val(result.DepartureRigNumber);
            }
        },
        error: function (result) {
            // debugger;
            //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function bindArrivaldropdownPopup(id, flag) {
    $.ajax({
        type: "POST",
        url: pageResolveUrl + "JobOrder/GetJobOrderDetailsById",
        data: { jobOrderId: id, flag: flag },
        dataType: "json",
        async: false,
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (result) {
            //debugger;
            if (result != undefined && result != null) {
                //alert(result.ArrivalCountryId);                
                $("#UArrivalCountryId").data("kendoDropDownList").value(result.ArrivalCountryId);
                $("#UArrivalStateId").data("kendoDropDownList").value(result.ArrivalStateId);
                $("#UArrivalCity").val(result.ArrivalCityName);
                $("#UArrivalCompanyName").val(result.ArrivalCompanyName);
                $("#UArrivalContactName").val(result.ArrivalContactName);
                $("#UArrivalPhone").val(result.ArrivalPhone);
                $("#UArrivalAlternatePhone").val(result.ArrivalAlternatePhone);
                $("#UArrivalAddress").val(result.ArrivalAddress);
                $("#UArrivalPostalCode").val(result.ArrivalPostalCode);
                $("#UArrivalRigNumber").val(result.ArrivalRigNumber);
            }
        },
        error: function (result) {
            //debugger;
            //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function bindLoaddropdownPopup(id, flag) {
    $.ajax({
        type: "POST",
        url: pageResolveUrl + "JobOrder/GetJobOrderDetailsById",
        data: { jobOrderId: id, flag: flag },
        dataType: "json",
        async: false,
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (result) {
            // debugger;
            if (result != undefined && result != null) {
                //alert(result); 
                $("#UWeight").val(result.Weight);
                $("#UHeight").val(result.Height);
                $("#UWidth").val(result.Width);
                $("#ULength").val(result.Length);
                $("#ULoadDescription").val(result.LoadDescription);
            }
        },
        error: function (result) {
            // debugger;
            //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function bindNotifidropdownPopup(id, flag) {
    $.ajax({
        type: "POST",
        url: pageResolveUrl + "JobOrder/GetJobOrderDetailsById",
        data: { jobOrderId: id, flag: flag },
        dataType: "json",
        async: false,
        beforeSend: function () {
            showProgress();
        },
        complete: function () {
            hideProgress();
        },
        success: function (result) {
            // debugger;
            if (result != undefined && result != null) {
                //alert(result);                
                $("#UTrailerNo").val(result.TrailerNo);
                $("#UTrailer2No").val(result.Trailer2No);
                $("#UTrailer3No").val(result.Trailer3No);
                $("#UTrailerTypeDesc").val(result.TrailerTypeDesc);
                $("#UTrailerType2Desc").val(result.TrailerType2Desc);
                $("#UTrailerType3Desc").val(result.TrailerType3Desc);
                $("#UIsJobCompleted").val(result.IsJobCompleted);
                $("#UIsOrderCancel").val(result.IsOrderCancel);
                $("#UDescription").val(result.Description);
                $("#UDirection").val(result.Direction);
                $("#ULSD").val(result.LSD);
            }
        },
        error: function (result) {
            //  debugger;
            //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}

function UbindCountry() {
    if ($("#UDepartureCountryId") != null) {
        var UDepartureCountryId = $("#UDepartureCountryId").kendoDropDownList({
            autoBind: true,
            optionLabel: {
                CountryName: "Canada",
                CountryId: 43
            },
            dataTextField: "CountryName",
            dataValueField: "CountryId",
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: {
                        dataType: "json",
                        url: pageResolveUrl + "Company/GetCountryList",
                    }
                }
            }
        }).data("kendoDropDownList");
    }

}

function UbindStates() {
    var UDepartureStateId = $("#UDepartureStateId").kendoDropDownList({
        autoBind: false,
        cascadeFrom: "UDepartureCountryId",
        dataTextField: "StateName",
        dataValueField: "StateId",
        optionLabel: "--Select--",
        dataSource: {
            serverFiltering: true,
            transport: {
                read: {
                    dataType: "json",
                    url: pageResolveUrl + "Company/GetStates",
                    data: function () {
                        return { CountryId: $("#UDepartureCountryId").val() };
                    }
                }
            }
        }
    }).data("kendoDropDownList");
}

function AbindCountry() {
    if ($("#UArrivalCountryId") != null) {
        var UArrivalCountryId = $("#UArrivalCountryId").kendoDropDownList({
            autoBind: true,
            optionLabel: {
                CountryName: "Canada",
                CountryId: 43
            },
            dataTextField: "CountryName",
            dataValueField: "CountryId",
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: {
                        dataType: "json",
                        url: pageResolveUrl + "Company/GetCountryList",
                    }
                }
            }
        }).data("kendoDropDownList");
    }

}

function AbindStates() {
    var UArrivalStateId = $("#UArrivalStateId").kendoDropDownList({
        autoBind: false,
        cascadeFrom: "UArrivalCountryId",
        dataTextField: "StateName",
        dataValueField: "StateId",
        optionLabel: "--Select--",
        dataSource: {
            serverFiltering: true,
            transport: {
                read: {
                    dataType: "json",
                    url: pageResolveUrl + "Company/GetStates",
                    data: function () {
                        return { CountryId: $("#UArrivalCountryId").val() };
                    }
                }
            }
        }
    }).data("kendoDropDownList");
}

function UbindBranches() {
    //alert(1);
    var UBranchId = $("#UBranchId").kendoDropDownList({
        autoBind: true,
        cascadeFrom: "CompanyId",
        dataTextField: "BranchName",
        dataValueField: "BranchId",
        optionLabel: "--Select--",
        dataSource: {
            serverFiltering: true,
            transport: {
                read: {
                    dataType: "json",
                    url: pageResolveUrl + "User/GetBranches",
                    data: function () {
                        return { CompanyId: null };
                    }
                }
            }
        }
    }).data("kendoDropDownList");
}

function UbindDispatchers() {
    var UDispatcherId = $("#UDispatcherId").kendoDropDownList({
        autoBind: true,
        optionLabel: "--Select--",
        dataTextField: "UserName",
        dataValueField: "UserId",
        dataSource: {
            serverFiltering: true,
            transport: {
                read: {
                    dataType: "json",
                    url: pageResolveUrl + "User/GetDispatcherList",
                    data: function () {
                        return { CompanyId: null, BranchId: null };
                    }
                }
            }
        }
    }).data("kendoDropDownList");
}

function UbindSwampers() {
    //alert(1);
    var USwamperId = $("#USwamperId").kendoDropDownList({
        autoBind: true,
        optionLabel: "--Select--",
        dataTextField: "UserName",
        dataValueField: "UserId",
        dataSource: {
            serverFiltering: true,
            transport: {
                read: {
                    dataType: "json",
                    url: pageResolveUrl + "User/GetSwamperList",
                    data: function () {
                        return { CompanyId: null, BranchId: null };
                    }
                }
            }
        }
    }).data("kendoDropDownList");
}

function UbindDrivers() {
    var UDriverId = $("#UDriverId").kendoDropDownList({
        autoBind: true,
        optionLabel: "--Select--",
        dataTextField: "UserName",
        dataValueField: "UserId",
        dataSource: {
            serverFiltering: true,
            transport: {
                read: {
                    dataType: "json",
                    url: pageResolveUrl + "User/GetDriverList",
                    data: function () {
                        return { CompanyId: null, BranchId: null };
                    }
                }
            }
        }
    }).data("kendoDropDownList");
}

function UbindTruckTypes() {
    var UTypeOfTruckId = $("#UTypeOfTruckId").kendoDropDownList({
        autoBind: true,
        //cascadeFrom: "UBranchId",
        optionLabel: "--Select--",
        dataTextField: "TruckTypeName",
        dataValueField: "TruckTypeId",
        dataSource: {
            serverFiltering: true,
            transport: {
                read: {
                    dataType: "json",
                    url: pageResolveUrl + "JobOrder/GetTruckTypeList",
                    data: function () {
                        return { BranchId: null };
                    }
                }
            }
        }
    
    }).data("kendoDropDownList");
}

function UbindUnit() {
        if ($("#UTruckNo") != null) {
            var TypeOfTruckId = $("#UTruckNo").kendoDropDownList({
                autoBind: false,
                cascadeFrom: "UTypeOfTruckId",
                optionLabel: "--Select--",
                dataTextField: "Unit",
                dataValueField: "TruckTypeId",
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            dataType: "json",
                            url: pageResolveUrl + "JobOrder/GetUnitList",
                            data: function () {
                                return { TruckId: $("#UTypeOfTruckId").val() };
                            }
                        }
                    }
                }
            }).data("kendoDropDownList");
        }
    }

var UpdateJobOrderSuccess = function (result) {
        //debugger;
        //alert(result.Message);
        if (result.status == 1) {
            //$("#divSuccess").html("Job Order Updated Successfully.");
            //ShowMessageModel();
            ShowNotificationAlert("Job Order Updated Successfully.", "success");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);

            if ($('#editjobDetails').dialog("open")) {
                $('#editjobDetails').dialog("close");
            }
            if ($('#editDepartureDetails').dialog("open")) {
                $('#editDepartureDetails').dialog("close");
            }
            if ($('#editArrivalDetails').dialog("open")) {
                $('#editArrivalDetails').dialog("close");
            }
            if ($('#editLoadDetails').dialog("open")) {
                $('#editLoadDetails').dialog("close");
            }
            if ($('#editNotifiDetails').dialog("open")) {
                $('#editNotifiDetails').dialog("close");
            }
            openJobDetailsPopUp(this, result.Message);
        }
        else if (result.status == 7) {
            //$("#divSuccess").html("Your Session is expired. Please login again to perform this action.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Your Session is expired. Please login again to perform this action.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
        else if (result.status == 9) {
            //$("#divSuccess").html("Access Denied");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Access Denied", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
        else {
            //$("#divSuccess").html("An error occurred while saving order information.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("An error occurred while saving order information.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
}

/*Function is used to check employee availability in Edit pop up */
function UcheckEmployeeAvailability() {
    debugger;
    var dId = $("#UDriverId").val(),
        sId = $("#USwamperId").val(),
        selDate = $("#datePicker").val();
    var getDate = new Date(),
        currentDate = getDate.getMonth() + 1 + "/" + getDate.getDate() + "/" + getDate.getFullYear();
    var selModified = new Date(selDate),
        getSelDate = selModified.getMonth() + 1 + "/" + selModified.getDate() + "/" + selModified.getFullYear();
    //if (selDate != '' && getSelDate > currentDate) {
    //    $("#driverInfo").css("display", "block").delay(5000).fadeOut();
    //    $("#swamperInfo").css("display", "block").delay(5000).fadeOut();
    //    $("#btnSaveJobOrder").attr("disabled", "disabled");
    //    $("#divSuccess").html("Oops! You are going to create job in post date [" + getSelDate + "]. At this date, Employees may be on leave.");
    //        ShowErrorMessageModel();
    //        return false;
    //}
    if (dId == '' && sId == '') {
        $("#UdriverInfo").css("display", "none");
        $("#UswamperInfo").css("display", "none");
        //$("#btnSaveJobOrder").removeAttr("disabled");
        return false;
    }
    var employeeIds = [dId, sId];
    $.ajax({
        url: pageResolveUrl + "JobOrder/EmployeeAvailability",
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        data: { userIds: JSON.stringify(employeeIds), driverId: dId, swamperId: sId, selectedDate: selDate },
        success: function (data, textStatus, jqXHR) {
            debugger;
            //data - response from server
            if (data == 1) {
                employeeIds = [];                
                $("#UdriverInfo").css("display", "block").delay(5000).fadeOut();
                $("#UswamperInfo").css("display", "block").delay(5000).fadeOut();
                // $("#btnSaveJobOrder").attr("disabled", "disabled");
                //$("#divSuccess").html("Employees may be unavailable for work. Please select others.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Employees may be unavailable for work. Please select others.", "warning");                
                $(".noty_message").fadeOut(5000);                
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
            else if (data == 2) {
                employeeIds = [];                
                $("#UdriverInfo").css("display", "block").delay(5000).fadeOut();
                $("#UswamperInfo").css("display", "none");
                // $("#btnSaveJobOrder").removeAttr("disabled");
                //$("#divSuccess").html("Driver may be unavailable for work. You may choose another one.");
                //ShowErrorMessageModel();
                //$("#noty_top_layout_container li").fadeIn(25000);
                ShowNotificationAlert("Driver may be unavailable for work. Please select others.", "warning");
                $(".noty_message").fadeOut(5000);                
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);                
            }
            else if (data == 3) {
                employeeIds = [];                
                $("#UswamperInfo").css("display", "block").delay(5000).fadeOut();
                $("#UdriverInfo").css("display", "none");
                // $("#btnSaveJobOrder").removeAttr("disabled");
                //$("#divSuccess").html("Swamper may be unavailable for work. You may choose another one.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Swamper may be unavailable for work. Please select others.", "warning");
                $(".noty_message").fadeOut(5000);               
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
            else {
                employeeIds = [];
                $("#UdriverInfo").css("display", "none");
                $("#UswamperInfo").css("display", "none");
                // $("#btnSaveJobOrder").removeAttr("disabled");
            }            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // $("#btnSaveJobOrder").removeAttr("disabled");
            //$("#divSuccess").html("Some error found! Please try again, We appriciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appriciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}
/* employee availability functions  in Edit pop up end*/

/*Function is used to check Truck availability in Edit pop up*/
function UcheckTruckAvailability() {
    debugger;
    var tId = $("#UTypeOfTruckId").val(),
        uId = $("#UTruckNo").val(),
        selDate = $("#datePicker").val();
    var getDate = new Date(),
        currentDate = getDate.getMonth() + 1 + "/" + getDate.getDate() + "/" + getDate.getFullYear();
    var selModified = new Date(selDate),
        getSelDate = selModified.getMonth() + 1 + "/" + selModified.getDate() + "/" + selModified.getFullYear();
    //if (selDate != '' && getSelDate > currentDate) {
    //    $("#truckInfo").css("display", "block").delay(5000).fadeOut();
    //    $("#swamperInfo").css("display", "block").delay(5000).fadeOut();
    //    $("#btnSaveJobOrder").attr("disabled", "disabled");
    //    $("#divSuccess").html("Oops! You are going to create job in post date [" + getSelDate + "]. At this date, Employees may be on leave.");
    //        ShowErrorMessageModel();
    //        return false;
    //}
    if (tId == '' && uId == '') {
        $("#UtruckInfo").css("display", "none");
        $("#UunitInfo").css("display", "none");
        //$("#btnSaveJobOrder").removeAttr("disabled");
        return false;
    }
    var employeeIds = [tId, uId];
    $.ajax({
        url: pageResolveUrl + "JobOrder/TruckAvailability",
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        data: { userIds: JSON.stringify(employeeIds), truckId: tId, unitId: uId, selectedDate: selDate },
        success: function (data, textStatus, jqXHR) {
            debugger;
            //data - response from server
            if (data == 1) {
                employeeIds = [];
                $("#UtruckInfo").css("display", "block").delay(5000).fadeOut();
                $("#UunitInfo").css("display", "block").delay(5000).fadeOut();
                // $("#btnSaveJobOrder").attr("disabled", "disabled");
                //$("#divSuccess").html("Truck type may be unavailable for work. Please select other.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Truck type may be unavailable for work. Please select other.", "warning");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
            }
                //else if (data == 2) {
                //    employeeIds = [];
                //    $("#truckInfo").css("display", "block").delay(5000).fadeOut();
                //    $("#unitInfo").css("display", "none");
                //    // $("#btnSaveJobOrder").removeAttr("disabled");
                //    $("#divSuccess").html("Truck is not available for work. You may choose another one.");
                //    ShowErrorMessageModel();
                //}
                //else if (data == 3) {
                //    employeeIds = [];
                //    $("#unitInfo").css("display", "block").delay(5000).fadeOut();;
                //    $("#truckInfo").css("display", "none");
                //    // $("#btnSaveJobOrder").removeAttr("disabled");
                //    $("#divSuccess").html("Unit is not available for work. You may choose another one.");
                //    ShowErrorMessageModel();
                //}
            else {
                employeeIds = [];
                $("#UtruckInfo").css("display", "none");
                $("#UunitInfo").css("display", "none");
                // $("#btnSaveJobOrder").removeAttr("disabled");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // $("#btnSaveJobOrder").removeAttr("disabled");
            //$("#divSuccess").html("Some error found! Please try again, We appriciate your patience.");
            //ShowErrorMessageModel();
            ShowNotificationAlert("Some error found! Please try again, We appriciate your patience.", "error");
            $(".noty_message").fadeOut(5000);
            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
        }
    });
}
/* Truck availability functions in Edit pop up end */

    /* Functions used to update the values of job Order in Pop-up */

function checkTimeonValidation(src) {
    var reg = new RegExp("^(?:0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$");
    //alert(src);
    if (src != "") {
        if (reg.test(src) == false) {
            $("#btnEditJobOrder").attr("disabled", "disabled");
            alert("Invalid time input");
        }
        else {
            $("#btnEditJobOrder").removeAttr("disabled");
        }
    }
}