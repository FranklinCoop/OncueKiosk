@rem TKIP Example: ssid=yourssid, auth=OPEN, EAP=LEAP, WEP=WPA-TKIP
@rem Note: LEAP not directly supported, use PEAP instead
wzctool -c SDIO86861 -ssid "yourssid" -auth wpa -encr tkip -eap peap -key auto
