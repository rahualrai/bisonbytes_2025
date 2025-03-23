import Toybox.Graphics;
import Toybox.WatchUi;
import Toybox.Sensor;
import Toybox.Lang;
import Toybox.Communications;
import Toybox.ActivityMonitor;
import Toybox.Timer;

class MainView extends WatchUi.View {

    private var _hrString = "--bpm";
    private var hrNum = 0;
    private var temperature = 0;
    private var bloodOx = 0;
    private var isEmergencySimulation = false;
    var info = ActivityMonitor.getInfo();
    var myTimer;
    var myCount = 0;

    function initialize() {
        View.initialize();
        Sensor.setEnabledSensors([Sensor.SENSOR_HEARTRATE, Sensor.SENSOR_TEMPERATURE, Sensor.SENSOR_PULSE_OXIMETRY]);
        Sensor.enableSensorEvents(method(:onSnsr));
        myTimer = new Timer.Timer();

    }
    function timerCallback() as Void{
        myCount -= 1;
        if (myCount % 15 == 0){
            makeRequest();
            // Do to different screen
        }
        self.requestUpdate();
    `}



    function setIsEmergency(emergency) as Void {
        isEmergencySimulation = emergency;
    }

    //! Handle sensor updates
    //! @param sensorInfo Updated sensor data
    public function onSnsr(sensorInfo as Sensor.Info) as Void {
        var heartRate = sensorInfo.heartRate;
        var temp = sensorInfo.temperature;
        var ox = sensorInfo.oxygenSaturation;


        if (heartRate != null) {
            _hrString = heartRate.toString() + "bpm";
            hrNum = heartRate.toNumber();

            // Add value to graph
        } 

        if (temp != null) {
            temperature = temp;
        } 

        if (ox != null) {
            bloodOx = ox;
            // Add value to graph
        } 

        self.requestUpdate();

    }

    // Load your resources here
    function onLayout(dc as Dc) as Void {
        setLayout(Rez.Layouts.MainLayout(dc));
        myTimer.start(method(:timerCallback), 1000, true);
    }

    // Called when this View is brought to the foreground. Restore
    // the state of this View and prepare it to be shown. This includes
    // loading resources into memory.
    function onShow() as Void {
        makeRequest();
    }

    // Update the view
    function onUpdate(dc as Dc) as Void {
        // Call the parent onUpdate function to redraw the layout
        var view = View.findDrawableById("heart") as Text;
        view.setText(_hrString);
        // makeRequest();
        View.onUpdate(dc);
    }

    function onReceive(responseCode as Number, data as Dictionary?) as Void {
        WatchUi.requestUpdate();
           // set up the response callback function
       if (responseCode == 200) {
           System.println("Request Successful");                   // print success
       }
       else {
           System.println("Response: " + responseCode);            // print response code
       }

       var emergencyDetected = data["emergency_detected"] as Boolean;
       var response_id = data["responseId"] as String;
         System.println(response_id);

         System.println(emergencyDetected);
         if (emergencyDetected) {
            var timerView = new TimerView();
            var timerDelegate = new TimerDelegate();
            timerView.setResponseId(response_id);
            timerDelegate.setResponseId(response_id);
              WatchUi.pushView(timerView, timerDelegate, WatchUi.SLIDE_UP);
         }




    }

    function makeRequest() as Void {
    var url = "https://c3f8-138-238-254-98.ngrok-free.app/update-vitals";
    var params = {
        "heartRate" => hrNum,
        "temperature" => temperature,
        "oxygenSaturation" => bloodOx,
        "respirationRate" => info.respirationRate,
        "stressScore" => info.stressScore
    };

    if (isEmergencySimulation) {
        params = {
        "heartRate" => 150,
        "temperature" =>39 ,
        "oxygenSaturation" => 91,
        "respirationRate" => 30,
        "stressScore" => 92
    };

    }


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
