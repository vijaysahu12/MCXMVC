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
            url: pageResolveUrl + "Common/GetUserAttendanceTypeList",
            data: {},
            dataType: "json",
            async: false,
            success: function (data) {
                if (data != null) {
                    attendanceType = data;
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
                //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
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
	            //$("#divSuccess").html("Access denied! You cannot create a schedule in this mode.");
	            //ShowErrorMessageModel();
	            ShowNotificationAlert("Access denied! You cannot create a schedule in this mode.", "error");
	            $(".noty_message").fadeOut(5000);
	            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	            e.stopImmediatePropagation();
	            return false;
	        }

	        var $dialogContent = $("#event_edit_container");
	        resetForm($dialogContent);
	        var startField = $dialogContent.find("#StartDate");
	        var endField = $dialogContent.find("#EndDate");
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
				       // alert('save');
				        debugger;
				        //alert($dialogContent.find("#StartDate").val());
				        calEvent.id = id;
				        calEvent.start = new Date($dialogContent.find("#StartDate").val());//startField.val();
				        calEvent.end = new Date($dialogContent.find("#EndDate").val());//endField.val();
				        calEvent.title = titleField.val();
				        calEvent.body = bodyField.val();
				        calEvent.userId = userField.val();
				        calEvent.attendanceValue = attendanceField.val();
				        //convertDateFormat(calEvent.start);
				        //alert(convert(start));
				       
				        //calEvent.start = convertDateFormat($dialogContent.find("#StartDate").val());
				        //calEvent.end = convertDateFormat($dialogContent.find("#EndDate").val());

				        
				        //alert(calEvent.end);

				        if (calEvent.userId == "" || calEvent.userId == null) {
				            //$("#divSuccess").html("Please select User");
				            //ShowErrorMessageModel();
				            ShowNotificationAlert("Please select User", "alert");
				            $(".noty_message").fadeOut(5000);
				            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 4000);
				            return false;
				        }
				        if (calEvent.attendanceValue == "" || calEvent.attendanceValue == null) {
				            //$("#divSuccess").html("Please select Status");
				            //ShowErrorMessageModel();
				            ShowNotificationAlert("Please select Status", "alert");
				            $(".noty_message").fadeOut(5000);
				            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 4000);
				            return false;
				        }
				        if (/^[a-zA-Z0-9- ]*$/.test(calEvent.title) == false || /^[a-zA-Z0-9- ]*$/.test(calEvent.body) == false) {
				            //$("#divSuccess").html("Oops! You have entered wrong text. Please provide a valid input in the fields.");
				            //ShowErrorMessageModel();
				            ShowNotificationAlert("Oops! You have entered wrong text. Please provide a valid input in the fields.", "error");
				            $(".noty_message").fadeOut(5000);
				            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 5000);
				            return false;
				        }
				        debugger;
				        $.ajax({
				            type: "POST",
				            //url: "../../Common/SaveEmployeeAttendance", //pageResolveUrl +
				            url: pageResolveUrl + "Common/SaveEmployeeAttendance", //pageResolveUrl +
				            data: { AttendanceId: 0, EmployeeId: userField.val(), UserAttendanceTypeId: attendanceField.val(), Subject: titleField.val(), AttendanceNote: bodyField.val(), AttendanceStartDate: $.datepicker.formatDate("mm-dd-yy", new Date(calEvent.start)), AttendanceEndDate: $.datepicker.formatDate("mm-dd-yy", new Date(calEvent.end)) },
				            dataType: "json",
				            success: function (data) {
				                //alert(data.Status);
				                if (data.Status != '') {
				                    var sd = data.Status.split(',');
				                    //alert(sd);
				                    for (var i = 0; i < (sd.length-1); i++) {
				                        debugger;
				                        calEvent.id = sd[i];
				                        //alert(sd[i]);				                      
				                    }
				                    //$calendar.weekCalendar("removeUnsavedEvents"); //alert('still running');
				                    //$calendar.weekCalendar("updateEvent", calEvent);
				                    $calendar.weekCalendar("refresh");
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

	        startField.val((calEvent.start));//formatDate(calEvent.start)	        
	        endField.val((calEvent.end));//formatDate(calEvent.end)
	        startField.val(startField.val().substr(3, 12));
	        endField.val(endField.val().substr(3, 12));
	        $dialogContent.find("#StartDate").text($calendar.weekCalendar("newFormatDate", calEvent.start));
	        $dialogContent.find("#EndDate").text($calendar.weekCalendar("newFormatDate", calEvent.end));
	        // setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
	        setupStartAndEndTimeFields_New(startField,endField,userField, attendanceField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start), $calendar.weekCalendar("getTimeslotTimes", calEvent.end));

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
	            //$("#divSuccess").html("Access denied! You cannot create a shcedule in this mode.");
	            //ShowErrorMessageModel();
	            ShowNotificationAlert("Access denied! You cannot create a shcedule in this mode.", "error");
	            $(".noty_message").fadeOut(5000);
	            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	            e.stopImmediatePropagation();
	            return false;
	        }
	        debugger;
	        var $dialogContent = $("#event_edit_container");
	        resetForm($dialogContent);
	        var startField = $dialogContent.find("#StartDate");	        
	        //alert(startField);
	        var endField = $dialogContent.find("#EndDate");
	        var titleField = $dialogContent.find("input[name='title']").val(calEvent.title);
	        var bodyField = $dialogContent.find("textarea[name='body']");
	        bodyField.val(calEvent.body);
	        var userField = $dialogContent.find("select[name='userid']");
	        var attendanceField = $dialogContent.find("select[name='attendanceValue']");
	       // alert(1);
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
	    		       
	    		        calEvent.start = new Date($dialogContent.find("#StartDate").val());//startField.val();
	    		        calEvent.end = new Date($dialogContent.find("#EndDate").val());//endField.val();
	    		        calEvent.title = titleField.val();
	    		        calEvent.body = bodyField.val();
	    		        calEvent.userId = userField.val();
	    		        calEvent.attendanceValue = attendanceField.val();
	    		        //alert(calEvent.start);
	    		        if (calEvent.userId == "" || calEvent.userId == null) {
	    		            //$("#divSuccess").html("Please select User");
	    		            //ShowErrorMessageModel();
	    		            ShowNotificationAlert("Please select User", "alert");
	    		            $(".noty_message").fadeOut(5000);
	    		            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 4000);
	    		            return false;
	    		        }
	    		        if (calEvent.attendanceValue == "" || calEvent.attendanceValue == null) {
	    		            //$("#divSuccess").html("Please select Status");
	    		            //ShowErrorMessageModel();
	    		            ShowNotificationAlert("Please select Status", "alert");
	    		            $(".noty_message").fadeOut(5000);
	    		            setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 4000);
	    		            return false;
	    		        }

	    		        $.ajax({
	    		            type: "POST",
	    		            //url: "../../Common/SaveEmployeeAttendance", //pageResolveUrl +
	    		            url: pageResolveUrl + "Common/SaveEmployeeAttendance", //pageResolveUrl +
	    		            data: { AttendanceId: calEvent.id, EmployeeId: userField.val(), UserAttendanceTypeId: attendanceField.val(), Subject: titleField.val(), AttendanceNote: bodyField.val(), AttendanceStartDate: $.datepicker.formatDate("M/dd/yy", new Date(calEvent.start)), AttendanceEndDate: $.datepicker.formatDate("M/dd/yy", new Date(calEvent.end)) },
	    		            dataType: "json",
	    		            success: function (data) {
	    		                //alert(data.Status);
	    		                if (data.Status != '') {
	    		                    var sd = data.Status.split(',');
	    		                    //alert(sd);
	    		                    for (var i = 0; i < (sd.length - 1) ; i++) {
	    		                        debugger;
	    		                        calEvent.id = sd[i];	    		                        
	    		                    }
	    		                    
	    		                    //$calendar.weekCalendar("removeUnsavedEvents");
	    		                    //    $calendar.weekCalendar("updateEvent", calEvent);
	    		                    $calendar.weekCalendar("refresh");
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

	        startField.val(calEvent.start);
	        endField.val(calEvent.end);
	        startField.val(startField.val().substr(3, 12));
	        endField.val(endField.val().substr(3, 12));
	        debugger;
	        $dialogContent.find("#StartDate").text($calendar.weekCalendar("newFormatDate", calEvent.start));
	        $dialogContent.find("#EndDate").text($calendar.weekCalendar("newFormatDate", calEvent.end));
	        setupStartAndEndTimeFields_New(startField,endField,userField, attendanceField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start), $calendar.weekCalendar("getTimeslotTimes", calEvent.end));

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
	                    //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
	                    //ShowErrorMessageModel();
	                    ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
	                    $(".noty_message").fadeOut(5000);
	                    setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
	                }
	            });

	            return users;
	        }
	    }
	});
    function convertDateFormat(str) {
        debugger;
        str = $dialogContent.find("#StartDate").val();
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    function convert(str) {
        var mnths = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
            Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
        },
        date = str.split(" ");

        return [date[3], mnths[date[1]], date[2]].join("-");
    }
    function formatDate(d) {
        var month = d.getMonth();
        var day = d.getDate();
        month = month + 1;

        month = month + "";

        if (month.length == 1) {
            month = "0" + month;
        }

        day = day + "";

        if (day.length == 1) {
            day = "0" + day;
        }

        return month + '-' + day + '-' + d.getFullYear();
    }
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


    function setupStartAndEndTimeFields_New($startTimeField, $endTimeField, $userField, $attendanceField, calEvent, timeslotStartTimes, timeslotEndTimes) {
        //alert(timeslotStartTimes);
        debugger;
        for (var i = 0; i < timeslotStartTimes.length; i++) {
            var startTime = timeslotStartTimes[i].start;
            var endTime = timeslotEndTimes[i].end;
            var startSelected = "";
            if (startTime.getTime() === calEvent.start.getTime()) {
                startSelected = "selected=\"selected\"";
            }
            var endSelected = "";
            if (endTime.getTime() === calEvent.end.getTime()) {
                endSelected = "selected=\"selected\"";
            }
            $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotStartTimes[i].startFormatted + "</option>");
            $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotEndTimes[i].endFormatted + "</option>");
        }

        $endTimeOptions = $endTimeField.find("option");
        $startTimeField.trigger("change");

        $userField.html('');
        $attendanceField.html('');
        $userField.append("<option value=\"\">Select User</option>");
        $attendanceField.append("<option value=\"\">Select Status</option>");

        $.each(users, function (i, values) {
            $userField.append("<option value=\"" + values.UserId + "\">" + values.UserName + "</option>");
        });
        $.each(attendanceType, function (i, values) {
            $attendanceField.append("<option value=\"" + values.AttendanceTypeId + "\">" + values.AttendanceType + "</option>");
        });
    }

    function getEventData(start, end, branchId) {
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        debugger;
        
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
                    //$("#divSuccess").html("Some error found! Please try again, We appreciate your patience.");
                    //ShowErrorMessageModel();
                    ShowNotificationAlert("Some error found! Please try again, We appreciate your patience.", "error");
                    $(".noty_message").fadeOut(5000);
                    setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
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