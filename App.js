import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState({});
  const [weather, setWeather] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const requestPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
  };
  const getPosition = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };
  const fetchWeather = async () => {
    const appId = "1e7e9f6920bebd78dab4db3b7dfc88e6";
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;
    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}&units=metric`
    );
    const body = await res.json();
    setWeather(body);
    console.log({ body });
  };
  const prepareWeather = async () => {
    try {
      await requestPermission();
      await getPosition();
      await fetchWeather();
    } catch (err) {
      console.log(err);
    }
  };
  // Life-cycle yang hanya sekali dijalankan
  useEffect(() => {
    prepareWeather();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar type="auto" />
      <View style={styles.title}>
        <Text style={{ fontSize: 30 }}>Weather Application</Text>
      </View>
      <View style={styles.temperature}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          The current Weather is:{" "}
        </Text>
        {/* fungsi tanda tanya disini adalah perintah dari modern javascript yang mana jika main tersebut tidak ada maka dia akan menjadikan main sebagai opsi jika ada */}
        <Text style={{ color: "red", fontSize: 72, textAlign: "center" }}>
          {weather.main?.temp}{" "}
        </Text>
      </View>
      <View style={styles.position}>
        <Text>Latitude: {location.coords?.latitude} </Text>
        <Text>Longitude: {location.coords?.longitude} </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  position: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  title: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  temperature: {
    margin: 20,
  },
});
