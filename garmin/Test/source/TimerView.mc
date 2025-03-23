import Toybox.Graphics;
import Toybox.WatchUi;
import Toybox.Sensor;
import Toybox.Lang;
import Toybox.Communications;
import Toybox.ActivityMonitor;
import Toybox.Timer;
import Toybox.Activity;

class TimerView extends WatchUi.View {

    private var myCount = 10;
    private var myTimer;
    private var responseId = "";
    private var location = [38.9237151236751, -77.020863284267];
    function initialize() {
        View.initialize();
        myTimer = new Timer.Timer();
    }


    function setResponseId(id) as Void {
        responseId = id;
    }



    function timerCallback() as Void{
        myCount -= 1;
        if (myCount == 0){
            myTimer.stop();
            makeRequest(true);
            // Do to different screen
            WatchUi.pushView(new EmergencyView(), null, WatchUi.SLIDE_UP);
        }
        self.requestUpdate();
    `}

    // Load your resources here
    function onLayout(dc as Dc) as Void {
        setLayout(Rez.Layouts.TimerLayout(dc));
        myTimer.start(method(:timerCallback), 1000, true);
    }

    // Called when this View is brought to the foreground. Restore
    // the state of this View and prepare it to be shown. This includes
    // loading resources into memory.
    function onShow() as Void {
    }

    // Update the view
    function onUpdate(dc as Dc) as Void {
        // Call the parent onUpdate function to redraw the layout
        var timerLabel = View.findDrawableById("Timer") as Text;
        timerLabel.setText(myCount.toString());
        View.onUpdate(dc);
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



    function makeRequest(emergencyTriggered) as Void {
    var url = "https://c3f8-138-238-254-98.ngrok-free.app/trigger-emergency";


    var params = {
        "responseId" => responseId,
        "latitude" => location[0],
        "longitude" => location[1],
        "emergencyTriggered" => emergencyTriggered
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

    function onHide() as Void {
            myTimer.stop();
    }

}
