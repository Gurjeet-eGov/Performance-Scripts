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

    var data = {"OkPercent": 76.42770352369381, "KoPercent": 23.572296476306196};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.093841642228739, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/user/oauth/token (Citizen)"], "isController": false}, {"data": [0.0, 500, 1500, "/pgr-services/v2/request/_create (CITIZEN)"], "isController": false}, {"data": [0.0, 500, 1500, "/egov-location/location/v11/boundarys/_search"], "isController": false}, {"data": [0.0, 500, 1500, "/mdms-v2/v1/_search"], "isController": false}, {"data": [0.0, 500, 1500, "/pgr-services/v2/request/_search (CITIZEN)"], "isController": false}, {"data": [0.0, 500, 1500, "PGR Create (Employee)"], "isController": false}, {"data": [0.0, 500, 1500, "EMPLOYEE"], "isController": true}, {"data": [0.0, 500, 1500, "/filestore/v1/files"], "isController": false}, {"data": [0.47, 500, 1500, "/localization/messages/v1/_search"], "isController": false}, {"data": [0.0, 500, 1500, "CITIZEN"], "isController": true}, {"data": [1.0, 500, 1500, "/filestore/v1/files-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 823, 194, 23.572296476306196, 22205.48481166465, 0, 61745, 20518.0, 59802.2, 60058.2, 60412.64, 3.8579993718445738, 235.6403383894376, 4.367336481825682], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/user/oauth/token (Citizen)", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 3.0955629485645932, 1.6143652811004785], "isController": false}, {"data": ["/pgr-services/v2/request/_create (CITIZEN)", 100, 90, 90.0, 41535.299999999996, 10581, 61292, 38674.5, 60213.7, 60356.75, 61289.909999999996, 1.0885538562020356, 2.027814251891362, 0.6866181012899364], "isController": false}, {"data": ["/egov-location/location/v11/boundarys/_search", 100, 0, 0.0, 21795.070000000003, 6892, 23707, 22207.5, 23501.5, 23581.75, 23706.98, 2.1305607635929777, 4.171654620121016, 2.523799029529572], "isController": false}, {"data": ["/mdms-v2/v1/_search", 300, 2, 0.6666666666666666, 17299.79999999999, 1971, 30122, 20459.5, 21233.9, 21770.75, 23592.7, 3.1846119550332794, 122.75712921828392, 4.716791795378066], "isController": false}, {"data": ["/pgr-services/v2/request/_search (CITIZEN)", 20, 2, 10.0, 5555.050000000001, 0, 11003, 5647.0, 8244.100000000002, 10868.799999999997, 11003.0, 1.124353496739375, 73.0138580960479, 1.1354433115021363], "isController": false}, {"data": ["PGR Create (Employee)", 100, 100, 100.0, 59493.52999999999, 30147, 61745, 59731.5, 60216.5, 60359.95, 61733.119999999995, 1.0302586979590576, 2.080700002833211, 0.020303340356263456], "isController": false}, {"data": ["EMPLOYEE", 100, 100, 100.0, 140048.37999999995, 114285, 153879, 140647.5, 149679.3, 152459.5, 153876.0, 0.6465210701216753, 315.3459933270944, 5.219003456463271], "isController": true}, {"data": ["/filestore/v1/files", 1, 0, 0.0, 5223.0, 5223, 5223, 5223.0, 5223.0, 5223.0, 5223.0, 0.19146084625694046, 0.5809266106643691, 7.746685334099177], "isController": false}, {"data": ["/localization/messages/v1/_search", 200, 0, 0.0, 3430.1899999999996, 66, 8571, 2123.5, 7732.900000000001, 7963.5, 8414.6, 6.132711885195634, 1128.847558030786, 7.435314263154667], "isController": false}, {"data": ["CITIZEN", 100, 91, 91.0, 42646.310000000005, 10581, 61292, 43718.0, 60213.7, 60356.75, 61289.909999999996, 1.0885538562020356, 16.165630697899093, 0.906476215098242], "isController": true}, {"data": ["/filestore/v1/files-0", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 573.486328125, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: sandbox-prod.digit.org: Temporary failure in name resolution", 1, 0.5154639175257731, 0.12150668286755771], "isController": false}, {"data": ["400/Bad Request", 22, 11.34020618556701, 2.67314702308627], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: sandbox-prod.digit.org", 25, 12.88659793814433, 3.0376670716889427], "isController": false}, {"data": ["500/Internal Server Error", 1, 0.5154639175257731, 0.12150668286755771], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: sandbox-prod.digit.org:443 failed to respond", 145, 74.74226804123711, 17.61846901579587], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 823, 194, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: sandbox-prod.digit.org:443 failed to respond", 145, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: sandbox-prod.digit.org", 25, "400/Bad Request", 22, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: sandbox-prod.digit.org: Temporary failure in name resolution", 1, "500/Internal Server Error", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["/pgr-services/v2/request/_create (CITIZEN)", 100, 90, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: sandbox-prod.digit.org:443 failed to respond", 46, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: sandbox-prod.digit.org", 23, "400/Bad Request", 19, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: sandbox-prod.digit.org: Temporary failure in name resolution", 1, "500/Internal Server Error", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["/mdms-v2/v1/_search", 300, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/pgr-services/v2/request/_search (CITIZEN)", 20, 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: sandbox-prod.digit.org", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PGR Create (Employee)", 100, 100, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: sandbox-prod.digit.org:443 failed to respond", 99, "400/Bad Request", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
