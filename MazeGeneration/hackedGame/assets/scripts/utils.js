// Utils
//
// This class is for any kind of maths or miscellaneous methods
// that different objects may want to use.
//
// Created by Jacob Leaney

class Utils {
    
    // converts & returns a value from one range to another
    // For example '5', between 0-10, would be converted to '50', between 0-100
    mathMap(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

}