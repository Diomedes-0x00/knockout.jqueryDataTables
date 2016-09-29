/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-3.1.1.js" />
/// <reference path="../DataTables/jquery.dataTables.js" />

(function () {
    var TEMPLATE_KEY = "jqDataTable-knockout";
    var DATA_BINDER = 'data';
    

    ko.bindingHandlers.jqDataTable = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            $.fn.dataTable.ext.errMode = 'none';
            var table = $(element).parent('table');

            if (table == null || table.length == 0) {
                throw new Error('Binding must be applied to only a table element ');
            }

            if ($.fn.dataTable.isDataTable(element)) {
                throw new Error('jqDataTable binding cannot be applied to an element which is already a datatable');
            }

            var options = ko.unwrap(valueAccessor());
                       

            options = $.extend({
                deferRender: true,
                fnRowCallback: function (row, data2, index) {
                   
                    var tbody = $(this).children('tbody');
                    var bindingContext = ko.contextFor(tbody[0]);
                    var template = tbody.data(TEMPLATE_KEY);

                    if (data2.koVM != null) {
                        $(row).html($(template).html());  //replace rendered row with template

                        var childBindingContext = bindingContext.createChildContext(data2.koVM);

                        ko.applyBindingsToDescendants(childBindingContext, row);
                    }

                    return row;

                   

                }
            }, options);

            var $element = $(element);

            var templateContents = $element.html();

            //store template on element 

            $element.data(TEMPLATE_KEY, templateContents);

            $element.empty();

            table.DataTable(options);
            
            return {controlsDescendantBindings: true};
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
           
            var data = [];
            var d2 = [];

            if (allBindings.has(DATA_BINDER)) {
                data = ko.unwrap(allBindings.get(DATA_BINDER));
            }

            for (var x = 0; x < data.length; x++) {
                var o = ko.toJS(data[x]);
                o.koVM = data[x];
                d2.push(o);
            }
            
            var table = $(element).parent('table').DataTable();

            table.clear().rows.add(d2).draw();



        }
    };





})();
