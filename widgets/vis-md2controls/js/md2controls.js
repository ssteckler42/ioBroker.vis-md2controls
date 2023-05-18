/*
    ioBroker.vis md2controls Widget-Set
    version: "0.0.2"
    Copyright 2020 Sven Steckler
*/
"use strict";

// add translations for edit mode
if (vis.editMode) {
    $.extend(true, systemDictionary, {
        "title": { "en": "Title", "de": "Titel" },
        "subtitle": { "en": "Subtitle", "de": "Untertitel" },
        "label": { "en": "Label", "de": "Bezeichnung" },
        "mdicon": { "en": "Material Icon", "de": "Material Icon" },
        "oid_squeezebox_artist": { "en": "Artist", "de": "Künstler ID" }
    });
}

// add translations for non-edit mode
$.extend(true, systemDictionary, {
    "Instance": { "en": "Instance", "de": "Instanz", "ru": "?????????" },
    "open": { "en": "open", "de": "offen", "ru": "?????????" },
    "closed": { "en": "closed", "de": "geschlossen", "ru": "?????????" },
    "on": { "en": "on", "de": "an", "ru": "?????????" },
    "off": { "en": "off", "de": "aus", "ru": "?????????" }
});

vis.binds['vis-md2controls'] = {
    version: "0.0.1",
    showVersion: function () {
        if (vis.binds['vis-md2controls'].version) {
            console.log('Version md2controls: ' + vis.binds['vis-md2controls'].version);
            vis.binds['vis-md2controls'].version = null;
        }
    },
    tplMD2C_Switch: function (widgetID, view, data) {
        var $div = $('#' + widgetID);

        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['vis-md2controls'].tplMD2C_Switch(widgetID, view, data);
            }, 100);
        }

        function update(state) {
            var $tmp = $('#' + widgetID + '_checkbox');
            if (state == '0') {
                state = false;
            }
            $tmp.prop('checked', state);
            var $tmp = $('#' + widgetID + '_switch');
            if (state) {
                $tmp.prop('class', 'mdui-switch ' + data.attr('mduiclass-on'));
            }
            else {
                $tmp.prop('class', 'mdui-switch ' + data.attr('mduiclass-off'));
            }

        }

        function updatePower(value) {
            var $tmp = $('#' + widgetID + '_value');
            var suffix = data.suffix
            $tmp.prop('innerHTML', value.toFixed(0) + suffix); 

        }


        if (!vis.editMode) {
            var $this = $('#' + widgetID + '_checkbox');
            $this.change(function () {
                var $this_ = $(this);
                vis.setValue($this_.data('oid'), $this_.prop('checked'));
            });
        }

        if (data.oid) {
            // subscribe on updates of value
            vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
                update(newVal);
            });
            // if (data.oid-working) {
            //     vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {}
            //     );	
            // }
            // set current value
            update(vis.states[data.oid + '.val']);
        }
        
        if (data.oidpower) {
            // subscribe on updates of value
            vis.states.bind(data.oidpower + '.val', function (e, newVal, oldVal) {
                updatePower(newVal);
            });
            // set current value
            updatePower(vis.states[data.oidpower + '.val']);
        }


		if (data.readonly === true) {
			$('#' + widgetID + '_checkbox').prop("disabled", "disabled");
		}	
    },
	tplMD2C_Gauge: function (widgetID, view, data) {
        var $div = $('#' + widgetID);

        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['vis-md2controls'].tplMD2C_Gauge(widgetID, view, data);
            }, 100);
        }
		// init gauge
        $('#' + widgetID + '_gauge').gaugeMeter();
        
		function updateValue(value) {
            $('#' + widgetID + '_gauge').gaugeMeter({used:parseFloat(value)});;
        }

  //      if (!vis.editMode) {
  //          var $this = $('#' + widgetID + '_gauge');
  //          $this.change(function () {
  //              var $this_ = $(this);
  //              vis.setValue($this_.data('oid'), $this_.prop('checked'));
  //          });
  //      }

        if (data.oid) {
            // subscribe on updates of value
            vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
                updateValue(newVal);
            });
            // if (data.oid-working) {
            //     vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {}
            //     );	
            // }
            // set current value
            updateValue(vis.states[data.oid + '.val']);
        }
    },
    tplMD2C_Dimmer: function (widgetID, view, data) {
        var $div = $('#' + widgetID);

        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['vis-md2controls'].tplMD2C_Dimmer(widgetID, view, data);
            }, 100);
        }

        function updateSwitch(value) {
            //Wenn der Dimmer per VIS ausgeschalten wird, wird der Trigger erst mit xy,5% ausgeführt und dann mit 0%
            //damit die Checkbox nicht aus/an und wieder aus geht, wird hier xy,5% ignoriert
            if (value % 1 == 0.5) return;
            if (data.attr('oid-working')) {
                var isWorking = vis.states[data.attr('oid-working') + '.val']
                if (isWorking) return;
            }
            var hasValue = (value > 1)

            var checkBox = $('#' + widgetID + '_checkbox');
            checkBox.prop('checked', hasValue);
            if (data.sliderHideOnZero && !vis.editMode) {
                var slider = $('#' + widgetID + '_slider');
                slider.prop('style').display = (hasValue) ? 'inherit' : 'none';
                if (data.attr('oid-color')) {
                    var cslider = $('#' + widgetID + '_colorslider');
                    cslider.prop('style').display = (hasValue) ? 'inherit' : 'none';
                }

            }
        }

        if (data.attr('oid-color')) {
            var slider = $('#' + widgetID + '_colorslider');
            slider.prop('style').display = 'inherit';
        };

        if (!vis.editMode) {
            var $this = $('#' + widgetID + '_checkbox');
            $this.change(function () {
                var $this_ = $(this);
                var value = ($this_.prop('checked')) ? data.attr('sliderInitialValue') : 0
                vis.setValue(data.oid, value);

            });
        }

        if (data.oid) {
            // subscribe on updates of value
            vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
                updateSwitch(newVal);
            });
            // set current value
            updateSwitch(vis.states[data.oid + '.val']);
        }
    },
    tplMD2C_Squeeze: function (widgetID, view, data) {
        var $div = $('#' + widgetID);

        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['vis-md2controls'].tplMD2C_Squeeze(widgetID, view, data);
            }, 100);
        }

        function getValue(oid) {
            var value = vis.states[oid + '.val'];
            return value
        }


        function updateTitle() {
            var value = ''
            var $crtl = $('#' + widgetID + '_title');
            $crtl.prop('innerHTML', getValue(data.oid_squeezebox_title));

            $crtl = $('#' + widgetID + '_artist');
            $crtl.prop('innerHTML', getValue(data.oid_squeezebox_artist));

            $crtl = $('#' + widgetID + '_album');
            if (isRadio()) {
                value = '<i class="mdi mdi-radio"></i> ';
                value += vis.states[data.oid_squeezebox_radioname + '.val'];
            }
            else {
                value = getValue(data.oid_squeezebox_album);
            };
            $crtl.prop('innerHTML', value);

        }

        function toHHMMSS(secs) {
            var result = ''
            if (secs / 3600 >= 1 ) {
                // show hours only if time is greater then an hour
                result = Math.floor(secs/3600) 
                // always use leading zero for minutes
                result += ':';
                result  += ("00" + Math.floor((secs % 3600) / 60)).slice(-2);
            }
            else {
                result = Math.floor((secs % 3600) / 60);
            }
            result += ':';
            result += ("00" + (secs % 3600) % 60).slice(-2);
            return result

        } 


        function updateTimer() {
            var duration = parseInt(getValue(data.oid_squeezebox_duration));
            var elapsed = parseInt(getValue(data.oid_squeezebox_elapsed));
            var percentElapsed = 0
            var $crtl = $('#' + widgetID + '_elapsed');
            $crtl.prop('innerHTML', toHHMMSS(elapsed));

            if (isRadio()) {
                $('#' + widgetID + '_timebar').hide();
                $('#' + widgetID + '_duration').hide();

            }
            else {
                $('#' + widgetID + '_timebar').show();

            if (duration > 0) {
                percentElapsed = parseInt(100 * elapsed / duration)

            }
            $crtl = $('#' + widgetID + '_timebarvalue');
            $crtl.css('width', percentElapsed + '%')
            $crtl = $('#' + widgetID + '_duration');
            $crtl.prop('innerHTML', toHHMMSS(duration));

        }
        }

        function isRadio() {
            var value = vis.states[data.oid_squeezebox_type + '.val']
            return value.indexOf('adio') !== -1
        }

        if (!vis.editMode) {
            //var $this = $('#' + widgetID + '_checkbox');
            //$this.change(function () {
            //    var $this_ = $(this);
            //    var value = ($this_.prop('checked')) ? data.attr('sliderInitialValue') : 0
            //    vis.setValue(data.oid, value);

            //});
        }



        if (data.oid_squeezebox) {
            // subscribe on updates of value

            vis.states.bind(data.oid_squeezebox_title + '.val', function (e, newVal, oldVal) {
                updateTitle();
            });

            vis.states.bind(data.oid_squeezebox_elapsed + '.val', function (e, newVal, oldVal) {
                updateTimer();
            });
            vis.states.bind(data.oid_squeezebox_duration + '.val', function (e, newVal, oldVal) {
                updateTimer();
            });

            // set current value
            updateTitle();
            updateTimer();
        }
    }
};

vis.binds['vis-md2controls'].showVersion();