import Toybox.Graphics;
import Toybox.WatchUi;
import Toybox.Sensor;
import Toybox.Lang;
import Toybox.Communications;
import Toybox.ActivityMonitor;

class TestView extends WatchUi.View {

    private var _hrString = "--bpm";
    private var hrNum = 0;
    private var temperature = 0;
    private var bloodOx = 0;
    private var isEmergencySimulation = false;
    var info = ActivityMonitor.getInfo();

    function initialize() {
        View.initialize();
        Sensor.setEnabledSensors([Sensor.SENSOR_HEARTRATE, Sensor.SENSOR_TEMPERATURE, Sensor.SENSOR_PULSE_OXIMETRY]);
        Sensor.enableSensorEvents(method(:onSnsr));
    }

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
            hrNum = heartRate;

            // Add value to graph
        } 

        if (temp != null) {
            temperature = temp;
        } 

        if (ox != null) {
            bloodOx = ox;
            hrNum = heartRate;
            // Add value to graph
        } 

        self.requestUpdate();
        // makeRequest();
    }

    // Load your resources here
    function onLayout(dc as Dc) as Void {
        setLayout(Rez.Layouts.MainLayout(dc));
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

         System.println(emergencyDetected);
         if (emergencyDetected) {
              WatchUi.pushView(new TimerView(), null, WatchUi.SLIDE_UP);
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
    }

}
