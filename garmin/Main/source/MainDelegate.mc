import Toybox.Lang;
import Toybox.WatchUi;

class MainDelegate extends WatchUi.BehaviorDelegate {

    private var mainView ;
    private var mainMenuDelegate;
    function initialize() {
        BehaviorDelegate.initialize();
    }

    function initMainView(view) {
        mainView = view;

    }

    function onMenu() as Boolean {
        mainMenuDelegate = new MainMenuDelegate();
        mainMenuDelegate.initMainView(mainView);
        mainMenuDelegate.initMainDelegate(self);
        WatchUi.pushView(new Rez.Menus.MainMenu(), mainMenuDelegate, WatchUi.SLIDE_UP);
        return true;
    }

}