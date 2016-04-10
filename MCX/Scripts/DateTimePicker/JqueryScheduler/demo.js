/*
	jQuery Document ready
*/
(function ($) {
    /*
		store calendar dom into variable
	*/
    var $calendar = $('#calendar');
    var id = -1;
    var users = [];
    var attendanceType = [];
    var branches = [];
    var path = window.location.pathname;

    if (path.indexOf("WorkSchedule") > 0 || path.indexOf("JobOrder") > 0) {
        $.ajax({
            type: "POST",
            //url: "../../Common/GetAttendanceTypeList", //pageResolveUrl +
            url: pageResolveUrl + "Common/GetAttendanceTypeList",
            data: {},
            dataType: "json",
            async: false,
            success: function (data) {
                if (data != null) {
                    attendanceType = data;
                }
            },
            error: function (result) {
                $("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
                ShowErrorMessageModel();
            }
        });

        $.ajax({
            type: "POST",
            //url: "../../Branch/GetBranches", //pageResolveUrl +
            url: pageResolveUrl + "Branch/GetBranches", //pageResolveUrl +
            data: {},
            dataType: "json",
            async: false,
            success: function (data) {
                if (data != null) {
                    branches = data;
                }
            },
            error: function (result) {
                $("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
                ShowErrorMessageModel();
            }
        });
    }

    $calendar.weekCalendar(
	{
	    branches: branches,
	    attendanceType: attendanceType,
	    usersData: users,
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
	    businessHours: { start: 0, end: users.length, limitDisplay: true },
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
	    height: function ($calendar) {
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

	        if (path.indexOf("WorkSchedule") > 0) {
	        }
	        else {
	            $calendar.weekCalendar("removeUnsavedEvents");
	            $("#divSuccess").html("Access denied! You cannot create a schedule in this mode.");
	            ShowErrorMessageModel();
	            e.stopImmediatePropagation();
	            return false;
	        }

	        var $dialogContent = $("#event_edit_container");
	        resetForm($dialogContent);
	        var startField = $dialogContent.find("input[name='start']");
	        var endField = $dialogContent.find("input[name='end']");
	        var titleField = $dialogContent.find("input[name='title']");
	        var bodyField = $dialogContent.find("textarea[name='body']");
	        var userField = $dialogContent.find("select[name='userid']");
	        var attendanceField = $dialogContent.find("select[name='attendanceValue']");

	        $dialogContent.dialog(
			{
			    modal: true,
			    title: "Attendance Event",
			    close: function () {
			        $dialogContent.dialog("destroy");
			        $dialogContent.hide();
			        $('#calendar').weekCalendar("removeUnsavedEvents");
			    },
			    buttons:
				{
				    save: function () {
				        calEvent.id = id;
				        calEvent.start = new Date($dialogContent.find("input[name='start']").val());//startField.val();
				        calEvent.end = new Date($dialogContent.find("input[name='end']").val());//endField.val();
				        calEvent.title = titleField.val();
				        calEvent.body = bodyField.val();
				        calEvent.userId = userField.val();
				        calEvent.attendanceValue = attendanceField.val();

				        if (calEvent.userId == "" || calEvent.userId == null) {
				            $("#divSuccess").html("Please select User");
				            ShowErrorMessageModel();
				            return false;
				        }
				        if (calEvent.attendanceValue == "" || calEvent.attendanceValue == null) {
				            $("#divSuccess").html("Please select Status");
				            ShowErrorMessageModel();
				            return false;
				        }
				        if (/^[a-zA-Z0-9- ]*$/.test(calEvent.title) == false || /^[a-zA-Z0-9- ]*$/.test(calEvent.body) == false){
				            $("#divSuccess").html("Oops! You have entered wrong text. Please provide a valid input in the fields.");
				            ShowErrorMessageModel();
				            return false;
				        }

				        $.ajax({
				            type: "POST",
				            //url: "../../Common/SaveEmployeeAttendance", //pageResolveUrl +
				            url: pageResolveUrl + "Common/SaveEmployeeAttendance", //pageResolveUrl +
				            data: { AttendanceId: 0, EmployeeId: userField.val(), AttendanceTypeId: attendanceField.val(), Subject: titleField.val(), AttendanceNote: bodyField.val(), AttendanceDate: $.datepicker.formatDate("M/dd/yy", new Date(calEvent.start)) },
				            dataType: "json",
				            success: function (data) {
				                if (data.Status > 0) {
				                    calEvent.id = data.Status;
				                    $calendar.weekCalendar("removeUnsavedEvents");
				                    $calendar.weekCalendar("updateEvent", calEvent);
				                    $("#divSuccess").html("Information saved successfully.");
				                    ShowMessageModel();
				                }
				            },
				            error: function (result) {
				                $("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
				                ShowErrorMessageModel();
				            }
				        });

				        $dialogContent.dialog("close");
				    },
				    cancel: function () {
				        $dialogContent.dialog("close");
				    }
				}
			}).show();

	        startField.val(calEvent.start);
	        endField.val(calEvent.end);
	        $dialogContent.find(".date_holder").text($calendar.weekCalendar("newFormatDate", calEvent.start));
	        // setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
	        setupStartAndEndTimeFields_New(userField, attendanceField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));

	        userField.val(calEvent.userId);
	        attendanceField.val(calEvent.attendanceValue);
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

	        if (path.indexOf("WorkSchedule") > 0) {
	        }
	        else {
	            $calendar.weekCalendar("removeUnsavedEvents");
	            $("#divSuccess").html("Access denied! You cannot create a shcedule in this mode.");
	            ShowErrorMessageModel();
	            e.stopImmediatePropagation();
	            return false;
	        }

	        var $dialogContent = $("#event_edit_container");
	        resetForm($dialogContent);
	        var startField = $dialogContent.find("input[name='start']");
	        var endField = $dialogContent.find("input[name='end']");
	        var titleField = $dialogContent.find("input[name='title']").val(calEvent.title);
	        var bodyField = $dialogContent.find("textarea[name='body']");
	        bodyField.val(calEvent.body);
	        var userField = $dialogContent.find("select[name='userid']");
	        var attendanceField = $dialogContent.find("select[name='attendanceValue']");

	        $dialogContent.dialog(
	    	{
	    	    modal: true,
	    	    title: "Edit - " + calEvent.title,
	    	    close: function () {
	    	        $dialogContent.dialog("destroy");
	    	        $dialogContent.hide();
	    	        $('#calendar').weekCalendar("removeUnsavedEvents");
	    	    },
	    	    buttons:
	    		{
	    		    save: function () {
	    		        calEvent.start = new Date($dialogContent.find("input[name='start']").val());//startField.val();
	    		        calEvent.end = new Date($dialogContent.find("input[name='end']").val());//endField.val();
	    		        calEvent.title = titleField.val();
	    		        calEvent.body = bodyField.val();
	    		        calEvent.userId = userField.val();
	    		        calEvent.attendanceValue = attendanceField.val();

	    		        if (calEvent.userId == "" || calEvent.userId == null) {
	    		            $("#divSuccess").html("Please select User");
	    		            ShowErrorMessageModel();
	    		            return false;
	    		        }
	    		        if (calEvent.attendanceValue == "" || calEvent.attendanceValue == null) {
	    		            $("#divSuccess").html("Please select Status");
	    		            ShowErrorMessageModel();
	    		            return false;
	    		        }

	    		        $.ajax({
	    		            type: "POST",
	    		            //url: "../../Common/SaveEmployeeAttendance", //pageResolveUrl +
	    		            url: pageResolveUrl + "Common/SaveEmployeeAttendance", //pageResolveUrl +
	    		            data: { AttendanceId: calEvent.id, EmployeeId: userField.val(), AttendanceTypeId: attendanceField.val(), Subject: titleField.val(), AttendanceNote: bodyField.val(), AttendanceDate: $.datepicker.formatDate("M/dd/yy", new Date(calEvent.start)) },
	    		            dataType: "json",
	    		            success: function (data) {
	    		                if (data.Status > 0) {
	    		                    calEvent.id = data.Status;
	    		                    $calendar.weekCalendar("removeUnsavedEvents");
	    		                    $calendar.weekCalendar("updateEvent", calEvent);
	    		                    $("#divSuccess").html("Information updated successfully.");
	    		                    ShowMessageModel();
	    		                }
	    		            },
	    		            error: function (result) {
	    		                $("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
	    		                ShowErrorMessageModel();
	    		            }
	    		        });

	    		        $dialogContent.dialog("close");
	    		    },
	    		    "delete": function () {

	    		        $.ajax({
	    		            type: "POST",
	    		            //url: "../../Common/DeleteEmployeeAttendance", //pageResolveUrl +
	    		            url: pageResolveUrl + "Common/DeleteEmployeeAttendance", //pageResolveUrl +
	    		            data: { AttendanceId: calEvent.id },
	    		            dataType: "json",
	    		            success: function (data) {
	    		                if (data.Status > 0) {
	    		                    $calendar.weekCalendar("removeEvent", calEvent.id);
	    		                    $("#divSuccess").html("Information deleted successfully.");
	    		                    ShowMessageModel();
	    		                }
	    		            },
	    		            error: function (result) {
	    		                $("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
	    		                ShowErrorMessageModel();
	    		            }
	    		        });

	    		        $dialogContent.dialog("close");
	    		    },
	    		    cancel: function () {
	    		        $dialogContent.dialog("close");
	    		    }
	    		}
	    	}).show();

	        startField.val(calEvent.start);
	        endField.val(calEvent.end);

	        $dialogContent.find(".date_holder").text($calendar.weekCalendar("newFormatDate", calEvent.start));
	        setupStartAndEndTimeFields_New(userField, attendanceField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));

	        userField.val(calEvent.userId);
	        attendanceField.val(calEvent.attendanceValue);

	        $(window).resize().resize(); //fixes a bug in modal overlay size ??
	    },

	    data: function (start, end, branchId, callback) {

	        callback(getEventData(start, end, branchId));
	    },

	    GetUsers: function (branchId) {

	        if (branchId != -1) {
	            users = [];
	            $.ajax({
	                type: "POST",
	                //url: "../../Common/GetUserForSchedulerList", //pageResolveUrl +
	                url: pageResolveUrl + "Common/GetUserForSchedulerList", //pageResolveUrl +
	                data: { BranchId: branchId },
	                dataType: "json",
	                async: false,
	                success: function (data) {
	                    if (data != null) {
	                        users = data;
	                    }
	                },
	                error: function (result) {
	                    $("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
	                    ShowErrorMessageModel();
	                }
	            });

	            return users;
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
        debugger;
        for (var i = 0; i < timeslotTimes.length; i++) {
            var startTime = timeslotTimes[i].start;
            var endTime = timeslotTimes[i].end;
            var startSelected = "";
            if (startTime.getTime() === calEvent.start.getTime()) {
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
        $startTimeField.append("<option value=\"\">Select User</option>");
        $endTimeField.append("<option value=\"\">Select Status</option>");

        $.each(users, function (i, values) {
            $startTimeField.append("<option value=\"" + values.UserId + "\">" + values.UserName + "</option>");
        });
        $.each(attendanceType, function (i, values) {
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
                //url: "../../Common/GetEmployeeAttendance", //pageResolveUrl +
                url: pageResolveUrl + "Common/GetEmployeeAttendance", //pageResolveUrl +
                data: { _weekStartDate: $.datepicker.formatDate("M/dd/yy", new Date(start)), _weekEndDate: $.datepicker.formatDate("M/dd/yy", new Date(end)), branchId: branchId },
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data != null) {
                        //alert(JSON.stringify(data));
                        response = data;
                    }
                },
                error: function (result) {
                    $("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
                    ShowErrorMessageModel();
                }
            });
        }
        return response;

        //return {
        //    events: [
        //       {
        //           "id": 1,
        //           "start": new Date(year, month, day, 12),
        //           "end": new Date(year, month, day, 13, 30),
        //           "title": "Lunch with Mike",
        //           "userId": "24",
        //           "attendanceValue": "2"
        //       },
        //       {
        //           "id": 2,
        //           "start": new Date(year, month, day, 14),
        //           "end": new Date(year, month, day, 14, 45),
        //           "title": "Dev Meeting",
        //           "userId": "25",
        //           "attendanceValue": "4"
        //       },
        //       {
        //           "id": 3,
        //           "start": new Date(year, month, day + 1, 17),
        //           "end": new Date(year, month, day + 1, 17, 45),
        //           "title": "Hair cut",
        //           "userId": "26",
        //           "attendanceValue": "5"
        //       },
        //       {
        //           "id": 4,
        //           "start": new Date(year, month, day - 1, 8),
        //           "end": new Date(year, month, day - 1, 9, 30),
        //           "title": "Team breakfast",
        //           "userId": "27",
        //           "attendanceValue": "7"
        //       },
        //       {
        //           "id": 5,
        //           "start": new Date(year, month, day + 1, 14),
        //           "end": new Date(year, month, day + 1, 15),
        //           "title": "Product showcase",
        //           "userId": "24",
        //           "attendanceValue": "2"
        //       },
        //       {
        //           "id": 6,
        //           "start": new Date(year, month, day, 10),
        //           "end": new Date(year, month, day, 11),
        //           "title": "I'm read-only",
        //           "userId": "25",
        //           "attendanceValue": "4",
        //           readOnly: true
        //       },
        //       {
        //           "id": 7,
        //           "start": new Date(year, month, day + 2, 17),
        //           "end": new Date(year, month, day + 3, 9),
        //           "title": "Multiday",
        //           "userId": "26",
        //           "attendanceValue": "5"
        //       }
        //    ]
        //};
    }
})(jQuery);