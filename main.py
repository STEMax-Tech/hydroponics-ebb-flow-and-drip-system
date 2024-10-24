def loading():
    global de
    de = 80
    basic.show_leds("""
            . # # # .
            # . . . #
            # . . . #
            # . . . #
            . # # # .
            """,
        0)
    basic.pause(de)
    basic.show_leds("""
            . # . . .
            # . . . #
            # . . . #
            # . . . #
            . # # # .
            """,
        0)
    basic.pause(de)
    basic.show_leds("""
            . . # # .
            . . . . #
            # . . . #
            # . . . #
            . # # # .
            """,
        0)
    basic.pause(de)
    basic.show_leds("""
            . # # # .
            . . . . #
            . . . . #
            # . . . #
            . # # # .
            """,
        0)
    basic.pause(de)
    basic.show_leds("""
            . # # # .
            # . . . #
            # . . . #
            . . . . #
            . . # # .
            """,
        0)
    basic.pause(de)
    basic.show_leds("""
            . # # # .
            # . . . #
            # . . . #
            # . . . #
            . # . . .
            """,
        0)
    basic.pause(de)
    basic.show_leds("""
            . # # # .
            # . . . #
            # . . . .
            # . . . .
            . # # # .
            """,
        0)
    basic.pause(de)
    basic.show_leds("""
            . # # . .
            # . . . .
            # . . . #
            # . . . #
            . # # # .
            """,
        0)
    basic.pause(de)
def transTime(time):
    hour = int(time/3600)
    minus = int((time - hour*3600)/60)
    second = int(time - hour*3600 - minus*60)
    return hour, minus, second
#global variable control system 
motor = 0
motorDrip = 0
de = 0
timeDelayEA = 0
timeDelayEA = EEPROM.readw(0) #read old value of timeDelay AE
timeHoldEA = 0
timeHoldEA = EEPROM.readw(1) #read old value of Hold time AE
moiture = 0
valueThreshold = 0
valueThreshold = EEPROM.readw(2) #read old value threshold value of moiture
onSetup = 0
timeEA = timeDelayEA
timeRemainSetup = 0
#========================================
#turn off all motor when setup
pins.analog_write_pin(AnalogPin.P13, 0)
pins.analog_write_pin(AnalogPin.P14, 0)
pins.analog_write_pin(AnalogPin.P15, 0)
pins.analog_write_pin(AnalogPin.P16, 0)
#=======================================
I2C_LCD1602.lcd_init(39)
I2C_LCD1602.on()
I2C_LCD1602.backlight_on()
I2C_LCD1602.show_string("INIT SYSTEM", 2, 0)

for index in range(2):
    loading()

I2C_LCD1602.show_string("INIT COMPLETE", 1, 0)
basic.show_icon(IconNames.HEART)
basic.pause(1000)
I2C_LCD1602.clear()

def on_HandleButton():
    global timeDelayEA
    global timeHoldEA
    global valueThreshold
    global timeRemainSetup
    global onSetup  #0 - setup FS value Threshold; 1 - setup timeDelay EA; 2 - setup timehold EA
    if onSetup == 0:
        if input.button_is_pressed(Button.A):
            timeRemainSetup = 5
            counter = 0
            while input.button_is_pressed(Button.A):
                timeRemainSetup = 5
                counter = counter + 1
                basic.pause(10)
                if counter > 100:
                    valueThreshold = valueThreshold + 10
                    basic.pause(500)
            valueThreshold = valueThreshold + 5
            if valueThreshold > 100:
                valueThreshold = 100
        if input.button_is_pressed(Button.B):
            timeRemainSetup = 5
            counter = 0
            while input.button_is_pressed(Button.B):
                timeRemainSetup = 5
                counter += 1
                basic.pause(10)
                if counter > 100:
                    valueThreshold -= 10
                    basic.pause(500)
            valueThreshold = valueThreshold - 5 
            if valueThreshold < 0:
                valueThreshold = 0 
        if input.logo_is_pressed():
            timeRemainSetup = 5
            while input.logo_is_pressed():
                pass
            EEPROM.writew(2, valueThreshold)
            onPart = 0  
    elif onSetup == 1: #On ESA
        if input.button_is_pressed(Button.A):
            timeRemainSetup = 5
            counter = 0
            while input.button_is_pressed(Button.A):
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if counter > 100:
                    timeHoldEA += 60
                    basic.pause(500)
            timeHoldEA = timeHoldEA + 1
        if input.button_is_pressed(Button.B):
            timeRemainSetup = 5
            counter = 0
            while input.button_is_pressed(Button.B):
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if counter > 100:
                    timeHoldEA -= 60
                    basic.pause(500)
            timeHoldEA = timeHoldEA - 2  
            if timeHoldEA < 0:
                timeHoldEA = 0
        if input.logo_is_pressed():
            timeRemainSetup = 5
            while input.logo_is_pressed():
                pass
            EEPROM.writew(1, timeHoldEA)
            onSetup = 2  
    elif onSetup == 2:
        if input.button_is_pressed(Button.A):
            timeRemainSetup = 5
            counter = 0
            while input.button_is_pressed(Button.A):
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if counter > 100:
                    timeDelayEA += 60
                    basic.pause(500)
            timeDelayEA = timeDelayEA + 1
        if input.button_is_pressed(Button.B):
            timeRemainSetup = 5
            counter = 0
            while input.button_is_pressed(Button.B):
                counter += 1
                timeRemainSetup = 5
                basic.pause(10)
                if counter > 100:
                    timeDelayEA -= 60
                    basic.pause(500)
            timeDelayEA = timeDelayEA - 1
            if timeDelayEA < 0:
                timeDelayEA = 0
        if input.logo_is_pressed():
            timeRemainSetup = 5
            while input.logo_is_pressed():
                pass
            EEPROM.writew(0, timeDelayEA)
            onSetup = 0 
    basic.pause(100)
basic.forever(on_HandleButton)

def on_HandleControlMotorEA():
    global motor
    if motor == 1:
        pins.analog_write_pin(AnalogPin.P13, 0)
        pins.analog_write_pin(AnalogPin.P14, 400)
        basic.pause(timeHoldEA*1000)
        motor = 0
    else:
        pins.analog_write_pin(AnalogPin.P13, 0)
        pins.analog_write_pin(AnalogPin.P14, 0)
basic.forever(on_HandleControlMotorEA)

def on_handleControlMoterDrip():
    global valueThreshold, moiture, motorDrip #motorDrip using for led affect when motor active
    if moiture < valueThreshold:
        basic.pause(1000)
        if moiture < valueThreshold:
            pins.analog_write_pin(AnalogPin.P15, 500)
            pins.analog_write_pin(AnalogPin.P16, 0)
            motorDrip = 1
        else:
            pass
    else:
        basic.pause(1000)
        if moiture >= valueThreshold:
            pins.analog_write_pin(AnalogPin.P15, 0)
            pins.analog_write_pin(AnalogPin.P16, 0)
            motorDrip = 0
        else:
            pass
basic.forever(on_handleControlMoterDrip)

def on_HandleLCD():
    global timeEA, motor, onSetup, timeRemainSetup, valueThreshold, moiture
    if timeRemainSetup > 0: #setup on process
        if onSetup == 0: #setup threshold soil moiture
            I2C_LCD1602.show_string("Setup:Threshold ", 0, 0)
            I2C_LCD1602.show_string("Thres:", 0, 1)
            if valueThreshold == 100:
                I2C_LCD1602.show_number(valueThreshold, 6, 1)
                I2C_LCD1602.show_string("%      ", 9, 1)
            elif valueThreshold >= 10:
                I2C_LCD1602.show_number(valueThreshold, 6, 1)
                I2C_LCD1602.show_string("%       ", 8, 1)
            else:
                I2C_LCD1602.show_number(valueThreshold, 6, 1)
                I2C_LCD1602.show_string("%        ", 7, 1)
        elif onSetup == 1: #Setup delay time
            I2C_LCD1602.show_string("Setup:Time Delay", 0, 0)
            hourSet, minSet, secSet = transTime(timeDelayEA)
            string = "Time: %2dh%2dm%2ds  " % (hourSet, minSet, secSet)
            I2C_LCD1602.show_string(string, 0, 1)
        elif onSetup == 2: #Setup hold time
            I2C_LCD1602.show_string("Setup:Hold time ", 0, 0)
            hourSet, minSet, secSet = transTime(timeHoldEA)
            string = "Time: %2dh%2dm%2ds  " % (hourSet, minSet, secSet)
            I2C_LCD1602.show_string(string, 0, 1)
    else:
        hourSet, minSet, secSet = transTime(timeEA)
        string = "DTime: %02h%02m%02s" % (hourSet, minSet, secSet)
        I2C_LCD1602.show_string(string, 0, 0)
        I2C_LCD1602.show_string("SoilMoiture:", 0, 1)
        if(moiture == 100):
            I2C_LCD1602.show_number(moiture, 12, 1)
            I2C_LCD1602.show_string("%", 15, 1)
        elif(moiture > 10):
            I2C_LCD1602.show_number(moiture, 12, 1)
            I2C_LCD1602.show_string("% ", 14, 1)
        else:
            I2C_LCD1602.show_number(moiture, 12, 1)
            I2C_LCD1602.show_string("%  ", 13, 1)
basic.forever(on_HandleLCD)

def on_handle_readMoiture():
    global moiture
    valueAnalog = 0
    for i in range (10):
        valueAnalog += pins.analog_read_pin(AnalogPin.P0)
        basic.pause(10)
    valueAnalog = Math.round(valueAnalog/10)
    moiture = int((1023 - valueAnalog)/1023*100)
basic.forever(on_handle_readMoiture)

def on_handle_icon():
    global motor, motorDrip
    if motor == 1 or motorDrip == 1:
        basic.show_icon(IconNames.HEART, 500)
        basic.show_icon(IconNames.SMALL_HEART, 500)
    else:
        basic.show_icon(IconNames.SMALL_HEART, 100)
basic.forever(on_handle_icon)

def on_handleTimer():
    pass
basic.forever(on_handleTimer)