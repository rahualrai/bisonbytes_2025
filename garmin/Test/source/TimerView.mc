import Toybox.Graphics;
import Toybox.WatchUi;
import Toybox.Sensor;
import Toybox.Lang;
import Toybox.Communications;
import Toybox.ActivityMonitor;
import Toybox.Timer;

class TimerView extends WatchUi.View {

    private var myCount = 10;
    private var myTimer;
    function initialize() {
        View.initialize();
        myTimer = new Timer.Timer();
    }

    function timerCallback() as Void{
        myCount -= 1;
        if (myCount == 0){
            myTimer.stop();
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
        // makeRequest();
    }

    // Update the view
    function onUpdate(dc as Dc) as Void {
        // Call the parent onUpdate function to redraw the layout
        var timerLabel = View.findDrawableById("Timer") as Text;
        timerLabel.setText(myCount.toString());
        View.onUpdate(dc);
    }



    function onHide() as Void {
    }

}
