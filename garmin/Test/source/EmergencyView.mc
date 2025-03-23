import Toybox.Graphics;
import Toybox.WatchUi;
import Toybox.Sensor;
import Toybox.Lang;
import Toybox.Communications;
import Toybox.ActivityMonitor;
import Toybox.Timer;

class EmergencyView extends WatchUi.View {

    function initialize() {
        View.initialize();
    }



    // Load your resources here
    function onLayout(dc as Dc) as Void {
        setLayout(Rez.Layouts.EmergencyLayout(dc));
    }

    // Called when this View is brought to the foreground. Restore
    // the state of this View and prepare it to be shown. This includes
    // loading resources into memory.
    function onShow() as Void {
    }

    // Update the view
    function onUpdate(dc as Dc) as Void {
        View.onUpdate(dc);
    }


    function onHide() as Void {
    }

}
