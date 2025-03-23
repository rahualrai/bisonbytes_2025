import Toybox.Lang;
import Toybox.WatchUi;
import Toybox.Activity;

class TimerDelegate extends WatchUi.BehaviorDelegate {

    private var responseId;
    private var location = [38.9237151236751, -77.020863284267];
    function initialize() {
        BehaviorDelegate.initialize();
    }

    function setResponseId(id) {
        responseId = id;
    }

    function onReceive(responseCode as Number, data as Dictionary?) as Void {
        WatchUi.requestUpdate();
           // set up the response callback function
       if (responseCode == 200) {
           System.println("Request Successful Emergency");                   // print success
       }
       else {
           System.println("Response: " + responseCode);            // print response code
       }

    }



    function makeRequest() as Void {
    var url = "https://c3f8-138-238-254-98.ngrok-free.app/trigger-emergency";

    var params = {
        "responseId" => responseId,
        "latitude" => location[0],
        "longitude" => location[1]
    };

    var options = {
        :method => Communications.HTTP_REQUEST_METHOD_POST,
        :headers => {
            "Content-Type" => Communications.REQUEST_CONTENT_TYPE_JSON

        }
    };
    var responseCallback = method(:onReceive);
    Communications.makeWebRequest(url, params, options, responseCallback);
}

    function onKey(keyEvent as WatchUi.KeyEvent) as Boolean {
        var key = keyEvent.getKey();
        if (key == 5) {
            System.println("Stop");
            WatchUi.pushView(new TestView(), new TestDelegate(), WatchUi.SLIDE_UP);
            return true;
        }
        if (key == 4) {
            System.println("Start");
            makeRequest();
            WatchUi.pushView(new EmergencyView(), null, WatchUi.SLIDE_UP);
            return true;
        }
        return false;
    }


}