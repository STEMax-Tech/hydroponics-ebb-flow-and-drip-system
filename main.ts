function loading() {
    
    de = 80
    basic.showLeds(`
            . # # # .
            # . . . #
            # . . . #
            # . . . #
            . # # # .
            `, 0)
    basic.pause(de)
    basic.showLeds(`
            . # . . .
            # . . . #
            # . . . #
            # . . . #
            . # # # .
            `, 0)
    basic.pause(de)
    basic.showLeds(`
            . . # # .
            . . . . #
            # . . . #
            # . . . #
            . # # # .
            `, 0)
    basic.pause(de)
    basic.showLeds(`
            . # # # .
            . . . . #
            . . . . #
            # . . . #
            . # # # .
            `, 0)
    basic.pause(de)
    basic.showLeds(`
            . # # # .
            # . . . #
            # . . . #
            . . . . #
            . . # # .
            `, 0)
    basic.pause(de)
    basic.showLeds(`
            . # # # .
            # . . . #
            # . . . #
            # . . . #
            . # . . .
            `, 0)
    basic.pause(de)
    basic.showLeds(`
            . # # # .
            # . . . #
            # . . . .
            # . . . .
            . # # # .
            `, 0)
    basic.pause(de)
    basic.showLeds(`
            . # # . .
            # . . . .
            # . . . #
            # . . . #
            . # # # .
            `, 0)
    basic.pause(de)
}

function transTime(time: number): number[] {
    let hour = Math.trunc(time / 3600)
    let minus = Math.trunc((time - hour * 3600) / 60)
    let second = Math.trunc(time - hour * 3600 - minus * 60)
    return [hour, minus, second]
}

// global variable control system 
let motor = 0
let motorDrip = 0
let de = 0
let timeDelayEA = 0
timeDelayEA = EEPROM.readw(0)
// read old value of timeDelay AE
let timeHoldEA = 0
timeHoldEA = EEPROM.readw(1)
// read old value of Hold time AE
let moiture = 0
let valueThreshold = 0
valueThreshold = EEPROM.readw(2)
// read old value threshold value of moiture
let onSetup = 0
let timeEA = timeDelayEA
let timeRemainSetup = 0
// ========================================
// turn off all motor when setup
pins.analogWritePin(AnalogPin.P13, 0)
pins.analogWritePin(AnalogPin.P14, 0)
pins.analogWritePin(AnalogPin.P15, 0)
pins.analogWritePin(AnalogPin.P16, 0)
// =======================================
I2C_LCD1602.LcdInit(39)
I2C_LCD1602.on()
I2C_LCD1602.BacklightOn()
I2C_LCD1602.ShowString("INIT SYSTEM", 2, 0)
for (let index = 0; index < 2; index++) {
    loading()
}
I2C_LCD1602.ShowString("INIT COMPLETE", 1, 0)
basic.showIcon(IconNames.Heart)
basic.pause(1000)
I2C_LCD1602.clear()
basic.forever(function on_HandleButton() {
    let counter: number;
    let onPart: number;
    
    
    
    
    
    // 0 - setup FS value Threshold; 1 - setup timeDelay EA; 2 - setup timehold EA
    if (onSetup == 0) {
        if (input.buttonIsPressed(Button.A)) {
            timeRemainSetup = 5
            counter = 0
            while (input.buttonIsPressed(Button.A)) {
                timeRemainSetup = 5
                counter = counter + 1
                basic.pause(10)
                if (counter > 100) {
                    valueThreshold = valueThreshold + 10
                    basic.pause(500)
                }
                
            }
            valueThreshold = valueThreshold + 5
            if (valueThreshold > 100) {
                valueThreshold = 100
            }
            
        }
        
        if (input.buttonIsPressed(Button.B)) {
            timeRemainSetup = 5
            counter = 0
            while (input.buttonIsPressed(Button.B)) {
                timeRemainSetup = 5
                counter += 1
                basic.pause(10)
                if (counter > 100) {
                    valueThreshold -= 10
                    basic.pause(500)
                }
                
            }
            valueThreshold = valueThreshold - 5
            if (valueThreshold < 0) {
                valueThreshold = 0
            }
            
        }
        
        if (input.logoIsPressed()) {
            timeRemainSetup = 5
            while (input.logoIsPressed()) {
                
            }
            EEPROM.writew(2, valueThreshold)
            onPart = 0
        }
        
    } else if (onSetup == 1) {
        // On ESA
        if (input.buttonIsPressed(Button.A)) {
            timeRemainSetup = 5
            counter = 0
            while (input.buttonIsPressed(Button.A)) {
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if (counter > 100) {
                    timeHoldEA += 60
                    basic.pause(500)
                }
                
            }
            timeHoldEA = timeHoldEA + 1
        }
        
        if (input.buttonIsPressed(Button.B)) {
            timeRemainSetup = 5
            counter = 0
            while (input.buttonIsPressed(Button.B)) {
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if (counter > 100) {
                    timeHoldEA -= 60
                    basic.pause(500)
                }
                
            }
            timeHoldEA = timeHoldEA - 2
            if (timeHoldEA < 0) {
                timeHoldEA = 0
            }
            
        }
        
        if (input.logoIsPressed()) {
            timeRemainSetup = 5
            while (input.logoIsPressed()) {
                
            }
            EEPROM.writew(1, timeHoldEA)
            onSetup = 2
        }
        
    } else if (onSetup == 2) {
        if (input.buttonIsPressed(Button.A)) {
            timeRemainSetup = 5
            counter = 0
            while (input.buttonIsPressed(Button.A)) {
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if (counter > 100) {
                    timeDelayEA += 60
                    basic.pause(500)
                }
                
            }
            timeDelayEA = timeDelayEA + 1
        }
        
        if (input.buttonIsPressed(Button.B)) {
            timeRemainSetup = 5
            counter = 0
            while (input.buttonIsPressed(Button.B)) {
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if (counter > 100) {
                    timeDelayEA -= 60
                    basic.pause(500)
                }
                
            }
            timeDelayEA = timeDelayEA - 1
            if (timeDelayEA < 0) {
                timeDelayEA = 0
            }
            
        }
        
        if (input.logoIsPressed()) {
            timeRemainSetup = 5
            while (input.logoIsPressed()) {
                
            }
            EEPROM.writew(0, timeDelayEA)
            onSetup = 0
        }
        
    }
    
    basic.pause(100)
})
basic.forever(function on_HandleControlMotorEA() {
    
    if (motor == 1) {
        pins.analogWritePin(AnalogPin.P13, 0)
        pins.analogWritePin(AnalogPin.P14, 400)
        basic.pause(timeHoldEA * 1000)
        motor = 0
    } else {
        pins.analogWritePin(AnalogPin.P13, 0)
        pins.analogWritePin(AnalogPin.P14, 0)
    }
    
})
basic.forever(function on_handleControlMoterDrip() {
    
    // motorDrip using for led affect when motor active
    if (moiture < valueThreshold) {
        basic.pause(1000)
        if (moiture < valueThreshold) {
            pins.analogWritePin(AnalogPin.P15, 500)
            pins.analogWritePin(AnalogPin.P16, 0)
            motorDrip = 1
        } else {
            
        }
        
    } else {
        basic.pause(1000)
        if (moiture >= valueThreshold) {
            pins.analogWritePin(AnalogPin.P15, 0)
            pins.analogWritePin(AnalogPin.P16, 0)
            motorDrip = 0
        } else {
            
        }
        
    }
    
})
basic.forever(function on_HandleLCD() {
    let string: string;
    
    if (timeRemainSetup > 0) {
        // setup on process
        if (onSetup == 0) {
            // setup threshold soil moiture
            I2C_LCD1602.ShowString("Setup:Threshold ", 0, 0)
            I2C_LCD1602.ShowString("Thres:", 0, 1)
            if (valueThreshold == 100) {
                I2C_LCD1602.ShowNumber(valueThreshold, 6, 1)
                I2C_LCD1602.ShowString("%      ", 9, 1)
            } else if (valueThreshold >= 10) {
                I2C_LCD1602.ShowNumber(valueThreshold, 6, 1)
                I2C_LCD1602.ShowString("%       ", 8, 1)
            } else {
                I2C_LCD1602.ShowNumber(valueThreshold, 6, 1)
                I2C_LCD1602.ShowString("%        ", 7, 1)
            }
            
        } else if (onSetup == 1) {
            // Setup delay time
            I2C_LCD1602.ShowString("Setup:Time Delay", 0, 0)
            let [hourSet, minSet, secSet] = transTime(timeDelayEA)
            string = `Time: ${hourSet}h${minSet}m${secSet}s  `
            I2C_LCD1602.ShowString(string, 0, 1)
        } else if (onSetup == 2) {
            // Setup hold time
            I2C_LCD1602.ShowString("Setup:Hold time ", 0, 0)
            let [hourSet, minSet, secSet] = transTime(timeHoldEA)
            string = `Time: ${hourSet}h${minSet}m${secSet}s  `
            I2C_LCD1602.ShowString(string, 0, 1)
        }
        
    } else {
        let [hourSet, minSet, secSet] = transTime(timeEA)
        string = `DTime: ${hourSet}${minSet}${secSet}`
        I2C_LCD1602.ShowString(string, 0, 0)
        I2C_LCD1602.ShowString("SoilMoiture:", 0, 1)
        if (moiture == 100) {
            I2C_LCD1602.ShowNumber(moiture, 12, 1)
            I2C_LCD1602.ShowString("%", 15, 1)
        } else if (moiture > 10) {
            I2C_LCD1602.ShowNumber(moiture, 12, 1)
            I2C_LCD1602.ShowString("% ", 14, 1)
        } else {
            I2C_LCD1602.ShowNumber(moiture, 12, 1)
            I2C_LCD1602.ShowString("%  ", 13, 1)
        }
        
    }
    
})
basic.forever(function on_handle_readMoiture() {
    
    let valueAnalog = 0
    for (let i = 0; i < 10; i++) {
        valueAnalog += pins.analogReadPin(AnalogPin.P0)
        basic.pause(10)
    }
    valueAnalog = Math.round(valueAnalog / 10)
    moiture = Math.trunc((1023 - valueAnalog) / 1023 * 100)
})
basic.forever(function on_handle_icon() {
    
    if (motor == 1 || motorDrip == 1) {
        basic.showIcon(IconNames.Heart, 500)
        basic.showIcon(IconNames.SmallHeart, 500)
    } else {
        basic.showIcon(IconNames.SmallHeart, 100)
    }
    
})
basic.forever(function on_handleTimer() {
    let motor: number;
    
    basic.pause(1000)
    if (timeEA > 0) {
        timeEA -= 1
    } else {
        timeEA = timeDelayEA
        motor = 1
    }
    
    if (timeRemainSetup > 0) {
        timeRemainSetup -= 1
    }
    
})
