import {
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/CheckBox";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function New() {
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState<string>("");

  function handleToggleWeekDay(weekDay: number) {
    const alreadySelected = weekDays.includes(weekDay);

    if (alreadySelected) {
      const filteredWeekDays = weekDays.filter((item) => item !== weekDay);
      setWeekDays(filteredWeekDays);
    } else {
      setWeekDays((oldWeekDays) => [...oldWeekDays, weekDay]);
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim()) {
        return Alert.alert("Novo Hábito", "Preencha o título do hábito");
      }
      if (weekDays.length === 0) {
        return Alert.alert(
          "Novo Hábito",
          "Selecione pelo menos um dia da semana"
        );
      }

      const newHabit = {
        title,
        weekDays,
      };

      await api.post("/habits", newHabit);

      setTitle("");
      setWeekDays([]);

      Alert.alert("Novo Hábito", "Hábito criado com sucesso");
    } catch (error) {
      console.error(error);
      Alert.alert("Novo Hábito", "Não foi possível criar o hábito");
    }
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      className="flex-1 bg-background px-8 pt-16"
    >
      <BackButton />

      <Text className="mt-6 text-white font-extrabold text-3xl">
        Criar Hábito
      </Text>

      <Text className="mt-6 text-white font-semibold text-base">
        Qual seu comprometimento?
      </Text>

      <TextInput
        placeholder="Exercícios, dormir bem, etc..."
        className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
        placeholderTextColor={colors.zinc[400]}
        value={title}
        onChangeText={setTitle}
      />

      <Text className="font-semibold mt-4 mb-3 text-white text-base">
        Qual a recorrência?
      </Text>
      {availableWeekDays.map((weekDay, index) => (
        <Checkbox
          key={weekDay}
          title={weekDay}
          isChecked={weekDays.includes(index)}
          onPress={() => handleToggleWeekDay(index)}
        />
      ))}

      <TouchableOpacity
        activeOpacity={0.7}
        className="w-full h-14 mt-6 flex-row items-center justify-center bg-green-600 rounded-lg"
        onPress={handleCreateNewHabit}
      >
        <Feather name="check" size={20} color={colors.white} />

        <Text className="font-semibold text-base text-white ml-2">
          Confirmar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
