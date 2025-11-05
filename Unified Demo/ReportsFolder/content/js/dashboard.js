/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 80.5168986083499, "KoPercent": 19.4831013916501};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13300142247510668, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.025, 500, 1500, "/egov-survey-services/egov-ss/survey/response/_submit"], "isController": false}, {"data": [0.5, 500, 1500, "/filestore/v1/files"], "isController": false}, {"data": [0.015, 500, 1500, "Search & Submit Survey (Citizen)"], "isController": true}, {"data": [0.5, 500, 1500, "Employee Token (Setup)"], "isController": false}, {"data": [1.0, 500, 1500, "Citizen Token (Setup)"], "isController": false}, {"data": [0.01, 500, 1500, "Create and Search Survey"], "isController": true}, {"data": [0.175, 500, 1500, "/egov-survey-services/egov-ss/survey/_create"], "isController": false}, {"data": [1.0, 500, 1500, "/filestore/v1/files-0"], "isController": false}, {"data": [0.15577889447236182, 500, 1500, "/egov-survey-services/egov-ss/survey/_search"], "isController": false}, {"data": [0.37, 500, 1500, "/egov-survey-services/egov-ss/survey/_search (uuid)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 503, 98, 19.4831013916501, 1639.777335984096, 2, 11588, 1549.0, 2850.6, 3360.2, 7849.479999999993, 31.174465447784318, 1808.885962193988, 47.128234428261536], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/egov-survey-services/egov-ss/survey/response/_submit", 100, 97, 97.0, 615.4900000000001, 60, 1707, 505.0, 1278.0000000000002, 1552.2499999999993, 1706.98, 10.198878123406425, 14.717757999745029, 19.73751832610913], "isController": false}, {"data": ["/filestore/v1/files", 1, 0, 0.0, 1331.0, 1331, 1331, 1331.0, 1331.0, 1331.0, 1331.0, 0.7513148009015778, 2.2429388148009015, 30.406238260706235], "isController": false}, {"data": ["Search & Submit Survey (Citizen)", 100, 97, 97.0, 3754.28, 934, 6295, 3750.0, 5408.500000000001, 5769.25, 6294.38, 8.61697544161999, 1269.1577074806119, 32.159747280267126], "isController": true}, {"data": ["Employee Token (Setup)", 1, 0, 0.0, 986.0, 986, 986, 986.0, 986.0, 986.0, 986.0, 1.0141987829614605, 1.7728670131845843, 0.6863669497971603], "isController": false}, {"data": ["Citizen Token (Setup)", 1, 0, 0.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 126.0, 7.936507936507936, 13.547867063492063, 5.324590773809524], "isController": false}, {"data": ["Create and Search Survey", 100, 1, 1.0, 4469.349999999999, 1375, 11867, 4219.0, 6967.500000000002, 9401.499999999998, 11859.879999999996, 8.378016085790884, 1210.5935431677278, 28.936145772243634], "isController": true}, {"data": ["/egov-survey-services/egov-ss/survey/_create", 100, 1, 1.0, 2442.6600000000003, 261, 11588, 1810.5, 4831.700000000001, 7846.099999999996, 11577.699999999995, 8.62663906142167, 35.65405088099551, 22.04679142943409], "isController": false}, {"data": ["/filestore/v1/files-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 857.421875, 0.0], "isController": false}, {"data": ["/egov-survey-services/egov-ss/survey/_search", 199, 0, 0.0, 1942.8693467336686, 254, 4352, 1885.0, 2913.0, 3338.0, 4265.0, 16.824484274602636, 2385.5110919269955, 15.263619034283058], "isController": false}, {"data": ["/egov-survey-services/egov-ss/survey/_search (uuid)", 100, 0, 0.0, 1299.1699999999996, 97, 3167, 1236.5, 2223.6000000000004, 2721.1499999999983, 3166.1499999999996, 9.946290033817386, 40.26110565446589, 8.84870138750746], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 98, 100.0, 19.4831013916501], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 503, 98, "400/Bad Request", 98, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/egov-survey-services/egov-ss/survey/response/_submit", 100, 97, "400/Bad Request", 97, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/egov-survey-services/egov-ss/survey/_create", 100, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
