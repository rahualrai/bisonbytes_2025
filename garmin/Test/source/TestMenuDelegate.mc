import Toybox.Lang;
import Toybox.System;
import Toybox.WatchUi;

class TestMenuDelegate extends WatchUi.MenuInputDelegate {

    private var testView;
    private var testDelegate;
    function initialize() {
        MenuInputDelegate.initialize();
    }

    function initTestView(view) {
        testView = view;
    }
    function initTestDelegate(delegate) {
        testDelegate = delegate;
    }
    function onMenuItem(item as Symbol) as Void {
        if (item == :item_1) {
            testView.setIsEmergency(true);
            WatchUi.pushView(testView, testDelegate, WatchUi.SLIDE_UP);
            System.println("item 1");

        } else if (item == :item_2) {
            testView.setIsEmergency(false);
            WatchUi.pushView(testView, testDelegate, WatchUi.SLIDE_UP);
            System.println("item 2");
        }
    }

}