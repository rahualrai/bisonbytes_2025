import Toybox.Application;
import Toybox.Lang;
import Toybox.WatchUi;

class MainApp extends Application.AppBase {
    private var mainView;
    private var mainDelegate;

    function initialize() {
        AppBase.initialize();
    }

    // onStart() is called on application start up
    function onStart(state as Dictionary?) as Void {
    }

    // onStop() is called when your application is exiting
    function onStop(state as Dictionary?) as Void {
    }

    // Return the initial view of your application here
    function getInitialView(){
        mainView = new MainView();
        mainDelegate = new MainDelegate();
        mainDelegate.initMainView(mainView);

        return  [mainView, mainDelegate];
    }

}

function getApp() as MainApp {
    return Application.getApp() as MainApp;
}