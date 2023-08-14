import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";

type ToDo = {
  [key: string]: { text: string; work: boolean };
};
const STORAGE_KEY = "@toDos";

const App = () => {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState<ToDo>({});

  const work = () => setWorking(true);
  const travel = () => setWorking(false);

  const onChangeText = (text: string) => setText(text);

  const saveToDos = async (toSave: ToDo) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      alert("Fail to Save");
    }
  };

  const loadToDos = async () => {
    try {
      const res = await AsyncStorage.getItem(STORAGE_KEY);
      if (res) {
        setToDos(JSON.parse(res));
      }
    } catch (error) {
      alert("Fail to Load");
    }
  };

  const addToDo = async () => {
    if (!text) {
      return;
    }

    const newToDos = { ...toDos, [Date.now()]: { text, work: working } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const deleteTodo = (id: string) => {
    Alert.alert("Delete To Do", "Are you sure ?", [
      {
        text: "Cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[id];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
    return;
  };

  useEffect(() => {
    loadToDos();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.gray }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.gray,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          returnKeyType="done"
          style={styles.input}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          value={text}
          onChangeText={onChangeText}
          onSubmitEditing={addToDo}
        />
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].work === working ? (
            <View key={key} style={styles.toDo}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="trash" size={20} color={theme.toDoBg} />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.gray,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
