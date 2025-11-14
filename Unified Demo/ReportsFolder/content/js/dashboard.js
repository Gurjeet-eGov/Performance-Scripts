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

    var data = {"OkPercent": 37.77292576419214, "KoPercent": 62.22707423580786};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05786026200873363, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.21, 500, 1500, "/noc-services/v1/noc/_update (F_Noc)"], "isController": false}, {"data": [0.0, 500, 1500, "/bpa-services/v1/bpa/_update"], "isController": false}, {"data": [0.01, 500, 1500, "/edcr/rest/dcr/scrutinydetails"], "isController": false}, {"data": [0.5, 500, 1500, "Employee Login"], "isController": false}, {"data": [0.4, 500, 1500, "/filestore/v1/files"], "isController": false}, {"data": [1.0, 500, 1500, "Architect Login"], "isController": false}, {"data": [0.0, 500, 1500, "/bpa-services/v1/bpa/_create"], "isController": false}, {"data": [1.0, 500, 1500, "Citizen Login"], "isController": false}, {"data": [0.22, 500, 1500, "/noc-services/v1/noc/_update (A_Noc)"], "isController": false}, {"data": [0.0, 500, 1500, "/edcr/rest/dcr/scrutinize"], "isController": false}, {"data": [0.0, 500, 1500, "/billing-service/bill/v2/_fetchbill"], "isController": false}, {"data": [0.0, 500, 1500, "/noc-services/v1/noc/_search"], "isController": false}, {"data": [0.0, 500, 1500, "/collection-services/payments/_create"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 458, 285, 62.22707423580786, 14450.670305676875, 37, 61093, 2307.5, 60060.8, 60468.6, 60917.42, 2.803984351563313, 10.537684470640814, 145.94116999384715], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/noc-services/v1/noc/_update (F_Noc)", 50, 0, 0.0, 2135.56, 211, 4833, 2298.0, 3481.3, 4021.049999999999, 4833.0, 0.6197630026277952, 1.2419469544846051, 0.735363328313253], "isController": false}, {"data": ["/bpa-services/v1/bpa/_update", 50, 50, 100.0, 100.8, 37, 899, 50.5, 179.89999999999995, 444.54999999999956, 899.0, 0.6215040397762585, 0.7902326755748912, 1.949665456028589], "isController": false}, {"data": ["/edcr/rest/dcr/scrutinydetails", 50, 48, 96.0, 44438.539999999986, 957, 60325, 51677.0, 60113.0, 60153.0, 60325.0, 0.44461833961727254, 1.4258614897159778, 0.2237420218796685], "isController": false}, {"data": ["Employee Login", 1, 0, 0.0, 1007.0, 1007, 1007, 1007.0, 1007.0, 1007.0, 1007.0, 0.9930486593843098, 2.2304803872889774, 0.34814889523336645], "isController": false}, {"data": ["/filestore/v1/files", 5, 0, 0.0, 1345.0, 1205, 1529, 1324.0, 1529.0, 1529.0, 1529.0, 0.7403020432336394, 0.9405595295380516, 29.95331470239858], "isController": false}, {"data": ["Architect Login", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 5.756113104229607, 1.0385196374622356], "isController": false}, {"data": ["/bpa-services/v1/bpa/_create", 50, 50, 100.0, 17271.899999999994, 109, 60144, 8377.0, 48613.0, 54850.94999999996, 60144.0, 0.3959549244913959, 0.5219644858129351, 0.6245956929013201], "isController": false}, {"data": ["Citizen Login", 1, 0, 0.0, 124.0, 124, 124, 124.0, 124.0, 124.0, 124.0, 8.064516129032258, 14.821698588709678, 2.7721774193548385], "isController": false}, {"data": ["/noc-services/v1/noc/_update (A_Noc)", 50, 0, 0.0, 2236.739999999999, 257, 5348, 2205.0, 4247.099999999999, 5019.0999999999985, 5348.0, 0.6220839813374806, 1.2465979782270606, 0.7381172239502333], "isController": false}, {"data": ["/edcr/rest/dcr/scrutinize", 50, 37, 74.0, 47371.280000000006, 6468, 61093, 60457.5, 60880.9, 61002.5, 61093.0, 0.7118451025056948, 9.673029523775627, 329.0229536677819], "isController": false}, {"data": ["/billing-service/bill/v2/_fetchbill", 50, 50, 100.0, 630.6200000000001, 54, 3903, 234.0, 1778.4999999999998, 2468.4499999999966, 3903.0, 0.6213881811967936, 0.9084161203628907, 0.8817158469520909], "isController": false}, {"data": ["/noc-services/v1/noc/_search", 50, 0, 0.0, 17955.06000000001, 2414, 24667, 20685.0, 23729.7, 23872.6, 24667.0, 0.5983724269985639, 4.8174473245272855, 0.29801751735280035], "isController": false}, {"data": ["/collection-services/payments/_create", 50, 50, 100.0, 63.89999999999997, 37, 403, 47.0, 88.1, 169.19999999999993, 403.0, 0.6215272166768183, 0.7902621446418139, 0.6039253716732755], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 98, 34.3859649122807, 21.397379912663755], "isController": false}, {"data": ["504/Gateway Time-out", 50, 17.54385964912281, 10.91703056768559], "isController": false}, {"data": ["500/Internal Server Error", 137, 48.07017543859649, 29.912663755458514], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 458, 285, "500/Internal Server Error", 137, "400/Bad Request", 98, "504/Gateway Time-out", 50, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["/bpa-services/v1/bpa/_update", 50, 50, "500/Internal Server Error", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/edcr/rest/dcr/scrutinydetails", 50, 48, "500/Internal Server Error", 37, "504/Gateway Time-out", 11, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/bpa-services/v1/bpa/_create", 50, 50, "400/Bad Request", 48, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/edcr/rest/dcr/scrutinize", 50, 37, "504/Gateway Time-out", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/billing-service/bill/v2/_fetchbill", 50, 50, "400/Bad Request", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/collection-services/payments/_create", 50, 50, "500/Internal Server Error", 50, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
