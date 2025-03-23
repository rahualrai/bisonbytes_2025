import Toybox.Lang;
import Toybox.WatchUi;

class TestDelegate extends WatchUi.BehaviorDelegate {

    private var testView ;
    private var testMenuDelegate;
    function initialize() {
        BehaviorDelegate.initialize();
    }

    function initTestView(view) {
        testView = view;

    }

    function onMenu() as Boolean {
        testMenuDelegate = new TestMenuDelegate();
        testMenuDelegate.initTestView(testView);
        testMenuDelegate.initTestDelegate(self);
        WatchUi.pushView(new Rez.Menus.MainMenu(), testMenuDelegate, WatchUi.SLIDE_UP);
        return true;
    }

}