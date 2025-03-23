import Toybox.Lang;
import Toybox.System;
import Toybox.WatchUi;

class MainMenuDelegate extends WatchUi.MenuInputDelegate {

    private var mainView;
    private var mainDelegate;
    function initialize() {
        MenuInputDelegate.initialize();
    }

    function initMainView(view) {
        mainView = view;
    }
    function initMainDelegate(delegate) {
        mainDelegate = delegate;
    }
    function onMenuItem(item as Symbol) as Void {
        if (item == :item_1) {
            mainView.setIsEmergency(true);
            WatchUi.pushView(mainView, mainDelegate, WatchUi.SLIDE_UP);
            System.println("item 1");

        } else if (item == :item_2) {
            mainView.setIsEmergency(false);
            WatchUi.pushView(mainView, mainDelegate, WatchUi.SLIDE_UP);
            System.println("item 2");
        }
    }

}