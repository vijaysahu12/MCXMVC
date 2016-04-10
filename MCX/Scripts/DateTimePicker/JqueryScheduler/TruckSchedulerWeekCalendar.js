/*
 * jQuery.weekCalendar v1.2.2
 * http://www.redredred.com.au/
 *
 * Requires:
 * - jquery.weekcalendar.css
 * - jquery 1.3.x
 * - jquery-ui 1.7.x (widget, drag, drop, resize)
 *
 * Copyright (c) 2009 Rob Monie
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *   
 *   If you're after a monthly calendar plugin, check out http://arshaw.com/fullcalendar/
 */

(function ($) {

    $.widget("ui.weekCalendar", {

        /***********************
         * Initialise calendar *
         ***********************/
        _init: function () {
            var self = this;
            self._computeOptions();
            self._setupEventDelegation();
            self._renderListFilters();
            self._resizeListCalendar();
            self._renderCalendar();
            self._loadCalEvents();
            self._resizeCalendar();
            //self._scrollToHour(self.options.date.getHours());

            $(window).unbind("resize.weekcalendar");
            $(window).bind("resize.weekcalendar", function () {
                self._resizeCalendar();
            });

        },

        /********************
         * public functions *
         ********************/
        /*
         * Refresh the events for the currently displayed week.
         */
        refresh: function () {
            this._clearCalendar();
            this._loadCalEvents(this.element.data("startDate")); //reload with existing week
        },

        /*
         * Clear all events currently loaded into the calendar
         */
        clear: function () {
            this._clearCalendar();
        },

        /*
         * Go to this week
         */
        today: function () {
            this._clearCalendar();
            $("#_monthPicker").val(new Date().getMonth());
            $("#_yearPicker").val(new Date().getFullYear());
            //this._loadCalEvents(new Date());
            this.changeDateNav();
        },

        /*
         * Go to the previous week relative to the currently displayed week
         */
        prevWeek: function () {
            //minus more than 1 day to be sure we're in previous week - account for daylight savings or other anomolies
            var newDate = new Date(this.element.data("startDate").getTime() - (MILLIS_IN_WEEK / 6));

            $("#_monthPicker").val(newDate.getMonth());
            $("#_yearPicker").val(newDate.getFullYear());

            this._clearCalendar();
            //this._loadCalEvents(newDate);
            this.changeDateNav();
        },

        /*
         * Go to the next week relative to the currently displayed week
         */
        nextWeek: function () {
            //add 8 days to be sure of being in prev week - allows for daylight savings or other anomolies
            var newDate = new Date(this.element.data("endDate").getTime() + MILLIS_IN_WEEK + (MILLIS_IN_WEEK / 7));

            $("#_monthPicker").val(newDate.getMonth());
            $("#_yearPicker").val(newDate.getFullYear());

            this._clearCalendar();
            //this._loadCalEvents(newDate);
            this.changeDateNav();
        },

        /*
         * Reload the calendar to whatever week the date passed in falls on.
         */
        gotoWeek: function (date) {
            this._clearCalendar();
            this._loadCalEvents(date);
        },

        /*
         * Remove an event based on it's id
         */
        removeEvent: function (eventId) {

            var self = this;

            self.element.find(".wc-cal-event").each(function () {
                if ($(this).data("calEvent").id === eventId) {
                    $(this).remove();
                    return false;
                }
            });

            //this could be more efficient rather than running on all days regardless...
            self.element.find(".wc-day-column-inner").each(function () {
                self._adjustOverlappingEvents($(this));
            });
        },

        /*
         * Removes any events that have been added but not yet saved (have no id).
         * This is useful to call after adding a freshly saved new event.
         */
        removeUnsavedEvents: function () {

            var self = this;

            self.element.find(".wc-new-cal-event").each(function () {

                $(this).remove();
            });

            //this could be more efficient rather than running on all days regardless...
            self.element.find(".wc-day-column-inner").each(function () {
                self._adjustOverlappingEvents($(this));
            });
        },

        /*
         * update an event in the calendar. If the event exists it refreshes
         * it's rendering. If it's a new event that does not exist in the calendar
         * it will be added.
         */
        updateEvent: function (calEvent) {
            this._updateEventInCalendar(calEvent);
        },

        /*
         * Returns an array of timeslot start and end times based on
         * the configured grid of the calendar. Returns in both date and
         * formatted time based on the 'timeFormat' config option.
         */
        getTimeslotTimes: function (date) {
            var options = this.options;
            var firstHourDisplayed = options.businessHours.limitDisplay ? options.businessHours.start : 0;
            var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), firstHourDisplayed);

            var times = []
            var startMillis = startDate.getTime();
            for (var i = 0; i < options.timeslotsPerDay; i++) {
                var endMillis = startMillis + options.millisPerTimeslot;
                times[i] = {
                    start: new Date(startMillis),
                    startFormatted: this._formatDate(new Date(startMillis), options.timeFormat),
                    end: new Date(endMillis),
                    endFormatted: this._formatDate(new Date(endMillis), options.timeFormat)
                };
                startMillis = endMillis;
            }
            return times;
        },

        formatDate: function (date, format) {
            if (format) {
                return this._formatDate(date, format);
            } else {
                return this._formatDate(date, this.options.dateFormat);
            }
        },

        newFormatDate: function (date, format) {

            if (format) {
                return this._formatDate(date, format);
            } else {
                return this._formatDate(date, this.options.newDateFormat);
            }
        },

        formatTime: function (date, format) {
            if (format) {
                return this._formatDate(date, format);
            } else {
                return this._formatDate(date, this.options.timeFormat);
            }
        },

        getData: function (key) {
            return this._getData(key);
        },

        changeBranch: function () {

            var BranchDD = $("#_branchDD");
            var month = $("#_monthPicker").val();
            var year = $("#_yearPicker").val();
            var date = "";
            if (year != "-1" && month != "-1") {
                date = new Date(year, month, 1, 0, 0, 0, 0);
            }

            this.options.trucksData = this.options.GetTrucks(BranchDD.val());

            if (date != "" && date != undefined) {
                $(".wc-scrollable-grid").remove();
                var self = this;
                self._computeOptions();
                self._setupEventDelegation();
                self._renderCalenderBody();

                self._loadCalEvents();
                self._resizeCalendar();
                //self._scrollToHour(self.options.date.getHours());

                $(window).unbind("resize.weekcalendar");
                $(window).bind("resize.weekcalendar", function () {
                    self._resizeCalendar();
                });
            }
        },

        changeDateNav: function () {

            var month = $("#_monthPicker").val();
            var year = $("#_yearPicker").val();
            if (month != "-1" && year != "-1") {
                var date = new Date(year, month, 1, 0, 0, 0, 0);

                var BranchDD = $("#_branchDD");

                this.options.trucksData = this.options.GetTrucks(BranchDD.val());


                $(".wc-scrollable-grid").remove();
                var self = this;
                self._computeOptions();
                self._setupEventDelegation();
                self._renderCalenderBody();
                self._loadCalEvents(date);
                self._resizeCalendar();
                //self._scrollToHour(self.options.date.getHours());

                $(window).unbind("resize.weekcalendar");
                $(window).bind("resize.weekcalendar", function () {
                    self._resizeCalendar();
                });
            }
        },

        lstChangeBranch: function () {
            //debugger;
            this.options.day = $("#lstFilters_day").val().trim();
            if (this.options.day == '' || this.options.day == 'undefined' || this.options.day == 'NaN') {
                return false;
            }
            var bId = $("#lstFilters_branchDD");
            var month = $("#lstFilters_monthPicker").val();
            var year = $("#lstFilters_yearPicker").val();
            var date = "";
            if (year != "-1" && month != "-1") {
                date = new Date(year, month, this.options.day, 0, 0, 0, 0);
            }
            if (bId.val() == '-1') {
                $(".wc-listTitleDate").text('').text('No branch selected yet!');
                return false;
            }
            var custDate = this.options.shortMonths[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
            this.options.getCustomDate = custDate;
            this.options.jobOrderTrucksData = this.options.GetJobOrderTrucks(bId.val(), custDate);

            if (date != "" && date != undefined) {
                $(".wc-listScrollable-grid").remove();
                var self = this;
                self._renderListCalenderBody();
                self._resizeListCalendar();

                $(window).unbind("resize.weekcalendar");
                $(window).bind("resize.weekcalendar", function () {
                    self._resizeListCalendar();
                });
            }
            //$("#lstFilters_day").val(this.options.day);
            $(".wc-listTitleDate").text('').text(custDate);
        },

        lstChangeDateNav: function () {
            if (this.options.day == '' || this.options.day == 'undefined' || this.options.day == 'NaN') {
                return false;
            }
            var bId = $("#lstFilters_branchDD");
            if (bId.val() == '-1') {
                //$("#divSuccess").html("No branch selected! Please select branch first for listing the records.");
                //ShowErrorMessageModel();
                ShowNotificationAlert("No branch selected! Please select branch first for listing the records.", "error");
                $(".noty_message").fadeOut(5000);
                setTimeout(function () { $("#noty_top_layout_container li").fadeOut(3000); }, 2000);
                return false;
            }
            var month = $("#lstFilters_monthPicker").val();
            var year = $("#lstFilters_yearPicker").val();
            if (month != "-1" && year != "-1") {
                var date = new Date(year, month, this.options.day, 0, 0, 0, 0);
                var custDate = this.options.shortMonths[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
                this.options.getCustomDate = custDate;
                var bId = $("#lstFilter_branchDD");
                this.options.jobOrderTrucksData = this.options.GetJobOrderTrucks(bId.val(), custDate);

                $(".wc-listScrollable-grid").remove();
                var self = this;
                self._renderListCalenderBody();
                self._resizeListCalendar();

                $(window).unbind("resize.weekcalendar");
                $(window).bind("resize.weekcalendar", function () {
                    self._resizeListCalendar();
                });
            }
            $(".wc-listTitleDate").text('').text(custDate);

            $("#lstFilters_day").val(date.getDate());
        },

        lstToday: function () {
            this._clearCalendar();
            $("#lstFilters_monthPicker").val(new Date().getMonth());
            $("#lstFilters_yearPicker").val(new Date().getFullYear());
            this.options.day = new Date().getDate();
            this.lstChangeDateNav();
        },

        /*
         * Go to the previous week relative to the currently displayed week
         */
        lstPrevWeek: function () {
            //debugger;
            //minus more than 1 day to be sure we're in previous week - account for daylight savings or other anomolies
            var dtNext = $(".wc-listTitleDate").text();
            var newDate = dtNext == 'No branch selected yet!' ? new Date() : new Date(dtNext);
            var prevDay = newDate.getDate() - 1;
            this.options.day = prevDay;    // == 1 ? newDate.getDate() : newDate.getDate() -1;
            //var newDate = new Date(this.element.data("startDate").getTime() - (MILLIS_IN_WEEK / 6));
            if (prevDay == 0) {

                var lastDay = new Date(newDate.getFullYear(), (newDate.getMonth() - 1) + 1, 0);
                $("#lstFilters_monthPicker").val(newDate.getMonth() - 1);
                $("#lstFilters_day").val(lastDay.getDate());
                var month = newDate.getMonth();
                var year = $("#lstFilters_yearPicker").val();
                var date = new Date(year, month, this.options.day, 0, 0, 0, 0);
                var custDate = this.options.shortMonths[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
                this.options.getDate = custDate;
                this._clearCalendar();
                $(".wc-listTitleDate").text(custDate);
            }
            else {
                $("#lstFilters_monthPicker").val(newDate.getMonth());
                $("#lstFilters_yearPicker").val(newDate.getFullYear());
                this._clearCalendar();
                this.lstChangeDateNav();
            }
        },

        /*
         * Go to the next week relative to the currently displayed week
         */
        lstNextWeek: function () {
            //debugger;
            //add 8 days to be sure of being in prev week - allows for daylight savings or other anomolies
            var dtNext = $(".wc-listTitleDate").text();
            var newDate = dtNext == 'No branch selected yet!' ? new Date() : new Date(dtNext);
            var nextDay = newDate.getDate() + 1;
            this.options.day = nextDay;
            //var newDate = new Date(this.element.data("endDate").getTime() + MILLIS_IN_WEEK + (MILLIS_IN_WEEK / 7));

            $("#lstFilters_monthPicker").val(newDate.getMonth());
            $("#lstFilters_yearPicker").val(newDate.getFullYear());

            this._clearCalendar();
            this.lstChangeDateNav();
        },

        /*
         * Go to the current day
         */
        lstCurrentDay: function () {
            $('#lstFilters_day').bind("cut copy paste", function (e) {
                e.preventDefault();
            });
            $('#lstFilters_day').bind("keypress", function (e) {
                var charCode = (e.which) ? e.which : event.keyCode
                if (charCode > 31 && (charCode < 48 || charCode > 57))
                    return false;
            });
            var currentDay = $("#lstFilters_day").val().trim();
            if (currentDay.length <= 2) {
                this.options.day = currentDay;
                this._clearCalendar();
                this.lstChangeDateNav();
            }
        },

        /*********************
         * private functions *
         *********************/
        // compute dynamic options based on other config values
        _computeOptions: function () {
            var options = this.options;

            if (options.businessHours.limitDisplay) {
                options.timeslotsPerDay = options.timeslotsPerHour * (options.businessHours.end - options.businessHours.start);
                options.millisToDisplay = (options.businessHours.end - options.businessHours.start) * 60 * 60 * 1000;
                options.millisPerTimeslot = options.millisToDisplay / options.timeslotsPerDay;
            } else {
                options.timeslotsPerDay = options.timeslotsPerHour * 24;
                options.millisToDisplay = MILLIS_IN_DAY;
                options.millisPerTimeslot = MILLIS_IN_DAY / options.timeslotsPerDay;
            }
        },

        /*
         * Resize the calendar scrollable height based on the provided function in options.
         */
        _resizeCalendar: function () {

            var options = this.options;
            if (options && $.isFunction(options.height)) {
                var calendarHeight = options.height(this.element);
                var headerHeight = this.element.find(".wc-header").outerHeight();
                var navHeight = this.element.find(".wc-nav").outerHeight();
                this.element.find(".wc-scrollable-grid").height(calendarHeight - navHeight - headerHeight);
                this.element.find(".wc-scrollable-grid").width("100%");
            }
        },

        /*
         * Resize the list calendar scrollable height based on the records.
         */
        _resizeListCalendar: function () {

            var options = this.options;
            if (options && $.isFunction(options.height)) {
                var calendarHeight = options.height(this.element);
                var headerHeight = this.element.find(".wc-listHeader").outerHeight();
                var navHeight = this.element.find(".wc-listNav").outerHeight();
                this.element.find(".wc-listScrollable-grid").height(calendarHeight - navHeight - headerHeight);
            }
        },

        /*
         * configure calendar interaction events that are able to use event
         * delegation for greater efficiency
         */
        _setupEventDelegation: function () {
            var self = this;
            var options = this.options;
            this.element.click(function (event) {
                var $target = $(event.target);
                if ($target.data("preventClick")) {
                    return;
                }
                if ($target.hasClass("wc-cal-event")) {
                    options.eventClick($target.data("calEvent"), $target, event);
                } else if ($target.parent().hasClass("wc-cal-event")) {
                    options.eventClick($target.parent().data("calEvent"), $target.parent(), event);
                }
            }).mouseover(function (event) {
                var $target = $(event.target);

                if (self._isDraggingOrResizing($target)) {
                    return;
                }

                if ($target.hasClass("wc-cal-event")) {
                    options.eventMouseover($target.data("calEvent"), $target, event);
                }
            }).mouseout(function (event) {
                var $target = $(event.target);
                if (self._isDraggingOrResizing($target)) {
                    return;
                }
                if ($target.hasClass("wc-cal-event")) {
                    if ($target.data("sizing")) return;
                    options.eventMouseout($target.data("calEvent"), $target, event);

                }
            });
        },

        /*
         * check if a ui draggable or resizable is currently being dragged or resized
         */
        _isDraggingOrResizing: function ($target) {
            return $target.hasClass("ui-draggable-dragging") || $target.hasClass("ui-resizable-resizing");
        },

        /*!
         * Render list calendar layout
         */
        _renderListFilters: function () {

            var $lstContainer, lstCalendarNavHtml, lstCalendarHeaderHtml, lstCalendarBodyHtml;
            var self = this;
            var options = this.options;

            $lstContainer = $("<div class=\"wc-listContainer\">").appendTo(self.element);
            if (options.buttons) {
                //lstCalendarNavHtml = "<div class=\"wc-listNav\"><select id='lstFilters_branchDD'><option value='-1' selected = 'selected'>-Select Branch-</option>";
                lstCalendarNavHtml = "<div class=\"wc-listNav\"><select id='lstFilters_branchDD'>";//Commented above and written on 14 Jan 2014

                for (var i = 0; i < options.branches.length; i++) {
                    lstCalendarNavHtml += "<option value='" + options.branches[i].BranchId + "'>" + options.branches[i].BranchName + "</option>";
                }

                var Month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                lstCalendarNavHtml += "</select>\
                    <select id='lstFilters_monthPicker' style='width:110px;'><option value='-1' >-Select Month-</option>";

                var _month = new Date().getMonth();

                for (var i = 0; i < 12; i++) {
                    if (_month == i) {
                        lstCalendarNavHtml += "<option selected='selected' value='" + i + "'>" + Month[i] + "</option>";
                    }
                    else {
                        lstCalendarNavHtml += "<option value='" + i + "'>" + Month[i] + "</option>";
                    }
                }
                lstCalendarNavHtml += "<input type='text' id='lstFilters_day' style='position: relative; width: 59px; height: 24px; top: 0px; left: -75px;' maxlength='2' value='" + options.lstDay + "' />"

                lstCalendarNavHtml += "</select>\
                    <select id='lstFilters_yearPicker' style='width:110px;'><option value='-1'>-Select Year-</option>";

                var year = new Date().getFullYear();

                for (var i = year - 10; i < year + 10; i++) {
                    if (year == i) {
                        lstCalendarNavHtml += "<option  selected = 'selected' value='" + i + "'>" + i + "</option>";
                    }
                    else {
                        lstCalendarNavHtml += "<option value='" + i + "'>" + i + "</option>";
                    }

                }


                lstCalendarNavHtml += "</select><button class=\"lst-wc-today\">" + options.buttonText.lstToday + "</button>\
                    <button class=\"lst-wc-prev\">" + options.buttonText.lastWeek + "</button>\
                    <button class=\"lst-wc-next\">" + options.buttonText.nextWeek + "</button>\
                    </div>";


                $(lstCalendarNavHtml).appendTo($lstContainer);

                $lstContainer.find("#lstFilters_monthPicker").change(function () {

                    self.element.weekCalendar("lstChangeDateNav");
                    return false;
                });

                $lstContainer.find("#lstFilters_day").keyup(function () {

                    self.element.weekCalendar("lstCurrentDay");
                    return false;
                });

                $lstContainer.find("#lstFilters_yearPicker").change(function () {

                    self.element.weekCalendar("lstChangeDateNav");
                    return false;
                });


                $lstContainer.find("#lstFilters_branchDD").change(function () {

                    self.element.weekCalendar("lstChangeBranch");
                    return false;
                });

                $lstContainer.find(".wc-listNav .lst-wc-today").click(function () {
                    self.element.weekCalendar("lstToday");
                    return false;
                });

                $lstContainer.find(".wc-listNav .lst-wc-prev").click(function () {
                    //if ($("#lstFilters_day").val().trim() == 1) {
                    //    alert('hi');
                    //    //$("#lstFilters_monthPicker").val($("#lstFilters_monthPicker").val() - 1);                       

                    //    self.element.weekCalendar("lstChangeDateNav");
                    //    self.element.weekCalendar("lstCurrentDay");
                    //    self.element.weekCalendar("lstPrevWeek");
                    //}
                    //else {
                    //    self.element.weekCalendar("lstPrevWeek");
                    //}
                    self.element.weekCalendar("lstPrevWeek");
                    return false;
                });

                $lstContainer.find(".wc-listNav .lst-wc-next").click(function () {
                    self.element.weekCalendar("lstNextWeek");
                    return false;
                });
            }

            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();


            //render calendar header
            lstCalendarHeaderHtml = "<table class=\"wc-listHeader\" border=1><tbody><tr class=\"wc-listRowHeader\"><td colspan=\"7\" style=\"text-align:center;\"><span class=\"wc-listTitleDate\">" + this.options.getCustomDate + "</span></td></tr>";
            if (this.options.mapToCompanyId == 7) {
                lstCalendarHeaderHtml += "<tr class=\"wc-listRowHeader\"><td class=\"wc-listColHeader\">Unit #</td><td class=\"wc-listColHeader\">Transaction #</td><td class=\"wc-listColHeader\">Type</td><td class=\"wc-listColHeader\">Customer Address</td><td class=\"wc-listColHeader\">Item Description</td><td class=\"wc-listColHeader\">Status</td><td class=\"wc-listColHeader\"></td></tr></tbody></table>";
            }
            else {
                lstCalendarHeaderHtml += "<tr class=\"wc-listRowHeader\"><td class=\"wc-listColHeader\">Unit #</td><td class=\"wc-listColHeader\">Ticket #</td><td class=\"wc-listColHeader\">Truck Type</td><td class=\"wc-listColHeader\">Driver</td><td class=\"wc-listColHeader\">Swamper</td><td class=\"wc-listColHeader\">Customer</td><td class=\"wc-listColHeader\">Job Description</td></tr></tbody></table>";
            }
            //render calendar body
            lstCalendarBodyHtml = "<div class=\"wc-listScrollable-grid\">\
                <table border=1 class=\"wc-time-slots\">\
                <tbody>";
            //----Start Code written by Pradeep on 20Jan 2014
            this.options.day = $("#lstFilters_day").val().trim();
            if (this.options.day == '' || this.options.day == 'undefined' || this.options.day == 'NaN') {
                return false;
            }
            var bId = $("#lstFilters_branchDD");
            var month = $("#lstFilters_monthPicker").val();
            var year = $("#lstFilters_yearPicker").val();
            var date = "";
            if (year != "-1" && month != "-1") {
                date = new Date(year, month, this.options.day, 0, 0, 0, 0);
            }
            if (bId.val() == '-1') {
                $(".wc-listTitleDate").text('').text('No branch selected yet!');
                return false;
            }
            var custDate = this.options.shortMonths[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
            this.options.getCustomDate = custDate;
            //alert('Called to fill this.options.jobOrderTrucksData----' + bId.val());
            // alert(custDate);
            this.options.jobOrderTrucksData = this.options.GetJobOrderTrucks(bId.val(), custDate);

            //----END Code written by Pradeep on 20Jan 2014
            var start = 0;
            var end = options.jobOrderTrucksData.length;


            for (var i = start; i < end; i++) {
                lstCalendarBodyHtml += "<tr><td class=\"wc-listGrid-data-column\">";
                lstCalendarBodyHtml += options.jobOrderTrucksData[i].UnitNo + "</td>";
                if (this.options.mapToCompanyId == 7) {
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column\"><a href=\"javascript:void(0);\" onclick=\"openMasterBillingDetails(this, '" + options.jobOrderTrucksData[i].Type + "', " + options.jobOrderTrucksData[i].CustomerId + ", '" + options.jobOrderTrucksData[i].TransactionNo + "');\" >";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].TransactionNo + "</a></td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].Type + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].CustomerAddress + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].ItemDescription != null ? options.jobOrderTrucksData[i].ItemDescription.substr(0, 20) : null + "</td>";

                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].IsTransact === true ? "Closed" : "Open" + "</td>";

                    if (options.jobOrderTrucksData[i].IsTransact === true) {
                        lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">"
                            + "<a href='DownloadFile/?fileName=" + options.jobOrderTrucksData[i].FileName + "' alt='' download><img src='/Images/txt-download-icon.png' style='width:32px;' alt='Download File' title='Download File' /></a>"
                            + "<img src='/Images/export-icon.png' alt='Export' title='Export' style='width:32px; cursor:pointer;' onclick=\"exportToAccountingSoftware(this, '" + options.jobOrderTrucksData[i].TransactionNo + "');\" /></td>";
                    }
                    else {
                        lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\"><img src='/Images/preview-icon.png' alt='Preview' title='Preview' style='width:32px; cursor:pointer;' onclick=\"goToWayBillingList(this,'" + options.jobOrderTrucksData[i].TransactionNo + "');\" /></td>";
                    }
                }
                else {
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column\"><a href=\"javascript:void(0);\" onclick=\"openJobDetailsPopUp(this," + options.jobOrderTrucksData[i].TicketNo + ");\" >";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].TicketNo + "</a></td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].TruckType + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].Driver + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].Swamper + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].Customer + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].JobDescription.substr(0, 20) + "</td>";
                }
                lstCalendarBodyHtml += "</tr>";
            }

            lstCalendarBodyHtml += "</tbody></table></div>";

            //append all calendar parts to container
            $(lstCalendarHeaderHtml + lstCalendarBodyHtml).appendTo($lstContainer);
            //$weekDayColumns = $calendarContainer.find(".wc-day-column-inner");
            //$weekDayColumns.each(function (i, val) {
            //    $(this).height(50);
            //    if (!options.readonly) {
            //        self._addDroppableToWeekDay($(this));
            //        self._setupEventCreationForWeekDay($(this));
            //    }
            //});

            ////$calendarContainer.find(".wc-time-slot").height(options.timeslotHeight - 1); //account for border

            //$calendarContainer.find(".wc-time-header-cell").css({
            //    height: (50) - 11,
            //    padding: 5
            //});
        },

        /*
         * Render the main calendar layout
         */
        _renderCalendar: function () {

            var $calendarContainer, calendarNavHtml, calendarHeaderHtml, calendarBodyHtml, $weekDayColumns;
            var self = this;
            var options = this.options;

            $calendarContainer = $("<div class=\"wc-container\">").appendTo(self.element);
            //" + options.buttonText.today + "
            if (options.buttons) {
                ////calendarNavHtml = "<div class=\"wc-nav\"><select id='_branchDD'><option value='-1' selected = 'selected'>-Select Branch-</option>";
                calendarNavHtml = "<div class=\"wc-nav\"><select id='_branchDD'>";//Above commented by Pradeep On 14 jan 2014

                for (var i = 0; i < options.branches.length; i++) {
                    calendarNavHtml += "<option value='" + options.branches[i].BranchId + "'>" + options.branches[i].BranchName + "</option>";
                }

                var Month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                calendarNavHtml += "</select>\
                    <select id='_monthPicker' style='width:110px;'><option value='-1' >-Select Month-</option>";

                var _month = new Date().getMonth();

                for (var i = 0; i < 12; i++) {
                    if (_month == i) {
                        calendarNavHtml += "<option selected='selected' value='" + i + "'>" + Month[i] + "</option>";
                    }
                    else {
                        calendarNavHtml += "<option value='" + i + "'>" + Month[i] + "</option>";
                    }
                }


                calendarNavHtml += "</select>\
                    <select id='_yearPicker' style='width:110px;'><option value='-1'>-Select Year-</option>";

                var year = new Date().getFullYear();

                for (var i = year - 10; i < year + 10; i++) {
                    if (year == i) {
                        calendarNavHtml += "<option  selected = 'selected' value='" + i + "'>" + i + "</option>";
                    }
                    else {
                        calendarNavHtml += "<option value='" + i + "'>" + i + "</option>";
                    }

                }


                calendarNavHtml += "</select><button class=\"wc-today\">" + options.buttonText.today + "</button>\
                    <button class=\"wc-prev\">" + options.buttonText.lastWeek + "</button>\
                    <button class=\"wc-next\">" + options.buttonText.nextWeek + "</button>\
                    </div>";


                $(calendarNavHtml).appendTo($calendarContainer);

                $calendarContainer.find("#_monthPicker").change(function () {

                    self.element.weekCalendar("changeDateNav");
                    return false;
                });

                $calendarContainer.find("#_yearPicker").change(function () {

                    self.element.weekCalendar("changeDateNav");
                    return false;
                });


                $calendarContainer.find("#_branchDD").change(function () {

                    self.element.weekCalendar("changeBranch");
                    return false;
                });

                $calendarContainer.find(".wc-nav .wc-today").click(function () {
                    self.element.weekCalendar("today");
                    return false;
                });

                $calendarContainer.find(".wc-nav .wc-prev").click(function () {
                    self.element.weekCalendar("prevWeek");
                    return false;
                });

                $calendarContainer.find(".wc-nav .wc-next").click(function () {
                    self.element.weekCalendar("nextWeek");
                    return false;
                });

            }

            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

            //render calendar header
            calendarHeaderHtml = "<table class=\"wc-header\"><tbody><tr><td class=\"wc-listTime-column-header\">Truck Type</td><td class=\"wc-listTime-column-header\">Unit #</td>";
            for (var i = 1; i <= lastDay; i++) {
                calendarHeaderHtml += "<td class=\"wc-day-column-header wc-day-" + i + "\"></td>";
            }
            calendarHeaderHtml += "<td class=\"wc-scrollbar-shim\"></td></tr></tbody></table>";

            //render calendar body
            calendarBodyHtml = "<div class=\"wc-scrollable-grid\">\
                <table border=1 class=\"wc-time-slots\">\
                <tbody>";
            //start Added by Pradeep on 19 jan 2015 : 
            options.trucksData = this.options.GetTrucks($("#_branchDD").val());
            //END Added by Pradeep on 19 jan 2015 : 
            var start = 0;
            var end = options.trucksData.length;
            for (var i = start; i < end; i++) {
                calendarBodyHtml += "<tr><td class=\"wc-listGrid-timeslot-header\" TID=" + options.trucksData[i].TruckTypeId + ">";
                calendarBodyHtml += options.trucksData[i].TruckTypeName + "</td>";
                calendarBodyHtml += "<td class=\"wc-listGrid-timeslot-header\">";
                calendarBodyHtml += options.trucksData[i].Unit + "</td>";
                for (var j = 1; j <= lastDay; j++) {
                    calendarBodyHtml += "<td class=\"wc-day-column day-" + j + "\"><div class=\"wc-day-column-inner\"></div></td>"
                }
                calendarBodyHtml += "</tr>";
            }

            calendarBodyHtml += "</tbody></table></div>";

            //append all calendar parts to container
            $(calendarHeaderHtml + calendarBodyHtml).appendTo($calendarContainer);
            $weekDayColumns = $calendarContainer.find(".wc-day-column-inner");
            $weekDayColumns.each(function (i, val) {
                $(this).height(50);
                if (!options.readonly) {
                    self._addDroppableToWeekDay($(this));
                    self._setupEventCreationForWeekDay($(this));
                }
            });

            //$calendarContainer.find(".wc-time-slot").height(options.timeslotHeight - 1); //account for border

            $calendarContainer.find(".wc-time-header-cell").css({
                height: (50) - 11,
                padding: 5
            });
        },

        _renderListCalenderBody: function () {
            var $lstCalendarContainer, lstCalendarBodyHtml;
            var self = this;
            var options = this.options;

            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

            //$calendarContainer = $("<div class=\"wc-container\">").appendTo(self.element);

            $lstCalendarContainer = self.element.find(".wc-listContainer");

            //render calendar body
            lstCalendarBodyHtml = "<div class=\"wc-listScrollable-grid\">\
                <table border=1 class=\"wc-time-slots\">\
                <tbody>";

            var start = 0;
            var end = options.jobOrderTrucksData.length;


            for (var i = start; i < end; i++) {
                lstCalendarBodyHtml += "<tr><td class=\"wc-listGrid-data-column\">";
                lstCalendarBodyHtml += options.jobOrderTrucksData[i].UnitNo + "</td>";
                if (this.options.mapToCompanyId == 7) {
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column\"><a href=\"javascript:void(0);\" onclick=\"openMasterBillingDetails(this, '" + options.jobOrderTrucksData[i].Type + "', " + options.jobOrderTrucksData[i].CustomerId + ", '" + options.jobOrderTrucksData[i].TransactionNo + "');\" >";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].TransactionNo + "</a></td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].Type + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].CustomerAddress + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].ItemDescription != null ? options.jobOrderTrucksData[i].ItemDescription.substr(0, 20) : null + "</td>";

                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].IsTransact === true ? "Closed" : "Open" + "</td>";

                    if (options.jobOrderTrucksData[i].IsTransact === true) {
                        lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">"
                            + "<a href='DownloadFile/?fileName=" + options.jobOrderTrucksData[i].FileName + "' alt='' download><img src='/Images/txt-download-icon.png' style='width:32px;' alt='Download File' title='Download File' /></a>"
                            + "<img src='/Images/export-icon.png' alt='Export' title='Export' style='width:32px; cursor:pointer;' onclick=\"exportToAccountingSoftware(this, '" + options.jobOrderTrucksData[i].TransactionNo + "');\" /></td>";
                    }
                    else {
                        lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\"><img src='/Images/preview-icon.png' alt='Preview' title='Preview' style='width:32px; cursor:pointer;' onclick=\"goToWayBillingList(this,'" + options.jobOrderTrucksData[i].TransactionNo + "');\" /></td>";
                    }
                }
                else {
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column\"><a href=\"javascript:void(0);\" onclick=\"openJobDetailsPopUp(this," + options.jobOrderTrucksData[i].TicketNo + ");\" >";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].TicketNo + "</a></td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].TruckType + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].Driver + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].Swamper + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].Customer + "</td>";
                    lstCalendarBodyHtml += "<td class=\"wc-listGrid-data-column-f\">";
                    lstCalendarBodyHtml += options.jobOrderTrucksData[i].JobDescription.substr(0, 20) + "</td>";
                }
                lstCalendarBodyHtml += "</tr>";
            }

            lstCalendarBodyHtml += "</tbody></table></div>";

            //append all calendar parts to container
            $(lstCalendarBodyHtml).appendTo($lstCalendarContainer);
            //$weekDayColumns = $calendarContainer.find(".wc-day-column-inner");
            //$weekDayColumns.each(function (i, val) {
            //    $(this).height(50);
            //    if (!options.readonly) {
            //        self._addDroppableToWeekDay($(this));
            //        self._setupEventCreationForWeekDay($(this));
            //    }
            //});
        },

        _renderCalenderBody: function () {
            var $calendarContainer, calendarNavHtml, calendarHeaderHtml, calendarBodyHtml, $weekDayColumns;
            var self = this;
            var options = this.options;

            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

            //$calendarContainer = $("<div class=\"wc-container\">").appendTo(self.element);

            $calendarContainer = self.element.find(".wc-container");

            //render calendar body
            calendarBodyHtml = "<div class=\"wc-scrollable-grid\">\
                <table border=1 class=\"wc-time-slots\">\
                <tbody>";

            var start = 0;
            var end = options.trucksData.length;

            for (var i = start; i < end; i++) {
                calendarBodyHtml += "<tr><td class=\"wc-listGrid-timeslot-header\" TID=" + options.trucksData[i].TruckTypeId + ">";
                calendarBodyHtml += options.trucksData[i].TruckTypeName + "</td>";
                calendarBodyHtml += "<td class=\"wc-listGrid-timeslot-header\">";
                calendarBodyHtml += options.trucksData[i].Unit + "</td>";
                for (var j = 1; j <= lastDay; j++) {
                    calendarBodyHtml += "<td class=\"wc-day-column day-" + j + "\"><div class=\"wc-day-column-inner\"></div></td>"
                }
                calendarBodyHtml += "</tr>";
            }

            calendarBodyHtml += "</tbody></table></div>";

            //append all calendar parts to container
            $(calendarBodyHtml).appendTo($calendarContainer);
            $weekDayColumns = $calendarContainer.find(".wc-day-column-inner");
            $weekDayColumns.each(function (i, val) {
                $(this).height(50);
                if (!options.readonly) {
                    self._addDroppableToWeekDay($(this));
                    self._setupEventCreationForWeekDay($(this));
                }
            });
        },

        _renderCalenderHeader: function () {

            var $calendarContainer, calendarHeaderHtml;
            var self = this;
            var options = this.options;

            $calendarContainer = self.element.find(".wc-nav");

            $("table.wc-header").remove();

            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

            //render calendar header
            calendarHeaderHtml = "<table class=\"wc-header\"><tbody><tr><td class=\"wc-listTime-column-header\">Truck Type</td><td class=\"wc-listTime-column-header\">Unit #</td>";
            for (var i = 1; i <= lastDay; i++) {
                calendarHeaderHtml += "<td class=\"wc-day-column-header wc-day-" + i + "\"></td>";
            }
            calendarHeaderHtml += "<td class=\"wc-scrollbar-shim\"></td></tr></tbody></table>";

            //append all calendar parts to container
            $($calendarContainer).after(calendarHeaderHtml);
        },

        /*
         * setup mouse events for capturing new events
         */
        _setupEventCreationForWeekDay: function ($weekDay) {
            var self = this;
            var options = this.options;
            $weekDay.mousedown(function (event) {
                var $target = $(event.target);
                if ($target.hasClass("wc-day-column-inner")) {

                    var $newEvent = $("<div class=\"wc-cal-event wc-new-cal-event wc-new-cal-event-creating\"></div>");

                    $newEvent.css({ lineHeight: (options.timeslotHeight - 2) + "px", fontSize: (options.timeslotHeight / 2) + "px" });
                    $target.append($newEvent);

                    var columnOffset = $target.offset().top;
                    var clickY = event.pageY - columnOffset;
                    var clickYRounded = (clickY - (clickY % options.timeslotHeight)) / options.timeslotHeight;
                    var topPosition = clickYRounded * options.timeslotHeight;
                    $newEvent.css({ top: 0 });

                    $target.bind("mousemove.newevent", function (event) {
                        $newEvent.show();
                        var height = $(event.target).parents().height;
                        //snap to closest timeslot
                        $newEvent.css("height", height);

                    }).mouseup(function () {
                        $target.unbind("mousemove.newevent");
                        $newEvent.addClass("ui-corner-all");
                    });
                }

            }).mouseup(function (event) {

                var $target = $(event.target);

                var $weekDay = $target.closest(".wc-day-column-inner");
                var $newEvent = $weekDay.find(".wc-new-cal-event-creating");

                if ($newEvent.length) {

                    //if even created from a single click only, default height
                    if (!$newEvent.hasClass("ui-resizable-resizing")) {
                        $newEvent.css({ height: $target.parents().height() }).show();
                    }
                    var top = 0;
                    var eventDuration = self._getEventDurationFromPositionedEventElement($weekDay, $newEvent, top);

                    $newEvent.remove();

                    var truckId = $target.closest("tr").find(".wc-listGrid-timeslot-header").attr("tid");
                    var attendanceValue = "";


                    var newCalEvent = { start: eventDuration.start, end: eventDuration.end, txtTitle: options.newEventText, ddlTruckTypeId: truckId, attendanceValue: attendanceValue };
                    var $renderedCalEvent = self._renderEvent(newCalEvent, $weekDay);

                    if (!options.allowCalEventOverlap) {
                        self._adjustForEventCollisions($weekDay, $renderedCalEvent, newCalEvent, newCalEvent);
                        self._positionEvent($weekDay, $renderedCalEvent);
                    } else {
                        self._adjustOverlappingEvents($weekDay);
                    }

                    options.eventNew(newCalEvent, $renderedCalEvent);
                }
            });
        },

        /*
         * load calendar events for the week based on the date provided
         */
        _loadCalEvents: function (dateWithinWeek) {

            var date, weekStartDate, endDate, $weekDayColumns;
            var self = this;
            var options = this.options;
            date = dateWithinWeek || options.date;

            //date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


            //weekStartDate = self._dateFirstDayOfWeek(date);
            //weekEndDate = self._dateLastMilliOfWeek(date);

            options.calendarBeforeLoad(self.element);

            //self.element.data("startDate", weekStartDate);
            //self.element.data("endDate", weekEndDate);

            self.element.data("startDate", firstDay);
            self.element.data("endDate", lastDay);

            $weekDayColumns = self.element.find(".wc-day-column-inner");

            self._updateDayColumnHeader($weekDayColumns);

            //load events by chosen means
            if (typeof options.data == 'string') {
                if (options.loading) options.loading(true);
                var jsonOptions = {};
                jsonOptions[options.startParam || 'start'] = Math.round(weekStartDate.getTime() / 1000);
                jsonOptions[options.endParam || 'end'] = Math.round(weekEndDate.getTime() / 1000);
                $.getJSON(options.data, jsonOptions, function (data) {
                    self._renderEvents(data, $weekDayColumns);
                    if (options.loading) options.loading(false);
                });
            }
            else if ($.isFunction(options.data)) {
                options.data(firstDay, lastDay, $("#_branchDD").val(),
                      function (data) {
                          self._renderEvents(data, $weekDayColumns);
                      });
            }
            else if (options.data) {
                self._renderEvents(options.data, $weekDayColumns);
            }

            self._disableTextSelect($weekDayColumns);


        },

        /*
         * update the display of each day column header based on the calendar week
         */
        _updateDayColumnHeader: function ($weekDayColumns) {

            var self = this;
            var options = this.options;
            var currentDay = self._cloneDate(self.element.data("startDate"));
            var currentMonth = currentDay.getMonth();

            this._renderCalenderHeader();

            self.element.find(".wc-header td.wc-day-column-header").each(function (i, val) {
                if (currentMonth == currentDay.getMonth()) {
                    var dayName = options.useShortDayNames ? options.shortDays[currentDay.getDay()] : options.shortDays[currentDay.getDay()];

                    $(this).html(dayName + "<br/>" + self._formatDate(currentDay, options.dateFormat));
                    if (self._isToday(currentDay)) {
                        $(this).addClass("wc-today");
                    } else {
                        $(this).removeClass("wc-today");
                    }
                    currentDay = self._addDays(currentDay, 1);
                }
                else {
                    $(this).remove();
                }

            });

            //currentDay = self._dateFirstDayOfWeek(self._cloneDate(self.element.data("startDate")));

            currentDay = self._cloneDate(self.element.data("startDate"));

            var index = $("td.wc-day-column-header").index(self.element.find(".wc-header td.wc-today"));

            var cols = $(".wc-time-slots td.wc-day-column").eq(index);

            //$weekDayColumns.each(function (i, val) {
            //    
            //    $(this).data("startDate", self._cloneDate(currentDay));
            //    $(this).data("endDate", new Date(currentDay.getTime() + (MILLIS_IN_DAY)));
            //    if (self._isToday(currentDay)) {
            //        $(this).parent().addClass("wc-today");
            //    } else {
            //        $(this).parent().removeClass("wc-today");
            //    }

            //    currentDay = self._addDays(currentDay, 1);
            //});


            var end = options.trucksData.length;
            var _td = self.element.find("td.wc-scrollbar-shim");
            if (end > 4) {
                _td.css({ "width": "16px" });
            }
            else {
                _td.css({ "width": "0px" });
            }


            $("table.wc-time-slots tr").each(function () {

                //currentDay = self._dateFirstDayOfWeek(self._cloneDate(self.element.data("startDate")));

                currentDay = self._cloneDate(self.element.data("startDate"));

                var td = $(this).find(".wc-day-column");
                td.each(function (i, val) {
                    if (currentMonth == currentDay.getMonth()) {

                        var dayName = options.useShortDayNames ? options.longDays[currentDay.getDay()] : options.longDays[currentDay.getDay()];
                        if (dayName == "Saturday") {
                            $(this).css('background-color', '#7E8DFA');
                        }
                        if (dayName == "Sunday") {
                            $(this).css('background-color', '#F88686');
                        }
                        if (dayName != "Sunday" && dayName != "Saturday") {
                            $(this).css('background-color', '');
                        }

                        $(this).find("div").data("startDate", self._cloneDate(currentDay));
                        $(this).find("div").data("endDate", new Date(currentDay.getTime() + (MILLIS_IN_DAY)));

                        if (self._isToday(currentDay) && i == index) {
                            $(this).addClass("wc-today");
                        }
                        else {
                            $(this).removeClass("wc-today");
                        }

                        currentDay = self._addDays(currentDay, 1);
                    }
                    else {
                        $(this).remove();
                    }
                });
            });

        },

        /*
         * Render the events into the calendar
         */
        _renderEvents: function (events, $weekDayColumns) {

            var self = this;
            var options = this.options;
            var eventsToRender;

            if ($.isArray(events)) {
                eventsToRender = self._cleanEvents(events);
            } else if (events.events) {
                eventsToRender = self._cleanEvents(events.events);
            }
            if (events.options) {

                var updateLayout = false;
                //update options
                $.each(events.options, function (key, value) {
                    if (value !== options[key]) {
                        options[key] = value;
                        updateLayout = true;
                    }
                });

                self._computeOptions();

                if (updateLayout) {
                    self.element.empty();
                    self._renderCalendar();
                    $weekDayColumns = self.element.find(".wc-time-slots .wc-day-column-inner");
                    self._updateDayColumnHeader($weekDayColumns);
                    self._resizeCalendar();
                }

            }


            $.each(eventsToRender, function (i, calEvent) {

                var userHeader = "";
                self.element.find(".wc-time-slots td.wc-listGrid-timeslot-header").each(function () {
                    if ($(this).attr("tid") == calEvent.ddlTruckTypeId) {
                        userHeader = $(this).parent().find(".wc-day-column-inner");
                        return false;
                    }
                });

                var $weekDay = self._findWeekDayForEvent(calEvent, userHeader);

                if ($weekDay) {
                    self._renderEvent(calEvent, $weekDay);
                }
            });

            $weekDayColumns.each(function () {
                self._adjustOverlappingEvents($(this));
            });

            options.calendarAfterLoad(self.element);

            if (!eventsToRender.length) {
                options.noEvents();
            }

        },

        /*
         * Render a specific event into the day provided. Assumes correct
         * day for calEvent date
         */
        _renderEvent: function (calEvent, $weekDay) {
            var self = this;
            var options = this.options;
            if (calEvent.start.getTime() > calEvent.end.getTime()) {
                return; // can't render a negative height
            }

            var eventClass, eventHtml, $calEvent, $modifiedEvent;

            eventClass = calEvent.id ? "wc-cal-event" : "wc-cal-event wc-new-cal-event";
            eventHtml = "<div class=\"" + eventClass + " ui-corner-all\">\
                <div class=\"wc-time ui-corner-all\"></div>\
                <div class=\"wc-title\"></div></div>";

            $calEvent = $(eventHtml);
            $modifiedEvent = options.eventRender(calEvent, $calEvent);
            $calEvent = $modifiedEvent ? $modifiedEvent.appendTo($weekDay) : $calEvent.appendTo($weekDay);
            $calEvent.css({ lineHeight: (options.timeslotHeight - 2) + "px", fontSize: (options.timeslotHeight / 2) + "px" });

            self._refreshEventDetails(calEvent, $calEvent);
            self._positionEvent($weekDay, $calEvent);
            $calEvent.show();

            if (!options.readonly && options.resizable(calEvent, $calEvent)) {
                self._addResizableToCalEvent(calEvent, $calEvent, $weekDay)
            }
            if (!options.readonly && options.draggable(calEvent, $calEvent)) {
                self._addDraggableToCalEvent(calEvent, $calEvent);
            }

            options.eventAfterRender(calEvent, $calEvent);

            return $calEvent;

        },

        _adjustOverlappingEvents: function ($weekDay) {
            var self = this;
            if (self.options.allowCalEventOverlap) {
                var groupsList = self._groupOverlappingEventElements($weekDay);
                $.each(groupsList, function () {
                    var curGroups = this;
                    $.each(curGroups, function (groupIndex) {
                        var curGroup = this;

                        // do we want events to be displayed as overlapping
                        if (self.options.overlapEventsSeparate) {
                            var newWidth = 100 / curGroups.length;
                            var newLeft = groupIndex * newWidth;
                        } else {
                            // TODO what happens when the group has more than 10 elements
                            var newWidth = 100 - ((curGroups.length - 1) * 10);
                            var newLeft = groupIndex * 10;
                        }
                        $.each(curGroup, function () {
                            // bring mouseovered event to the front
                            if (!self.options.overlapEventsSeparate) {
                                $(this).bind("mouseover.z-index", function () {
                                    var $elem = $(this);
                                    $.each(curGroup, function () {
                                        $(this).css({ "z-index": "1" });
                                    });
                                    $elem.css({ "z-index": "3" });
                                });
                            }
                            $(this).css({ width: newWidth + "%", left: newLeft + "%", right: 0 });
                        });
                    });
                });
            }
        },


        /*
         * Find groups of overlapping events
         */
        _groupOverlappingEventElements: function ($weekDay) {
            var $events = $weekDay.find(".wc-cal-event:visible");
            var sortedEvents = $events.sort(function (a, b) {
                return $(a).data("calEvent").start.getTime() - $(b).data("calEvent").start.getTime();
            });

            var lastEndTime = new Date(0, 0, 0);
            var groups = [];
            var curGroups = [];
            var $curEvent;
            $.each(sortedEvents, function () {
                $curEvent = $(this);
                //checks, if the current group list is not empty, if the overlapping is finished
                if (curGroups.length > 0) {
                    if (lastEndTime.getTime() <= $curEvent.data("calEvent").start.getTime()) {
                        //finishes the current group list by adding it to the resulting list of groups and cleans it

                        groups.push(curGroups);
                        curGroups = [];
                    }
                }

                //finds the first group to fill with the event
                for (var groupIndex = 0; groupIndex < curGroups.length; groupIndex++) {
                    if (curGroups[groupIndex].length > 0) {
                        //checks if the event starts after the end of the last event of the group
                        if (curGroups[groupIndex][curGroups[groupIndex].length - 1].data("calEvent").end.getTime() <= $curEvent.data("calEvent").start.getTime()) {
                            curGroups[groupIndex].push($curEvent);
                            if (lastEndTime.getTime() < $curEvent.data("calEvent").end.getTime()) {
                                lastEndTime = $curEvent.data("calEvent").end;
                            }
                            return;
                        }
                    }
                }
                //if not found, creates a new group
                curGroups.push([$curEvent]);
                if (lastEndTime.getTime() < $curEvent.data("calEvent").end.getTime()) {
                    lastEndTime = $curEvent.data("calEvent").end;
                }
            });
            //adds the last groups in result
            if (curGroups.length > 0) {
                groups.push(curGroups);
            }
            return groups;
        },


        /*
         * find the weekday in the current calendar that the calEvent falls within
         */
        _findWeekDayForEvent: function (calEvent, $weekDayColumns) {

            var $weekDay;
            $weekDayColumns.each(function () {
                if ($(this).data("startDate").getTime() <= calEvent.start.getTime() && $(this).data("endDate").getTime() > calEvent.end.getTime()) {
                    $weekDay = $(this);
                    return false;
                }
            });
            return $weekDay;
        },

        /*
         * update the events rendering in the calendar. Add if does not yet exist.
         */
        _updateEventInCalendar: function (calEvent) {
            var self = this;
            var options = this.options;
            self._cleanEvent(calEvent);

            if (calEvent.id) {
                self.element.find(".wc-cal-event").each(function () {
                    if ($(this).data("calEvent").id === calEvent.id || $(this).hasClass("wc-new-cal-event")) {
                        $(this).remove();
                        return false;
                    }
                });
            }

            var userHeader = "";
            self.element.find(".wc-time-slots td.wc-listGrid-timeslot-header").each(function () {
                if ($(this).attr("tid") == calEvent.ddlTruckTypeId) {
                    userHeader = $(this).parent().find(".wc-day-column-inner");
                    return false;
                }
            });

            var $weekDay = self._findWeekDayForEvent(calEvent, userHeader);
            if ($weekDay) {
                var $calEvent = self._renderEvent(calEvent, $weekDay);
                self._adjustForEventCollisions($weekDay, $calEvent, calEvent, calEvent);
                self._refreshEventDetails(calEvent, $calEvent);
                self._positionEvent($weekDay, $calEvent);
                self._adjustOverlappingEvents($weekDay);
            }
        },

        /*
         * Position the event element within the weekday based on it's start / end dates.
         */
        _positionEvent: function ($weekDay, $calEvent) {
            var options = this.options;
            var calEvent = $calEvent.data("calEvent");
            var pxPerMillis = $weekDay.height() / options.millisToDisplay;
            var firstHourDisplayed = options.businessHours.limitDisplay ? options.businessHours.start : 0;
            var startMillis = calEvent.start.getTime() - new Date(calEvent.start.getFullYear(), calEvent.start.getMonth(), calEvent.start.getDate(), firstHourDisplayed).getTime();
            var eventMillis = calEvent.end.getTime() - calEvent.end.getTime();
            var pxTop = pxPerMillis * startMillis;
            var pxHeight = pxPerMillis * eventMillis;
            $calEvent.css({ top: 0, height: 50 });
        },

        /*
         * Determine the actual start and end times of a calevent based on it's
         * relative position within the weekday column and the starting hour of the
         * displayed calendar.
         */
        _getEventDurationFromPositionedEventElement: function ($weekDay, $calEvent, top) {
            var options = this.options;
            var startOffsetMillis = options.businessHours.limitDisplay ? options.businessHours.start * 60 * 60 * 1000 : 0;
            //var start = new Date($weekDay.data("startDate").getTime() + startOffsetMillis + Math.round(top / options.timeslotHeight) * options.millisPerTimeslot);
            //var end = new Date(start.getTime() + ($calEvent.height() / options.timeslotHeight) * options.millisPerTimeslot);
            var start = $weekDay.data("startDate");
            var end = $weekDay.data("startDate");

            return { start: start, end: end };
        },

        /*
         * If the calendar does not allow event overlap, adjust the start or end date if necessary to
         * avoid overlapping of events. Typically, shortens the resized / dropped event to it's max possible
         * duration  based on the overlap. If no satisfactory adjustment can be made, the event is reverted to
         * it's original location.
         */
        _adjustForEventCollisions: function ($weekDay, $calEvent, newCalEvent, oldCalEvent, maintainEventDuration) {
            var options = this.options;

            if (options.allowCalEventOverlap) {
                return;
            }
            var adjustedStart, adjustedEnd;
            var self = this;

            $weekDay.find(".wc-cal-event").not($calEvent).each(function () {
                var currentCalEvent = $(this).data("calEvent");

                //has been dropped onto existing event overlapping the end time
                if (newCalEvent.start.getTime() < currentCalEvent.end.getTime()
                      && newCalEvent.end.getTime() >= currentCalEvent.end.getTime()) {

                    adjustedStart = currentCalEvent.end;
                }

                //has been dropped onto existing event overlapping the start time
                if (newCalEvent.end.getTime() > currentCalEvent.start.getTime()
                      && newCalEvent.start.getTime() <= currentCalEvent.start.getTime()) {
                    adjustedEnd = currentCalEvent.start;
                }
                //has been dropped inside existing event with same or larger duration
                if (!oldCalEvent.resizable || (newCalEvent.end.getTime() <= currentCalEvent.end.getTime()
                      && newCalEvent.start.getTime() >= currentCalEvent.start.getTime())) {

                    adjustedStart = oldCalEvent.start;
                    adjustedEnd = oldCalEvent.end;
                    return false;
                }

            });


            newCalEvent.start = adjustedStart || newCalEvent.start;

            if (adjustedStart && maintainEventDuration) {
                newCalEvent.end = new Date(adjustedStart.getTime() + (oldCalEvent.end.getTime() - oldCalEvent.start.getTime()));
                self._adjustForEventCollisions($weekDay, $calEvent, newCalEvent, oldCalEvent);
            } else {
                newCalEvent.end = adjustedEnd || newCalEvent.end;
            }


            //reset if new cal event has been forced to zero size
            if (newCalEvent.start.getTime() >= newCalEvent.end.getTime()) {
                newCalEvent.start = oldCalEvent.start;
                newCalEvent.end = oldCalEvent.end;
            }

            $calEvent.data("calEvent", newCalEvent);
        },

        /*
         * Add draggable capabilities to an event
         */
        _addDraggableToCalEvent: function (calEvent, $calEvent) {
        },

        /*
         * Add droppable capabilites to weekdays to allow dropping of calEvents only
         */
        _addDroppableToWeekDay: function ($weekDay) {
        },

        /*
         * Add resizable capabilities to a calEvent
         */
        _addResizableToCalEvent: function (calEvent, $calEvent, $weekDay) {
            var self = this;
            var options = this.options;
            $calEvent.resizable({
                grid: options.timeslotHeight,
                containment: $weekDay,
                handles: "e,w",
                minHeight: options.timeslotHeight,
                stop: function (event, ui) {
                    var $calEvent = ui.element;
                    var newEnd = new Date($calEvent.data("calEvent").start.getTime() + ($calEvent.height() / options.timeslotHeight) * options.millisPerTimeslot);
                    var newCalEvent = $.extend(true, { start: calEvent.start, end: newEnd }, calEvent);
                    self._adjustForEventCollisions($weekDay, $calEvent, newCalEvent, calEvent);

                    self._refreshEventDetails(newCalEvent, $calEvent);
                    self._positionEvent($weekDay, $calEvent);
                    self._adjustOverlappingEvents($weekDay);
                    //trigger resize callback
                    options.eventResize(newCalEvent, calEvent, $calEvent);
                    $calEvent.data("preventClick", true);
                    setTimeout(function () {
                        $calEvent.removeData("preventClick");
                    }, 500);
                }
            });
        },

        /*
         * Refresh the displayed details of a calEvent in the calendar
         */
        _refreshEventDetails: function (calEvent, $calEvent) {
            var self = this;
            var options = this.options;
            //$calEvent.find(".wc-time").html(self._formatDate(calEvent.start, options.timeFormat) + options.timeSeparator + self._formatDate(calEvent.end, options.timeFormat));

            var _trucks = jQuery.grep(options.trucksData, function (x) {
                return x.TruckTypeId == calEvent.ddlTruckTypeId;
            });

            var Branch = jQuery.grep(options.branches, function (x) {
                return x.BranchId == _trucks[0].BranchId;
            });

            var _title = [];
            _title = jQuery.grep(options.attendanceType, function (x) {
                return x.AttendanceTypeId == calEvent.ddlAttendanceValue;
            });

            if (_title != "" && _title != null) {
                $calEvent.css('background-color', _title[0].Color);
                $calEvent.find(".wc-time ").css('background-color', _title[0].Color);
                $calEvent.find(".wc-time").html('<strong>' + _title[0].AttendanceCode + '</strong>');

                //alert(calEvent.ticket);

                //if (Branch != null && Branch != undefined && Branch != [] && Branch != "") {
                //    $calEvent.find(".wc-title").html('(' + Branch[0].BranchCode + ')');                
                //}
                /*
                    * Replace Branch Code From TicketNo in Scheduler by Sudarshan on 02/04/2015
                */
                if (calEvent.ticket != null && calEvent.ticket != undefined && calEvent.ticket != [] && calEvent.ticket != "") {
                    $calEvent.find(".wc-title").html(calEvent.ticket);
                    //$calEvent.find(".wc-title").html('(' + options.jobOrderTrucksData[0].TicketNo + ')');
                }
                else {
                    //$calEvent.find(".wc-title").html("(NA)");
                    $calEvent.find(".wc-title").html('(' + Branch[0].BranchCode + ')');
                }
            }
            $calEvent.data("calEvent", calEvent);
        },

        /*
         * Clear all cal events from the calendar
         */
        _clearCalendar: function () {
            //this.element.find(".wc-day-column-inner div").remove();//Commented by Pradeep on 5 Jan 2014 as per comment on Basecamp between30 to 4 jan
        },

        /*
         * Scroll the calendar to a specific hour
         */
        _scrollToHour: function (hour) {

            var self = this;
            var options = this.options;
            var $scrollable = this.element.find(".wc-scrollable-grid");
            var slot = hour;
            if (self.options.businessHours.limitDisplay) {
                if (hour <= self.options.businessHours.start) {
                    slot = 0;
                } else if (hour > self.options.businessHours.end) {
                    slot = self.options.businessHours.end -
                    self.options.businessHours.start - 1;
                } else {
                    slot = hour - self.options.businessHours.start;
                }

            }

            var $target = this.element.find(".wc-listGrid-timeslot-header .wc-hour-header:eq(" + slot + ")");

            $scrollable.animate({ scrollTop: 0 }, 0, function () {
                var targetOffset = $target.offset().top;
                var scroll = targetOffset - $scrollable.offset().top - $target.outerHeight();
                $scrollable.animate({ scrollTop: scroll }, options.scrollToHourMillis);
            });
        },

        /*
         * find the hour (12 hour day) for a given hour index
         */
        _hourForIndex: function (index) {
            if (index === 0) { //midnight
                return 12;
            } else if (index < 13) { //am
                return index;
            } else { //pm
                return index - 12;
            }
        },

        _24HourForIndex: function (index) {
            if (index === 0) { //midnight
                return "00:00";
            } else if (index < 10) {
                return "0" + index + ":00";
            } else {
                return index + ":00";
            }
        },

        _amOrPm: function (hourOfDay) {
            return hourOfDay < 12 ? "AM" : "PM";
        },

        _isToday: function (date) {
            var clonedDate = this._cloneDate(date);
            this._clearTime(clonedDate);
            var today = new Date();
            this._clearTime(today);
            return today.getTime() === clonedDate.getTime();
        },

        _hasScroll: function (div) {

            return div.get(0).scrollHeight > div.css("height");
        },

        /*
         * Clean events to ensure correct format
         */
        _cleanEvents: function (events) {
            var self = this;
            $.each(events, function (i, event) {
                self._cleanEvent(event);
            });
            return events;
        },

        /*
         * Clean specific event
         */
        _cleanEvent: function (event) {
            if (event.date) {
                event.start = event.date;
            }
            event.start = new Date(event.start);
            event.end = new Date(event.end);

            event.start = this._cleanDate(event.start);
            event.end = this._cleanDate(event.end);
            if (!event.end) {
                event.end = this._addDays(this._cloneDate(event.start), 1);
            }
        },

        /*
         * Disable text selection of the elements in different browsers
         */
        _disableTextSelect: function ($elements) {
            $elements.each(function () {
                if ($.browser.mozilla) {//Firefox
                    $(this).css('MozUserSelect', 'none');
                } else if ($.browser.msie) {//IE
                    $(this).bind('selectstart', function () {
                        return false;
                    });
                } else {//Opera, etc.
                    $(this).mousedown(function () {
                        return false;
                    });
                }
            });
        },

        /*
         * returns the date on the first millisecond of the week
         */
        _dateFirstDayOfWeek: function (date) {
            var self = this;
            var midnightCurrentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            var millisToSubtract = self._getAdjustedDayIndex(midnightCurrentDate) * 86400000;
            return new Date(midnightCurrentDate.getTime() - millisToSubtract);

        },

        /*
         * returns the date on the first millisecond of the last day of the week
         */
        _dateLastDayOfWeek: function (date) {
            var self = this;
            var midnightCurrentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            var millisToAdd = (6 - self._getAdjustedDayIndex(midnightCurrentDate)) * MILLIS_IN_DAY;
            return new Date(midnightCurrentDate.getTime() + millisToAdd);
        },

        /*
         * gets the index of the current day adjusted based on options
         */
        _getAdjustedDayIndex: function (date) {

            var midnightCurrentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            var currentDayOfStandardWeek = midnightCurrentDate.getDay();
            var days = [0, 1, 2, 3, 4, 5, 6];
            this._rotate(days, this.options.firstDayOfWeek);
            return days[currentDayOfStandardWeek];
        },

        /*
         * returns the date on the last millisecond of the week
         */
        _dateLastMilliOfWeek: function (date) {
            var lastDayOfWeek = this._dateLastDayOfWeek(date);
            return new Date(lastDayOfWeek.getTime() + (MILLIS_IN_DAY));

        },

        /*
         * Clear the time components of a date leaving the date
         * of the first milli of day
         */
        _clearTime: function (d) {
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
            return d;
        },

        /*
         * add specific number of days to date
         */
        _addDays: function (d, n, keepTime) {
            d.setDate(d.getDate() + n);
            if (keepTime) {
                return d;
            }
            return this._clearTime(d);
        },

        /*
         * Rotate an array by specified number of places.
         */
        _rotate: function (a /*array*/, p /* integer, positive integer rotate to the right, negative to the left... */) {
            for (var l = a.length, p = (Math.abs(p) >= l && (p %= l), p < 0 && (p += l), p), i, x; p; p = (Math.ceil(l / p) - 1) * p - l + (l = p)) {
                for (i = l; i > p; x = a[--i], a[i] = a[i - p], a[i - p] = x);
            }
            return a;
        },

        _cloneDate: function (d) {
            return new Date(d.getTime());
        },

        /*
         * return a date for different representations
         */
        _cleanDate: function (d) {
            if (typeof d == 'string') {
                return $.weekCalendar.parseISO8601(d, true) || Date.parse(d) || new Date(parseInt(d));
            }
            if (typeof d == 'number') {
                return new Date(d);
            }
            return d;
        },

        /*
         * date formatting is adapted from
         * http://jacwright.com/projects/javascript/date_format
         */
        _formatDate: function (date, format) {
            var options = this.options;
            var returnStr = '';
            for (var i = 0; i < format.length; i++) {
                var curChar = format.charAt(i);
                if ($.isFunction(this._replaceChars[curChar])) {
                    returnStr += this._replaceChars[curChar](date, options);
                } else {
                    returnStr += curChar;
                }
            }
            return returnStr;
        },

        _replaceChars: {

            // Day
            d: function (date) {
                return (date.getDate() < 10 ? '0' : '') + date.getDate();
            },
            D: function (date, options) {
                return options.shortDays[date.getDay()];
            },
            j: function (date) {
                return date.getDate();
            },
            l: function (date, options) {
                return options.longDays[date.getDay()];
            },
            N: function (date) {
                return date.getDay() + 1;
            },
            S: function (date) {
                return (date.getDate() % 10 == 1 && date.getDate() != 11 ? 'st' : (date.getDate() % 10 == 2 && date.getDate() != 12 ? 'nd' : (date.getDate() % 10 == 3 && date.getDate() != 13 ? 'rd' : 'th')));
            },
            w: function (date) {
                return date.getDay();
            },
            z: function (date) {
                return "Not Yet Supported";
            },
            // Week
            W: function (date) {
                return "Not Yet Supported";
            },
            // Month
            F: function (date, options) {
                return options.longMonths[date.getMonth()];
            },
            m: function (date) {
                return (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
            },
            M: function (date, options) {
                return options.shortMonths[date.getMonth()];
            },
            n: function (date) {
                return date.getMonth() + 1;
            },
            t: function (date) {
                return "Not Yet Supported";
            },
            // Year
            L: function (date) {
                return "Not Yet Supported";
            },
            o: function (date) {
                return "Not Supported";
            },
            Y: function (date) {
                return date.getFullYear();
            },
            y: function (date) {
                return ('' + date.getFullYear()).substr(2);
            },
            // Time
            a: function (date) {
                return date.getHours() < 12 ? 'am' : 'pm';
            },
            A: function (date) {
                return date.getHours() < 12 ? 'AM' : 'PM';
            },
            B: function (date) {
                return "Not Yet Supported";
            },
            g: function (date) {
                return date.getHours() % 12 || 12;
            },
            G: function (date) {
                return date.getHours();
            },
            h: function (date) {
                return ((date.getHours() % 12 || 12) < 10 ? '0' : '') + (date.getHours() % 12 || 12);
            },
            H: function (date) {
                return (date.getHours() < 10 ? '0' : '') + date.getHours();
            },
            i: function (date) {
                return (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
            },
            s: function (date) {
                return (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
            },
            // Timezone
            e: function (date) {
                return "Not Yet Supported";
            },
            I: function (date) {
                return "Not Supported";
            },
            O: function (date) {
                return (date.getTimezoneOffset() < 0 ? '-' : '+') + (date.getTimezoneOffset() / 60 < 10 ? '0' : '') + (date.getTimezoneOffset() / 60) + '00';
            },
            T: function (date) {
                return "Not Yet Supported";
            },
            Z: function (date) {
                return date.getTimezoneOffset() * 60;
            },
            // Full Date/Time
            c: function (date) {
                return "Not Yet Supported";
            },
            r: function (date) {
                return date.toString();
            },
            U: function (date) {
                return date.getTime() / 1000;
            }
        }

    });

    $.extend($.ui.weekCalendar, {
        version: '1.2.2-pre',
        getter: ['getTimeslotTimes', 'getData', 'formatDate', 'formatTime', 'newFormatDate'],
        defaults: {
            date: new Date(),
            timeFormat: "h:i a",
            dateFormat: "d",
            newDateFormat: "M d, Y",
            use24Hour: false,
            daysToShow: 7,
            firstDayOfWeek: 0, // 0 = Sunday, 1 = Monday, 2 = Tuesday, ... , 6 = Saturday
            useShortDayNames: false,
            timeSeparator: " to ",
            startParam: "start",
            endParam: "end",
            businessHours: { start: 8, end: 18, limitDisplay: false },
            newEventText: "New Event",
            timeslotHeight: 20,
            defaultEventLength: 2,
            timeslotsPerHour: 4,
            trucksData: [],
            buttons: true,
            buttonText: {
                today: "Current Month",
                lstToday: "Current Day",
                lastWeek: "&nbsp;&lt;&nbsp;",
                nextWeek: "&nbsp;&gt;&nbsp;"
            },
            scrollToHourMillis: 500,
            allowCalEventOverlap: false,
            overlapEventsSeparate: false,
            readonly: false,
            draggable: function (calEvent, element) {
                return true;
            },
            resizable: function (calEvent, element) {
                return true;
            },
            eventClick: function () {
            },
            eventRender: function (calEvent, element) {
                return element;
            },
            eventAfterRender: function (calEvent, element) {
                return element;
            },
            eventDrag: function (calEvent, element) {
            },
            eventDrop: function (calEvent, element) {
            },
            eventResize: function (calEvent, element) {
            },
            eventNew: function (calEvent, element) {
            },
            eventMouseover: function (calEvent, $event) {
            },
            eventMouseout: function (calEvent, $event) {
            },
            calendarBeforeLoad: function (truckScheduler) {
            },
            calendarAfterLoad: function (truckScheduler) {
            },
            noEvents: function () {
            },
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            getCustomDate: 'No branch selected yet!',
            lstDay: new Date().getDate(),
            mapToCompanyId: 5
        }
    });

    var MILLIS_IN_DAY = 86400000;
    var MILLIS_IN_WEEK = MILLIS_IN_DAY * 7;

    $.weekCalendar = function () {
        return {
            parseISO8601: function (s, ignoreTimezone) {

                // derived from http://delete.me.uk/2005/03/iso8601.html
                var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
                             "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
                             "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
                var d = s.match(new RegExp(regexp));
                if (!d) return null;
                var offset = 0;
                var date = new Date(d[1], 0, 1);
                if (d[3]) {
                    date.setMonth(d[3] - 1);
                }
                if (d[5]) {
                    date.setDate(d[5]);
                }
                if (d[7]) {
                    date.setHours(d[7]);
                }
                if (d[8]) {
                    date.setMinutes(d[8]);
                }
                if (d[10]) {
                    date.setSeconds(d[10]);
                }
                if (d[12]) {
                    date.setMilliseconds(Number("0." + d[12]) * 1000);
                }
                if (!ignoreTimezone) {
                    if (d[14]) {
                        offset = (Number(d[16]) * 60) + Number(d[17]);
                        offset *= ((d[15] == '-') ? 1 : -1);
                    }
                    offset -= date.getTimezoneOffset();
                }
                return new Date(Number(date) + (offset * 60 * 1000));
            }
        };
    }();


})(jQuery);
