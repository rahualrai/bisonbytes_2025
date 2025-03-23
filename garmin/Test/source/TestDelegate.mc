import Toybox.Lang;
import Toybox.WatchUi;

class TestDelegate extends WatchUi.BehaviorDelegate {

    function initialize() {
        BehaviorDelegate.initialize();
    }

    function onMenu() as Boolean {
        WatchUi.pushView(new Rez.Menus.MainMenu(), new TestMenuDelegate(), WatchUi.SLIDE_UP);
        return true;
    }

}