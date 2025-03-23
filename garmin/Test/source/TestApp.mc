import Toybox.Application;
import Toybox.Lang;
import Toybox.WatchUi;

class TestApp extends Application.AppBase {
    private var testView;
    private var testDelegate;

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
        testView = new TestView();
        testDelegate = new TestDelegate();
        testDelegate.initTestView(testView);

        return  [testView, testDelegate];
    }

}

function getApp() as TestApp {
    return Application.getApp() as TestApp;
}